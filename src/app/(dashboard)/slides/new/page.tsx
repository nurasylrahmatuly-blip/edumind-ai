'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Sparkles, Users, BookOpen, Briefcase } from 'lucide-react';
import { SlidePreview } from '@/components/slides/SlidePreview';
import type { Slide } from '@/types/slides';

const AUDIENCES = [
  { value: 'students', label: 'Студенты', icon: BookOpen },
  { value: 'professors', label: 'Профессора', icon: Users },
  { value: 'business', label: 'Бизнес', icon: Briefcase },
];

const STYLES = ['professional', 'academic', 'creative', 'minimalist'];

export default function NewSlidePage() {
  const router = useRouter();
  const [step, setStep] = useState<'form' | 'generating' | 'done'>('form');
  const [topic, setTopic] = useState('');
  const [slideCount, setSlideCount] = useState(10);
  const [audience, setAudience] = useState('students');
  const [style, setStyle] = useState('professional');
  const [generatingSlides, setGeneratingSlides] = useState<Slide[]>([]);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!topic.trim()) { setError('Введи тему презентации'); return; }
    setError('');
    setStep('generating');

    try {
      const res = await fetch('/api/slides/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, slideCount, style, audience }),
      });

      if (!res.ok) throw new Error('Generation failed');
      const data = await res.json() as { presentation: { id: string }; slides: Slide[] };
      setGeneratingSlides(data.slides);
      setStep('done');
      setTimeout(() => router.push(`/slides/${data.presentation.id}`), 1500);
    } catch {
      setError('Ошибка генерации. Попробуй снова.');
      setStep('form');
    }
  };

  if (step === 'generating' || step === 'done') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
        <div style={{ maxWidth: 680, width: '100%', textAlign: 'center' }}>
          <div style={{ width: 64, height: 64, borderRadius: 'var(--radius-xl)', background: 'var(--lime-dim)', border: '1px solid var(--border-lime)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', animation: step === 'generating' ? 'pulse-glow 2s ease-in-out infinite' : 'none' }}>
            <Sparkles size={28} style={{ color: 'var(--lime)' }} />
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, color: 'var(--white)', marginBottom: 8 }}>
            {step === 'generating' ? 'Создаём презентацию…' : 'Готово! Открываем редактор…'}
          </h2>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: 14, color: 'var(--white-dim)', marginBottom: 32 }}>
            {step === 'generating' ? `${slideCount} слайдов на тему "${topic}"` : `${generatingSlides.length} слайдов создано`}
          </p>

          {generatingSlides.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 8 }}>
              {generatingSlides.map((slide, i) => (
                <div key={slide.id} className="animate-fade-up" style={{ aspectRatio: '16/9', animationDelay: `${i * 0.05}s` }}>
                  <SlidePreview slide={slide} scale={0.35} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="page-header">
        <h1 className="page-title">Новая презентация</h1>
      </div>

      <div className="page-body" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>
        <div style={{ maxWidth: 560, width: '100%', display: 'flex', flexDirection: 'column', gap: 28 }}>

          {/* Topic */}
          <div>
            <label style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--white-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: 8 }}>
              Тема презентации *
            </label>
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Например: Машинное обучение в медицине"
              rows={3}
              style={{ width: '100%', background: 'var(--bg-raised)', border: `1px solid ${error ? '#fb7185' : 'var(--border-soft)'}`, borderRadius: 'var(--radius-lg)', padding: '12px 16px', fontFamily: 'var(--font-ui)', fontSize: 14, color: 'var(--white)', outline: 'none', resize: 'none', transition: 'border-color 0.15s' }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--border-lime)')}
              onBlur={(e) => (e.target.style.borderColor = error ? '#fb7185' : 'var(--border-soft)')}
            />
            {error && <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#fb7185', marginTop: 6 }}>{error}</p>}
          </div>

          {/* Slide count */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <label style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--white-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Количество слайдов
              </label>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--lime)' }}>{slideCount}</span>
            </div>
            <input
              type="range"
              min={5} max={20} value={slideCount}
              onChange={(e) => setSlideCount(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--lime)', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--white-muted)', marginTop: 4 }}>
              <span>5</span><span>20</span>
            </div>
          </div>

          {/* Audience */}
          <div>
            <label style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--white-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: 8 }}>
              Аудитория
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              {AUDIENCES.map((a) => {
                const Icon = a.icon;
                const isActive = audience === a.value;
                return (
                  <button
                    key={a.value}
                    onClick={() => setAudience(a.value)}
                    style={{ padding: '10px 12px', borderRadius: 'var(--radius-md)', border: `1px solid ${isActive ? 'var(--border-lime)' : 'var(--border-soft)'}`, background: isActive ? 'var(--lime-dim)' : 'var(--bg-raised)', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, transition: 'all 0.15s' }}
                  >
                    <Icon size={18} style={{ color: isActive ? 'var(--lime)' : 'var(--white-dim)' }} />
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: isActive ? 'var(--lime-text)' : 'var(--white-muted)' }}>{a.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Style */}
          <div>
            <label style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--white-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: 8 }}>
              Стиль
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {STYLES.map((s) => (
                <button
                  key={s}
                  onClick={() => setStyle(s)}
                  className={`badge ${style === s ? 'badge-lime' : ''}`}
                  style={{ cursor: 'pointer', padding: '6px 14px', border: `1px solid ${style === s ? 'var(--border-lime)' : 'var(--border-soft)'}`, background: style === s ? 'var(--lime-dim)' : 'transparent', color: style === s ? 'var(--lime-text)' : 'var(--white-muted)' }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Generate button */}
          <button onClick={handleGenerate} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px 24px' }}>
            <Sparkles size={15} /> Создать {slideCount} слайдов <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
