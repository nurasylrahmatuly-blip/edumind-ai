'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Hash, FileText } from 'lucide-react';
import { DocumentEditor } from '@/components/documents/DocumentEditor';
import { SectionOutline } from '@/components/documents/SectionOutline';
import { BibliographyPanel } from '@/components/documents/BibliographyPanel';
import { FormatChecker } from '@/components/documents/FormatChecker';
import { ExportButton } from '@/components/documents/ExportButton';
import type { DocumentContent, DocumentMeta } from '@/types/documents';

interface DocumentPageClientProps {
  document: DocumentMeta & { content: DocumentContent };
}

export function DocumentPageClient({ document: docData }: DocumentPageClientProps) {
  const [title, setTitle] = useState(docData.title);
  const [content, setContent] = useState<DocumentContent>(docData.content);
  const [activeSectionId, setActiveSectionId] = useState<string | undefined>(
    docData.content.sections[0]?.id
  );
  const [savingTitle, setSavingTitle] = useState(false);

  const totalWords = content.sections.reduce(
    (acc, s) => acc + s.content.split(/\s+/).filter(Boolean).length,
    0
  );
  const pageCount = Math.ceil(totalWords / 250);

  const handleTitleBlur = async () => {
    if (title === docData.title) return;
    setSavingTitle(true);
    try {
      await fetch(`/api/documents/${docData.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      });
    } finally {
      setSavingTitle(false);
    }
  };

  const handleSectionSelect = (id: string) => {
    setActiveSectionId(id);
    const el = window.document.getElementById(`section-${id}`);
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const fullText = content.sections.map((s) => s.content).join('\n\n');

  return (
    <div className="flex h-full flex-col">
      {/* Top bar */}
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-border px-6">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Link
            href="/documents"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 text-[#6B7280] transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleTitleBlur}
            className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-white outline-none placeholder-[#4B5563]"
            placeholder="Название документа"
          />
          {savingTitle && (
            <div className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-[#F5A623]" />
          )}
        </div>

        <div className="flex items-center gap-4 ml-4">
          <div className="hidden items-center gap-3 text-xs text-[#6B7280] sm:flex">
            <span className="flex items-center gap-1">
              <Hash className="h-3 w-3" />
              {totalWords.toLocaleString('ru-RU')} слов
            </span>
            <span className="flex items-center gap-1">
              <FileText className="h-3 w-3" />
              ~{pageCount} стр.
            </span>
          </div>
          <ExportButton documentId={docData.id} variant="full" />
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left panel: outline */}
        <div className="hidden w-56 shrink-0 overflow-y-auto border-r border-border px-4 py-5 lg:block">
          <SectionOutline
            sections={content.sections}
            activeId={activeSectionId}
            onSelect={handleSectionSelect}
          />
        </div>

        {/* Main editor */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="mx-auto max-w-3xl">
            <DocumentEditor
              documentId={docData.id}
              content={content}
              onContentChange={setContent}
              activeSectionId={activeSectionId}
            />
          </div>
        </div>

        {/* Right panel: tools */}
        <div className="hidden w-72 shrink-0 overflow-y-auto border-l border-border px-5 py-5 xl:block space-y-6">
          <div className="rounded-2xl border border-white/8 bg-[#131620] p-4">
            <FormatChecker content={fullText} />
          </div>

          <div className="rounded-2xl border border-white/8 bg-[#131620] p-4">
            <BibliographyPanel
              sources={content.bibliography}
              topic={content.titlePage.topic}
              onUpdate={(bibliography) => setContent({ ...content, bibliography })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
