import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import type { UserProgress } from '@/types/agents';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response('Unauthorized', { status: 401 });
  }

  const userId = session.user.id;

  const progress = await prisma.userProgress.findUnique({
    where: { userId },
  });

  const now = new Date();

  // Check activity for each of the past 7 days
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(now.getDate() - 6);

  const usageRecords = await prisma.usageTracking.findMany({
    where: {
      userId,
      date: { gte: sevenDaysAgo },
      requestCount: { gt: 0 },
    },
    select: { date: true },
  });

  const activeDates = new Set(
    usageRecords.map((r) => new Date(r.date).toDateString())
  );

  const enrichedWeekDays = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(now);
    day.setDate(now.getDate() - (6 - i));
    return activeDates.has(day.toDateString());
  });

  const result: UserProgress = {
    streak: progress?.streak ?? 0,
    lastActiveDate: progress?.lastActiveDate?.toISOString() ?? null,
    totalXP: progress?.totalXP ?? 0,
    sessionsCount: progress?.sessionsCount ?? 0,
    weekDays: enrichedWeekDays,
    weakTopics: (progress?.weakTopics as string[]) ?? [],
  };

  return Response.json(result);
}
