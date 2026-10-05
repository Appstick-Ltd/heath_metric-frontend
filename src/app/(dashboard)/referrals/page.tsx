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
  Copy,
  Check,
  UserCheck,
  AlertCircle,
  Trash2,
  Crown,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  X,
  UserPlus
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { TableSkeleton } from "@/components/ui/skeleton";
import { LoadingSpinner } from "@/components/ui/loader";
import { UserAvatar } from "@/components/ui/user-avatar";
import { DataService } from "@/lib/data-service";
import { Referral, Profile } from "@/types/database";
import { formatDate, formatDateTime } from "@/lib/utils";

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

  // Simple View Tab: "users" or "logs"
  const [activeTab, setActiveTab] = React.useState<"users" | "logs">("users");

  // Search & Filter
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<"all" | "has_friends" | "no_friends">("all");
  const [copiedCode, setCopiedCode] = React.useState<string | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = React.useState(1);
  const pageSize = 10;

  // Accordion for showing friends under a user row
  const [expandedCodes, setExpandedCodes] = React.useState<Set<string>>(new Set());

  // Modal States
  const [isGrantOpen, setIsGrantOpen] = React.useState(false);
  const [targetReferral, setTargetReferral] = React.useState<Referral | null>(null);
  const [isGranting, setIsGranting] = React.useState(false);

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

  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
  const [deleteRef, setDeleteRef] = React.useState<Referral | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  // Toast
  const [notification, setNotification] = React.useState<{ text: string; type: "success" | "error" } | null>(null);

  const showNotification = (text: string, type: "success" | "error" = "success") => {
    setNotification({ text, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const fetchReferrals = React.useCallback(async () => {
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
  }, []);

  React.useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const [data, profs] = await Promise.all([
          DataService.getReferrals(),
          DataService.getProfiles(),
        ]);
        if (!ignore) {
          setReferrals(data);
          setProfiles(profs);
        }
      } catch (e) {
        console.warn("Failed to fetch referrals:", e);
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, []);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const toggleExpand = (code: string) => {
    setExpandedCodes((prev) => {
      const next = new Set(prev);
      if (next.has(code)) {
        next.delete(code);
      } else {
        next.add(code);
      }
      return next;
    });
  };

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
      showNotification(`🎉 30-Day Pro granted for ${targetName}!`);
    } else {
      setIsGranting(false);
      showNotification(res.error || "Failed to grant Pro subscription.", "error");
    }
  };

  const handleDeleteReferral = async () => {
    if (!deleteRef) return;
    setIsDeleting(true);
    const ok = await DataService.deleteReferral(deleteRef.id);
    setIsDeleting(false);

    if (ok) {
      setReferrals((prev) => prev.filter((r) => r.id !== deleteRef.id));
      setIsDeleteOpen(false);
      setDeleteRef(null);
      showNotification("Referral record removed.");
    } else {
      showNotification("Failed to delete referral record.", "error");
    }
  };

  // Group Referrals by Referrer Code
  const userReferralGroups: UserReferralGroup[] = React.useMemo(() => {
    const map = new Map<string, UserReferralGroup>();
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
          referrer_name: r.referrer_name || referrerProfile?.name || "User",
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
          name: r.referee_name || refereeProfile?.name || "Friend",
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

  // High-level Stats (Clean and simple)
  const uniqueReferrersCount = userReferralGroups.length;
  const totalFriendsJoined = referrals.filter((r) => Boolean(r.referee_id)).length;
  const totalCoinsDistributed = totalFriendsJoined * 100;

  // Filtered Groups
  const filteredGroups = React.useMemo(() => {
    return userReferralGroups.filter((g) => {
      if (statusFilter === "has_friends" && g.total_friends === 0) return false;
      if (statusFilter === "no_friends" && g.total_friends > 0) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        g.referral_code.toLowerCase().includes(q) ||
        g.referrer_name.toLowerCase().includes(q) ||
        g.referrer_email.toLowerCase().includes(q) ||
        g.friends.some((f) => f.name.toLowerCase().includes(q) || f.email.toLowerCase().includes(q))
      );
    });
  }, [userReferralGroups, statusFilter, searchQuery]);

  // Reset page when filter changes without cascading effects
  const [prevFilter, setPrevFilter] = React.useState({ searchQuery, statusFilter });
  if (prevFilter.searchQuery !== searchQuery || prevFilter.statusFilter !== statusFilter) {
    setPrevFilter({ searchQuery, statusFilter });
    setCurrentPage(1);
  }

  // Paginated Groups
  const totalPages = Math.max(1, Math.ceil(filteredGroups.length / pageSize));
  const paginatedGroups = React.useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredGroups.slice(start, start + pageSize);
  }, [filteredGroups, currentPage, pageSize]);

  // Filtered Raw Logs for Tab 2
  const filteredLogs = React.useMemo(() => {
    if (!searchQuery.trim()) return referrals;
    const q = searchQuery.toLowerCase().trim();
    return referrals.filter(
      (r) =>
        r.referral_code.toLowerCase().includes(q) ||
        (r.referrer_name || "").toLowerCase().includes(q) ||
        (r.referrer_email || "").toLowerCase().includes(q) ||
        (r.referee_name || "").toLowerCase().includes(q)
    );
  }, [referrals, searchQuery]);

  const paginatedLogs = React.useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredLogs.slice(start, start + pageSize);
  }, [filteredLogs, currentPage, pageSize]);

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Toast Alert */}
      {notification && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl shadow-lg text-xs font-semibold text-white ${
            notification.type === "success" ? "bg-emerald-600" : "bg-rose-600"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <span>{notification.text}</span>
          <button onClick={() => setNotification(null)} className="ml-2 hover:opacity-80">
            <X className="h-3 w-3" />
          </button>
        </div>
      )}

      {/* Page Header: Clean & Simple */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Gift className="h-5 w-5 text-emerald-600" />
            Referrals & Friends Tracking
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Track user invite codes and see which friends installed and claimed rewards.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchReferrals}
          disabled={loading}
          className="h-8 px-3 text-xs bg-white dark:bg-slate-800 self-start sm:self-auto"
        >
          <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${loading ? "animate-spin text-emerald-600" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* 3 Clean Summary Cards (No unnecessary noise) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <Card className="p-4 flex items-center justify-between border-slate-200/80 dark:border-slate-800">
          <div>
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
              Total Referrers
            </span>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {uniqueReferrersCount}
            </p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center">
            <Users className="h-5 w-5" />
          </div>
        </Card>

        <Card className="p-4 flex items-center justify-between border-slate-200/80 dark:border-slate-800">
          <div>
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
              Friends Joined & Claimed
            </span>
            <p className="text-2xl font-bold text-emerald-600 mt-1">
              {totalFriendsJoined}
            </p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <UserCheck className="h-5 w-5" />
          </div>
        </Card>

        <Card className="p-4 flex items-center justify-between border-slate-200/80 dark:border-slate-800">
          <div>
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
              Total Coins Earned
            </span>
            <p className="text-2xl font-bold text-amber-600 mt-1 flex items-center gap-1">
              <span>🪙</span>
              <span>{totalCoinsDistributed}</span>
            </p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Coins className="h-5 w-5" />
          </div>
        </Card>
      </div>

      {/* Main Table Card */}
      <Card className="overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-xs">
        {/* Table Controls Header */}
        <div className="p-3.5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-900/30">
          {/* Tab Switcher */}
          <div className="flex items-center gap-1 p-0.5 bg-slate-200/60 dark:bg-slate-800 rounded-lg self-start">
            <button
              onClick={() => setActiveTab("users")}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                activeTab === "users"
                  ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              By Referrer ({userReferralGroups.length})
            </button>
            <button
              onClick={() => setActiveTab("logs")}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                activeTab === "logs"
                  ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              All Claim Logs ({referrals.length})
            </button>
          </div>

          {/* Simple Search & Filter */}
          <div className="flex items-center gap-2 flex-1 max-w-md self-stretch sm:self-auto justify-end">
            <div className="relative flex-1">
              <Search className="h-3.5 w-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search user, email, or code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-7 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>

            {activeTab === "users" && (
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as "all" | "has_friends" | "no_friends")}
                className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
              >
                <option value="all">All Referrers</option>
                <option value="has_friends">With Joined Friends</option>
                <option value="no_friends">No Friends Yet</option>
              </select>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="p-4">
            <TableSkeleton rows={4} columns={5} />
          </div>
        ) : activeTab === "users" ? (
          /* ======================================================== */
          /* TAB 1: USERS & FRIENDS TABLE (CLEAN & FAMILIAR)          */
          /* ======================================================== */
          filteredGroups.length === 0 ? (
            <div className="p-10 text-center flex flex-col items-center justify-center gap-2 text-slate-400">
              <Inbox className="h-7 w-7" />
              <p className="text-xs font-medium text-slate-600 dark:text-slate-300">
                {searchQuery ? `No referrers matching "${searchQuery}"` : "No referrers found in database."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Referral Code</th>
                    <th className="py-3 px-4">Friends Joined</th>
                    <th className="py-3 px-4">Coins Earned</th>
                    <th className="py-3 px-4">Pro Reward</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {paginatedGroups.map((group) => {
                    const isExpanded = expandedCodes.has(group.referral_code);
                    const matchingRef =
                      referrals.find((r) => r.referral_code === group.referral_code) || null;

                    return (
                      <React.Fragment key={group.referral_code}>
                        <tr className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                          {/* User Details */}
                          <td className="py-3 px-4">
                            <button
                              type="button"
                              onClick={() =>
                                openUserModal(group.referrer_id, group.referrer_name, group.referrer_email)
                              }
                              className="flex items-center gap-2.5 text-left group cursor-pointer"
                              title="Click to view user details"
                            >
                              <UserAvatar
                                photoUrl={group.referrer_photo_url}
                                name={group.referrer_name}
                                size="sm"
                              />
                              <div>
                                <p className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 transition-colors">
                                  {group.referrer_name}
                                </p>
                                <p className="text-[11px] text-slate-400">
                                  {group.referrer_email || "No email"}
                                </p>
                              </div>
                            </button>
                          </td>

                          {/* Code */}
                          <td className="py-3 px-4">
                            <div className="inline-flex items-center gap-1 font-mono font-bold text-xs bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-800 dark:text-slate-200">
                              <span>{group.referral_code}</span>
                              <button
                                onClick={() => handleCopyCode(group.referral_code)}
                                title="Copy code"
                                className="p-0.5 text-slate-400 hover:text-slate-600"
                              >
                                {copiedCode === group.referral_code ? (
                                  <Check className="h-3 w-3 text-emerald-600" />
                                ) : (
                                  <Copy className="h-3 w-3" />
                                )}
                              </button>
                            </div>
                          </td>

                          {/* Friends Joined + Expand Button */}
                          <td className="py-3 px-4">
                            <button
                              type="button"
                              onClick={() => toggleExpand(group.referral_code)}
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                                group.total_friends > 0
                                  ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100"
                                  : "bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200"
                              }`}
                            >
                              <Users className="h-3 w-3" />
                              <span>
                                {group.total_friends} {group.total_friends === 1 ? "Friend" : "Friends"}
                              </span>
                              {isExpanded ? (
                                <ChevronUp className="h-3 w-3 ml-0.5" />
                              ) : (
                                <ChevronDown className="h-3 w-3 ml-0.5" />
                              )}
                            </button>
                          </td>

                          {/* Coins */}
                          <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">
                            🪙 {group.coins_earned} Coins
                          </td>

                          {/* Pro Reward Status */}
                          <td className="py-3 px-4">
                            {group.is_pro_eligible ? (
                              <Badge variant="success" className="bg-amber-500 text-white font-bold py-0.5">
                                <Crown className="h-3 w-3 mr-1" />
                                VIP Pro Qualified
                              </Badge>
                            ) : (
                              <span className="text-[11px] text-slate-400">
                                {group.total_friends}/3 Friends
                              </span>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  if (matchingRef) {
                                    setTargetReferral(matchingRef);
                                    setIsGrantOpen(true);
                                  }
                                }}
                                className={`text-xs h-7 px-2.5 ${
                                  group.is_pro_eligible
                                    ? "border-amber-400 bg-amber-50 text-amber-800 font-bold hover:bg-amber-100"
                                    : "text-slate-600"
                                }`}
                              >
                                <Crown className="h-3 w-3 mr-1 text-amber-500" />
                                Grant Pro
                              </Button>

                              {matchingRef && (
                                <button
                                  onClick={() => {
                                    setDeleteRef(matchingRef);
                                    setIsDeleteOpen(true);
                                  }}
                                  title="Delete code"
                                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>

                        {/* Expandable Simple Sub-row showing Joined Friends */}
                        {isExpanded && (
                          <tr>
                            <td colSpan={6} className="bg-slate-50/70 dark:bg-slate-900/50 p-4 border-b border-slate-100 dark:border-slate-800">
                              <div className="max-w-3xl">
                                <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
                                  <UserPlus className="h-3.5 w-3.5 text-emerald-600" />
                                  Friends Who Claimed This Code ({group.total_friends})
                                </p>

                                {group.friends.length === 0 ? (
                                  <p className="text-xs text-slate-400 italic">
                                    No friends have claimed this code yet. When a friend enters this code in the app, they will appear here.
                                  </p>
                                ) : (
                                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                                    {group.friends.map((friend) => (
                                      <div
                                        key={friend.id}
                                        className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between gap-2 shadow-xs"
                                      >
                                        <div className="min-w-0">
                                          <p className="font-semibold text-slate-900 dark:text-slate-100 text-xs truncate">
                                            {friend.name}
                                          </p>
                                          {friend.email && (
                                            <p className="text-[10px] text-slate-400 truncate">
                                              {friend.email}
                                            </p>
                                          )}
                                          <p className="text-[9px] text-slate-400 mt-0.5">
                                            {formatDate(friend.claimed_at)}
                                          </p>
                                        </div>
                                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded shrink-0">
                                          +100 🪙
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )
        ) : (
          /* ======================================================== */
          /* TAB 2: RAW EVENT LOGS (CLEAN TABLE)                      */
          /* ======================================================== */
          filteredLogs.length === 0 ? (
            <div className="p-10 text-center text-slate-400 text-xs">
              No referral logs found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Code</th>
                    <th className="py-3 px-4">Referrer</th>
                    <th className="py-3 px-4">Invited Friend</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {paginatedLogs.map((ref) => (
                    <tr key={ref.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="py-3 px-4 font-mono font-bold text-emerald-600">
                        {ref.referral_code}
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-900 dark:text-slate-100">
                        {ref.referrer_name || ref.referrer_email || "User"}
                      </td>
                      <td className="py-3 px-4">
                        {ref.referee_id ? (
                          <span className="text-purple-600 font-medium">
                            {ref.referee_name || ref.referee_email || "Friend"}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">Not Claimed Yet</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={ref.status === "rewarded" ? "success" : "warning"}>
                          {ref.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-slate-400">
                        {formatDateTime(ref.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}

        {/* Simple Pagination Bar */}
        {filteredGroups.length > 0 && activeTab === "users" && (
          <div className="py-3 px-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/20 flex items-center justify-between text-xs text-slate-500">
            <span>
              Showing {(currentPage - 1) * pageSize + 1} to{" "}
              {Math.min(currentPage * pageSize, filteredGroups.length)} of {filteredGroups.length} referrers
            </span>

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage <= 1}
                className="h-7 px-2 text-xs"
              >
                <ChevronLeft className="h-3 w-3 mr-1" />
                Prev
              </Button>
              <span className="px-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                {currentPage} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                className="h-7 px-2 text-xs"
              >
                Next
                <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Grant Pro Modal */}
      <Modal
        isOpen={isGrantOpen}
        onClose={() => setIsGrantOpen(false)}
        title="Grant 30-Day VIP Pro"
        description="Activate a free 30-day Pro subscription for this user."
      >
        {targetReferral && (
          <div className="space-y-4 text-xs">
            <p className="text-slate-600 dark:text-slate-300">
              Are you sure you want to activate <strong>30 Days VIP Pro</strong> for{" "}
              <strong className="text-slate-900 dark:text-white">
                {targetReferral.referee_name || targetReferral.referrer_name}
              </strong>{" "}
              ({targetReferral.referral_code})?
            </p>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <Button variant="outline" size="sm" onClick={() => setIsGrantOpen(false)} disabled={isGranting}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleGrantPro} disabled={isGranting} className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold">
                {isGranting ? <LoadingSpinner size="xs" /> : "Confirm & Grant Pro"}
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Delete Referral Record"
        description="Permanently delete this referral record."
      >
        {deleteRef && (
          <div className="space-y-4 text-xs">
            <p className="text-rose-600 font-medium">
              Are you sure you want to delete referral code <strong>{deleteRef.referral_code}</strong>?
            </p>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <Button variant="outline" size="sm" onClick={() => setIsDeleteOpen(false)} disabled={isDeleting}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleDeleteReferral} disabled={isDeleting} className="bg-rose-600 hover:bg-rose-700 text-white">
                {isDeleting ? <LoadingSpinner size="xs" /> : "Delete"}
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* User In-Page Modal */}
      <Modal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        title="User Details"
        description="Quick user profile inspection."
      >
        {selectedUser && (
          <div className="space-y-3 text-xs">
            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
              <UserAvatar photoUrl={selectedUser.photo_url} name={selectedUser.name} size="md" />
              <div>
                <p className="font-bold text-slate-900 dark:text-white text-sm">{selectedUser.name}</p>
                <p className="text-slate-500">{selectedUser.email}</p>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">ID: {selectedUser.id}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
                <span className="text-slate-400">Gender & Blood:</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                  {selectedUser.gender || "N/A"} • {selectedUser.blood_group || "N/A"}
                </p>
              </div>
              <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
                <span className="text-slate-400">Created At:</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                  {selectedUser.created_at ? formatDate(selectedUser.created_at) : "Active User"}
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-slate-800">
              <Button size="sm" variant="outline" onClick={() => setIsUserModalOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
