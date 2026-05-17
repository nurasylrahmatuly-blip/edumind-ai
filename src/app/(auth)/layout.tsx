import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg-void)" }} className="bg-grid">
      <div style={{ padding: "20px 24px" }}>
        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{ width: 32, height: 32, background: "var(--lime)", borderRadius: "var(--radius-sm)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 800, color: "#070809", boxShadow: "0 0 16px var(--lime-glow)" }}>
            E
          </div>
          <span style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700, color: "var(--white)" }}>
            Edu<span style={{ color: "var(--lime)" }}>Mind</span>
          </span>
        </Link>
      </div>
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 24px 40px" }}>
        {children}
      </div>
    </div>
  );
}
