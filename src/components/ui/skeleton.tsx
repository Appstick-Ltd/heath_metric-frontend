import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardContent } from "./card";

export type SkeletonProps = React.HTMLAttributes<HTMLDivElement>;

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-slate-200/80 dark:bg-slate-800/80",
        className
      )}
      {...props}
    />
  );
}

/**
 * Skeleton for Dashboard KPI / Metric Cards
 */
export function MetricCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-28 rounded-md" />
          <Skeleton className="h-10 w-10 rounded-xl" />
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <Skeleton className="h-8 w-24 rounded-lg" />
          <Skeleton className="h-4 w-14 rounded-md" />
        </div>
        <div className="mt-4 flex items-center gap-1.5">
          <Skeleton className="h-3 w-12 rounded-sm" />
          <Skeleton className="h-3 w-28 rounded-sm" />
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Skeleton for Data Tables (e.g. Users, Subscriptions, Referrals)
 */
export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="w-full">
      {/* Table Header Skeleton */}
      <div className="flex items-center justify-between py-3.5 px-4 bg-slate-50/75 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton
            key={i}
            className={cn("h-3.5 rounded-sm", i === 0 ? "w-32" : i === columns - 1 ? "w-16" : "w-24")}
          />
        ))}
      </div>

      {/* Table Rows Skeleton */}
      <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
        {Array.from({ length: rows }).map((_, rowIdx) => (
          <div key={rowIdx} className="flex items-center justify-between py-4 px-4">
            {/* Primary Column: Avatar + Title & Subtitle */}
            <div className="flex items-center gap-3">
              <Skeleton className="h-9 w-9 rounded-full shrink-0" />
              <div className="space-y-1.5">
                <Skeleton className="h-3.5 w-32 rounded-md" />
                <Skeleton className="h-2.5 w-24 rounded-sm" />
              </div>
            </div>

            {/* Middle Columns */}
            {Array.from({ length: columns - 2 }).map((_, colIdx) => (
              <div key={colIdx} className="hidden sm:block">
                <Skeleton className="h-4 w-20 rounded-md" />
              </div>
            ))}

            {/* End Column: Badge / Action */}
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Skeleton for Large Analytic / Revenue / Growth Charts
 */
export function ChartSkeleton({ height = "h-72" }: { height?: string }) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-5 pb-2 flex flex-row items-center justify-between">
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-36 rounded-md" />
          <Skeleton className="h-3 w-48 rounded-sm" />
        </div>
        <Skeleton className="h-8 w-24 rounded-lg" />
      </CardHeader>
      <CardContent className="p-5 pt-4">
        <div className={cn("w-full flex items-end justify-between gap-2 pt-6", height)}>
          {Array.from({ length: 12 }).map((_, i) => {
            const heights = ["h-1/3", "h-2/3", "h-1/2", "h-4/5", "h-3/5", "h-5/6", "h-2/5", "h-3/4", "h-1/2", "h-4/5", "h-3/5", "h-full"];
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <Skeleton className={cn("w-full rounded-t-md", heights[i % heights.length])} />
                <Skeleton className="h-2.5 w-6 rounded-sm" />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Skeleton for Recent Activity Feed
 */
export function ActivityFeedSkeleton({ count = 5 }: { count?: number }) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-5 pb-3">
        <Skeleton className="h-4 w-32 rounded-md" />
        <Skeleton className="h-3 w-44 rounded-sm mt-1" />
      </CardHeader>
      <CardContent className="p-5 pt-2 divide-y divide-slate-100 dark:divide-slate-800/60">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="py-3 flex items-start gap-3">
            <Skeleton className="h-8 w-8 rounded-full shrink-0 mt-0.5" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-3.5 w-full max-w-[200px] rounded-md" />
              <Skeleton className="h-2.5 w-24 rounded-sm" />
            </div>
            <Skeleton className="h-3 w-12 rounded-sm" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
