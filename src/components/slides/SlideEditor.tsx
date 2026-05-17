'use client';

import { useEffect, useState, useCallback } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { Slide, SlideType, SlideLayout } from '@/types/slides';

interface SlideEditorProps {
  slide: Slide;
  onChange: (updated: Slide) => void;
}

const SLIDE_TYPES: SlideType[] = ['title', 'content', 'split', 'quote', 'data', 'closing'];
const LAYOUTS: SlideLayout[] = ['centered', 'left', 'split'];

export function SlideEditor({ slide, onChange }: SlideEditorProps) {
  const [local, setLocal] = useState<Slide>(slide);

  useEffect(() => { setLocal(slide); }, [slide]);

  const update = useCallback((patch: Partial<Slide>) => {
    const updated = { ...local, ...patch };
    setLocal(updated);
    onChange(updated);
  }, [local, onChange]);

  const updateBullet = (i: number, value: string) => {
    const bp = [...(local.bulletPoints ?? [])];
    bp[i] = value;
    update({ bulletPoints: bp });
  };

  const addBullet = () => {
    update({ bulletPoints: [...(local.bulletPoints ?? []), ''] });
  };

  const removeBullet = (i: number) => {
    const bp = [...(local.bulletPoints ?? [])];
    bp.splice(i, 1);
    update({ bulletPoints: bp });
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', background: 'var(--bg-hover)', border: '1px solid var(--border-soft)',
    borderRadius: 'var(--radius-md)', padding: '8px 12px',
    fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--white)', outline: 'none',
    transition: 'border-color 0.15s',
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--white-muted)',
    textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6, display: 'block',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18, padding: '20px 16px' }}>
      {/* Type + Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <label style={labelStyle}>Тип</label>
          <select
            value={local.type}
            onChange={(e) => update({ type: e.target.value as SlideType })}
            style={{ ...inputStyle, cursor: 'pointer' }}
          >
            {SLIDE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Макет</label>
          <select
            value={local.layout}
            onChange={(e) => update({ layout: e.target.value as SlideLayout })}
            style={{ ...inputStyle, cursor: 'pointer' }}
          >
            {LAYOUTS.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
      </div>

      {/* Title */}
      <div>
        <label style={labelStyle}>Заголовок *</label>
        <input
          value={local.title}
          onChange={(e) => update({ title: e.target.value })}
          style={inputStyle}
          placeholder="Заголовок слайда"
        />
      </div>

      {/* Subtitle */}
      <div>
        <label style={labelStyle}>Подзаголовок</label>
        <input
          value={local.subtitle ?? ''}
          onChange={(e) => update({ subtitle: e.target.value || undefined })}
          style={inputStyle}
          placeholder="Подзаголовок (опционально)"
        />
      </div>

      {/* Content */}
      <div>
        <label style={labelStyle}>Основной текст</label>
        <textarea
          value={local.content ?? ''}
          onChange={(e) => update({ content: e.target.value || undefined })}
          style={{ ...inputStyle, resize: 'vertical', minHeight: 72 }}
          placeholder="Основной текст слайда"
          rows={3}
        />
      </div>

      {/* Bullet Points */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <label style={{ ...labelStyle, marginBottom: 0 }}>Тезисы</label>
          <button onClick={addBullet} className="btn-icon" style={{ width: 24, height: 24 }}>
            <Plus size={12} />
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {(local.bulletPoints ?? []).map((bp, i) => (
            <div key={i} style={{ display: 'flex', gap: 6 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--lime)', marginTop: 10, flexShrink: 0 }} />
              <input
                value={bp}
                onChange={(e) => updateBullet(i, e.target.value)}
                style={{ ...inputStyle, flex: 1 }}
                placeholder={`Тезис ${i + 1}`}
              />
              <button onClick={() => removeBullet(i)} className="btn-icon" style={{ width: 28, height: 28, flexShrink: 0 }}>
                <Trash2 size={11} style={{ color: '#fb7185' }} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Speaker Notes */}
      <div>
        <label style={labelStyle}>Заметки докладчика</label>
        <textarea
          value={local.speakerNotes ?? ''}
          onChange={(e) => update({ speakerNotes: e.target.value || undefined })}
          style={{ ...inputStyle, resize: 'vertical', minHeight: 80 }}
          placeholder="Что сказать на этом слайде..."
          rows={3}
        />
      </div>
    </div>
  );
}
