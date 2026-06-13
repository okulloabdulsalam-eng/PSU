import { Redis } from "@upstash/redis";

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export const CACHE_KEYS = {
  note: (id: string) => `note:${id}`,
  subjects: "subjects:all",
  topicsBySubject: (slug: string) => `topics:${slug}`,
  stats: "stats:public",
};

export const CACHE_TTL = {
  note: 3600,        // 1 hour
  subjects: 3600,
  topics: 1800,
  stats: 600,
};
