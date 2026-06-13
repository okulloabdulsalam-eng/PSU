import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardClient } from "@/components/dashboard/dashboard-client";

export const dynamic = "force-dynamic";
export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  const [subjects, progressData, recentAttempts, user] = await Promise.all([
    prisma.subject.findMany({
      orderBy: { displayOrder: "asc" },
      include: {
        topics: {
          include: {
            _count: { select: { notes: true, videos: true, questions: true } },
          },
        },
      },
    }),
    prisma.progress.findMany({
      where: { userId: session.user.id },
      include: { topic: { include: { subject: true } } },
    }),
    prisma.quizAttempt.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 200,
      include: {
        question: { include: { topic: { include: { subject: true } } } },
      },
    }),
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { name: true, plan: true, streakDays: true, lastActiveAt: true },
    }),
  ]);

  return (
    <DashboardClient
      subjects={subjects as any}
      progressData={progressData as any}
      recentAttempts={recentAttempts as any}
      user={user as any}
      session={session}
    />
  );
}
