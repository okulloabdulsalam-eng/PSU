"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Bookmark, BookmarkCheck, CheckCircle2, XCircle, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Props {
  questions: any[];
  session: any;
}

export function PracticeMode({ questions, session }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [results, setResults] = useState<Record<string, { isCorrect: boolean; correctOptionId: string; explanation: string }>>({});
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  const question = questions[currentIndex];
  const isAnswered = !!results[question.id];
  const questionResult = results[question.id];

  const handleAnswer = async (optionId: string) => {
    if (isAnswered || loading) return;
    setSelected((prev) => ({ ...prev, [question.id]: optionId }));
    setLoading(true);
    const res = await fetch("/api/quiz/attempt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questionId: question.id, selectedOptionId: optionId }),
    });
    const data = await res.json();
    setResults((prev) => ({ ...prev, [question.id]: data }));
    setLoading(false);
  };

  const toggleBookmark = async () => {
    if (!session) return;
    const res = await fetch("/api/bookmarks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questionId: question.id }),
    });
    const data = await res.json();
    setBookmarks((prev) => {
      const next = new Set(prev);
      data.bookmarked ? next.add(question.id) : next.delete(question.id);
      return next;
    });
    toast.success(data.bookmarked ? "Bookmarked!" : "Removed bookmark");
  };

  const isBookmarked = bookmarks.has(question.id);

  const getOptionStyle = (option: any) => {
    if (!isAnswered) return "border-border hover:border-primary-300 hover:bg-primary-50 cursor-pointer";
    if (option.id === questionResult?.correctOptionId) return "border-green-400 bg-green-50";
    if (option.id === selected[question.id] && !questionResult?.isCorrect) return "border-red-400 bg-red-50";
    return "border-border opacity-60";
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="font-sora font-bold text-dark text-lg">{currentIndex + 1}</span>
          <span className="text-muted">/ {questions.length}</span>
        </div>
        <div className="flex-1 mx-4 bg-background rounded-full h-2">
          <div
            className="bg-primary-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
        <button onClick={toggleBookmark} className="p-2 rounded-lg hover:bg-background transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center">
          {isBookmarked ? <BookmarkCheck className="h-5 w-5 text-primary-500" /> : <Bookmark className="h-5 w-5 text-muted" />}
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.25 }}
        >
          {/* Question card */}
          <div className="bg-surface rounded-2xl border border-border p-6 mb-4">
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <Badge variant={question.difficulty === "EASY" ? "easy" : question.difficulty === "MEDIUM" ? "medium" : "hard"}>
                {question.difficulty}
              </Badge>
              {question.topic?.subject?.name && (
                <Badge variant="secondary">{question.topic.subject.name}</Badge>
              )}
              {question.pastExamYear && <Badge variant="outline">{question.pastExamYear}</Badge>}
            </div>
            <p className="font-serif text-dark text-base leading-relaxed">{question.text}</p>
          </div>

          {/* Options */}
          <div className="space-y-3 mb-6">
            {question.options.map((option: any, i: number) => (
              <motion.button
                key={option.id}
                whileTap={{ scale: 0.99 }}
                onClick={() => handleAnswer(option.id)}
                className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 min-h-[56px] ${getOptionStyle(option)}`}
              >
                <div className="flex items-start gap-3">
                  <span className="font-sora font-bold text-sm text-muted shrink-0 mt-0.5">
                    {String.fromCharCode(65 + i)}.
                  </span>
                  <span className="text-dark text-sm leading-relaxed">{option.text}</span>
                  {isAnswered && option.id === questionResult?.correctOptionId && (
                    <CheckCircle2 className="h-4 w-4 text-green-500 ml-auto shrink-0 mt-0.5" />
                  )}
                  {isAnswered && option.id === selected[question.id] && !questionResult?.isCorrect && (
                    <XCircle className="h-4 w-4 text-red-500 ml-auto shrink-0 mt-0.5" />
                  )}
                </div>
              </motion.button>
            ))}
          </div>

          {/* Explanation */}
          <AnimatePresence>
            {isAnswered && questionResult && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className={`rounded-2xl p-5 mb-6 border-2 ${questionResult.isCorrect ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}
              >
                <div className="flex items-start gap-3">
                  <Lightbulb className={`h-5 w-5 shrink-0 mt-0.5 ${questionResult.isCorrect ? "text-green-600" : "text-red-600"}`} />
                  <div>
                    <p className={`font-semibold text-sm mb-1 ${questionResult.isCorrect ? "text-green-700" : "text-red-700"}`}>
                      {questionResult.isCorrect ? "✅ Correct!" : "❌ Incorrect"}
                    </p>
                    <p className="text-sm text-dark leading-relaxed">{questionResult.explanation}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="h-4 w-4" /> Previous
            </Button>
            <span className="text-sm text-muted">{currentIndex + 1} of {questions.length}</span>
            {currentIndex < questions.length - 1 ? (
              <Button onClick={() => setCurrentIndex(currentIndex + 1)}>
                Next <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button variant="success" onClick={() => toast.success("Quiz complete! Great work 🎉")}>
                Finish ✓
              </Button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
