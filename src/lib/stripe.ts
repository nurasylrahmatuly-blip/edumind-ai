import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const PLANS = {
  free: {
    name: 'Free',
    price: 0,
    priceKZT: 0,
    requests: 50,
    agents: 2,
    stripePriceId: null as string | null,
  },
  pro: {
    name: 'Student Pro',
    price: 14,
    priceKZT: 4990,
    requests: -1,
    agents: 9,
    stripePriceId: process.env.STRIPE_PRICE_ID_PRO ?? null,
  },
  academic: {
    name: 'Academic+',
    price: 29,
    priceKZT: 9990,
    requests: -1,
    agents: 9,
    stripePriceId: process.env.STRIPE_PRICE_ID_ACADEMIC ?? null,
  },
} as const;

export type PlanKey = keyof typeof PLANS;
