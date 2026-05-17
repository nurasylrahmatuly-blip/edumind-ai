import { auth } from '@/auth';
import { stripe, PLANS, PlanKey } from '@/lib/stripe';

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return new Response('Unauthorized', { status: 401 });

  const body = await req.json() as { plan: PlanKey; currency?: string };
  const { plan } = body;

  if (plan === 'free') return new Response('Cannot checkout free plan', { status: 400 });

  const planConfig = PLANS[plan];
  if (!planConfig.stripePriceId) {
    return Response.json({ error: 'Stripe price not configured' }, { status: 500 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    customer_email: session.user.email ?? undefined,
    line_items: [{ price: planConfig.stripePriceId, quantity: 1 }],
    success_url: `${baseUrl}/dashboard?upgraded=true`,
    cancel_url: `${baseUrl}/pricing`,
    metadata: { userId: session.user.id, plan },
    subscription_data: { metadata: { userId: session.user.id, plan } },
  });

  return Response.json({ url: checkoutSession.url });
}
