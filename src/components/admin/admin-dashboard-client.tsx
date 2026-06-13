"use client";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Crown, TrendingUp, DollarSign } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface Props {
  totalUsers: number;
  premiumUsers: number;
  monthlyRevenue: number;
  subjectStats: { name: string; score: number; total: number }[];
  recentPayments: any[];
}

export function AdminDashboardClient({ totalUsers, premiumUsers, monthlyRevenue, subjectStats, recentPayments }: Props) {
  return (
    <div className="space-y-6">
      <h1 className="font-sora text-3xl font-bold text-dark">Admin Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Students", value: totalUsers, icon: Users, color: "text-primary-500", bg: "bg-primary-50" },
          { label: "Premium Users", value: premiumUsers, icon: Crown, color: "text-premium", bg: "bg-purple-50" },
          { label: "Revenue This Month", value: formatCurrency(monthlyRevenue), icon: DollarSign, color: "text-green-500", bg: "bg-green-50" },
          { label: "Conversion Rate", value: `${totalUsers > 0 ? Math.round((premiumUsers / totalUsers) * 100) : 0}%`, icon: TrendingUp, color: "text-amber-500", bg: "bg-amber-50" },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card>
              <CardContent className="pt-5 pb-4">
                <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${s.bg} mb-3`}>
                  <s.icon className={`h-5 w-5 ${s.color}`} />
                </div>
                <div className="font-sora text-2xl font-bold text-dark">{s.value}</div>
                <div className="text-xs text-muted">{s.label}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle>Average Quiz Score by Subject</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={subjectStats} margin={{ top: 5, right: 10, left: -10, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#94A3B8" }} angle={-45} textAnchor="end" interval={0} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#94A3B8" }} />
              <Tooltip formatter={(v) => [`${v}%`, "Avg Score"]} contentStyle={{ borderRadius: "12px", border: "1px solid #E2E8F0" }} />
              <Bar dataKey="score" fill="#1A56DB" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Recent Payments</CardTitle></CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {recentPayments.map((p: any) => (
              <div key={p.id} className="flex items-center justify-between px-6 py-3">
                <div>
                  <p className="text-sm font-medium text-dark">{p.user?.name}</p>
                  <p className="text-xs text-muted">{p.user?.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-accent-green">{formatCurrency(p.amount)}</p>
                  <p className="text-xs text-muted">{p.months} month{p.months > 1 ? "s" : ""}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
