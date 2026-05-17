import { KnowledgeBase } from '@/components/upload/KnowledgeBase';
import { BookOpen } from 'lucide-react';

export default function KnowledgePage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <BookOpen size={18} style={{ color: 'var(--lime)' }} />
          <h1 className="page-title">База знаний</h1>
        </div>
        <span className="badge badge-lime">RAG</span>
      </div>

      <div className="page-body">
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          {/* Info */}
          <div style={{ marginBottom: 28, padding: '16px 20px', background: 'var(--bg-raised)', border: '1px solid var(--border-lime)', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <span style={{ fontSize: 20 }}>💡</span>
              <div>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 600, color: 'var(--white)', marginBottom: 4 }}>
                  Как работает RAG?
                </p>
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--white-dim)', lineHeight: 1.65 }}>
                  Загружай PDF учебники, статьи или конспекты. AI будет использовать их как контекст при ответах в чате — отвечая точнее и ссылаясь на твои материалы.
                </p>
              </div>
            </div>
          </div>

          <KnowledgeBase />
        </div>
      </div>
    </div>
  );
}
