import * as React from "react";
import Link from "next/link";
import {
  AlertCircle,
  UserPlus,
  Pill,
  HeartPulse,
  Cloud,
  ArrowUpRight,
  ShieldAlert,
  Activity,
  CheckCircle2,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ActivityEvent } from "@/types/dashboard";
import { cn } from "@/lib/utils";

interface ActivityFeedProps {
  events: ActivityEvent[];
}

export function ActivityFeed({ events }: ActivityFeedProps) {
  const getIcon = (type: ActivityEvent["type"]) => {
    switch (type) {
      case "vital_alert":
        return <HeartPulse className="h-4 w-4 text-rose-500" />;
      case "medicine_warning":
        return <Pill className="h-4 w-4 text-amber-500" />;
      case "user_register":
        return <UserPlus className="h-4 w-4 text-sky-500" />;
      case "cloud_sync":
        return <Cloud className="h-4 w-4 text-[#006AFA]" />;
      default:
        return <Activity className="h-4 w-4 text-emerald-500" />;
    }
  };

  const getSeverityBadge = (severity: ActivityEvent["severity"]) => {
    switch (severity) {
      case "critical":
        return <Badge variant="danger" className="rounded-[6px] text-[10px] font-bold">Critical Alert</Badge>;
      case "warning":
        return <Badge variant="warning" className="rounded-[6px] text-[10px] font-bold">Action Needed</Badge>;
      default:
        return <Badge variant="success" className="rounded-[6px] text-[10px] font-bold">Normal</Badge>;
    }
  };

  return (
    <Card className="col-span-full rounded-[8px] border border-slate-200/90 dark:border-white/10 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
              Live Clinical &amp; System Activity Stream
            </CardTitle>
            <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-[6px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Telemetry
            </span>
          </div>
          <CardDescription className="text-xs text-slate-500 mt-0.5">
            Real-time biometric logs, critical vital spikes, and patient registrations from Supabase
          </CardDescription>
        </div>

        <Link
          href="/users"
          className="text-xs font-bold text-[#006AFA] dark:text-sky-400 hover:underline flex items-center gap-1"
        >
          View All Patients
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </CardHeader>
      <CardContent>
        <div className="divide-y divide-slate-100 dark:divide-white/5">
          {events.map((evt) => (
            <div
              key={evt.id}
              className="py-3 flex items-start justify-between gap-4 group hover:bg-slate-50/70 dark:hover:bg-white/[0.02] px-3 rounded-[8px] transition-colors"
            >
              <div className="flex items-start gap-3 min-w-0">
                <div
                  className={cn(
                    "p-2 rounded-[8px] mt-0.5 shrink-0 transition-transform group-hover:scale-105",
                    evt.severity === "critical"
                      ? "bg-rose-50 dark:bg-rose-950/40 text-rose-600 border border-rose-200 dark:border-rose-900/30"
                      : evt.severity === "warning"
                      ? "bg-amber-50 dark:bg-amber-950/40 text-amber-600 border border-amber-200 dark:border-amber-900/30"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/5"
                  )}
                >
                  {getIcon(evt.type)}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {evt.title}
                    </h4>
                    {getSeverityBadge(evt.severity)}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                    {evt.description}
                  </p>
                </div>
              </div>
              <span className="text-[11px] text-slate-400 shrink-0 mt-0.5 font-semibold">
                {evt.timestamp}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
