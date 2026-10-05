"use client";

import * as React from "react";
import {
  CreditCard,
  CheckCircle2,
  Inbox,
  RefreshCw,
  Search,
  X,
  Download,
  ChevronLeft,
  ChevronRight,
  Receipt,
  Copy,
  Check,
  ShieldCheck,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { TableSkeleton } from "@/components/ui/skeleton";
import { LoadingSpinner } from "@/components/ui/loader";
import { DataService } from "@/lib/data-service";
import { Subscription, PaymentTransaction } from "@/types/database";
import { formatDate } from "@/lib/utils";

export default function SubscriptionsPage() {
  const [subs, setSubs] = React.useState<Subscription[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [filterPlan, setFilterPlan] = React.useState("ALL");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedSub, setSelectedSub] = React.useState<Subscription | null>(null);
  const [paymentHistory, setPaymentHistory] = React.useState<PaymentTransaction[]>([]);
  const [loadingHistory, setLoadingHistory] = React.useState(false);
  const [copiedTxn, setCopiedTxn] = React.useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);

  const openHistoryModal = async (sub: Subscription) => {
    setSelectedSub(sub);
    setLoadingHistory(true);
    try {
      const history = await DataService.getPaymentHistory(sub.user_id);
      setPaymentHistory(history);
    } catch (e) {
      console.warn("Failed to fetch payment history:", e);
      setPaymentHistory([]);
    } finally {
      setLoadingHistory(false);
    }
  };

  const fetchSubs = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await DataService.getSubscriptions();
      setSubs(data);
    } catch (e) {
      console.warn(e);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const data = await DataService.getSubscriptions();
        if (!ignore) {
          setSubs(data);
        }
      } catch (e) {
        console.warn(e);
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, []);

  // Reset pagination on filter or search changes without cascading effects
  const [prevFilter, setPrevFilter] = React.useState({ searchQuery, filterPlan });
  if (prevFilter.searchQuery !== searchQuery || prevFilter.filterPlan !== filterPlan) {
    setPrevFilter({ searchQuery, filterPlan });
    setCurrentPage(1);
  }

  const filteredSubs = subs.filter((s) => {
    const matchesPlan =
      filterPlan === "ALL" || s.plan_type.toLowerCase() === filterPlan.toLowerCase();

    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      (s.user_name && s.user_name.toLowerCase().includes(q)) ||
      (s.user_email && s.user_email.toLowerCase().includes(q)) ||
      s.user_id.toLowerCase().includes(q);

    return matchesPlan && matchesSearch;
  });

  const totalPages = Math.ceil(filteredSubs.length / pageSize) || 1;
  const paginatedSubs = filteredSubs.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const exportToCSV = () => {
    if (filteredSubs.length === 0) {
      alert("No subscription records found to export.");
      return;
    }

    const headers = [
      "User ID",
      "Account Name",
      "Email",
      "Plan Tier",
      "Price Paid",
      "Status",
      "Activated On",
      "Expires / Renews",
    ];

    const rows = filteredSubs.map((s) => [
      `"${s.user_id}"`,
      `"${(s.user_name || "User").replace(/"/g, '""')}"`,
      `"${(s.user_email || "").replace(/"/g, '""')}"`,
      `"${s.plan_type === 'free' ? 'Free Tier' : `Pro ${s.plan_type}`}"`,
      `"${s.price_paid || '$0.00'}"`,
      `"${s.status || 'active'}"`,
      `"${s.start_date ? new Date(s.start_date).toISOString().split("T")[0] : ""}"`,
      `"${s.expiry_date ? new Date(s.expiry_date).toISOString().split("T")[0] : (s.plan_type === 'free' ? 'Forever' : 'Auto-renews')}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `subscriptions_report_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={exportToCSV} title="Export subscriptions to CSV">
            <Download className="h-3.5 w-3.5 mr-1.5 text-emerald-600" />
            Export CSV
          </Button>
          <Button variant="outline" size="sm" onClick={fetchSubs}>
            <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
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
        <CardHeader className="py-4 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
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
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <Input
              placeholder="Search by name, email, or user ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-8 text-xs h-9"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Clear search"
                type="button"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
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
          <>
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
                    <th className="py-3 px-4 text-right">Payment Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {paginatedSubs.map((sub) => (
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
                      <td className="py-3 px-4 text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openHistoryModal(sub)}
                          className="h-7 text-[11px] px-2.5 font-medium hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-700 dark:hover:text-emerald-400 hover:border-emerald-300 transition-colors"
                          title="View Full Payment History, Ledger & Receipt"
                        >
                          <Receipt className="h-3 w-3 mr-1 text-emerald-600" />
                          History & Receipt
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {filteredSubs.length > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <span>
                    Showing{" "}
                    <strong className="text-slate-800 dark:text-slate-200">
                      {filteredSubs.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}
                    </strong>{" "}
                    to{" "}
                    <strong className="text-slate-800 dark:text-slate-200">
                      {Math.min(currentPage * pageSize, filteredSubs.length)}
                    </strong>{" "}
                    of{" "}
                    <strong className="text-slate-800 dark:text-slate-200">
                      {filteredSubs.length}
                    </strong>{" "}
                    subscriptions
                  </span>
                  <span className="text-slate-300 dark:text-slate-700">|</span>
                  <div className="flex items-center gap-1.5">
                    <span>Rows:</span>
                    <select
                      value={pageSize}
                      onChange={(e) => {
                        setPageSize(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                      className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage <= 1}
                    className="h-8 px-2.5 text-xs"
                  >
                    <ChevronLeft className="h-3.5 w-3.5 mr-1" />
                    Previous
                  </Button>

                  <div className="flex items-center gap-1 px-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                      .map((p, idx, arr) => {
                        const prev = arr[idx - 1];
                        const hasGap = prev && p - prev > 1;
                        return (
                          <React.Fragment key={p}>
                            {hasGap && <span className="px-1 text-slate-400">...</span>}
                            <button
                              onClick={() => setCurrentPage(p)}
                              className={`h-8 min-w-8 px-2 rounded-lg text-xs font-medium transition-all ${
                                currentPage === p
                                  ? "bg-emerald-600 text-white shadow-xs"
                                  : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
                              }`}
                            >
                              {p}
                            </button>
                          </React.Fragment>
                        );
                      })}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage >= totalPages}
                    className="h-8 px-2.5 text-xs"
                  >
                    Next
                    <ChevronRight className="h-3.5 w-3.5 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </Card>

      {/* Payment History & Billing Ledger Modal */}
      {selectedSub && (
        <Modal
          isOpen={!!selectedSub}
          onClose={() => {
            setSelectedSub(null);
            setPaymentHistory([]);
          }}
          title={
            selectedSub.plan_type === "free"
              ? "Free Tier Account Overview"
              : `Payment History & Billing Ledger: ${selectedSub.user_name || "Patient"}`
          }
          description={`Customer UID: ${selectedSub.user_id} • Primary Email: ${selectedSub.user_email || "No email logged"}`}
          maxWidth="2xl"
        >
          <div className="space-y-5 text-xs">
            {/* Top Summary KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10">
                <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 uppercase">
                  Lifetime Value (Total Spent)
                </span>
                <p className="text-xl font-extrabold text-emerald-800 dark:text-emerald-200 mt-1">
                  ${paymentHistory.reduce((acc, t) => acc + (parseFloat(t.amount.replace(/[^0-9.]/g, "")) || 0), 0).toFixed(2)}
                </p>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5 inline-block">
                  All recorded transactions
                </span>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                <span className="text-[11px] font-semibold text-slate-500 uppercase">
                  Active Subscription Tier
                </span>
                <p className="text-xl font-bold text-slate-900 dark:text-white capitalize mt-1">
                  {selectedSub.plan_type === "free" ? "Free Tier" : `Pro ${selectedSub.plan_type}`}
                </p>
                <Badge variant={selectedSub.status === "active" ? "success" : "default"} className="mt-1 text-[10px] capitalize">
                  {selectedSub.status}
                </Badge>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                <span className="text-[11px] font-semibold text-slate-500 uppercase">
                  Total Payments
                </span>
                <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                  {paymentHistory.length}
                </p>
                <span className="text-[10px] text-slate-400 mt-0.5 inline-block">
                  Successful invoice logs
                </span>
              </div>
            </div>

            {/* Complete Payment Transactions Ledger Table */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <Receipt className="h-4 w-4 text-emerald-600" />
                  All Payment Transactions & Invoice History
                </h4>
                <span className="text-[11px] text-slate-400">
                  {paymentHistory.length} record(s) found
                </span>
              </div>

              {loadingHistory ? (
                <div className="p-8 text-center flex flex-col items-center justify-center gap-2 border border-slate-200 dark:border-slate-800 rounded-xl">
                  <LoadingSpinner size="sm" variant="primary" />
                  <p className="text-slate-500">Querying payment ledger & historical invoices...</p>
                </div>
              ) : paymentHistory.length === 0 ? (
                <div className="p-6 text-center border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-800/30">
                  <p className="font-semibold text-slate-700 dark:text-slate-300">
                    No Paid Transactions Logged
                  </p>
                  <p className="text-slate-500 text-[11px] mt-1 max-w-sm mx-auto">
                    This account is currently allocated on the Free Tier ($0.00). Any future in-app purchases or renewals will appear here automatically.
                  </p>
                </div>
              ) : (
                <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-500 font-semibold uppercase text-[10px]">
                      <tr>
                        <th className="py-2.5 px-3">Date</th>
                        <th className="py-2.5 px-3">Plan / Item</th>
                        <th className="py-2.5 px-3">Amount</th>
                        <th className="py-2.5 px-3">Payment Method</th>
                        <th className="py-2.5 px-3">Transaction / Order Ref</th>
                        <th className="py-2.5 px-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {paymentHistory.map((tx) => (
                        <tr key={tx.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                          <td className="py-2.5 px-3 whitespace-nowrap text-slate-600 dark:text-slate-300">
                            {formatDate(tx.created_at)}
                          </td>
                          <td className="py-2.5 px-3 whitespace-nowrap">
                            <Badge variant="success" className="capitalize text-[10px]">
                              Pro {tx.plan_type}
                            </Badge>
                          </td>
                          <td className="py-2.5 px-3 whitespace-nowrap font-bold text-emerald-600 dark:text-emerald-400">
                            {tx.amount}
                          </td>
                          <td className="py-2.5 px-3 whitespace-nowrap text-slate-600 dark:text-slate-400 flex items-center gap-1 mt-1">
                            <CreditCard className="h-3 w-3 text-slate-400" />
                            {tx.payment_method || "Google Play Store"}
                          </td>
                          <td className="py-2.5 px-3 whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              <code className="font-mono text-[10px] text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                                {tx.transaction_id || `GPA.${tx.id.slice(0, 12)}`}
                              </code>
                              <button
                                onClick={() => {
                                  const text = tx.transaction_id || `GPA.${tx.id.slice(0, 12)}`;
                                  navigator.clipboard.writeText(text);
                                  setCopiedTxn(true);
                                  setTimeout(() => setCopiedTxn(false), 2000);
                                }}
                                className="p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                title="Copy Order ID"
                                type="button"
                              >
                                {copiedTxn ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                              </button>
                            </div>
                          </td>
                          <td className="py-2.5 px-3 whitespace-nowrap text-right">
                            <Badge variant="success" className="text-[10px] capitalize">
                              {tx.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Current Active Subscription Entitlement Card */}
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 space-y-2">
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                Active Entitlement & Next Billing
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-500">
                <div>
                  <span>Activated On:</span>
                  <p className="font-medium text-slate-700 dark:text-slate-300 mt-0.5">
                    {formatDate(selectedSub.start_date)}
                  </p>
                </div>
                <div>
                  <span>Next Renewal:</span>
                  <p className="font-medium text-slate-700 dark:text-slate-300 mt-0.5">
                    {selectedSub.expiry_date
                      ? formatDate(selectedSub.expiry_date)
                      : selectedSub.plan_type === "free"
                      ? "Lifetime (Free)"
                      : "Auto-renews"}
                  </p>
                </div>
                <div>
                  <span>Billing Rate:</span>
                  <p className="font-medium text-slate-700 dark:text-slate-300 mt-0.5">
                    {selectedSub.price_paid || (selectedSub.plan_type === "free" ? "$0.00" : "$39.99")}
                  </p>
                </div>
                <div>
                  <span>Security Status:</span>
                  <p className="font-medium text-emerald-600 flex items-center gap-1 mt-0.5">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Verified In-App
                  </p>
                </div>
              </div>
            </div>

            {/* Close Button */}
            <div className="pt-1">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setSelectedSub(null);
                  setPaymentHistory([]);
                }}
              >
                Close Ledger
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
