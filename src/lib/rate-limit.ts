import { getRedis } from "./redis";

interface RateLimitResult {
  success: boolean;
  remaining: number;
}

export async function rateLimit(
  key: string,
  maxRequests: number,
  windowSeconds: number,
): Promise<RateLimitResult> {
  try {
    const redis = getRedis();
    const current = await redis.incr(key);
    if (current === 1) {
      await redis.expire(key, windowSeconds);
    }
    return {
      success: current <= maxRequests,
      remaining: Math.max(0, maxRequests - current),
    };
  } catch {
    // If Redis is down, allow the request
    return { success: true, remaining: maxRequests };
  }
}
