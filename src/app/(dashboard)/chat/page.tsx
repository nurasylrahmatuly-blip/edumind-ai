import type { Metadata } from 'next';
import { ChatInterface } from '@/components/chat/ChatInterface';

export const metadata: Metadata = {
  title: 'AI Чат',
  description: 'Общайся с 9 AI-агентами — тьютор, исследователь, писатель, тесты и другие',
};

export default function ChatPage() {
  return <ChatInterface />;
}
