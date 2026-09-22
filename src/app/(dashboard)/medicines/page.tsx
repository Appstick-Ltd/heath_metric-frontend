"use client";

import * as React from "react";
import {
  Pill,
  Plus,
  Search,
  Clock,
  AlertTriangle,
  RefreshCw,
  Inbox,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { DataService } from "@/lib/data-service";
import { MasterMedicinePreset } from "@/types/database";

export default function MedicinesPage() {
  const [medicines, setMedicines] = React.useState<MasterMedicinePreset[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [isAddOpen, setIsAddOpen] = React.useState(false);

  const [newMed, setNewMed] = React.useState<Partial<MasterMedicinePreset>>({
    name: "",
    generic_name: "",
    category: "Cardiovascular",
    default_dosage: "500 mg",
    dosage_type: "tablet",
    standard_frequency: "Once Daily",
    default_times: ["08:00 AM"],
    contraindications: [],
    notes: "",
  });

  const fetchMedicines = async () => {
    setLoading(true);
    try {
      const data = await DataService.getMedicines();
      setMedicines(data);
    } catch (e) {
      console.warn(e);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchMedicines();
  }, []);

  const handleSaveMedicine = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMed.name) return;

    setSaving(true);
    const med: Omit<MasterMedicinePreset, "id" | "created_at"> = {
      name: newMed.name!,
      generic_name: newMed.generic_name || newMed.name!,
      category: newMed.category || "General",
      default_dosage: newMed.default_dosage || "500 mg",
      dosage_type: (newMed.dosage_type as any) || "tablet",
      standard_frequency: newMed.standard_frequency || "Once Daily",
      default_times: ["09:00 AM"],
      notes: newMed.notes || "Administered as prescribed.",
    };

    const saved = await DataService.addMedicinePreset(med);
    setSaving(false);

    if (saved) {
      setMedicines([saved, ...medicines]);
      setIsAddOpen(false);
      alert(`"${saved.name}" has been registered into Supabase \`master_medicines\`!`);
    } else {
      alert("Could not insert: Please ensure dashboard_schema.sql has been run in Supabase SQL editor.");
    }
  };

  const filteredMeds = medicines.filter(
    (m) =>
      m.name?.toLowerCase().includes(search.toLowerCase()) ||
      m.generic_name?.toLowerCase().includes(search.toLowerCase()) ||
      m.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Medicine Presets & Knowledgebase
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time drug presets querying Supabase <code className="text-emerald-600">master_medicines</code> table
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchMedicines}>
            <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button size="sm" onClick={() => setIsAddOpen(true)}>
            <Plus className="h-4 w-4 mr-1.5" />
            Add Medicine Preset
          </Button>
        </div>
      </div>

      {/* Search Toolbar */}
      <Card className="p-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search brand name, generic formula, or drug class..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 text-xs"
          />
        </div>
      </Card>

      {/* Medicines Table */}
      <Card className="overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-xs text-slate-400 flex flex-col items-center justify-center gap-2">
            <div className="h-7 w-7 rounded-full border-2 border-emerald-600 border-t-transparent animate-spin" />
            <span>Querying Supabase `master_medicines` table...</span>
          </div>
        ) : filteredMeds.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center gap-3">
            <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400">
              <Inbox className="h-8 w-8" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-200">
                No Medicine Presets in Database
              </h3>
              <p className="text-xs text-slate-500 max-w-md mt-1">
                Click &quot;Add Medicine Preset&quot; to insert drugs, or run <code className="text-emerald-600">dashboard_schema.sql</code> in Supabase SQL editor to seed standard antidiabetics and antihypertensives.
              </p>
            </div>
            <Button size="sm" onClick={() => setIsAddOpen(true)} className="mt-2">
              <Plus className="h-4 w-4 mr-1.5" />
              Add First Medicine
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/75 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold uppercase">
                <tr>
                  <th className="py-3.5 px-4">Medicine & Class</th>
                  <th className="py-3.5 px-4">Generic Formula</th>
                  <th className="py-3.5 px-4">Default Dosage</th>
                  <th className="py-3.5 px-4">Frequency & Timing</th>
                  <th className="py-3.5 px-4">Clinical Guidance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredMeds.map((med) => (
                  <tr key={med.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 shrink-0">
                          <Pill className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-slate-100">
                            {med.name}
                          </p>
                          <Badge variant="outline" className="text-[10px] mt-0.5">
                            {med.category}
                          </Badge>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300 font-medium">
                      {med.generic_name}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-900 dark:text-slate-100">
                        {med.default_dosage}
                      </span>
                      <span className="text-slate-400 block text-[11px] capitalize">
                        {med.dosage_type}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-medium text-slate-800 dark:text-slate-200">
                        {med.standard_frequency}
                      </p>
                      <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                        <Clock className="h-3 w-3 text-slate-400" />
                        <span>{(med.default_times || []).join(", ") || "Scheduled"}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="text-slate-600 dark:text-slate-300 truncate">
                        {med.notes || "Standard dosage protocol."}
                      </p>
                      {med.contraindications && med.contraindications.length > 0 && (
                        <span className="text-[10px] text-rose-600 dark:text-rose-400 flex items-center gap-1 mt-0.5">
                          <AlertTriangle className="h-3 w-3" />
                          Avoid: {med.contraindications.join(", ")}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Add Master Medicine Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Register Medicine into Supabase"
        description="This inserts directly into `master_medicines` for mobile app auto-complete"
        maxWidth="md"
      >
        <form onSubmit={handleSaveMedicine} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 dark:text-slate-300">Medicine Trade Name</label>
            <Input
              required
              placeholder="e.g. Glucophage / Metformin"
              value={newMed.name}
              onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Generic Name</label>
              <Input
                placeholder="e.g. Metformin Hydrochloride"
                value={newMed.generic_name}
                onChange={(e) => setNewMed({ ...newMed, generic_name: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Drug Class</label>
              <Input
                placeholder="e.g. Antidiabetic"
                value={newMed.category}
                onChange={(e) => setNewMed({ ...newMed, category: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Standard Dosage</label>
              <Input
                placeholder="e.g. 500 mg"
                value={newMed.default_dosage}
                onChange={(e) => setNewMed({ ...newMed, default_dosage: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Dosage Form</label>
              <select
                value={newMed.dosage_type}
                onChange={(e) => setNewMed({ ...newMed, dosage_type: e.target.value as any })}
                className="w-full h-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 text-xs"
              >
                <option value="tablet">Tablet</option>
                <option value="capsule">Capsule</option>
                <option value="syrup">Syrup</option>
                <option value="injection">Injection</option>
                <option value="inhaler">Inhaler</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700 dark:text-slate-300">Frequency Schedule</label>
            <Input
              placeholder="e.g. Twice Daily"
              value={newMed.standard_frequency}
              onChange={(e) => setNewMed({ ...newMed, standard_frequency: e.target.value })}
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700 dark:text-slate-300">Usage Instructions</label>
            <Input
              placeholder="Take with meals..."
              value={newMed.notes}
              onChange={(e) => setNewMed({ ...newMed, notes: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="ghost" size="sm" onClick={() => setIsAddOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={saving}>
              {saving ? "Inserting to Supabase..." : "Save to Database"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
