export enum AgentType {
  ORCHESTRATOR = 'ORCHESTRATOR',
  TUTOR = 'TUTOR',
  QUIZ = 'QUIZ',
  SEARCH = 'SEARCH',
  MENTOR = 'MENTOR',
  WRITER = 'WRITER',
  RESEARCH = 'RESEARCH',
  FORMAT = 'FORMAT',
  SLIDES = 'SLIDES',
}

export interface AgentResponse {
  agentType: AgentType;
  content: string;
  metadata?: Record<string, unknown>;
}
