import { prisma } from "@/lib/prisma";
import { QuestionEditorClient } from "@/components/admin/question-editor-client";

export const dynamic = "force-dynamic";
export const metadata = { title: "Question Editor" };

export default async function AdminQuestionsPage() {
  const subjects = await prisma.subject.findMany({
    orderBy: { displayOrder: "asc" },
    include: { topics: { orderBy: { displayOrder: "asc" } } },
  });
  return <QuestionEditorClient subjects={subjects as any} />;
}
