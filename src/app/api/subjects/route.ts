import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { redis, CACHE_KEYS, CACHE_TTL } from "@/lib/redis";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const cached = await redis.get(CACHE_KEYS.subjects);
    if (cached) return NextResponse.json(cached);
  } catch {}

  const subjects = await prisma.subject.findMany({
    orderBy: { displayOrder: "asc" },
    include: {
      _count: { select: { topics: true } },
    },
  });

  try {
    await redis.set(CACHE_KEYS.subjects, subjects, { ex: CACHE_TTL.subjects });
  } catch {}

  return NextResponse.json(subjects);
}
