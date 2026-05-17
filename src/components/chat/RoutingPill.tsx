'use client';

import { useEffect, useState } from 'react';
import { AGENT_CONFIGS, type AgentType } from '@/types/agents';

interface RoutingPillProps {
  isRouting: boolean;
  currentAgent: AgentType | null;
  routingInfo: string | null;
}

export function RoutingPill({ isRouting, currentAgent, routingInfo }: RoutingPillProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isRouting || currentAgent) setVisible(true);
    if (!isRouting && currentAgent) {
      const timer = setTimeout(() => setVisible(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isRouting, currentAgent]);

  if (!visible) return null;

  const agentConfig = currentAgent ? AGENT_CONFIGS[currentAgent] : null;
  const isDirect = routingInfo?.startsWith('direct:');

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '4px 0' }}>
      <div className="routing-pill">
        {isRouting ? (
          <>
            <span style={{ width: 8, height: 8, borderRadius: '50%', border: '1.5px solid var(--lime)', borderTopColor: 'transparent', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
            <span>Orchestrator маршрутизирует…</span>
          </>
        ) : agentConfig ? (
          <>
            {!isDirect && (
              <>
                <span>{AGENT_CONFIGS.ORCHESTRATOR.emoji} Orchestrator</span>
                <span style={{ color: 'var(--white-muted)' }}>→</span>
              </>
            )}
            <span>{agentConfig.emoji} {agentConfig.name}</span>
          </>
        ) : null}
      </div>
    </div>
  );
}
