'use client';

import { useState } from 'react';
import { AgentList } from './AgentList';
import { ChatMessages } from './ChatMessages';
import { ChatInput } from './ChatInput';
import { useAgentChat } from '@/hooks/useAgentChat';
import type { AgentType } from '@/types/agents';

export function ChatInterface() {
  const [lockedAgent, setLockedAgent] = useState<AgentType | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [showKnowledge, setShowKnowledge] = useState(false);

  const { messages, isLoading, sendMessage, routing, ragSourceCount } = useAgentChat(lockedAgent);

  const handleSend = async (text: string) => {
    setInputValue('');
    await sendMessage(text);
  };

  return (
    <div style={{ display: 'flex', height: '100%', background: 'var(--bg-void)', overflow: 'hidden' }}>
      {/* Agents sidebar */}
      <aside style={{ width: 240, flexShrink: 0, borderRight: '1px solid var(--border-dim)', background: 'var(--bg-base)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ height: 52, borderBottom: '1px solid var(--border-dim)', display: 'flex', alignItems: 'center', gap: 8, padding: '0 16px', flexShrink: 0 }}>
          <span style={{ fontSize: 18 }}>🎯</span>
          <div>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 700, color: 'var(--white)' }}>AI Агенты</p>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--white-muted)' }}>
              {lockedAgent ? 'Locked mode' : 'Auto-routing'}
            </p>
          </div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <AgentList activeAgent={lockedAgent} onSelectAgent={setLockedAgent} />
        </div>
      </aside>

      {/* Main chat */}
      <div style={{ display: 'flex', flex: 1, flexDirection: 'column', overflow: 'hidden' }}>
        {/* Topbar */}
        <div className="topbar">
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, color: 'var(--white)' }}>
              {lockedAgent
                ? `${lockedAgent.charAt(0) + lockedAgent.slice(1).toLowerCase()} Agent`
                : 'EduMind Chat'}
            </h1>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--white-muted)' }}>
              {messages.length} сообщений
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {ragSourceCount > 0 && (
              <button
                onClick={() => setShowKnowledge(!showKnowledge)}
                className="badge badge-lime"
                style={{ cursor: 'pointer', padding: '5px 12px' }}
              >
                📎 {ragSourceCount} источник
              </button>
            )}
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <ChatMessages
            messages={messages}
            isLoading={isLoading}
            isRouting={routing.isRouting}
            currentAgent={routing.currentAgent}
            routingInfo={routing.routingInfo}
          />
        </div>

        {/* Input */}
        <ChatInput
          value={inputValue}
          onChange={setInputValue}
          onSend={handleSend}
          isLoading={isLoading}
          ragSourceCount={ragSourceCount}
          onOpenKnowledge={() => setShowKnowledge(!showKnowledge)}
        />
      </div>
    </div>
  );
}
