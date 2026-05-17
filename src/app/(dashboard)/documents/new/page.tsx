'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, FileText, BookOpen, GraduationCap } from 'lucide-react';
import { GenerationProgress } from '@/components/documents/GenerationProgress';
import type { DocumentContent, DocumentSection, DocumentType } from '@/types/documents';

const DOC_TYPES: { type: DocumentType; label: string; desc: string; pages: string; icon: React.ReactNode }[] = [
  {
    type: 'реферат',
    label: 'Реферат',
    desc: 'Обзорная работа по теме, анализ литературных источников',
    pages: '10–15 страниц',
    icon: <FileText className="h-6 w-6" />,
  },
  {
    type: 'курсовая',
    label: 'Курсовая работа',
    desc: 'Самостоятельное исследование с анализом и практической частью',
    pages: '25–40 страниц',
    icon: <BookOpen className="h-6 w-6" />,
  },
  {
    type: 'дипломная',
    label: 'Дипломная работа',
    desc: 'Комплексное оригинальное исследование с методологией',
    pages: '60–100 страниц',
    icon: <GraduationCap className="h-6 w-6" />,
  },
];

const DEFAULT_PAGES: Record<DocumentType, number> = {
  'реферат': 12,
  'курсовая': 30,
  'дипломная': 70,
};

function parseSectionsFromRaw(raw: string, topic: string, type: DocumentType, specialty: string, university?: string): DocumentContent {
  const sections: DocumentSection[] = [];
  const parts = raw.split('<<SECTION:');

  for (const part of parts.slice(1)) {
    const colonIdx = part.indexOf(':');
    const closeIdx = part.indexOf('>>');
    if (colonIdx === -1 || closeIdx === -1) continue;

    const level = (parseInt(part.slice(0, colonIdx)) || 1) as 1 | 2 | 3;
    const title = part.slice(colonIdx + 1, closeIdx).trim();
    const endIdx = part.indexOf('<<END_SECTION>>');
    const content = (endIdx !== -1 ? part.slice(closeIdx + 2, endIdx) : part.slice(closeIdx + 2)).trim();

    sections.push({
      id: `section-${sections.length}`,
      title,
      content,
      level: Math.min(level, 3) as 1 | 2 | 3,
    });
  }

  return {
    titlePage: {
      university: university ?? '',
      specialty,
      topic,
      year: new Date().getFullYear(),
      city: 'Москва',
    },
    sections,
    bibliography: [],
  };
}

