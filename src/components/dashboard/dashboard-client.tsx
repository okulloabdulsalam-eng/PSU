"use client";
import { useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ProgressRing } from "./progress-ring";
import { SubjectProgressCard } from "./subject-progress-card";
import { QuizPerformanceChart } from "./quiz-performance-chart";
import { WeakSubjectsList } from "./weak-subjects-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Flame, ArrowRight, BookOpen, Target, TrendingUp } from "lucide-react";
import { subDays, isAfter, format } from "date-fns";

interface Props {
  subjects: any[];
  progressData: any[];
  recentAttempts: any[];
  user: any;
  session: any;
}

export function DashboardClient({ subjects, progressData, recentAttempts, user, session }: Props) {
  const totalTopics = subjects.reduce((sum, s) => sum + s.topics.length, 0);
  const completedTopics = progressData.filter((p) => p.completed).length;
  const overallProgress = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  const totalAttempts = recentAttempts.length;
  const correctAttempts = recentAttempts.filter((a: any) => a.isCorrect).length;
  const accuracy = totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 0;

  // Last 7 days chart data
  const last7Days = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const day = subDays(new Date(), 6 - i);
      const dayStr = format(day, "EEE");
      const dayAttempts = recentAttempts.filter((a: any) =>
        format(new Date(a.createdAt), "yyyy-MM-dd") === format(day, "yyyy-MM-dd")
      );
      const correct = dayAttempts.filter((a: any) => a.isCorrect).length;
      return { day: dayStr, total: dayAttempts.length, correct };
    });
  }, [recentAttempts]);

  // Subject scores
  const subjectScores = useMemo(() => {
    return subjects.map((subject) => {
      const topicIds = subject.topics.map((t: any) => t.id);
      const subjectAttempts = recentAttempts.filter((a: any) =>
        topicIds.includes(a.question?.topic?.id)
      );
      const correct = subjectAttempts.filter((a: any) => a.isCorrect).length;
      const total = subjectAttempts.length;
      const score = total > 0 ? Math.round((correct / total) * 100) : null;
      const completed = progressData.filter((p: any) =>
        topicIds.includes(p.topicId) && p.completed
      ).length;
      return { ...subject, score, completed, totalTopics: subject.topics.length };
    });
  }, [subjects, recentAttempts, progressData]);

  const weakSubjects = subjectScores.filter((s) => s.score !== null && s.score < 60);

  // Last visited topic
  const lastProgress = progressData.sort(
    (a: any, b: any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  )[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-sora text-2xl font-bold text-dark">
              Welcome back, {user?.name?.split(" ")[0]} 👋
            </h1>
            <p className="text-muted text-sm mt-1">Keep up the momentum — you're doing great!</p>
          </div>
          <div className="flex items-center gap-3">
            {user?.streakDays > 0 && (
              <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full">
                <Flame className="h-4 w-4 text-amber-500" />
                <span className="text-sm font-semibold text-amber-700">{user.streakDays} day streak</span>
              </div>
            )}
            {session.user.plan === "FREE" && (
              <Button variant="premium" size="sm" asChild>
                <Link href="/pricing">
                  <Crown className="h-4 w-4" /> Upgrade
                </Link>
              </Button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Overall Progress", value: `${overallProgress}%`, icon: Target, color: "text-primary-500", bg: "bg-primary-50" },
          { label: "Topics Completed", value: `${completedTopics}/${totalTopics}`, icon: BookOpen, color: "text-accent-green", bg: "bg-green-50" },
          { label: "Questions Answered", value: totalAttempts, icon: TrendingUp, color: "text-accent-gold", bg: "bg-amber-50" },
          { label: "Accuracy Rate", value: `${accuracy}%`, icon: Target, color: "text-purple-500", bg: "bg-purple-50" },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card>
              <CardContent className="pt-5 pb-4">
                <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${stat.bg} mb-3`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div className="font-sora text-2xl font-bold text-dark">{stat.value}</div>
                <div className="text-xs text-muted mt-0.5">{stat.label}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Progress Ring + Continue */}
        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Overall Progress</CardTitle></CardHeader>
            <CardContent className="flex flex-col items-center pb-6">
              <ProgressRing percentage={overallProgress} size={160} strokeWidth={14} />
              <p className="text-sm text-muted mt-3 text-center">
                {completedTopics} of {totalTopics} topics complete
              </p>
            </CardContent>
          </Card>

          {lastProgress && (
            <Card>
              <CardContent className="pt-5">
                <p className="text-xs text-muted mb-1 font-semibold uppercase tracking-wide">Continue where you left off</p>
                <p className="font-sora font-semibold text-dark text-sm mb-1">{lastProgress.topic?.title}</p>
                <p className="text-xs text-muted mb-3">{lastProgress.topic?.subject?.name}</p>
                <Button size="sm" variant="outline" className="w-full" asChild>
                  <Link href={`/subjects/${lastProgress.topic?.subject?.slug}/${lastProgress.topic?.slug}`}>
                    Continue <ArrowRight className="h-3 w-3" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Quiz Chart */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader><CardTitle>Quiz Performance (Last 7 Days)</CardTitle></CardHeader>
            <CardContent>
              <QuizPerformanceChart data={last7Days} />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Subjects Grid */}
      <div>
        <h2 className="font-sora text-xl font-bold text-dark mb-4">Subject Progress</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjectScores.map((subject, i) => (
            <motion.div key={subject.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <SubjectProgressCard subject={subject} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Weak Subjects */}
      {weakSubjects.length > 0 && (
        <div>
          <h2 className="font-sora text-xl font-bold text-dark mb-4">⚠️ Needs Attention</h2>
          <WeakSubjectsList subjects={weakSubjects} />
        </div>
      )}
    </div>
  );
}
