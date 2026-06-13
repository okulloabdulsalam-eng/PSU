import { prisma } from "@/lib/prisma";
import { NoteEditorClient } from "@/components/admin/note-editor-client";

export const dynamic = "force-dynamic";
export const metadata = { title: "Note Editor" };

export default async function AdminNotesPage() {
  const subjects = await prisma.subject.findMany({
    orderBy: { displayOrder: "asc" },
    include: { topics: { orderBy: { displayOrder: "asc" } } },
  });
  return <NoteEditorClient subjects={subjects as any} />;
}
