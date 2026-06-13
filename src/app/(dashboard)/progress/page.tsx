import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ProgressClient } from "@/components/progress/progress-client";

export const dynamic = "force-dynamic";
export const metadata = { title: "My Progress" };

export default async function ProgressPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const [progressData, attempts, user, subjects] = await Promise.all([
    prisma.progress.findMany({
      where: { userId: session.user.id },
      include: { topic: { include: { subject: true } } },
    }),
    prisma.quizAttempt.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 500,
      include: {
        question: { include: { topic: { include: { subject: true } } } },
      },
    }),
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { streakDays: true, name: true },
    }),
    prisma.subject.findMany({ orderBy: { displayOrder: "asc" } }),
  ]);

  return (
    <ProgressClient
      progressData={progressData as any}
      attempts={attempts as any}
      user={user as any}
      subjects={subjects as any}
    />
  );
}
