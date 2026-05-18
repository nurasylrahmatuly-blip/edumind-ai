'use client';

import { useEffect, useRef, useState } from "react";
import { X, Copy, Check } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  refCode: string;
  ambassadorName: string;
  discount: number;
  onClose: () => void;
}

const PRO_PRICE = 4990;
const ACADEMIC_PRICE = 9990;

function discounted(price: number, pct: number) {
  return Math.round(price * (1 - pct / 100));
}

export function ReferralPopup({ refCode, ambassadorName, discount, onClose }: Props) {
  const router = useRouter();
  const [counter, setCounter] = useState(0);
  const [copied, setCopied] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const step = discount / 40;
    let current = 0;
    intervalRef.current = setInterval(() => {
      current += step;
      if (current >= discount) {
        current = discount;
        clearInterval(intervalRef.current!);
      }
      setCounter(Math.round(current));
    }, 25);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [discount]);

  function handleCopy() {
    navigator.clipboard.writeText(refCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleCTA() {
    onClose();
    router.push(`/upgrade?ref=${refCode}`);
  }

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(0,0,0,0.85)",
        backdropFilter: "blur(6px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "16px",
        animation: "fadeIn 0.3s ease-out",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes modalIn { from { opacity: 0; transform: scale(0.85) translateY(20px) } to { opacity: 1; transform: scale(1) translateY(0) } }
        @keyframes float { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-8px) } }
        @keyframes glowPulse { 0%,100% { box-shadow: 0 0 40px rgba(184,247,39,0.12) } 50% { box-shadow: 0 0 70px rgba(184,247,39,0.28) } }
      `}</style>

      <div
        style={{
          position: "relative",
          maxWidth: 440, width: "100%",
          background: "#0d1117",
          border: "1px solid rgba(184,247,39,0.3)",
          borderRadius: 20,
          padding: "36px 32px",
          animation: "modalIn 0.4s ease-out, glowPulse 3s ease-in-out infinite",
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: 16, right: 16,
            background: "rgba(255,255,255,0.06)", border: "none", borderRadius: 8,
            width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", color: "#6b7280",
          }}
        >
          <X size={16} />
        </button>

        {/* Gift icon */}
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 52, animation: "float 3s ease-in-out infinite", display: "inline-block" }}>
            🎁
          </div>
        </div>

        {/* Labels */}
        <div style={{ textAlign: "center", marginBottom: 8 }}>
          <span style={{
            fontFamily: "monospace", fontSize: 11, color: "#b8f727",
            letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 600,
          }}>
            ЭКСКЛЮЗИВНО ДЛЯ ТЕБЯ
          </span>
        </div>

        <h2 style={{
          textAlign: "center", fontFamily: "Syne, sans-serif",
          fontSize: 26, fontWeight: 700, color: "#fff", marginBottom: 6, lineHeight: 1.2,
        }}>
          Тебе подарили скидку
        </h2>

        {/* Big counter */}
        <div style={{ textAlign: "center", marginBottom: 10 }}>
          <span style={{
            fontFamily: "Syne, sans-serif", fontSize: 72, fontWeight: 800,
            color: "#b8f727", lineHeight: 1,
            textShadow: "0 0 30px rgba(184,247,39,0.4)",
          }}>
            −{counter}%
          </span>
        </div>

        <p style={{
          textAlign: "center", fontFamily: "Inter, sans-serif",
          fontSize: 13, color: "#9ca3af", marginBottom: 20,
        }}>
          {ambassadorName} поделился этой ссылкой специально для тебя
        </p>

        {/* Divider */}
        <div style={{
          borderTop: "1px dashed rgba(184,247,39,0.3)",
          marginBottom: 20,
        }} />

        {/* Price preview */}
        <div style={{ marginBottom: 16, display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#9ca3af" }}>
              Student Pro
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#6b7280", textDecoration: "line-through" }}>
                {PRO_PRICE.toLocaleString("ru-RU")} тг
              </span>
              <span style={{ fontFamily: "Syne, sans-serif", fontSize: 15, fontWeight: 700, color: "#b8f727" }}>
                {discounted(PRO_PRICE, discount).toLocaleString("ru-RU")} тг
              </span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#9ca3af" }}>
              Academic+
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#6b7280", textDecoration: "line-through" }}>
                {ACADEMIC_PRICE.toLocaleString("ru-RU")} тг
              </span>
              <span style={{ fontFamily: "Syne, sans-serif", fontSize: 15, fontWeight: 700, color: "#b8f727" }}>
                {discounted(ACADEMIC_PRICE, discount).toLocaleString("ru-RU")} тг
              </span>
            </div>
          </div>
        </div>

        <p style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: "#6b7280", textAlign: "center", marginBottom: 16 }}>
          Скидка применится автоматически при оплате
        </p>

        {/* Promo badge */}
        <div style={{
          background: "rgba(184,247,39,0.08)", border: "1px solid rgba(184,247,39,0.3)",
          borderRadius: 10, padding: "12px 16px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          marginBottom: 20,
        }}>
          <span style={{ fontFamily: "monospace", fontSize: 13, color: "#b8f727", fontWeight: 600 }}>
            🏷 Ваш промокод: {refCode}
          </span>
          <button
            onClick={handleCopy}
            style={{
              background: "rgba(184,247,39,0.15)", border: "1px solid rgba(184,247,39,0.3)",
              borderRadius: 6, padding: "4px 10px", cursor: "pointer",
              display: "flex", alignItems: "center", gap: 4,
              color: copied ? "#b8f727" : "#9ca3af", fontSize: 12,
            }}
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {copied ? "Скопировано" : "Копировать"}
          </button>
        </div>

        {/* CTA */}
        <button
          onClick={handleCTA}
          style={{
            width: "100%",
            background: "#b8f727", color: "#070809",
            border: "none", borderRadius: 14, padding: "16px",
            fontFamily: "Syne, sans-serif", fontSize: 16, fontWeight: 700,
            cursor: "pointer", marginBottom: 12,
            transition: "transform 0.15s, box-shadow 0.15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 8px 30px rgba(184,247,39,0.35)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          Получить со скидкой →
        </button>

        {/* Footer */}
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: "#6b7280", textAlign: "center" }}>
          ⚡ Предложение только по этой ссылке
        </p>
      </div>
    </div>
  );
}
