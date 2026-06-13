import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound } from "next/navigation";
import { SubjectDetailClient } from "@/components/subjects/subject-detail-client";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const subject = await prisma.subject.findUnique({ where: { slug: params.slug } });
  return { title: subject?.name ?? "Subject" };
}

export default async function SubjectDetailPage({ params }: { params: { slug: string } }) {
  const session = await getServerSession(authOptions);
  const subject = await prisma.subject.findUnique({
    where: { slug: params.slug },
    include: {
      topics: {
        orderBy: { displayOrder: "asc" },
        include: {
          _count: { select: { notes: true, videos: true, questions: true } },
        },
      },
    },
  });
  if (!subject) notFound();

  const progressData = session
    ? await prisma.progress.findMany({
        where: { userId: session.user.id, topicId: { in: subject.topics.map((t) => t.id) } },
        select: { topicId: true, completed: true, lastQuizScore: true },
      })
    : [];

  const isPremium = session?.user.plan === "PREMIUM";

  return (
    <SubjectDetailClient
      subject={subject as any}
      progressData={progressData}
      isPremium={isPremium}
    />
  );
}
