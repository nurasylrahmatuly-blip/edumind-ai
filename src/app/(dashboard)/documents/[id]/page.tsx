import { redirect, notFound } from 'next/navigation';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { DocumentPageClient } from './DocumentPageClient';
import type { DocumentContent, DocumentType, DocumentStatus } from '@/types/documents';

export default async function DocumentPage({ params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  const doc = await prisma.document.findFirst({
    where: { id: params.id, userId: session.user.id },
  });

  if (!doc) notFound();

  const serialized = {
    id: doc.id,
    title: doc.title,
    type: doc.type as DocumentType,
    wordCount: doc.wordCount,
    pageCount: doc.pageCount,
    status: doc.status as DocumentStatus,
    agentUsed: doc.agentUsed,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
    content: doc.content as unknown as DocumentContent,
  };

  return <DocumentPageClient document={serialized} />;
}
