'use client';

import { useState, useCallback } from 'react';
import type { AgentType, LocalMessage } from '@/types/agents';

interface RoutingState {
  isRouting: boolean;
  currentAgent: AgentType | null;
  routingInfo: string | null;
  conversationId: string | null;
}

let idCounter = 0;
function newId() {
  return `msg-${Date.now()}-${++idCounter}`;
}

export function useAgentChat(lockedAgent?: AgentType | null) {
  const [messages, setMessages] = useState<LocalMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [ragSourceCount, setRagSourceCount] = useState(0);
  const [routing, setRouting] = useState<RoutingState>({
    isRouting: false,
    currentAgent: null,
    routingInfo: null,
    conversationId: null,
  });

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoading) return;

      const userMsg: LocalMessage = { id: newId(), role: 'user', content: text };
      const assistantId = newId();
      const assistantMsg: LocalMessage = { id: assistantId, role: 'assistant', content: '', isStreaming: true };

      setMessages((prev) => [...prev, userMsg, assistantMsg]);
      setIsLoading(true);
      setRouting((prev) => ({ ...prev, isRouting: true, currentAgent: null }));

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: text,
            conversationId: routing.conversationId,
            agentOverride: lockedAgent ?? undefined,
          }),
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        if (!response.body) throw new Error('No response body');

        const agentUsed = response.headers.get('X-Agent-Used') as AgentType | null;
        const info = response.headers.get('X-Routing-Info');
        const convId = response.headers.get('X-Conversation-Id');
        const ragUsed = response.headers.get('X-RAG-Used') === 'true';
        const ragSources = response.headers.get('X-RAG-Sources')?.split(',').filter(Boolean) ?? [];

        setRouting((prev) => ({
          isRouting: false,
          currentAgent: agentUsed,
          routingInfo: info,
          conversationId: convId ?? prev.conversationId,
        }));

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let accumulated = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          accumulated += decoder.decode(value, { stream: true });
          const current = accumulated;
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId ? { ...m, content: current, agentUsed: agentUsed ?? undefined } : m
            )
          );
        }

        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, content: accumulated, agentUsed: agentUsed ?? undefined, isStreaming: false, ragUsed, ragSources }
              : m
          )
        );
      } catch (err) {
        console.error('Chat error:', err);
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, content: 'Что-то пошло не так. Попробуй снова.', isStreaming: false }
              : m
          )
        );
        setRouting((prev) => ({ ...prev, isRouting: false }));
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, lockedAgent, routing.conversationId]
  );

  // Fetch RAG source count
  const refreshRagCount = useCallback(async () => {
    try {
      const res = await fetch('/api/upload');
      if (res.ok) {
        const data = await res.json() as { count: number };
        setRagSourceCount(data.count ?? 0);
      }
    } catch { /* ignore */ }
  }, []);

  return { messages, isLoading, sendMessage, routing, ragSourceCount, refreshRagCount };
}
