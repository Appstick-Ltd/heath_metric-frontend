"use client";

import * as React from "react";
import Link from "next/link";
import {
  Users,
  CreditCard,
  DollarSign,
  Activity,
  Gift,
  PlusCircle,
  FileDown,
  Sparkles,
  Database,
  Inbox,
} from "lucide-react";
import { MetricCard } from "@/components/dashboard/metric-card";
import { UserGrowthChart } from "@/components/dashboard/user-growth-chart";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DataService } from "@/lib/data-service";
import { getAvatarUrl } from "@/lib/utils";
import {
  KPISummary,
  UserGrowthDataPoint,
  RevenueDataPoint,
  ActivityEvent,
} from "@/types/dashboard";
import { Profile } from "@/types/database";

export default function DashboardPage() {
  const [profile, setProfile] = React.useState<Profile | null>(null);
  const [imgError, setImgError] = React.useState(false);
  const [kpi, setKpi] = React.useState<KPISummary | null>(null);
  const [userGrowth, setUserGrowth] = React.useState<UserGrowthDataPoint[]>([]);
  const [revenue, setRevenue] = React.useState<RevenueDataPoint[]>([]);
  const [activities, setActivities] = React.useState<ActivityEvent[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadData() {
      try {
        const [data, prof] = await Promise.all([
          DataService.getDashboardData(),
          DataService.getCurrentProfile(),
        ]);
        setKpi(data.kpi);
        setUserGrowth(data.userGrowth);
        setRevenue(data.revenue);
        setActivities(data.recentActivities);
        if (prof) setProfile(prof);
      } catch (err) {
        console.warn("Failed to load dashboard data from Supabase:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading || !kpi) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 rounded-full border-2 border-emerald-600 border-t-transparent animate-spin" />
          <p className="text-xs text-slate-400 font-medium">Connecting to Supabase PostgreSQL database...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Welcome & Actions Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          {(() => {
            const avatarSrc = getAvatarUrl(profile?.photo_url || profile?.avatar_url);
            if (avatarSrc && !imgError) {
              return (
                <div className="relative h-12 w-12 rounded-full p-[2.5px] bg-gradient-to-tr from-teal-500 to-sky-500 shadow-md shrink-0">
                  <img
                    src={avatarSrc}
                    alt={profile?.name || "User"}
                    referrerPolicy="no-referrer"
                    crossOrigin="anonymous"
                    onError={() => setImgError(true)}
                    className="h-full w-full rounded-full object-cover bg-white dark:bg-slate-800"
                  />
                </div>
              );
            }
            return null;
          })()}
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {profile?.name ? `Welcome back, ${profile.name.split(' ')[0]}` : "Operations & Clinical Dashboard"}
              </h1>
              <span className="flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
                <Database className="h-3 w-3" /> Supabase Live
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Real-time population health metrics and subscriptions directly from database
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/cms-foods">
            <Button size="sm">
              <PlusCircle className="h-4 w-4 mr-1.5" />
              Add Food Item
            </Button>
          </Link>
          <Link href="/medicines">
            <Button variant="outline" size="sm">
              <PlusCircle className="h-4 w-4 mr-1.5" />
              Add Medicine
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
