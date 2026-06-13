"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { ArrowRight } from "lucide-react";

export function SubjectProgressCard({ subject }: { subject: any }) {
  const progressPct = subject.totalTopics > 0
    ? Math.round((subject.completed / subject.totalTopics) * 100)
    : 0;

  return (
    <motion.div whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(0,0,0,0.10)" }} transition={{ duration: 0.2 }}>
      <Link href={`/subjects/${subject.slug}`}>
        <div className="bg-surface rounded-2xl border border-border p-4 hover:border-primary-200 transition-all duration-200">
          <div className="h-1 rounded-full mb-4 -mt-4 -mx-4 rounded-t-2xl" style={{ backgroundColor: subject.color }} />
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">{subject.icon}</span>
            {subject.score !== null && (
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                subject.score >= 80 ? "bg-green-100 text-green-700" :
                subject.score >= 60 ? "bg-amber-100 text-amber-700" :
                "bg-red-100 text-red-700"
              }`}>
                {subject.score}%
              </span>
            )}
          </div>
          <h3 className="font-sora font-semibold text-dark text-sm mb-1 leading-tight">{subject.name}</h3>
          <p className="text-xs text-muted mb-3">{subject.completed}/{subject.totalTopics} topics</p>
          <Progress value={progressPct} className="h-1.5" />
        </div>
      </Link>
    </motion.div>
  );
}
