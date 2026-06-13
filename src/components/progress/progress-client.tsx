"use client";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from "recharts";
import { Flame, Target, TrendingUp, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props { progressData: any[]; attempts: any[]; user: any; subjects: any[]; }

export function ProgressClient({ progressData, attempts, user, subjects }: Props) {
  const totalAnswered = attempts.length;
  const totalCorrect = attempts.filter((a) => a.isCorrect).length;
  const accuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;
  const completed = progressData.filter((p) => p.completed).length;

  const subjectData = useMemo(() =>
    subjects.map((s) => {
      const topicIds = new Set<string>();
      const subjectAttempts = attempts.filter((a) => {
        const match = a.question?.topic?.subject?.id === s.id;
        if (match) topicIds.add(a.question.topic.id);
        return match;
      });
      const correct = subjectAttempts.filter((a) => a.isCorrect).length;
      const score = subjectAttempts.length > 0 ? Math.round((correct / subjectAttempts.length) * 100) : 0;
      return { subject: s.name.length > 14 ? s.name.substring(0, 14) + "…" : s.name, score };
    }),
    [subjects, attempts]
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-sora text-3xl font-bold text-dark">My Progress</h1>
        <p className="text-muted text-sm mt-1">Track your performance across all subjects</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Study Streak", value: `${user?.streakDays || 0} 🔥`, sub: "consecutive days", color: "text-amber-500", bg: "bg-amber-50" },
          { label: "Questions Answered", value: totalAnswered, sub: "total attempts", color: "text-primary-500", bg: "bg-primary-50" },
          { label: "Accuracy Rate", value: `${accuracy}%`, sub: "correct answers", color: "text-green-500", bg: "bg-green-50" },
          { label: "Topics Completed", value: completed, sub: "marked done", color: "text-purple-500", bg: "bg-purple-50" },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card>
              <CardContent className="pt-5 pb-4">
                <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${s.bg} mb-3`}>
                  <TrendingUp className={`h-5 w-5 ${s.color}`} />
                </div>
                <div className="font-sora text-2xl font-bold text-dark">{s.value}</div>
                <div className="text-xs text-muted">{s.sub}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Radar chart */}
      <Card>
        <CardHeader><CardTitle>Performance by Subject</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <RadarChart data={subjectData}>
              <PolarGrid stroke="#E2E8F0" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: "#94A3B8", fontFamily: "DM Sans" }} />
              <Radar name="Score" dataKey="score" stroke="#1A56DB" fill="#1A56DB" fillOpacity={0.2} strokeWidth={2} />
              <Tooltip formatter={(v) => [`${v}%`, "Score"]} contentStyle={{ borderRadius: "12px", border: "1px solid #E2E8F0" }} />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Subject table */}
      <Card>
        <CardHeader><CardTitle>Subject Breakdown</CardTitle></CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {subjectData.map((s) => (
              <div key={s.subject} className="flex items-center justify-between px-6 py-3">
                <span className="text-sm font-medium text-dark">{s.subject}</span>
                <div className="flex items-center gap-3">
                  <div className="w-24 bg-background rounded-full h-2">
                    <div className={`h-2 rounded-full ${s.score >= 80 ? "bg-green-500" : s.score >= 60 ? "bg-amber-500" : "bg-red-500"}`}
                      style={{ width: `${s.score}%` }} />
                  </div>
                  <span className={`text-xs font-bold w-10 text-right ${s.score >= 80 ? "text-green-600" : s.score >= 60 ? "text-amber-600" : "text-red-600"}`}>
                    {s.score}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
