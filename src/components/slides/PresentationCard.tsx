'use client';

import Link from 'next/link';
import { Download, Trash2, Presentation } from 'lucide-react';
import { useState } from 'react';

interface PresentationCardProps {
  id: string;
  title: string;
  slideCount: number;
  createdAt: string;
  onDelete?: (id: string) => void;
}

export function PresentationCard({ id, title, slideCount, createdAt, onDelete }: PresentationCardProps) {
  const [exporting, setExporting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleExport = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setExporting(true);
    try {
      const res = await fetch('/api/slides/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ presentationId: id }),
      });
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title}.pptx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert('Ошибка экспорта');
    } finally {
      setExporting(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm(`Удалить "${title}"?`)) return;
    setDeleting(true);
    try {
      await fetch(`/api/presentations/${id}`, { method: 'DELETE' });
      onDelete?.(id);
    } finally {
      setDeleting(false);
    }
  };

  const date = new Date(createdAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });

  return (
    <Link href={`/slides/${id}`} style={{ textDecoration: 'none', display: 'block' }}>
      <div
        className="slide-card"
        style={{ aspectRatio: '16/9', display: 'flex', flexDirection: 'column' }}
      >
        {/* Thumbnail preview */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20, gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-lg)', background: 'var(--lime-dim)', border: '1px solid var(--border-lime)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Presentation size={22} style={{ color: 'var(--lime)' }} />
          </div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700, color: 'var(--white)', textAlign: 'center', lineHeight: 1.3 }}>
            {title}
          </h3>
        </div>

        {/* Slide number */}
        <div className="slide-number">{slideCount} слайдов</div>

        {/* Footer */}
        <div style={{ borderTop: '1px solid var(--border-dim)', padding: '8px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--white-muted)' }}>{date}</span>
          <div style={{ display: 'flex', gap: 4 }}>
            <button
              onClick={handleExport}
              className="btn-icon"
              style={{ width: 24, height: 24 }}
              title="Скачать PPTX"
              disabled={exporting}
            >
              {exporting ? (
                <span style={{ width: 10, height: 10, border: '1.5px solid var(--border-soft)', borderTopColor: 'var(--lime)', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
              ) : (
                <Download size={11} />
              )}
            </button>
            <button
              onClick={handleDelete}
              className="btn-icon"
              style={{ width: 24, height: 24 }}
              title="Удалить"
              disabled={deleting}
            >
              <Trash2 size={11} style={{ color: '#fb7185' }} />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
