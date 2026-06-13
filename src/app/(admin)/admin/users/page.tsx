import { prisma } from "@/lib/prisma";
import { AdminUsersClient } from "@/components/admin/admin-users-client";

export const dynamic = "force-dynamic";
export const metadata = { title: "Users" };

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    where: { role: "STUDENT" },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      plan: true,
      planExpiresAt: true,
      createdAt: true,
      _count: { select: { quizAttempts: true } },
    },
  });
  return <AdminUsersClient users={users as any} />;
}
