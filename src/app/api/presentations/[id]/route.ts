import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import type { Slide } from '@/types/slides';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return new Response('Unauthorized', { status: 401 });
  const { id } = await params;

  const presentation = await prisma.presentation.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!presentation) return new Response('Not found', { status: 404 });
  return Response.json(presentation);
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return new Response('Unauthorized', { status: 401 });
  const { id } = await params;
  const body = await req.json() as { title?: string; slides?: Slide[] };

  const updateData: Record<string, unknown> = {};
  if (body.title) updateData.title = body.title;
  if (body.slides) {
    updateData.slides = JSON.parse(JSON.stringify(body.slides));
    updateData.slideCount = body.slides.length;
  }

  const updated = await prisma.presentation.updateMany({
    where: { id, userId: session.user.id },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: updateData as any,
  });

  if (updated.count === 0) return new Response('Not found', { status: 404 });
  return Response.json({ success: true });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return new Response('Unauthorized', { status: 401 });
  const { id } = await params;

  await prisma.presentation.deleteMany({
    where: { id, userId: session.user.id },
  });

  return Response.json({ success: true });
}
