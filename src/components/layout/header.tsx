"use client";

import * as React from "react";
import { Bell, Search, Database, CheckCircle2 } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  const [notificationsOpen, setNotificationsOpen] = React.useState(false);

  return (
    <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Search Input */}
      <div className="flex items-center gap-4 w-96">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search database users, foods, vitals..."
            className="w-full bg-slate-100 dark:bg-slate-800/70 border-none rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Live Supabase Cloud Indicator */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/30 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
          <Database className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Live Supabase Database</span>
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse ml-0.5" />
        </div>

        {/* Notifications Popover Toggle */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-emerald-500" />
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-4 z-50 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  Database Notifications
                </span>
                <span className="text-[10px] text-emerald-600 font-medium cursor-pointer hover:underline">
                  Clear
                </span>
              </div>
              <div className="py-3 text-center text-xs text-slate-400">
                Connected to Supabase PostgreSQL cloud instance.
              </div>
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
      </div>
    </header>
  );
}
