import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin Panel" };

const planBadge: Record<string, string> = {
  FREE: "badge-amber",
  PRO: "badge-lime",
  ACADEMIC: "badge-teal",
  UNIVERSITY: "badge-violet",
};

export default async function AdminPage() {
  const session = await auth();
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!session?.user?.email || session.user.email !== adminEmail) {
    redirect("/");
  }

  const today = new Date(new Date().toDateString());

  const [userCount, docCount, chatCountToday, proUsers, academicUsers, recentUsers] =
    await Promise.all([
      prisma.user.count(),
      prisma.document.count(),
      prisma.conversation.count({ where: { createdAt: { gte: today } } }),
      prisma.user.count({ where: { plan: "PRO" } }),
      prisma.user.count({ where: { plan: "ACADEMIC" } }),
      prisma.user.findMany({
        take: 30,
        orderBy: { createdAt: "desc" },
        select: {
          id: true, email: true, name: true, plan: true, createdAt: true,
          _count: { select: { documents: true, conversations: true } },
        },
      }),
    ]);

  const stats = [
    { label: "Всего пользователей", value: userCount },
    { label: "Документов создано", value: docCount },
    { label: "Чатов сегодня", value: chatCountToday },
    { label: "Pro пользователей", value: proUsers },
    { label: "Academic+ пользователей", value: academicUsers },
    { label: "Оценочный доход/мес", value: `$${proUsers * 9 + academicUsers * 19}` },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-void)", padding: 32 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div className="badge badge-lime" style={{ marginBottom: 8 }}>Admin Panel</div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 800, color: "var(--white)" }}>
            EduMind AI — Панель администратора
          </h1>
        </div>

        {/* Stats grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 32 }}>
          {stats.map((s) => (
            <div key={s.label} className="doc-stats-card">
              <div className="doc-stats-number">{s.value}</div>
              <div className="doc-stats-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Users table */}
        <div className="card-base" style={{ overflow: "hidden" }}>
          <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--border-dim)" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 700, color: "var(--white)" }}>
              Последние пользователи
            </h2>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border-dim)" }}>
                  {["Email", "Имя", "План", "Документов", "Чатов", "Дата"].map((h) => (
                    <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--white-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentUsers.map((u) => (
                  <tr key={u.id} style={{ borderBottom: "1px solid var(--border-dim)" }}>
                    <td style={{ padding: "10px 16px", fontFamily: "var(--font-ui)", fontSize: 13, color: "var(--white)" }}>{u.email}</td>
                    <td style={{ padding: "10px 16px", fontFamily: "var(--font-ui)", fontSize: 13, color: "var(--white-dim)" }}>{u.name ?? "—"}</td>
                    <td style={{ padding: "10px 16px" }}>
                      <span className={`badge ${planBadge[u.plan] ?? "badge-amber"}`}>{u.plan}</span>
                    </td>
                    <td style={{ padding: "10px 16px", fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--white-muted)", textAlign: "center" }}>{u._count.documents}</td>
                    <td style={{ padding: "10px 16px", fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--white-muted)", textAlign: "center" }}>{u._count.conversations}</td>
                    <td style={{ padding: "10px 16px", fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--white-muted)" }}>{new Date(u.createdAt).toLocaleDateString("ru")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
