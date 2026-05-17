import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  MessageSquare, FileText, Presentation, Flame,
  FileType, Clock, Plus, BookOpen, Zap, ChevronRight,
} from "lucide-react";
import { redirect } from "next/navigation";
import { UsageBar } from "./components/UsageBar";

export const metadata: Metadata = {
  title: 'Главная',
  description: 'Твой учебный дашборд — прогресс, документы, чаты',
};

const docStatusBadge: Record<string, string> = {
  DRAFT: "badge", GENERATING: "badge badge-amber", DONE: "badge badge-teal",
};
const docStatusLabel: Record<string, string> = {
  DRAFT: "Черновик", GENERATING: "Генерируется", DONE: "Готово",
};
const documentTypeLabels: Record<string, string> = {
  COURSEWORK: "Курсовая", THESIS: "Дипломная", ESSAY: "Эссе", REPORT: "Отчёт", PRESENTATION: "Презентация",
};
const agentEmoji: Record<string, string> = {
  TUTOR: "🎓", QUIZ: "🧠", SEARCH: "🔍", MENTOR: "👨‍💼",
  WRITER: "✍️", RESEARCH: "📚", FORMAT: "📐", SLIDES: "📊",
};

function timeAgo(date: Date): string {
  const diff = Date.now() - new Date(date).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "только что";
  if (m < 60) return `${m} мин. назад`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} ч. назад`;
  return `${Math.floor(h / 24)} дн. назад`;
}

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const userId = session.user.id;
  const firstName = session.user.name?.split(" ")[0] ?? "Студент";

  const today = new Date(new Date().toDateString());

  const [
    user,
    documentsCount,
    presentationCount,
    recentDocuments,
    usageToday,
    progress,
    recentConversations,
  ] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId }, select: { plan: true } }),
    prisma.document.count({ where: { userId } }),
    prisma.presentation.count({ where: { userId } }),
    prisma.document.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 3,
      select: { id: true, title: true, type: true, status: true, createdAt: true, wordCount: true },
    }),
    prisma.usageTracking.findFirst({
      where: { userId, date: today },
      select: { requestCount: true },
    }),
    prisma.userProgress.findUnique({ where: { userId }, select: { totalXP: true, streak: true } }),
    prisma.conversation.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      take: 3,
      include: {
        messages: { take: 1, orderBy: { createdAt: "asc" }, select: { content: true, agentUsed: true } },
      },
    }),
  ]);

  const plan = user?.plan ?? "FREE";
  const planLower = plan.toLowerCase() as "free" | "pro" | "academic";
  const usedToday = usageToday?.requestCount ?? 0;
  const dailyLimit = planLower === "free" ? 50 : -1;

  const todayStr = new Date().toLocaleDateString("ru-RU", {
    weekday: "long", day: "numeric", month: "long",
  });

  const stats = [
    { label: "Запросов сегодня", value: planLower === "free" ? `${usedToday}/50` : String(usedToday), icon: Flame, color: "var(--agent-mentor)" },
    { label: "Streak", value: `${progress?.streak ?? 0} дней 🔥`, icon: Flame, color: "var(--lime)" },
    { label: "Документов", value: documentsCount, icon: FileType, color: "var(--agent-writer)" },
    { label: "Презентаций", value: presentationCount, icon: Presentation, color: "var(--agent-slides)" },
  ];

  const quickActions = [
    { href: "/chat", icon: MessageSquare, label: "Новый чат", desc: "Задай вопрос AI тьютору", color: "var(--lime)", bg: "var(--lime-dim)" },
    { href: "/documents/new", icon: FileText, label: "Создать документ", desc: "Реферат, курсовая, диплом", color: "var(--agent-writer)", bg: "rgba(244,114,182,0.1)" },
    { href: "/slides/new", icon: Presentation, label: "Новая презентация", desc: "Слайды с AI за секунды", color: "var(--agent-slides)", bg: "var(--lime-dim)" },
    { href: "/knowledge", icon: BookOpen, label: "Загрузить PDF", desc: "База знаний из учебников", color: "var(--agent-search)", bg: "rgba(56,189,248,0.1)" },
  ];

  return (
    <div style={{ padding: "28px", overflowY: "auto", flex: 1 }}>
      {/* Welcome header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 800, color: "var(--white)", marginBottom: 4 }}>
            Привет, {firstName}!
          </h1>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--white-muted)" }}>{todayStr}</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span className={`badge ${plan === "FREE" ? "badge-amber" : "badge-lime"}`}>
            {plan === "FREE" ? "Free" : plan === "PRO" ? "Student Pro" : "Academic+"}
          </span>
          {plan === "FREE" && (
            <Link href="/pricing" className="btn-primary btn-sm">
              <Zap size={12} /> Обновить
            </Link>
          )}
        </div>
      </div>

      {/* Stats grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="doc-stats-card">
              <div style={{ width: 34, height: 34, borderRadius: "var(--radius-md)", background: `${stat.color}18`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                <Icon size={16} style={{ color: stat.color }} />
              </div>
              <div className="doc-stats-number" style={{ fontSize: 26 }}>{stat.value}</div>
              <div className="doc-stats-label">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Usage bar */}
      <div style={{ marginBottom: 24 }}>
        <UsageBar used={usedToday} limit={dailyLimit} plan={planLower} />
      </div>

      {/* Recent documents */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700, color: "var(--white)" }}>
            Последние документы
          </h2>
          <Link href="/documents" style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--lime-text)", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
            Все документы <ChevronRight size={12} />
          </Link>
        </div>

        {recentDocuments.length === 0 ? (
          <div style={{ padding: "32px 24px", textAlign: "center", border: "1px dashed var(--border-soft)", borderRadius: "var(--radius-lg)", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <BookOpen size={28} style={{ color: "var(--white-muted)" }} />
            <div>
              <p style={{ fontFamily: "var(--font-ui)", fontSize: 14, fontWeight: 600, color: "var(--white)", marginBottom: 4 }}>Нет документов</p>
              <p style={{ fontFamily: "var(--font-ui)", fontSize: 12, color: "var(--white-dim)" }}>Создай первую работу с помощью AI</p>
            </div>
            <Link href="/documents/new" className="btn-primary btn-sm"><Plus size={12} /> Создать</Link>
          </div>
        ) : (
          <div style={{ display: "flex", overflowX: "auto", gap: 12, paddingBottom: 4 }}>
            {recentDocuments.map((doc) => (
              <Link key={doc.id} href={`/documents/${doc.id}`} style={{ textDecoration: "none", flexShrink: 0, width: 220 }}>
                <div className="doc-card" style={{ height: "100%" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: "var(--radius-md)", background: "rgba(244,114,182,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <FileText size={15} style={{ color: "var(--agent-writer)" }} />
                    </div>
                    <span className={docStatusBadge[doc.status] ?? "badge"} style={{ fontSize: 9 }}>
                      {docStatusLabel[doc.status] ?? doc.status}
                    </span>
                  </div>
                  <p style={{ fontFamily: "var(--font-ui)", fontSize: 13, fontWeight: 500, color: "var(--white)", marginBottom: 6, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{doc.title}</p>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--white-muted)" }}>{documentTypeLabels[doc.type] ?? doc.type}</span>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--white-muted)", display: "flex", alignItems: "center", gap: 3 }}>
                      <Clock size={9} /> {timeAgo(doc.createdAt)}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Recent chats */}
      {recentConversations.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700, color: "var(--white)" }}>
              Последние чаты
            </h2>
            <Link href="/chat" style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--lime-text)", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
              Открыть чат <ChevronRight size={12} />
            </Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {recentConversations.map((conv) => {
              const firstMsg = conv.messages[0];
              const agent = firstMsg?.agentUsed ?? "TUTOR";
              return (
                <Link key={conv.id} href="/chat" style={{ textDecoration: "none" }}>
                  <div className="doc-card" style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px" }}>
                    <div style={{ width: 32, height: 32, borderRadius: "var(--radius-md)", background: "var(--bg-hover)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, flexShrink: 0 }}>
                      {agentEmoji[agent] ?? "💬"}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontFamily: "var(--font-ui)", fontSize: 13, fontWeight: 500, color: "var(--white)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {conv.title}
                      </p>
                      {firstMsg && (
                        <p style={{ fontFamily: "var(--font-ui)", fontSize: 11, color: "var(--white-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginTop: 2 }}>
                          {firstMsg.content.slice(0, 60)}…
                        </p>
                      )}
                    </div>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--white-muted)", flexShrink: 0 }}>
                      {timeAgo(conv.updatedAt)}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick actions */}
      <div>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700, color: "var(--white)", marginBottom: 12 }}>
          Быстрые действия
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.href} href={action.href} style={{ textDecoration: "none" }}>
                <div className="doc-card" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <div style={{ width: 40, height: 40, borderRadius: "var(--radius-md)", background: action.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon size={20} style={{ color: action.color }} />
                  </div>
                  <div>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 700, color: "var(--white)", marginBottom: 2 }}>{action.label}</div>
                    <div style={{ fontFamily: "var(--font-ui)", fontSize: 11, color: "var(--white-muted)" }}>{action.desc}</div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
