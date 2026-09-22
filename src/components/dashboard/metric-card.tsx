import * as React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  change: number;
  changeText?: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBgColor?: string;
}

export function MetricCard({
  title,
  value,
  change,
  changeText = "vs last month",
  icon: Icon,
  iconBgColor = "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
}: MetricCardProps) {
  const isPositive = change >= 0;

  return (
    <Card className="p-5 hover:border-slate-300 dark:hover:border-slate-700 transition-all">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          {title}
        </span>
        <div className={cn("p-2 rounded-xl", iconBgColor)}>
          <Icon className="h-4 w-4" />
        </div>
      </div>

      <div className="mt-3">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          {value}
        </h2>

        <div className="mt-2 flex items-center gap-1.5 text-xs">
          <span
            className={cn(
              "inline-flex items-center font-semibold px-1.5 py-0.5 rounded-md",
              isPositive
                ? "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50"
                : "text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50"
            )}
          >
            {isPositive ? (
              <TrendingUp className="h-3 w-3 mr-1" />
            ) : (
              <TrendingDown className="h-3 w-3 mr-1" />
            )}
            {Math.abs(change)}%
          </span>
          <span className="text-slate-400">{changeText}</span>
        </div>
      </div>
    </Card>
  );
}
