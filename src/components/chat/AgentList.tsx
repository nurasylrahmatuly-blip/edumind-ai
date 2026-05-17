'use client';

import { AGENT_CONFIGS, type AgentType } from '@/types/agents';

interface AgentListProps {
  activeAgent: AgentType | null;
  onSelectAgent: (agent: AgentType | null) => void;
}

const AGENT_ORDER: AgentType[] = ['ORCHESTRATOR', 'TUTOR', 'QUIZ', 'SEARCH', 'MENTOR', 'WRITER', 'RESEARCH', 'FORMAT', 'SLIDES'];

export function AgentList({ activeAgent, onSelectAgent }: AgentListProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '12px 10px' }}>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--white-muted)', textTransform: 'uppercase', letterSpacing: '0.12em', padding: '4px 8px 8px' }}>
        Агенты
      </p>

      {AGENT_ORDER.map((agentKey) => {
        const config = AGENT_CONFIGS[agentKey];
        const isActive = activeAgent === agentKey;
        const isOrchestratorMode = activeAgent === null && agentKey === 'ORCHESTRATOR';
        const highlight = isActive || isOrchestratorMode;

        return (
          <button
            key={agentKey}
            onClick={() => onSelectAgent(isActive ? null : agentKey)}
            style={{
              display: 'flex', alignItems: 'flex-start', gap: 10,
              padding: '8px 10px',
              borderRadius: 'var(--radius-md)',
              background: highlight ? 'var(--bg-active)' : 'transparent',
              borderLeft: `2px solid ${highlight ? config.color : 'transparent'}`,
              cursor: 'pointer', transition: 'all 0.15s',
              border: 'none', width: '100%', textAlign: 'left',
              borderLeftStyle: 'solid',
              borderLeftWidth: 2,
              borderLeftColor: highlight ? config.color : 'transparent',
            }}
            onMouseEnter={(e) => { if (!highlight) (e.currentTarget as HTMLButtonElement).style.background = 'var(--bg-hover)'; }}
            onMouseLeave={(e) => { if (!highlight) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
          >
            <span style={{ fontSize: 16, lineHeight: 1, marginTop: 2 }}>{config.emoji}</span>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 500, color: highlight ? config.color : 'var(--white)', marginBottom: 2 }}>
                {config.name}
              </div>
              <div style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: 'var(--white-muted)', lineHeight: 1.4 }}>
                {config.description}
              </div>
            </div>
          </button>
        );
      })}

      {activeAgent && activeAgent !== 'ORCHESTRATOR' && (
        <button
          onClick={() => onSelectAgent(null)}
          style={{
            margin: '8px 4px 0', padding: '6px 12px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-soft)',
            background: 'transparent',
            fontFamily: 'var(--font-mono)', fontSize: 11,
            color: 'var(--white-muted)', cursor: 'pointer',
            transition: 'all 0.15s',
          }}
        >
          ← Авто (Orchestrator)
        </button>
      )}
    </div>
  );
}
