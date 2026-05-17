import { prisma } from '@/lib/prisma';
import { generateEmbedding, cosineSimilarity } from './embeddings';

export interface RetrievedChunk {
  id: string;
  fileName: string;
  sourceId: string;
  chunkText: string;
  score: number;
}

interface DbChunk {
  id: string;
  fileName: string;
  sourceId: string;
  chunkText: string;
  embedding: string | null;
}

export async function similaritySearch(
  query: string,
  userId: string,
  limit = 5
): Promise<RetrievedChunk[]> {
  try {
    const queryEmbedding = await generateEmbedding(query);

    const chunks = await prisma.knowledgeChunk.findMany({
      where: { userId },
      select: { id: true, fileName: true, sourceId: true, chunkText: true, embedding: true },
    }) as DbChunk[];

    if (chunks.length === 0) return [];

    const scored = chunks
      .map((chunk: DbChunk) => {
        let score = 0;
        if (chunk.embedding) {
          try {
            const embedding = JSON.parse(chunk.embedding) as number[];
            score = cosineSimilarity(queryEmbedding, embedding);
          } catch {
            const queryWords = query.toLowerCase().split(/\s+/);
            const chunkLower = chunk.chunkText.toLowerCase();
            score = queryWords.filter((w: string) => w.length > 3 && chunkLower.includes(w)).length / queryWords.length;
          }
        } else {
          const queryWords = query.toLowerCase().split(/\s+/);
          const chunkLower = chunk.chunkText.toLowerCase();
          score = queryWords.filter((w: string) => w.length > 3 && chunkLower.includes(w)).length / queryWords.length;
        }
        return { id: chunk.id, fileName: chunk.fileName, sourceId: chunk.sourceId, chunkText: chunk.chunkText, score };
      })
      .filter((c: RetrievedChunk) => c.score > 0.1)
      .sort((a: RetrievedChunk, b: RetrievedChunk) => b.score - a.score)
      .slice(0, limit);

    return scored;
  } catch (err) {
    console.error('RAG retrieval error:', err);
    return [];
  }
}

export function buildRagContext(chunks: RetrievedChunk[]): string {
  if (chunks.length === 0) return '';
  const context = chunks.map((c) => `[${c.fileName}]\n${c.chunkText}`).join('\n\n---\n\n');
  return `Relevant context from user's documents:\n\n${context}\n\n---\n\nUse the above context to inform your response when relevant.`;
}
