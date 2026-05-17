'use client';

import { useEffect, useRef, useState } from 'react';
import { MessageBubble } from './MessageBubble';
import { RoutingPill } from './RoutingPill';
import type { AgentType, LocalMessage } from '@/types/agents';

interface ChatMessagesProps {
  messages: LocalMessage[];
  isLoading: boolean;
  isRouting: boolean;
  currentAgent: AgentType | null;
  routingInfo: string | null;
}

const SUGGESTIONS = [
  { emoji: '🧑‍🏫', text: 'Объясни квантовую запутанность простыми словами' },
  { emoji: '📝', text: 'Протестируй меня по Второй мировой войне' },
  { emoji: '🔍', text: 'Найди исследования об изменении климата' },
  { emoji: '🎨', text: 'Создай презентацию: машинное обучение' },
];

function SaveDocumentButton({ message }: { message: LocalMessage }) {
  const [state, setState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [docId, setDocId] = useState<string | null>(null);

  const handleSave = async () => {
    setState('saving');
    try {
      const res = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: message.content.slice(0, 80).replace(/#+\s*/g, '').trim() || 'Документ из чата',
          type: 'реферат',
          content: {
            titlePage: { university: '', specialty: 'Из чата', topic: message.content.slice(0, 100), year: new Date().getFullYear(), city: 'Алматы' },
            sections: [{ id: 'section-0', title: 'Содержание', content: message.content, level: 1 }],
            bibliography: [],
          },
          agentUsed: message.agentUsed ?? 'writer',
        }),
      });
      if (!res.ok) throw new Error();
      const doc = await res.json() as { id: string };
      setDocId(doc.id);
      setState('saved');
    } catch {
      setState('error');
      setTimeout(() => setState('idle'), 3000);
    }
  };

  if (state === 'saved' && docId) {
    return (
      <a href={`/documents/${docId}`} className="badge badge-teal" style={{ padding: '5px 12px', fontSize: 11, textDecoration: 'none', cursor: 'pointer' }}>
        ✓ Сохранено — Открыть документ →
      </a>
    );
  }

  return (
    <button
      onClick={handleSave}
      disabled={state === 'saving'}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 'var(--radius-pill)', border: '1px solid var(--border-soft)', background: 'transparent', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--white-muted)', cursor: 'pointer', transition: 'all 0.15s' }}
    >
      {state === 'saving' ? (
        <><span style={{ width: 12, height: 12, borderRadius: '50%', border: '2px solid var(--border-soft)', borderTopColor: 'var(--lime)', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />Сохраняем...</>
      ) : state === 'error' ? '✗ Ошибка' : '💾 Сохранить как документ'}
    </button>
  );
}

function OpenInSlidesButton({ message }: { message: LocalMessage }) {
  const [state, setState] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [presId, setPresId] = useState<string | null>(null);

  const handleSave = async () => {
    setState('saving');
    try {
      const res = await fetch('/api/presentations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Презентация из чата',
          slides: JSON.parse(message.content),
        }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json() as { id: string };
      setPresId(data.id);
      setState('saved');
    } catch {
      setState('idle');
    }
  };

  if (state === 'saved' && presId) {
    return (
      <a href={`/slides/${presId}`} className="badge badge-lime" style={{ padding: '5px 12px', fontSize: 11, textDecoration: 'none', cursor: 'pointer' }}>
        🎨 Открыть в редакторе слайдов →
      </a>
    );
  }

  return (
    <button
      onClick={handleSave}
      disabled={state === 'saving'}
      className="badge badge-lime"
      style={{ padding: '5px 12px', fontSize: 11, cursor: 'pointer', border: '1px solid var(--border-lime)' }}
    >
      {state === 'saving' ? 'Сохраняем...' : '🎨 Открыть в редакторе слайдов'}
    </button>
  );
}

export function ChatMessages({
  messages,
  isLoading,
  isRouting,
  currentAgent,
  routingInfo,
}: ChatMessagesProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div style={{ display: 'flex', flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24, padding: 40, textAlign: 'center' }}>
        <div style={{ width: 64, height: 64, borderRadius: 'var(--radius-xl)', background: 'var(--lime-dim)', border: '1px solid var(--border-lime)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, boxShadow: '0 0 24px var(--lime-glow)' }}>
          🎯
        </div>
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--white)', marginBottom: 8 }}>EduMind AI Chat</h2>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: 14, color: 'var(--white-dim)', maxWidth: 380, lineHeight: 1.6 }}>
            Спроси что угодно — твоя персональная команда AI-агентов готова помочь.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, maxWidth: 440, width: '100%' }}>
          {SUGGESTIONS.map((s) => (
            <div key={s.text} style={{ padding: '12px 14px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-soft)', background: 'var(--bg-raised)', cursor: 'default' }}>
              <span style={{ fontSize: 18 }}>{s.emoji}</span>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--white-dim)', marginTop: 6, lineHeight: 1.5 }}>{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="chat-area">
      <div className="messages-wrap">
        {messages.map((msg) => (
          <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <MessageBubble message={msg} />
            {msg.role === 'assistant' && !msg.isStreaming && msg.content.length > 100 && (
              <div style={{ marginLeft: 38, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {(msg.agentUsed === 'WRITER' || msg.agentUsed === 'RESEARCH') && (
                  <SaveDocumentButton message={msg} />
                )}
                {msg.agentUsed === 'SLIDES' && (() => {
                  try { JSON.parse(msg.content); return <OpenInSlidesButton message={msg} />; } catch { return null; }
                })()}
              </div>
            )}
          </div>
        ))}

        {isLoading && !messages[messages.length - 1]?.isStreaming && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: 7, background: 'var(--lime-dim)', border: '1px solid var(--border-lime)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>
              🎯
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              {[0, 150, 300].map((delay) => (
                <span key={delay} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--lime)', display: 'inline-block', animation: `blink 1.2s ${delay}ms ease-in-out infinite` }} />
              ))}
            </div>
          </div>
        )}

        <RoutingPill isRouting={isRouting} currentAgent={currentAgent} routingInfo={routingInfo} />
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
