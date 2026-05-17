'use client';

import { useState, useEffect } from 'react';
import { BookOpen, RefreshCw } from 'lucide-react';
import { PDFUpload } from './PDFUpload';
import type { KnowledgeSource } from '@/types/slides';

interface KnowledgeBaseProps {
  compact?: boolean;
}

export function KnowledgeBase({ compact = false }: KnowledgeBaseProps) {
  const [sources, setSources] = useState<KnowledgeSource[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSources = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/upload');
      if (res.ok) {
        const data = await res.json() as { sources: KnowledgeSource[] };
        setSources(data.sources ?? []);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSources(); }, []);

  const handleUploaded = (src: { sourceId: string; fileName: string; chunkCount: number }) => {
    setSources((prev) => [src, ...prev]);
  };

  const handleDelete = (sourceId: string) => {
    setSources((prev) => prev.filter((s) => s.sourceId !== sourceId));
  };

  if (compact) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <BookOpen size={14} style={{ color: 'var(--lime)' }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--white-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            База знаний
          </span>
          {sources.length > 0 && (
            <span className="badge badge-lime" style={{ marginLeft: 'auto' }}>{sources.length}</span>
          )}
        </div>
        {loading ? (
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--white-muted)' }}>Загрузка...</div>
        ) : sources.length === 0 ? (
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--white-muted)' }}>Нет источников</p>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {sources.map((src) => (
              <span key={src.sourceId} className="source-chip">
                📎 {src.fileName.replace('.pdf', '')}
              </span>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: 'var(--lime-dim)', border: '1px solid var(--border-lime)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <BookOpen size={18} style={{ color: 'var(--lime)' }} />
        </div>
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: 'var(--white)' }}>
            База знаний
          </h2>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--white-muted)' }}>
            {sources.length} источник{sources.length !== 1 ? 'а' : ''} · используется в чате
          </p>
        </div>
        <button onClick={fetchSources} className="btn-icon" style={{ marginLeft: 'auto' }}>
          <RefreshCw size={13} />
        </button>
      </div>

      <PDFUpload
        existingSources={sources}
        onUploaded={handleUploaded}
        onDelete={handleDelete}
      />
    </div>
  );
}
