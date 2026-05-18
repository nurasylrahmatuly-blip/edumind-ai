'use client';

import { useState } from "react";
import { Plus } from "lucide-react";

interface PromoCode {
  id: string;
  code: string;
  plan: string;
  months: number;
  isUsed: boolean;
  usedAt: string | null;
  createdAt: string;
  usedBy: { email: string; name: string | null } | null;
}

interface Props {
  initialCodes: PromoCode[];
}

const planLabels: Record<string, string> = { pro: "Student Pro", academic: "Academic+" };

export function PromoCodesClient({ initialCodes }: Props) {
  const [codes, setCodes] = useState(initialCodes);
  const [filterPlan, setFilterPlan] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [generating, setGenerating] = useState(false);
  const [genPlan, setGenPlan] = useState<"pro" | "academic">("pro");
  const [genCount, setGenCount] = useState("20");

  const filtered = codes.filter((c) => {
    if (filterPlan !== "all" && c.plan !== filterPlan) return false;
    if (filterStatus === "free" && c.isUsed) return false;
    if (filterStatus === "used" && !c.isUsed) return false;
    return true;
  });

  const freeCount = codes.filter((c) => !c.isUsed).length;
  const usedCount = codes.filter((c) => c.isUsed).length;

  async function handleGenerate() {
    setGenerating(true);
    try {
      const res = await fetch("/api/admin/promo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: genPlan, count: parseInt(genCount), months: 1 }),
      });
      const data = await res.json();
      if (data.created) {
        const newCodes: PromoCode[] = data.created.map((code: string) => ({
          id: Date.now() + code,
          code,
          plan: genPlan,
          months: 1,
          isUsed: false,
          usedAt: null,
          createdAt: new Date().toISOString(),
          usedBy: null,
        }));
        setCodes((prev) => [...prev, ...newCodes]);
      }
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: 24, fontWeight: 800, color: "#fff", marginBottom: 4 }}>
            Промокоды
          </h1>
          <div style={{ display: "flex", gap: 16 }}>
            <span style={{ fontFamily: "monospace", fontSize: 12, color: "#b8f727" }}>{freeCount} свободных</span>
            <span style={{ fontFamily: "monospace", fontSize: 12, color: "#6b7280" }}>{usedCount} использовано</span>
          </div>
        </div>
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          background: "#0d1117", border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 12, padding: "12px 16px",
        }}>
          <select
            value={genPlan}
            onChange={(e) => setGenPlan(e.target.value as "pro" | "academic")}
            style={{
              background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 8, color: "#fff", fontFamily: "Inter, sans-serif", fontSize: 12,
              padding: "6px 10px", outline: "none",
            }}
          >
            <option value="pro">Student Pro</option>
            <option value="academic">Academic+</option>
          </select>
          <input
            type="number"
            value={genCount}
            onChange={(e) => setGenCount(e.target.value)}
            min={1} max={100}
            style={{
              width: 60, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 8, color: "#fff", fontFamily: "monospace", fontSize: 12,
              padding: "6px 10px", outline: "none",
            }}
          />
          <button
            onClick={handleGenerate}
            disabled={generating}
            style={{
              display: "flex", alignItems: "center", gap: 5,
              background: "#b8f727", color: "#070809",
              border: "none", borderRadius: 8, padding: "7px 14px",
              fontFamily: "Syne, sans-serif", fontSize: 12, fontWeight: 700, cursor: "pointer",
            }}
          >
            <Plus size={13} /> {generating ? "…" : "Создать"}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 6 }}>
          {["all", "pro", "academic"].map((p) => (
            <button
              key={p}
              onClick={() => setFilterPlan(p)}
              style={{
                padding: "5px 12px", borderRadius: 7, border: "1px solid",
                borderColor: filterPlan === p ? "#b8f727" : "rgba(255,255,255,0.1)",
                background: filterPlan === p ? "rgba(184,247,39,0.1)" : "transparent",
                color: filterPlan === p ? "#b8f727" : "#9ca3af",
                fontFamily: "Inter, sans-serif", fontSize: 11, cursor: "pointer",
              }}
            >
              {{ all: "Все тарифы", pro: "Student Pro", academic: "Academic+" }[p]}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {["all", "free", "used"].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              style={{
                padding: "5px 12px", borderRadius: 7, border: "1px solid",
                borderColor: filterStatus === s ? "#b8f727" : "rgba(255,255,255,0.1)",
                background: filterStatus === s ? "rgba(184,247,39,0.1)" : "transparent",
                color: filterStatus === s ? "#b8f727" : "#9ca3af",
                fontFamily: "Inter, sans-serif", fontSize: 11, cursor: "pointer",
              }}
            >
              {{ all: "Все", free: "Свободные", used: "Использованные" }[s]}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{ background: "#0d1117", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              {["Код", "Тариф", "Месяцы", "Статус", "Кому выдан", "Дата"].map((h) => (
                <th key={h} style={{
                  padding: "10px 14px", textAlign: "left",
                  fontFamily: "monospace", fontSize: 10, color: "#6b7280",
                  textTransform: "uppercase", letterSpacing: "0.08em",
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((code) => (
              <tr key={code.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <td style={{ padding: "10px 14px" }}>
                  <span style={{
                    fontFamily: "monospace", fontSize: 13, fontWeight: 700,
                    color: code.isUsed ? "#6b7280" : "#b8f727",
                  }}>
                    {code.code}
                  </span>
                </td>
                <td style={{ padding: "10px 14px", fontFamily: "Inter, sans-serif", fontSize: 12, color: "#9ca3af" }}>
                  {planLabels[code.plan] ?? code.plan}
                </td>
                <td style={{ padding: "10px 14px", fontFamily: "monospace", fontSize: 12, color: "#9ca3af", textAlign: "center" }}>
                  {code.months}
                </td>
                <td style={{ padding: "10px 14px" }}>
                  <span style={{
                    display: "inline-block", padding: "3px 8px", borderRadius: 6, fontSize: 10,
                    fontFamily: "monospace", fontWeight: 700,
                    background: code.isUsed ? "rgba(107,114,128,0.15)" : "rgba(184,247,39,0.1)",
                    color: code.isUsed ? "#6b7280" : "#b8f727",
                    border: `1px solid ${code.isUsed ? "rgba(107,114,128,0.3)" : "rgba(184,247,39,0.3)"}`,
                  }}>
                    {code.isUsed ? "Использован" : "Свободен"}
                  </span>
                </td>
                <td style={{ padding: "10px 14px", fontFamily: "Inter, sans-serif", fontSize: 12, color: "#9ca3af" }}>
                  {code.usedBy ? (
                    <span>
                      {code.usedBy.name ?? code.usedBy.email}
                      <br />
                      <span style={{ fontFamily: "monospace", fontSize: 10, color: "#6b7280" }}>{code.usedBy.email}</span>
                    </span>
                  ) : "—"}
                </td>
                <td style={{ padding: "10px 14px", fontFamily: "monospace", fontSize: 10, color: "#6b7280" }}>
                  {code.usedAt
                    ? new Date(code.usedAt).toLocaleDateString("ru-RU")
                    : new Date(code.createdAt).toLocaleDateString("ru-RU")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{ padding: "40px", textAlign: "center", color: "#6b7280", fontFamily: "Inter, sans-serif", fontSize: 13 }}>
            Нет промокодов
          </div>
        )}
      </div>
    </div>
  );
}
