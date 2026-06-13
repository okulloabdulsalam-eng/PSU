export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const isPremium = session?.user.plan === "PREMIUM";
  const { searchParams } = new URL(req.url);

  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "20");
  const search = searchParams.get("search") || "";
  const subjectId = searchParams.get("subjectId");
  const topicId = searchParams.get("topicId");
  const difficulty = searchParams.get("difficulty");
  const year = searchParams.get("year");
  const hasImage = searchParams.get("hasImage");

  const where: any = {};
  if (!isPremium) where.isPremium = false;
  if (difficulty && difficulty !== "all") where.difficulty = difficulty;
  if (year && year !== "all") where.pastExamYear = parseInt(year);
  if (hasImage === "true") where.imageUrl = { not: null };
  if (search) where.text = { contains: search, mode: "insensitive" };
  if (topicId && topicId !== "all") where.topicId = topicId;
  if (subjectId && subjectId !== "all") where.topic = { subjectId };

  const [questions, total] = await Promise.all([
    prisma.question.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: "desc" },
      include: {
        topic: { include: { subject: true } },
        options: { orderBy: { displayOrder: "asc" } },
      },
    }),
    prisma.question.count({ where }),
  ]);

  return NextResponse.json({ questions, total });
}
