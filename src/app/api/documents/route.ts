import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import type { DocumentContent } from '@/types/documents';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const documents = await prisma.document.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      type: true,
      wordCount: true,
      pageCount: true,
      status: true,
      agentUsed: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return NextResponse.json(documents);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const body = await req.json() as {
    title: string;
    type: string;
    content: DocumentContent;
    agentUsed?: string;
  };

  const { title, type, content, agentUsed } = body;

  if (!title || !type || !content) {
    return new NextResponse('Missing required fields', { status: 400 });
  }

  const wordCount = content.sections.reduce(
    (acc, s) => acc + s.content.split(/\s+/).filter(Boolean).length,
    0
  );
  const pageCount = Math.ceil(wordCount / 250);

  const document = await prisma.document.create({
    data: {
      userId: session.user.id,
      title,
      type,
      content: content as object,
      wordCount,
      pageCount,
      agentUsed: agentUsed ?? 'writer',
      status: 'complete',
    },
  });

  return NextResponse.json(document, { status: 201 });
}
