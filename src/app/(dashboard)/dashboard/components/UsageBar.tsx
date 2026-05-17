'use client';

import Link from "next/link";
import { Zap } from "lucide-react";

interface UsageBarProps {
  used: number;
  limit: number;
  plan: string;
}

export function UsageBar({ used, limit, plan }: UsageBarProps) {
  const isUnlimited = limit === -1;
  const pct = isUnlimited ? 0 : Math.min((used / limit) * 100, 100);
  const nearLimit = !isUnlimited && pct >= 80;

  return (
    <div
      style={{
        background: "var(--bg-raised)",
        border: `1px solid ${nearLimit ? "var(--border-lime)" : "var(--border-dim)"}`,
        borderRadius: "var(--radius-lg)",
        padding: "18px 22px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--white-muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
          Использование API
        </span>
        {plan === "free" && (
          <Link href="/pricing" className="btn-primary btn-sm" style={{ gap: 5 }}>
            <Zap size={11} /> Обновить до Pro
          </Link>
        )}
      </div>

      {isUnlimited ? (
        <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, color: "var(--lime)" }}>
          Безлимит ✦
        </div>
      ) : (
        <>
          <div style={{ height: 6, background: "var(--bg-hover)", borderRadius: "var(--radius-pill)", overflow: "hidden", marginBottom: 8 }}>
            <div
              style={{
                height: "100%",
                width: `${pct}%`,
                background: nearLimit ? "var(--lime)" : "var(--lime-muted)",
                borderRadius: "var(--radius-pill)",
                transition: "width 0.4s ease",
                boxShadow: nearLimit ? "0 0 8px var(--lime-glow)" : "none",
              }}
            />
          </div>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: nearLimit ? "var(--lime-text)" : "var(--white-muted)" }}>
            {used} из {limit} запросов
          </span>
        </>
      )}
    </div>
  );
}
