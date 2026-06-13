"use client";
import { useState, useEffect, useCallback } from "react";
import { Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";

const PAGE_SIZE = 20;

interface Props {
  subjects: any[];
  totalCount: number;
  isPremium: boolean;
}

export function QuestionBankClient({ subjects, totalCount, isPremium }: Props) {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(totalCount);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    subjectId: "", topicId: "", difficulty: "", year: "", hasImage: "",
  });

  const selectedSubject = subjects.find((s) => s.id === filters.subjectId);
  const topics = selectedSubject?.topics ?? [];

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({
      page: String(page),
      pageSize: String(PAGE_SIZE),
      search,
      ...Object.fromEntries(Object.entries(filters).filter(([, v]) => v)),
    });
    const res = await fetch(`/api/questions?${params}`);
    const data = await res.json();
    setQuestions(data.questions);
    setTotal(data.total);
    setLoading(false);
  }, [page, search, filters]);

  useEffect(() => { fetchQuestions(); }, [fetchQuestions]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-sora text-3xl font-bold text-dark">Question Bank</h1>
        <p className="text-muted text-sm mt-1">{total.toLocaleString()} questions available</p>
      </div>

      {/* Filters */}
      <div className="bg-surface rounded-2xl border border-border p-4 mb-6 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
          <Input
            placeholder="Search questions..."
            className="pl-10"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <Select value={filters.subjectId} onValueChange={(v) => setFilters((f) => ({ ...f, subjectId: v, topicId: "" }))}>
            <SelectTrigger><SelectValue placeholder="Subject" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
              {subjects.map((s) => <SelectItem key={s.id} value={s.id}>{s.icon} {s.name}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select value={filters.topicId} onValueChange={(v) => setFilters((f) => ({ ...f, topicId: v }))}>
            <SelectTrigger><SelectValue placeholder="Topic" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Topics</SelectItem>
              {topics.map((t: any) => <SelectItem key={t.id} value={t.id}>{t.title}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select value={filters.difficulty} onValueChange={(v) => setFilters((f) => ({ ...f, difficulty: v }))}>
            <SelectTrigger><SelectValue placeholder="Difficulty" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="EASY">Easy</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="HARD">Hard</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.year} onValueChange={(v) => setFilters((f) => ({ ...f, year: v }))}>
            <SelectTrigger><SelectValue placeholder="Year" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Years</SelectItem>
              {[2024, 2023, 2022, 2021, 2020].map((y) => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select value={filters.hasImage} onValueChange={(v) => setFilters((f) => ({ ...f, hasImage: v }))}>
            <SelectTrigger><SelectValue placeholder="Images" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="true">Has Image</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Questions */}
      {loading ? (
        <div className="text-center py-16 text-muted">Loading questions...</div>
      ) : questions.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-3">🔍</div>
          <p className="text-muted">No questions match your filters.</p>
        </div>
      ) : (
        <div className="space-y-3 mb-6">
          {questions.map((q, i) => (
            <div key={q.id} className="bg-surface rounded-2xl border border-border p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <Badge variant={q.difficulty === "EASY" ? "easy" : q.difficulty === "MEDIUM" ? "medium" : "hard"}>
                      {q.difficulty}
                    </Badge>
                    {q.topic?.subject && <Badge variant="secondary">{q.topic.subject.name}</Badge>}
                    {q.pastExamYear && <Badge variant="outline">{q.pastExamYear}</Badge>}
                  </div>
                  <p className="text-sm text-dark leading-relaxed line-clamp-2">{q.text}</p>
                </div>
                <Button size="sm" variant="outline" asChild>
                  <Link href={`/quiz?questionId=${q.id}&mode=practice`}>Practice</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted">Page {page} of {totalPages}</span>
          <Button variant="outline" size="sm" onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
