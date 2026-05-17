import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ChevronDown, Users, Building2, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "EduMind AI — Умный помощник для студентов",
  description:
    "Мультиагентный AI ассистент для студентов. Пиши курсовые и рефераты, готовься к тестам, находи источники по ГОСТ.",
};

const agents = [
  { emoji: "🧠", name: "Репетитор", desc: "Объясняет любую тему простым языком", color: "#34d399", cls: "agent-tutor" },
  { emoji: "📝", name: "Писатель", desc: "Курсовые, рефераты, дипломные по ГОСТ", color: "#f472b6", cls: "agent-writer" },
  { emoji: "🔬", name: "Исследователь", desc: "Находит академические источники", color: "#facc15", cls: "agent-research" },
  { emoji: "📐", name: "Форматтер", desc: "ГОСТ оформление с библиографией", color: "#94a3b8", cls: "agent-format" },
  { emoji: "🎯", name: "Тесты", desc: "Адаптивные тесты под слабые темы", color: "#a78bfa", cls: "agent-quiz" },
  { emoji: "🔍", name: "Поиск", desc: "Академический поиск по базам данных", color: "#38bdf8", cls: "agent-search" },
  { emoji: "🎓", name: "Наставник", desc: "Мотивация, streak и прогресс", color: "#fb923c", cls: "agent-mentor" },
  { emoji: "🎨", name: "Презентации", desc: "AI слайды с экспортом в PPTX", color: "#b8f727", cls: "agent-slides" },
  { emoji: "⚡", name: "Маршрутизатор", desc: "Выбирает лучшего агента автоматически", color: "#b8f727", cls: "agent-orchestrator" },
];

const features = [
  { emoji: "📄", title: "Курсовые по ГОСТ", desc: "Writer + Format агенты создают структурированный документ с введением, главами и заключением по ГОСТ.", color: "#f472b6" },
  { emoji: "🧪", title: "Умные тесты", desc: "Quiz агент адаптируется под твои слабые места и создаёт персонализированные задания.", color: "#a78bfa" },
  { emoji: "🔎", title: "Академический поиск", desc: "Search агент находит реальные источники и формирует библиографию автоматически.", color: "#38bdf8" },
  { emoji: "🎞", title: "Презентации AI", desc: "Slides агент создаёт профессиональные презентации и экспортирует в PPTX.", color: "#b8f727" },
  { emoji: "📚", title: "База знаний", desc: "Загружай PDF учебники, AI извлекает ключевые концепции и отвечает на вопросы по ним.", color: "#facc15" },
  { emoji: "🔥", title: "Мотивация и streak", desc: "Mentor отслеживает твой прогресс, напоминает о задачах и поддерживает мотивацию.", color: "#fb923c" },
];

const faq = [
  { q: "Мои данные в безопасности?", a: "Да. Все данные шифруются и хранятся на защищённых серверах. Мы никогда не передаём твои работы третьим лицам." },
  { q: "Соответствует ли оформление ГОСТ?", a: "Да, Format агент применяет ГОСТ 7.32 и ГОСТ Р 7.0.5 для курсовых и дипломных работ." },
  { q: "Можно оплатить в тенге?", a: "Да! Мы принимаем оплату через PayBox.money в KZT, а также USD через Stripe." },
  { q: "Как отменить подписку?", a: "В любой момент из раздела Настройки → Подписка. Отмена занимает 2 клика, деньги за текущий период не возвращаются." },
  { q: "Есть ли API доступ?", a: "API доступ планируется в Academic+ плане. Напиши нам для ранего доступа." },
  { q: "Есть ли поддержка?", a: "Да, пишите в Telegram @edumind_support. Отвечаем в течение нескольких часов." },
];

const floatingBadges = [
  { text: "9 AI-агентов", icon: "🤖", style: { top: "18%", left: "8%" } },
  { text: "DOCX / PPTX", icon: "📄", style: { top: "14%", right: "9%" } },
  { text: "RAG поиск", icon: "🔍", style: { bottom: "22%", left: "6%" } },
  { text: "ГОСТ формат", icon: "📐", style: { bottom: "20%", right: "7%" } },
  { text: "Стриминг AI", icon: "⚡", style: { top: "42%", left: "3%" } },
  { text: "50+ запросов/день", icon: "🎯", style: { top: "40%", right: "2%" } },
];

