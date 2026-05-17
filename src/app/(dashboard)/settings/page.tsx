import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { SettingsClient } from "./SettingsClient";

export const metadata = { title: "Настройки — EduMind AI" };

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const userId = session.user.id;
  const today = new Date(new Date().toDateString());

  const [user, usageToday, paymentOrders] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true, name: true, email: true, plan: true,
        stripeCustomerId: true, planExpiresAt: true, createdAt: true,
      },
    }),
    prisma.usageTracking.findFirst({
      where: { userId, date: today },
      select: { requestCount: true },
    }),
    prisma.paymentOrder.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: { id: true, plan: true, amount: true, currency: true, provider: true, status: true, createdAt: true },
    }),
  ]);

  return (
    <SettingsClient
      user={{
        id: user?.id ?? userId,
        name: user?.name ?? null,
        email: user?.email ?? session.user.email ?? "",
        plan: user?.plan ?? "FREE",
        stripeCustomerId: user?.stripeCustomerId ?? null,
        planExpiresAt: user?.planExpiresAt ? user.planExpiresAt.toISOString() : null,
        createdAt: user?.createdAt ? user.createdAt.toISOString() : new Date().toISOString(),
      }}
      usageToday={usageToday?.requestCount ?? 0}
      paymentOrders={paymentOrders.map((o) => ({
        ...o,
        createdAt: o.createdAt.toISOString(),
      }))}
    />
  );
}
