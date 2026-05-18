import { redirect } from "next/navigation";
import { auth } from "@/auth";
import Link from "next/link";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user?.email || session.user.email !== process.env.ADMIN_EMAIL) {
    redirect("/");
  }

  return (
    <div style={{ minHeight: "100vh", background: "#070809", display: "flex" }}>
      {/* Sidebar */}
      <div style={{
        width: 220, flexShrink: 0,
        background: "#0d1117", borderRight: "1px solid rgba(255,255,255,0.06)",
        padding: "24px 0", display: "flex", flexDirection: "column",
      }}>
        <div style={{ padding: "0 20px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)", marginBottom: 12 }}>
          <p style={{ fontFamily: "Syne, sans-serif", fontSize: 13, fontWeight: 800, color: "#b8f727", margin: 0 }}>
            EduMind Admin
          </p>
        </div>
        {[
          { href: "/admin", label: "Дашборд" },
          { href: "/admin/payments", label: "Заявки Kaspi" },
          { href: "/admin/ambassadors", label: "Амбассадоры" },
          { href: "/admin/promo-codes", label: "Промокоды" },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            style={{
              display: "block", padding: "10px 20px",
              fontFamily: "Inter, sans-serif", fontSize: 13, color: "#9ca3af",
              textDecoration: "none", transition: "color 0.15s",
            }}
          >
            {item.label}
          </Link>
        ))}
      </div>

      {/* Main */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {children}
      </div>
    </div>
  );
}
