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
import { useIsDark } from "@/lib/use-theme";

interface UserGrowthChartProps {
  data: UserGrowthDataPoint[];
}

function makeTooltip(isDark: boolean) {
  // eslint-disable-next-line react/display-name
  return function CustomTooltip(props: any) {
    const { active, payload, label } = props;
    if (!active || !payload || !payload.length) return null;
    return (
      <div className={`rounded-xl border px-4 py-3 text-xs shadow-xl ${
        isDark ? "bg-slate-900 border-slate-700 text-slate-100" : "bg-white border-slate-200 text-slate-800"
      }`}>
        <p className="font-semibold mb-2 text-[11px] uppercase tracking-wider text-slate-400">{label}</p>
        {payload.map((p: any, i: number) => (
          <div key={i} className="flex items-center gap-2 mt-1">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: p.color }} />
            <span className={isDark ? "text-slate-300" : "text-slate-600"}>{p.name}:</span>
            <span className="font-bold">{p.value}</span>
          </div>
        ))}
      </div>
    );
  };
}

export function UserGrowthChart({ data }: UserGrowthChartProps) {
  const isDark = useIsDark();

  const axisColor = isDark ? "#64748b" : "#94a3b8";
  const gridColor = isDark ? "rgba(100,116,139,0.12)" : "rgba(148,163,184,0.18)";

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
                  <stop offset="5%" stopColor="#10b981" stopOpacity={isDark ? 0.25 : 0.2} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorVitals" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={isDark ? 0.25 : 0.2} />
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
              <XAxis
                dataKey="date"
                stroke={axisColor}
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tick={{ fill: axisColor }}
              />
              <YAxis
                stroke={axisColor}
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tick={{ fill: axisColor }}
              />
              <Tooltip
                content={makeTooltip(isDark) as any}
                cursor={{ stroke: isDark ? "rgba(100,116,139,0.3)" : "rgba(148,163,184,0.3)", strokeWidth: 1 }}
              />
              <Area
                type="monotone"
                dataKey="totalUsers"
                stroke="#10b981"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorUsers)"
                name="Total Users"
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0 }}
              />
              <Area
                type="monotone"
                dataKey="vitalsLogged"
                stroke="#0ea5e9"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorVitals)"
                name="Vitals Logged"
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
