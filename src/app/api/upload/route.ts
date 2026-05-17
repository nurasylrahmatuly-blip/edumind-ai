import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { generateEmbedding, splitIntoChunks } from '@/lib/rag/embeddings';
import { randomUUID } from 'crypto';


export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return new Response('Unauthorized', { status: 401 });

  const sources = await prisma.knowledgeChunk.groupBy({
    by: ['sourceId', 'fileName'],
    where: { userId: session.user.id },
    _count: { id: true },
    orderBy: { _count: { id: 'desc' } },
  });

  return Response.json({
    count: sources.length,
    sources: sources.map((s: { sourceId: string; fileName: string; _count: { id: number } }) => ({
      sourceId: s.sourceId,
      fileName: s.fileName,
      chunkCount: s._count.id,
    })),
  });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return new Response('Unauthorized', { status: 401 });

  const formData = await req.formData();
  const file = formData.get('file') as File | null;

  if (!file) return new Response('No file uploaded', { status: 400 });
  if (!file.name.toLowerCase().endsWith('.pdf')) {
    return new Response('Only PDF files supported', { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  let text = '';
  try {
    // Dynamic import to avoid SSR issues
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pdfParse = require('pdf-parse') as (buf: Buffer) => Promise<{ text: string }>;
    const data = await pdfParse(buffer);
    text = data.text;
  } catch (err) {
    console.error('PDF parse error:', err);
    return new Response('Failed to parse PDF', { status: 400 });
  }

  if (!text.trim()) return new Response('PDF has no extractable text', { status: 400 });

  const chunks = splitIntoChunks(text, 1000, 200);
  const sourceId = randomUUID();

  // Generate embeddings and store chunks
  const chunkRecords = await Promise.all(
    chunks.map(async (chunkText) => {
      let embeddingStr: string | null = null;
      try {
        const embedding = await generateEmbedding(chunkText);
        embeddingStr = JSON.stringify(embedding);
      } catch { /* store without embedding */ }

      return prisma.knowledgeChunk.create({
        data: {
          userId: session.user.id!,
          sourceId,
          fileName: file.name,
          chunkText,
          embedding: embeddingStr,
          metadata: { fileSize: file.size, mimeType: file.type },
        },
      });
    })
  );

  return Response.json({
    documentId: sourceId,
    chunkCount: chunkRecords.length,
    fileName: file.name,
    fileSize: file.size,
  });
}

export async function DELETE(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return new Response('Unauthorized', { status: 401 });

  const { sourceId } = await req.json() as { sourceId: string };

  await prisma.knowledgeChunk.deleteMany({
    where: { userId: session.user.id, sourceId },
  });

  return Response.json({ success: true });
}
