'use client';

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Copy, Check, MessageCircle, CheckCircle2, ChevronRight } from "lucide-react";

const KASPI_PHONE = "87758658670";
const KASPI_CARD = "4400 4300 5310 2494";
const KASPI_PHONE_DISPLAY = "8 775 865 8670";

const BASE_PRICES: Record<string, number> = { pro: 4990, academic: 9990 };
const PLAN_LABELS: Record<string, string> = { pro: "Student Pro", academic: "Academic+" };
const DURATIONS = [
  { months: 1, label: "1 мес", discount: 0 },
  { months: 3, label: "3 мес", discount: 10 },
  { months: 6, label: "6 мес", discount: 20 },
  { months: 12, label: "12 мес", discount: 30 },
];

function calcPrice(plan: string, months: number, refDiscount: number) {
  const base = BASE_PRICES[plan] ?? 4990;
  const dur = DURATIONS.find((d) => d.months === months);
  const durationDiscount = dur?.discount ?? 0;
  const total = base * months;
  const afterDuration = Math.round(total * (1 - durationDiscount / 100));
  const finalAmount = Math.round(afterDuration * (1 - refDiscount / 100));
  return { total, afterDuration, finalAmount, durationDiscount };
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      style={{
        background: "rgba(184,247,39,0.1)", border: "1px solid rgba(184,247,39,0.3)",
        borderRadius: 8, padding: "6px 12px", cursor: "pointer",
        display: "flex", alignItems: "center", gap: 5,
        color: copied ? "#b8f727" : "#9ca3af", fontSize: 12,
        fontFamily: "monospace", transition: "all 0.15s",
      }}
    >
      {copied ? <Check size={12} /> : <Copy size={12} />}
      {copied ? "Скопировано" : "Копировать"}
    </button>
  );
}

function UpgradeInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const urlRef = searchParams.get("ref");

  const [step, setStep] = useState(1);
  const [plan, setPlan] = useState<"pro" | "academic">("pro");
  const [months, setMonths] = useState(1);
  const [refCode, setRefCode] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    requestId: string; fullRequestId: string; finalAmount: number; whatsapp: string;
  } | null>(null);

  useEffect(() => {
    const stored = urlRef ?? localStorage.getItem("edumind_ref");
    if (stored) setRefCode(stored.toUpperCase());
  }, [urlRef]);

  const refDiscount = refCode ? 15 : 0;
  const { total, finalAmount, durationDiscount } = calcPrice(plan, months, refDiscount);

  async function handlePayment() {
    setLoading(true);
    try {
      const res = await fetch("/api/payment/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, months, refCode, customerName: name, customerPhone: phone }),
      });
      const data = await res.json();
      if (data.requestId) {
        setResult(data);
        localStorage.removeItem("edumind_ref");
        setStep(4);
      }
    } finally {
      setLoading(false);
    }
  }

  const stepLabels = ["Тариф", "Контакты", "Оплата", "Готово"];

  return (
    <div style={{ minHeight: "100vh", background: "#070809", padding: "40px 24px", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ maxWidth: 560, width: "100%" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: 32, fontWeight: 800, color: "#fff", marginBottom: 6 }}>
            Оплата через Kaspi
          </h1>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: "#6b7280" }}>
            Быстро и безопасно — активация в течение 1-2 часов
          </p>
        </div>

        {/* Step indicator */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0, marginBottom: 36 }}>
          {stepLabels.map((label, i) => {
            const num = i + 1;
            const active = num === step;
            const done = num < step;
            return (
              <div key={label} style={{ display: "flex", alignItems: "center" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: "50%",
                    background: done ? "#b8f727" : active ? "rgba(184,247,39,0.15)" : "rgba(255,255,255,0.06)",
                    border: `2px solid ${done || active ? "#b8f727" : "rgba(255,255,255,0.1)"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "Syne, sans-serif", fontSize: 13, fontWeight: 700,
                    color: done ? "#070809" : active ? "#b8f727" : "#6b7280",
                  }}>
                    {done ? <Check size={14} /> : num}
                  </div>
                  <span style={{ fontSize: 10, color: active ? "#b8f727" : "#6b7280", fontFamily: "Inter, sans-serif" }}>
                    {label}
                  </span>
                </div>
                {i < stepLabels.length - 1 && (
                  <div style={{ width: 40, height: 1, background: done ? "#b8f727" : "rgba(255,255,255,0.08)", marginBottom: 16, marginTop: -4 }} />
                )}
              </div>
            );
          })}
        </div>

        {/* STEP 1 — Plan & Duration */}
        {step === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {refCode && (
              <div style={{
                background: "rgba(184,247,39,0.08)", border: "1px solid rgba(184,247,39,0.3)",
                borderRadius: 12, padding: "14px 18px",
                display: "flex", alignItems: "center", gap: 10,
              }}>
                <span style={{ fontSize: 18 }}>🏷</span>
                <div>
                  <p style={{ fontFamily: "Syne, sans-serif", fontSize: 13, fontWeight: 700, color: "#b8f727", margin: 0 }}>
                    Скидка 15% по промокоду {refCode} применена!
                  </p>
                  <p style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: "#6b7280", margin: 0, marginTop: 2 }}>
                    Цены ниже уже со скидкой амбассадора
                  </p>
                </div>
              </div>
            )}

            {/* Plan cards */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {(["pro", "academic"] as const).map((p) => {
                const { finalAmount } = calcPrice(p, months, refDiscount);
                const base = BASE_PRICES[p];
                const sel = plan === p;
                return (
                  <button
                    key={p}
                    onClick={() => setPlan(p)}
                    style={{
                      background: sel ? "rgba(184,247,39,0.08)" : "rgba(255,255,255,0.03)",
                      border: `2px solid ${sel ? "#b8f727" : "rgba(255,255,255,0.08)"}`,
                      borderRadius: 14, padding: "20px 16px", cursor: "pointer",
                      textAlign: "left", transition: "all 0.15s",
                    }}
                  >
                    {p === "pro" && (
                      <div style={{
                        display: "inline-block", background: "#b8f727", color: "#070809",
                        fontSize: 9, fontFamily: "monospace", fontWeight: 700,
                        padding: "2px 7px", borderRadius: 4, marginBottom: 10,
                        letterSpacing: "0.1em",
                      }}>
                        ПОПУЛЯРНЫЙ
                      </div>
                    )}
                    <p style={{ fontFamily: "Syne, sans-serif", fontSize: 16, fontWeight: 700, color: "#fff", margin: "0 0 6px" }}>
                      {PLAN_LABELS[p]}
                    </p>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                      {refCode && (
                        <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "#6b7280", textDecoration: "line-through" }}>
                          {base.toLocaleString("ru-RU")} тг
                        </span>
                      )}
                      <span style={{ fontFamily: "Syne, sans-serif", fontSize: 22, fontWeight: 800, color: sel ? "#b8f727" : "#fff" }}>
                        {finalAmount.toLocaleString("ru-RU")} тг
                      </span>
                    </div>
                    <span style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: "#6b7280" }}>/ месяц</span>
                  </button>
                );
              })}
            </div>

            {/* Duration tabs */}
            <div>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "#6b7280", marginBottom: 8 }}>Период</p>
              <div style={{ display: "flex", gap: 8 }}>
                {DURATIONS.map((d) => {
                  const { finalAmount: fa } = calcPrice(plan, d.months, refDiscount);
                  const sel = months === d.months;
                  return (
                    <button
                      key={d.months}
                      onClick={() => setMonths(d.months)}
                      style={{
                        flex: 1, padding: "10px 4px",
                        background: sel ? "rgba(184,247,39,0.1)" : "rgba(255,255,255,0.03)",
                        border: `1px solid ${sel ? "#b8f727" : "rgba(255,255,255,0.08)"}`,
                        borderRadius: 10, cursor: "pointer",
                        fontFamily: "Syne, sans-serif", fontSize: 12, fontWeight: sel ? 700 : 500,
                        color: sel ? "#b8f727" : "#9ca3af",
                        transition: "all 0.15s",
                      }}
                    >
                      <div>{d.label}</div>
                      {d.discount > 0 && (
                        <div style={{ fontSize: 9, color: "#b8f727", marginTop: 2 }}>−{d.discount}%</div>
                      )}
                      <div style={{ fontSize: 11, color: sel ? "#fff" : "#6b7280", marginTop: 3 }}>
                        {fa.toLocaleString("ru-RU")} тг
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Summary */}
            <div style={{
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 12, padding: "16px",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#9ca3af" }}>
                  {PLAN_LABELS[plan]} × {months} мес.
                </span>
                <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#fff" }}>
                  {total.toLocaleString("ru-RU")} тг
                </span>
              </div>
              {durationDiscount > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#6b7280" }}>
                    Скидка за период −{durationDiscount}%
                  </span>
                  <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#b8f727" }}>
                    −{(total - Math.round(total * (1 - durationDiscount / 100))).toLocaleString("ru-RU")} тг
                  </span>
                </div>
              )}
              {refDiscount > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#6b7280" }}>
                    Скидка амбассадора −{refDiscount}%
                  </span>
                  <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#b8f727" }}>
                    −{(Math.round(total * (1 - durationDiscount / 100)) - finalAmount).toLocaleString("ru-RU")} тг
                  </span>
                </div>
              )}
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", marginTop: 8, paddingTop: 8, display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontFamily: "Syne, sans-serif", fontSize: 15, fontWeight: 700, color: "#fff" }}>Итого</span>
                <span style={{ fontFamily: "Syne, sans-serif", fontSize: 20, fontWeight: 800, color: "#b8f727" }}>
                  {finalAmount.toLocaleString("ru-RU")} тг
                </span>
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              style={{
                width: "100%", background: "#b8f727", color: "#070809",
                border: "none", borderRadius: 14, padding: "16px",
                fontFamily: "Syne, sans-serif", fontSize: 16, fontWeight: 700,
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              }}
            >
              Продолжить <ChevronRight size={18} />
            </button>
          </div>
        )}

        {/* STEP 2 — Contact info */}
        {step === 2 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 14, padding: 20,
            }}>
              <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 16 }}>
                Ваши контакты
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <label style={{ fontFamily: "monospace", fontSize: 11, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: 6 }}>
                    Имя
                  </label>
                  <input
                    value={name} onChange={(e) => setName(e.target.value)}
                    placeholder="Ваше имя"
                    style={{
                      width: "100%", padding: "12px 14px",
                      background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 10, color: "#fff", fontFamily: "Inter, sans-serif", fontSize: 14,
                      outline: "none", boxSizing: "border-box",
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontFamily: "monospace", fontSize: 11, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: 6 }}>
                    Телефон
                  </label>
                  <input
                    value={phone} onChange={(e) => setPhone(e.target.value)}
                    placeholder="+7 777 000 0000"
                    style={{
                      width: "100%", padding: "12px 14px",
                      background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 10, color: "#fff", fontFamily: "Inter, sans-serif", fontSize: 14,
                      outline: "none", boxSizing: "border-box",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Summary card */}
            <div style={{
              background: "rgba(184,247,39,0.06)", border: "1px solid rgba(184,247,39,0.2)",
              borderRadius: 12, padding: 16,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  <p style={{ fontFamily: "Syne, sans-serif", fontSize: 14, fontWeight: 700, color: "#fff", margin: 0 }}>{PLAN_LABELS[plan]}</p>
                  <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "#6b7280", margin: "4px 0 0" }}>{months} месяц(ев)</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontFamily: "Syne, sans-serif", fontSize: 22, fontWeight: 800, color: "#b8f727", margin: 0 }}>
                    {finalAmount.toLocaleString("ru-RU")} тг
                  </p>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setStep(1)}
                style={{
                  flex: "0 0 auto", padding: "14px 20px",
                  background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 12, cursor: "pointer", color: "#9ca3af",
                  fontFamily: "Syne, sans-serif", fontSize: 14,
                }}
              >
                Назад
              </button>
              <button
                onClick={() => setStep(3)}
                style={{
                  flex: 1, background: "#b8f727", color: "#070809",
                  border: "none", borderRadius: 12, padding: "14px",
                  fontFamily: "Syne, sans-serif", fontSize: 15, fontWeight: 700,
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                }}
              >
                Перейти к оплате <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 — Payment */}
        {step === 3 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 16, padding: 24,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                <span style={{ fontSize: 24 }}>💳</span>
                <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: 18, fontWeight: 700, color: "#fff", margin: 0 }}>
                  Оплата через Kaspi
                </h3>
              </div>

              <div style={{
                background: "rgba(184,247,39,0.08)", border: "1px solid rgba(184,247,39,0.25)",
                borderRadius: 12, padding: "16px", marginBottom: 20, textAlign: "center",
              }}>
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#9ca3af", margin: "0 0 6px" }}>
                  Сумма к переводу
                </p>
                <p style={{ fontFamily: "Syne, sans-serif", fontSize: 36, fontWeight: 800, color: "#b8f727", margin: 0 }}>
                  {finalAmount.toLocaleString("ru-RU")} тг
                </p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: "12px 14px",
                }}>
                  <div>
                    <p style={{ fontFamily: "monospace", fontSize: 10, color: "#6b7280", margin: "0 0 3px", textTransform: "uppercase" }}>📱 Номер Kaspi</p>
                    <p style={{ fontFamily: "monospace", fontSize: 16, fontWeight: 700, color: "#fff", margin: 0 }}>{KASPI_PHONE_DISPLAY}</p>
                  </div>
                  <CopyButton text={KASPI_PHONE} />
                </div>

                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: "12px 14px",
                }}>
                  <div>
                    <p style={{ fontFamily: "monospace", fontSize: 10, color: "#6b7280", margin: "0 0 3px", textTransform: "uppercase" }}>💳 Номер карты</p>
                    <p style={{ fontFamily: "monospace", fontSize: 16, fontWeight: 700, color: "#fff", margin: 0 }}>{KASPI_CARD}</p>
                  </div>
                  <CopyButton text={KASPI_CARD.replace(/\s/g, "")} />
                </div>
              </div>

              <div style={{
                margin: "20px 0",
                padding: "14px", background: "rgba(255,255,255,0.03)",
                borderRadius: 10, borderLeft: "3px solid rgba(184,247,39,0.4)",
              }}>
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#9ca3af", margin: 0 }}>
                  После оплаты отправьте скриншот чека в WhatsApp — мы активируем план
                </p>
              </div>

              <a
                href={`https://wa.me/${KASPI_PHONE}?text=${encodeURIComponent(`Хочу оплатить план ${PLAN_LABELS[plan]} на ${months} мес., сумма ${finalAmount} тг`)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  width: "100%", background: "#25D366", color: "#fff",
                  border: "none", borderRadius: 12, padding: "14px",
                  fontFamily: "Syne, sans-serif", fontSize: 15, fontWeight: 700,
                  textDecoration: "none", marginBottom: 12, boxSizing: "border-box",
                }}
              >
                <MessageCircle size={18} /> Написать в WhatsApp
              </a>

              <p style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: "#6b7280", textAlign: "center", margin: "0 0 16px" }}>
                ⏱ Активация в течение 1-2 часов
              </p>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setStep(2)}
                style={{
                  flex: "0 0 auto", padding: "14px 20px",
                  background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 12, cursor: "pointer", color: "#9ca3af",
                  fontFamily: "Syne, sans-serif", fontSize: 14,
                }}
              >
                Назад
              </button>
              <button
                onClick={handlePayment}
                disabled={loading}
                style={{
                  flex: 1, background: loading ? "rgba(184,247,39,0.5)" : "#b8f727", color: "#070809",
                  border: "none", borderRadius: 12, padding: "14px",
                  fontFamily: "Syne, sans-serif", fontSize: 15, fontWeight: 700,
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                {loading ? "Отправка…" : "Я оплатил — жду активацию ✓"}
              </button>
            </div>
          </div>
        )}

        {/* STEP 4 — Success */}
        {step === 4 && result && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
            <div style={{
              width: 80, height: 80, borderRadius: "50%",
              background: "rgba(184,247,39,0.12)", border: "2px solid #b8f727",
              display: "flex", alignItems: "center", justifyContent: "center",
              animation: "scaleIn 0.4s ease-out",
            }}>
              <CheckCircle2 size={40} color="#b8f727" />
            </div>
            <style>{`@keyframes scaleIn { from { transform: scale(0); opacity: 0 } to { transform: scale(1); opacity: 1 } }`}</style>

            <div style={{ textAlign: "center" }}>
              <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: 26, fontWeight: 800, color: "#fff", marginBottom: 8 }}>
                Заявка принята!
              </h2>
              <div style={{
                background: "rgba(184,247,39,0.08)", border: "1px solid rgba(184,247,39,0.25)",
                borderRadius: 10, padding: "8px 16px", display: "inline-block", marginBottom: 16,
              }}>
                <span style={{ fontFamily: "monospace", fontSize: 14, color: "#b8f727", fontWeight: 700 }}>
                  Номер: {result.requestId}
                </span>
              </div>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: "#9ca3af", marginBottom: 6 }}>
                Мы активируем план как только получим оплату
              </p>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: "#b8f727", fontWeight: 600 }}>
                Обычно это занимает меньше часа ⚡
              </p>
            </div>

            <a
              href={result.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                width: "100%", background: "#25D366", color: "#fff",
                border: "none", borderRadius: 12, padding: "14px",
                fontFamily: "Syne, sans-serif", fontSize: 15, fontWeight: 700,
                textDecoration: "none", boxSizing: "border-box",
              }}
            >
              <MessageCircle size={18} /> Отправить скриншот в WhatsApp
            </a>

            <button
              onClick={() => router.push("/dashboard")}
              style={{
                background: "transparent", border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 12, padding: "12px 24px", cursor: "pointer",
                fontFamily: "Syne, sans-serif", fontSize: 14, color: "#9ca3af",
              }}
            >
              Перейти в кабинет
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function UpgradeClient() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100vh", background: "#070809", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#6b7280", fontFamily: "Inter, sans-serif" }}>Загрузка…</p>
      </div>
    }>
      <UpgradeInner />
    </Suspense>
  );
}
