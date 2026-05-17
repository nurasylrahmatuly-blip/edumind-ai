'use client';

import { AlertTriangle } from 'lucide-react';

export default function DocumentsError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 20, textAlign: 'center', padding: 40 }}>
      <div style={{ width: 60, height: 60, borderRadius: 'var(--radius-xl)', background: 'rgba(251,113,133,0.1)', border: '1px solid rgba(251,113,133,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <AlertTriangle size={28} style={{ color: '#fb7185' }} />
      </div>
      <div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--white)', marginBottom: 8 }}>
          Ошибка загрузки документов
        </h2>
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: 14, color: 'var(--white-muted)', maxWidth: 360 }}>
          {error.message || 'Не удалось загрузить документы'}
        </p>
      </div>
      <button onClick={reset} className="btn-primary">
        Попробовать снова
      </button>
    </div>
  );
}
