import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export const freeLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(50, '1 d'),
  prefix: 'rl:free',
});

export const proLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(1000, '1 d'),
  prefix: 'rl:pro',
});

export const apiLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '10 s'),
  prefix: 'rl:burst',
});

export async function checkRateLimit(
  userId: string,
  plan: 'free' | 'pro' | 'academic'
): Promise<{ success: boolean; limit: number; remaining: number; reset: number }> {
  const limiter = plan === 'free' ? freeLimiter : proLimiter;
  const { success, limit, remaining, reset } = await limiter.limit(userId);
  return { success, limit, remaining, reset };
}
