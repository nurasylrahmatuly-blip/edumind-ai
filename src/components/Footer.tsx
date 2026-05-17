'use client';

import Link from "next/link";

export function Footer() {
  return (
    <footer style={{ background: "var(--bg-base)", borderTop: "1px solid var(--border-dim)", padding: "60px 24px 32px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40, marginBottom: 48 }}>
          {/* Brand */}
          <div>
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", marginBottom: 12 }}>
              <div style={{ width: 32, height: 32, background: "var(--lime)", borderRadius: "var(--radius-sm)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 800, color: "#070809" }}>E</div>
              <span style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700, color: "var(--white)" }}>
                Edu<span style={{ color: "var(--lime)" }}>Mind</span> AI
              </span>
            </Link>
            <p style={{ fontFamily: "var(--font-ui)", fontSize: 13.5, color: "var(--white-muted)", lineHeight: 1.65, maxWidth: 260, marginBottom: 20 }}>
              Мультиагентный AI-помощник для студентов Казахстана и СНГ.
            </p>
            {/* Social links */}
            <div style={{ display: "flex", gap: 8 }}>
              {[
                { label: "Telegram", icon: "✈️", href: "#" },
                { label: "TikTok", icon: "🎵", href: "#" },
                { label: "Instagram", icon: "📸", href: "#" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  style={{
                    width: 34, height: 34, borderRadius: "var(--radius-md)",
                    background: "var(--bg-raised)", border: "1px solid var(--border-soft)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 14, textDecoration: "none", transition: "all 0.15s",
                  }}
                  title={s.label}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Продукт */}
          <div>
            <h3 style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--white-muted)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 16 }}>Продукт</h3>
            <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { label: "Возможности", href: "/#features" },
                { label: "Тарифы", href: "/pricing" },
                { label: "AI Чат", href: "/chat" },
                { label: "Документы", href: "/documents" },
                { label: "Презентации", href: "/slides" },
              ].map((l) => (
                <li key={l.label}>
                  <Link href={l.href} style={{ fontFamily: "var(--font-ui)", fontSize: 13.5, color: "var(--white-muted)", textDecoration: "none", transition: "color 0.15s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--white)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "var(--white-muted)")}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Компания */}
          <div>
            <h3 style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--white-muted)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 16 }}>Компания</h3>
            <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { label: "О нас", href: "/about" },
                { label: "Блог", href: "#" },
                { label: "Для университетов", href: "/#universities" },
                { label: "Контакты", href: "mailto:info@edumind.ai" },
              ].map((l) => (
                <li key={l.label}>
                  <Link href={l.href} style={{ fontFamily: "var(--font-ui)", fontSize: 13.5, color: "var(--white-muted)", textDecoration: "none", transition: "color 0.15s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--white)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "var(--white-muted)")}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Юридическое */}
          <div>
            <h3 style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--white-muted)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 16 }}>Юридическое</h3>
            <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { label: "Условия использования", href: "#" },
                { label: "Конфиденциальность", href: "#" },
                { label: "Cookies", href: "#" },
              ].map((l) => (
                <li key={l.label}>
                  <Link href={l.href} style={{ fontFamily: "var(--font-ui)", fontSize: 13.5, color: "var(--white-muted)", textDecoration: "none", transition: "color 0.15s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--white)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "var(--white-muted)")}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="divider" style={{ marginBottom: 20 }} />

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--white-muted)" }}>
            © {new Date().getFullYear()} EduMind AI. Все права защищены.
          </p>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--white-muted)" }}>
            Сделано в Казахстане 🇰🇿
          </p>
        </div>
      </div>
    </footer>
  );
}
