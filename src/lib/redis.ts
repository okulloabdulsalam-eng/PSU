import { Redis } from "@upstash/redis";

let _redis: Redis | null = null;

export function getRedis(): Redis {
  if (!_redis) {
    _redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });
  }
  return _redis;
}

// Keep named export for backward compat
export const redis = {
  get: async <T>(key: string) => {
    try {
      return await getRedis().get<T>(key);
    } catch {
      return null;
    }
  },
  set: async (key: string, value: unknown, opts?: { ex: number }) => {
    try {
      return await getRedis().set(key, value, opts);
    } catch {
      return null;
    }
  },
  del: async (key: string) => {
    try {
      return await getRedis().del(key);
    } catch {
      return null;
    }
  },
};

export const CACHE_KEYS = {
  note: (id: string) => `note:${id}`,
  subjects: "subjects:all",
  topicsBySubject: (slug: string) => `topics:${slug}`,
  stats: "stats:public",
};

export const CACHE_TTL = {
  note: 3600,
  subjects: 3600,
  topics: 1800,
  stats: 600,
};
