'use client';

import Link from "next/link";
import { Check, Zap, CreditCard } from "lucide-react";

const faq = [
  { q: "Как происходит оплата?", a: "Переводите сумму на Kaspi номер или карту, отправляете скриншот в WhatsApp — мы активируем в течение 1-2 часов." },
  { q: "Можно отменить в любой момент?", a: "Да. Оплата помесячная, достаточно просто не продлевать." },
  { q: "Есть студенческие скидки?", a: "Да! Получите реф-ссылку от амбассадора EduMind и получите −15% на любой тариф." },
  { q: "На каких языках работает?", a: "Русский, казахский — основные. Базовая поддержка английского." },
];

interface PlanDef {
  key: "free" | "pro" | "academic";
  name: string;
  kzt: number;
  period: string;
  badge: string | null;
  featured: boolean;
  features: string[];
  missing: string[];
}

const plans: PlanDef[] = [
  {
    key: "free",
    name: "Free",
    kzt: 0,
    period: "навсегда",
    badge: null,
    featured: false,
    features: ["50 запросов в день", "2 AI-агента", "Рефераты до 5 стр.", "Базовые тесты"],
    missing: ["DOCX / PPTX экспорт", "Курсовые и дипломные", "Приоритетная генерация"],
  },
  {
    key: "pro",
    name: "Student Pro",
    kzt: 4990,
    period: "в месяц",
    badge: "Популярный",
    featured: true,
    features: ["Безлимитные запросы", "Все 9 AI-агентов", "Курсовые до 40 стр.", "Экспорт DOCX и PPTX", "История чатов навсегда", "Приоритетная генерация"],
    missing: ["Дипломные до 100 стр.", "ГОСТ автоформатирование"],
  },
  {
    key: "academic",
    name: "Academic+",
    kzt: 9990,
    period: "в месяц",
    badge: "Максимум",
    featured: false,
    features: ["Всё из Student Pro", "Дипломные до 100 стр.", "ГОСТ автоформатирование", "Авто-список литературы", "Проверка уникальности", "API доступ"],
    missing: [],
  },
];

export function PricingClient() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-void)", padding: "60px 24px" }}>
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <span className="badge badge-lime" style={{ marginBottom: 16 }}>
            <Zap size={11} /> Тарифные планы
          </span>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 48, fontWeight: 800, color: "var(--white)", letterSpacing: "-0.02em", marginBottom: 14 }}>
            Инвестиция в твои <span style={{ color: "var(--lime)" }}>оценки</span>
          </h1>
          <p style={{ fontFamily: "var(--font-ui)", fontSize: 17, color: "var(--white-dim)", marginBottom: 14 }}>
            Начни бесплатно. Переходи на Pro когда нужно больше.
          </p>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(184,247,39,0.08)", border: "1px solid rgba(184,247,39,0.25)",
            borderRadius: 24, padding: "8px 18px",
          }}>
            <CreditCard size={14} style={{ color: "#b8f727" }} />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#b8f727" }}>
              💳 Принимаем оплату через Kaspi · Активация в течение 1-2 часов
            </span>
          </div>
        </div>

        {/* Plan cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: 64 }}>
          {plans.map((plan) => (
            <div
              key={plan.key}
              className={`pricing-card${plan.featured ? " featured" : ""}`}
              style={{ display: "flex", flexDirection: "column", position: "relative" }}
            >
              {plan.badge && (
                <div style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)" }}>
                  <span className="badge badge-lime">{plan.badge}</span>
                </div>
              )}

              <div style={{ marginBottom: 20 }}>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700, color: "var(--white)", marginBottom: 14 }}>
                  {plan.name}
                </h2>
                <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                  <span className="price-number" style={{ fontSize: 44 }}>
                    {plan.kzt === 0 ? "0" : plan.kzt.toLocaleString("ru-RU")}₸
                  </span>
                  {plan.kzt > 0 && <span className="price-period">/ {plan.period}</span>}
                </div>
              </div>

              {/* CTA buttons */}
              <div style={{ marginBottom: 24 }}>
                {plan.key === "free" ? (
                  <Link href="/register" className="btn-outline" style={{ width: "100%", justifyContent: "center" }}>
                    Начать бесплатно
                  </Link>
                ) : (
                  <Link
                    href={`/upgrade?plan=${plan.key}`}
                    className={plan.featured ? "btn-primary" : "btn-outline"}
                    style={{ width: "100%", justifyContent: "center", display: "flex", alignItems: "center", gap: 6 }}
                  >
                    <CreditCard size={14} />
                    Оплатить через Kaspi →
                  </Link>
                )}
              </div>

              {/* Features */}
              <ul style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
                {plan.features.map((f) => (
                  <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                    <Check size={14} style={{ color: "var(--lime)", flexShrink: 0, marginTop: 2 }} />
                    <span style={{ fontFamily: "var(--font-ui)", fontSize: 13, color: "var(--white-dim)" }}>{f}</span>
                  </li>
                ))}
                {plan.missing.map((f) => (
                  <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 8, opacity: 0.35 }}>
                    <Check size={14} style={{ color: "var(--white-muted)", flexShrink: 0, marginTop: 2 }} />
                    <span style={{ fontFamily: "var(--font-ui)", fontSize: 13, color: "var(--white-muted)", textDecoration: "line-through" }}>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Kaspi payment info banner */}
        <div style={{
          textAlign: "center", marginBottom: 48,
          background: "rgba(184,247,39,0.04)", border: "1px solid rgba(184,247,39,0.15)",
          borderRadius: 16, padding: "24px",
        }}>
          <p style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700, color: "var(--white)", marginBottom: 6 }}>
            💳 Как оплатить?
          </p>
          <p style={{ fontFamily: "var(--font-ui)", fontSize: 14, color: "var(--white-dim)" }}>
            Перевод на Kaspi → отправь скриншот в WhatsApp → получи доступ в течение 1-2 часов
          </p>
        </div>

        {/* FAQ */}
        <div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 700, color: "var(--white)", textAlign: "center", marginBottom: 36, letterSpacing: "-0.02em" }}>
            Частые вопросы
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
            {faq.map((item) => (
              <div key={item.q} className="card-base" style={{ padding: "20px 24px" }}>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 700, color: "var(--white)", marginBottom: 8 }}>{item.q}</h3>
                <p style={{ fontFamily: "var(--font-ui)", fontSize: 13, color: "var(--white-dim)", lineHeight: 1.7 }}>{item.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* University CTA */}
        <div style={{ marginTop: 48, textAlign: "center", background: "var(--lime-dim)", border: "1px solid var(--border-lime)", borderRadius: "var(--radius-xl)", padding: "36px 24px" }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, color: "var(--white)", marginBottom: 8 }}>
            Нужен план для всего университета?
          </h3>
          <p style={{ fontFamily: "var(--font-ui)", fontSize: 14, color: "var(--white-dim)", marginBottom: 20 }}>
            Специальные условия для кафедр, факультетов и вузов
          </p>
          <a href="mailto:edu@edumind.ai" className="btn-outline">Связаться с нами</a>
        </div>
      </div>
    </div>
  );
}
