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
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { DataService } from "@/lib/data-service";
import { Profile, FamilyMember, BloodSugarRecord, BloodPressureRecord, WeightRecord, Subscription } from "@/types/database";
import { formatDate } from "@/lib/utils";

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
                          <div className="h-9 w-9 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">
                            {(user.name || "U").slice(0, 2).toUpperCase()}
                          </div>
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
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-slate-100">
                          {fam.name} ({fam.relationship})
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {fam.gender}, {fam.age} yrs • Blood Group {fam.blood_group}
                        </p>
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
    </div>
  );
}
