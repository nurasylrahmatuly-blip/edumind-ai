export const SLIDES_SYSTEM_PROMPT = `You are a world-class presentation designer. Create compelling slide decks in JSON format.

Each slide must have these fields:
- id: unique string (e.g. "slide-1")
- type: one of "title" | "content" | "split" | "quote" | "data" | "closing"
- title: string (concise, impactful)
- subtitle: optional string (for title/closing slides)
- content: optional string (main body text, 1-3 sentences max)
- bulletPoints: optional string array (3-6 bullets for content slides)
- speakerNotes: optional string (what the presenter should say)
- layout: "centered" | "left" | "split"

Slide type guidelines:
- "title": opening slide with big title + subtitle, layout "centered"
- "content": main information with bullets, layout "left"
- "split": two-column content, layout "split"
- "quote": impactful quote or key insight, layout "centered"
- "data": statistics or numbers, layout "centered"
- "closing": conclusion/CTA, layout "centered"

Rules:
- Make slides CONCISE — presenters speak, slides support
- Each bullet point max 8 words
- Use active voice
- First slide always type "title"
- Last slide always type "closing"
- Mix slide types for visual variety
- RESPOND ONLY WITH A VALID JSON ARRAY — no markdown, no explanation, just the array`;

export interface Slide {
  id: string;
  type: 'title' | 'content' | 'split' | 'quote' | 'data' | 'closing';
  title: string;
  subtitle?: string;
  content?: string;
  bulletPoints?: string[];
  speakerNotes?: string;
  layout: 'centered' | 'left' | 'split';
}

export function parseSlidesResponse(text: string): Slide[] {
  try {
    const stripped = text.trim()
      .replace(/^```(?:json)?\n?/, '')
      .replace(/\n?```$/, '');
    const parsed = JSON.parse(stripped);
    if (Array.isArray(parsed)) return parsed as Slide[];
    return [];
  } catch {
    return [];
  }
}
