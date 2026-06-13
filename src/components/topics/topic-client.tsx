"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Lock, Crown } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { NoteViewer } from "./note-viewer";
import { VideoGrid } from "./video-grid";
import { QuestionList } from "./question-list";
import { Button } from "@/components/ui/button";

interface Props {
  topic: any;
  isPremium: boolean;
  session: any;
  bookmarkedIds: string[];
}

export function TopicClient({ topic, isPremium, session, bookmarkedIds }: Props) {
  return (
    <div>
      <div className="mb-6">
        <Link href={`/subjects/${topic.subject.slug}`} className="inline-flex items-center gap-1 text-sm text-muted hover:text-dark transition-colors mb-3">
          <ArrowLeft className="h-4 w-4" /> {topic.subject.name}
        </Link>
        <h1 className="font-sora text-2xl font-bold text-dark">{topic.title}</h1>
        {topic.description && <p className="text-muted text-sm mt-1">{topic.description}</p>}
      </div>

      <Tabs defaultValue="notes">
        <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
          <TabsList className="mb-6 w-max min-w-full sm:w-auto">
            <TabsTrigger value="notes">📖 Notes ({topic.notes.length})</TabsTrigger>
            <TabsTrigger value="videos">🎬 Videos ({topic.videos.length})</TabsTrigger>
            <TabsTrigger value="questions">❓ Questions ({topic.questions.length})</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="notes">
          <div className="space-y-6">
            {topic.notes.length === 0 ? (
              <div className="text-center py-12 text-muted">No notes yet for this topic.</div>
            ) : (
              topic.notes.map((note: any) => (
                <NoteViewer key={note.id} note={note} isPremium={isPremium} />
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="videos">
          <VideoGrid videos={topic.videos} />
        </TabsContent>

        <TabsContent value="questions">
          {topic.questions.length === 0 ? (
            <div className="text-center py-12 text-muted">No questions yet for this topic.</div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-muted">{topic.questions.length} questions available</p>
                <Button asChild>
                  <Link href={`/quiz?topicId=${topic.id}&mode=practice`}>Practice All</Link>
                </Button>
              </div>
              <QuestionList questions={topic.questions} isPremium={isPremium} bookmarkedIds={bookmarkedIds} session={session} />
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
