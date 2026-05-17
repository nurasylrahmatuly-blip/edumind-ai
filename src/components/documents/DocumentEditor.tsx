'use client';

import { useCallback, useRef, useState } from 'react';
import { CheckCircle, Edit3, Eye } from 'lucide-react';
import type { DocumentContent, DocumentSection } from '@/types/documents';

interface DocumentEditorProps {
  documentId: string;
  content: DocumentContent;
  onContentChange: (content: DocumentContent) => void;
  activeSectionId?: string;
}

function wordCount(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

function SectionView({
  section,
  onEdit,
  isActive,
}: {
  section: DocumentSection;
  onEdit: (id: string, content: string) => void;
  isActive: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(section.content);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const handleBlur = () => {
    setEditing(false);
    onEdit(section.id, value);
  };

  const handleChange = (v: string) => {
    setValue(v);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => onEdit(section.id, v), 1500);
  };

  const HeadingTag = section.level === 1 ? 'h2' : section.level === 2 ? 'h3' : 'h4';
  const headingClass =
    section.level === 1
      ? 'text-lg font-bold text-white uppercase text-center tracking-wide'
      : section.level === 2
      ? 'text-base font-bold text-white'
      : 'text-sm font-semibold text-white';

  return (
    <div
      id={`section-${section.id}`}
      className={`group relative rounded-2xl border p-6 transition-all ${
        isActive ? 'border-[#F5A623]/30 bg-[#1C2133]' : 'border-white/5 bg-[#131620] hover:border-white/10'
      }`}
    >
      {/* Section header */}
      <div className="mb-4 flex items-center justify-between">
        <HeadingTag className={headingClass}>{section.title}</HeadingTag>
        <div className="flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
          <span className="text-[11px] text-[#6B7280]">
            {wordCount(section.content)} слов
          </span>
          <button
            onClick={() => setEditing(!editing)}
            className="flex h-6 w-6 items-center justify-center rounded-lg bg-white/5 text-[#6B7280] hover:bg-white/10 hover:text-white"
          >
            {editing ? <Eye className="h-3.5 w-3.5" /> : <Edit3 className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      {/* ГОСТ compliance indicator */}
      <div className="mb-4 flex items-center gap-1.5">
        <CheckCircle className="h-3 w-3 text-[#2DD4A0]" />
        <span className="text-[10px] text-[#2DD4A0]">ГОСТ 7.32-2017</span>
      </div>

      {/* Content */}
      {editing ? (
        <textarea
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={handleBlur}
          autoFocus
          className="min-h-[200px] w-full resize-y rounded-xl border border-white/10 bg-[#0D0F14] p-4 font-serif text-sm leading-relaxed text-[#E5E7EB] outline-none focus:border-[#F5A623]/40"
          style={{ fontFamily: 'Georgia, serif' }}
        />
      ) : (
        <div
          className="cursor-text text-sm leading-7 text-[#D1D5DB]"
          style={{ fontFamily: 'Georgia, serif', textAlign: 'justify' }}
          onClick={() => setEditing(true)}
        >
          {section.content.split('\n\n').map((para, i) => (
            <p key={i} className="mb-4 indent-8">
              {para.trim()}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

export function DocumentEditor({ documentId, content, onContentChange, activeSectionId }: DocumentEditorProps) {
  const [saving, setSaving] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout>>();

  const handleSectionEdit = useCallback(
    (sectionId: string, newContent: string) => {
      const updated: DocumentContent = {
        ...content,
        sections: content.sections.map((s) =>
          s.id === sectionId ? { ...s, content: newContent } : s
        ),
      };
      onContentChange(updated);

      clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(async () => {
        setSaving(true);
        try {
          await fetch(`/api/documents/${documentId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: updated }),
          });
        } finally {
          setSaving(false);
        }
      }, 1500);
    },
    [content, documentId, onContentChange]
  );

  return (
    <div className="space-y-4">
      {saving && (
        <div className="flex items-center gap-2 text-xs text-[#6B7280]">
          <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#F5A623]" />
          Сохраняется...
        </div>
      )}

      {content.sections.map((section) => (
        <SectionView
          key={section.id}
          section={section}
          onEdit={handleSectionEdit}
          isActive={section.id === activeSectionId}
        />
      ))}
    </div>
  );
}
