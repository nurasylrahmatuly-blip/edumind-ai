import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPin, Target, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "О нас",
  description: "EduMind AI — мультиагентный AI-ассистент для студентов. Создан в Казахстане командой разработчиков и педагогов.",
};

const team = [
  { name: "Нурасыл Р.", role: "CEO & Founder", avatar: "НР", desc: "Строит AI-продукты для образования" },
  { name: "AI Engineer", role: "Технический директор", avatar: "АE", desc: "Архитектура мультиагентных систем" },
  { name: "UX Designer", role: "Дизайнер", avatar: "UX", desc: "Продуктовый дизайн и исследования" },
];

const values = [
  { icon: "🎓", title: "Образование прежде всего", desc: "Мы верим, что качественное образование должно быть доступным каждому студенту, независимо от ресурсов." },
  { icon: "🤖", title: "AI как инструмент", desc: "AI дополняет человека, а не заменяет. Мы помогаем студентам учиться эффективнее, а не делаем за них работу." },
  { icon: "🇰🇿", title: "Локальный контекст", desc: "Мы понимаем требования казахстанских и российских университетов — ГОСТ, форматы отчётов, академические стандарты." },
];

export default function AboutPage() {
  return (
    <div style={{ background: "var(--bg-void)", color: "var(--white)" }}>

      {/* Hero */}
      <section style={{ padding: "100px 24px 80px", textAlign: "center" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <div className="badge badge-lime" style={{ marginBottom: 20, display: "inline-flex" }}>О нас</div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 56, fontWeight: 800, color: "var(--white)", letterSpacing: "-0.02em", lineHeight: 1.1, marginBottom: 20 }}>
            Создаём будущее<br /><span style={{ color: "var(--lime)" }}>образования</span>
          </h1>
          <p style={{ fontFamily: "var(--font-ui)", fontSize: 18, color: "var(--white-dim)", lineHeight: 1.7, marginBottom: 32 }}>
            EduMind AI — это мультиагентная AI-платформа, созданная для того, чтобы каждый студент мог учиться так же эффективно, как с лучшим личным тьютором.
          </p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--lime-text)" }}>
            <MapPin size={14} /> Алматы, Казахстан 🇰🇿
          </div>
        </div>
      </section>

      {/* Mission */}
      <section style={{ background: "var(--bg-base)", borderTop: "1px solid var(--border-dim)", borderBottom: "1px solid var(--border-dim)", padding: "80px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
          <div>
            <span className="section-label">Миссия</span>
            <h2 className="section-title" style={{ marginBottom: 20 }}>Умная учёба для каждого</h2>
            <p style={{ fontFamily: "var(--font-ui)", fontSize: 15, color: "var(--white-dim)", lineHeight: 1.8, marginBottom: 16 }}>
              Миллионы студентов в СНГ каждый год тратят недели на написание курсовых, рефератов и дипломных работ. Мы видим эту проблему и строим решение.
            </p>
            <p style={{ fontFamily: "var(--font-ui)", fontSize: 15, color: "var(--white-dim)", lineHeight: 1.8, marginBottom: 28 }}>
              9 специализированных AI-агентов работают вместе, чтобы дать студентам суперсилу: писать работы быстрее, понимать материал глубже и сдавать всё вовремя.
            </p>
            <Link href="/register" className="btn-primary">
              Попробовать бесплатно <ArrowRight size={14} />
            </Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {[
              { icon: <Target size={20} style={{ color: "var(--lime)" }} />, label: "Основана в 2024" },
              { icon: <Users size={20} style={{ color: "var(--lime)" }} />, label: "1,200+ студентов" },
              { icon: <span style={{ fontSize: 20 }}>🇰🇿</span>, label: "Алматы, Казахстан" },
            ].map((item) => (
              <div key={item.label} className="card-base" style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 14 }}>
                {item.icon}
                <span style={{ fontFamily: "var(--font-ui)", fontSize: 15, fontWeight: 500, color: "var(--white)" }}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <span className="section-label">Ценности</span>
            <h2 className="section-title">Что нами движет</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {values.map((v) => (
              <div key={v.title} className="feature-card" style={{ "--card-color": "var(--lime)" } as React.CSSProperties}>
                <div style={{ fontSize: 32, marginBottom: 16 }}>{v.icon}</div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 700, color: "var(--white)", marginBottom: 10 }}>{v.title}</h3>
                <p style={{ fontFamily: "var(--font-ui)", fontSize: 14, color: "var(--white-dim)", lineHeight: 1.65 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section style={{ background: "var(--bg-base)", borderTop: "1px solid var(--border-dim)", padding: "80px 24px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <span className="section-label">Команда</span>
            <h2 className="section-title">Кто строит EduMind</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {team.map((m) => (
              <div key={m.name} className="pricing-card" style={{ textAlign: "center" }}>
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--lime-dim)", border: "2px solid var(--border-lime)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, color: "var(--lime-text)", margin: "0 auto 16px" }}>
                  {m.avatar}
                </div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700, color: "var(--white)", marginBottom: 4 }}>{m.name}</div>
                <div className="badge badge-lime" style={{ marginBottom: 10 }}>{m.role}</div>
                <p style={{ fontFamily: "var(--font-ui)", fontSize: 13, color: "var(--white-muted)" }}>{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "80px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 36, fontWeight: 800, color: "var(--white)", marginBottom: 16 }}>
            Присоединяйся к нам
          </h2>
          <p style={{ fontFamily: "var(--font-ui)", fontSize: 16, color: "var(--white-dim)", lineHeight: 1.6, marginBottom: 32 }}>
            Попробуй EduMind AI бесплатно уже сегодня
          </p>
          <Link href="/register" className="btn-primary" style={{ fontSize: 15, padding: "12px 28px" }}>
            Начать бесплатно <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </div>
  );
}
