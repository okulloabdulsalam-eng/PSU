import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { subjectId, title, description, isPremium, displayOrder } = await req.json();
  const slug = title.toLowerCase().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
  const topic = await prisma.topic.create({ data: { subjectId, title, slug, description, isPremium, displayOrder } });
  return NextResponse.json(topic, { status: 201 });
}
