"use client";
import Link from "next/link";
import { Lock, Crown, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface Props {
  note: any;
  isPremium: boolean;
}

export function NoteViewer({ note, isPremium }: Props) {
  const isLocked = note.isPremium && !isPremium;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="font-sora text-xl font-bold text-dark">{note.title}</h2>
          <div className="flex items-center gap-2">
            {note.isPremium && <Badge variant="premium"><Lock className="h-3 w-3" /> Premium</Badge>}
            {!note.isPremium && <Badge variant="free">Free</Badge>}
            {isPremium && (
              <Button size="sm" variant="outline" className="text-xs">
                <Download className="h-3 w-3" /> PDF
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLocked ? (
          <div className="relative">
            <div
              className="note-content premium-blur select-none pointer-events-none"
              dangerouslySetInnerHTML={{ __html: note.content.substring(0, 800) + "..." }}
            />
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-transparent via-white/70 to-white rounded-b-2xl">
              <div className="text-center p-6">
                <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Lock className="h-6 w-6 text-premium" />
                </div>
                <h3 className="font-sora font-bold text-dark mb-2">Premium Content</h3>
                <p className="text-muted text-sm mb-4">Upgrade to access this note and 1,800+ more premium notes</p>
                <Button variant="premium" asChild>
                  <Link href="/pricing">
                    <Crown className="h-4 w-4" /> Unlock Premium
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="note-content" dangerouslySetInnerHTML={{ __html: note.content }} />
        )}
      </CardContent>
    </Card>
  );
}
