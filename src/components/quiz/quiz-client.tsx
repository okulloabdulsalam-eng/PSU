"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PracticeMode } from "./practice-mode";
import { MockExamMode } from "./mock-exam-mode";
import { MockResults } from "./mock-results";

interface Props {
  questions: any[];
  mode: "practice" | "mock";
  session: any;
}

export function QuizClient({ questions, mode, session }: Props) {
  const [mockFinished, setMockFinished] = useState(false);
  const [mockResults, setMockResults] = useState<any>(null);

  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <div className="text-6xl mb-4">📭</div>
        <h2 className="font-sora text-2xl font-bold text-dark mb-2">No questions found</h2>
        <p className="text-muted">Try a different topic or upgrade to access premium questions.</p>
      </div>
    );
  }

  if (mode === "mock" && mockFinished && mockResults) {
    return <MockResults results={mockResults} totalQuestions={questions.length} />;
  }

  if (mode === "mock") {
    return <MockExamMode questions={questions} session={session} onFinish={(r) => { setMockResults(r); setMockFinished(true); }} />;
  }

  return <PracticeMode questions={questions} session={session} />;
}
