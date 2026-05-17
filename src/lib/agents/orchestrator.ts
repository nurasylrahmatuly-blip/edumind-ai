import { generateText } from 'ai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { AgentType } from './types';

const anthropic = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

const ORCHESTRATOR_PROMPT = `You are an orchestrator for an educational AI platform.
Classify the user message into exactly one of these agents: TUTOR, QUIZ, SEARCH, MENTOR, WRITER, RESEARCH, FORMAT, SLIDES.

TUTOR: Questions about topics, explanations, concepts, homework help. Keywords: "explain", "how does", "what is", "teach me", "I don't understand", "объясни", "как работает", "что такое".
QUIZ: Requests for tests, quizzes, practice questions. Keywords: "test me", "quiz me", "make questions", "practice problems", "проверь", "тест", "вопросы", "викторина".
SEARCH: Academic research, finding papers, sources, citations. Keywords: "find research", "academic papers", "sources about", "literature on", "статьи", "источники", "исследования".
MENTOR: Motivation, progress, streaks, encouragement. Keywords: "how am I doing", "motivate me", "progress", "streak", "мотивация", "прогресс", "поддержи".
WRITER: Writing academic works, essays, course papers. Keywords: "курсовая", "реферат", "диплом", "написать работу", "сочинение", "написать введение", "написать главу", "write essay".
RESEARCH: Generating bibliographies, reference lists. Keywords: "источники", "библиография", "список литературы", "ссылки", "ГОСТ", "список использованной литературы".
FORMAT: Formatting checks, ГОСТ compliance, fixing layout. Keywords: "оформить", "форматирование", "ГОСТ оформление", "исправить оформление", "проверить ГОСТ".
SLIDES: Creating presentations, slide decks. Keywords: "презентация", "слайды", "presentation", "slides", "PowerPoint", "доклад", "сделай презентацию", "создай слайды", "slide deck".

Return ONLY the agent name in uppercase, nothing else. No explanation.`;

export async function analyzeIntent(message: string): Promise<AgentType> {
  try {
    const { text } = await generateText({
      model: anthropic('claude-haiku-4-5-20251001'),
      system: ORCHESTRATOR_PROMPT,
      prompt: message,
      maxOutputTokens: 10,
    });

    const normalized = text.trim().toUpperCase();
    if (Object.values(AgentType).includes(normalized as AgentType)) {
      return normalized as AgentType;
    }
    return AgentType.TUTOR;
  } catch {
    return AgentType.TUTOR;
  }
}
