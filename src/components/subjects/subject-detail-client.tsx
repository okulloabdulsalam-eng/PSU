"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, Lock, BookOpen, Video, HelpCircle, ArrowLeft, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Props {
  subject: any;
  progressData: { topicId: string; completed: boolean; lastQuizScore: number | null }[];
  isPremium: boolean;
}

export function SubjectDetailClient({ subject, progressData, isPremium }: Props) {
  const progressMap = new Map(progressData.map((p) => [p.topicId, p]));

  return (
    <div>
      <div className="mb-6">
        <Link href="/subjects" className="inline-flex items-center gap-1 text-sm text-muted hover:text-dark transition-colors mb-4">
          <ArrowLeft className="h-4 w-4" /> All Subjects
        </Link>
        <div className="flex items-center gap-4">
          <div className="text-4xl">{subject.icon}</div>
          <div>
            <h1 className="font-sora text-3xl font-bold text-dark">{subject.name}</h1>
            <p className="text-muted text-sm mt-1">{subject.description}</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {subject.topics.map((topic: any, i: number) => {
          const prog = progressMap.get(topic.id);
          const isCompleted = prog?.completed ?? false;
          const isLocked = topic.isPremium && !isPremium;
          const score = prog?.lastQuizScore;

          return (
            <motion.div
              key={topic.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}
            >
              <div className={`bg-surface rounded-2xl border p-4 sm:p-5 flex items-center justify-between gap-4 ${isLocked ? "border-border opacity-80" : "border-border hover:border-primary-200"} transition-all duration-200`}>
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isCompleted ? "bg-green-100" : "bg-background"}`}>
                    {isCompleted ? (
                      <CheckCircle2 className="h-5 w-5 text-accent-green" />
                    ) : isLocked ? (
                      <Lock className="h-5 w-5 text-muted" />
                    ) : (
                      <span className="font-sora font-bold text-sm text-muted">{i + 1}</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-sora font-semibold text-dark text-sm truncate">{topic.title}</h3>
                      {topic.isPremium && (
                        <Badge variant="premium"><Lock className="h-2.5 w-2.5" /> Premium</Badge>
                      )}
                      {score !== null && score !== undefined && (
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${score >= 80 ? "bg-green-100 text-green-700" : score >= 60 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}>
                          {Math.round(score)}%
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted">
                      <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" /> {topic._count.notes}</span>
                      <span className="flex items-center gap-1"><Video className="h-3 w-3" /> {topic._count.videos}</span>
                      <span className="flex items-center gap-1"><HelpCircle className="h-3 w-3" /> {topic._count.questions}</span>
                    </div>
                  </div>
                </div>

                {isLocked ? (
                  <Button size="sm" variant="premium" asChild>
                    <Link href="/pricing"><Lock className="h-3 w-3" /> Unlock</Link>
                  </Button>
                ) : (
                  <Button size="sm" variant="outline" asChild>
                    <Link href={`/subjects/${subject.slug}/${topic.slug}`}>
                      Study <ArrowRight className="h-3 w-3" />
                    </Link>
                  </Button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
