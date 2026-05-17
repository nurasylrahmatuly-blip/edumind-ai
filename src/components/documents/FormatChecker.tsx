'use client';

import { useState } from 'react';
import { CheckCircle, AlertTriangle, Info, Loader2, ClipboardCheck } from 'lucide-react';
import type { FormattingIssue } from '@/types/documents';

interface FormatCheckerProps {
  content: string;
}

function parseIssues(text: string): FormattingIssue[] {
  const lines = text.split('\n').filter((l) => l.trim());
  return lines
    .filter((l) => /\[CRITICAL\]|\[WARNING\]|\[INFO\]/.test(l))
    .map((line) => {
      const typeMatch = /\[(CRITICAL|WARNING|INFO)\]/.exec(line);
      const type = (typeMatch?.[1]?.toLowerCase() ?? 'info') as FormattingIssue['type'];
      const rest = line.replace(/\[(?:CRITICAL|WARNING|INFO)\]:\s*/, '');
      const parts = rest.split('—');
      return {
        type,
        description: parts[0]?.trim() ?? rest,
        suggestion: parts[1]?.trim() ?? 'Исправьте данную проблему',
      };
    });
}

const ISSUE_STYLES: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
  critical: {
    icon: <AlertTriangle className="h-4 w-4 shrink-0" />,
    color: 'text-red-400',
    bg: 'bg-red-500/10 border-red-500/20',
  },
  warning: {
    icon: <AlertTriangle className="h-4 w-4 shrink-0" />,
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10 border-yellow-500/20',
  },
  info: {
    icon: <Info className="h-4 w-4 shrink-0" />,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/20',
  },
};

export function FormatChecker({ content }: FormatCheckerProps) {
  const [issues, setIssues] = useState<FormattingIssue[]>([]);
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);

  const handleCheck = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Проверь следующий текст на соответствие ГОСТ 7.32-2017 и укажи проблемы форматирования:\n\n${content.slice(0, 3000)}`,
          agentOverride: 'FORMAT',
        }),
      });

      if (res.ok && res.body) {
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let text = '';
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          text += decoder.decode(value, { stream: true });
        }
        const parsed = parseIssues(text);
        setIssues(parsed.length > 0 ? parsed : [
          { type: 'info', description: 'Явных нарушений ГОСТ не обнаружено', suggestion: 'Документ соответствует базовым требованиям' },
        ]);
        setChecked(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const critical = issues.filter((i) => i.type === 'critical').length;
  const warnings = issues.filter((i) => i.type === 'warning').length;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">Проверка ГОСТ</h3>
        {checked && (
          <span className="text-[11px] text-[#6B7280]">
            {critical} крит. · {warnings} предупр.
          </span>
        )}
      </div>

      {!checked ? (
        <button
          onClick={handleCheck}
          disabled={loading || !content}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#F5A623]/30 bg-[#F5A623]/10 py-2.5 text-sm font-medium text-[#F5A623] transition-colors hover:bg-[#F5A623]/20 disabled:opacity-60"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ClipboardCheck className="h-4 w-4" />
          )}
          {loading ? 'Проверяем...' : 'Проверить по ГОСТ 7.32-2017'}
        </button>
      ) : (
        <div className="space-y-2">
          {issues.map((issue, i) => {
            const style = ISSUE_STYLES[issue.type];
            return (
              <div key={i} className={`rounded-lg border p-3 ${style.bg}`}>
                <div className={`flex items-start gap-2 ${style.color}`}>
                  {style.icon}
                  <div className="flex-1">
                    <p className="text-xs font-medium">{issue.description}</p>
                    <p className="mt-0.5 text-[11px] opacity-80">{issue.suggestion}</p>
                  </div>
                </div>
              </div>
            );
          })}

          {issues.length === 1 && issues[0].type === 'info' && (
            <div className="flex items-center gap-2 text-[#2DD4A0]">
              <CheckCircle className="h-4 w-4" />
              <span className="text-xs">Документ соответствует ГОСТ</span>
            </div>
          )}

          <button
            onClick={() => { setChecked(false); setIssues([]); }}
            className="text-xs text-[#6B7280] hover:text-white transition-colors"
          >
            Проверить снова
          </button>
        </div>
      )}
    </div>
  );
}
