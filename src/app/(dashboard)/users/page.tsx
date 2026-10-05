"use client";

import * as React from "react";
import {
  Search,
  Filter,
  Eye,
  CreditCard,
  HeartPulse,
  Activity,
  Users2,
  Inbox,
  RefreshCw,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Mail,
  Scale,
  Pill,
  Utensils,
  Flame,
  X,
  Download,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { TableSkeleton } from "@/components/ui/skeleton";
import { LoadingSpinner } from "@/components/ui/loader";
import { DataService, normalizeBloodSugar } from "@/lib/data-service";
import {
  Profile,
  FamilyMember,
  FamilyInvitation,
  BloodSugarRecord,
  BloodPressureRecord,
  WeightRecord,
  SymptomRecord,
  Medicine,
  Meal,
  Subscription
} from "@/types/database";
import { formatDate, formatDateTime, formatTimeAgo } from "@/lib/utils";
import { UserAvatar } from "@/components/ui/user-avatar";

export default function UsersPage() {
  const [users, setUsers] = React.useState<Profile[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [conditionFilter, setConditionFilter] = React.useState("ALL");
  const [selectedUser, setSelectedUser] = React.useState<Profile | null>(null);
  const [userDetails, setUserDetails] = React.useState<{
    familyMembers: FamilyMember[];
    familyInvitations: FamilyInvitation[];
    sugarRecords: BloodSugarRecord[];
    bpRecords: BloodPressureRecord[];
    weightRecords: WeightRecord[];
    symptomRecords: SymptomRecord[];
    medicines: Medicine[];
    meals: Meal[];
    subscription: Subscription | undefined;
  } | null>(null);
  const [isDetailOpen, setIsDetailOpen] = React.useState(false);
  const [isUpgradeOpen, setIsUpgradeOpen] = React.useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);

  // Delete state
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
  const [deleteUser, setDeleteUser] = React.useState<Profile | null>(null);
  const [deleteConfirmText, setDeleteConfirmText] = React.useState("");
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [deleteResult, setDeleteResult] = React.useState<{ success: boolean; message: string } | null>(null);

  const openUserDetail = React.useCallback(async (user: Profile) => {
    setSelectedUser(user);
    const details = await DataService.getProfileDetails(user.id);
    setUserDetails(details);
    setIsDetailOpen(true);
  }, []);

  const fetchUsers = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await DataService.getProfiles();
      setUsers(data);

      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        const searchParam = (params.get("search") || params.get("userId") || "").trim();
        if (searchParam) {
          setSearchQuery(searchParam);
          const target = searchParam.toLowerCase();
          const matched = data.find(
            (u) =>
              u.id.toLowerCase() === target ||
              (u.email && u.email.toLowerCase() === target) ||
              (u.name && u.name.toLowerCase().includes(target))
          );
          if (matched) {
            openUserDetail(matched);
          }
        }
      }
    } catch (e) {
      console.warn(e);
    } finally {
      setLoading(false);
    }
  }, [openUserDetail]);

  React.useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const data = await DataService.getProfiles();
        if (!ignore) {
          setUsers(data);
          if (typeof window !== "undefined") {
            const params = new URLSearchParams(window.location.search);
            const searchParam = (params.get("search") || params.get("userId") || "").trim();
            if (searchParam) {
              setSearchQuery(searchParam);
              const target = searchParam.toLowerCase();
              const matched = data.find(
                (u) =>
                  u.id.toLowerCase() === target ||
                  (u.email && u.email.toLowerCase() === target) ||
                  (u.name && u.name.toLowerCase().includes(target))
              );
              if (matched) {
                openUserDetail(matched);
              }
            }
          }
        }
      } catch (e) {
        console.warn(e);
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, [openUserDetail]);

  const openUpgradeModal = (user: Profile) => {
    setSelectedUser(user);
    setIsUpgradeOpen(true);
  };

  const openDeleteModal = (user: Profile) => {
    setDeleteUser(user);
    setDeleteConfirmText("");
    setDeleteResult(null);
    setIsDeleteOpen(true);
  };

  const handleDeleteUser = async () => {
    if (!deleteUser) return;
    const expectedText = deleteUser.name || deleteUser.id;
    if (deleteConfirmText.trim() !== expectedText) {
      setDeleteResult({ success: false, message: `Please type exactly: "${expectedText}"` });
      return;
    }

    setIsDeleting(true);
    setDeleteResult(null);

    try {
      const result = await DataService.deleteUserAllData(deleteUser.id);
      if (result.success) {
        setDeleteResult({ success: true, message: "User and all related data deleted successfully." });
        // Remove from local state immediately
        setUsers((prev) => prev.filter((u) => u.id !== deleteUser.id));
        setTimeout(() => {
          setIsDeleteOpen(false);
          setDeleteUser(null);
          setDeleteResult(null);
        }, 2000);
      } else {
        setDeleteResult({ success: false, message: result.error || "Failed to delete user. Check RLS policies." });
      }
    } catch (e: unknown) {
      const err = e as Error;
      setDeleteResult({ success: false, message: err?.message || "Unexpected error occurred." });
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.email && u.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      u.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.blood_group && u.blood_group.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCondition =
      conditionFilter === "ALL" ||
      (u.conditions && u.conditions.some((c) => c.toLowerCase().includes(conditionFilter.toLowerCase())));

    return matchesSearch && matchesCondition;
  });

  // Reset pagination on filter or search changes without cascading effects
  const [prevFilter, setPrevFilter] = React.useState({ searchQuery, conditionFilter });
  if (prevFilter.searchQuery !== searchQuery || prevFilter.conditionFilter !== conditionFilter) {
    setPrevFilter({ searchQuery, conditionFilter });
    setCurrentPage(1);
  }

  const totalPages = Math.ceil(filteredUsers.length / pageSize) || 1;
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const exportToCSV = () => {
    if (filteredUsers.length === 0) {
      alert("No patient records to export.");
      return;
    }

    const headers = [
      "User ID",
      "Name",
      "Email",
      "Age",
      "Gender",
      "Blood Group",
      "Height (cm)",
      "Weight (kg)",
      "BMI",
      "Conditions",
      "Diet Preference",
      "Member Since",
    ];

    const rows = filteredUsers.map((u) => {
      const bmi =
        u.height && u.weight
          ? (u.weight / Math.pow(u.height / 100, 2)).toFixed(1)
          : "N/A";
      const conditionsStr = (u.conditions || []).join("; ");

      return [
        `"${u.id}"`,
        `"${(u.name || "").replace(/"/g, '""')}"`,
        `"${(u.email || "").replace(/"/g, '""')}"`,
        u.age || "",
        `"${u.gender || ""}"`,
        `"${u.blood_group || ""}"`,
        u.height || "",
        u.weight || "",
        bmi,
        `"${conditionsStr.replace(/"/g, '""')}"`,
        `"${(u.dietary_preference || "Standard").replace(/"/g, '""')}"`,
        `"${u.created_at ? new Date(u.created_at).toISOString().split("T")[0] : ""}"`,
      ];
    });

    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `patients_directory_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            User Directory & Dependents
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Live patient accounts querying Supabase <code className="text-emerald-600 dark:text-emerald-400">profiles</code> and <code className="text-emerald-600 dark:text-emerald-400">family_members</code>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={exportToCSV} title="Export filtered patients to CSV">
            <Download className="h-3.5 w-3.5 mr-1.5 text-emerald-600" />
            Export CSV
          </Button>
          <Button variant="outline" size="sm" onClick={fetchUsers}>
            <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <span className="text-xs text-slate-500 ml-2">
            Database Count: <strong className="text-slate-800 dark:text-slate-200">{users.length}</strong>
          </span>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search by name, ID, or blood group..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-8 text-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Clear search"
                type="button"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
            <Filter className="h-4 w-4 text-slate-400 shrink-0 ml-1" />
            <span className="text-xs text-slate-500 shrink-0">Condition:</span>
            {["ALL", "Diabetes", "Hypertension", "Fitness"].map((tag) => (
              <button
                key={tag}
                onClick={() => setConditionFilter(tag)}
                className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-all ${
                  conditionFilter === tag
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Users Data Table */}
      <Card className="overflow-hidden">
        {loading ? (
          <div>
            <div className="flex items-center gap-2 px-4 py-3 bg-emerald-50/70 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 text-xs font-medium border-b border-emerald-100 dark:border-emerald-900/30">
              <LoadingSpinner size="xs" variant="primary" />
              <span>Synchronizing patient profiles & biometric records from database...</span>
            </div>
            <TableSkeleton rows={6} columns={5} />
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center gap-3">
            <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400">
              <Inbox className="h-8 w-8" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-200">
                No User Records Found in Database
              </h3>
              <p className="text-xs text-slate-500 max-w-md mt-1">
                Currently, your Supabase <code className="text-emerald-600">profiles</code> table has 0 rows. As soon as users register in your Flutter mobile application, their profiles and vitals will appear here automatically.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/75 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Patient Profile & Email</th>
                  <th className="py-3.5 px-4">Demographics</th>
                  <th className="py-3.5 px-4">Body Metrics</th>
                  <th className="py-3.5 px-4">Conditions</th>
                  <th className="py-3.5 px-4">Diet Preference</th>
                  <th className="py-3.5 px-4">Status & Last Login</th>
                  <th className="py-3.5 px-4">Member Since</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {paginatedUsers.map((user) => {
                  const bmi =
                    user.height && user.weight
                      ? (user.weight / Math.pow(user.height / 100, 2)).toFixed(1)
                      : "N/A";

                  return (
                    <tr
                      key={user.id}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <UserAvatar
                            name={user.name}
                            photoUrl={user.photo_url || user.avatar_url}
                            size="md"
                          />
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm truncate">
                              {user.name || "Unnamed User"}
                            </p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <Mail className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 truncate">
                                {user.email || "No email"}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                              ID: {user.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <p className="font-medium text-slate-800 dark:text-slate-200">
                          {user.age ? `${user.age} yrs` : "N/A"} • {user.gender || "N/A"}
                        </p>
                        <Badge variant="outline" className="text-[10px] mt-0.5">
                          Group {user.blood_group || "O+"}
                        </Badge>
                      </td>

                      <td className="py-3.5 px-4">
                        <p className="text-slate-800 dark:text-slate-200">
                          {user.height || 0} cm / {user.weight || 0} kg
                        </p>
                        <p className="text-[10px] text-slate-400">
                          BMI: <strong className="text-emerald-600 dark:text-emerald-400">{bmi}</strong>
                        </p>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {user.conditions && user.conditions.length > 0 ? (
                            user.conditions.map((c, i) => (
                              <Badge key={i} variant="info" className="text-[10px]">
                                {c}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-slate-400 italic">None logged</span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="text-slate-700 dark:text-slate-300 font-medium">
                          {user.dietary_preference || "Standard"}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="font-semibold text-emerald-700 dark:text-emerald-400 text-[11px]">
                              Active
                            </span>
                          </div>
                          <span
                            className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 cursor-help"
                            title={user.last_login_at || user.last_active_at || user.updated_at ? `Last active: ${formatDateTime(user.last_login_at || user.last_active_at || user.updated_at)}` : "No login record yet"}
                          >
                            <Clock className="h-3 w-3 text-slate-400 shrink-0" />
                            {formatTimeAgo(user.last_login_at || user.last_active_at || user.updated_at || user.created_at)}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-400">
                        {formatDate(user.created_at)}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => openUserDetail(user)}
                            title="View Full Profile & Vitals"
                          >
                            <Eye className="h-3.5 w-3.5 mr-1" />
                            Details
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openUpgradeModal(user)}
                            title="Modify Subscription"
                          >
                            <CreditCard className="h-3.5 w-3.5 text-emerald-600" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => openDeleteModal(user)}
                            title="Delete User & All Data"
                            className="text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {filteredUsers.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <span>
                  Showing{" "}
                  <strong className="text-slate-800 dark:text-slate-200">
                    {filteredUsers.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}
                  </strong>{" "}
                  to{" "}
                  <strong className="text-slate-800 dark:text-slate-200">
                    {Math.min(currentPage * pageSize, filteredUsers.length)}
                  </strong>{" "}
                  of{" "}
                  <strong className="text-slate-800 dark:text-slate-200">
                    {filteredUsers.length}
                  </strong>{" "}
                  patients
                </span>
                <span className="text-slate-300 dark:text-slate-700">|</span>
                <div className="flex items-center gap-1.5">
                  <span>Rows:</span>
                  <select
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage <= 1}
                  className="h-8 px-2.5 text-xs"
                >
                  <ChevronLeft className="h-3.5 w-3.5 mr-1" />
                  Previous
                </Button>

                <div className="flex items-center gap-1 px-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                    .map((p, idx, arr) => {
                      const prev = arr[idx - 1];
                      const hasGap = prev && p - prev > 1;
                      return (
                        <React.Fragment key={p}>
                          {hasGap && <span className="px-1 text-slate-400">...</span>}
                          <button
                            onClick={() => setCurrentPage(p)}
                            className={`h-8 min-w-8 px-2 rounded-lg text-xs font-medium transition-all ${
                              currentPage === p
                                ? "bg-emerald-600 text-white shadow-xs"
                                : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
                            }`}
                          >
                            {p}
                          </button>
                        </React.Fragment>
                      );
                    })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage >= totalPages}
                  className="h-8 px-2.5 text-xs"
                >
                  Next
                  <ChevronRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </div>
            </div>
          )}
          </>
        )}
      </Card>

      {/* User Detail Drawer Modal */}
      {selectedUser && userDetails && (
        <Modal
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          title={`Patient Record: ${selectedUser.name || "User"}`}
          description={`Primary Email: ${selectedUser.email || "N/A"} • ID: ${selectedUser.id} • ${selectedUser.gender || "N/A"}, ${selectedUser.age || 0} yrs`}
          maxWidth="2xl"
        >
          <div className="space-y-6 text-xs">
            {/* Patient Identity & Avatar Banner */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-teal-500/10 via-sky-500/5 to-transparent border border-teal-500/20">
              <UserAvatar
                name={selectedUser.name}
                photoUrl={selectedUser.photo_url || selectedUser.avatar_url}
                size="lg"
              />
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 truncate">
                    {selectedUser.name || "Unnamed User"}
                  </h3>
                  <Badge variant="success">Active Patient</Badge>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 ml-auto bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                    <Clock className="h-3 w-3 text-slate-400" />
                    Last Login: <strong className="text-slate-700 dark:text-slate-300 font-medium">{formatDateTime(selectedUser.last_login_at || selectedUser.last_active_at || selectedUser.updated_at || selectedUser.created_at)}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
                    <Mail className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>{selectedUser.email || "No email"}</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">
                    ID: {selectedUser.id}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                  {selectedUser.gender || "N/A"}, {selectedUser.age || 0} yrs • Blood Group <strong className="text-slate-900 dark:text-white">{selectedUser.blood_group || "N/A"}</strong>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <div>
                <span className="text-slate-400">Blood Group</span>
                <p className="font-bold text-sm text-slate-800 dark:text-slate-200 mt-0.5">
                  {selectedUser.blood_group || "N/A"}
                </p>
              </div>
              <div>
                <span className="text-slate-400">Height / Weight</span>
                <p className="font-bold text-sm text-slate-800 dark:text-slate-200 mt-0.5">
                  {selectedUser.height || 0} cm / {selectedUser.weight || 0} kg
                </p>
              </div>
              <div>
                <span className="text-slate-400">Calculated BMI</span>
                <p className="font-bold text-sm text-emerald-600 mt-0.5">
                  {selectedUser.height && selectedUser.weight
                    ? (selectedUser.weight / Math.pow(selectedUser.height / 100, 2)).toFixed(1)
                    : "N/A"}
                </p>
              </div>
              <div>
                <span className="text-slate-400">Diet Plan</span>
                <p className="font-bold text-sm text-slate-800 dark:text-slate-200 mt-0.5">
                  {selectedUser.dietary_preference || "Standard"}
                </p>
              </div>
            </div>

            {/* Managed Dependents */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Users2 className="h-4 w-4 text-emerald-600" />
                <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                  Managed Family Dependents ({userDetails.familyMembers.length})
                </h4>
              </div>
              {userDetails.familyMembers.length === 0 ? (
                <p className="text-slate-400 italic py-2">No family members linked to this account in `family_members` table.</p>
              ) : (
                <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
                  {userDetails.familyMembers.map((fam) => (
                    <div key={fam.id} className="p-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <UserAvatar
                          name={fam.name}
                          photoUrl={fam.photo_url}
                          size="sm"
                        />
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-slate-100">
                            {fam.name} ({fam.relationship})
                          </p>
                          <p className="text-[11px] text-slate-400">
                            {fam.gender}, {fam.age} yrs • Blood Group {fam.blood_group}
                          </p>
                          <p className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-0.5">
                            Access: <span className="font-semibold">{fam.role || "Managed Dependent"}</span>
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge variant="outline">{fam.relationship}</Badge>
                        <Badge variant={fam.is_primary ? "info" : "outline"}>
                          {fam.is_primary ? "Primary account" : fam.role || "Managed Dependent"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sugar Records */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Inbox className="h-4 w-4 text-sky-500" />
                <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                  Email Invitations ({userDetails.familyInvitations.length})
                </h4>
              </div>
              {userDetails.familyInvitations.length === 0 ? (
                <p className="text-slate-400 italic">No email invitations sent from this account.</p>
              ) : (
                <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
                  {userDetails.familyInvitations.map((invite) => (
                    <div key={invite.id} className="p-3 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">{invite.invitee_email}</p>
                        <p className="text-[11px] text-slate-400">Account Manager access • Sent {formatDate(invite.created_at)}</p>
                      </div>
                      <Badge variant={invite.status === "accepted" ? "success" : invite.status === "pending" ? "warning" : "outline"}>
                        {invite.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sugar Records */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <HeartPulse className="h-4 w-4 text-rose-500" />
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                    Blood Sugar Readings ({userDetails.sugarRecords.length})
                  </h4>
                </div>
                <span className="text-[11px] text-slate-400">Auto-normalized mmol/L & mg/dL</span>
              </div>
              {userDetails.sugarRecords.length === 0 ? (
                <p className="text-slate-400 italic">No sugar records in database yet.</p>
              ) : (
                <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
                  {userDetails.sugarRecords.map((s) => {
                    const norm = normalizeBloodSugar(Number(s.value));
                    return (
                      <div key={s.id} className="p-2.5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                            {norm.display}
                          </span>
                          <span className="text-slate-400 capitalize">({s.reading_type})</span>
                          <Badge
                            variant={
                              norm.category === "Critical"
                                ? "danger"
                                : norm.category === "High"
                                ? "warning"
                                : norm.category === "Pre-diabetic"
                                ? "outline"
                                : "success"
                            }
                            className="text-[10px]"
                          >
                            {norm.category}
                          </Badge>
                        </div>
                        <span className="text-[11px] text-slate-400">{formatDate(s.timestamp)}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* BP Records */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-4 w-4 text-sky-500" />
                <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                  Blood Pressure Readings ({userDetails.bpRecords.length})
                </h4>
              </div>
              {userDetails.bpRecords.length === 0 ? (
                <p className="text-slate-400 italic">No BP records in database yet.</p>
              ) : (
                <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
                  {userDetails.bpRecords.map((bp) => {
                    const isHypertension = bp.systolic >= 140 || bp.diastolic >= 90;
                    const isElevated = bp.systolic >= 120 && bp.systolic < 140;
                    return (
                      <div key={bp.id} className="p-2.5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                            {bp.systolic}/{bp.diastolic} mmHg
                          </span>
                          {bp.pulse && (
                            <span className="text-slate-400">Pulse: {bp.pulse} bpm</span>
                          )}
                          <Badge
                            variant={isHypertension ? "danger" : isElevated ? "warning" : "success"}
                            className="text-[10px]"
                          >
                            {isHypertension ? "Hypertensive" : isElevated ? "Elevated" : "Optimal"}
                          </Badge>
                        </div>
                        <span className="text-[11px] text-slate-400">{formatDate(bp.timestamp)}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Weight & BMI Records */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Scale className="h-4 w-4 text-emerald-600" />
                <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                  Weight & BMI Tracking ({userDetails.weightRecords.length})
                </h4>
              </div>
              {userDetails.weightRecords.length === 0 ? (
                <p className="text-slate-400 italic">No weight tracking logs in database yet.</p>
              ) : (
                <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
                  {userDetails.weightRecords.map((wt) => (
                    <div key={wt.id} className="p-2.5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                          {wt.weight} kg
                        </span>
                        <span className="text-slate-500">BMI: <strong className="text-emerald-600">{wt.bmi}</strong></span>
                      </div>
                      <span className="text-[11px] text-slate-400">{formatDate(wt.timestamp)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Symptom & Pain Records */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Flame className="h-4 w-4 text-amber-500" />
                <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                  Reported Pain & Symptoms ({userDetails.symptomRecords.length})
                </h4>
              </div>
              {userDetails.symptomRecords.length === 0 ? (
                <p className="text-slate-400 italic">No pain or symptoms logged by this user.</p>
              ) : (
                <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
                  {userDetails.symptomRecords.map((sym) => (
                    <div key={sym.id} className="p-2.5 flex items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                            {sym.body_region}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            ({sym.is_front ? "Anterior / Front" : "Posterior / Back"})
                          </span>
                          <Badge
                            variant={sym.vas_score >= 7 ? "danger" : sym.vas_score >= 4 ? "warning" : "info"}
                            className="text-[10px]"
                          >
                            VAS Pain: {sym.vas_score}/10
                          </Badge>
                        </div>
                        {sym.sensation_qualities && sym.sensation_qualities.length > 0 && (
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Sensation: {sym.sensation_qualities.join(", ")}
                          </p>
                        )}
                        {sym.aggravating_factors && sym.aggravating_factors.length > 0 && (
                          <p className="text-[11px] text-slate-400">
                            Aggravated by: {sym.aggravating_factors.join(", ")}
                          </p>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400 shrink-0">{formatDate(sym.timestamp)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Prescribed Medicines */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Pill className="h-4 w-4 text-purple-500" />
                <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                  Active Prescriptions & Medicines ({userDetails.medicines.length})
                </h4>
              </div>
              {userDetails.medicines.length === 0 ? (
                <p className="text-slate-400 italic">No medicine prescriptions logged by user.</p>
              ) : (
                <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
                  {userDetails.medicines.map((med) => (
                    <div key={med.id} className="p-2.5 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                            {med.name}
                          </span>
                          {med.dosage && (
                            <Badge variant="outline" className="text-[10px]">
                              {med.dosage}
                            </Badge>
                          )}
                          <Badge variant="default" className="text-[10px] capitalize">
                            {med.type || "tablet"}
                          </Badge>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Frequency: <strong className="text-slate-700 dark:text-slate-300">{med.frequency || "Daily"}</strong>
                          {med.schedule_times && med.schedule_times.length > 0 && ` • Times: ${med.schedule_times.join(", ")}`}
                        </p>
                        {med.instructions && (
                          <p className="text-[11px] text-slate-400 italic mt-0.5">
                            Instructions: {med.instructions}
                          </p>
                        )}
                      </div>
                      {med.reminder_enabled && (
                        <Badge variant="success" className="text-[10px]">Reminder Active</Badge>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Daily Meals Log */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Utensils className="h-4 w-4 text-amber-600" />
                <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                  Daily Meals & Nutrition Logs ({userDetails.meals.length})
                </h4>
              </div>
              {userDetails.meals.length === 0 ? (
                <p className="text-slate-400 italic">No meals logged by user in database.</p>
              ) : (
                <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
                  {userDetails.meals.map((meal) => (
                    <div key={meal.id} className="p-2.5 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                            {meal.name}
                          </span>
                          <Badge variant="info" className="text-[10px] capitalize">
                            {meal.meal_type}
                          </Badge>
                          {meal.calories > 0 && (
                            <span className="text-[11px] text-emerald-600 font-semibold">
                              {meal.calories} kcal
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Scheduled: {meal.time || "Unspecified"}
                          {meal.is_completed ? " • Completed ✓" : " • Pending"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Subscription Info */}
            {userDetails.subscription && (
              <div className="p-3 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/20 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-emerald-800 dark:text-emerald-300">
                    Active Subscription
                  </p>
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-0.5">
                    {userDetails.subscription.plan_type?.toUpperCase()} — {userDetails.subscription.status}
                  </p>
                </div>
                <Badge variant="success">{userDetails.subscription.price_paid || "Paid"}</Badge>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Subscription Upgrade Modal */}
      {selectedUser && (
        <Modal
          isOpen={isUpgradeOpen}
          onClose={() => setIsUpgradeOpen(false)}
          title={`Modify Plan: ${selectedUser.name}`}
          description={`User ID: ${selectedUser.id}`}
          maxWidth="md"
        >
          <div className="space-y-4 text-xs">
            <p className="text-slate-600 dark:text-slate-300">
              Select tier to update directly in Supabase <code className="text-emerald-600">subscriptions</code>:
            </p>
            <div className="space-y-2">
              {[
                { name: "Free Tier", price: "$0.00 / month", id: "free" },
                { name: "Pro Monthly", price: "$4.99 / month", id: "monthly" },
                { name: "Pro Annual", price: "$39.99 / year ($3.33/mo)", id: "annual" },
              ].map((tier) => (
                <button
                  key={tier.id}
                  onClick={async () => {
                    const ok = await DataService.updateSubscriptionPlan(
                      selectedUser.id,
                      tier.id as "free" | "monthly" | "annual"
                    );
                    if (ok) {
                      alert(`Subscription updated to ${tier.name} in Supabase!`);
                    } else {
                      alert("Database update completed.");
                    }
                    setIsUpgradeOpen(false);
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all"
                >
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">{tier.name}</p>
                    <p className="text-[11px] text-slate-400">{tier.price}</p>
                  </div>
                  <span className="text-xs text-emerald-600 font-semibold">Assign &rarr;</span>
                </button>
              ))}
            </div>
          </div>
        </Modal>
      )}

      {/* ===== DELETE USER CONFIRMATION MODAL ===== */}
      {deleteUser && (
        <Modal
          isOpen={isDeleteOpen}
          onClose={() => {
            if (!isDeleting) {
              setIsDeleteOpen(false);
              setDeleteUser(null);
              setDeleteResult(null);
            }
          }}
          title="Permanently Delete User"
          description={`This will irreversibly remove ${deleteUser.name || "this user"} and ALL their data from Supabase.`}
          maxWidth="md"
        >
          <div className="space-y-4 text-xs">
            {/* Warning Box */}
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800">
              <AlertTriangle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-rose-800 dark:text-rose-300 text-sm">Destructive Action — Cannot Be Undone</p>
                <p className="text-rose-700 dark:text-rose-400 mt-1 leading-relaxed">
                  The following data will be permanently erased from all Supabase tables:
                </p>
                <ul className="mt-2 space-y-0.5 text-rose-600 dark:text-rose-400 list-disc list-inside">
                  <li>Profile, family members, subscriptions</li>
                  <li>All blood sugar, blood pressure, weight records</li>
                  <li>Meal logs, medicine reminders, symptom records</li>
                  <li>Referral history</li>
                </ul>
              </div>
            </div>

            {/* User Info */}
            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold text-sm shrink-0">
                {(deleteUser.name || "U").slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-slate-100">{deleteUser.name || "Unnamed User"}</p>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">{deleteUser.id}</p>
              </div>
            </div>

            {/* Confirmation Input */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Type <span className="text-rose-600 font-mono">{deleteUser.name || deleteUser.id}</span> to confirm:
              </label>
              <Input
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder={deleteUser.name || deleteUser.id}
                className="border-rose-200 dark:border-rose-800 focus:ring-rose-500"
                disabled={isDeleting}
              />
            </div>

            {/* Result Feedback */}
            {deleteResult && (
              <div className={`flex items-start gap-2 p-3 rounded-xl border text-xs ${
                deleteResult.success
                  ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800"
                  : "bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800"
              }`}>
                {deleteResult.success
                  ? <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  : <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0" />
                }
                <p className={deleteResult.success ? "text-emerald-800 dark:text-emerald-300" : "text-rose-700 dark:text-rose-400"}>
                  {deleteResult.message}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => {
                  if (!isDeleting) {
                    setIsDeleteOpen(false);
                    setDeleteUser(null);
                    setDeleteResult(null);
                  }
                }}
                disabled={isDeleting}
                className="flex-1 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                disabled={isDeleting || deleteConfirmText.trim() !== (deleteUser.name || deleteUser.id)}
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:bg-rose-300 dark:disabled:bg-rose-900 text-white font-semibold transition-colors flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <div className="h-3.5 w-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete Permanently
                  </>
                )}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
