'use client';

import { useState } from 'react';
import { AGENT_CONFIGS, type LocalMessage, type QuizPayload, type SearchPayload } from '@/types/agents';

interface MessageBubbleProps {
  message: LocalMessage;
}

function tryParseJson<T>(text: string): T | null {
  try {
    const trimmed = text.trim();
    const stripped = trimmed.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    return JSON.parse(stripped) as T;
  } catch {
    return null;
  }
}

function QuizCard({ payload }: { payload: QuizPayload }) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}>
      {payload.questions.map((q) => {
        const selected = answers[q.id];
        const isRevealed = revealed[q.id];

        return (
          <div key={q.id} style={{ borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-soft)', background: 'var(--bg-hover)', padding: '14px 16px' }}>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 500, color: 'var(--white)', marginBottom: 10 }}>{q.question}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {q.options.map((opt) => {
                let borderColor = 'var(--border-soft)';
                let bg = 'transparent';
                let color = 'var(--white-dim)';
                if (selected === opt.key) {
                  if (!isRevealed) { borderColor = 'var(--agent-quiz)'; bg = 'rgba(167,139,250,0.1)'; color = 'var(--white)'; }
                  else if (opt.correct) { borderColor = 'var(--agent-tutor)'; bg = 'rgba(52,211,153,0.1)'; color = 'var(--agent-tutor)'; }
                  else { borderColor = '#fb7185'; bg = 'rgba(251,113,133,0.1)'; color = '#fb7185'; }
                } else if (isRevealed && opt.correct) {
                  borderColor = 'var(--agent-tutor)'; bg = 'rgba(52,211,153,0.1)'; color = 'var(--agent-tutor)';
                }

                return (
                  <button
                    key={opt.key}
                    disabled={isRevealed}
                    onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: opt.key }))}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 'var(--radius-md)', border: `1px solid ${borderColor}`, background: bg, color, fontFamily: 'var(--font-ui)', fontSize: 13, cursor: isRevealed ? 'default' : 'pointer', transition: 'all 0.15s', textAlign: 'left' }}
                  >
                    <span style={{ width: 20, height: 20, borderRadius: '50%', border: '1px solid currentColor', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, flexShrink: 0 }}>
                      {opt.key.toUpperCase()}
                    </span>
                    {opt.text}
                  </button>
                );
              })}
            </div>

            {selected && !isRevealed && (
              <button
                onClick={() => setRevealed((prev) => ({ ...prev, [q.id]: true }))}
                className="badge badge-violet"
                style={{ marginTop: 10, cursor: 'pointer', padding: '5px 12px', fontSize: 11 }}
              >
                Проверить ответ
              </button>
            )}

            {isRevealed && (
              <div style={{ marginTop: 10, padding: '8px 12px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--white-dim)' }}>
                <span style={{ color: 'var(--agent-tutor)', fontWeight: 600 }}>Объяснение: </span>
                {q.explanation}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function SearchCard({ payload }: { payload: SearchPayload }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
      {payload.summary && (
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--white-dim)', fontStyle: 'italic' }}>{payload.summary}</p>
      )}
      {payload.results.map((result, i) => (
        <a
          key={i}
          href={result.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: 'block', padding: '12px 14px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-soft)', background: 'var(--bg-hover)', textDecoration: 'none', transition: 'all 0.15s' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: 4 }}>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 600, color: 'var(--agent-search)' }}>{result.title}</p>
            {result.year && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--white-muted)', flexShrink: 0 }}>{result.year}</span>}
          </div>
          {result.authors && result.authors.length > 0 && (
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--white-muted)', marginBottom: 6 }}>{result.authors.join(', ')}</p>
          )}
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--white-dim)', lineHeight: 1.6 }}>{result.description}</p>
        </a>
      ))}
    </div>
  );
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  if (isUser) {
    return (
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <div className="msg-user-bubble">{message.content}</div>
      </div>
    );
  }

  const agentConfig = message.agentUsed ? AGENT_CONFIGS[message.agentUsed] : null;
  const agentClass = message.agentUsed ? `agent-${message.agentUsed.toLowerCase()}` : '';

  let specialContent: React.ReactNode = null;
  if (message.agentUsed === 'QUIZ' && !message.isStreaming) {
    const parsed = tryParseJson<QuizPayload>(message.content);
    if (parsed?.questions) specialContent = <QuizCard payload={parsed} />;
  } else if (message.agentUsed === 'SEARCH' && !message.isStreaming) {
    const parsed = tryParseJson<SearchPayload>(message.content);
    if (parsed?.results) specialContent = <SearchCard payload={parsed} />;
  }

  return (
    <div className={`msg-ai-wrap ${agentClass}`}>
      <div className="msg-agent-avatar">
        {agentConfig?.emoji ?? '🤖'}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        {agentConfig && (
          <div className="msg-agent-label">{agentConfig.name}</div>
        )}

        {specialContent ?? (
          <div className="msg-ai-bubble prose-chat">
            <span style={{ whiteSpace: 'pre-wrap' }}>{message.content}</span>
            {message.isStreaming && <span className="stream-cursor" />}
          </div>
        )}

        {/* RAG sources */}
        {message.ragUsed && message.ragSources && message.ragSources.length > 0 && (
          <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {message.ragSources.map((src, i) => (
              <span key={i} className="source-chip">
                📎 {src}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
