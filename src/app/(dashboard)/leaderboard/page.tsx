import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { LeaderboardClient } from "@/components/leaderboard/leaderboard-client";

export const dynamic = "force-dynamic";
export const metadata = { title: "Weekly Leaderboard" };

export default async function LeaderboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  if (session.user.plan !== "PREMIUM") redirect("/pricing?reason=leaderboard");

  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const topUsers = await prisma.user.findMany({
    where: { role: "STUDENT" },
    select: {
      id: true,
      name: true,
      image: true,
      quizAttempts: {
        where: { createdAt: { gte: oneWeekAgo }, isCorrect: true },
        select: { id: true },
      },
    },
    take: 50,
  });

  const ranked = topUsers
    .map((u) => ({ ...u, correctThisWeek: u.quizAttempts.length }))
    .sort((a, b) => b.correctThisWeek - a.correctThisWeek)
    .slice(0, 10);

  return (
    <LeaderboardClient users={ranked as any} currentUserId={session.user.id} />
  );
}
