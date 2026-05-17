'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Presentation } from 'lucide-react';
import { PresentationCard } from '@/components/slides/PresentationCard';
import type { PresentationData } from '@/types/slides';

export function SlidesClientPage() {
  const [presentations, setPresentations] = useState<PresentationData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/presentations')
      .then((r) => r.json())
      .then((data: PresentationData[]) => setPresentations(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = (id: string) => {
    setPresentations((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Presentation size={18} style={{ color: 'var(--lime)' }} />
          <h1 className="page-title">Презентации</h1>
          {!loading && (
            <span className="badge badge-lime">{presentations.length}</span>
          )}
        </div>
        <Link href="/slides/new" className="btn-primary btn-sm">
          <Plus size={13} /> Создать
        </Link>
      </div>

      <div className="page-body">
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton" style={{ aspectRatio: '16/9', borderRadius: 'var(--radius-lg)' }} />
            ))}
          </div>
        ) : presentations.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60%', gap: 20, textAlign: 'center' }}>
            <div style={{ width: 72, height: 72, borderRadius: 'var(--radius-xl)', background: 'var(--lime-dim)', border: '1px solid var(--border-lime)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>
              🎨
            </div>
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: 'var(--white)', marginBottom: 8 }}>
                Создай первую презентацию
              </h2>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: 14, color: 'var(--white-dim)', maxWidth: 380 }}>
                AI создаст профессиональные слайды за секунды. Задай тему и количество слайдов.
              </p>
            </div>
            <Link href="/slides/new" className="btn-primary">
              <Plus size={14} /> Создать презентацию
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
            {presentations.map((p) => (
              <PresentationCard
                key={p.id}
                id={p.id}
                title={p.title}
                slideCount={p.slideCount}
                createdAt={p.createdAt}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
