import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { generateDocx } from '@/lib/docx/generator';
import type { DocumentContent, ExportOptions } from '@/types/documents';

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const body = await req.json() as {
    documentId: string;
    format: 'docx' | 'pdf';
    includeTableOfContents?: boolean;
    includeTitlePage?: boolean;
  };

  const { documentId, format } = body;

  if (format === 'pdf') {
    return NextResponse.json(
      { error: 'PDF export not available. Please use DOCX export and print from Word.' },
      { status: 400 }
    );
  }

  const doc = await prisma.document.findFirst({
    where: { id: documentId, userId: session.user.id },
  });

  if (!doc) {
    return new NextResponse('Document not found', { status: 404 });
  }

  const content = doc.content as unknown as DocumentContent;

  const options: ExportOptions = {
    format: 'docx',
    includeTableOfContents: body.includeTableOfContents ?? true,
    includeTitlePage: body.includeTitlePage ?? true,
  };

  const buffer = await generateDocx(content, options);

  // Mark as exported
  await prisma.document.update({
    where: { id: documentId },
    data: { status: 'exported' },
  });

  const safeTitle = doc.title.replace(/[^a-zA-Z0-9а-яА-Я\s]/g, '').trim().replace(/\s+/g, '_');

  // Safely extract an ArrayBuffer from the Node.js Buffer
  const arrayBuffer: ArrayBuffer = buffer.buffer.slice(
    buffer.byteOffset,
    buffer.byteOffset + buffer.byteLength
  ) as ArrayBuffer;

  return new Response(arrayBuffer, {
    status: 200,
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition': `attachment; filename="${safeTitle}.docx"`,
      'Content-Length': buffer.byteLength.toString(),
    },
  });
}
