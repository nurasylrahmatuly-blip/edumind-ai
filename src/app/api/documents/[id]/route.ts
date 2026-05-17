import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import type { DocumentContent } from '@/types/documents';

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const document = await prisma.document.findFirst({
    where: { id: params.id, userId: session.user.id },
  });

  if (!document) {
    return new NextResponse('Not found', { status: 404 });
  }

  return NextResponse.json(document);
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const body = await req.json() as {
    title?: string;
    content?: DocumentContent;
    status?: string;
  };

  const existing = await prisma.document.findFirst({
    where: { id: params.id, userId: session.user.id },
  });

  if (!existing) {
    return new NextResponse('Not found', { status: 404 });
  }

  const updateData: Record<string, unknown> = {};
  if (body.title !== undefined) updateData.title = body.title;
  if (body.status !== undefined) updateData.status = body.status;
  if (body.content !== undefined) {
    updateData.content = body.content as object;
    updateData.wordCount = body.content.sections.reduce(
      (acc, s) => acc + s.content.split(/\s+/).filter(Boolean).length,
      0
    );
    updateData.pageCount = Math.ceil((updateData.wordCount as number) / 250);
  }

  const updated = await prisma.document.update({
    where: { id: params.id },
    data: updateData,
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const existing = await prisma.document.findFirst({
    where: { id: params.id, userId: session.user.id },
  });

  if (!existing) {
    return new NextResponse('Not found', { status: 404 });
  }

  await prisma.document.delete({ where: { id: params.id } });

  return new NextResponse(null, { status: 204 });
}
