"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Clock, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const EXAM_DURATION = 3 * 60 * 60; // 3 hours in seconds

interface Props {
  questions: any[];
  session: any;
  onFinish: (results: any) => void;
}

export function MockExamMode({ questions, session, onFinish }: Props) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(EXAM_DURATION);
  const [started, setStarted] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!started) return;
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) { handleSubmit(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [started]);

  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleSubmit = () => {
    clearInterval(intervalRef.current);
    const correct = questions.filter((q) => {
      const selectedId = answers[q.id];
      const correctOption = q.options.find((o: any) => o.isCorrect);
      return selectedId === correctOption?.id;
    });

    const bySubject: Record<string, { correct: number; total: number }> = {};
    questions.forEach((q) => {
      const subj = q.topic?.subject?.name || "Unknown";
      if (!bySubject[subj]) bySubject[subj] = { correct: 0, total: 0 };
      bySubject[subj].total++;
      const selectedId = answers[q.id];
      const correctOption = q.options.find((o: any) => o.isCorrect);
      if (selectedId === correctOption?.id) bySubject[subj].correct++;
    });

    onFinish({
      score: correct.length,
      total: questions.length,
      timeTaken: EXAM_DURATION - timeLeft,
      bySubject,
      answers,
      questions,
    });
  };

  if (!started) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <div className="text-6xl mb-6">📋</div>
        <h1 className="font-sora text-3xl font-bold text-dark mb-3">Mock Exam</h1>
        <p className="text-muted mb-2">PSU Licensing Exam Simulation</p>
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-8 text-left">
          <h3 className="font-semibold text-amber-800 mb-3 flex items-center gap-2"><AlertTriangle className="h-4 w-4" /> Exam Instructions</h3>
          <ul className="text-sm text-amber-700 space-y-2">
            <li>• <strong>{questions.length} questions</strong> — 3-hour time limit</li>
            <li>• No feedback until you submit</li>
            <li>• You can navigate between questions freely</li>
            <li>• Unanswered questions count as wrong</li>
            <li>• Submit early or the timer will auto-submit</li>
          </ul>
        </div>
        <Button size="lg" onClick={() => setStarted(true)} className="w-full sm:w-auto">
          Start Exam
        </Button>
      </div>
    );
  }

  const question = questions[currentIndex];
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="sticky top-16 bg-background/95 backdrop-blur z-30 pb-4 pt-2">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <span className="text-sm font-semibold text-dark">{currentIndex + 1} / {questions.length}</span>
            <span className="text-xs text-muted ml-2">({answeredCount} answered)</span>
          </div>
          <div className={`flex items-center gap-2 font-sora font-bold text-lg ${timeLeft < 600 ? "text-red-600" : "text-dark"}`}>
            <Clock className="h-5 w-5" />
            {formatTime(timeLeft)}
          </div>
          <Button variant="destructive" size="sm" onClick={handleSubmit}>Submit Exam</Button>
        </div>
        <div className="w-full bg-border rounded-full h-1.5 mt-3">
          <div className="bg-primary-500 h-1.5 rounded-full transition-all" style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }} />
        </div>
      </div>

      {/* Question */}
      <div className="bg-surface rounded-2xl border border-border p-6 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <span className="font-sora font-bold text-muted">Q{currentIndex + 1}.</span>
          <Badge variant={question.difficulty === "EASY" ? "easy" : question.difficulty === "MEDIUM" ? "medium" : "hard"}>
            {question.difficulty}
          </Badge>
        </div>
        <p className="font-serif text-dark text-base leading-relaxed">{question.text}</p>
      </div>

      <div className="space-y-3 mb-6">
        {question.options.map((option: any, i: number) => (
          <button
            key={option.id}
            onClick={() => setAnswers((prev) => ({ ...prev, [question.id]: option.id }))}
            className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-150 min-h-[56px] ${
              answers[question.id] === option.id
                ? "border-primary-500 bg-primary-50"
                : "border-border hover:border-primary-300 hover:bg-primary-50/50 cursor-pointer"
            }`}
          >
            <div className="flex items-start gap-3">
              <span className="font-sora font-bold text-sm text-muted shrink-0">{String.fromCharCode(65 + i)}.</span>
              <span className="text-dark text-sm">{option.text}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Question grid navigation */}
      <div className="bg-surface rounded-2xl border border-border p-4 mb-6">
        <p className="text-xs font-semibold text-muted mb-3">Question Navigator</p>
        <div className="flex flex-wrap gap-1.5">
          {questions.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all ${
                i === currentIndex ? "bg-primary-500 text-white" :
                answers[questions[i].id] ? "bg-green-100 text-green-700" :
                "bg-background text-muted hover:bg-border"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))} disabled={currentIndex === 0}>← Prev</Button>
        {currentIndex < questions.length - 1 ? (
          <Button onClick={() => setCurrentIndex(currentIndex + 1)}>Next →</Button>
        ) : (
          <Button variant="success" onClick={handleSubmit}>Submit Exam</Button>
        )}
      </div>
    </div>
  );
}
