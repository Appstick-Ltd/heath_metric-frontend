"use client";

import * as React from "react";
import { Bell, Search, Database, CheckCircle2, X, AlertTriangle, Info, RefreshCw } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { DataService } from "@/lib/data-service";
import { formatDateTime, getAvatarUrl } from "@/lib/utils";
import { Profile } from "@/types/database";

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
  const [profile, setProfile] = React.useState<Profile | null>(null);
  const [imgError, setImgError] = React.useState(false);
  const [notificationsOpen, setNotificationsOpen] = React.useState(false);
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const [notifLoading, setNotifLoading] = React.useState(false);
  const [readIds, setReadIds] = React.useState<Set<string>>(new Set());
  const panelRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    DataService.getCurrentProfile().then((p) => {
      if (p) {
        setProfile(p);
        setImgError(false);
      }
    });
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

  // Load notifications when panel opens
  React.useEffect(() => {
    if (notificationsOpen && notifications.length === 0) {
      loadNotifications();
    }
  }, [notificationsOpen]);

  // Mark all as read when panel opens
  React.useEffect(() => {
    if (notificationsOpen && notifications.length > 0) {
      const ids = new Set(notifications.map((n) => n.id));
      setReadIds(ids);
    }
  }, [notificationsOpen, notifications]);

  // Click outside to close
  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
    }
    if (notificationsOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [notificationsOpen]);

  const severityIcon = (sev: Notification["severity"]) => {
    if (sev === "critical") return <AlertTriangle className="h-3.5 w-3.5 text-rose-500 shrink-0" />;
    if (sev === "warning") return <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0" />;
    return <Info className="h-3.5 w-3.5 text-sky-500 shrink-0" />;
  };

  const severityBg = (sev: Notification["severity"]) => {
    if (sev === "critical") return "bg-rose-50 dark:bg-rose-950/30 border-rose-200/60 dark:border-rose-800/40";
    if (sev === "warning") return "bg-amber-50 dark:bg-amber-950/30 border-amber-200/60 dark:border-amber-800/40";
    return "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/40";
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
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
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
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-slate-600 dark:text-slate-300" />
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    Notifications
                  </span>
                  {notifications.length > 0 && (
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {notifications.length}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={loadNotifications}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Refresh"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${notifLoading ? "animate-spin" : ""}`} />
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
              <div className="max-h-[420px] overflow-y-auto">
                {notifLoading ? (
                  <div className="py-10 flex flex-col items-center justify-center gap-2 text-xs text-slate-400">
                    <div className="h-6 w-6 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
                    Fetching from Supabase...
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="py-10 text-center text-xs text-slate-400 flex flex-col items-center gap-2">
                    <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                    <p className="font-semibold text-slate-600 dark:text-slate-300">All Clear!</p>
                    <p>No critical vitals or new events found.</p>
                  </div>
                ) : (
                  <div className="p-2 space-y-1.5">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`flex items-start gap-2.5 p-3 rounded-xl border text-xs transition-all ${severityBg(n.severity)}`}
                      >
                        <div className="mt-0.5">{severityIcon(n.severity)}</div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-slate-800 dark:text-slate-200 leading-snug">
                            {n.title}
                          </p>
                          <p className="text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                            {n.description}
                          </p>
                          <p className="text-[10px] text-slate-400 mt-1">
                            {n.timestamp ? formatDateTime(n.timestamp) : "Just now"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Panel Footer */}
              {notifications.length > 0 && (
                <div className="px-4 py-2.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                  <p className="text-[11px] text-center text-slate-400">
                    Real-time data from Supabase — critical alerts are auto-detected
                  </p>
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

        {/* User Profile Avatar with Luxury Gradient Ring */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200 dark:border-slate-800">
          {(() => {
            const avatarSrc = getAvatarUrl(profile?.photo_url || profile?.avatar_url);
            if (avatarSrc && !imgError) {
              return (
                <div className="relative h-9 w-9 rounded-full p-[2px] bg-gradient-to-tr from-teal-500 to-sky-500 shadow-sm shrink-0">
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
            return (
              <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-emerald-100 to-teal-100 dark:from-emerald-950/70 dark:to-teal-950/70 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-xs shrink-0 border border-emerald-500/20">
                {profile?.name ? profile.name.slice(0, 2).toUpperCase() : "MK"}
              </div>
            );
          })()}
          <div className="hidden xl:block text-left">
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight truncate max-w-[130px]">
              {profile?.name || "MD Mahfujul Karim"}
            </p>
            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
              Administrator
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
