'use client';

import { useState } from "react";
import Link from "next/link";
import { Zap, X } from "lucide-react";

interface UpgradeBannerProps {
  used: number;
  limit: number;
  plan: string;
}

export function UpgradeBanner({ used, limit, plan }: UpgradeBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;
  if (plan !== "FREE") return null;
  if (limit <= 0) return null;

  const pct = (used / limit) * 100;
  if (pct < 80) return null;

  const remaining = limit - used;

  return (
    <div
      style={{
        background: "var(--lime-dim)",
        border: "1px solid var(--border-lime)",
        borderRadius: "var(--radius-md)",
        padding: "12px 16px",
        display: "flex",
        alignItems: "center",
        gap: 12,
        margin: "0 0 16px",
      }}
    >
      <Zap size={15} style={{ color: "var(--lime)", flexShrink: 0 }} />
      <p style={{ flex: 1, fontFamily: "var(--font-ui)", fontSize: 13, color: "var(--lime-text)" }}>
        {remaining <= 0
          ? "Лимит запросов исчерпан на сегодня."
          : `Осталось ${remaining} запросов из ${limit}.`}{" "}
        <Link href="/pricing" style={{ color: "var(--lime)", fontWeight: 600, textDecoration: "underline" }}>
          Обновись до Pro →
        </Link>
      </p>
      <button
        onClick={() => setDismissed(true)}
        style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--lime-text)", padding: 2, flexShrink: 0, display: "flex" }}
      >
        <X size={14} />
      </button>
    </div>
  );
}
