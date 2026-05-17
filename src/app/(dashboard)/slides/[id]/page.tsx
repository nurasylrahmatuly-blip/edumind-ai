'use client';

import { useState, useEffect, useCallback, use } from 'react';
import { useRouter } from 'next/navigation';
import { Download, ArrowLeft, Plus, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { SlidePreview } from '@/components/slides/SlidePreview';
import { SlideEditor } from '@/components/slides/SlideEditor';
import type { PresentationData, Slide } from '@/types/slides';
import Link from 'next/link';

export default function SlidePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [presentation, setPresentation] = useState<PresentationData | null>(null);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [saveTimer, setSaveTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fetch(`/api/presentations/${id}`)
      .then((r) => r.json())
      .then((data: PresentationData) => {
        setPresentation(data);
        setSlides(data.slides ?? []);
      })
      .catch(() => router.push('/slides'))
      .finally(() => setLoading(false));
  }, [id, router]);

  const saveSlides = useCallback(async (updatedSlides: Slide[]) => {
    setSaving(true);
    try {
      await fetch(`/api/presentations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slides: updatedSlides }),
      });
    } finally {
      setSaving(false);
    }
  }, [id]);

  const handleSlideChange = useCallback((updated: Slide) => {
    const newSlides = slides.map((s) => s.id === updated.id ? updated : s);
    setSlides(newSlides);
    if (saveTimer) clearTimeout(saveTimer);
    setSaveTimer(setTimeout(() => saveSlides(newSlides), 1500));
  }, [slides, saveTimer, saveSlides]);

  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await fetch('/api/slides/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ presentationId: id }),
      });
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${presentation?.title ?? 'presentation'}.pptx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert('Ошибка экспорта');
    } finally {
      setExporting(false);
    }
  };

  const addSlide = () => {
    const newSlide: Slide = {
      id: `slide-${Date.now()}`,
      type: 'content',
      title: 'Новый слайд',
      bulletPoints: [],
      layout: 'left',
    };
    const newSlides = [...slides, newSlide];
    setSlides(newSlides);
    setSelectedIdx(newSlides.length - 1);
    saveSlides(newSlides);
  };

  const deleteSlide = (idx: number) => {
    if (slides.length <= 1) return;
    const newSlides = slides.filter((_, i) => i !== idx);
    setSlides(newSlides);
    setSelectedIdx(Math.min(selectedIdx, newSlides.length - 1));
    saveSlides(newSlides);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--white-muted)' }}>Загрузка…</div>
      </div>
    );
  }

  const currentSlide = slides[selectedIdx];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Topbar */}
      <div className="topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/slides" className="btn-icon">
            <ArrowLeft size={14} />
          </Link>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, color: 'var(--white)' }}>
              {presentation?.title}
            </h1>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--white-muted)' }}>
              {slides.length} слайдов{saving ? ' · Сохранение…' : ''}
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={addSlide} className="btn-ghost btn-sm">
            <Plus size={13} /> Слайд
          </button>
          <button
            onClick={handleExport}
            disabled={exporting}
            className="btn-primary btn-sm"
          >
            <Download size={13} />
            {exporting ? 'Экспорт…' : 'Скачать PPTX'}
          </button>
        </div>
      </div>

      {/* Main 3-panel layout */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* Left: Slide thumbnails */}
        <div style={{ width: 200, background: 'var(--bg-base)', borderRight: '1px solid var(--border-dim)', overflowY: 'auto', display: 'flex', flexDirection: 'column', padding: '10px 8px', gap: 6 }}>
          {slides.map((slide, i) => (
            <div key={slide.id} style={{ position: 'relative' }}>
              <button
                onClick={() => setSelectedIdx(i)}
                style={{ width: '100%', aspectRatio: '16/9', padding: 0, border: `1.5px solid ${i === selectedIdx ? 'var(--lime)' : 'var(--border-dim)'}`, borderRadius: 'var(--radius-md)', overflow: 'hidden', cursor: 'pointer', background: 'transparent', boxShadow: i === selectedIdx ? '0 0 0 2px var(--lime-dim)' : 'none', transition: 'all 0.15s' }}
              >
                <SlidePreview slide={slide} scale={0.28} isSelected={i === selectedIdx} />
              </button>
              <div style={{ position: 'absolute', top: 2, left: 4, fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--white-muted)' }}>
                {i + 1}
              </div>
              {slides.length > 1 && (
                <button
                  onClick={() => deleteSlide(i)}
                  style={{ position: 'absolute', top: 2, right: 2, width: 16, height: 16, borderRadius: 3, background: 'rgba(251,113,133,0.2)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0 }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = '0')}
                >
                  <Trash2 size={9} style={{ color: '#fb7185' }} />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Center: Preview */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--bg-surface)' }}>
          {/* Navigation */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '10px 16px', borderBottom: '1px solid var(--border-dim)' }}>
            <button
              onClick={() => setSelectedIdx(Math.max(0, selectedIdx - 1))}
              className="btn-icon"
              disabled={selectedIdx === 0}
            >
              <ChevronLeft size={14} />
            </button>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--white-muted)' }}>
              {selectedIdx + 1} / {slides.length}
            </span>
            <button
              onClick={() => setSelectedIdx(Math.min(slides.length - 1, selectedIdx + 1))}
              className="btn-icon"
              disabled={selectedIdx === slides.length - 1}
            >
              <ChevronRight size={14} />
            </button>
          </div>

          {/* Large preview */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
            {currentSlide && (
              <div style={{ width: '100%', maxWidth: 760, aspectRatio: '16/9', boxShadow: '0 0 0 1px var(--border-soft), 0 16px 48px rgba(0,0,0,0.4)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                <SlidePreview slide={currentSlide} scale={0.75} isSelected />
              </div>
            )}
          </div>

          {/* Speaker notes */}
          {currentSlide?.speakerNotes && (
            <div style={{ padding: '12px 24px', borderTop: '1px solid var(--border-dim)', background: 'var(--bg-base)' }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--lime-text)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>
                Заметки докладчика
              </p>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--white-dim)', lineHeight: 1.6 }}>
                {currentSlide.speakerNotes}
              </p>
            </div>
          )}
        </div>

        {/* Right: Editor */}
        <div style={{ width: 300, background: 'var(--bg-base)', borderLeft: '1px solid var(--border-dim)', overflowY: 'auto' }}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border-dim)' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--white-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Редактор слайда
            </p>
          </div>
          {currentSlide && (
            <SlideEditor slide={currentSlide} onChange={handleSlideChange} />
          )}
        </div>
      </div>
    </div>
  );
}
