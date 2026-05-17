import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return new Response('Unauthorized', { status: 401 });

  const presentations = await prisma.presentation.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    select: { id: true, title: true, slideCount: true, status: true, createdAt: true },
  });

  return Response.json(presentations);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return new Response('Unauthorized', { status: 401 });

  const body = await req.json() as { title: string; slides: unknown };

  const presentation = await prisma.presentation.create({
    data: {
      userId: session.user.id,
      title: body.title ?? 'Без названия',
      slides: body.slides ?? [],
      slideCount: Array.isArray(body.slides) ? body.slides.length : 0,
    },
  });

  return Response.json(presentation, { status: 201 });
}
