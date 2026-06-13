import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { redis, CACHE_KEYS, CACHE_TTL } from "@/lib/redis";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  // Try cache first
  try {
    const cached = await redis.get(CACHE_KEYS.note(params.id));
    if (cached) {
      const note = await prisma.note.findUnique({ where: { id: params.id }, select: { id: true, title: true, isPremium: true, topicId: true } });
      return NextResponse.json({ ...note, content: cached, fromCache: true });
    }
  } catch {}

  const note = await prisma.note.findUnique({ where: { id: params.id } });
  if (!note) return NextResponse.json({ error: "Not found" }, { status: 404 });

  try {
    await redis.set(CACHE_KEYS.note(note.id), note.content, { ex: CACHE_TTL.note });
  } catch {}

  return NextResponse.json(note);
}
