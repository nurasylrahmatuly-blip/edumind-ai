'use client';

import { useRef, useCallback, type KeyboardEvent, type ChangeEvent } from 'react';
import { Send, Paperclip, StopCircle } from 'lucide-react';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: (message: string) => void;
  isLoading: boolean;
  onStop?: () => void;
  ragSourceCount?: number;
  onOpenKnowledge?: () => void;
}

export function ChatInput({
  value,
  onChange,
  onSend,
  isLoading,
  onStop,
  ragSourceCount = 0,
  onOpenKnowledge,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      onChange(e.target.value);
      const ta = e.target;
      ta.style.height = 'auto';
      ta.style.height = `${Math.min(ta.scrollHeight, 200)}px`;
    },
    [onChange]
  );

  const handleSend = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed || isLoading) return;
    onSend(trimmed);
    onChange('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }, [value, isLoading, onSend, onChange]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  return (
    <div className="chat-input-area">
      {/* RAG pill */}
      {ragSourceCount > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <div className="routing-pill" style={{ cursor: 'pointer' }} onClick={onOpenKnowledge}>
            <span>📎</span>
            <span>RAG активен · {ragSourceCount} источник{ragSourceCount > 1 ? 'а' : ''}</span>
          </div>
        </div>
      )}

      <div className="input-box">
        {/* PDF attach */}
        <button
          type="button"
          onClick={onOpenKnowledge}
          className="btn-icon"
          style={{ marginBottom: 2, flexShrink: 0, border: 'none', background: 'transparent' }}
          title="База знаний (PDF)"
        >
          <Paperclip size={15} style={{ color: ragSourceCount > 0 ? 'var(--lime)' : 'var(--white-muted)' }} />
        </button>

        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          placeholder="Спроси что угодно… (Enter — отправить, Shift+Enter — новая строка)"
          rows={1}
          style={{ minHeight: '24px', maxHeight: '200px' }}
        />

        {isLoading ? (
          <button
            type="button"
            onClick={onStop}
            style={{
              width: 34, height: 34, borderRadius: '50%',
              background: 'rgba(251,113,133,0.2)', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fb7185', flexShrink: 0, marginBottom: 2,
            }}
            title="Остановить"
          >
            <StopCircle size={16} />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSend}
            disabled={!value.trim()}
            className="send-btn"
            style={{ marginBottom: 2 }}
            title="Отправить"
          >
            <Send size={14} />
          </button>
        )}
      </div>

      <p style={{ marginTop: 8, textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--white-muted)' }}>
        AI может ошибаться. Проверяйте важную информацию.
      </p>
    </div>
  );
}