const steps = [
  { n: "01", title: "Задай вопрос", desc: "Напиши тему, предмет или вопрос. AI поймёт контекст автоматически." },
  { n: "02", title: "AI выбирает агента", desc: "Маршрутизатор определяет лучшего агента и запускает обработку." },
  { n: "03", title: "Получи результат", desc: "Готовый DOCX, PPTX или структурированный ответ за секунды." },
];

const plans = [
  {
    name: "Free",
    price: "0",
    period: "навсегда",
    features: ["50 запросов/день", "Все 9 агентов", "AI чат", "Базовые документы"],
    cta: "Начать бесплатно",
    href: "/register",
    featured: false,
  },
  {
    name: "Student Pro",
    price: "9",
    period: "/мес",
    features: ["Безлимитные запросы", "DOCX экспорт", "PPTX экспорт", "PDF загрузка (RAG)", "Приоритет в очереди"],
    cta: "Попробовать Pro",
    href: "/register",
    featured: true,
  },
  {
    name: "Academic+",
    price: "19",
    period: "/мес",
    features: ["Всё из Pro", "Неограниченные документы", "Дипломные работы", "API доступ", "Приоритетная поддержка"],
    cta: "Выбрать Academic+",
    href: "/register",
    featured: false,
  },
];

export default function LandingPage() {
  return (
    <div style={{ background: "var(--bg-void)", color: "var(--white)" }}>

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="hero bg-grid" style={{ minHeight: "100vh" }}>
        {floatingBadges.map((b) => (
          <div key={b.text} className="hero-badge" style={{ ...b.style, animationDelay: `${Math.random() * 2}s` }}>
            <span>{b.icon}</span>
            <span>{b.text}</span>
          </div>
        ))}

        <div style={{ maxWidth: 760, padding: "0 24px", position: "relative", zIndex: 1, textAlign: "center" }}>
          <div className="badge badge-lime" style={{ marginBottom: 28, display: "inline-flex", fontSize: 11 }}>
            ✦ Мультиагентная AI платформа для студентов
          </div>

          <h1 className="hero-title">
            Учись умнее с<br />
            <span className="accent">EduMind AI</span>
          </h1>

          <p className="hero-subtitle">
            9 специализированных AI-агентов работают вместе. Пиши курсовые, готовься к тестам, находи источники по ГОСТ.
          </p>

          <div className="hero-ctas">
            <Link href="/register" className="btn-primary" style={{ fontSize: 15, padding: "12px 28px" }}>
              Начать бесплатно <ArrowRight size={15} />
            </Link>
            <Link href="#how-it-works" className="btn-ghost" style={{ fontSize: 15, padding: "12px 28px", border: "1px solid var(--border-soft)" }}>
              Смотреть как работает <ChevronDown size={15} />
            </Link>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 20, justifyContent: "center", marginTop: 36 }}>
            {["Бесплатный старт", "9 AI-агентов", "ГОСТ оформление", "KZT и USD оплата"].map((t) => (
              <div key={t} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--white-muted)" }}>
                <CheckCircle2 size={13} style={{ color: "var(--lime)" }} />
                {t}
              </div>
            ))}
          </div>

          <div style={{ marginTop: 28, display: "inline-flex", alignItems: "center", gap: 8 }}>
            <div style={{ display: "flex" }}>
              {["АБ", "ТЖ", "МС"].map((av, i) => (
                <div key={av} style={{
                  width: 30, height: 30, borderRadius: "50%",
                  background: "var(--lime-dim)", border: "2px solid var(--bg-void)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "var(--font-display)", fontSize: 11, fontWeight: 700,
                  color: "var(--lime-text)", marginLeft: i > 0 ? -8 : 0,
                }}>
                  {av}
                </div>
              ))}
            </div>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--lime-text)" }}>
              Уже 1,200+ студентов
            </span>
          </div>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────────────── */}
      <section style={{ borderTop: "1px solid var(--border-dim)", borderBottom: "1px solid var(--border-dim)", background: "var(--bg-base)", padding: "40px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 24 }}>
          {[
            { value: "10 000+", label: "Студентов" },
            { value: "50 000+", label: "Работ создано" },
            { value: "9", label: "AI-агентов" },
            { value: "4.9/5", label: "Средняя оценка" },
          ].map((s) => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 800, color: "var(--lime)" }}>{s.value}</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--white-muted)", marginTop: 4, textTransform: "uppercase", letterSpacing: "0.1em" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────────────── */}
      <section id="how-it-works" style={{ background: "var(--bg-base)", borderBottom: "1px solid var(--border-dim)", padding: "100px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <span className="section-label">Как это работает</span>
            <h2 className="section-title">Три шага до результата</h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 32, position: "relative" }}>
            {/* Connecting lines */}
            <div style={{ position: "absolute", top: 32, left: "calc(33% - 20px)", right: "calc(33% - 20px)", height: 2, background: "linear-gradient(90deg, var(--lime-dim), var(--lime-dim))", borderRadius: 2 }} />

            {steps.map((step) => (
              <div key={step.n} style={{ textAlign: "center", position: "relative" }}>
                <div style={{
                  width: 64, height: 64, borderRadius: "var(--radius-lg)",
                  background: "var(--lime)", color: "#070809",
                  fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 800,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto", boxShadow: "0 0 24px var(--lime-glow)",
                }}>
                  {step.n}
                </div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, color: "var(--white)", margin: "20px 0 10px" }}>{step.title}</h3>
                <p style={{ fontFamily: "var(--font-ui)", fontSize: 14, color: "var(--white-dim)", lineHeight: 1.7 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Agent showcase ─────────────────────────────────────────── */}
      <section style={{ padding: "100px 24px", background: "var(--bg-void)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <span className="section-label">9 агентов</span>
            <h2 className="section-title">Каждый — эксперт в своём деле</h2>
            <p style={{ fontFamily: "var(--font-ui)", fontSize: 16, color: "var(--white-dim)", marginTop: 12, maxWidth: 500, margin: "12px auto 0", lineHeight: 1.6 }}>
              Маршрутизатор автоматически выбирает нужного агента по контексту задачи
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
            {agents.map((a) => (
              <div key={a.name} className={`feature-card ${a.cls}`} style={{ "--card-color": a.color, cursor: "default" } as React.CSSProperties}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: "var(--radius-md)", background: `${a.color}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
                    {a.emoji}
                  </div>
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700, color: "var(--white)" }}>{a.name}</h3>
                </div>
                <p style={{ fontFamily: "var(--font-ui)", fontSize: 13.5, color: "var(--white-dim)", lineHeight: 1.6 }}>{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────────── */}
      <section id="features" className="features-section">
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <span className="section-label">Возможности</span>
            <h2 className="section-title">Всё что нужно студенту</h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
            {features.map((f) => (
              <div key={f.title} className="feature-card" style={{ "--card-color": f.color } as React.CSSProperties}>
                <div style={{ fontSize: 32, marginBottom: 16 }}>{f.emoji}</div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 700, color: "var(--white)", marginBottom: 8 }}>{f.title}</h3>
                <p style={{ fontFamily: "var(--font-ui)", fontSize: 14, color: "var(--white-dim)", lineHeight: 1.65 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ───────────────────────────────────────────────── */}
      <section style={{ padding: "100px 24px", background: "var(--bg-base)", borderTop: "1px solid var(--border-dim)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <span className="section-label">Тарифы</span>
            <h2 className="section-title">Начни бесплатно</h2>
            <p style={{ fontFamily: "var(--font-ui)", fontSize: 16, color: "var(--white-dim)", marginTop: 12 }}>
              Без кредитной карты. Переходи на Pro когда нужно.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
            {plans.map((plan) => (
              <div key={plan.name} className={`pricing-card${plan.featured ? " featured" : ""}`} style={{ position: "relative", display: "flex", flexDirection: "column" }}>
                {plan.featured && (
                  <div className="badge badge-lime" style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", whiteSpace: "nowrap" }}>
                    Популярный
                  </div>
                )}
                <div style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, color: "var(--white)", marginBottom: 16 }}>{plan.name}</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 24 }}>
                  <span className="price-number" style={{ fontSize: 42 }}>${plan.price}</span>
                  <span className="price-period">{plan.period}</span>
                </div>
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 28px", display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
                  {plan.features.map((f) => (
                    <li key={f} style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "var(--font-ui)", fontSize: 14, color: "var(--white-dim)" }}>
                      <CheckCircle2 size={14} style={{ color: "var(--lime)", flexShrink: 0 }} /> {f}
                    </li>
                  ))}
                </ul>
                <Link href={plan.href} className={plan.featured ? "btn-primary" : "btn-outline"} style={{ textAlign: "center", justifyContent: "center" }}>
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>

          <p style={{ textAlign: "center", marginTop: 24, fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--white-muted)" }}>
            Также принимаем KZT через PayBox.money
          </p>
        </div>
      </section>

      {/* ── For Universities ──────────────────────────────────────── */}
      <section style={{ padding: "100px 24px", background: "var(--bg-void)", borderTop: "1px solid var(--border-dim)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
          <div>
            <span className="section-label">B2B</span>
            <h2 className="section-title" style={{ marginBottom: 16 }}>Для университетов и школ</h2>
            <p style={{ fontFamily: "var(--font-ui)", fontSize: 16, color: "var(--white-dim)", lineHeight: 1.7, marginBottom: 32 }}>
              Корпоративный план для учебных заведений. Управляй студентами, следи за прогрессом, интегрируй с LMS.
            </p>
            <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
              {["Панель управления администратора", "Аналитика по студентам", "Интеграция с LMS (Moodle, Canvas)", "Безлимитные студенты", "Выделенная поддержка"].map((f) => (
                <li key={f} style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "var(--font-ui)", fontSize: 14, color: "var(--white-dim)" }}>
                  <CheckCircle2 size={14} style={{ color: "var(--lime)", flexShrink: 0 }} /> {f}
                </li>
              ))}
            </ul>
            <a href="mailto:info@edumind.ai" className="btn-primary">
              <Mail size={14} /> Связаться с нами
            </a>
          </div>

          <div className="card-base" style={{ padding: 32, display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 48, height: 48, borderRadius: "var(--radius-md)", background: "var(--lime-dim)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Building2 size={22} style={{ color: "var(--lime)" }} />
              </div>
              <div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700, color: "var(--white)" }}>University Plan</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--lime-text)" }}>$6/студент/мес</div>
              </div>
            </div>
            <div className="divider" />
            <div style={{ fontFamily: "var(--font-ui)", fontSize: 13, color: "var(--white-muted)", lineHeight: 1.7 }}>
              Минимум 50 студентов. Годовой контракт. Возможна интеграция через API.
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Users size={14} style={{ color: "var(--white-muted)" }} />
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--white-muted)" }}>КазНУ, КБТУ, ЕНУ уже используют</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────── */}
      <section style={{ padding: "100px 24px", background: "var(--bg-base)", borderTop: "1px solid var(--border-dim)" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <span className="section-label">FAQ</span>
            <h2 className="section-title">Частые вопросы</h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {faq.map((item) => (
              <details key={item.q} style={{ borderRadius: "var(--radius-md)", overflow: "hidden" }}>
                <summary style={{
                  padding: "16px 20px",
                  background: "var(--bg-raised)",
                  border: "1px solid var(--border-dim)",
                  borderRadius: "var(--radius-md)",
                  cursor: "pointer",
                  fontFamily: "var(--font-ui)",
                  fontSize: 15,
                  fontWeight: 500,
                  color: "var(--white)",
                  listStyle: "none",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  userSelect: "none",
                }}>
                  {item.q}
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 18, color: "var(--lime)", marginLeft: 12 }}>+</span>
                </summary>
                <div style={{
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border-dim)",
                  borderTop: "none",
                  borderRadius: "0 0 var(--radius-md) var(--radius-md)",
                  padding: "14px 20px 16px",
                  fontFamily: "var(--font-ui)",
                  fontSize: 14,
                  color: "var(--white-dim)",
                  lineHeight: 1.7,
                }}>
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────────── */}
      <section style={{ background: "var(--bg-void)", borderTop: "1px solid var(--border-lime)", padding: "100px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <div style={{ width: 56, height: 56, background: "var(--lime)", borderRadius: "var(--radius-lg)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", boxShadow: "0 0 32px var(--lime-glow)", fontSize: 28 }}>
            🎓
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 40, fontWeight: 800, color: "var(--white)", letterSpacing: "-0.02em", marginBottom: 16 }}>
            Начни учиться умнее<br /><span style={{ color: "var(--lime)" }}>уже сегодня</span>
          </h2>
          <p style={{ fontFamily: "var(--font-ui)", fontSize: 16, color: "var(--white-dim)", lineHeight: 1.7, marginBottom: 32 }}>
            Присоединяйся к 1,200+ студентов, которые сдают работы вовремя
          </p>
          <div className="hero-ctas">
            <Link href="/register" className="btn-primary" style={{ fontSize: 15, padding: "12px 28px" }}>
              Зарегистрироваться бесплатно <ArrowRight size={14} />
            </Link>
            <Link href="/pricing" className="btn-outline" style={{ fontSize: 15 }}>
              Посмотреть тарифы
            </Link>
          </div>
          <p style={{ marginTop: 20, fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--white-muted)" }}>
            Бесплатный план · 50 запросов/день · Карта не нужна
          </p>
        </div>
      </section>

    </div>
  );
}
