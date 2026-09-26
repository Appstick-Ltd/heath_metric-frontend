"use client";

import * as React from "react";
import Link from "next/link";
import {
  Users,
  CreditCard,
  DollarSign,
  Activity,
  Gift,
  Database,
  Inbox,
  ShieldCheck,
} from "lucide-react";
import { MetricCard } from "@/components/dashboard/metric-card";
import { UserGrowthChart } from "@/components/dashboard/user-growth-chart";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  MetricCardSkeleton,
  ChartSkeleton,
  ActivityFeedSkeleton,
} from "@/components/ui/skeleton";
import { DataService } from "@/lib/data-service";
import { useAdminAuth } from "@/lib/auth-context";
import { UserAvatar } from "@/components/ui/user-avatar";
import {
  KPISummary,
  UserGrowthDataPoint,
  RevenueDataPoint,
  ActivityEvent,
} from "@/types/dashboard";

export default function DashboardPage() {
  const { user } = useAdminAuth();
  const [kpi, setKpi] = React.useState<KPISummary | null>(null);
  const [userGrowth, setUserGrowth] = React.useState<UserGrowthDataPoint[]>([]);
  const [revenue, setRevenue] = React.useState<RevenueDataPoint[]>([]);
  const [activities, setActivities] = React.useState<ActivityEvent[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadData() {
      try {
        const data = await DataService.getDashboardData();
        setKpi(data.kpi);
        setUserGrowth(data.userGrowth);
        setRevenue(data.revenue);
        setActivities(data.recentActivities);
      } catch (err) {
        console.warn("Failed to load dashboard data from Supabase:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const adminFirstName = user?.name ? user.name.split(" ")[0] : "Admin";
  const adminRole = user?.role || "Super Admin";

  if (loading || !kpi) {
    return (
      <div className="space-y-6 animate-pulse">
        {/* Top Header Loading Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Activity className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <div className="h-6 w-52 bg-slate-200 dark:bg-slate-800 rounded-md" />
              <div className="h-3 w-72 bg-slate-100 dark:bg-slate-800/60 rounded-md mt-1.5" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-9 w-28 bg-slate-200 dark:bg-slate-800 rounded-xl" />
            <div className="h-9 w-28 bg-slate-100 dark:bg-slate-800 rounded-xl" />
          </div>
        </div>

        {/* 5 KPI Metric Skeletons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <MetricCardSkeleton key={i} />
          ))}
        </div>

        {/* Analytics Charts Skeletons */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartSkeleton height="h-72" />
          <ChartSkeleton height="h-72" />
        </div>

        {/* Bottom Activity Skeletons */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ActivityFeedSkeleton count={5} />
          </div>
          <Card className="p-6 space-y-4">
            <div className="h-5 w-32 bg-slate-200 dark:bg-slate-800 rounded-md" />
            <div className="h-3 w-48 bg-slate-100 dark:bg-slate-800/60 rounded-md" />
            <div className="space-y-2 pt-2">
              <div className="h-10 w-full bg-slate-100 dark:bg-slate-800/80 rounded-xl" />
              <div className="h-10 w-full bg-slate-100 dark:bg-slate-800/80 rounded-xl" />
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Welcome & Actions Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <UserAvatar
            photoUrl={user?.avatar}
            name={user?.name || "Admin"}
            size="lg"
            shape="rounded"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Welcome back, {adminFirstName}
              </h1>
              <span className="text-[11px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
                {adminRole}
              </span>
              <span className="hidden sm:flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                <Database className="h-3 w-3 text-emerald-500" /> Supabase Live
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Real-time patient population health metrics, subscriptions & activity from database
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/users">
            <Button size="sm">
              <Users className="h-4 w-4 mr-1.5" />
              Patient Directory
            </Button>
          </Link>
          <Link href="/health-analytics">
            <Button variant="outline" size="sm">
              <Activity className="h-4 w-4 mr-1.5" />
              Health Analytics
            </Button>
          </Link>
        </div>
      </div>

      {/* 5 KPI Metric Cards (Computed from actual Supabase rows) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard
          title="Total Users"
          value={kpi.totalUsers.toLocaleString()}
          change={kpi.userGrowthPercent}
          changeText="in database"
          icon={Users}
          iconBgColor="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
        />
        <MetricCard
          title="Pro Subscribers"
          value={kpi.activeProUsers.toLocaleString()}
          change={kpi.proGrowthPercent}
          changeText="active paid"
          icon={CreditCard}
          iconBgColor="bg-sky-500/10 text-sky-600 dark:text-sky-400"
        />
        <MetricCard
          title="Monthly Recurring"
          value={`$${kpi.mrr.toLocaleString()}`}
          change={kpi.mrrGrowthPercent}
          changeText="calculated MRR"
          icon={DollarSign}
          iconBgColor="bg-purple-500/10 text-purple-600 dark:text-purple-400"
        />
        <MetricCard
          title="Vitals Logged"
          value={kpi.vitalsLoggedToday.toLocaleString()}
          change={kpi.vitalsGrowthPercent}
          changeText="sugar & BP entries"
          icon={Activity}
          iconBgColor="bg-teal-500/10 text-teal-600 dark:text-teal-400"
        />
        <MetricCard
          title="Referral Conv."
          value={`${kpi.referralConversionRate}%`}
          change={kpi.referralGrowthPercent}
          changeText="rewarded rate"
          icon={Gift}
          iconBgColor="bg-amber-500/10 text-amber-600 dark:text-amber-400"
        />
      </div>

      {/* Interactive Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <UserGrowthChart data={userGrowth} />
        <RevenueChart data={revenue} />
      </div>

      {/* Live Activity Stream or Clean Empty State */}
      {activities.length > 0 ? (
        <ActivityFeed events={activities} />
      ) : (
        <Card className="p-8 text-center border-dashed">
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400">
              <Inbox className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-200">
              No Critical Activity Events Logged Yet
            </h3>
            <p className="text-xs text-slate-500 max-w-sm">
              As mobile app users record blood sugar, blood pressure, or upgrade plans, new clinical events will be displayed here in real time.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
