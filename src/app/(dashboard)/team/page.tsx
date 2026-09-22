"use client";

import * as React from "react";
import {
  ShieldCheck,
  UserPlus,
  History,
  CheckCircle2,
  RefreshCw,
  Inbox,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataService } from "@/lib/data-service";
import { AuditLog } from "@/types/database";
import { formatDateTime } from "@/lib/utils";

export default function TeamPage() {
  const [logs, setLogs] = React.useState<AuditLog[]>([]);
  const [loading, setLoading] = React.useState(true);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const data = await DataService.getAuditLogs();
      setLogs(data);
    } catch (e) {
      console.warn(e);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchLogs();
  }, []);

  const teamMembers = [
    {
      name: "Dr. Shahriar",
      email: "shahriar@nutrihealth.com",
      role: "Super Admin",
      department: "Clinical Operations",
      status: "Active",
      lastLogin: "Active Now",
    },
    {
      name: "Tania Ahmed",
      email: "tania.support@nutrihealth.com",
      role: "Support Moderator",
      department: "Customer Care",
      status: "Active",
      lastLogin: "Today",
    },
    {
      name: "Farhan Kabir",
      email: "farhan.rd@nutrihealth.com",
      role: "Nutritionist / CMS Editor",
      department: "Dietary Science",
      status: "Active",
      lastLogin: "Today",
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Team & Role-Based Access Control
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage administrative staff, permissions, and security audit logs
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchLogs}>
          <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Staff Members List */}
      <Card className="overflow-hidden">
        <CardHeader className="py-4">
          <CardTitle>Administrative Staff</CardTitle>
          <CardDescription>
            Authorized clinical and operations staff accounts
          </CardDescription>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/75 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold uppercase">
              <tr>
                <th className="py-3 px-4">Staff Member</th>
                <th className="py-3 px-4">Assigned Role</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Session</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {teamMembers.map((m, i) => (
                <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-slate-900 dark:text-slate-100">{m.name}</p>
                    <p className="text-[11px] text-slate-400">{m.email}</p>
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge variant={m.role === "Super Admin" ? "success" : "info"}>
                      {m.role}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                    {m.department}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 text-emerald-600 text-[11px] font-semibold">
                      <CheckCircle2 className="h-3 w-3" />
                      {m.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">
                    {m.lastLogin}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Security Audit Trail from Supabase `admin_audit_logs` */}
      <Card className="overflow-hidden">
        <CardHeader className="py-4">
          <div className="flex items-center gap-2">
            <History className="h-4 w-4 text-emerald-600" />
            <CardTitle>System & Administrative Audit Trail</CardTitle>
          </div>
          <CardDescription>
            Live database audit log querying Supabase `admin_audit_logs` table
          </CardDescription>
        </CardHeader>
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading audit logs...</div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center gap-2">
            <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400">
              <Inbox className="h-8 w-8" />
            </div>
            <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-200">
              No Audit Events in Database
            </h3>
            <p className="text-xs text-slate-500 max-w-sm">
              As admin actions, privilege changes, and mutations occur, they are recorded directly into `admin_audit_logs`.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/75 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold uppercase">
                <tr>
                  <th className="py-3 px-4">Admin Actor</th>
                  <th className="py-3 px-4">Action Taken</th>
                  <th className="py-3 px-4">Affected Target</th>
                  <th className="py-3 px-4">Source IP</th>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4 text-right">Severity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-slate-100">
                      {log.admin_name}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200">
                      {log.action}
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400 font-mono text-[11px]">
                      {log.target}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                      {log.ip_address || "Internal"}
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      {formatDateTime(log.timestamp)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Badge
                        variant={
                          log.severity === "critical"
                            ? "danger"
                            : log.severity === "warning"
                            ? "warning"
                            : "default"
                        }
                      >
                        {log.severity}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
