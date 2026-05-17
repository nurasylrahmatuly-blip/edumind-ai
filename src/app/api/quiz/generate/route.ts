import { generateText } from 'ai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { auth } from '@/auth';
import { QUIZ_SYSTEM_PROMPT } from '@/lib/agents/quiz';
import type { QuizPayload } from '@/types/agents';

const anthropic = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response('Unauthorized', { status: 401 });
  }

  const body = await req.json() as {
    topic: string;
    difficulty: 'easy' | 'medium' | 'hard';
    count: number;
  };

  const { topic, difficulty = 'medium', count = 5 } = body;

  if (!topic?.trim()) {
    return new Response('Topic is required', { status: 400 });
  }

  const prompt = `Generate ${Math.min(count, 10)} ${difficulty} difficulty questions about: ${topic}`;

  const { text } = await generateText({
    model: anthropic('claude-sonnet-4-6'),
    system: QUIZ_SYSTEM_PROMPT,
    prompt,
    maxOutputTokens: 2000,
  });

  try {
    const parsed = JSON.parse(text) as QuizPayload;
    return Response.json(parsed);
  } catch {
    return new Response('Failed to generate valid quiz', { status: 500 });
  }
}
