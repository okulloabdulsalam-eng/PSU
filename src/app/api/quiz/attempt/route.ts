import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { addDays, isToday, isYesterday } from "date-fns";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { questionId, selectedOptionId } = await req.json();

  const question = await prisma.question.findUnique({
    where: { id: questionId },
    include: { options: true },
  });
  if (!question) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const selectedOption = question.options.find((o) => o.id === selectedOptionId);
  const isCorrect = selectedOption?.isCorrect ?? false;

  await prisma.quizAttempt.create({
    data: {
      userId: session.user.id,
      questionId,
      selectedOptionId,
      isCorrect,
    },
  });

  // Update streak
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (user) {
    let newStreak = user.streakDays;
    const lastActive = user.lastActiveAt;
    if (!lastActive || isYesterday(lastActive)) {
      newStreak = (user.streakDays || 0) + 1;
    } else if (!isToday(lastActive)) {
      newStreak = 1;
    }
    await prisma.user.update({
      where: { id: session.user.id },
      data: { lastActiveAt: new Date(), streakDays: newStreak },
    });
  }

  const correctOption = question.options.find((o) => o.isCorrect);
  return NextResponse.json({ isCorrect, correctOptionId: correctOption?.id, explanation: question.explanation });
}
