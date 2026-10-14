"use client";

import * as React from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { useAdminAuth } from "@/lib/auth-context";
import { AuthService } from "@/lib/auth-service";
import { HeartPulse } from "lucide-react";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAdminAuth();

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      AuthService.logout();
    }
  }, [isLoading, isAuthenticated]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center gap-3">
        <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/25 animate-bounce">
          <HeartPulse className="h-6 w-6" />
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            Verifying Admin Authorization...
          </p>
          <p className="text-xs text-slate-400 mt-0.5">HealthTrack Operations Portal</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Fixed Left Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
