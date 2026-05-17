'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, FileText, Trash2, CheckCircle } from 'lucide-react';

interface UploadedSource {
  sourceId: string;
  fileName: string;
  chunkCount: number;
}

interface PDFUploadProps {
  onUploaded?: (source: UploadedSource) => void;
  existingSources?: UploadedSource[];
  onDelete?: (sourceId: string) => void;
}

export function PDFUpload({ onUploaded, existingSources = [], onDelete }: PDFUploadProps) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [lastUploaded, setLastUploaded] = useState<UploadedSource | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      alert('Только PDF файлы поддерживаются');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('Файл слишком большой (макс. 10 МБ)');
      return;
    }

    setUploading(true);
    setProgress(10);

    const formData = new FormData();
    formData.append('file', file);

    try {
      setProgress(30);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      setProgress(80);

      if (!res.ok) throw new Error(await res.text());

      const data = await res.json() as UploadedSource & { documentId: string; fileSize: number };
      const source: UploadedSource = {
        sourceId: data.documentId,
        fileName: data.fileName ?? file.name,
        chunkCount: data.chunkCount,
      };
      setLastUploaded(source);
      setProgress(100);
      onUploaded?.(source);
    } catch (err) {
      console.error('Upload error:', err);
      alert('Ошибка загрузки. Попробуйте снова.');
    } finally {
      setTimeout(() => { setUploading(false); setProgress(0); }, 800);
    }
  }, [onUploaded]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) uploadFile(file);
  }, [uploadFile]);

  const handleDelete = async (sourceId: string) => {
    if (!confirm('Удалить источник из базы знаний?')) return;
    await fetch('/api/upload', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sourceId }),
    });
    onDelete?.(sourceId);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Drop zone */}
      <div
        className={`upload-zone${dragging ? ' dragging' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => !uploading && inputRef.current?.click()}
        style={{ padding: 40 }}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf"
          style={{ display: 'none' }}
          onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadFile(f); }}
        />

        {uploading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-lg)', background: 'var(--lime-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Upload size={22} style={{ color: 'var(--lime)', animation: 'float 1s ease-in-out infinite' }} />
            </div>
            <div style={{ width: '100%', maxWidth: 240, height: 4, background: 'var(--bg-hover)', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ height: '100%', background: 'var(--lime)', width: `${progress}%`, transition: 'width 0.3s ease', borderRadius: 2 }} />
            </div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--lime-text)' }}>
              Обрабатываем PDF... {progress}%
            </p>
          </div>
        ) : lastUploaded && progress === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <CheckCircle size={40} style={{ color: 'var(--lime)' }} />
            <p style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, color: 'var(--white)' }}>
              Загружено успешно!
            </p>
            <span className="badge badge-lime">{lastUploaded.chunkCount} фрагментов</span>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--white-muted)' }}>
              Нажми чтобы загрузить ещё
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-lg)', background: 'var(--bg-hover)', border: '1px solid var(--border-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Upload size={22} style={{ color: 'var(--white-dim)' }} />
            </div>
            <div>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 600, color: 'var(--white)', marginBottom: 4 }}>
                Перетащи PDF или нажми
              </p>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--white-muted)' }}>
                PDF · макс. 10 МБ · текст извлекается автоматически
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Existing sources */}
      {existingSources.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--white-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Источники в базе знаний
          </p>
          {existingSources.map((src) => (
            <div key={src.sourceId} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'var(--bg-raised)', border: '1px solid var(--border-soft)', borderRadius: 'var(--radius-md)' }}>
              <FileText size={15} style={{ color: 'var(--lime)', flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--white)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {src.fileName}
                </p>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--white-muted)', marginTop: 2 }}>
                  {src.chunkCount} фрагментов
                </p>
              </div>
              <button
                onClick={() => handleDelete(src.sourceId)}
                className="btn-icon"
                style={{ width: 26, height: 26, flexShrink: 0 }}
              >
                <Trash2 size={12} style={{ color: '#fb7185' }} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
