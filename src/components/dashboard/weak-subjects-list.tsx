"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowRight } from "lucide-react";

export function WeakSubjectsList({ subjects }: { subjects: any[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {subjects.map((subject) => (
        <div key={subject.id} className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-4 w-4 text-red-500 shrink-0" />
            <div>
              <div className="font-semibold text-dark text-sm">{subject.name}</div>
              <div className="text-xs text-red-600">{subject.score}% accuracy</div>
            </div>
          </div>
          <Button size="sm" variant="outline" asChild>
            <Link href={`/subjects/${subject.slug}`}>
              Practice <ArrowRight className="h-3 w-3" />
            </Link>
          </Button>
        </div>
      ))}
    </div>
  );
}
