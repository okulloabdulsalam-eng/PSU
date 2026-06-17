import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { redis, CACHE_KEYS, CACHE_TTL } from "@/lib/redis";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const cached = await redis.get(CACHE_KEYS.stats);
    if (cached) return NextResponse.json(cached);
  } catch {}

  const [students, questions, videos, totalAttempts, correctAttempts] = await Promise.all([
    prisma.user.count({ where: { role: "STUDENT" } }),
    prisma.question.count(),
    prisma.video.count(),
    prisma.quizAttempt.count(),
    prisma.quizAttempt.count({ where: { isCorrect: true } }),
  ]);

  const passRate = totalAttempts > 0
    ? Math.round((correctAttempts / totalAttempts) * 100)
    : 0;

  const stats = { students, questions, videos, passRate };

  try {
    await redis.set(CACHE_KEYS.stats, stats, { ex: CACHE_TTL.stats });
  } catch {}

  return NextResponse.json(stats);
}
