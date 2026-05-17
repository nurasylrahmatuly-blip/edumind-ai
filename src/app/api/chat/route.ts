import { streamText } from 'ai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { analyzeIntent } from '@/lib/agents/orchestrator';
import { TUTOR_SYSTEM_PROMPT } from '@/lib/agents/tutor';
import { QUIZ_SYSTEM_PROMPT } from '@/lib/agents/quiz';
import { SEARCH_SYSTEM_PROMPT } from '@/lib/agents/search';
import { MENTOR_SYSTEM_PROMPT } from '@/lib/agents/mentor';
import { WRITER_SYSTEM_PROMPT } from '@/lib/agents/writer';
import { RESEARCH_SYSTEM_PROMPT } from '@/lib/agents/research';
import { FORMAT_SYSTEM_PROMPT } from '@/lib/agents/format';
import { SLIDES_SYSTEM_PROMPT } from '@/lib/agents/slides';
import { AgentType } from '@/lib/agents/types';
import { similaritySearch, buildRagContext } from '@/lib/rag/retrieval';
import { checkRateLimit } from '@/lib/ratelimit';

const anthropic = createAnthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

function getSystemPrompt(agent: AgentType): string {
  switch (agent) {
    case AgentType.TUTOR:    return TUTOR_SYSTEM_PROMPT;
    case AgentType.QUIZ:     return QUIZ_SYSTEM_PROMPT;
    case AgentType.SEARCH:   return SEARCH_SYSTEM_PROMPT;
    case AgentType.MENTOR:   return MENTOR_SYSTEM_PROMPT;
    case AgentType.WRITER:   return WRITER_SYSTEM_PROMPT;
    case AgentType.RESEARCH: return RESEARCH_SYSTEM_PROMPT;
    case AgentType.FORMAT:   return FORMAT_SYSTEM_PROMPT;
    case AgentType.SLIDES:   return SLIDES_SYSTEM_PROMPT;
    default:                 return TUTOR_SYSTEM_PROMPT;
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return new Response('Unauthorized', { status: 401 });

  const userId = session.user.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { plan: true },
  });

  const planRaw = (user?.plan ?? 'FREE').toLowerCase() as 'free' | 'pro' | 'academic';
  const { success, limit, remaining, reset } = await checkRateLimit(userId, planRaw);

  if (!success) {
    return Response.json(
      { error: 'Rate limit exceeded', remaining: 0, resetAt: reset },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': String(limit),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(reset),
        },
      }
    );
  }

  const body = await req.json() as {
    message: string;
    conversationId?: string;
    agentOverride?: string;
  };

  const { message, conversationId, agentOverride } = body;
  if (!message?.trim()) return new Response('Message is required', { status: 400 });

  let selectedAgent: AgentType;
  const overrideUpper = agentOverride?.toUpperCase();
  if (overrideUpper && Object.values(AgentType).includes(overrideUpper as AgentType)) {
    selectedAgent = overrideUpper as AgentType;
  } else {
    selectedAgent = await analyzeIntent(message);
  }

  let convId = conversationId;
  if (!convId) {
    const conversation = await prisma.conversation.create({
      data: { userId, title: message.slice(0, 60) },
    });
    convId = conversation.id;
  }

  await prisma.message.create({
    data: { conversationId: convId, role: 'USER', content: message },
  });

  await prisma.usageTracking.upsert({
    where: { userId_date: { userId, date: new Date(new Date().toDateString()) } },
    update: { requestCount: { increment: 1 } },
    create: { userId, date: new Date(new Date().toDateString()), requestCount: 1 },
  });

  let ragContext = '';
  let ragUsed = false;
  let ragSources: string[] = [];

  try {
    const chunks = await similaritySearch(message, userId, 5);
    if (chunks.length > 0) {
      ragContext = buildRagContext(chunks);
      ragUsed = true;
      ragSources = Array.from(new Set(chunks.map((c) => c.fileName)));
    }
  } catch (err) {
    console.error('RAG error:', err);
  }

  const baseSystemPrompt = getSystemPrompt(selectedAgent);
  const systemPrompt = ragUsed ? `${baseSystemPrompt}\n\n${ragContext}` : baseSystemPrompt;
  const routingInfo = agentOverride ? `direct:${selectedAgent}` : `ORCHESTRATOR→${selectedAgent}`;

  const result = await streamText({
    model: anthropic('claude-sonnet-4-6'),
    system: systemPrompt,
    prompt: message,
    onFinish: async ({ text }) => {
      await prisma.message.create({
        data: {
          conversationId: convId!,
          role: 'ASSISTANT',
          content: text,
          agentUsed: selectedAgent,
        },
      });

      await prisma.userProgress.upsert({
        where: { userId },
        update: { sessionsCount: { increment: 1 }, totalXP: { increment: 10 }, lastActiveDate: new Date() },
        create: { userId, sessionsCount: 1, totalXP: 10, lastActiveDate: new Date(), streak: 1 },
      });
    },
  });

  return result.toTextStreamResponse({
    headers: {
      'X-Agent-Used': selectedAgent,
      'X-Conversation-Id': convId,
      'X-Routing-Info': routingInfo,
      'X-RAG-Used': ragUsed ? 'true' : 'false',
      'X-RAG-Sources': ragSources.join(','),
      'X-RateLimit-Limit': String(limit),
      'X-RateLimit-Remaining': String(remaining),
      'X-RateLimit-Reset': String(reset),
    },
  });
}
