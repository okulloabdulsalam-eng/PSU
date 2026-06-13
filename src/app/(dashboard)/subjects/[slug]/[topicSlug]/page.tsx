import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound } from "next/navigation";
import { TopicClient } from "@/components/topics/topic-client";
import { redis, CACHE_KEYS, CACHE_TTL } from "@/lib/redis";

export async function generateMetadata({
  params,
}: {
  params: { slug: string; topicSlug: string };
}) {
  const topic = await prisma.topic.findFirst({
    where: { slug: params.topicSlug },
  });
  return { title: topic?.title ?? "Topic" };
}

export default async function TopicPage({
  params,
}: {
  params: { slug: string; topicSlug: string };
}) {
  const session = await getServerSession(authOptions);

  const topic = await prisma.topic.findFirst({
    where: { slug: params.topicSlug, subject: { slug: params.slug } },
    include: {
      subject: true,
      notes: { orderBy: { createdAt: "asc" } },
      videos: { orderBy: { displayOrder: "asc" } },
      questions: {
        orderBy: { createdAt: "asc" },
        include: { options: { orderBy: { displayOrder: "asc" } } },
      },
    },
  });

  if (!topic) notFound();

  const isPremium = session?.user.plan === "PREMIUM";

  // Cache note HTML content in Redis
  const notesWithCache = await Promise.all(
    topic.notes.map(async (note) => {
      const key = CACHE_KEYS.note(note.id);
      let content = note.content;
      try {
        const cached = await redis.get<string>(key);
        if (cached) {
          content = cached;
        } else {
          await redis.set(key, note.content, { ex: CACHE_TTL.note });
        }
      } catch {}
      return { ...note, content };
    }),
  );

  const bookmarks = session
    ? await prisma.bookmark.findMany({
        where: {
          userId: session.user.id,
          questionId: { in: topic.questions.map((q) => q.id) },
        },
        select: { questionId: true },
      })
    : [];

  const bookmarkedIds = bookmarks
    .map((b) => b.questionId)
    .filter(Boolean) as string[];

  return (
    <TopicClient
      topic={{ ...topic, notes: notesWithCache } as any}
      isPremium={isPremium}
      session={session}
      bookmarkedIds={bookmarkedIds}
    />
  );
}
