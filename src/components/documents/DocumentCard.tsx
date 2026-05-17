'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FileText, Trash2, ExternalLink, Clock, Hash } from 'lucide-react';
import { ExportButton } from './ExportButton';
import type { DocumentMeta } from '@/types/documents';

const TYPE_COLORS: Record<string, string> = {
  'реферат': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'курсовая': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'дипломная': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
};

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-500/20 text-gray-400',
  generating: 'bg-yellow-500/20 text-yellow-400',
  complete: 'bg-green-500/20 text-green-400',
  exported: 'bg-blue-500/20 text-blue-400',
};

const STATUS_LABELS: Record<string, string> = {
  draft: 'Черновик',
  generating: 'Генерируется',
  complete: 'Готов',
  exported: 'Экспортирован',
};

interface DocumentCardProps {
  document: DocumentMeta;
  onDelete: (id: string) => void;
}

export function DocumentCard({ document, onDelete }: DocumentCardProps) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Удалить документ?')) return;
    setDeleting(true);
    try {
      await fetch(`/api/documents/${document.id}`, { method: 'DELETE' });
      onDelete(document.id);
    } finally {
      setDeleting(false);
    }
  };

  const createdDate = new Date(document.createdAt).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const typeColor = TYPE_COLORS[document.type] ?? 'bg-gray-500/20 text-gray-400';
  const statusColor = STATUS_COLORS[document.status] ?? 'bg-gray-500/20 text-gray-400';

  return (
    <div className="group relative rounded-2xl border border-white/8 bg-[#131620] p-5 transition-all hover:border-white/16 hover:shadow-lg hover:shadow-black/20">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#1C2133]">
          <FileText className="h-5 w-5 text-[#F5A623]" />
        </div>
        <div className="flex flex-wrap gap-1.5">
          <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${typeColor}`}>
            {document.type}
          </span>
          <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${statusColor}`}>
            {STATUS_LABELS[document.status] ?? document.status}
          </span>
        </div>
      </div>

      {/* Title */}
      <h3 className="mt-3 line-clamp-2 text-sm font-semibold text-white leading-snug">
        {document.title}
      </h3>

      {/* Stats */}
      <div className="mt-3 flex items-center gap-4 text-[11px] text-[#6B7280]">
        <span className="flex items-center gap-1">
          <Hash className="h-3 w-3" />
          {document.wordCount.toLocaleString('ru-RU')} слов
        </span>
        <span className="flex items-center gap-1">
          <FileText className="h-3 w-3" />
          ~{document.pageCount} стр.
        </span>
        <span className="flex items-center gap-1 ml-auto">
          <Clock className="h-3 w-3" />
          {createdDate}
        </span>
      </div>

      {/* Actions */}
      <div className="mt-4 flex items-center gap-2">
        <Link
          href={`/documents/${document.id}`}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-white/5 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-white/10"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Открыть
        </Link>

        <ExportButton documentId={document.id} />

        <button
          onClick={handleDelete}
          disabled={deleting}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[#6B7280] transition-colors hover:bg-red-500/10 hover:text-red-400"
          title="Удалить"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
