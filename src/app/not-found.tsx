import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: '404 — Страница не найдена' };

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-void)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: 40,
    }}>
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: 120,
        fontWeight: 800,
        color: 'var(--lime)',
        lineHeight: 1,
        textShadow: '0 0 60px var(--lime-glow)',
        marginBottom: 24,
      }}>
        404
      </div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, color: 'var(--white)', marginBottom: 12 }}>
        Страница не найдена
      </h1>
      <p style={{ fontFamily: 'var(--font-ui)', fontSize: 16, color: 'var(--white-muted)', maxWidth: 400, lineHeight: 1.6, marginBottom: 32 }}>
        Похоже эта страница пропала в бескрайнем пространстве знаний
      </p>
      <Link href="/" className="btn-primary">
        Вернуться домой
      </Link>
    </div>
  );
}
