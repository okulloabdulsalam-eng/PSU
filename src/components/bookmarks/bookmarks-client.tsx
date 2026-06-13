"use client";
import { useState } from "react";
import Link from "next/link";
import { Bookmark, BookmarkX, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export function BookmarksClient({ bookmarks: initial }: { bookmarks: any[] }) {
  const [bookmarks, setBookmarks] = useState(initial);

  const removeBookmark = async (questionId: string) => {
    await fetch("/api/bookmarks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questionId }),
    });
    setBookmarks((prev) => prev.filter((b) => b.questionId !== questionId));
    toast.success("Bookmark removed");
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-sora text-3xl font-bold text-dark">Bookmarks</h1>
        <p className="text-muted text-sm mt-1">{bookmarks.length} saved questions</p>
      </div>

      {bookmarks.length === 0 ? (
        <div className="text-center py-20">
          <Bookmark className="h-12 w-12 text-muted mx-auto mb-4" />
          <h2 className="font-sora text-xl font-semibold text-dark mb-2">No bookmarks yet</h2>
          <p className="text-muted text-sm mb-6">Bookmark questions while practicing to review them later.</p>
          <Button asChild><Link href="/questions">Browse Questions</Link></Button>
        </div>
      ) : (
        <div className="space-y-3">
          {bookmarks.map((b) => (
            b.question && (
              <div key={b.id} className="bg-surface rounded-2xl border border-border p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <Badge variant={b.question.difficulty === "EASY" ? "easy" : b.question.difficulty === "MEDIUM" ? "medium" : "hard"}>
                        {b.question.difficulty}
                      </Badge>
                      {b.question.topic?.subject && <Badge variant="secondary">{b.question.topic.subject.name}</Badge>}
                    </div>
                    <p className="text-sm text-dark leading-relaxed line-clamp-2">{b.question.text}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => removeBookmark(b.questionId)} className="p-2 rounded-lg hover:bg-red-50 text-muted hover:text-red-500 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center">
                      <BookmarkX className="h-4 w-4" />
                    </button>
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/quiz?questionId=${b.questionId}&mode=practice`}>Practice</Link>
                    </Button>
                  </div>
                </div>
              </div>
            )
          ))}
        </div>
      )}
    </div>
  );
}
