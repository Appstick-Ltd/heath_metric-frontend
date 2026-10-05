"use client";

import * as React from "react";
import {
  CreditCard,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Sparkles,
  Zap,
  Inbox,
  RefreshCw,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TableSkeleton } from "@/components/ui/skeleton";
import { LoadingSpinner } from "@/components/ui/loader";
import { DataService } from "@/lib/data-service";
import { Subscription } from "@/types/database";
import { formatDate } from "@/lib/utils";

export default function SubscriptionsPage() {
  const [subs, setSubs] = React.useState<Subscription[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [filterPlan, setFilterPlan] = React.useState("ALL");

  const fetchSubs = async () => {
    setLoading(true);
    try {
      const data = await DataService.getSubscriptions();
      setSubs(data);
    } catch (e) {
      console.warn(e);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchSubs();
  }, []);

  const filteredSubs = subs.filter(
    (s) => filterPlan === "ALL" || s.plan_type.toLowerCase() === filterPlan.toLowerCase()
  );

  // Live calculations from Supabase rows
  let calculatedMrr = 0;
  let activePaidCount = 0;
  subs.forEach((s) => {
    if (s.status === "active") {
      const parsedPrice = s.price_paid ? parseFloat(s.price_paid.replace(/[^0-9.]/g, "")) : 0;
      if (s.plan_type === "monthly") {
        calculatedMrr += parsedPrice > 0 ? parsedPrice : 4.99;
        activePaidCount++;
      } else if (s.plan_type === "annual") {
        calculatedMrr += (parsedPrice > 0 ? parsedPrice : 39.99) / 12;
        activePaidCount++;
      }
    }
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Subscription & Revenue Operations
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time in-app purchases querying Supabase <code className="text-emerald-600">subscriptions</code> table
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchSubs}>
          <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Revenue Metrics Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <span className="text-xs font-semibold text-slate-400 uppercase">Live Monthly Recurring (MRR)</span>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            ${calculatedMrr.toFixed(2)}
          </p>
          <span className="text-xs text-slate-400 mt-1 inline-block">Calculated from active DB plans</span>
        </Card>
        <Card className="p-4">
          <span className="text-xs font-semibold text-slate-400 uppercase">Annualized Run Rate (ARR)</span>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            ${(calculatedMrr * 12).toFixed(2)}
          </p>
          <span className="text-xs text-slate-400 mt-1 inline-block">12-month projection</span>
        </Card>
        <Card className="p-4">
          <span className="text-xs font-semibold text-slate-400 uppercase">Active Paid Subscribers</span>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {activePaidCount}
          </p>
          <span className="text-xs text-slate-400 mt-1 inline-block">Pro (Monthly & Annual)</span>
        </Card>
        <Card className="p-4">
          <span className="text-xs font-semibold text-slate-400 uppercase">Total Subscriptions</span>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {subs.length}
          </p>
          <span className="text-xs text-slate-400 mt-1 inline-block">Including free tier</span>
        </Card>
      </div>

      {/* Pricing Tier Matrix */}
      <div>
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-3">
          Configured Subscription Tiers
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              name: "Free Tier",
              price: "$0.00",
              period: "Forever",
              features: [
                "1 Family Member Profile",
                "Standard Vitals Logging",
                "Basic Food Search & Meals",
              ],
              badge: "Default",
            },
            {
              name: "Pro Monthly",
              price: "$4.99",
              period: "/ month",
              features: [
                "Up to 5 Family Profiles",
                "Unlimited Health Analytics",
                "Smart Reminders & Alerts",
              ],
              badge: "Active",
            },
            {
              name: "Pro Annual",
              price: "$39.99",
              period: "/ year ($3.33/mo)",
              features: [
                "Up to 5 Family Profiles",
                "Unlimited PDF & CSV Reports",
                "Priority Cloud Sync & 24/7 Support",
              ],
              badge: "Best Value",
              highlight: true,
            },
          ].map((plan, i) => (
            <Card
              key={i}
              className={`p-5 flex flex-col justify-between ${
                plan.highlight
                  ? "border-emerald-500/80 shadow-md shadow-emerald-500/10 dark:bg-slate-900"
                  : ""
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">{plan.name}</h4>
                  <Badge variant={plan.highlight ? "success" : "default"}>{plan.badge}</Badge>
                </div>
                <div className="mt-2">
                  <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
                    {plan.price}
                  </span>
                  <span className="text-xs text-slate-400 ml-1">{plan.period}</span>
                </div>
                <ul className="mt-4 space-y-2 text-xs text-slate-600 dark:text-slate-300">
                  {plan.features.map((f, fi) => (
                    <li key={fi} className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Subscription Records Table */}
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between py-4">
          <div>
            <CardTitle>Subscription Database Records</CardTitle>
            <CardDescription>
              Direct sync with Supabase `subscriptions` table
            </CardDescription>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            {["ALL", "free", "monthly", "annual"].map((t) => (
              <button
                key={t}
                onClick={() => setFilterPlan(t)}
                className={`px-3 py-1 rounded-xl uppercase font-semibold text-[11px] transition-all ${
                  filterPlan === t
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </CardHeader>
        {loading ? (
          <div>
            <div className="flex items-center gap-2 px-4 py-3 bg-emerald-50/70 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 text-xs font-medium border-b border-emerald-100 dark:border-emerald-900/30">
              <LoadingSpinner size="xs" variant="primary" />
              <span>Querying active subscription tiers & transaction ledger...</span>
            </div>
            <TableSkeleton rows={5} columns={5} />
          </div>
        ) : filteredSubs.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center gap-2">
            <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400">
              <Inbox className="h-8 w-8" />
            </div>
            <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-200">
              No Subscriptions Found
            </h3>
            <p className="text-xs text-slate-500 max-w-sm">
              {filterPlan === "ALL"
                ? "No user accounts or subscriptions logged yet."
                : `No accounts currently found under the ${filterPlan.toUpperCase()} tier.`}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/75 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold uppercase">
                <tr>
                  <th className="py-3 px-4">Patient / Account</th>
                  <th className="py-3 px-4">Plan Tier</th>
                  <th className="py-3 px-4">Price Paid</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Activated On</th>
                  <th className="py-3 px-4">Expires / Renews</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredSubs.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="py-3 px-4">
                      <p className="font-semibold text-slate-900 dark:text-slate-100">
                        {sub.user_name || "Patient User"}
                      </p>
                      <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                        {sub.user_email || "No email"}
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                        ID: {sub.user_id}
                      </p>
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={sub.plan_type === "free" ? "outline" : "success"}
                        className="capitalize font-semibold"
                      >
                        {sub.plan_type === "free" ? "Free Tier" : `Pro ${sub.plan_type}`}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 font-bold text-emerald-600 dark:text-emerald-400">
                      {sub.price_paid || "$0.00"}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={sub.status === "active" ? "success" : "default"}>
                        {sub.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      {formatDate(sub.start_date)}
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      {sub.expiry_date
                        ? formatDate(sub.expiry_date)
                        : sub.plan_type === "free"
                        ? "Forever (Free)"
                        : "Auto-renews"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
