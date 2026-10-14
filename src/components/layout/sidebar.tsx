"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Gift,
  Activity,
  LogOut,
  Settings,
  Database,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdminAuth } from "@/lib/auth-context";
import { UserAvatar } from "@/components/ui/user-avatar";

const NAV_ITEMS = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "User Directory", href: "/users", icon: Users },
  { name: "Health Analytics", href: "/health-analytics", icon: Activity },
  { name: "Master Data", href: "/master-data", icon: Database, badge: "Clinical" },
  { name: "Referral Program", href: "/referrals", icon: Gift },
  { name: "App Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAdminAuth();

  const adminName = user?.name || "Super Admin";
  const adminRole = user?.role || "Super Admin";

  return (
    <aside className="w-64 border-r border-slate-200/90 dark:border-white/10 bg-white/95 dark:bg-[#080d19]/95 backdrop-blur-md flex flex-col h-screen sticky top-0 shrink-0 z-30 select-none">
      {/* Brand Header */}
      <div className="h-16 flex items-center gap-3 px-5 border-b border-slate-100 dark:border-white/5">
        <div className="h-9 w-9 rounded-[8px] overflow-hidden bg-white shadow-sm border border-slate-200 dark:border-white/10 p-0.5 flex items-center justify-center shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.jpeg"
            alt="HealthTrack Logo"
            className="w-full h-full object-contain"
          />
        </div>
        <div>
          <span className="font-black text-sm tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5 uppercase">
            Health<span className="text-[#006AFA]">Track</span>
            <span className="text-[9px] uppercase font-black px-1.5 py-0.5 rounded-[4px] bg-[#006AFA]/10 text-[#006AFA] dark:text-sky-400 border border-[#006AFA]/20">
              Admin
            </span>
          </span>
          <p className="text-[10px] text-slate-400 font-semibold tracking-wide">Operations Portal</p>
        </div>
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
          Platform Management
        </p>
        {NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center justify-between px-3 py-2.5 rounded-[8px] text-xs font-semibold transition-all group",
                isActive
                  ? "bg-[#006AFA]/10 text-[#006AFA] dark:text-sky-400 font-bold border-l-3 border-[#006AFA] shadow-2xs"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100/70 dark:hover:bg-white/[0.03] hover:text-slate-900 dark:hover:text-white"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={cn(
                    "h-4 w-4 transition-colors",
                    isActive
                      ? "text-[#006AFA] dark:text-sky-400"
                      : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200"
                  )}
                />
                <span>{item.name}</span>
              </div>
              {"badge" in item && (
                <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-[4px] bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Operations Live Status Card */}
      <div className="px-3 pb-2">
        <div className="p-2.5 rounded-[8px] bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 space-y-1.5">
          <div className="flex items-center justify-between text-[10px]">
            <span className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Supabase &amp; AdMob
            </span>
            <span className="font-extrabold text-emerald-600 dark:text-emerald-400">100% Active</span>
          </div>
          <p className="text-[9px] text-slate-400 leading-tight">
            Encrypted zero-knowledge Google Drive vault backup online
          </p>
        </div>
      </div>

      {/* Authenticated Admin Account Card & Sign Out */}
      <div className="p-3 border-t border-slate-100 dark:border-white/5">
        <div className="p-2.5 rounded-[8px] bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <UserAvatar
              photoUrl={user?.avatar}
              name={adminName}
              size="sm"
              shape="rounded"
            />
            <div className="overflow-hidden min-w-0">
              <p
                className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate max-w-[105px]"
                title={adminName}
              >
                {adminName}
              </p>
              <p className="text-[10px] text-[#006AFA] dark:text-sky-400 font-semibold truncate">
                {adminRole}
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            type="button"
            title="Sign out of Admin Portal"
            className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 p-1.5 rounded-[6px] hover:bg-white dark:hover:bg-slate-800 transition-colors shrink-0"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}

