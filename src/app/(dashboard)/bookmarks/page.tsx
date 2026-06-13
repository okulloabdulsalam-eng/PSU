import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { BookmarksClient } from "@/components/bookmarks/bookmarks-client";

export const dynamic = "force-dynamic";
export const metadata = { title: "Bookmarks" };

export default async function BookmarksPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const bookmarks = await prisma.bookmark.findMany({
    where: { userId: session.user.id },
    include: {
      question: {
        include: {
          options: { orderBy: { displayOrder: "asc" } },
          topic: { include: { subject: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return <BookmarksClient bookmarks={bookmarks as any} />;
}
