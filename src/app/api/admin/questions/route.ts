import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { topicId, text, explanation, difficulty, type, isPremium, pastExamYear, imageUrl, explanationImageUrl, options } = await req.json();

  const question = await prisma.question.create({
    data: {
      topicId, text, explanation, difficulty, type, isPremium, pastExamYear, imageUrl, explanationImageUrl,
      options: {
        create: options.map((o: any, i: number) => ({
          text: o.text, isCorrect: o.isCorrect, displayOrder: i,
        })),
      },
    },
    include: { options: true },
  });

  return NextResponse.json(question, { status: 201 });
}
