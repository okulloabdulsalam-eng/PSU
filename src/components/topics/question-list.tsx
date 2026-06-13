"use client";
import { useState } from "react";
import Link from "next/link";
import { Lock, Bookmark, BookmarkCheck, Crown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Props {
  questions: any[];
  isPremium: boolean;
  bookmarkedIds: string[];
  session: any;
}

export function QuestionList({ questions, isPremium, bookmarkedIds, session }: Props) {
  const [bookmarks, setBookmarks] = useState(new Set(bookmarkedIds));

  const toggleBookmark = async (questionId: string) => {
    if (!session) { toast.error("Sign in to bookmark"); return; }
    const res = await fetch("/api/bookmarks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questionId }),
    });
    const data = await res.json();
    setBookmarks((prev) => {
      const next = new Set(prev);
      data.bookmarked ? next.add(questionId) : next.delete(questionId);
      return next;
    });
    toast.success(data.bookmarked ? "Bookmarked" : "Removed bookmark");
  };

  return (
    <div className="space-y-3">
      {questions.map((q, i) => {
        const isLocked = q.isPremium && !isPremium;
        const isBookmarked = bookmarks.has(q.id);

        return (
          <div key={q.id} className={`bg-surface rounded-2xl border p-4 ${isLocked ? "opacity-75" : "border-border"}`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="text-xs font-bold text-muted">Q{i + 1}</span>
                  <Badge variant={q.difficulty === "EASY" ? "easy" : q.difficulty === "MEDIUM" ? "medium" : "hard"}>
                    {q.difficulty}
                  </Badge>
                  {q.isPremium && <Badge variant="premium"><Lock className="h-2.5 w-2.5" /> Premium</Badge>}
                  {q.pastExamYear && <Badge variant="outline">{q.pastExamYear}</Badge>}
                </div>
                <p className={`text-sm text-dark leading-relaxed ${isLocked ? "line-clamp-2" : ""}`}>
                  {isLocked ? q.text.substring(0, 100) + "..." : q.text}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {session && !isLocked && (
                  <button onClick={() => toggleBookmark(q.id)} className="p-2 rounded-lg hover:bg-background transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center">
                    {isBookmarked ? <BookmarkCheck className="h-4 w-4 text-primary-500" /> : <Bookmark className="h-4 w-4 text-muted" />}
                  </button>
                )}
                {isLocked ? (
                  <Button size="sm" variant="premium" asChild>
                    <Link href="/pricing"><Crown className="h-3 w-3" /></Link>
                  </Button>
                ) : (
                  <Button size="sm" variant="outline" asChild>
                    <Link href={`/quiz?questionId=${q.id}&mode=practice`}>Practice</Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
