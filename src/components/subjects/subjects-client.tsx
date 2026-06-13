"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { BookOpen, Video, HelpCircle, ArrowRight } from "lucide-react";

interface Props {
  subjects: any[];
  progressData: { topicId: string; completed: boolean }[];
}

export function SubjectsClient({ subjects, progressData }: Props) {
  const completedTopicIds = new Set(progressData.filter((p) => p.completed).map((p) => p.topicId));

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-sora text-3xl font-bold text-dark">All Subjects</h1>
        <p className="text-muted mt-1">Choose a subject to start studying</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {subjects.map((subject, i) => {
          const completed = subject.topics.filter((t: any) => completedTopicIds.has(t.id)).length;
          const total = subject.topics.length;
          const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

          const totalNotes = subject.topics.reduce((s: number, t: any) => s + t._count.notes, 0);
          const totalVideos = subject.topics.reduce((s: number, t: any) => s + t._count.videos, 0);
          const totalQuestions = subject.topics.reduce((s: number, t: any) => s + t._count.questions, 0);

          return (
            <motion.div
              key={subject.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              whileHover={{ y: -4, boxShadow: "0 12px 32px rgba(0,0,0,0.10)" }}
            >
              <Link href={`/subjects/${subject.slug}`}>
                <div className="bg-surface rounded-2xl border border-border overflow-hidden hover:border-primary-200 transition-all duration-200 h-full">
                  {/* Color top bar */}
                  <div className="h-1.5" style={{ backgroundColor: subject.color }} />
                  <div className="p-5">
                    <div className="text-3xl mb-3">{subject.icon}</div>
                    <h2 className="font-sora font-bold text-dark text-base mb-1 leading-tight">{subject.name}</h2>
                    <p className="text-xs text-muted mb-4 line-clamp-2">{subject.description}</p>

                    <div className="flex items-center gap-3 text-xs text-muted mb-4">
                      <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" /> {totalNotes} notes</span>
                      <span className="flex items-center gap-1"><Video className="h-3 w-3" /> {totalVideos} videos</span>
                      <span className="flex items-center gap-1"><HelpCircle className="h-3 w-3" /> {totalQuestions} Qs</span>
                    </div>

                    {/* Progress bar */}
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted">{completed}/{total} topics</span>
                      <span className="font-semibold text-dark">{pct}%</span>
                    </div>
                    <div className="w-full bg-background rounded-full h-1.5">
                      <div className="h-1.5 rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: subject.color }} />
                    </div>
                  </div>

                  <div className="px-5 pb-4">
                    <span className="text-xs text-primary-500 font-semibold flex items-center gap-1">
                      Study now <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
