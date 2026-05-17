'use client';

import { Menu, X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onToggle: () => void;
  userName?: string | null;
  userEmail?: string | null;
}

function getInitials(name?: string | null, email?: string | null): string {
  if (name) return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  return (email?.[0] ?? '?').toUpperCase();
}

export function MobileHeader({ isOpen, onToggle, userName, userEmail }: Props) {
  return (
    <header
      style={{
        height: 52,
        background: 'var(--bg-base)',
        borderBottom: '1px solid var(--border-dim)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        flexShrink: 0,
        zIndex: 51,
      }}
      className="mobile-header"
    >
      <button
        onClick={onToggle}
        className="btn-icon"
        style={{ width: 36, height: 36, minHeight: 36 }}
        aria-label={isOpen ? 'Закрыть меню' : 'Открыть меню'}
      >
        {isOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div className="logo-icon" style={{ width: 26, height: 26, fontSize: 13 }}>E</div>
        <span className="logo-text" style={{ fontSize: 14 }}>
          Edu<span className="accent">Mind</span>
        </span>
      </div>

      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          background: 'var(--lime-dim)',
          border: '1px solid var(--border-lime)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'var(--font-display)',
          fontSize: 11,
          fontWeight: 700,
          color: 'var(--lime-text)',
          flexShrink: 0,
        }}
      >
        {getInitials(userName, userEmail)}
      </div>
    </header>
  );
}
