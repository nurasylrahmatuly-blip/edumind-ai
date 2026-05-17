'use client';

import { useRouter } from 'next/navigation';
import { locales, type Locale } from '@/i18n/index';

const labels: Record<Locale, string> = { ru: 'RU', en: 'EN', kz: 'KZ' };

interface Props {
  current?: Locale;
}

export function LanguageSwitcher({ current = 'ru' }: Props) {
  const router = useRouter();

  function switchLocale(locale: Locale) {
    document.cookie = `locale=${locale};path=/;max-age=31536000`;
    router.refresh();
  }

  return (
    <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
      {locales.map((l) => (
        <button
          key={l}
          onClick={() => switchLocale(l)}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            fontWeight: 600,
            padding: '3px 9px',
            borderRadius: 'var(--radius-pill)',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.15s',
            background: l === current ? 'var(--lime)' : 'transparent',
            color: l === current ? '#070809' : 'var(--white-muted)',
            letterSpacing: '0.05em',
          }}
        >
          {labels[l]}
        </button>
      ))}
    </div>
  );
}
