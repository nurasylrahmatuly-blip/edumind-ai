'use client';

import { useState } from 'react';
import { Download, CheckCircle } from 'lucide-react';

interface ExportButtonProps {
  documentId: string;
  variant?: 'icon' | 'full';
}

export function ExportButton({ documentId, variant = 'icon' }: ExportButtonProps) {
  const [state, setState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');

  const handleExport = async () => {
    setState('loading');
    try {
      const res = await fetch('/api/documents/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId, format: 'docx', includeTableOfContents: true, includeTitlePage: true }),
      });

      if (!res.ok) throw new Error('Export failed');

      const blob = await res.blob();
      const contentDisposition = res.headers.get('Content-Disposition') ?? '';
      const match = /filename="([^"]+)"/.exec(contentDisposition);
      const filename = match?.[1] ?? 'document.docx';

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);

      setState('done');
      setTimeout(() => setState('idle'), 3000);
    } catch {
      setState('error');
      setTimeout(() => setState('idle'), 3000);
    }
  };

  if (variant === 'full') {
    return (
      <button
        onClick={handleExport}
        disabled={state === 'loading'}
        className="flex items-center gap-2 rounded-xl border border-[#F5A623]/30 bg-[#F5A623]/10 px-4 py-2 text-sm font-medium text-[#F5A623] transition-all hover:bg-[#F5A623]/20 disabled:opacity-60"
      >
        {state === 'loading' ? (
          <>
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#F5A623]/30 border-t-[#F5A623]" />
            Генерируем DOCX...
          </>
        ) : state === 'done' ? (
          <>
            <CheckCircle className="h-4 w-4" />
            Скачано!
          </>
        ) : (
          <>
            <Download className="h-4 w-4" />
            Экспорт DOCX
            <span className="rounded border border-[#F5A623]/40 px-1 py-0.5 text-[10px]">ГОСТ</span>
          </>
        )}
      </button>
    );
  }

  return (
    <button
      onClick={handleExport}
      disabled={state === 'loading'}
      title="Экспорт DOCX (ГОСТ)"
      className="flex h-7 items-center gap-1 rounded-lg bg-[#F5A623]/10 px-2 text-[11px] font-medium text-[#F5A623] transition-colors hover:bg-[#F5A623]/20 disabled:opacity-60"
    >
      {state === 'loading' ? (
        <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#F5A623]/30 border-t-[#F5A623]" />
      ) : (
        <Download className="h-3.5 w-3.5" />
      )}
      DOCX
    </button>
  );
}
