"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

const navLinks = [
  { href: "/#features", label: "Возможности" },
  { href: "/pricing", label: "Цены" },
  { href: "/#how-it-works", label: "Как работает" },
];

export function Header() {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(10,12,14,0.88)", borderBottom: "1px solid var(--border-dim)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 56, padding: "0 24px" }}>
        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{ width: 30, height: 30, background: "var(--lime)", borderRadius: "var(--radius-sm)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 800, color: "#070809", boxShadow: "0 0 12px var(--lime-glow)" }}>
            E
          </div>
          <span style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700, color: "var(--white)" }}>
            Edu<span style={{ color: "var(--lime)" }}>Mind</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav style={{ display: "flex", alignItems: "center", gap: 24 }}>
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} style={{ fontFamily: "var(--font-ui)", fontSize: 13, fontWeight: 500, color: "var(--white-dim)", textDecoration: "none", transition: "color 0.15s" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--white)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--white-dim)")}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* CTAs */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <LanguageSwitcher />
          {session ? (
            <Link href="/dashboard" className="btn-primary btn-sm">Открыть дашборд</Link>
          ) : (
            <>
              <Link href="/login" className="btn-ghost btn-sm">Войти</Link>
              <Link href="/register" className="btn-primary btn-sm">Начать бесплатно</Link>
            </>
          )}
          <button className="btn-icon" style={{ display: "none" }} onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div style={{ borderTop: "1px solid var(--border-dim)", background: "var(--bg-base)", padding: "16px 24px" }}>
          <nav style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)}
                style={{ fontFamily: "var(--font-ui)", fontSize: 14, color: "var(--white-dim)", textDecoration: "none" }}>
                {l.label}
              </Link>
            ))}
            <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingTop: 8 }}>
              {session ? (
                <Link href="/dashboard" className="btn-primary" style={{ justifyContent: "center" }}>Дашборд</Link>
              ) : (
                <>
                  <Link href="/login" className="btn-outline" style={{ justifyContent: "center" }}>Войти</Link>
                  <Link href="/register" className="btn-primary" style={{ justifyContent: "center" }}>Начать бесплатно</Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
