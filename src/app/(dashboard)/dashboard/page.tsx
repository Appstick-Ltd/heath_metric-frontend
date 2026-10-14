"use client";

import * as React from "react";
import Link from "next/link";
import {
  Users,
  Activity,
  HeartPulse,
  Pill,
  Gift,
  Database,
  Cloud,
  ArrowUpRight,
  ShieldCheck,
  PlusCircle,
  FileText,
  Radio,
  Sliders,
} from "lucide-react";
import { MetricCard } from "@/components/dashboard/metric-card";
import { UserGrowthChart } from "@/components/dashboard/user-growth-chart";
import { ClinicalStagingChart } from "@/components/dashboard/clinical-staging-chart";
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
  ActivityEvent,
} from "@/types/dashboard";

export default function DashboardPage() {
  const { user } = useAdminAuth();
  const [kpi, setKpi] = React.useState<KPISummary | null>(null);
  const [userGrowth, setUserGrowth] = React.useState<UserGrowthDataPoint[]>([]);
  const [activities, setActivities] = React.useState<ActivityEvent[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadData() {
      try {
        const data = await DataService.getDashboardData();
        setKpi(data.kpi);
        setUserGrowth(data.userGrowth);
        setActivities(data.recentActivities);
      } catch (err) {
        console.warn("Failed to load dashboard data from Supabase:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const adminDisplayName = user?.name || "Super Admin";
  const adminRole = user?.role || "Super Admin";

  if (loading || !kpi) {
    return (
      <div className="space-y-6 animate-pulse">
        {/* Top Header Loading Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-[8px] bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Activity className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <div className="h-6 w-52 bg-slate-200 dark:bg-slate-800 rounded-[8px]" />
              <div className="h-3 w-72 bg-slate-100 dark:bg-slate-800/60 rounded-[8px] mt-1.5" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-9 w-28 bg-slate-200 dark:bg-slate-800 rounded-[8px]" />
            <div className="h-9 w-28 bg-slate-100 dark:bg-slate-800 rounded-[8px]" />
          </div>
        </div>

        {/* 5 KPI Metric Skeletons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <MetricCardSkeleton key={i} />
          ))}
        </div>

        {/* Analytics Charts Skeletons */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7">
            <ChartSkeleton height="h-72" />
          </div>
          <div className="lg:col-span-5">
            <ChartSkeleton height="h-72" />
          </div>
        </div>

        {/* Bottom Activity Skeletons */}
        <ActivityFeedSkeleton count={5} />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Executive Welcome Hero Banner */}
      <div className="p-5 sm:p-6 rounded-[8px] bg-gradient-to-r from-white via-slate-50 to-sky-50/40 dark:from-[#0B1120] dark:via-[#0c1427] dark:to-[#071329] border border-slate-200/90 dark:border-white/10 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <UserAvatar
            photoUrl={user?.avatar}
            name={user?.name || "Admin"}
            size="lg"
            shape="rounded"
          />
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                Welcome back, {adminDisplayName}
              </h1>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-[6px] bg-[#006AFA]/10 text-[#006AFA] dark:text-sky-400 border border-[#006AFA]/20">
                {adminRole}
              </span>
              <span className="flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-[6px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Supabase v2
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
              Real-time patient population health telemetry, clinical staging &amp; encrypted Google Drive vault synchronization.
            </p>
          </div>
        </div>

        {/* Quick Executive Shortcuts */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <Link href="/users">
            <Button size="sm" className="h-9 px-3.5 rounded-[8px] text-xs font-bold gap-1.5 shadow-sm">
              <Users className="h-3.5 w-3.5" />
              Patient Directory
            </Button>
          </Link>
          <Link href="/master-data">
            <Button variant="outline" size="sm" className="h-9 px-3.5 rounded-[8px] text-xs font-bold gap-1.5">
              <Database className="h-3.5 w-3.5 text-[#006AFA]" />
              Master Data
            </Button>
          </Link>
          <Link href="/health-analytics">
            <Button variant="outline" size="sm" className="h-9 px-3.5 rounded-[8px] text-xs font-bold gap-1.5">
              <Activity className="h-3.5 w-3.5 text-emerald-500" />
              Health Analytics
            </Button>
          </Link>
        </div>
      </div>

      {/* 5 Clinical Metric Cards (Computed from actual Supabase rows) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard
          title="Total Patients"
          value={kpi.totalUsers.toLocaleString()}
          change={kpi.userGrowthPercent}
          changeText="in database"
          icon={Users}
          iconBgColor="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
        />
        <MetricCard
          title="Vitals Logged"
          value={kpi.vitalsLoggedToday.toLocaleString()}
          change={kpi.vitalsGrowthPercent}
          changeText="sugar &amp; BP entries"
          icon={Activity}
          iconBgColor="bg-teal-500/10 text-teal-600 dark:text-teal-400"
        />
        <MetricCard
          title="Critical Alerts"
          value={kpi.criticalAlerts.toLocaleString()}
          change={kpi.criticalAlertsChange}
          changeText="requiring review"
          icon={HeartPulse}
          iconBgColor="bg-rose-500/10 text-rose-600 dark:text-rose-400"
        />
        <MetricCard
          title="Master Medicines"
          value={kpi.activeMedications.toLocaleString()}
          change={kpi.medicationsChange}
          changeText="prescribed items"
          icon={Pill}
          iconBgColor="bg-sky-500/10 text-sky-600 dark:text-sky-400"
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

      {/* Interactive Charts Section: Growth vs Clinical Staging */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <UserGrowthChart data={userGrowth} />
        <ClinicalStagingChart />
      </div>

      {/* Live Activity Stream & Operational Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <ActivityFeed events={activities} />
        </div>

        {/* Quick Operations Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <Card className="p-5 rounded-[8px] border border-slate-200/90 dark:border-white/10 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#006AFA]" />
                System Health &amp; Sync
              </h3>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-[6px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                Operational
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-2.5 rounded-[6px] bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Supabase PostgreSQL</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">Connected (38ms)</span>
              </div>
              <div className="p-2.5 rounded-[6px] bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Google Drive API</span>
                <span className="font-bold text-slate-900 dark:text-white">v3 Medical Vault</span>
              </div>
              <div className="p-2.5 rounded-[6px] bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Google Mobile Ads</span>
                <span className="font-bold text-sky-600 dark:text-sky-400">AdMob Configured</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-white/5 space-y-2">
              <Link
                href="/master-data"
                className="w-full flex items-center justify-between px-3 py-2 rounded-[6px] bg-[#006AFA]/5 dark:bg-[#006AFA]/10 text-[#006AFA] dark:text-sky-400 hover:bg-[#006AFA]/10 transition-colors text-xs font-bold"
              >
                <span>Manage Food &amp; Medicine Library</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/settings"
                className="w-full flex items-center justify-between px-3 py-2 rounded-[6px] bg-slate-100/70 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-800 transition-colors text-xs font-semibold"
              >
                <span>AdMob Units &amp; App Controls</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
