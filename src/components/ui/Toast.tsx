'use client';

import { createContext, useCallback, useContext, useState, useEffect } from 'react';
import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const typeStyles: Record<ToastType, { border: string; icon: React.ReactNode }> = {
  success: {
    border: 'rgba(184,247,39,0.3)',
    icon: <CheckCircle2 size={15} style={{ color: 'var(--lime)', flexShrink: 0 }} />,
  },
  error: {
    border: 'rgba(251,113,133,0.3)',
    icon: <AlertCircle size={15} style={{ color: '#fb7185', flexShrink: 0 }} />,
  },
  info: {
    border: 'rgba(56,189,248,0.3)',
    icon: <Info size={15} style={{ color: '#38bdf8', flexShrink: 0 }} />,
  },
};

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), 3000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const style = typeStyles[toast.type];

  return (
    <div
      style={{
        background: 'var(--bg-raised)',
        border: `1px solid ${style.border}`,
        borderRadius: 'var(--radius-md)',
        padding: '10px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        animation: 'slideInRight 0.2s ease',
        minWidth: 240,
        maxWidth: 360,
      }}
    >
      {style.icon}
      <span style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--white)', flex: 1, lineHeight: 1.4 }}>
        {toast.message}
      </span>
      <button
        onClick={() => onDismiss(toast.id)}
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--white-muted)', padding: 2, display: 'flex', alignItems: 'center' }}
      >
        <X size={13} />
      </button>
    </div>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev.slice(-4), { id, message, type }]);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div
        style={{
          position: 'fixed',
          top: 20,
          right: 20,
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}
      >
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside ToastProvider');
  return ctx;
}
