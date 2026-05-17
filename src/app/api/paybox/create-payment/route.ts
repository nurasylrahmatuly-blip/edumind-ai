import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { createPayment } from '@/lib/paybox';
import { PLANS, PlanKey } from '@/lib/stripe';

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return new Response('Unauthorized', { status: 401 });

  const body = await req.json() as { plan: PlanKey };
  const { plan } = body;

  if (plan === 'free') return new Response('Cannot pay for free plan', { status: 400 });

  const planConfig = PLANS[plan];
  const orderId = `${session.user.id}-${Date.now()}`;

  const order = await prisma.paymentOrder.create({
    data: {
      userId: session.user.id,
      plan,
      amount: planConfig.priceKZT,
      currency: 'KZT',
      provider: 'paybox',
      status: 'pending',
      externalId: orderId,
    },
  });

  const { paymentUrl, paymentId } = await createPayment({
    amount: planConfig.priceKZT,
    currency: 'KZT',
    orderId,
    userId: session.user.id,
    plan,
    description: `EduMind AI — ${planConfig.name}`,
    userEmail: session.user.email ?? '',
  });

  await prisma.paymentOrder.update({
    where: { id: order.id },
    data: { externalId: paymentId },
  });

  return Response.json({ paymentUrl });
}
