'use client';

import { useState } from 'react';
import { Plus, Trash2, BookOpen, Loader2 } from 'lucide-react';
import type { Source } from '@/types/documents';

interface BibliographyPanelProps {
  sources: Source[];
  onUpdate: (sources: Source[]) => void;
  topic?: string;
}

function formatGost(source: Source): string {
  if (source.type === 'интернет') {
    return `${source.authors} ${source.title} [Электронный ресурс]. — URL: ${source.url ?? source.publisher}.`;
  }
  if (source.type === 'статья') {
    return `${source.authors} ${source.title} // ${source.publisher}. — ${source.year}. — С. ${source.pages ?? '1–5'}.`;
  }
  return `${source.authors} ${source.title}. — ${source.publisher}, ${source.year}. — ${source.pages ?? '200'} с.`;
}

export function BibliographyPanel({ sources, onUpdate, topic }: BibliographyPanelProps) {
  const [loading, setLoading] = useState(false);

  const handleAddSources = async () => {
    if (!topic) return;
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Сгенерируй 5 источников для библиографии по теме: "${topic}". Формат ГОСТ Р 7.0.5-2008. Включи книги, статьи и интернет-источники.`,
          agentOverride: 'RESEARCH',
        }),
      });

      if (res.ok && res.body) {
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let text = '';
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          text += decoder.decode(value, { stream: true });
        }
        // Parse numbered list from response and add as raw sources
        const lines = text.split('\n').filter((l) => /^\d+\./.test(l.trim()));
        const newSources: Source[] = lines.map((line, i) => ({
          number: sources.length + i + 1,
          authors: '',
          title: line.replace(/^\d+\.\s*/, '').trim(),
          publisher: '',
          year: new Date().getFullYear(),
          type: 'книга' as const,
        }));
        onUpdate([...sources, ...newSources]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (index: number) => {
    const updated = sources
      .filter((_, i) => i !== index)
      .map((s, i) => ({ ...s, number: i + 1 }));
    onUpdate(updated);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">Список литературы</h3>
        <span className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] text-[#9CA3AF]">
          {sources.length}
        </span>
      </div>

      {sources.length === 0 ? (
        <div className="rounded-xl border border-dashed border-white/10 py-6 text-center">
          <BookOpen className="mx-auto mb-2 h-6 w-6 text-[#6B7280]" />
          <p className="text-xs text-[#6B7280]">Источники не добавлены</p>
        </div>
      ) : (
        <div className="space-y-2">
          {sources.map((source, i) => (
            <div key={i} className="group flex gap-2 rounded-lg border border-white/5 bg-[#131620] p-3">
              <span className="shrink-0 text-xs font-mono text-[#6B7280]">{source.number}.</span>
              <p className="flex-1 text-xs leading-relaxed text-[#D1D5DB]">{formatGost(source)}</p>
              <button
                onClick={() => handleDelete(i)}
                className="shrink-0 opacity-0 text-[#6B7280] transition-opacity hover:text-red-400 group-hover:opacity-100"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {topic && (
        <button
          onClick={handleAddSources}
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 py-2 text-xs text-[#9CA3AF] transition-colors hover:border-white/20 hover:text-white disabled:opacity-60"
        >
          {loading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Plus className="h-3.5 w-3.5" />
          )}
          {loading ? 'Ищем источники...' : 'Добавить источники через AI'}
        </button>
      )}
    </div>
  );
}
