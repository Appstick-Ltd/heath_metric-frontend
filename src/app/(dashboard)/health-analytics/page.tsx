"use client";

import * as React from "react";
import {
  HeartPulse,
  Activity,
  FileSpreadsheet,
  RefreshCw,
  Inbox,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataService } from "@/lib/data-service";
import { VitalDistributionData } from "@/types/dashboard";

export default function HealthAnalyticsPage() {
  const [sugarData, setSugarData] = React.useState<VitalDistributionData[]>([]);
  const [bpData, setBpData] = React.useState<VitalDistributionData[]>([]);
  const [symptoms, setSymptoms] = React.useState<Array<{ region: string; count: number; avgVas: number }>>([]);
  const [loading, setLoading] = React.useState(true);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const data = await DataService.getHealthDistributionData();
      setSugarData(data.sugarDistribution);
      setBpData(data.bpDistribution);
      setSymptoms(data.symptomAggregates);
    } catch (e) {
      console.warn(e);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchAnalytics();
  }, []);

  const totalSugarLogged = sugarData.reduce((acc, curr) => acc + curr.count, 0);
  const totalBpLogged = bpData.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Population Health Analytics
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time glycemic, blood pressure & symptom distributions computed from database
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchAnalytics}>
          <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} />
          Refresh Data
        </Button>
      </div>

      {/* Top Clinical Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Blood Sugar Distribution */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="flex items-center gap-2">
                <HeartPulse className="h-4 w-4 text-rose-500" />
                Live Blood Sugar Distribution
              </CardTitle>
              <CardDescription>
                ADA fasting categories ({totalSugarLogged} entries in `blood_sugar_records`)
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-64 flex items-center justify-center text-xs text-slate-400">
                <div className="h-6 w-6 rounded-full border-2 border-emerald-600 border-t-transparent animate-spin mr-2" />
                Querying glucose records...
              </div>
            ) : totalSugarLogged === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-center p-4">
                <Inbox className="h-8 w-8 text-slate-300 mb-2" />
                <p className="text-xs text-slate-500">No blood sugar records logged in Supabase yet.</p>
              </div>
            ) : (
              <>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={sugarData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.15)" />
                      <XAxis dataKey="category" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(15, 23, 42, 0.9)",
                          borderColor: "rgba(51, 65, 85, 0.5)",
                          borderRadius: "0.75rem",
                          color: "#f8fafc",
                          fontSize: "12px",
                        }}
                      />
                      <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                        {sugarData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                  {sugarData.map((item, i) => (
                    <div key={i} className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                      <span className="text-[10px] text-slate-400 block truncate">{item.category}</span>
                      <strong className="text-slate-800 dark:text-slate-200 text-sm">{item.count}</strong>
                      <span className="text-[10px] text-emerald-600 block">{item.percentage}%</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Blood Pressure Distribution */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-sky-500" />
                Live Blood Pressure Categories
              </CardTitle>
              <CardDescription>
                AHA/ACC stages ({totalBpLogged} entries in `blood_pressure_records`)
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-64 flex items-center justify-center text-xs text-slate-400">
                <div className="h-6 w-6 rounded-full border-2 border-emerald-600 border-t-transparent animate-spin mr-2" />
                Querying BP records...
              </div>
            ) : totalBpLogged === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-center p-4">
                <Inbox className="h-8 w-8 text-slate-300 mb-2" />
                <p className="text-xs text-slate-500">No blood pressure records logged in Supabase yet.</p>
              </div>
            ) : (
              <>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={bpData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.15)" />
                      <XAxis dataKey="category" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(15, 23, 42, 0.9)",
                          borderColor: "rgba(51, 65, 85, 0.5)",
                          borderRadius: "0.75rem",
                          color: "#f8fafc",
                          fontSize: "12px",
                        }}
                      />
                      <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                        {bpData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                  {bpData.map((item, i) => (
                    <div key={i} className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                      <span className="text-[10px] text-slate-400 block truncate">{item.category}</span>
                      <strong className="text-slate-800 dark:text-slate-200 text-sm">{item.count}</strong>
                      <span className="text-[10px] text-sky-600 block">{item.percentage}%</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Symptom & Pain Heatmap Section */}
      <Card>
        <CardHeader className="py-4">
          <CardTitle>Reported Pain & Symptom Regions</CardTitle>
          <CardDescription>
            Live anatomical locations logged in Supabase `symptom_records` table
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="p-8 text-center text-xs text-slate-400">Loading symptoms...</div>
          ) : symptoms.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              No symptom or pain records logged in database yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {symptoms.map((item, i) => (
                <div key={i} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{item.region}</span>
                  <div className="mt-2 flex items-baseline justify-between">
                    <span className="text-2xl font-extrabold text-emerald-600">{item.count}</span>
                    <span className="text-xs text-slate-400">records</span>
                  </div>
                  <div className="mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-800 text-[11px] flex justify-between text-slate-500">
                    <span>Avg VAS:</span>
                    <strong className="text-amber-600">{item.avgVas} / 10</strong>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
