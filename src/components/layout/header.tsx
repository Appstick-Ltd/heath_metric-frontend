"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  Search,
  Database,
  CheckCircle2,
  X,
  AlertTriangle,
  Info,
  RefreshCw,
  ShieldCheck,
  LogOut,
  ChevronDown,
  Gift,
  Crown,
  UserPlus,
  CheckCheck,
  Activity,
  ArrowRight,
} from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { DataService } from "@/lib/data-service";
import { formatDateTime, formatTimeAgo } from "@/lib/utils";
import { useAdminAuth } from "@/lib/auth-context";
import { UserAvatar } from "@/components/ui/user-avatar";

type Notification = {
  id: string;
  type: "critical_vital" | "new_user" | "subscription" | "referral";
  title: string;
  description: string;
  timestamp: string;
  severity: "critical" | "warning" | "info";
  read: boolean;
};

export function Header() {
  const router = useRouter();
  const { user, logout } = useAdminAuth();
  const [notificationsOpen, setNotificationsOpen] = React.useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = React.useState(false);
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const [notifLoading, setNotifLoading] = React.useState(false);
  const [readIds, setReadIds] = React.useState<Set<string>>(new Set());
  const panelRef = React.useRef<HTMLDivElement>(null);
  const profileRef = React.useRef<HTMLDivElement>(null);

  const adminName = user?.name || "Super Admin";
  const adminRole = user?.role || "Super Admin";
  const adminEmail = user?.email || "admin@nutrihealth.com";
  const initials = adminName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "SA";

  // Load read notifications from localStorage on mount
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem("read_notification_ids");
      if (saved) {
        setReadIds(new Set(JSON.parse(saved)));
      }
    } catch {}
  }, []);

  const unreadCount = notifications.filter((n) => !readIds.has(n.id)).length;

  const loadNotifications = async () => {
    setNotifLoading(true);
    try {
      const data = await DataService.getRecentNotifications();
      setNotifications(data as Notification[]);
    } catch {
      // Silently fail
    } finally {
      setNotifLoading(false);
    }
  };

  // Load notifications on mount and periodically every 25s
  React.useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 25000);
    return () => clearInterval(interval);
  }, []);

  // Refresh notifications when panel opens
  React.useEffect(() => {
    if (notificationsOpen) {
      loadNotifications();
    }
  }, [notificationsOpen]);

  // Mark all notifications as read
  const markAllAsRead = () => {
    const allIds = new Set(notifications.map((n) => n.id));
    setReadIds(allIds);
    try {
      localStorage.setItem("read_notification_ids", JSON.stringify(Array.from(allIds)));
    } catch {}
  };

  // Handle single notification click with navigation
  const handleNotificationClick = (n: Notification) => {
    const nextRead = new Set(readIds);
    nextRead.add(n.id);
    setReadIds(nextRead);
    try {
      localStorage.setItem("read_notification_ids", JSON.stringify(Array.from(nextRead)));
    } catch {}

    setNotificationsOpen(false);

    switch (n.type) {
      case "referral":
        router.push("/referrals");
        break;
      case "new_user":
        router.push("/users");
        break;
      case "subscription":
        router.push("/subscriptions");
        break;
      case "critical_vital":
        router.push("/health-analytics");
        break;
    }
  };

  // Click outside to close panels
  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getNotificationIcon = (n: Notification) => {
    switch (n.type) {
      case "referral":
        return <Gift className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />;
      case "subscription":
        return <Crown className="h-4 w-4 text-amber-500 shrink-0" />;
      case "new_user":
        return <UserPlus className="h-4 w-4 text-sky-500 shrink-0" />;
      case "critical_vital":
        return n.severity === "critical" ? (
          <AlertTriangle className="h-4 w-4 text-rose-500 shrink-0" />
        ) : (
          <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
        );
      default:
        return <Info className="h-4 w-4 text-slate-500 shrink-0" />;
    }
  };

  const getSeverityBg = (n: Notification, isUnread: boolean) => {
    if (n.severity === "critical") {
      return isUnread
        ? "bg-rose-50/90 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800"
        : "bg-rose-50/40 dark:bg-rose-950/20 border-rose-200/50 dark:border-rose-900/30";
    }
    if (n.type === "referral") {
      return isUnread
        ? "bg-emerald-50/90 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800"
        : "bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200/50 dark:border-emerald-900/30";
    }
    if (n.severity === "warning") {
      return isUnread
        ? "bg-amber-50/90 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800"
        : "bg-amber-50/40 dark:bg-amber-950/20 border-amber-200/50 dark:border-amber-900/30";
    }
    return isUnread
      ? "bg-slate-50 dark:bg-slate-800/80 border-slate-300 dark:border-slate-700"
      : "bg-white dark:bg-slate-900/50 border-slate-100 dark:border-slate-800/60";
  };

  return (
    <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Search Input */}
      <div className="flex items-center gap-4 w-96">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search users, vitals, subscriptions..."
            className="w-full bg-slate-100 dark:bg-slate-800/70 border-none rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium text-slate-400 bg-slate-200 dark:bg-slate-700">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Live Supabase Cloud Indicator */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/30 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
          <Database className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Live DB</span>
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse ml-0.5" />
        </div>

        {/* Notifications Popover */}
        <div className="relative" ref={panelRef}>
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative cursor-pointer"
            title="Notifications"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center animate-pulse">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
            {unreadCount === 0 && (
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-emerald-500" />
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-96 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 overflow-hidden">
              {/* Panel Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    Notifications
                  </span>
                  {unreadCount > 0 ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500 text-white">
                      {unreadCount} new
                    </span>
                  ) : notifications.length > 0 ? (
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {notifications.length}
                    </span>
                  ) : null}
                </div>
                <div className="flex items-center gap-1">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="px-2 py-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                      title="Mark all as read"
                    >
                      <CheckCheck className="h-3 w-3" />
                      Mark read
                    </button>
                  )}
                  <button
                    onClick={loadNotifications}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Refresh"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${notifLoading ? "animate-spin text-emerald-600" : ""}`} />
                  </button>
                  <button
                    onClick={() => setNotificationsOpen(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Panel Body */}
              <div className="max-h-[420px] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
                {notifLoading && notifications.length === 0 ? (
                  <div className="py-10 flex flex-col items-center justify-center gap-2 text-xs text-slate-400">
                    <div className="h-6 w-6 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
                    Fetching latest events from Supabase...
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="py-10 text-center text-xs text-slate-400 flex flex-col items-center gap-2">
                    <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                    <p className="font-semibold text-slate-600 dark:text-slate-300">All Clear!</p>
                    <p>No critical vitals or recent events logged.</p>
                  </div>
                ) : (
                  <div className="p-2 space-y-1.5">
                    {notifications.map((n) => {
                      const isUnread = !readIds.has(n.id);
                      return (
                        <div
                          key={n.id}
                          onClick={() => handleNotificationClick(n)}
                          className={`flex items-start gap-2.5 p-3 rounded-xl border text-xs transition-all cursor-pointer hover:shadow-xs hover:border-emerald-300 dark:hover:border-emerald-800 ${getSeverityBg(
                            n,
                            isUnread
                          )}`}
                        >
                          <div className="mt-0.5 p-1 rounded-lg bg-white/70 dark:bg-slate-800/80 shadow-2xs">
                            {getNotificationIcon(n)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <p className={`leading-snug truncate ${isUnread ? "font-bold text-slate-900 dark:text-white" : "font-semibold text-slate-700 dark:text-slate-300"}`}>
                                {n.title}
                              </p>
                              {isUnread && (
                                <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" title="Unread" />
                              )}
                            </div>
                            <p className="text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                              {n.description}
                            </p>
                            <div className="flex items-center justify-between mt-1 text-[10px] text-slate-400">
                              <span>{n.timestamp ? formatTimeAgo(n.timestamp) : "Just now"}</span>
                              <span className="flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400 opacity-0 group-hover:opacity-100 font-medium">
                                View <ArrowRight className="h-2.5 w-2.5" />
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Panel Footer */}
              {notifications.length > 0 && (
                <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Click any alert to navigate to page</span>
                  <span className="text-emerald-600 font-medium">Live Supabase Sync</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Sync Status Badge */}
        <div className="hidden sm:flex items-center gap-1.5 pl-2 border-l border-slate-200 dark:border-slate-800 text-xs font-medium text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="h-4 w-4" />
          <span>Healthy</span>
        </div>

        {/* Admin User Profile & Dropdown */}
        <div className="relative pl-2 border-l border-slate-200 dark:border-slate-800" ref={profileRef}>
          <button
            type="button"
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-100/80 dark:hover:bg-slate-800/80 transition-colors text-left"
          >
            <UserAvatar
              photoUrl={user?.avatar}
              name={adminName}
              size="sm"
              shape="rounded"
            />
            <div className="hidden xl:block text-left">
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight truncate max-w-[130px]">
                {adminName}
              </p>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                {adminRole}
              </p>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400 hidden xl:block" />
          </button>

          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 overflow-hidden p-2 space-y-1">
              <div className="px-3 py-2.5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
                <UserAvatar
                  photoUrl={user?.avatar}
                  name={adminName}
                  size="md"
                  shape="rounded"
                />
                <div className="overflow-hidden min-w-0">
                  <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                    {adminName}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate">{adminEmail}</p>
                  <span className="inline-block mt-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
                    {adminRole}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setProfileDropdownOpen(false);
                  logout();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors font-medium"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
