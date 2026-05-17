import { generateText } from 'ai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { SLIDES_SYSTEM_PROMPT, parseSlidesResponse } from '@/lib/agents/slides';
import { checkRateLimit } from '@/lib/ratelimit';

const anthropic = createAnthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

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
    topic: string;
    slideCount?: number;
    style?: string;
    audience?: string;
  };

  const { topic, slideCount = 10, style = 'professional', audience = 'students' } = body;

  if (!topic?.trim()) return new Response('Topic is required', { status: 400 });

  const prompt = `Create a ${slideCount}-slide presentation about: "${topic}"
Style: ${style}
Target audience: ${audience}
Number of slides: ${slideCount} (strictly)

Make the first slide a title slide and last a closing slide.
Vary the slide types for visual interest.`;

  try {
    const { text } = await generateText({
      model: anthropic('claude-sonnet-4-6'),
      system: SLIDES_SYSTEM_PROMPT,
      prompt,
    });

    const slides = parseSlidesResponse(text);

    if (slides.length === 0) {
      return new Response('Failed to generate slides', { status: 500 });
    }

    const presentation = await prisma.presentation.create({
      data: {
        userId,
        title: topic,
        slides: JSON.parse(JSON.stringify(slides)),
        slideCount: slides.length,
        status: 'done',
      },
    });

    return Response.json(
      { presentation, slides },
      {
        headers: {
          'X-RateLimit-Limit': String(limit),
          'X-RateLimit-Remaining': String(remaining),
          'X-RateLimit-Reset': String(reset),
        },
      }
    );
  } catch (err) {
    console.error('Slides generation error:', err);
    return new Response('Generation failed', { status: 500 });
  }
}
