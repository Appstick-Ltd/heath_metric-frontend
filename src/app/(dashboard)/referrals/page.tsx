"use client";

import * as React from "react";
import {
  Gift,
  ShieldAlert,
  Inbox,
  RefreshCw,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TableSkeleton } from "@/components/ui/skeleton";
import { LoadingSpinner } from "@/components/ui/loader";
import { DataService } from "@/lib/data-service";
import { Referral } from "@/types/database";
import { formatDate } from "@/lib/utils";

export default function ReferralsPage() {
  const [referrals, setReferrals] = React.useState<Referral[]>([]);
  const [loading, setLoading] = React.useState(true);

  const fetchReferrals = async () => {
    setLoading(true);
    try {
      const data = await DataService.getReferrals();
      setReferrals(data);
    } catch (e) {
      console.warn(e);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchReferrals();
  }, []);

  const handleApproveReward = async (refId: string) => {
    const ok = await DataService.updateReferralStatus(refId, "rewarded");
    if (ok) {
      setReferrals((prev) =>
        prev.map((r) => (r.id === refId ? { ...r, status: "rewarded" } : r))
      );
      alert(`Reward for referral ${refId} has been successfully updated in Supabase!`);
    } else {
      alert("Failed to update status in Supabase.");
    }
  };

  const rewardedCount = referrals.filter((r) => r.status === "rewarded").length;
  const pendingCount = referrals.filter((r) => r.status === "pending" && r.referee_id).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Referral Program & Growth
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time invitation records querying Supabase <code className="text-emerald-600">referrals</code> table
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchReferrals}>
          <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <span className="text-xs font-semibold text-slate-400 uppercase">Total Referral Codes</span>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{referrals.length}</p>
          <span className="text-xs text-slate-400 mt-1 inline-block">Created in database</span>
        </Card>
        <Card className="p-4">
          <span className="text-xs font-semibold text-slate-400 uppercase">Rewarded Signups</span>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{rewardedCount}</p>
          <span className="text-xs text-slate-400 mt-1 inline-block">Completed conversions</span>
        </Card>
        <Card className="p-4">
          <span className="text-xs font-semibold text-slate-400 uppercase">Pending Approvals</span>
          <p className="text-2xl font-bold text-amber-600 mt-1">{pendingCount}</p>
          <span className="text-xs text-slate-400 mt-1 inline-block">Awaiting reward action</span>
        </Card>
        <Card className="p-4">
          <span className="text-xs font-semibold text-slate-400 uppercase">Conversion Rate</span>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {referrals.length > 0 ? ((rewardedCount / referrals.length) * 100).toFixed(1) : 0}%
          </p>
          <span className="text-xs text-slate-400 mt-1 inline-block">Database ratio</span>
        </Card>
      </div>

      {/* Referrals Table */}
      <Card className="overflow-hidden">
        <CardHeader className="py-4">
          <CardTitle>Referral Invitation Records</CardTitle>
          <CardDescription>
            Live synchronization with Supabase `referrals` table
          </CardDescription>
        </CardHeader>
        {loading ? (
          <div>
            <div className="flex items-center gap-2 px-4 py-3 bg-emerald-50/70 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 text-xs font-medium border-b border-emerald-100 dark:border-emerald-900/30">
              <LoadingSpinner size="xs" variant="primary" />
              <span>Fetching referral codes and conversion metrics from database...</span>
            </div>
            <TableSkeleton rows={4} columns={5} />
          </div>
        ) : referrals.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center gap-2">
            <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400">
              <Inbox className="h-8 w-8" />
            </div>
            <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-200">
              No Referral Codes Generated Yet
            </h3>
            <p className="text-xs text-slate-500 max-w-sm">
              Your Supabase `referrals` table has 0 rows. As users generate codes in the mobile app, they will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/75 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold uppercase">
                <tr>
                  <th className="py-3 px-4">Referral Code</th>
                  <th className="py-3 px-4">Referrer User</th>
                  <th className="py-3 px-4">Invited Referee</th>
                  <th className="py-3 px-4">Reward Status</th>
                  <th className="py-3 px-4">Date Created</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {referrals.map((ref) => (
                  <tr key={ref.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="py-3 px-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {ref.referral_code}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-700 dark:text-slate-300">
                      {ref.referrer_id}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500">
                      {ref.referee_id || <span className="italic text-slate-400">Unused / Link only</span>}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={ref.status === "rewarded" ? "success" : "warning"}>
                        {ref.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      {formatDate(ref.created_at)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {ref.status === "pending" && ref.referee_id ? (
                        <Button
                          size="sm"
                          onClick={() => handleApproveReward(ref.id)}
                        >
                          Approve 1-Mo Pro
                        </Button>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-medium">Completed</span>
                      )}
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
