import type { Metadata } from 'next';
import { SlidesClientPage } from './SlidesClientPage';

export const metadata: Metadata = {
  title: 'Презентации',
  description: 'Создавай AI-презентации и экспортируй в PPTX',
};

export default function SlidesPage() {
  return <SlidesClientPage />;
}
