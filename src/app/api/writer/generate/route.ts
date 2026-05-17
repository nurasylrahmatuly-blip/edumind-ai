import { streamText } from 'ai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { WRITER_SYSTEM_PROMPT } from '@/lib/agents/writer';
import { checkRateLimit } from '@/lib/ratelimit';

const anthropic = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

const SECTION_COUNTS: Record<string, number> = {
  'реферат': 5,
  'курсовая': 7,
  'дипломная': 10,
};

function buildGenerationPrompt(
  topic: string,
  type: string,
  specialty: string,
  pages: number,
  university?: string
): string {
  const sectionCount = SECTION_COUNTS[type] ?? 7;
  const uniStr = university ? `Вуз: ${university}` : '';

  return `Напиши полную академическую работу со следующими параметрами:
- Тема: ${topic}
- Тип работы: ${type}
- Специальность/Дисциплина: ${specialty}
- Объём: ~${pages} страниц
${uniStr}

Структура работы должна включать ${sectionCount} разделов. Используй следующий формат для каждого раздела:

<<SECTION:1:ВВЕДЕНИЕ>>
[Полный текст введения: актуальность, цели, задачи, объект и предмет исследования, методы, структура работы]
<<END_SECTION>>

<<SECTION:1:ГЛАВА 1. [НАЗВАНИЕ ГЛАВЫ]>>
[Полный текст главы]
<<END_SECTION>>

<<SECTION:2:1.1. [Название параграфа]>>
[Текст параграфа]
<<END_SECTION>>

<<SECTION:1:ЗАКЛЮЧЕНИЕ>>
[Полный текст заключения с выводами]
<<END_SECTION>>

Пиши академическим научным стилем на русском языке. Каждый раздел должен быть содержательным и детальным. Минимальный объём каждого основного раздела — 300 слов.`;
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response('Unauthorized', { status: 401 });
  }

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
    topic: string;
    type: 'реферат' | 'курсовая' | 'дипломная';
    specialty: string;
    pages: number;
    university?: string;
  };

  const { topic, type, specialty, pages, university } = body;

  if (!topic || !type || !specialty) {
    return new Response('Missing required fields', { status: 400 });
  }

  const prompt = buildGenerationPrompt(topic, type, specialty, pages, university);

  const result = await streamText({
    model: anthropic('claude-sonnet-4-6'),
    system: WRITER_SYSTEM_PROMPT,
    prompt,
    maxOutputTokens: 8000,
  });

  return result.toTextStreamResponse({
    headers: {
      'X-Document-Type': type,
      'X-Document-Topic': encodeURIComponent(topic),
      'X-RateLimit-Limit': String(limit),
      'X-RateLimit-Remaining': String(remaining),
      'X-RateLimit-Reset': String(reset),
    },
  });
}
