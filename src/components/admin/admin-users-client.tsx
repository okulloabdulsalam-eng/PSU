"use client";
import { useState } from "react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Crown, Search, ChevronDown } from "lucide-react";
import { toast } from "sonner";

export function AdminUsersClient({ users: initial }: { users: any[] }) {
  const [users, setUsers] = useState(initial);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState<string | null>(null);

  const filtered = users.filter((u) =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const changePlan = async (userId: string, plan: "PREMIUM" | "FREE") => {
    setLoading(userId);
    const res = await fetch("/api/admin/users/plan", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, plan }),
    });
    setLoading(null);
    if (res.ok) {
      setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, plan } : u));
      toast.success(`Plan updated to ${plan}`);
    } else toast.error("Failed to update plan");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="font-sora text-3xl font-bold text-dark">Users ({users.length})</h1>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
          <Input className="pl-10" placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="bg-surface rounded-2xl border border-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-background">
            <tr>
              {["Name", "Email", "Plan", "Joined", "Questions", "Actions"].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((user) => (
              <tr key={user.id} className="hover:bg-background/50 transition-colors">
                <td className="px-4 py-3 text-sm font-medium text-dark">{user.name || "—"}</td>
                <td className="px-4 py-3 text-sm text-muted truncate max-w-[180px]">{user.email}</td>
                <td className="px-4 py-3">
                  <Badge variant={user.plan === "PREMIUM" ? "premium" : "secondary"}>
                    {user.plan === "PREMIUM" && <Crown className="h-2.5 w-2.5" />} {user.plan}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-sm text-muted">{format(new Date(user.createdAt), "MMM d, yyyy")}</td>
                <td className="px-4 py-3 text-sm text-dark">{user._count.quizAttempts}</td>
                <td className="px-4 py-3">
                  {user.plan === "FREE" ? (
                    <Button size="sm" variant="premium" onClick={() => changePlan(user.id, "PREMIUM")} disabled={loading === user.id}>
                      <Crown className="h-3 w-3" /> Upgrade
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" onClick={() => changePlan(user.id, "FREE")} disabled={loading === user.id}>
                      Downgrade
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted text-sm">No users found</div>
        )}
      </div>
    </div>
  );
}
