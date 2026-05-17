// Simple deterministic hash-based pseudo-embedding for when real embeddings unavailable.
// In production replace with real embeddings (OpenAI ada-002 or Voyage AI).
function hashEmbedding(text: string, dims = 256): number[] {
  const embedding = new Array(dims).fill(0);
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i);
    embedding[i % dims] += charCode * Math.sin(i * 0.1);
  }
  const norm = Math.sqrt(embedding.reduce((s, v) => s + v * v, 0)) || 1;
  return embedding.map((v) => v / norm);
}

export async function generateEmbedding(text: string): Promise<number[]> {
  // Try real API embeddings if configured, fall back to hash
  try {
    const res = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({ input: text.slice(0, 8000), model: 'text-embedding-ada-002' }),
    });
    if (res.ok) {
      const data = await res.json() as { data: { embedding: number[] }[] };
      return data.data[0].embedding;
    }
  } catch { /* fall through */ }
  // Fallback: deterministic hash embedding (256 dims)
  return hashEmbedding(text, 256);
}

export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    // Handle different dims by truncating to shorter
    const len = Math.min(a.length, b.length);
    a = a.slice(0, len);
    b = b.slice(0, len);
  }
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB) || 1);
}

export function splitIntoChunks(text: string, chunkSize = 1000, overlap = 200): string[] {
  const chunks: string[] = [];
  let start = 0;
  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    chunks.push(text.slice(start, end).trim());
    start = end - overlap;
    if (start >= text.length) break;
  }
  return chunks.filter((c) => c.length > 50);
}
