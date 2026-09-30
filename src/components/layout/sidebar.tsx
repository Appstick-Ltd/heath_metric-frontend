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
  HeartPulse,
  LogOut,
  ShieldCheck,
  Apple,
  Pill,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdminAuth } from "@/lib/auth-context";
import { UserAvatar } from "@/components/ui/user-avatar";

const NAV_ITEMS = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "User Directory", href: "/users", icon: Users },
  { name: "Health Analytics", href: "/health-analytics", icon: Activity },
  { name: "Subscriptions", href: "/subscriptions", icon: CreditCard },
  { name: "Referral Program", href: "/referrals", icon: Gift },
  { name: "Food Database", href: "/cms-foods", icon: Apple },
  { name: "Medicine Presets", href: "/medicines", icon: Pill },
  { name: "App Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAdminAuth();

  const adminName = user?.name || "Super Admin";
  const adminRole = user?.role || "Super Admin";

  return (
    <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md flex flex-col h-screen sticky top-0 shrink-0 z-30 select-none">
      {/* Brand Header */}
      <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-100 dark:border-slate-800">
        <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
          <HeartPulse className="h-5 w-5" />
        </div>
        <div>
          <span className="font-bold text-base tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
            NutriHealth
            <span className="text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
              Admin
            </span>
          </span>
          <p className="text-[11px] text-slate-400 font-medium">Operations Portal</p>
        </div>
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <p className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
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
                "flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all group",
                isActive
                  ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-semibold shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-slate-200"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={cn(
                    "h-4 w-4 transition-colors",
                    isActive
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300"
                  )}
                />
                <span>{item.name}</span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Authenticated Admin Account Card & Sign Out */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800">
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <UserAvatar
              photoUrl={user?.avatar}
              name={adminName}
              size="sm"
              shape="rounded"
            />
            <div className="overflow-hidden min-w-0">
              <p
                className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[110px]"
                title={adminName}
              >
                {adminName}
              </p>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium truncate">
                {adminRole}
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            type="button"
            title="Sign out of Admin Portal"
            className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 transition-colors shrink-0"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
