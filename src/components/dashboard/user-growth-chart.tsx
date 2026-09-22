"use client";

import * as React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { UserGrowthDataPoint } from "@/types/dashboard";

interface UserGrowthChartProps {
  data: UserGrowthDataPoint[];
}

export function UserGrowthChart({ data }: UserGrowthChartProps) {
  return (
    <Card className="col-span-full lg:col-span-7">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div>
          <CardTitle>User Growth & Vital Engagement</CardTitle>
          <CardDescription>
            Total registered users vs. daily vitals logged across the platform
          </CardDescription>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <span className="text-slate-600 dark:text-slate-300">Registered</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-sky-500" />
            <span className="text-slate-600 dark:text-slate-300">Vitals Logged</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorVitals" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.15)" />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(15, 23, 42, 0.9)",
                  borderColor: "rgba(51, 65, 85, 0.5)",
                  borderRadius: "0.75rem",
                  color: "#f8fafc",
                  fontSize: "12px",
                }}
              />
              <Area
                type="monotone"
                dataKey="totalUsers"
                stroke="#10b981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorUsers)"
                name="Total Users"
              />
              <Area
                type="monotone"
                dataKey="vitalsLogged"
                stroke="#0ea5e9"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorVitals)"
                name="Vitals Logged"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
