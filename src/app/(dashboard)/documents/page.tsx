import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { Plus, FileText, Hash, Download } from 'lucide-react';
import { DocumentsClientShell } from './DocumentsClientShell';
import type { DocumentType, DocumentStatus } from '@/types/documents';

export const metadata: Metadata = {
  title: 'Документы',
  description: 'Создавай академические документы по ГОСТ — курсовые, рефераты, дипломные',
};

export default async function DocumentsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  const documents = await prisma.document.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      type: true,
      wordCount: true,
      pageCount: true,
      status: true,
      agentUsed: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  const totalWords = documents.reduce((acc, d) => acc + d.wordCount, 0);
  const exportedCount = documents.filter((d) => d.status === 'exported').length;

  const serialized = documents.map((d) => ({
    ...d,
    type: d.type as DocumentType,
    status: d.status as DocumentStatus,
    createdAt: d.createdAt.toISOString(),
    updatedAt: d.updatedAt.toISOString(),
  }));

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-border px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Мои документы</h1>
            <p className="mt-1 text-sm text-[#6B7280]">Академические работы, созданные с AI</p>
          </div>
          <Link
            href="/documents/new"
            className="flex items-center gap-2 rounded-xl bg-[#F5A623] px-4 py-2.5 text-sm font-semibold text-[#0D0F14] transition-opacity hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            Создать документ
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          {[
            { label: 'Документов', value: documents.length, icon: FileText },
            { label: 'Слов написано', value: totalWords.toLocaleString('ru-RU'), icon: Hash },
            { label: 'Экспортировано', value: exportedCount, icon: Download },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="rounded-xl border border-white/8 bg-[#131620] p-4">
                <div className="flex items-center gap-2 text-[#6B7280]">
                  <Icon className="h-4 w-4" />
                  <span className="text-xs">{stat.label}</span>
                </div>
                <p className="mt-2 text-2xl font-bold text-white">{stat.value}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-8">
        <DocumentsClientShell initialDocuments={serialized} />
      </div>
    </div>
  );
}
