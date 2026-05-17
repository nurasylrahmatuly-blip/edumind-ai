'use client';

import { Hash } from 'lucide-react';
import type { DocumentSection } from '@/types/documents';

interface SectionOutlineProps {
  sections: DocumentSection[];
  activeId?: string;
  onSelect: (id: string) => void;
}

export function SectionOutline({ sections, activeId, onSelect }: SectionOutlineProps) {
  return (
    <nav className="space-y-0.5">
      <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-[#6B7280]">
        Содержание
      </p>
      {sections.map((section) => {
        const isActive = section.id === activeId;
        const indent = (section.level - 1) * 12;
        const wordCount = section.content?.split(/\s+/).filter(Boolean).length ?? 0;

        return (
          <button
            key={section.id}
            onClick={() => onSelect(section.id)}
            className={`group flex w-full items-start gap-2 rounded-lg px-2 py-1.5 text-left text-xs transition-colors ${
              isActive
                ? 'bg-[#F5A623]/10 text-[#F5A623]'
                : 'text-[#9CA3AF] hover:bg-white/5 hover:text-white'
            }`}
            style={{ paddingLeft: `${indent + 8}px` }}
          >
            {section.level === 1 && (
              <Hash className="mt-0.5 h-3 w-3 shrink-0 opacity-60" />
            )}
            <span className="flex-1 leading-snug">{section.title}</span>
            {wordCount > 0 && (
              <span className="shrink-0 text-[10px] opacity-50">{wordCount}</span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
