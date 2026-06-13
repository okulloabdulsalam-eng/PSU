import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { QuestionBankClient } from "@/components/questions/question-bank-client";

export const dynamic = "force-dynamic";
export const metadata = { title: "Question Bank" };

export default async function QuestionBankPage() {
  const session = await getServerSession(authOptions);
  const isPremium = session?.user.plan === "PREMIUM";

  const [subjects, totalCount] = await Promise.all([
    prisma.subject.findMany({
      orderBy: { displayOrder: "asc" },
      include: { topics: { select: { id: true, title: true } } },
    }),
    prisma.question.count({
      where: isPremium ? undefined : { isPremium: false },
    }),
  ]);

  return (
    <QuestionBankClient
      subjects={subjects as any}
      totalCount={totalCount}
      isPremium={isPremium}
    />
  );
}
