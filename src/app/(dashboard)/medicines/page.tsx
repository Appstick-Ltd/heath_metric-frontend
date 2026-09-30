"use client";

import * as React from "react";
import {
  Pill,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Edit2,
  Trash2,
  RefreshCw,
  Inbox,
  AlertTriangle,
  Clock,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { TableSkeleton } from "@/components/ui/skeleton";
import { LoadingSpinner } from "@/components/ui/loader";
import { DataService } from "@/lib/data-service";
import { MasterMedicinePreset } from "@/types/database";

export default function MasterMedicinesPage() {
  const [medicines, setMedicines] = React.useState<MasterMedicinePreset[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingMed, setEditingMed] = React.useState<MasterMedicinePreset | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);

  // Form State
  const [name, setName] = React.useState("");
  const [genericName, setGenericName] = React.useState("");
  const [category, setCategory] = React.useState("Antidiabetic (Biguanide)");
  const [defaultDosage, setDefaultDosage] = React.useState("500 mg");
  const [dosageType, setDosageType] = React.useState<"tablet" | "capsule" | "syrup" | "injection" | "inhaler">("tablet");
  const [standardFrequency, setStandardFrequency] = React.useState("Once Daily");
  const [defaultTimes, setDefaultTimes] = React.useState("08:00 AM");
  const [contraindications, setContraindications] = React.useState("");
  const [notes, setNotes] = React.useState("");

  const fetchMedicines = async () => {
    setLoading(true);
    try {
      const data = await DataService.getMasterMedicines();
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

  const openCreateModal = () => {
    setEditingMed(null);
    setName("");
    setGenericName("");
    setCategory("General");
    setDefaultDosage("500 mg");
    setDosageType("tablet");
    setStandardFrequency("Once Daily");
    setDefaultTimes("08:00 AM");
    setContraindications("");
    setNotes("");
    setIsModalOpen(true);
  };

  const openEditModal = (med: MasterMedicinePreset) => {
    setEditingMed(med);
    setName(med.name);
    setGenericName(med.generic_name);
    setCategory(med.category);
    setDefaultDosage(med.default_dosage);
    setDosageType(med.dosage_type || "tablet");
    setStandardFrequency(med.standard_frequency);
    setDefaultTimes(med.default_times?.join(", ") || "08:00 AM");
    setContraindications(med.contraindications?.join(", ") || "");
    setNotes(med.notes || "");
    setIsModalOpen(true);
  };

  const handleSaveMed = async () => {
    if (!name.trim() || !genericName.trim()) {
      alert("Medicine name and generic name are required");
      return;
    }
    setIsSaving(true);
    try {
      const timesArray = defaultTimes
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const contraArray = contraindications
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean);

      if (editingMed) {
        const ok = await DataService.updateMasterMedicine(editingMed.id, {
          name,
          generic_name: genericName,
          category,
          default_dosage: defaultDosage,
          dosage_type: dosageType,
          standard_frequency: standardFrequency,
          default_times: timesArray,
          contraindications: contraArray,
          notes,
        });
        if (ok) {
          fetchMedicines();
          setIsModalOpen(false);
        } else {
          alert("Failed to update medicine preset.");
        }
      } else {
        const ok = await DataService.createMasterMedicine({
          name,
          generic_name: genericName,
          category,
          default_dosage: defaultDosage,
          dosage_type: dosageType,
          standard_frequency: standardFrequency,
          default_times: timesArray,
          contraindications: contraArray,
          notes,
        });
        if (ok) {
          fetchMedicines();
          setIsModalOpen(false);
        } else {
          alert("Failed to save medicine preset.");
        }
      }
    } catch (e: any) {
      alert(e?.message || "An error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteMed = async (med: MasterMedicinePreset) => {
    if (confirm(`Are you sure you want to delete preset "${med.name}"?`)) {
      const ok = await DataService.deleteMasterMedicine(med.id);
      if (ok) {
        setMedicines((prev) => prev.filter((m) => m.id !== med.id));
      } else {
        alert("Failed to delete medicine preset.");
      }
    }
  };

  const filteredMeds = medicines.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.generic_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Pill className="h-6 w-6 text-purple-600" />
            Master Medicine Presets & Knowledgebase
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Clinical drug master catalog powering mobile app prescriptions and dose schedules
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchMedicines}>
            <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button size="sm" onClick={openCreateModal}>
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            Add Medicine Preset
          </Button>
        </div>
      </div>

      {/* Search Toolbar */}
      <Card className="p-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search by brand name, generic name, or class..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-xs"
          />
        </div>
      </Card>

      {/* Medicines Table */}
      <Card className="overflow-hidden">
        {loading ? (
          <div>
            <div className="flex items-center gap-2 px-4 py-3 bg-purple-50/70 dark:bg-purple-950/20 text-purple-700 dark:text-purple-400 text-xs font-medium border-b border-purple-100 dark:border-purple-900/30">
              <LoadingSpinner size="xs" variant="primary" />
              <span>Querying master medicine presets from Supabase master_medicines...</span>
            </div>
            <TableSkeleton rows={5} columns={6} />
          </div>
        ) : filteredMeds.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center gap-3">
            <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400">
              <Inbox className="h-8 w-8" />
            </div>
            <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-200">
              No Medicine Presets Found
            </h3>
            <p className="text-xs text-slate-500 max-w-md mt-1">
              Add commonly prescribed medications so users can quickly search and schedule them in the mobile app.
            </p>
            <Button size="sm" onClick={openCreateModal} className="mt-2">
              <Plus className="h-3.5 w-3.5 mr-1" /> Add First Preset
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/75 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Brand & Generic Name</th>
                  <th className="py-3.5 px-4">Class / Category</th>
                  <th className="py-3.5 px-4">Default Dosage & Form</th>
                  <th className="py-3.5 px-4">Standard Schedule</th>
                  <th className="py-3.5 px-4">Contraindications & Notes</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filteredMeds.map((med) => (
                  <tr
                    key={med.id}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <div>
                        <p className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                          {med.name}
                        </p>
                        <p className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold mt-0.5">
                          {med.generic_name}
                        </p>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <Badge variant="outline">{med.category}</Badge>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {med.default_dosage}
                        </span>
                        <Badge variant="info" className="text-[10px] capitalize">
                          {med.dosage_type}
                        </Badge>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-800 dark:text-slate-200">
                        {med.standard_frequency}
                      </p>
                      {med.default_times && med.default_times.length > 0 && (
                        <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <Clock className="h-3 w-3" />
                          {med.default_times.join(", ")}
                        </p>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="max-w-xs space-y-1">
                        {med.contraindications && med.contraindications.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {med.contraindications.map((c, i) => (
                              <Badge key={i} variant="danger" className="text-[10px]">
                                ✕ {c}
                              </Badge>
                            ))}
                          </div>
                        )}
                        {med.notes && (
                          <p className="text-[10px] text-slate-500 italic line-clamp-1">
                            {med.notes}
                          </p>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openEditModal(med)}
                          title="Edit Medicine Preset"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteMed(med)}
                          title="Delete Preset"
                          className="text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingMed ? `Edit Preset: ${editingMed.name}` : "Add Master Medicine Preset"}
        description="This preset will be available when users add new medicines or reminders in the mobile app."
        maxWidth="lg"
      >
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Brand / Display Name *
              </label>
              <Input
                placeholder="e.g. Metformin Hydrochloride"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Generic Name *
              </label>
              <Input
                placeholder="e.g. Metformin HCl"
                value={genericName}
                onChange={(e) => setGenericName(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Drug Class / Category
              </label>
              <Input
                placeholder="e.g. Antidiabetic (Biguanide)"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Dosage Form
              </label>
              <select
                value={dosageType}
                onChange={(e) => setDosageType(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs"
              >
                <option value="tablet">Tablet</option>
                <option value="capsule">Capsule</option>
                <option value="syrup">Syrup</option>
                <option value="injection">Injection</option>
                <option value="inhaler">Inhaler</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Default Dosage
              </label>
              <Input
                placeholder="e.g. 500 mg"
                value={defaultDosage}
                onChange={(e) => setDefaultDosage(e.target.value)}
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Standard Frequency
              </label>
              <select
                value={standardFrequency}
                onChange={(e) => setStandardFrequency(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs"
              >
                <option value="Once Daily">Once Daily</option>
                <option value="Twice Daily">Twice Daily</option>
                <option value="3 Times Daily">3 Times Daily</option>
                <option value="Every 8 Hours">Every 8 Hours</option>
                <option value="As Needed (PRN)">As Needed (PRN)</option>
                <option value="Once Weekly">Once Weekly</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Default Schedule Times (comma-separated)
            </label>
            <Input
              placeholder="e.g. 08:00 AM, 08:00 PM"
              value={defaultTimes}
              onChange={(e) => setDefaultTimes(e.target.value)}
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Contraindications (comma-separated)
            </label>
            <Input
              placeholder="e.g. Severe Renal Impairment, Metabolic Acidosis"
              value={contraindications}
              onChange={(e) => setContraindications(e.target.value)}
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Clinical Instructions / Pharmacist Note
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Take with or immediately after meals to reduce GI irritation."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSaveMed} disabled={isSaving}>
              {isSaving ? "Saving..." : editingMed ? "Save Changes" : "Create Preset"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
