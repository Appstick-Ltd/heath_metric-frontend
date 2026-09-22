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

interface RevenueChartProps {
  data: RevenueDataPoint[];
}

export function RevenueChart({ data }: RevenueChartProps) {
  return (
    <Card className="col-span-full lg:col-span-5">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div>
          <CardTitle>Revenue by Subscription Tier</CardTitle>
          <CardDescription>
            Gross monthly recurring income breakdown ($)
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.15)" />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(15, 23, 42, 0.9)",
                  borderColor: "rgba(51, 65, 85, 0.5)",
                  borderRadius: "0.75rem",
                  color: "#f8fafc",
                  fontSize: "12px",
                }}
                formatter={(val) => [`$${val}`, ""]}
              />
              <Bar dataKey="monthlyRevenue" fill="#10b981" radius={[4, 4, 0, 0]} name="Monthly Plan" stackId="a" />
              <Bar dataKey="annualRevenue" fill="#0ea5e9" radius={[4, 4, 0, 0]} name="Annual Plan" stackId="a" />
              <Bar dataKey="lifetimeRevenue" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Lifetime Pass" stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
