export type AgentType = 'ORCHESTRATOR' | 'TUTOR' | 'QUIZ' | 'SEARCH' | 'MENTOR' | 'WRITER' | 'RESEARCH' | 'FORMAT' | 'SLIDES';

export interface LocalMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  agentUsed?: AgentType;
  isStreaming?: boolean;
  ragUsed?: boolean;
  ragSources?: string[];
}

export interface AgentConfig {
  name: string;
  emoji: string;
  color: string;
  description: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  agentUsed?: AgentType;
  messageType?: 'text' | 'quiz' | 'search' | 'mentor';
  createdAt?: Date;
}

export interface QuizOption {
  key: string;
  text: string;
  correct: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  explanation: string;
  topic?: string;
}

export interface QuizPayload {
  questions: QuizQuestion[];
}

export interface SearchResult {
  title: string;
  url: string;
  description: string;
  year?: number;
  authors?: string[];
}

export interface SearchPayload {
  results: SearchResult[];
  summary: string;
}

export interface UserProgress {
  streak: number;
  lastActiveDate: string | null;
  totalXP: number;
  sessionsCount: number;
  weekDays: boolean[];
  weakTopics: string[];
}

export const AGENT_CONFIGS: Record<AgentType, AgentConfig> = {
  ORCHESTRATOR: {
    name: 'Orchestrator',
    emoji: '🎯',
    color: 'var(--agent-orchestrator)',
    description: 'Умная маршрутизация запросов к нужному агенту',
  },
  TUTOR: {
    name: 'Tutor',
    emoji: '🧑‍🏫',
    color: 'var(--agent-tutor)',
    description: 'Объясняет темы, решает задачи шаг за шагом',
  },
  QUIZ: {
    name: 'Quiz',
    emoji: '📝',
    color: 'var(--agent-quiz)',
    description: 'Генерирует тесты по слабым темам',
  },
  SEARCH: {
    name: 'Search',
    emoji: '🔍',
    color: 'var(--agent-search)',
    description: 'Находит академические источники и статьи',
  },
  MENTOR: {
    name: 'Mentor',
    emoji: '🔥',
    color: 'var(--agent-mentor)',
    description: 'Мотивация, стрики и отслеживание прогресса',
  },
  WRITER: {
    name: 'Writer',
    emoji: '✍️',
    color: 'var(--agent-writer)',
    description: 'Пишет учебные работы по ГОСТ 7.32-2017',
  },
  RESEARCH: {
    name: 'Research',
    emoji: '📚',
    color: 'var(--agent-research)',
    description: 'Генерирует библиографии по ГОСТ Р 7.0.5-2008',
  },
  FORMAT: {
    name: 'Format',
    emoji: '📐',
    color: 'var(--agent-format)',
    description: 'Проверяет и исправляет оформление по ГОСТ',
  },
  SLIDES: {
    name: 'Slides',
    emoji: '🎨',
    color: 'var(--agent-slides)',
    description: 'Создаёт профессиональные презентации',
  },
};
