"use client";

import * as React from "react";
import {
  Gift,
  Inbox,
  RefreshCw,
  Search,
  Users,
  Coins,
  CheckCircle2,
  Clock,
  Copy,
  Check,
  Sparkles,
  UserCheck,
  AlertCircle,
  Trash2,
  Crown,
  ChevronDown,
  ChevronUp,
  UserPlus,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Filter,
  X,
  ExternalLink,
  Flame,
  Award
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { TableSkeleton } from "@/components/ui/skeleton";
import { LoadingSpinner } from "@/components/ui/loader";
import { UserAvatar } from "@/components/ui/user-avatar";
import { DataService } from "@/lib/data-service";
import { Referral, Profile } from "@/types/database";
import { formatDate, formatDateTime } from "@/lib/utils";

type MainViewType = "users_summary" | "all_logs";
type MilestoneFilter = "all" | "vip_reached" | "active" | "no_claims";
type SortOption = "most_friends" | "newest" | "oldest" | "name_asc";

interface ClaimedFriend {
  id: string;
  referee_id: string;
  name: string;
  email: string;
  photo_url?: string | null;
  claimed_at: string;
  status: "pending" | "rewarded";
}

interface UserReferralGroup {
  referral_code: string;
  referrer_id: string;
  referrer_name: string;
  referrer_email: string;
  referrer_photo_url?: string | null;
  created_at: string;
  friends: ClaimedFriend[];
  total_friends: number;
  coins_earned: number;
  is_pro_eligible: boolean;
}

export default function ReferralsPage() {
  const [referrals, setReferrals] = React.useState<Referral[]>([]);
  const [profiles, setProfiles] = React.useState<Profile[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [mainView, setMainView] = React.useState<MainViewType>("users_summary");
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = React.useState("");
  const [milestoneFilter, setMilestoneFilter] = React.useState<MilestoneFilter>("all");
  const [sortBy, setSortBy] = React.useState<SortOption>("most_friends");
  const [copiedCode, setCopiedCode] = React.useState<string | null>(null);

  // Pagination state for User Groups view
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);

  // Pagination state for All Logs view
  const [logsCurrentPage, setLogsCurrentPage] = React.useState(1);
  const [logsPageSize, setLogsPageSize] = React.useState(15);
  const [rawLogsStatusFilter, setRawLogsStatusFilter] = React.useState<"all" | "active_codes" | "claimed_friends">("all");

  // Accordion for expanded user cards in users_summary view
  const [expandedUsers, setExpandedUsers] = React.useState<Set<string>>(new Set());

  // Grant Pro Modal State
  const [isGrantOpen, setIsGrantOpen] = React.useState(false);
  const [targetReferral, setTargetReferral] = React.useState<Referral | null>(null);
  const [isGranting, setIsGranting] = React.useState(false);

  // In-Page User Inspection Modal State (No Redirection)
  const [isUserModalOpen, setIsUserModalOpen] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<{
    id: string;
    name: string;
    email: string;
    photo_url?: string | null;
    gender?: string;
    blood_group?: string;
    created_at?: string;
  } | null>(null);

  // Delete Modal State
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
  const [deleteRef, setDeleteRef] = React.useState<Referral | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  // Notification Toast State
  const [notification, setNotification] = React.useState<{ text: string; type: "success" | "error" } | null>(null);

  const showNotification = (text: string, type: "success" | "error" = "success") => {
    setNotification({ text, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const fetchReferrals = async () => {
    setLoading(true);
    try {
      const [data, profs] = await Promise.all([
        DataService.getReferrals(),
        DataService.getProfiles(),
      ]);
      setReferrals(data);
      setProfiles(profs);
    } catch (e) {
      console.warn("Failed to fetch referrals:", e);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchReferrals();
  }, []);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Toggle accordion expand/collapse for single user
  const toggleUserExpanded = (code: string) => {
    setExpandedUsers((prev) => {
      const next = new Set(prev);
      if (next.has(code)) {
        next.delete(code);
      } else {
        next.add(code);
      }
      return next;
    });
  };

  // Open In-Page User Modal (No Page Redirection)
  const openUserModal = (userId: string, fallbackName?: string, fallbackEmail?: string) => {
    const prof = profiles.find((p) => p.id === userId);
    setSelectedUser({
      id: userId,
      name: prof?.name || fallbackName || "User",
      email: prof?.email || fallbackEmail || "",
      photo_url: prof?.photo_url,
      gender: prof?.gender,
      blood_group: prof?.blood_group,
      created_at: prof?.created_at,
    });
    setIsUserModalOpen(true);
  };

  // Toggle status between rewarded and pending
  const handleToggleStatus = async (ref: Referral) => {
    const newStatus = ref.status === "rewarded" ? "pending" : "rewarded";
    const ok = await DataService.updateReferralStatus(ref.id, newStatus);
    if (ok) {
      setReferrals((prev) =>
        prev.map((r) => (r.id === ref.id ? { ...r, status: newStatus } : r))
      );
      showNotification(`Status updated to ${newStatus.toUpperCase()}`);
    } else {
      showNotification("Failed to update status in Supabase.", "error");
    }
  };

  // Handle Grant 30-Day Pro Subscription
  const handleGrantPro = async () => {
    if (!targetReferral) return;
    setIsGranting(true);

    const targetUserId = targetReferral.referee_id || targetReferral.referrer_id;
    const targetName = targetReferral.referee_name || targetReferral.referrer_name || "User";

    const res = await DataService.grantProSubscription(
      targetUserId,
      30,
      `Referral Reward (${targetReferral.referral_code})`
    );

    if (res.success) {
      await DataService.updateReferralStatus(targetReferral.id, "rewarded");
      setReferrals((prev) =>
        prev.map((r) => (r.id === targetReferral.id ? { ...r, status: "rewarded" } : r))
      );
      setIsGranting(false);
      setIsGrantOpen(false);
      showNotification(`🎉 30-Day VIP Pro subscription successfully activated for ${targetName}!`);
    } else {
      setIsGranting(false);
      showNotification(res.error || "Failed to grant Pro subscription.", "error");
    }
  };

  // Handle Delete Referral
  const handleDeleteReferral = async () => {
    if (!deleteRef) return;
    setIsDeleting(true);
    const ok = await DataService.deleteReferral(deleteRef.id);
    setIsDeleting(false);

    if (ok) {
      setReferrals((prev) => prev.filter((r) => r.id !== deleteRef.id));
      setIsDeleteOpen(false);
      setDeleteRef(null);
      showNotification(`Referral record has been removed.`);
    } else {
      showNotification("Failed to delete referral record.", "error");
    }
  };

  // Group referrals by User & Code to see who invited whom & how many claimed
  const userReferralGroups: UserReferralGroup[] = React.useMemo(() => {
    const map = new Map<string, UserReferralGroup>();

    // Fast profile map for quick photo/data lookup
    const profileMap = new Map<string, Profile>();
    for (const p of profiles) {
      profileMap.set(p.id, p);
    }

    for (const r of referrals) {
      const code = r.referral_code;
      if (!map.has(code)) {
        const referrerProfile = profileMap.get(r.referrer_id);
        map.set(code, {
          referral_code: code,
          referrer_id: r.referrer_id,
          referrer_name: r.referrer_name || referrerProfile?.name || "Referrer User",
          referrer_email: r.referrer_email || referrerProfile?.email || "",
          referrer_photo_url: referrerProfile?.photo_url,
          created_at: r.created_at,
          friends: [],
          total_friends: 0,
          coins_earned: 0,
          is_pro_eligible: false,
        });
      }

      if (r.referee_id) {
        const refereeProfile = profileMap.get(r.referee_id);
        map.get(code)!.friends.push({
          id: r.id,
          referee_id: r.referee_id,
          name: r.referee_name || refereeProfile?.name || "Friend User",
          email: r.referee_email || refereeProfile?.email || "",
          photo_url: refereeProfile?.photo_url,
          claimed_at: r.created_at,
          status: r.status,
        });
      }
    }

    return Array.from(map.values()).map((g) => ({
      ...g,
      total_friends: g.friends.length,
      coins_earned: g.friends.length * 100,
      is_pro_eligible: g.friends.length >= 3,
    }));
  }, [referrals, profiles]);

  // Distinct metrics calculation
  const uniqueCodes = new Set(referrals.map((r) => r.referral_code));
  const claimedInvitations = referrals.filter((r) => Boolean(r.referee_id));
  const vipEligibleCount = userReferralGroups.filter((g) => g.is_pro_eligible).length;
  const activeReferrersWithClaims = userReferralGroups.filter((g) => g.total_friends > 0).length;
  const estimatedCoinsDistributed = claimedInvitations.length * 100;

  // Filter & Sort User Referral Groups
  const filteredAndSortedGroups = React.useMemo(() => {
    let result = userReferralGroups.filter((g) => {
      // 1. Milestone filter
      if (milestoneFilter === "vip_reached" && !g.is_pro_eligible) return false;
      if (milestoneFilter === "active" && (g.total_friends === 0 || g.is_pro_eligible)) return false;
      if (milestoneFilter === "no_claims" && g.total_friends > 0) return false;

      // 2. Search query filter
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      const codeMatch = g.referral_code.toLowerCase().includes(q);
      const nameMatch = g.referrer_name.toLowerCase().includes(q);
      const emailMatch = g.referrer_email.toLowerCase().includes(q);
      const friendMatch = g.friends.some(
        (f) => f.name.toLowerCase().includes(q) || f.email.toLowerCase().includes(q)
      );
      return codeMatch || nameMatch || emailMatch || friendMatch;
    });

    // 3. Sorting
    result.sort((a, b) => {
      if (sortBy === "most_friends") {
        if (b.total_friends !== a.total_friends) {
          return b.total_friends - a.total_friends;
        }
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      if (sortBy === "newest") {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      if (sortBy === "oldest") {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      }
      if (sortBy === "name_asc") {
        return a.referrer_name.localeCompare(b.referrer_name);
      }
      return 0;
    });

    return result;
  }, [userReferralGroups, milestoneFilter, searchQuery, sortBy]);

  // Reset pagination when search or filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, milestoneFilter, sortBy, pageSize]);

  // Paginated user groups for current page
  const totalUserPages = Math.max(1, Math.ceil(filteredAndSortedGroups.length / pageSize));
  const paginatedUserGroups = React.useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAndSortedGroups.slice(start, start + pageSize);
  }, [filteredAndSortedGroups, currentPage, pageSize]);

  // Expand / Collapse All on current page
  const handleToggleExpandAll = () => {
    const currentCodes = paginatedUserGroups.map((g) => g.referral_code);
    const allExpanded = currentCodes.every((code) => expandedUsers.has(code));

    setExpandedUsers((prev) => {
      const next = new Set(prev);
      if (allExpanded) {
        currentCodes.forEach((code) => next.delete(code));
      } else {
        currentCodes.forEach((code) => next.add(code));
      }
      return next;
    });
  };

  const isCurrentPageAllExpanded =
    paginatedUserGroups.length > 0 &&
    paginatedUserGroups.every((g) => expandedUsers.has(g.referral_code));

  // Filter & Search logic for raw logs
  const filteredRawLogs = React.useMemo(() => {
    return referrals.filter((ref) => {
      if (rawLogsStatusFilter === "active_codes" && ref.referee_id) return false;
      if (rawLogsStatusFilter === "claimed_friends" && !ref.referee_id) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      const codeMatch = (ref.referral_code || "").toLowerCase().includes(q);
      const referrerMatch = (ref.referrer_name || "").toLowerCase().includes(q);
      const emailMatch = (ref.referrer_email || "").toLowerCase().includes(q);
      const refereeMatch = (ref.referee_name || "").toLowerCase().includes(q);
      const idMatch = (ref.referrer_id || "").toLowerCase().includes(q);

      return codeMatch || referrerMatch || emailMatch || refereeMatch || idMatch;
    });
  }, [referrals, rawLogsStatusFilter, searchQuery]);

  // Pagination for Raw Logs
  const totalLogsPages = Math.max(1, Math.ceil(filteredRawLogs.length / logsPageSize));
  const paginatedRawLogs = React.useMemo(() => {
    const start = (logsCurrentPage - 1) * logsPageSize;
    return filteredRawLogs.slice(start, start + logsPageSize);
  }, [filteredRawLogs, logsCurrentPage, logsPageSize]);

  React.useEffect(() => {
    setLogsCurrentPage(1);
  }, [searchQuery, rawLogsStatusFilter, logsPageSize]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-xl text-xs font-semibold animate-in slide-in-from-bottom-3 duration-200 ${
            notification.type === "success"
              ? "bg-emerald-600 text-white shadow-emerald-600/20"
              : "bg-rose-600 text-white shadow-rose-600/20"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <span>{notification.text}</span>
          <button onClick={() => setNotification(null)} className="ml-2 hover:opacity-80">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 text-white shadow-sm shadow-purple-500/20">
              <Gift className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Referral Program & Growth
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Track user invite codes, see how many friends accepted invitations & claimed Pro rewards in real-time.
              </p>
            </div>
          </div>
        </div>

        {/* Clean Header Action: Refresh Button Only */}
        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchReferrals}
            disabled={loading}
            className="h-9 px-3.5 bg-white dark:bg-slate-800 shadow-xs border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-xs font-medium"
          >
            <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${loading ? "animate-spin text-emerald-600" : "text-slate-500"}`} />
            Refresh Data
          </Button>
        </div>
      </div>

      {/* Modern High-Impact Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Unique Referral Codes */}
        <Card className="p-4 relative overflow-hidden border border-slate-200/80 dark:border-slate-800 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Active Referrers
            </span>
            <span className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400">
              <Sparkles className="h-4 w-4" />
            </span>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
            {uniqueCodes.size}
          </p>
          <div className="flex items-center justify-between text-xs text-slate-400 mt-1">
            <span>Unique invite codes</span>
            <span className="text-teal-600 dark:text-teal-400 font-medium">
              {activeReferrersWithClaims} active referrers
            </span>
          </div>
        </Card>

        {/* Card 2: Friends Joined (Claimed) */}
        <Card className="p-4 relative overflow-hidden border border-slate-200/80 dark:border-slate-800 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Friends Joined & Claimed
            </span>
            <span className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
              <UserCheck className="h-4 w-4" />
            </span>
          </div>
          <p className="text-2xl font-bold text-emerald-600 mt-2">
            {claimedInvitations.length}
          </p>
          <div className="flex items-center justify-between text-xs text-slate-400 mt-1">
            <span>Confirmed friend signups</span>
            <span className="text-emerald-600 font-medium">
              100% Verified
            </span>
          </div>
        </Card>

        {/* Card 3: VIP Pro Qualified Users (3+ Friends) */}
        <Card className="p-4 relative overflow-hidden border border-slate-200/80 dark:border-slate-800 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              VIP Pro Qualified
            </span>
            <span className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
              <Crown className="h-4 w-4" />
            </span>
          </div>
          <p className="text-2xl font-bold text-amber-600 mt-2">
            {vipEligibleCount}
          </p>
          <div className="flex items-center justify-between text-xs text-slate-400 mt-1">
            <span>Users with 3+ friends</span>
            <span className="text-amber-600 font-medium">
              Eligible for 1-Mo Pro
            </span>
          </div>
        </Card>

        {/* Card 4: Estimated Coins Distributed */}
        <Card className="p-4 relative overflow-hidden border border-slate-200/80 dark:border-slate-800 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Coins Distributed
            </span>
            <span className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <Coins className="h-4 w-4" />
            </span>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2 flex items-center gap-1.5">
            <span>🪙</span>
            <span>{estimatedCoinsDistributed.toLocaleString()}</span>
          </p>
          <div className="flex items-center justify-between text-xs text-slate-400 mt-1">
            <span>100 coins/friend</span>
            <span className="text-purple-600 dark:text-purple-400 font-medium">
              300 = 1-Mo Pro
            </span>
          </div>
        </Card>
      </div>

      {/* Main Container Card */}
      <Card className="overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <CardHeader className="py-4 px-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                {mainView === "users_summary" ? (
                  <>
                    <Users className="h-4 w-4 text-emerald-600" />
                    <span>Referral Performance by User (Friends Tracked)</span>
                  </>
                ) : (
                  <>
                    <Clock className="h-4 w-4 text-purple-600" />
                    <span>All Raw Referral Invitation Logs</span>
                  </>
                )}
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {mainView === "users_summary"
                  ? "Track each user's invite code, see exactly who accepted their invitation, and monitor Pro milestone progress."
                  : "Complete row-by-row event history from Supabase referrals table."}
              </CardDescription>
            </div>

            {/* View Mode Switcher Tabs */}
            <div className="flex items-center gap-1 p-1 bg-slate-200/60 dark:bg-slate-800 rounded-xl shrink-0 self-start md:self-auto">
              <button
                onClick={() => setMainView("users_summary")}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all ${
                  mainView === "users_summary"
                    ? "bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 shadow-xs font-bold"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                <Users className="h-3.5 w-3.5" />
                By User (Friends List)
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold">
                  {userReferralGroups.length}
                </span>
              </button>
              <button
                onClick={() => setMainView("all_logs")}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all ${
                  mainView === "all_logs"
                    ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                <Clock className="h-3.5 w-3.5" />
                All Claim Logs
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold">
                  {referrals.length}
                </span>
              </button>
            </div>
          </div>

          {/* Filtering, Search & Sorting Controls (Built to handle high volume of users) */}
          <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            {/* Left: Search Bar with Clear Button */}
            <div className="relative flex-1 max-w-md">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder={
                  mainView === "users_summary"
                    ? "Search by code, user name, email, or friend..."
                    : "Search raw logs by code, name, or email..."
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  title="Clear search"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Right: Milestone Filters & Sorting Controls */}
            {mainView === "users_summary" ? (
              <div className="flex flex-wrap items-center gap-2">
                {/* Milestone Filter Chips */}
                <div className="flex items-center gap-1 p-0.5 bg-slate-100 dark:bg-slate-800/80 rounded-lg text-[11px]">
                  <button
                    onClick={() => setMilestoneFilter("all")}
                    className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                      milestoneFilter === "all"
                        ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold"
                        : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                    }`}
                  >
                    All ({userReferralGroups.length})
                  </button>
                  <button
                    onClick={() => setMilestoneFilter("vip_reached")}
                    className={`px-2.5 py-1 rounded-md font-medium transition-all flex items-center gap-1 ${
                      milestoneFilter === "vip_reached"
                        ? "bg-white dark:bg-slate-700 text-amber-700 dark:text-amber-300 shadow-xs font-bold"
                        : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                    }`}
                    title="Users with 3 or more friend claims"
                  >
                    👑 VIP (3+)
                    <span className="text-[10px] opacity-80">({vipEligibleCount})</span>
                  </button>
                  <button
                    onClick={() => setMilestoneFilter("active")}
                    className={`px-2.5 py-1 rounded-md font-medium transition-all flex items-center gap-1 ${
                      milestoneFilter === "active"
                        ? "bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 shadow-xs font-bold"
                        : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                    }`}
                    title="Users with 1 or 2 claims"
                  >
                    🔥 Active (1-2)
                    <span className="text-[10px] opacity-80">
                      ({userReferralGroups.filter((g) => g.total_friends > 0 && !g.is_pro_eligible).length})
                    </span>
                  </button>
                  <button
                    onClick={() => setMilestoneFilter("no_claims")}
                    className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                      milestoneFilter === "no_claims"
                        ? "bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 shadow-xs font-bold"
                        : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                    }`}
                  >
                    0 Claims
                  </button>
                </div>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-xs">
                  <ArrowUpDown className="h-3 w-3 text-slate-400" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="bg-transparent text-xs text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
                  >
                    <option value="most_friends">Most Friends (Top)</option>
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="name_asc">Name (A-Z)</option>
                  </select>
                </div>

                {/* Expand / Collapse All Button */}
                {paginatedUserGroups.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleToggleExpandAll}
                    className="h-7 px-2.5 text-[11px] text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                    title="Expand or collapse all user friend accordions on this page"
                  >
                    {isCurrentPageAllExpanded ? (
                      <>
                        <ChevronUp className="h-3 w-3 mr-1 text-slate-500" />
                        Collapse All
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-3 w-3 mr-1 text-slate-500" />
                        Expand All
                      </>
                    )}
                  </Button>
                )}
              </div>
            ) : (
              /* Raw Logs Status Filter */
              <div className="flex items-center gap-1 p-0.5 bg-slate-100 dark:bg-slate-800/80 rounded-lg text-[11px]">
                <button
                  onClick={() => setRawLogsStatusFilter("all")}
                  className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                    rawLogsStatusFilter === "all"
                      ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold"
                      : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                  }`}
                >
                  All Logs ({referrals.length})
                </button>
                <button
                  onClick={() => setRawLogsStatusFilter("claimed_friends")}
                  className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                    rawLogsStatusFilter === "claimed_friends"
                      ? "bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 shadow-xs font-bold"
                      : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                  }`}
                >
                  Claimed Signups ({claimedInvitations.length})
                </button>
                <button
                  onClick={() => setRawLogsStatusFilter("active_codes")}
                  className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                    rawLogsStatusFilter === "active_codes"
                      ? "bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 shadow-xs font-bold"
                      : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                  }`}
                >
                  Base Share Codes
                </button>
              </div>
            )}
          </div>
        </CardHeader>

        {loading ? (
          <div>
            <div className="flex items-center gap-2 px-5 py-3 bg-emerald-50/70 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 text-xs font-medium border-b border-emerald-100 dark:border-emerald-900/30">
              <LoadingSpinner size="xs" variant="primary" />
              <span>Fetching referral codes and conversion metrics from database...</span>
            </div>
            <TableSkeleton rows={5} columns={6} />
          </div>
        ) : mainView === "users_summary" ? (
          /* ======================================================== */
          /* VIEW A: BY USER (FRIENDS TRACKED & PAGINATED LIST)       */
          /* ======================================================== */
          filteredAndSortedGroups.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center justify-center gap-2">
              <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400">
                <Inbox className="h-8 w-8" />
              </div>
              <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-200">
                No Referrers Found
              </h3>
              <p className="text-xs text-slate-500 max-w-sm">
                {searchQuery
                  ? `No user records matching "${searchQuery}". Try adjusting your search query or milestone filters.`
                  : "No referral codes have been created by users in the mobile app yet."}
              </p>
            </div>
          ) : (
            <div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {paginatedUserGroups.map((group) => {
                  const isExpanded = expandedUsers.has(group.referral_code);
                  const progressPercent = Math.min((group.total_friends / 3) * 100, 100);

                  // Find a matching referral record for grant modal
                  const representativeRef =
                    referrals.find((r) => r.referral_code === group.referral_code) || null;

                  return (
                    <div
                      key={group.referral_code}
                      className="transition-colors hover:bg-slate-50/40 dark:hover:bg-slate-800/20"
                    >
                      {/* User Summary Master Row */}
                      <div className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        {/* Left: User Profile & Referral Code */}
                        <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                          <button
                            type="button"
                            onClick={() =>
                              openUserModal(group.referrer_id, group.referrer_name, group.referrer_email)
                            }
                            className="cursor-pointer shrink-0 transition-transform active:scale-95"
                            title="Click to view user profile in-page"
                          >
                            <UserAvatar
                              photoUrl={group.referrer_photo_url}
                              name={group.referrer_name}
                              size="md"
                              className="ring-2 ring-emerald-500/20 hover:ring-emerald-500/60 transition-all"
                            />
                          </button>

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  openUserModal(group.referrer_id, group.referrer_name, group.referrer_email)
                                }
                                className="font-bold text-slate-900 dark:text-slate-100 text-sm hover:text-emerald-600 dark:hover:text-emerald-400 text-left transition-colors cursor-pointer truncate"
                              >
                                {group.referrer_name}
                              </button>

                              {/* Referral Code Badge with Quick Copy */}
                              <span className="flex items-center gap-1 font-mono font-bold text-xs text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/70 dark:border-emerald-800/50">
                                {group.referral_code}
                                <button
                                  onClick={() => handleCopyCode(group.referral_code)}
                                  title="Copy code to clipboard"
                                  className="p-0.5 text-emerald-600/70 hover:text-emerald-700 dark:hover:text-emerald-200 rounded"
                                >
                                  {copiedCode === group.referral_code ? (
                                    <Check className="h-3 w-3 text-emerald-600" />
                                  ) : (
                                    <Copy className="h-3 w-3" />
                                  )}
                                </button>
                              </span>

                              {/* Performance Badge */}
                              {group.is_pro_eligible && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-100/70 dark:bg-amber-950/50 px-2 py-0.5 rounded-full border border-amber-300/60 dark:border-amber-800/40">
                                  <Crown className="h-2.5 w-2.5 text-amber-500" />
                                  VIP Qualified
                                </span>
                              )}
                            </div>

                            {group.referrer_email && (
                              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                                {group.referrer_email}
                              </p>
                            )}
                            <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                              ID: {group.referrer_id.slice(0, 16)}... • Code Created {formatDate(group.created_at)}
                            </p>
                          </div>
                        </div>

                        {/* Middle: Friends Accepted Counter & Milestone Progress */}
                        <div className="flex-1 max-w-md bg-white dark:bg-slate-900/60 p-3 rounded-2xl border border-slate-200/70 dark:border-slate-800 shadow-xs">
                          <div className="flex items-center justify-between text-xs mb-1.5">
                            <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                              <UserCheck className="h-3.5 w-3.5 text-emerald-600" />
                              <strong>{group.total_friends}</strong>{" "}
                              {group.total_friends === 1 ? "Friend" : "Friends"} Accepted & Claimed
                            </span>
                            <span className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                              🪙 {group.coins_earned} Coins
                            </span>
                          </div>

                          {/* Progress Bar (0 to 3 Friends) */}
                          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all duration-500 rounded-full ${
                                group.is_pro_eligible
                                  ? "bg-gradient-to-r from-amber-500 to-amber-400"
                                  : group.total_friends > 0
                                  ? "bg-gradient-to-r from-emerald-500 to-teal-400"
                                  : "bg-slate-300 dark:bg-slate-700"
                              }`}
                              style={{ width: `${progressPercent}%` }}
                            />
                          </div>

                          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1.5">
                            <span>Milestone: {group.total_friends} / 3 Friends</span>
                            {group.is_pro_eligible ? (
                              <span className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                                <Crown className="h-3 w-3" /> VIP Pro Reached!
                              </span>
                            ) : (
                              <span>{3 - group.total_friends} more to VIP Pro</span>
                            )}
                          </div>
                        </div>

                        {/* Right: Actions & Expand Button */}
                        <div className="flex items-center gap-2 self-end lg:self-center shrink-0">
                          {/* Grant Pro Button */}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              if (representativeRef) {
                                setTargetReferral(representativeRef);
                                setIsGrantOpen(true);
                              }
                            }}
                            className={`text-xs h-8 px-3 transition-all ${
                              group.is_pro_eligible
                                ? "border-amber-400 bg-amber-50/80 text-amber-900 dark:bg-amber-950/40 dark:text-amber-300 font-bold hover:bg-amber-100 shadow-xs"
                                : "border-slate-200 text-slate-700 dark:border-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                            }`}
                            title="Directly activate 30-Day VIP Pro subscription in database"
                          >
                            <Crown className="h-3.5 w-3.5 mr-1 text-amber-500" />
                            Grant 1-Mo Pro
                          </Button>

                          {/* Expand Friends List Button */}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => toggleUserExpanded(group.referral_code)}
                            className={`text-xs h-8 px-3 flex items-center gap-1.5 transition-all ${
                              isExpanded
                                ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold"
                                : "text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50/70 dark:hover:bg-emerald-950/20"
                            }`}
                          >
                            <span>Friends ({group.total_friends})</span>
                            {isExpanded ? (
                              <ChevronUp className="h-3.5 w-3.5" />
                            ) : (
                              <ChevronDown className="h-3.5 w-3.5" />
                            )}
                          </Button>
                        </div>
                      </div>

                      {/* Expandable Section: Friends Who Accepted & Claimed */}
                      {isExpanded && (
                        <div className="px-5 sm:px-6 py-4 bg-slate-50/80 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800/80 animate-in fade-in duration-200">
                          <div className="flex items-center justify-between mb-3">
                            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 uppercase tracking-wider">
                              <UserPlus className="h-3.5 w-3.5 text-emerald-600" />
                              Friends Who Accepted Invitation ({group.total_friends})
                            </p>
                            <span className="text-[11px] text-slate-400">
                              Each friend awarded +100 coins upon joining
                            </span>
                          </div>

                          {group.friends.length === 0 ? (
                            <div className="p-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-center bg-white dark:bg-slate-900">
                              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                                No friends have claimed invite code{" "}
                                <strong className="font-mono text-emerald-600 dark:text-emerald-400">
                                  {group.referral_code}
                                </strong>{" "}
                                yet.
                              </p>
                              <p className="text-[11px] text-slate-400 mt-0.5">
                                When friends install the app and enter this code, they will instantly appear here with their join date and reward status.
                              </p>
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                              {group.friends.map((friend, idx) => (
                                <div
                                  key={friend.id || idx}
                                  className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3 shadow-xs hover:border-emerald-300 dark:hover:border-emerald-800 transition-colors"
                                >
                                  <div className="flex items-center gap-2.5 min-w-0">
                                    <button
                                      type="button"
                                      onClick={() => openUserModal(friend.referee_id, friend.name, friend.email)}
                                      className="cursor-pointer shrink-0"
                                      title="Inspect friend profile"
                                    >
                                      <UserAvatar
                                        photoUrl={friend.photo_url}
                                        name={friend.name}
                                        size="sm"
                                        className="ring-1 ring-purple-400/30"
                                      />
                                    </button>
                                    <div className="min-w-0">
                                      <button
                                        type="button"
                                        onClick={() => openUserModal(friend.referee_id, friend.name, friend.email)}
                                        className="font-bold text-slate-900 dark:text-slate-100 text-xs truncate hover:text-purple-600 dark:hover:text-purple-400 text-left block"
                                      >
                                        {friend.name}
                                      </button>
                                      {friend.email && (
                                        <p className="text-[11px] text-slate-400 truncate">
                                          {friend.email}
                                        </p>
                                      )}
                                      <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                                        <Clock className="h-2.5 w-2.5" />
                                        {formatDateTime(friend.claimed_at)}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="text-right shrink-0">
                                    <Badge
                                      variant={friend.status === "rewarded" ? "success" : "warning"}
                                      className="text-[10px] py-0.5 px-2"
                                    >
                                      {friend.status === "rewarded" ? "+100 🪙 Claimed" : "Pending"}
                                    </Badge>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Pagination Controls for Users View (Handles hundreds/thousands of users smoothly) */}
              <div className="py-3 px-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <span>
                    Showing{" "}
                    <strong className="text-slate-800 dark:text-slate-200">
                      {filteredAndSortedGroups.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}
                    </strong>{" "}
                    to{" "}
                    <strong className="text-slate-800 dark:text-slate-200">
                      {Math.min(currentPage * pageSize, filteredAndSortedGroups.length)}
                    </strong>{" "}
                    of{" "}
                    <strong className="text-slate-800 dark:text-slate-200">
                      {filteredAndSortedGroups.length}
                    </strong>{" "}
                    referrers
                  </span>
                  <span className="text-slate-300 dark:text-slate-700">|</span>
                  <div className="flex items-center gap-1.5">
                    <span>Rows per page:</span>
                    <select
                      value={pageSize}
                      onChange={(e) => {
                        setPageSize(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                      className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                    >
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
                    className="h-8 px-2.5 text-xs border-slate-200 dark:border-slate-700"
                  >
                    <ChevronLeft className="h-3.5 w-3.5 mr-1" />
                    Previous
                  </Button>

                  <div className="flex items-center gap-1 px-1">
                    {Array.from({ length: totalUserPages }, (_, i) => i + 1)
                      .filter((p) => p === 1 || p === totalUserPages || Math.abs(p - currentPage) <= 1)
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
                                  ? "bg-emerald-600 text-white shadow-xs font-bold"
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
                    onClick={() => setCurrentPage((p) => Math.min(totalUserPages, p + 1))}
                    disabled={currentPage >= totalUserPages}
                    className="h-8 px-2.5 text-xs border-slate-200 dark:border-slate-700"
                  >
                    Next
                    <ChevronRight className="h-3.5 w-3.5 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          )
        ) : (
          /* ======================================================== */
          /* VIEW B: ALL RAW INVITATION LOGS (PAGINATED TABLE)        */
          /* ======================================================== */
          filteredRawLogs.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center justify-center gap-2">
              <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400">
                <Inbox className="h-8 w-8" />
              </div>
              <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-200">
                No Referral Records Found
              </h3>
              <p className="text-xs text-slate-500 max-w-sm">
                No referral logs match your selected filter or query.
              </p>
            </div>
          ) : (
            <div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-3 px-4">Referral Code</th>
                      <th className="py-3 px-4">Referrer (Code Owner)</th>
                      <th className="py-3 px-4">Invited Friend (Referee)</th>
                      <th className="py-3 px-4">Reward Status</th>
                      <th className="py-3 px-4">Date Created</th>
                      <th className="py-3 px-4 text-right">Admin Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {paginatedRawLogs.map((ref) => {
                      const hasReferee = Boolean(ref.referee_id);
                      const isRewarded = ref.status === "rewarded";

                      return (
                        <tr
                          key={ref.id}
                          className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                        >
                          {/* Referral Code */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono font-bold text-xs text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40">
                                {ref.referral_code}
                              </span>
                              <button
                                onClick={() => handleCopyCode(ref.referral_code)}
                                title="Copy code"
                                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded"
                              >
                                {copiedCode === ref.referral_code ? (
                                  <Check className="h-3 w-3 text-emerald-600" />
                                ) : (
                                  <Copy className="h-3 w-3" />
                                )}
                              </button>
                            </div>
                          </td>

                          {/* Referrer User (In-Page Inspection) */}
                          <td className="py-3.5 px-4">
                            <button
                              type="button"
                              onClick={() =>
                                openUserModal(ref.referrer_id, ref.referrer_name, ref.referrer_email)
                              }
                              className="flex items-center gap-2.5 text-left group hover:opacity-90 cursor-pointer"
                              title="Click to inspect user in-page without redirection"
                            >
                              <div className="h-8 w-8 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-xs shrink-0 group-hover:ring-2 group-hover:ring-emerald-500/50 transition-all">
                                {(ref.referrer_name || "R").slice(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 flex items-center gap-1 transition-colors">
                                  {ref.referrer_name || "Referrer User"}
                                </p>
                                {ref.referrer_email && (
                                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                    {ref.referrer_email}
                                  </p>
                                )}
                                <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                                  ID: {ref.referrer_id.slice(0, 16)}...
                                </p>
                              </div>
                            </button>
                          </td>

                          {/* Invited Referee Friend (In-Page Inspection) */}
                          <td className="py-3.5 px-4">
                            {hasReferee ? (
                              <button
                                type="button"
                                onClick={() =>
                                  openUserModal(ref.referee_id!, ref.referee_name, ref.referee_email)
                                }
                                className="flex items-center gap-2 text-left group hover:opacity-90 cursor-pointer"
                                title="Click to inspect friend in-page without redirection"
                              >
                                <div className="h-7 w-7 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 flex items-center justify-center font-bold text-[11px] shrink-0 group-hover:ring-2 group-hover:ring-purple-500/50 transition-all">
                                  {(ref.referee_name || "F").slice(0, 1).toUpperCase()}
                                </div>
                                <div>
                                  <p className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-purple-600 dark:group-hover:text-purple-400 flex items-center gap-1 transition-colors">
                                    {ref.referee_name || "Friend User"}
                                  </p>
                                  {ref.referee_email && (
                                    <p className="text-[10px] text-slate-400">
                                      {ref.referee_email}
                                    </p>
                                  )}
                                  <Badge
                                    variant="outline"
                                    className="text-[10px] py-0 px-1.5 text-purple-600 border-purple-200 dark:border-purple-800/50 mt-0.5"
                                  >
                                    Joined via Invite
                                  </Badge>
                                </div>
                              </button>
                            ) : (
                              <div className="flex items-center gap-1.5 text-slate-400">
                                <span className="italic text-xs">Shared Code</span>
                                <Badge
                                  variant="outline"
                                  className="text-[10px] py-0 px-1.5 text-slate-400 border-slate-200 dark:border-slate-800"
                                >
                                  Not Claimed Yet
                                </Badge>
                              </div>
                            )}
                          </td>

                          {/* Reward Status (Clickable Toggle) */}
                          <td className="py-3.5 px-4">
                            <button
                              onClick={() => handleToggleStatus(ref)}
                              title="Click to toggle status (Rewarded <-> Pending)"
                              className="group flex items-center gap-1.5 cursor-pointer"
                            >
                              <Badge variant={isRewarded ? "success" : "warning"}>
                                {isRewarded ? "Rewarded" : "Pending"}
                              </Badge>
                              <span className="text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity underline">
                                Toggle
                              </span>
                            </button>
                          </td>

                          {/* Date Created */}
                          <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">
                            {formatDateTime(ref.created_at)}
                          </td>

                          {/* Administrative Actions */}
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* 1-Click Grant 30-Day Pro Button */}
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setTargetReferral(ref);
                                  setIsGrantOpen(true);
                                }}
                                className="text-xs h-7 px-2 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                                title="Activate 30-day VIP Pro subscription in database"
                              >
                                <Crown className="h-3 w-3 mr-1 text-amber-500" />
                                Grant Pro
                              </Button>

                              {/* Delete / Revoke Button */}
                              <button
                                onClick={() => {
                                  setDeleteRef(ref);
                                  setIsDeleteOpen(true);
                                }}
                                title="Delete / Revoke this referral record"
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Logs Pagination Controls */}
              <div className="py-3 px-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <span>
                    Showing{" "}
                    <strong className="text-slate-800 dark:text-slate-200">
                      {filteredRawLogs.length === 0 ? 0 : (logsCurrentPage - 1) * logsPageSize + 1}
                    </strong>{" "}
                    to{" "}
                    <strong className="text-slate-800 dark:text-slate-200">
                      {Math.min(logsCurrentPage * logsPageSize, filteredRawLogs.length)}
                    </strong>{" "}
                    of{" "}
                    <strong className="text-slate-800 dark:text-slate-200">
                      {filteredRawLogs.length}
                    </strong>{" "}
                    logs
                  </span>
                  <span className="text-slate-300 dark:text-slate-700">|</span>
                  <div className="flex items-center gap-1.5">
                    <span>Rows:</span>
                    <select
                      value={logsPageSize}
                      onChange={(e) => {
                        setLogsPageSize(Number(e.target.value));
                        setLogsCurrentPage(1);
                      }}
                      className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                    >
                      <option value={15}>15</option>
                      <option value={30}>30</option>
                      <option value={50}>50</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setLogsCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={logsCurrentPage <= 1}
                    className="h-8 px-2.5 text-xs border-slate-200 dark:border-slate-700"
                  >
                    <ChevronLeft className="h-3.5 w-3.5 mr-1" />
                    Previous
                  </Button>

                  <div className="flex items-center gap-1 px-1">
                    {Array.from({ length: totalLogsPages }, (_, i) => i + 1)
                      .filter((p) => p === 1 || p === totalLogsPages || Math.abs(p - logsCurrentPage) <= 1)
                      .map((p, idx, arr) => {
                        const prev = arr[idx - 1];
                        const hasGap = prev && p - prev > 1;
                        return (
                          <React.Fragment key={p}>
                            {hasGap && <span className="px-1 text-slate-400">...</span>}
                            <button
                              onClick={() => setLogsCurrentPage(p)}
                              className={`h-8 min-w-8 px-2 rounded-lg text-xs font-medium transition-all ${
                                logsCurrentPage === p
                                  ? "bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 shadow-xs font-bold"
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
                    onClick={() => setLogsCurrentPage((p) => Math.min(totalLogsPages, p + 1))}
                    disabled={logsCurrentPage >= totalLogsPages}
                    className="h-8 px-2.5 text-xs border-slate-200 dark:border-slate-700"
                  >
                    Next
                    <ChevronRight className="h-3.5 w-3.5 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          )
        )}
      </Card>


      {/* MODAL 1: Grant 30-Day VIP Pro Modal */}
      <Modal
        isOpen={isGrantOpen}
        onClose={() => setIsGrantOpen(false)}
        title="Activate 30-Day VIP Pro Subscription"
        description="Directly grants a 30-day VIP Pro subscription in the Supabase subscriptions table."
      >
        {targetReferral && (
          <div className="space-y-4 text-xs">
            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/50 flex items-start gap-3">
              <Crown className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-amber-900 dark:text-amber-200 text-sm">
                  30-Day Pro Subscription Grant
                </p>
                <p className="text-amber-700 dark:text-amber-300 mt-1 leading-relaxed">
                  This will activate an active <strong>Monthly VIP Pro</strong> subscription for 30 days in the database. Both the mobile app and admin portal will immediately recognize this user as VIP Pro.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700 space-y-1.5">
              <p className="text-slate-500 dark:text-slate-400">Target User:</p>
              <p className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                {targetReferral.referee_name || targetReferral.referrer_name}
              </p>
              <p className="font-mono text-slate-400 text-[11px]">
                {targetReferral.referrer_email || targetReferral.referrer_id}
              </p>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium pt-1">
                Referral Code: <span className="font-mono font-bold">{targetReferral.referral_code}</span>
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsGrantOpen(false)}
                disabled={isGranting}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleGrantPro}
                disabled={isGranting}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
              >
                {isGranting ? <LoadingSpinner size="xs" /> : "Confirm & Activate 30-Day Pro"}
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* MODAL 2: Delete / Revoke Referral Modal */}
      <Modal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Revoke / Delete Referral Record"
        description="Permanently delete this referral record from the Supabase referrals table."
      >
        {deleteRef && (
          <div className="space-y-4 text-xs">
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-rose-800 dark:text-rose-200 text-sm">
                  Delete Referral Code {deleteRef.referral_code}
                </p>
                <p className="text-rose-600 dark:text-rose-400 mt-1 leading-relaxed">
                  Are you sure you want to permanently delete this referral record? This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsDeleteOpen(false)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleDeleteReferral}
                disabled={isDeleting}
                className="bg-rose-600 hover:bg-rose-700 text-white font-semibold"
              >
                {isDeleting ? <LoadingSpinner size="xs" /> : "Delete Record"}
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* MODAL 3: In-Page User Profile Quick Inspector Modal (No Redirection) */}
      <Modal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        title="User Referral & Profile Details"
        description="Inspect user details and referral progress in-page without leaving this screen."
      >
        {selectedUser && (
          <div className="space-y-4 text-xs">
            {/* User Profile Card */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 flex items-center gap-3">
              <UserAvatar
                photoUrl={selectedUser.photo_url}
                name={selectedUser.name}
                size="lg"
                className="ring-2 ring-emerald-500/20"
              />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-900 dark:text-slate-100 text-sm truncate">
                  {selectedUser.name}
                </p>
                <p className="text-slate-500 dark:text-slate-400 text-xs truncate">
                  {selectedUser.email || "No email available"}
                </p>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5 truncate">
                  ID: {selectedUser.id}
                </p>
              </div>
            </div>

            {/* Quick Details Grid */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Gender & Blood
                </span>
                <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                  {selectedUser.gender || "Not specified"} • {selectedUser.blood_group || "N/A"}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Account Created
                </span>
                <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                  {selectedUser.created_at ? formatDate(selectedUser.created_at) : "Active User"}
                </p>
              </div>
            </div>

            {/* User Referral History in Current Table */}
            <div className="p-3.5 rounded-xl bg-purple-50/60 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40">
              <span className="text-[10px] uppercase font-bold text-purple-700 dark:text-purple-300 tracking-wider flex items-center gap-1.5">
                <Gift className="h-3.5 w-3.5" />
                Referral Program Activity
              </span>
              <div className="mt-2.5 flex items-center justify-between text-xs border-b border-purple-100/60 dark:border-purple-900/30 pb-1.5">
                <span className="text-slate-600 dark:text-slate-400">Invite Codes Generated:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {referrals.filter((r) => r.referrer_id === selectedUser.id).length}
                </span>
              </div>
              <div className="mt-1.5 flex items-center justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-400">Friends Successfully Joined:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {referrals.filter((r) => r.referrer_id === selectedUser.id && Boolean(r.referee_id)).length}
                </span>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-between items-center pt-3 border-t border-slate-100 dark:border-slate-800">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsUserModalOpen(false)}
              >
                Close
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  const refRow = referrals.find((r) => r.referrer_id === selectedUser.id);
                  if (refRow) {
                    setTargetReferral(refRow);
                    setIsUserModalOpen(false);
                    setIsGrantOpen(true);
                  }
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 font-semibold"
              >
                <Crown className="h-3.5 w-3.5 text-amber-300" />
                Grant 1-Mo Pro
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
