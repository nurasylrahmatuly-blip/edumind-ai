import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return new Response('Unauthorized', { status: 401 });

  const userId = session.user.id;
  const today = new Date(new Date().toDateString());

  const [user, usageToday, paymentOrders] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true, name: true, email: true, plan: true,
        stripeCustomerId: true, stripeSubscriptionId: true, planExpiresAt: true, createdAt: true,
      },
    }),
    prisma.usageTracking.findFirst({
      where: { userId, date: today },
      select: { requestCount: true },
    }),
    prisma.paymentOrder.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: { id: true, plan: true, amount: true, currency: true, provider: true, status: true, createdAt: true },
    }),
  ]);

  return Response.json({
    user,
    usageToday: usageToday?.requestCount ?? 0,
    paymentOrders,
  });
}

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return new Response('Unauthorized', { status: 401 });

  const body = await req.json() as { name?: string };

  if (body.name !== undefined && typeof body.name !== 'string') {
    return new Response('Invalid name', { status: 400 });
  }

  const updated = await prisma.user.update({
    where: { id: session.user.id },
    data: { name: body.name?.trim() || undefined },
    select: { id: true, name: true, email: true, plan: true },
  });

  return Response.json(updated);
}
