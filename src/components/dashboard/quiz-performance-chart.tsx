"use client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface ChartData {
  day: string;
  total: number;
  correct: number;
}

export function QuizPerformanceChart({ data }: { data: ChartData[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
        <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#94A3B8", fontFamily: "DM Sans" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 12, fill: "#94A3B8", fontFamily: "DM Sans" }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{ borderRadius: "12px", border: "1px solid #E2E8F0", fontFamily: "DM Sans", fontSize: "12px" }}
          cursor={{ fill: "#F8FAFC" }}
        />
        <Legend wrapperStyle={{ fontSize: "12px", fontFamily: "DM Sans" }} />
        <Bar dataKey="total" name="Total" fill="#E2E8F0" radius={[4, 4, 0, 0]} />
        <Bar dataKey="correct" name="Correct" fill="#1A56DB" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
