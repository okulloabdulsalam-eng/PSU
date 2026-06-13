import { prisma } from "@/lib/prisma";
import { AdminDashboardClient } from "@/components/admin/admin-dashboard-client";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin Dashboard" };

export default async function AdminPage() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [totalUsers, premiumUsers, monthlyRevenue, subjects, recentPayments] =
    await Promise.all([
      prisma.user.count({ where: { role: "STUDENT" } }),
      prisma.user.count({ where: { plan: "PREMIUM" } }),
      prisma.payment.aggregate({
        where: { status: "SUCCESS", createdAt: { gte: startOfMonth } },
        _sum: { amount: true },
      }),
      prisma.subject.findMany({
        orderBy: { displayOrder: "asc" },
        include: {
          topics: {
            include: {
              _count: { select: { questions: true } },
              questions: {
                include: { quizAttempts: { select: { isCorrect: true } } },
              },
            },
          },
        },
      }),
      prisma.payment.findMany({
        where: { status: "SUCCESS" },
        orderBy: { createdAt: "desc" },
        take: 10,
        include: { user: { select: { name: true, email: true } } },
      }),
    ]);

  const subjectStats = subjects.map((s) => {
    const allAttempts = s.topics.flatMap((t) =>
      t.questions.flatMap((q) => q.quizAttempts),
    );
    const correct = allAttempts.filter((a) => a.isCorrect).length;
    const score =
      allAttempts.length > 0
        ? Math.round((correct / allAttempts.length) * 100)
        : 0;
    return { name: s.name.substring(0, 12), score, total: allAttempts.length };
  });

  return (
    <AdminDashboardClient
      totalUsers={totalUsers}
      premiumUsers={premiumUsers}
      monthlyRevenue={monthlyRevenue._sum.amount || 0}
      subjectStats={subjectStats}
      recentPayments={recentPayments as any}
    />
  );
}
