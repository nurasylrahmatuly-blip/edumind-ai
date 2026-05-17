export type DocumentType = 'реферат' | 'курсовая' | 'дипломная';
export type DocumentStatus = 'draft' | 'generating' | 'complete' | 'exported';

export interface TitlePage {
  university: string;
  faculty?: string;
  specialty: string;
  topic: string;
  studentName?: string;
  year: number;
  city?: string;
}

export interface Source {
  number: number;
  authors: string;
  title: string;
  publisher: string;
  year: number;
  pages?: string;
  url?: string;
  type: 'книга' | 'статья' | 'интернет' | 'норматив';
}

export interface DocumentSection {
  id: string;
  title: string;
  content: string;
  level: 1 | 2 | 3;
  wordCount?: number;
}

export interface DocumentContent {
  titlePage: TitlePage;
  sections: DocumentSection[];
  bibliography: Source[];
}

export interface FormattingIssue {
  type: 'critical' | 'warning' | 'info';
  description: string;
  suggestion: string;
}

export interface ExportOptions {
  format: 'docx' | 'pdf';
  includeTableOfContents: boolean;
  includeTitlePage: boolean;
}

export interface DocumentMeta {
  id: string;
  title: string;
  type: DocumentType;
  wordCount: number;
  pageCount: number;
  status: DocumentStatus;
  agentUsed: string;
  createdAt: string;
  updatedAt: string;
}
