export type SlideType = 'title' | 'content' | 'split' | 'quote' | 'data' | 'closing';
export type SlideLayout = 'centered' | 'left' | 'split';

export interface Slide {
  id: string;
  type: SlideType;
  title: string;
  subtitle?: string;
  content?: string;
  bulletPoints?: string[];
  speakerNotes?: string;
  layout: SlideLayout;
}

export interface PresentationData {
  id: string;
  title: string;
  slides: Slide[];
  slideCount: number;
  status: string;
  createdAt: string;
}

export interface KnowledgeSource {
  sourceId: string;
  fileName: string;
  chunkCount: number;
}

export interface RAGContext {
  chunks: string[];
  sources: string[];
  wasUsed: boolean;
}
