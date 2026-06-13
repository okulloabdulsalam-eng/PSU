export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const progress = await prisma.progress.findMany({
    where: { userId: session.user.id },
    include: { topic: { include: { subject: true } } },
  });

  const attempts = await prisma.quizAttempt.findMany({
    where: { userId: session.user.id },
    include: {
      question: { include: { topic: { include: { subject: true } } } },
    },
    orderBy: { createdAt: "desc" },
  });

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { streakDays: true, lastActiveAt: true },
  });

  return NextResponse.json({ progress, attempts, user });
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { topicId, completed, score } = await req.json();

  const result = await prisma.progress.upsert({
    where: { userId_topicId: { userId: session.user.id, topicId } },
    update: { completed, lastQuizScore: score },
    create: {
      userId: session.user.id,
      topicId,
      completed,
      lastQuizScore: score,
    },
  });

  return NextResponse.json(result);
}
