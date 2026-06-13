import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const isPremium = session?.user.plan === "PREMIUM";

  const topic = await prisma.topic.findUnique({
    where: { id: params.id },
    include: {
      subject: true,
      notes: { orderBy: { createdAt: "asc" } },
      videos: { orderBy: { displayOrder: "asc" } },
      questions: {
        where: isPremium ? {} : { isPremium: false },
        include: { options: { orderBy: { displayOrder: "asc" } } },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!topic) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(topic);
}
