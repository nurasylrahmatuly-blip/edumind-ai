'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { DocumentCard } from '@/components/documents/DocumentCard';
import type { DocumentMeta } from '@/types/documents';

interface DocumentsClientShellProps {
  initialDocuments: DocumentMeta[];
}

export function DocumentsClientShell({ initialDocuments }: DocumentsClientShellProps) {
  const [documents, setDocuments] = useState<DocumentMeta[]>(initialDocuments);

  const handleDelete = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  if (documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#F5A623]/10 text-4xl mb-6">
          ✍️
        </div>
        <h2 className="text-xl font-semibold text-white">Нет документов</h2>
        <p className="mt-2 max-w-sm text-sm text-[#6B7280]">
          Создайте свою первую академическую работу с помощью AI — реферат, курсовую или дипломную.
        </p>
        <Link
          href="/documents/new"
          className="mt-6 flex items-center gap-2 rounded-xl bg-[#F5A623] px-6 py-3 text-sm font-semibold text-[#0D0F14] transition-opacity hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Создать документ
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {documents.map((doc) => (
        <DocumentCard key={doc.id} document={doc} onDelete={handleDelete} />
      ))}
    </div>
  );
}
