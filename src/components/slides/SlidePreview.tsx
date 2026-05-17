'use client';

import type { Slide } from '@/types/slides';

interface SlidePreviewProps {
  slide: Slide;
  scale?: number;
  isSelected?: boolean;
}

export function SlidePreview({ slide, scale = 1 }: SlidePreviewProps) {
  const baseStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    background: '#0a0c0e',
    borderRadius: scale < 0.5 ? 4 : 8,
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'Inter, sans-serif',
  };

  const scaleFont = (size: number) => `${size * scale}px`;

  const limeBar = (
    <div style={{ height: scale < 0.5 ? 2 : 3, background: 'var(--lime)', flexShrink: 0 }} />
  );

  if (slide.type === 'title' || slide.layout === 'centered') {
    return (
      <div style={baseStyle}>
        {limeBar}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: `${24 * scale}px` }}>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: scaleFont(32), fontWeight: 800, color: '#f4f4f2', letterSpacing: '-0.02em', textAlign: 'center', lineHeight: 1.2, marginBottom: `${12 * scale}px` }}>
            {slide.title}
          </h1>
          {slide.subtitle && (
            <p style={{ fontSize: scaleFont(16), color: '#c9f94a', textAlign: 'center', fontWeight: 500 }}>
              {slide.subtitle}
            </p>
          )}
          {slide.content && (
            <p style={{ fontSize: scaleFont(12), color: 'rgba(244,244,242,0.55)', textAlign: 'center', marginTop: `${8 * scale}px`, maxWidth: '80%' }}>
              {slide.content}
            </p>
          )}
        </div>
        {/* Slide type indicator */}
        <div style={{ position: 'absolute', bottom: `${8 * scale}px`, right: `${10 * scale}px`, fontSize: scaleFont(8), color: 'rgba(244,244,242,0.2)', fontFamily: 'JetBrains Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          {slide.type}
        </div>
      </div>
    );
  }

  if (slide.type === 'quote') {
    return (
      <div style={baseStyle}>
        {limeBar}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: `${24 * scale}px` }}>
          <div style={{ fontSize: scaleFont(36), color: 'var(--lime)', marginBottom: `${8 * scale}px`, opacity: 0.6 }}>&ldquo;</div>
          <p style={{ fontSize: scaleFont(18), color: '#f4f4f2', textAlign: 'center', fontStyle: 'italic', lineHeight: 1.5, fontWeight: 500 }}>
            {slide.title}
          </p>
          {slide.content && (
            <p style={{ fontSize: scaleFont(11), color: 'rgba(244,244,242,0.4)', marginTop: `${10 * scale}px` }}>
              — {slide.content}
            </p>
          )}
        </div>
      </div>
    );
  }

  // Content / data / default slide
  return (
    <div style={baseStyle}>
      {limeBar}
      <div style={{ padding: `${16 * scale}px ${20 * scale}px`, flex: 1, overflow: 'hidden' }}>
        <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: scaleFont(20), fontWeight: 700, color: '#f4f4f2', marginBottom: `${6 * scale}px`, lineHeight: 1.2 }}>
          {slide.title}
        </h2>
        <div style={{ height: scale < 0.5 ? 1 : 2, background: 'var(--lime)', width: `${60 * scale}px`, marginBottom: `${10 * scale}px`, opacity: 0.8 }} />

        {slide.bulletPoints && slide.bulletPoints.length > 0 ? (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: `${6 * scale}px` }}>
            {slide.bulletPoints.slice(0, scale < 0.4 ? 4 : 6).map((bp, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: `${6 * scale}px` }}>
                <span style={{ width: `${5 * scale}px`, height: `${5 * scale}px`, borderRadius: '50%', background: 'var(--lime)', flexShrink: 0, marginTop: `${4 * scale}px` }} />
                <span style={{ fontSize: scaleFont(12), color: 'rgba(244,244,242,0.8)', lineHeight: 1.5 }}>{bp}</span>
              </li>
            ))}
          </ul>
        ) : slide.content ? (
          <p style={{ fontSize: scaleFont(13), color: 'rgba(244,244,242,0.7)', lineHeight: 1.65 }}>
            {slide.content.slice(0, scale < 0.4 ? 120 : 300)}
          </p>
        ) : null}
      </div>

      {/* Speaker notes indicator */}
      {slide.speakerNotes && scale < 0.5 && (
        <div style={{ position: 'absolute', bottom: `${4 * scale}px`, left: `${6 * scale}px`, width: `${6 * scale}px`, height: `${6 * scale}px`, borderRadius: '50%', background: 'rgba(184,247,39,0.4)' }} />
      )}
    </div>
  );
}
