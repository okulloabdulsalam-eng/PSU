"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Clock, RotateCcw } from "lucide-react";

interface Props {
  results: any;
  totalQuestions: number;
}

function formatTime(secs: number) {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  return `${h}h ${m}m`;
}

export function MockResults({ results, totalQuestions }: Props) {
  const pct = Math.round((results.score / totalQuestions) * 100);
  const passed = pct >= 50;

  const chartData = Object.entries(results.bySubject).map(([name, data]: any) => ({
    name: name.length > 12 ? name.substring(0, 12) + "…" : name,
    score: data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0,
  }));

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center mb-8">
        <div className={`text-7xl mb-4`}>{passed ? "🎉" : "📚"}</div>
        <h1 className="font-sora text-3xl font-bold text-dark mb-2">
          {passed ? "Congratulations!" : "Keep Studying!"}
        </h1>
        <p className="text-muted text-lg">{passed ? "You passed the mock exam!" : "You're making progress — keep going!"}</p>
      </motion.div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Score", value: `${results.score}/${totalQuestions}`, icon: CheckCircle2, color: "text-primary-500", bg: "bg-primary-50" },
          { label: "Percentage", value: `${pct}%`, icon: passed ? CheckCircle2 : XCircle, color: passed ? "text-green-500" : "text-red-500", bg: passed ? "bg-green-50" : "bg-red-50" },
          { label: "Time Taken", value: formatTime(results.timeTaken), icon: Clock, color: "text-amber-500", bg: "bg-amber-50" },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <div className="bg-surface rounded-2xl border border-border p-4 text-center">
              <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${s.bg} mb-2`}>
                <s.icon className={`h-5 w-5 ${s.color}`} />
              </div>
              <div className="font-sora text-2xl font-bold text-dark">{s.value}</div>
              <div className="text-xs text-muted">{s.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-surface rounded-2xl border border-border p-6 mb-6">
        <h2 className="font-sora font-bold text-dark mb-4">Performance by Subject</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#94A3B8" }} angle={-45} textAnchor="end" interval={0} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#94A3B8" }} />
            <Tooltip formatter={(v) => [`${v}%`, "Score"]} contentStyle={{ borderRadius: "12px", border: "1px solid #E2E8F0" }} />
            <Bar dataKey="score" fill="#1A56DB" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button variant="outline" className="flex-1" asChild>
          <Link href="/quiz?mode=mock"><RotateCcw className="h-4 w-4" /> Retake Exam</Link>
        </Button>
        <Button className="flex-1" asChild>
          <Link href="/dashboard">Go to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
