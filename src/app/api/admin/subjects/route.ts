export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const subjects = await prisma.subject.findMany({
    orderBy: { displayOrder: "asc" },
    include: {
      _count: { select: { topics: true } },
      topics: {
        include: {
          _count: { select: { notes: true, videos: true, questions: true } },
        },
      },
    },
  });
  return NextResponse.json(subjects);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const data = await req.json();
  const subject = await prisma.subject.create({ data });
  return NextResponse.json(subject, { status: 201 });
}
