'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  MessageSquare, FileText, ClipboardCheck,
  Settings, LogOut, Presentation, BookOpen, LayoutDashboard, Zap,
} from "lucide-react";

interface DashboardSidebarProps {
  userName?: string | null;
  userEmail?: string | null;
  plan?: string;
  usedToday?: number;
  dailyLimit?: number;
  isOpen?: boolean;
}

const navItems = [
  { href: "/dashboard", label: "Дашборд", icon: LayoutDashboard, exact: true },
  { href: "/chat", label: "AI Chat", icon: MessageSquare, badge: "9 агентов" },
  { href: "/documents", label: "Документы", icon: FileText },
  { href: "/slides", label: "Слайды", icon: Presentation, badge: "Новое" },
  { href: "/knowledge", label: "База знаний", icon: BookOpen },
  { href: "/dashboard/tests", label: "Тесты", icon: ClipboardCheck },
  { href: "/settings", label: "Настройки", icon: Settings },
];

const planLabels: Record<string, string> = {
  FREE: "Free", PRO: "Student Pro", ACADEMIC: "Academic+", UNIVERSITY: "University",
};

function getInitials(name?: string | null, email?: string | null): string {
  if (name) return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  return (email?.[0] ?? "?").toUpperCase();
}

export function DashboardSidebar({
  userName,
  userEmail,
  plan = "FREE",
  usedToday = 0,
  dailyLimit = 50,
  isOpen = false,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const isFree = plan === "FREE";
  const isUnlimited = dailyLimit === -1;
  const usagePct = isUnlimited ? 0 : Math.min((usedToday / dailyLimit) * 100, 100);
  const nearLimit = !isUnlimited && usagePct >= 80;

  return (
    <aside className={`sidebar${isOpen ? ' sidebar-open' : ''}`}>
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-icon">E</div>
        <span className="logo-text">Edu<span className="accent">Mind</span></span>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: "auto", padding: "12px 10px" }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact
            ? pathname === item.href
            : pathname === item.href || pathname?.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item${isActive ? " active" : ""}`}
              style={{ marginBottom: 2 }}
            >
              <Icon size={15} style={{ flexShrink: 0 }} />
              {item.label}
              {item.badge && <span className="nav-badge">{item.badge}</span>}
            </Link>
          );
        })}

        {/* Upgrade button for free plan */}
        {isFree && (
          <div style={{ padding: "10px 4px 0" }}>
            <Link
              href="/pricing"
              className="btn-primary"
              style={{ width: "100%", justifyContent: "center", fontSize: 12, padding: "8px 0" }}
            >
              <Zap size={12} /> Обновить до Pro
            </Link>
          </div>
        )}
      </nav>

      {/* Usage bar */}
      {!isUnlimited && (
        <div style={{ padding: "10px 14px", borderTop: "1px solid var(--border-dim)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--white-muted)" }}>
              API сегодня
            </span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: nearLimit ? "var(--lime-text)" : "var(--white-muted)" }}>
              {usedToday}/{dailyLimit}
            </span>
          </div>
          <div style={{ height: 3, background: "var(--bg-hover)", borderRadius: "var(--radius-pill)", overflow: "hidden" }}>
            <div
              style={{
                height: "100%",
                width: `${usagePct}%`,
                background: nearLimit ? "var(--lime)" : "var(--lime-muted)",
                borderRadius: "var(--radius-pill)",
                transition: "width 0.4s",
              }}
            />
          </div>
        </div>
      )}

      {/* User section */}
      <div style={{ borderTop: "1px solid var(--border-dim)", padding: "14px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: "50%",
            background: "var(--lime-dim)", border: "1px solid var(--border-lime)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "var(--font-display)", fontSize: 12, fontWeight: 700,
            color: "var(--lime-text)", flexShrink: 0,
          }}>
            {getInitials(userName, userEmail)}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontFamily: "var(--font-ui)", fontSize: 13, fontWeight: 500, color: "var(--white)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {userName ?? userEmail}
            </p>
            <Link href="/settings#subscription" style={{ textDecoration: "none" }}>
              <span className={`badge ${plan === "FREE" ? "badge-amber" : "badge-lime"}`} style={{ marginTop: 3, cursor: "pointer" }}>
                {planLabels[plan] ?? plan}
              </span>
            </Link>
          </div>
          <button onClick={() => signOut({ callbackUrl: "/" })} className="btn-icon" title="Выйти">
            <LogOut size={13} />
          </button>
        </div>
      </div>
    </aside>
  );
}
