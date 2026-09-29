"use client";

import * as React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { RevenueDataPoint } from "@/types/dashboard";
import { useIsDark } from "@/lib/use-theme";

interface RevenueChartProps {
  data: RevenueDataPoint[];
}

function makeTooltip(isDark: boolean) {
  // eslint-disable-next-line react/display-name
  return function RevenueTooltip(props: any) {
    const { active, payload, label } = props;
    if (!active || !payload || !payload.length) return null;
    return (
      <div className={`rounded-xl border px-4 py-3 text-xs shadow-xl ${isDark ? "bg-slate-900 border-slate-700 text-slate-100" : "bg-white border-slate-200 text-slate-800"}`}>
        <p className="font-semibold mb-2 text-[11px] uppercase tracking-wider text-slate-400">{label}</p>
        {payload.map((p: any, i: number) => (
          <div key={i} className="flex items-center gap-2 mt-1">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: p.color }} />
            <span className={isDark ? "text-slate-300" : "text-slate-600"}>{p.name}:</span>
            <span className="font-bold">${p.value}</span>
          </div>
        ))}
      </div>
    );
  };
}

export function RevenueChart({ data }: RevenueChartProps) {
  const isDark = useIsDark();
  const axisColor = isDark ? "#64748b" : "#94a3b8";
  const gridColor = isDark ? "rgba(100,116,139,0.12)" : "rgba(148,163,184,0.18)";

  return (
    <Card className="col-span-full lg:col-span-5">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div>
          <CardTitle>Revenue by Subscription Tier</CardTitle>
          <CardDescription>
            Gross monthly recurring income breakdown ($)
          </CardDescription>
        </div>
        <div className="flex flex-col gap-1 text-[11px]">
          {[
            { label: "Monthly", color: "#10b981" },
            { label: "Annual", color: "#0ea5e9" },
          ].map((l) => (
            <div key={l.label} className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-sm shrink-0" style={{ backgroundColor: l.color }} />
              <span className="text-slate-500 dark:text-slate-400">{l.label}</span>
            </div>
          ))}
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
              <XAxis
                dataKey="month"
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
                cursor={{ fill: isDark ? "rgba(100,116,139,0.08)" : "rgba(148,163,184,0.08)" }}
              />
              <Bar dataKey="monthlyRevenue" fill="#10b981" radius={[4, 4, 0, 0]} name="Monthly Plan" stackId="a" />
              <Bar dataKey="annualRevenue" fill="#0ea5e9" radius={[4, 4, 0, 0]} name="Annual Plan" stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
