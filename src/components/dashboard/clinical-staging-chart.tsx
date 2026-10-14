"use client";

import * as React from "react";
import {
  Activity,
  HeartPulse,
  Droplets,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  ShieldAlert,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function ClinicalStagingChart() {
  const [activeTab, setActiveTab] = React.useState<"glucose" | "bp">("glucose");

  const glucoseData = [
    { label: "Optimal / Normal (<5.6 mmol/L)", count: 8, percentage: 67, color: "bg-emerald-500", text: "text-emerald-600 dark:text-emerald-400", badge: "Safe" },
    { label: "Pre-Diabetes (5.6 – 6.9 mmol/L)", count: 3, percentage: 25, color: "bg-amber-500", text: "text-amber-600 dark:text-amber-400", badge: "Moderate Risk" },
    { label: "Diabetes / Critical (≥7.0 mmol/L)", count: 1, percentage: 8, color: "bg-rose-500", text: "text-rose-600 dark:text-rose-400", badge: "Requires Attention" },
  ];

  const bpData = [
    { label: "Normal (<120 / <80 mmHg)", count: 7, percentage: 58, color: "bg-sky-500", text: "text-sky-600 dark:text-sky-400", badge: "Optimal" },
    { label: "Elevated / Pre-HTN (120-139 / 80-89)", count: 4, percentage: 33, color: "bg-amber-500", text: "text-amber-600 dark:text-amber-400", badge: "Borderline" },
    { label: "Stage 2 Hypertension (≥140 / ≥90)", count: 1, percentage: 9, color: "bg-rose-500", text: "text-rose-600 dark:text-rose-400", badge: "Alert Active" },
  ];

  const currentDataset = activeTab === "glucose" ? glucoseData : bpData;

  return (
    <Card className="col-span-full lg:col-span-5 border border-slate-200/90 dark:border-white/10 rounded-[8px] shadow-sm">
      <CardHeader className="flex flex-row items-start justify-between pb-3">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
              Clinical Health Staging
            </CardTitle>
            <Badge variant="success" className="rounded-[6px] text-[10px] font-bold">
              ADA &amp; AHA Criteria
            </Badge>
          </div>
          <CardDescription className="text-xs text-slate-500 mt-1">
            Population vitals risk distribution across recorded entries
          </CardDescription>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-[8px]">
          <button
            onClick={() => setActiveTab("glucose")}
            className={`px-2.5 py-1 text-xs font-bold rounded-[6px] transition-all flex items-center gap-1.5 ${
              activeTab === "glucose"
                ? "bg-white dark:bg-slate-900 text-[#006AFA] dark:text-sky-400 shadow-xs"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Droplets className="w-3.5 h-3.5" />
            Glucose
          </button>
          <button
            onClick={() => setActiveTab("bp")}
            className={`px-2.5 py-1 text-xs font-bold rounded-[6px] transition-all flex items-center gap-1.5 ${
              activeTab === "bp"
                ? "bg-white dark:bg-slate-900 text-[#006AFA] dark:text-sky-400 shadow-xs"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <HeartPulse className="w-3.5 h-3.5" />
            BP
          </button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-1">
        {/* Visual Multi-Segment Bar */}
        <div className="w-full h-3 rounded-[6px] overflow-hidden flex bg-slate-100 dark:bg-slate-800">
          {currentDataset.map((item, idx) => (
            <div
              key={idx}
              className={`${item.color} transition-all duration-500`}
              style={{ width: `${item.percentage}%` }}
              title={`${item.label}: ${item.percentage}%`}
            />
          ))}
        </div>

        {/* Breakdown Items */}
        <div className="space-y-3 pt-1">
          {currentDataset.map((item, idx) => (
            <div
              key={idx}
              className="p-3 rounded-[8px] bg-slate-50/70 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 flex items-center justify-between gap-3 hover:border-slate-300 dark:hover:border-white/15 transition-all"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className={`w-2.5 h-2.5 rounded-full ${item.color} shrink-0`} />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                    {item.label}
                  </p>
                  <span className={`text-[10px] font-semibold ${item.text}`}>
                    {item.badge}
                  </span>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-xs font-black text-slate-900 dark:text-white block">
                  {item.percentage}%
                </span>
                <span className="text-[10px] text-slate-400">
                  {item.count} logs
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Clinical Assessment Box */}
        <div className="p-3 rounded-[8px] bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-500/20 flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <p className="text-[11px] text-emerald-900 dark:text-emerald-300 font-medium leading-tight">
            <strong>91.7% Population Compliance:</strong> The vast majority of recorded telemetry remains within managed or optimal ranges.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
