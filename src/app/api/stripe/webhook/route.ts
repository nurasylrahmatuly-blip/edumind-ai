import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import type Stripe from 'stripe';

export const runtime = 'nodejs';

const planMap: Record<string, 'FREE' | 'PRO' | 'ACADEMIC'> = {
  pro: 'PRO',
  academic: 'ACADEMIC',
};

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const sig = headersList.get('stripe-signature');

  if (!sig) return new Response('No signature', { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return new Response('Webhook signature verification failed', { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const plan = session.metadata?.plan;
        if (!userId || !plan) break;

        const dbPlan = planMap[plan] ?? 'FREE';
        const subscriptionId = typeof session.subscription === 'string'
          ? session.subscription
          : session.subscription?.id ?? null;
        const customerId = typeof session.customer === 'string'
          ? session.customer
          : session.customer?.id ?? null;

        let planExpiresAt: Date | null = null;
        if (subscriptionId) {
          const sub = await stripe.subscriptions.retrieve(subscriptionId);
          const periodEnd = (sub as unknown as Record<string, unknown>)['current_period_end'] as number | undefined;
          if (periodEnd) planExpiresAt = new Date(periodEnd * 1000);
        }

        await prisma.user.update({
          where: { id: userId },
          data: {
            plan: dbPlan,
            stripeCustomerId: customerId ?? undefined,
            stripeSubscriptionId: subscriptionId ?? undefined,
            planExpiresAt,
          },
        });
        break;
      }

      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription;
        const userId = sub.metadata?.userId;
        if (!userId) break;

        const plan = sub.metadata?.plan;
        const dbPlan = planMap[plan ?? ''] ?? 'FREE';
        const isActive = sub.status === 'active' || sub.status === 'trialing';
        const periodEnd = (sub as unknown as Record<string, unknown>)['current_period_end'] as number | undefined;

        await prisma.user.update({
          where: { id: userId },
          data: {
            plan: isActive ? dbPlan : 'FREE',
            planExpiresAt: periodEnd ? new Date(periodEnd * 1000) : null,
          },
        });
        break;
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription;
        const userId = sub.metadata?.userId;
        if (!userId) break;

        await prisma.user.update({
          where: { id: userId },
          data: { plan: 'FREE', stripeSubscriptionId: null, planExpiresAt: null },
        });
        break;
      }
    }
  } catch (err) {
    console.error('Webhook handler error:', err);
    return new Response('Webhook handler failed', { status: 500 });
  }

  return new Response('ok', { status: 200 });
}
