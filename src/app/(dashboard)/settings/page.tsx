"use client";

import * as React from "react";
import {
  Settings,
  Shield,
  Smartphone,
  Megaphone,
  Save,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Activity,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/loader";
import { DataService } from "@/lib/data-service";
import { useAdminAuth } from "@/lib/auth-context";
import { AuditLog } from "@/types/database";
import { formatDate, formatDateTime } from "@/lib/utils";

export default function SettingsPage() {
  const { user } = useAdminAuth();
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [savedSuccess, setSavedSuccess] = React.useState(false);

  // App Settings State
  const [maintenanceEnabled, setMaintenanceEnabled] = React.useState(false);
  const [minVersion, setMinVersion] = React.useState("1.2.0");
  const [announcementActive, setAnnouncementActive] = React.useState(true);
  const [announcementMessage, setAnnouncementMessage] = React.useState("");

  // Audit Logs State
  const [logs, setLogs] = React.useState<AuditLog[]>([]);

  // Search & Pagination State for Audit Trail
  const [searchQuery, setSearchQuery] = React.useState("");
  const [severityFilter, setSeverityFilter] = React.useState<"all" | "critical" | "warning" | "info">("all");
  const [currentPage, setCurrentPage] = React.useState(1);
  const pageSize = 10;

  const loadData = async () => {
    setLoading(true);
    try {
      const [settings, auditLogs] = await Promise.all([
        DataService.getAppSettings(),
        DataService.getAuditLogs(),
      ]);

      if (settings.maintenance_mode) {
        setMaintenanceEnabled(!!settings.maintenance_mode.enabled);
      }
      if (settings.min_app_version) {
        setMinVersion(settings.min_app_version.version || "1.2.0");
      }
      if (settings.announcement_banner) {
        setAnnouncementActive(!!settings.announcement_banner.active);
        setAnnouncementMessage(settings.announcement_banner.message || "");
      }

      setLogs(auditLogs);
    } catch (e) {
      console.warn("Failed to load settings:", e);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadData();
  }, []);

  const handleSaveSettings = async () => {
    setSaving(true);
    setSavedSuccess(false);
    try {
      await Promise.all([
        DataService.updateAppSetting("maintenance_mode", { enabled: maintenanceEnabled }),
        DataService.updateAppSetting("min_app_version", { version: minVersion }),
        DataService.updateAppSetting("announcement_banner", {
          active: announcementActive,
          message: announcementMessage,
        }),
      ]);

      await DataService.logAdminAction(
        user?.name || "Super Admin",
        user?.role || "Administrator",
        `Updated mobile app operational settings (Maintenance: ${maintenanceEnabled}, MinVer: ${minVersion})`,
        "app_settings",
        "info"
      );

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
      loadData();
    } catch (e: any) {
      alert(e?.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  // Severity counts for filters
  const severityCounts = React.useMemo(() => {
    return {
      all: logs.length,
      critical: logs.filter((l) => l.severity === "critical").length,
      warning: logs.filter((l) => l.severity === "warning").length,
      info: logs.filter((l) => l.severity === "info").length,
    };
  }, [logs]);

  // Filtered logs based on search query & severity tab
  const filteredLogs = React.useMemo(() => {
    return logs.filter((log) => {
      const matchesSeverity = severityFilter === "all" || log.severity === severityFilter;
      if (!matchesSeverity) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        log.admin_name?.toLowerCase().includes(q) ||
        log.action?.toLowerCase().includes(q) ||
        log.target?.toLowerCase().includes(q) ||
        log.admin_role?.toLowerCase().includes(q)
      );
    });
  }, [logs, searchQuery, severityFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / pageSize));
  const paginatedLogs = React.useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredLogs.slice(start, start + pageSize);
  }, [filteredLogs, currentPage, pageSize]);

  // Reset to page 1 whenever filter or search query changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, severityFilter]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Settings className="h-6 w-6 text-emerald-600" />
            Application Settings & Operations
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Global feature flags, minimum app versions, live mobile broadcast banners, and security audit logs
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={loadData}>
            <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button size="sm" onClick={handleSaveSettings} disabled={saving}>
            <Save className="h-3.5 w-3.5 mr-1.5" />
            {saving ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          Settings updated in Supabase app_settings table successfully! Mobile clients will receive these flags on next sync.
        </div>
      )}

      {/* Main Settings Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Maintenance Mode */}
        <Card className="p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm mb-1">
              <Shield className="h-4 w-4 text-amber-500" />
              Maintenance Mode
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              When enabled, non-admin mobile app users see a friendly maintenance screen during server updates.
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              {maintenanceEnabled ? "Active (Under Maintenance)" : "Disabled (App Online)"}
            </span>
            <input
              type="checkbox"
              checked={maintenanceEnabled}
              onChange={(e) => setMaintenanceEnabled(e.target.checked)}
              className="h-5 w-5 rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
            />
          </div>
        </Card>

        {/* Min Version Enforcer */}
        <Card className="p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm mb-1">
              <Smartphone className="h-4 w-4 text-sky-500" />
              Minimum App Version
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Forces users with older Flutter builds to update from Google Play / App Store before syncing.
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Input
              value={minVersion}
              onChange={(e) => setMinVersion(e.target.value)}
              placeholder="e.g. 1.2.0"
              className="text-xs font-mono"
            />
          </div>
        </Card>

        {/* Announcement Banner */}
        <Card className="p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm mb-1">
              <Megaphone className="h-4 w-4 text-emerald-600" />
              Broadcast Banner
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Broadcasts a real-time message at the top of the mobile application dashboard for all patients.
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              {announcementActive ? "Showing to Users" : "Hidden"}
            </span>
            <input
              type="checkbox"
              checked={announcementActive}
              onChange={(e) => setAnnouncementActive(e.target.checked)}
              className="h-5 w-5 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
            />
          </div>
        </Card>
      </div>

      {/* Broadcast Message Editor */}
      <Card className="p-5">
        <label className="font-semibold text-slate-800 dark:text-slate-200 text-xs block mb-1.5">
          Broadcast Banner Message Content
        </label>
        <textarea
          rows={2}
          value={announcementMessage}
          onChange={(e) => setAnnouncementMessage(e.target.value)}
          placeholder="e.g. New update available! You can now track medication dosages and meal logs directly from the home tab."
          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        />
      </Card>

      {/* Admin Audit Logs Table with Search, Filter & Pagination */}
      <Card className="overflow-hidden">
        <CardHeader className="py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <CardTitle className="flex items-center gap-2 text-base">
                <Activity className="h-4 w-4 text-emerald-600" />
                Security & Administration Audit Trail
              </CardTitle>
              <CardDescription className="text-xs mt-0.5">
                Live chronological security log of admin operations and database modifications ({logs.length} total logged)
              </CardDescription>
            </div>

            {/* Severity Filter Tabs */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={() => setSeverityFilter("all")}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  severityFilter === "all"
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-2xs"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                All ({severityCounts.all})
              </button>
              <button
                type="button"
                onClick={() => setSeverityFilter("critical")}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  severityFilter === "critical"
                    ? "bg-rose-600 text-white shadow-2xs"
                    : "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/60"
                }`}
              >
                Critical ({severityCounts.critical})
              </button>
              {severityCounts.warning > 0 && (
                <button
                  type="button"
                  onClick={() => setSeverityFilter("warning")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    severityFilter === "warning"
                      ? "bg-amber-600 text-white shadow-2xs"
                      : "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 hover:bg-amber-100"
                  }`}
                >
                  Warning ({severityCounts.warning})
                </button>
              )}
              {severityCounts.info > 0 && (
                <button
                  type="button"
                  onClick={() => setSeverityFilter("info")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    severityFilter === "info"
                      ? "bg-sky-600 text-white shadow-2xs"
                      : "bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 hover:bg-sky-100"
                  }`}
                >
                  Info ({severityCounts.info})
                </button>
              )}
            </div>
          </div>

          {/* Quick Search Input */}
          <div className="mt-3 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search audit trail by admin name, action, or target user ID..."
              className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-8 py-1.5 text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/75 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Admin Staff</th>
                  <th className="py-3 px-4">Action Performed</th>
                  <th className="py-3 px-4">Target Entity</th>
                  <th className="py-3 px-4">Severity</th>
                  <th className="py-3 px-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {paginatedLogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-xs text-slate-400">
                      No audit logs match your search or filter.
                    </td>
                  </tr>
                ) : (
                  paginatedLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 px-4">
                        <p className="font-semibold text-slate-900 dark:text-slate-100">
                          {log.admin_name}
                        </p>
                        <p className="text-[10px] text-slate-400">{log.admin_role}</p>
                      </td>
                      <td className="py-3 px-4 text-slate-800 dark:text-slate-200 font-medium">
                        {log.action}
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                        {log.target || "System"}
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={
                            log.severity === "critical"
                              ? "danger"
                              : log.severity === "warning"
                              ? "warning"
                              : "info"
                          }
                          className="text-[10px]"
                        >
                          {log.severity}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-slate-400 text-[11px]">
                        {formatDateTime(log.timestamp)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Clean Pagination Footer */}
          {filteredLogs.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 text-xs text-slate-500">
              <div>
                Showing{" "}
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {(currentPage - 1) * pageSize + 1}
                </span>{" "}
                to{" "}
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {Math.min(currentPage * pageSize, filteredLogs.length)}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {filteredLogs.length}
                </span>{" "}
                logs
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="h-7 px-2.5 text-xs cursor-pointer"
                >
                  <ChevronLeft className="h-3.5 w-3.5 mr-1" />
                  Previous
                </Button>
                <span className="text-xs font-medium px-2 text-slate-700 dark:text-slate-300">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage >= totalPages}
                  className="h-7 px-2.5 text-xs cursor-pointer"
                >
                  Next
                  <ChevronRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
