export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redis, CACHE_KEYS } from "@/lib/redis";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { title, topicId, content, isPremium } = await req.json();
  const note = await prisma.note.create({
    data: { title, topicId, content, isPremium },
  });
  await redis.set(CACHE_KEYS.note(note.id), content, { ex: 3600 });
  return NextResponse.json(note, { status: 201 });
}
