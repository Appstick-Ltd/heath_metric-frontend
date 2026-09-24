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
  Users,
  Inbox,
  RefreshCw,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { DataService } from "@/lib/data-service";
import { Profile, FamilyMember, BloodSugarRecord, BloodPressureRecord, WeightRecord, Subscription } from "@/types/database";
import { formatDate, formatDateTime, formatTimeAgo, getAvatarUrl } from "@/lib/utils";

function UserAvatar({
  name,
  photoUrl,
  size = "md",
  className = "",
}: {
  name?: string;
  photoUrl?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const [imgError, setImgError] = React.useState(false);

  React.useEffect(() => {
    setImgError(false);
  }, [photoUrl]);

  const sizeClasses = {
    sm: "h-8 w-8 text-[11px]",
    md: "h-10 w-10 text-xs",
    lg: "h-16 w-16 text-lg",
  }[size];

  const initials = (name || "U")
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "U";

  const avatarSrc = getAvatarUrl(photoUrl);
  const hasValidPhoto = Boolean(avatarSrc && avatarSrc.length > 0 && !imgError);

  if (hasValidPhoto) {
    return (
      <div
        className={`relative ${sizeClasses} rounded-full p-[2px] bg-gradient-to-tr from-teal-500 to-sky-500 shadow-sm shrink-0 ${className}`}
      >
        <img
          src={avatarSrc}
          alt={name || "User"}
          referrerPolicy="no-referrer"
          crossOrigin="anonymous"
          className="h-full w-full rounded-full object-cover bg-white dark:bg-slate-800"
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  return (
    <div
      className={`${sizeClasses} rounded-full bg-gradient-to-tr from-emerald-100 to-teal-100 dark:from-emerald-950/70 dark:to-teal-950/70 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold shrink-0 border border-emerald-500/20 shadow-xs ${className}`}
    >
      {initials}
    </div>
  );
}

export default function UsersPage() {
  const [users, setUsers] = React.useState<Profile[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [conditionFilter, setConditionFilter] = React.useState("ALL");
  const [selectedUser, setSelectedUser] = React.useState<Profile | null>(null);
  const [userDetails, setUserDetails] = React.useState<{
    familyMembers: FamilyMember[];
    sugarRecords: BloodSugarRecord[];
    bpRecords: BloodPressureRecord[];
    weightRecords: WeightRecord[];
    subscription: Subscription | undefined;
  } | null>(null);
  const [isDetailOpen, setIsDetailOpen] = React.useState(false);
  const [isUpgradeOpen, setIsUpgradeOpen] = React.useState(false);

  // Delete state
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
  const [deleteUser, setDeleteUser] = React.useState<Profile | null>(null);
  const [deleteConfirmText, setDeleteConfirmText] = React.useState("");
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [deleteResult, setDeleteResult] = React.useState<{ success: boolean; message: string } | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await DataService.getProfiles();
      setUsers(data);
    } catch (e) {
      console.warn(e);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchUsers();
  }, []);

  const openUserDetail = async (user: Profile) => {
    setSelectedUser(user);
    const details = await DataService.getProfileDetails(user.id);
    setUserDetails(details);
    setIsDetailOpen(true);
  };

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
    } catch (e: any) {
      setDeleteResult({ success: false, message: e?.message || "Unexpected error occurred." });
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.blood_group && u.blood_group.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCondition =
      conditionFilter === "ALL" ||
      (u.conditions && u.conditions.some((c) => c.toLowerCase().includes(conditionFilter.toLowerCase())));

    return matchesSearch && matchesCondition;
  });

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
              className="pl-9 text-xs"
            />
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
          <div className="p-12 text-center text-xs text-slate-400 flex flex-col items-center justify-center gap-2">
            <div className="h-7 w-7 rounded-full border-2 border-emerald-600 border-t-transparent animate-spin" />
            <span>Querying Supabase `profiles` table...</span>
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
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/75 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Patient Profile</th>
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
                {filteredUsers.map((user) => {
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
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-slate-100">
                              {user.name || "Unnamed User"}
                            </p>
                            <p className="text-[11px] text-slate-400 font-mono">
                              {user.id}
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
        )}
      </Card>

      {/* User Detail Drawer Modal */}
      {selectedUser && userDetails && (
        <Modal
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          title={`Patient Record: ${selectedUser.name || "User"}`}
          description={`Registered ID: ${selectedUser.id} • ${selectedUser.gender || "N/A"}, ${selectedUser.age || 0} yrs`}
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
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5 truncate">
                  ID: {selectedUser.id}
                </p>
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
                        </div>
                      </div>
                      <Badge variant="outline">{fam.relationship}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sugar Records */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <HeartPulse className="h-4 w-4 text-rose-500" />
                <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                  Recent Blood Sugar Readings
                </h4>
              </div>
              {userDetails.sugarRecords.length === 0 ? (
                <p className="text-slate-400 italic">No sugar records in database yet.</p>
              ) : (
                <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
                  {userDetails.sugarRecords.map((s) => (
                    <div key={s.id} className="p-2.5 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                          {s.value} mg/dL
                        </span>
                        <span className="ml-2 text-slate-400 capitalize">({s.reading_type})</span>
                      </div>
                      <span className="text-[11px] text-slate-400">{formatDate(s.timestamp)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* BP Records */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-4 w-4 text-sky-500" />
                <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                  Recent Blood Pressure Readings
                </h4>
              </div>
              {userDetails.bpRecords.length === 0 ? (
                <p className="text-slate-400 italic">No BP records in database yet.</p>
              ) : (
                <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
                  {userDetails.bpRecords.map((bp) => (
                    <div key={bp.id} className="p-2.5 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                          {bp.systolic}/{bp.diastolic} mmHg
                        </span>
                        {bp.pulse && (
                          <span className="ml-2 text-slate-400">Pulse: {bp.pulse} bpm</span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400">{formatDate(bp.timestamp)}</span>
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
                { name: "Pro Monthly", price: "$5.99 / month", id: "monthly" },
                { name: "Pro Annual", price: "$49.99 / year", id: "annual" },
                { name: "Lifetime Health Pass", price: "$149.00 once", id: "lifetime" },
              ].map((tier) => (
                <button
                  key={tier.id}
                  onClick={async () => {
                    const ok = await DataService.updateSubscriptionPlan(selectedUser.id, tier.id as any);
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