export default function NewDocumentPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedType, setSelectedType] = useState<DocumentType>('курсовая');
  const [topic, setTopic] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [university, setUniversity] = useState('');
  const [pages, setPages] = useState(30);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleTypeSelect = (type: DocumentType) => {
    setSelectedType(type);
    setPages(DEFAULT_PAGES[type]);
  };

  const handleGenerated = async (rawContent: string) => {
    setSaving(true);
    try {
      const content = parseSectionsFromRaw(rawContent, topic, selectedType, specialty, university);
      const title = `${selectedType.charAt(0).toUpperCase() + selectedType.slice(1)}: ${topic}`;

      const res = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, type: selectedType, content, agentUsed: 'writer' }),
      });

      if (!res.ok) throw new Error('Failed to save');
      const doc = await res.json() as { id: string };
      router.push(`/documents/${doc.id}`);
    } catch {
      setError('Не удалось сохранить документ. Попробуйте снова.');
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-border px-8 py-5">
        <div className="flex items-center gap-3">
          <button
            onClick={() => step > 1 ? setStep((s) => (s - 1) as 1 | 2 | 3) : router.push('/documents')}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 text-[#6B7280] transition-colors hover:border-white/20 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-white">Создать документ</h1>
            <p className="text-xs text-[#6B7280]">Шаг {step} из 3</p>
          </div>
        </div>

        {/* Step indicators */}
        <div className="mt-5 flex gap-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                s <= step ? 'bg-[#F5A623]' : 'bg-white/10'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-8 py-8">
        {/* Step 1: Choose type */}
        {step === 1 && (
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="text-center mb-8">
              <h2 className="text-xl font-bold text-white">Выберите тип работы</h2>
              <p className="mt-1 text-sm text-[#6B7280]">AI создаст работу в соответствии с ГОСТ 7.32-2017</p>
            </div>

            {DOC_TYPES.map((dt) => (
              <button
                key={dt.type}
                onClick={() => handleTypeSelect(dt.type)}
                className={`w-full flex items-start gap-4 rounded-2xl border p-5 text-left transition-all ${
                  selectedType === dt.type
                    ? 'border-[#F5A623]/50 bg-[#F5A623]/5'
                    : 'border-white/8 bg-[#131620] hover:border-white/16'
                }`}
              >
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                  selectedType === dt.type ? 'bg-[#F5A623]/20 text-[#F5A623]' : 'bg-white/5 text-[#6B7280]'
                }`}>
                  {dt.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-white">{dt.label}</p>
                    <span className="text-xs text-[#6B7280]">{dt.pages}</span>
                  </div>
                  <p className="mt-1 text-sm text-[#6B7280]">{dt.desc}</p>
                </div>
              </button>
            ))}

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setStep(2)}
                className="flex items-center gap-2 rounded-xl bg-[#F5A623] px-6 py-2.5 text-sm font-semibold text-[#0D0F14] transition-opacity hover:opacity-90"
              >
                Далее <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Details */}
        {step === 2 && (
          <div className="max-w-xl mx-auto space-y-5">
            <div className="text-center mb-8">
              <h2 className="text-xl font-bold text-white">Параметры работы</h2>
              <p className="mt-1 text-sm text-[#6B7280]">Укажите тему и детали для генерации</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5">
                Тема работы <span className="text-red-400">*</span>
              </label>
              <input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Например: Влияние социальных сетей на молодёжь"
                className="w-full rounded-xl border border-white/10 bg-[#131620] px-4 py-3 text-sm text-white placeholder-[#4B5563] outline-none focus:border-[#F5A623]/40 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5">
                Специальность / Дисциплина <span className="text-red-400">*</span>
              </label>
              <input
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                placeholder="Например: Социология, Психология, Информатика"
                className="w-full rounded-xl border border-white/10 bg-[#131620] px-4 py-3 text-sm text-white placeholder-[#4B5563] outline-none focus:border-[#F5A623]/40 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5">
                Название вуза (необязательно)
              </label>
              <input
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                placeholder="Например: МГУ имени М.В. Ломоносова"
                className="w-full rounded-xl border border-white/10 bg-[#131620] px-4 py-3 text-sm text-white placeholder-[#4B5563] outline-none focus:border-[#F5A623]/40 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5">
                Объём (страниц): {pages}
              </label>
              <input
                type="range"
                min={selectedType === 'реферат' ? 8 : selectedType === 'курсовая' ? 20 : 50}
                max={selectedType === 'реферат' ? 20 : selectedType === 'курсовая' ? 50 : 120}
                value={pages}
                onChange={(e) => setPages(parseInt(e.target.value))}
                className="w-full accent-[#F5A623]"
              />
              <div className="flex justify-between text-[11px] text-[#6B7280] mt-1">
                <span>{selectedType === 'реферат' ? '8' : selectedType === 'курсовая' ? '20' : '50'}</span>
                <span>{selectedType === 'реферат' ? '20' : selectedType === 'курсовая' ? '50' : '120'}</span>
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <button
                onClick={() => setStep(1)}
                className="flex items-center gap-2 rounded-xl border border-white/10 px-5 py-2.5 text-sm text-[#9CA3AF] transition-colors hover:border-white/20 hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" /> Назад
              </button>
              <button
                onClick={() => {
                  if (!topic.trim() || !specialty.trim()) {
                    setError('Заполните тему и специальность');
                    return;
                  }
                  setError('');
                  setStep(3);
                }}
                className="flex items-center gap-2 rounded-xl bg-[#F5A623] px-6 py-2.5 text-sm font-semibold text-[#0D0F14] transition-opacity hover:opacity-90"
              >
                Генерировать <ArrowRight className="h-4 w-4" />
              </button>
            </div>
            {error && <p className="text-xs text-red-400 text-center">{error}</p>}
          </div>
        )}

        {/* Step 3: Generate */}
        {step === 3 && (
          <div className="max-w-2xl mx-auto">
            {saving ? (
              <div className="text-center py-12">
                <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-white/10 border-t-[#F5A623]" />
                <p className="text-white font-medium">Сохраняем документ...</p>
              </div>
            ) : (
              <GenerationProgress
                topic={topic}
                type={selectedType}
                specialty={specialty}
                pages={pages}
                university={university || undefined}
                onComplete={handleGenerated}
                onError={(e) => setError(e)}
              />
            )}
            {error && <p className="mt-4 text-xs text-red-400 text-center">{error}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
