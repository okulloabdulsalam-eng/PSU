import { prisma } from "@/lib/prisma";
import { VideoManagerClient } from "@/components/admin/video-manager-client";

export const dynamic = "force-dynamic";
export const metadata = { title: "Video Manager" };

export default async function AdminVideosPage() {
  const subjects = await prisma.subject.findMany({
    orderBy: { displayOrder: "asc" },
    include: { topics: { orderBy: { displayOrder: "asc" } } },
  });
  return <VideoManagerClient subjects={subjects as any} />;
}
