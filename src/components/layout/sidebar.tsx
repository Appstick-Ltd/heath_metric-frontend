"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Gift,
  Salad,
  Pill,
  Activity,
  ShieldCheck,
  Settings,
  HeartPulse,
  LogOut,
} from "lucide-react";
import { cn, getAvatarUrl } from "@/lib/utils";
import { DataService } from "@/lib/data-service";
import { Profile } from "@/types/database";

const NAV_ITEMS = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "User Directory", href: "/users", icon: Users, badge: "1.4k" },
  { name: "Subscriptions", href: "/subscriptions", icon: CreditCard },
  { name: "Referral Program", href: "/referrals", icon: Gift },
  { name: "Food & Nutrition CMS", href: "/cms-foods", icon: Salad },
  { name: "Medicine Presets", href: "/medicines", icon: Pill },
  { name: "Health Analytics", href: "/health-analytics", icon: Activity },
  { name: "Team & Security", href: "/team", icon: ShieldCheck },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [profile, setProfile] = React.useState<Profile | null>(null);
  const [imgError, setImgError] = React.useState(false);

  React.useEffect(() => {
    DataService.getCurrentProfile().then((p) => {
      if (p) {
        setProfile(p);
        setImgError(false);
      }
    });
  }, []);

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
              {item.badge && (
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Current Admin Card & Logout */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800">
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
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
                <div className="h-9 w-9 rounded-full bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs border border-emerald-500/20 shrink-0">
                  {profile?.name ? profile.name.slice(0, 2).toUpperCase() : "MK"}
                </div>
              );
            })()}
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[110px]" title={profile?.name || "MD Mahfujul Karim"}>
                {profile?.name || "MD Mahfujul Karim"}
              </p>
              <p className="text-[10px] text-slate-400 truncate">Super Admin</p>
            </div>
          </div>
          <Link
            href="/login"
            title="Sign out"
            className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
