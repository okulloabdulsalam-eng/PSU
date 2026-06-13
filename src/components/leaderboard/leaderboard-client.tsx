"use client";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { Crown, Trophy, Medal } from "lucide-react";

interface Props { users: any[]; currentUserId: string; }

const RANK_ICONS: Record<number, any> = {
  0: { icon: Trophy, color: "text-yellow-500", bg: "bg-yellow-50" },
  1: { icon: Medal, color: "text-gray-400", bg: "bg-gray-50" },
  2: { icon: Medal, color: "text-amber-600", bg: "bg-amber-50" },
};

export function LeaderboardClient({ users, currentUserId }: Props) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-yellow-50 text-yellow-700 px-4 py-2 rounded-full text-sm font-semibold mb-4 border border-yellow-200">
          <Crown className="h-4 w-4" /> Premium Feature
        </div>
        <h1 className="font-sora text-3xl font-bold text-dark">Weekly Leaderboard</h1>
        <p className="text-muted mt-2">Top 10 students by correct answers this week</p>
      </div>

      <div className="space-y-3">
        {users.map((user, i) => {
          const isMe = user.id === currentUserId;
          const rankInfo = RANK_ICONS[i];

          return (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className={`bg-surface rounded-2xl border-2 p-4 flex items-center gap-4 ${isMe ? "border-primary-400 bg-primary-50" : "border-border"}`}
            >
              <div className="w-10 text-center">
                {rankInfo ? (
                  <div className={`inline-flex items-center justify-center w-9 h-9 rounded-xl ${rankInfo.bg}`}>
                    <rankInfo.icon className={`h-5 w-5 ${rankInfo.color}`} />
                  </div>
                ) : (
                  <span className="font-sora font-bold text-lg text-muted">#{i + 1}</span>
                )}
              </div>

              <Avatar className="h-10 w-10 shrink-0">
                <AvatarImage src={user.image} />
                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-sora font-semibold text-dark text-sm truncate">{user.name || "Anonymous"}</p>
                  {isMe && <span className="text-xs bg-primary-100 text-primary-600 px-2 py-0.5 rounded-full font-semibold">You</span>}
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="font-sora font-bold text-xl text-dark">{user.correctThisWeek}</div>
                <div className="text-xs text-muted">correct this week</div>
              </div>
            </motion.div>
          );
        })}

        {users.length === 0 && (
          <div className="text-center py-16 text-muted">
            No activity recorded this week. Start answering questions to appear here!
          </div>
        )}
      </div>
    </div>
  );
}
