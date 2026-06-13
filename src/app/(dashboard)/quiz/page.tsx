import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { QuizClient } from "@/components/quiz/quiz-client";

export const dynamic = "force-dynamic";
export const metadata = { title: "Quiz" };

export default async function QuizPage({
  searchParams,
}: {
  searchParams: {
    mode?: string;
    topicId?: string;
    subjectId?: string;
    questionId?: string;
  };
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const mode = searchParams.mode || "practice";
  const isPremium = session.user.plan === "PREMIUM";

  let questions: any[] = [];

  if (searchParams.questionId) {
    const q = await prisma.question.findUnique({
      where: { id: searchParams.questionId },
      include: {
        options: { orderBy: { displayOrder: "asc" } },
        topic: { include: { subject: true } },
      },
    });
    if (q) questions = [q];
  } else if (searchParams.topicId) {
    questions = await prisma.question.findMany({
      where: {
        topicId: searchParams.topicId,
        ...(isPremium ? {} : { isPremium: false }),
      },
      include: {
        options: { orderBy: { displayOrder: "asc" } },
        topic: { include: { subject: true } },
      },
      orderBy: { createdAt: "asc" },
    });
  } else if (mode === "mock") {
    if (!isPremium) redirect("/pricing?reason=mock");
    questions = await prisma.question.findMany({
      take: 100,
      include: {
        options: { orderBy: { displayOrder: "asc" } },
        topic: { include: { subject: true } },
      },
      orderBy: { createdAt: "asc" },
    });
  } else {
    questions = await prisma.question.findMany({
      where: isPremium ? {} : { isPremium: false },
      take: 20,
      include: {
        options: { orderBy: { displayOrder: "asc" } },
        topic: { include: { subject: true } },
      },
      orderBy: { createdAt: "asc" },
    });
  }

  return (
    <QuizClient
      questions={questions}
      mode={mode as "practice" | "mock"}
      session={session}
    />
  );
}
