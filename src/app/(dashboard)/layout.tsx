import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default async function DashboardLayoutServer({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const { user } = session;
  const plan = (user.plan as string) ?? "FREE";
  const userId = user.id!;

  const today = new Date(new Date().toDateString());
  const usageToday = await prisma.usageTracking.findFirst({
    where: { userId, date: today },
    select: { requestCount: true },
  });

  const usedToday = usageToday?.requestCount ?? 0;
  const planLower = plan.toLowerCase() as 'free' | 'pro' | 'academic';
  const dailyLimit = planLower === 'free' ? 50 : -1;

  return (
    <DashboardLayout
      userName={user.name}
      userEmail={user.email}
      plan={plan}
      usedToday={usedToday}
      dailyLimit={dailyLimit}
    >
      {children}
    </DashboardLayout>
  );
}
