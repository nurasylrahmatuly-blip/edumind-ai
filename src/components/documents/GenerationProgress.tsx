'use client';

import { useEffect, useRef, useState } from 'react';
import { CheckCircle, Loader2 } from 'lucide-react';

interface Section {
  title: string;
  content: string;
  level: number;
  complete: boolean;
}

interface GenerationProgressProps {
  topic: string;
  type: string;
  specialty: string;
  pages: number;
  university?: string;
  onComplete: (rawContent: string) => void;
  onError: (err: string) => void;
}


function parseSections(raw: string): Section[] {
  const sections: Section[] = [];
  const matches = Array.from(raw.matchAll(/<<SECTION:(\d+):([^>]+)>>([\s\S]*?)(?=<<(?:SECTION|END_SECTION)>|$)/g));
  for (const m of matches) {
    sections.push({
      level: parseInt(m[1]) || 1,
      title: m[2].trim(),
      content: m[3].trim(),
      complete: raw.includes(`<<END_SECTION>>`),
    });
  }
  // Simple fallback parser
  if (sections.length === 0) {
    const parts = raw.split('<<SECTION:');
    for (const part of parts.slice(1)) {
      const colonIdx = part.indexOf(':');
      const closeIdx = part.indexOf('>>');
      if (colonIdx === -1 || closeIdx === -1) continue;
      const level = parseInt(part.slice(0, colonIdx)) || 1;
      const title = part.slice(colonIdx + 1, closeIdx).trim();
      const endIdx = part.indexOf('<<END_SECTION>>');
      const content = endIdx !== -1 ? part.slice(closeIdx + 2, endIdx).trim() : part.slice(closeIdx + 2).trim();
      sections.push({ level, title, content, complete: endIdx !== -1 });
    }
  }
  return sections;
}

export function GenerationProgress({
  topic,
  type,
  specialty,
  pages,
  university,
  onComplete,
  onError,
}: GenerationProgressProps) {
  const [sections, setSections] = useState<Section[]>([]);
  const [streamText, setStreamText] = useState('');
  const [done, setDone] = useState(false);
  const [progress, setProgress] = useState(0);
  const rawRef = useRef('');

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        const res = await fetch('/api/writer/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ topic, type, specialty, pages, university }),
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        if (!res.body) throw new Error('No stream body');

        const reader = res.body.getReader();
        const decoder = new TextDecoder();

        while (!cancelled) {
          const { done: streamDone, value } = await reader.read();
          if (streamDone) break;
          const chunk = decoder.decode(value, { stream: true });
          rawRef.current += chunk;
          setStreamText(rawRef.current);

          const parsed = parseSections(rawRef.current);
          setSections(parsed);
          // estimate progress by completed sections
          setProgress(Math.min(Math.round((parsed.length / 7) * 90), 90));
        }

        if (!cancelled) {
          setProgress(100);
          setDone(true);
          onComplete(rawRef.current);
        }
      } catch (err) {
        if (!cancelled) onError(err instanceof Error ? err.message : 'Generation failed');
      }
    }

    run();
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col gap-6">
      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-white">
            {done ? 'Документ готов!' : 'Генерируем документ...'}
          </span>
          <span className="text-[#F5A623] font-mono">{progress}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#F5A623] to-[#F59E0B] transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Topic info */}
      <div className="rounded-xl border border-white/8 bg-[#131620] p-4 text-sm">
        <p className="text-[#6B7280]">Тема:</p>
        <p className="mt-0.5 font-medium text-white">{topic}</p>
        <div className="mt-2 flex gap-4 text-[11px] text-[#6B7280]">
          <span>{type}</span>
          <span>·</span>
          <span>{specialty}</span>
          <span>·</span>
          <span>~{pages} стр.</span>
        </div>
      </div>

      {/* Sections list */}
      {sections.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wider text-[#6B7280]">
            Разделы ({sections.length})
          </p>
          {sections.map((section, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-lg border border-white/5 bg-[#131620] px-3 py-2"
              style={{ paddingLeft: `${(section.level - 1) * 16 + 12}px` }}
            >
              {section.complete ? (
                <CheckCircle className="h-4 w-4 shrink-0 text-[#2DD4A0]" />
              ) : (
                <Loader2 className="h-4 w-4 shrink-0 animate-spin text-[#F5A623]" />
              )}
              <span className="text-sm text-white truncate">{section.title}</span>
              {section.content && (
                <span className="ml-auto shrink-0 text-[11px] text-[#6B7280]">
                  {section.content.split(/\s+/).filter(Boolean).length} сл.
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Live preview of last 200 chars */}
      {!done && streamText.length > 0 && (
        <div className="rounded-xl border border-white/5 bg-[#0D0F14] p-4">
          <p className="mb-2 text-[10px] uppercase tracking-wider text-[#6B7280]">Генерируется...</p>
          <p className="font-mono text-xs leading-relaxed text-[#9CA3AF] whitespace-pre-wrap break-all">
            {streamText.slice(-300)}
            <span className="inline-block h-3 w-0.5 animate-pulse bg-[#F5A623] align-middle ml-0.5" />
          </p>
        </div>
      )}
    </div>
  );
}
