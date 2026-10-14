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
  changeText = "in database",
  icon: Icon,
  iconBgColor = "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
}: MetricCardProps) {
  const isPositive = change >= 0;

  return (
    <Card className="p-4 sm:p-5 rounded-[8px] border border-slate-200/90 dark:border-white/10 hover:border-[#006AFA]/50 dark:hover:border-sky-500/50 transition-all duration-200 shadow-xs bg-white/95 dark:bg-slate-900/90 hover:shadow-md group relative overflow-hidden">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          {title}
        </span>
        <div className={cn("p-2 rounded-[8px] transition-transform duration-200 group-hover:scale-105", iconBgColor)}>
          <Icon className="h-4 w-4" />
        </div>
      </div>

      <div className="mt-3">
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
          {value}
        </h2>

        <div className="mt-2 flex items-center gap-1.5 text-xs">
          <span
            className={cn(
              "inline-flex items-center font-bold px-1.5 py-0.5 rounded-[6px] text-[11px]",
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
          <span className="text-[11px] text-slate-400 font-medium truncate">{changeText}</span>
        </div>
      </div>
    </Card>
  );
}
