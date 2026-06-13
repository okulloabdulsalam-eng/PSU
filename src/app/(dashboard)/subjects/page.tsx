import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { SubjectsClient } from "@/components/subjects/subjects-client";

export const dynamic = "force-dynamic";
export const metadata = { title: "Subjects" };
export const revalidate = 3600;

export default async function SubjectsPage() {
  const session = await getServerSession(authOptions);
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

  const progressData = session
    ? await prisma.progress.findMany({
        where: { userId: session.user.id },
        select: { topicId: true, completed: true },
      })
    : [];

  return (
    <SubjectsClient subjects={subjects as any} progressData={progressData} />
  );
}
