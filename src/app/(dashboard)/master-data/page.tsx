"use client";

import * as React from "react";
import {
  Database,
  Apple,
  Pill,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  RefreshCw,
  X,
  HeartPulse,
  ShieldAlert,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { CmsService } from "@/lib/services/cms.service";
import { CMSFoodItem, MasterMedicinePreset } from "@/types/database";

const DEFAULT_FOODS: CMSFoodItem[] = [
  {
    id: "food-1",
    name: "Brown Rice (Cooked)",
    category: "Grains & Cereals",
    calories: 218,
    carbs: 45.8,
    protein: 4.5,
    fat: 1.6,
    fiber: 3.5,
    glycemic_index: 55,
    gi_category: "Medium",
    is_diabetic_safe: true,
    is_hypertension_safe: true,
    is_gluten_free: true,
    is_renal_friendly: true,
    recommended_portion: "1 cup (195g)",
    description: "Complex carbohydrate rich in magnesium, low sodium and beneficial fiber.",
  },
  {
    id: "food-2",
    name: "Rolled Oats",
    category: "Breakfast & Cereals",
    calories: 154,
    carbs: 27.4,
    protein: 5.3,
    fat: 2.6,
    fiber: 4.1,
    glycemic_index: 42,
    gi_category: "Low",
    is_diabetic_safe: true,
    is_hypertension_safe: true,
    is_gluten_free: true,
    is_renal_friendly: true,
    recommended_portion: "1/2 cup dry (40g)",
    description: "Beta-glucan soluble fiber helps lower LDL cholesterol and stabilizes fasting glucose.",
  },
  {
    id: "food-3",
    name: "Boiled Egg (Large)",
    category: "Proteins & Eggs",
    calories: 78,
    carbs: 0.6,
    protein: 6.3,
    fat: 5.3,
    fiber: 0,
    glycemic_index: 0,
    gi_category: "Low",
    is_diabetic_safe: true,
    is_hypertension_safe: true,
    is_gluten_free: true,
    is_renal_friendly: false,
    recommended_portion: "1 piece (50g)",
    description: "High biological value complete protein with choline and lutein.",
  },
  {
    id: "food-4",
    name: "Skinless Grilled Chicken Breast",
    category: "Poultry & Meat",
    calories: 165,
    carbs: 0,
    protein: 31,
    fat: 3.6,
    fiber: 0,
    glycemic_index: 0,
    gi_category: "Low",
    is_diabetic_safe: true,
    is_hypertension_safe: true,
    is_gluten_free: true,
    is_renal_friendly: false,
    recommended_portion: "100g cooked",
    description: "Lean animal protein for muscle preservation without saturated fat load.",
  },
  {
    id: "food-5",
    name: "Fresh Spinach (Steamed)",
    category: "Vegetables",
    calories: 41,
    carbs: 6.8,
    protein: 5.4,
    fat: 0.8,
    fiber: 4.3,
    glycemic_index: 15,
    gi_category: "Low",
    is_diabetic_safe: true,
    is_hypertension_safe: true,
    is_gluten_free: true,
    is_renal_friendly: false,
    recommended_portion: "1 cup (180g)",
    description: "Rich in potassium, nitrates for BP control and folate.",
  },
  {
    id: "food-6",
    name: "Red Apple with Skin",
    category: "Fruits",
    calories: 95,
    carbs: 25,
    protein: 0.5,
    fat: 0.3,
    fiber: 4.4,
    glycemic_index: 36,
    gi_category: "Low",
    is_diabetic_safe: true,
    is_hypertension_safe: true,
    is_gluten_free: true,
    is_renal_friendly: true,
    recommended_portion: "1 medium (182g)",
    description: "Contains pectin fiber and polyphenols that slow sugar absorption.",
  },
];

const DEFAULT_MEDICINES: MasterMedicinePreset[] = [
  {
    id: "med-1",
    name: "Metformin Hydrochloride",
    generic_name: "Metformin",
    category: "Oral Antidiabetic (Biguanide)",
    default_dosage: "500 mg",
    dosage_type: "tablet",
    standard_frequency: "Twice daily (Morning & Night)",
    default_times: ["08:00 AM", "08:00 PM"],
    contraindications: ["Severe renal impairment (eGFR < 30)", "Metabolic acidosis"],
    notes: "Take with or immediately after meals to reduce GI disturbance.",
  },
  {
    id: "med-2",
    name: "Amlodipine Besylate",
    generic_name: "Amlodipine",
    category: "Antihypertensive (Calcium Channel Blocker)",
    default_dosage: "5 mg",
    dosage_type: "tablet",
    standard_frequency: "Once daily (Morning)",
    default_times: ["08:00 AM"],
    contraindications: ["Severe hypotension", "Cardiogenic shock"],
    notes: "Monitor for peripheral pedal edema.",
  },
  {
    id: "med-3",
    name: "Losartan Potassium",
    generic_name: "Losartan",
    category: "Antihypertensive (ARB)",
    default_dosage: "50 mg",
    dosage_type: "tablet",
    standard_frequency: "Once daily (Morning or Night)",
    default_times: ["09:00 AM"],
    contraindications: ["Pregnancy", "Concomitant aliskiren with diabetes"],
    notes: "Renoprotective in diabetic nephropathy. Monitor serum potassium.",
  },
  {
    id: "med-4",
    name: "Atorvastatin Calcium",
    generic_name: "Atorvastatin",
    category: "Lipid-lowering (HMG-CoA Reductase Inhibitor)",
    default_dosage: "20 mg",
    dosage_type: "tablet",
    standard_frequency: "Once daily at Bedtime",
    default_times: ["10:00 PM"],
    contraindications: ["Active liver disease", "Pregnancy & lactation"],
    notes: "Take at nighttime for optimal cholesterol synthesis inhibition.",
  },
  {
    id: "med-5",
    name: "Insulin Glargine (Lantus / Basaglar)",
    generic_name: "Insulin Glargine (rDNA origin)",
    category: "Long-acting Basal Insulin",
    default_dosage: "10-20 units",
    dosage_type: "injection",
    standard_frequency: "Once daily (Bedtime subcutaneous)",
    default_times: ["10:30 PM"],
    contraindications: ["Episodes of hypoglycemia", "Hypersensitivity"],
    notes: "Rotate subcutaneous injection sites daily (abdomen, thighs, upper arms).",
  },
  {
    id: "med-6",
    name: "Paracetamol",
    generic_name: "Acetaminophen",
    category: "Analgesic & Antipyretic",
    default_dosage: "500 mg",
    dosage_type: "tablet",
    standard_frequency: "As needed (Max 4g/24h)",
    default_times: ["As needed"],
    contraindications: ["Severe hepatic impairment"],
    notes: "Safe for hypertension and pain management when within dosage bounds.",
  },
];

export default function MasterDataPage() {
  const [activeTab, setActiveTab] = React.useState<"foods" | "medicines">("foods");
  const [foods, setFoods] = React.useState<CMSFoodItem[]>(DEFAULT_FOODS);
  const [medicines, setMedicines] = React.useState<MasterMedicinePreset[]>(DEFAULT_MEDICINES);
  const [loading, setLoading] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [feedback, setFeedback] = React.useState<string | null>(null);

  // New Food Modal State
  const [isAddingFood, setIsAddingFood] = React.useState(false);
  const [newFood, setNewFood] = React.useState<Partial<CMSFoodItem>>({
    name: "",
    category: "Vegetables",
    calories: 100,
    carbs: 10,
    protein: 5,
    fat: 2,
    fiber: 3,
    glycemic_index: 35,
    gi_category: "Low",
    is_diabetic_safe: true,
    is_hypertension_safe: true,
    is_gluten_free: true,
    is_renal_friendly: true,
    recommended_portion: "1 serving (100g)",
    description: "",
  });

  // New Medicine Modal State
  const [isAddingMed, setIsAddingMed] = React.useState(false);
  const [newMed, setNewMed] = React.useState<Partial<MasterMedicinePreset>>({
    name: "",
    generic_name: "",
    category: "Antidiabetic",
    default_dosage: "500 mg",
    dosage_type: "tablet",
    standard_frequency: "Twice daily",
    default_times: ["08:00 AM", "08:00 PM"],
    contraindications: [],
    notes: "",
  });

  // Load from Supabase CmsService if available
  const loadData = React.useCallback(async () => {
    setLoading(true);
    try {
      const [remoteFoods, remoteMeds] = await Promise.all([
        CmsService.getCmsFoods(),
        CmsService.getMasterMedicines(),
      ]);
      if (remoteFoods && remoteFoods.length > 0) {
        setFoods(remoteFoods);
      }
      if (remoteMeds && remoteMeds.length > 0) {
        setMedicines(remoteMeds);
      }
    } catch (e) {
      console.warn("Using default clinical master data:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  // Food handlers
  const handleAddFood = async () => {
    if (!newFood.name?.trim()) return;
    const foodItem: CMSFoodItem = {
      id: `food-${Date.now()}`,
      name: newFood.name.trim(),
      category: newFood.category || "General",
      calories: Number(newFood.calories) || 0,
      carbs: Number(newFood.carbs) || 0,
      protein: Number(newFood.protein) || 0,
      fat: Number(newFood.fat) || 0,
      fiber: Number(newFood.fiber) || 0,
      glycemic_index: Number(newFood.glycemic_index) || 40,
      gi_category: (newFood.glycemic_index || 40) < 55 ? "Low" : (newFood.glycemic_index || 40) <= 69 ? "Medium" : "High",
      is_diabetic_safe: !!newFood.is_diabetic_safe,
      is_hypertension_safe: !!newFood.is_hypertension_safe,
      is_gluten_free: !!newFood.is_gluten_free,
      is_renal_friendly: !!newFood.is_renal_friendly,
      recommended_portion: newFood.recommended_portion || "100g",
      description: newFood.description || "",
    };

    setFoods([foodItem, ...foods]);
    setIsAddingFood(false);
    setFeedback(`"${foodItem.name}" added to Nutrition Database!`);
    setTimeout(() => setFeedback(null), 3500);

    // Try save to remote Supabase
    try {
      await CmsService.createCmsFood(foodItem);
    } catch (e) {
      console.warn("Local food state updated:", e);
    }
  };

  const handleDeleteFood = (id: string) => {
    setFoods(foods.filter((f) => f.id !== id));
    CmsService.deleteCmsFood(id).catch(() => {});
  };

  // Medicine handlers
  const handleAddMedicine = async () => {
    if (!newMed.name?.trim()) return;
    const medItem: MasterMedicinePreset = {
      id: `med-${Date.now()}`,
      name: newMed.name.trim(),
      generic_name: newMed.generic_name || newMed.name.trim(),
      category: newMed.category || "General",
      default_dosage: newMed.default_dosage || "500 mg",
      dosage_type: newMed.dosage_type || "tablet",
      standard_frequency: newMed.standard_frequency || "Once daily",
      default_times: newMed.default_times || ["08:00 AM"],
      contraindications: newMed.contraindications || [],
      notes: newMed.notes || "",
    };

    setMedicines([medItem, ...medicines]);
    setIsAddingMed(false);
    setFeedback(`"${medItem.name}" added to Medicine Master Directory!`);
    setTimeout(() => setFeedback(null), 3500);

    try {
      await CmsService.createMasterMedicine(medItem);
    } catch (e) {
      console.warn("Local medicine state updated:", e);
    }
  };

  const handleDeleteMedicine = (id: string) => {
    setMedicines(medicines.filter((m) => m.id !== id));
    CmsService.deleteMasterMedicine(id).catch(() => {});
  };

  // Filtering
  const filteredFoods = React.useMemo(() => {
    if (!searchQuery.trim()) return foods;
    const q = searchQuery.toLowerCase();
    return foods.filter(
      (f) =>
        f.name.toLowerCase().includes(q) ||
        f.category.toLowerCase().includes(q) ||
        f.description?.toLowerCase().includes(q)
    );
  }, [foods, searchQuery]);

  const filteredMedicines = React.useMemo(() => {
    if (!searchQuery.trim()) return medicines;
    const q = searchQuery.toLowerCase();
    return medicines.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.generic_name.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q)
    );
  }, [medicines, searchQuery]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Database className="h-6 w-6 text-[#006AFA]" />
            Master Clinical & Nutrition Data
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage food nutrition database (calories, macros, GI) and standardized medicine presets for Flutter app auto-suggest
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={loadData}>
            <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          {activeTab === "foods" ? (
            <Button size="sm" onClick={() => setIsAddingFood(true)} className="bg-[#006AFA] hover:bg-blue-600 text-white">
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              Add Food Item
            </Button>
          ) : (
            <Button size="sm" onClick={() => setIsAddingMed(true)} className="bg-[#006AFA] hover:bg-blue-600 text-white">
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              Add Medicine Preset
            </Button>
          )}
        </div>
      </div>

      {feedback && (
        <div className="p-3 rounded-[8px] bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Tabs & Search Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-2 rounded-[8px] border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              setActiveTab("foods");
              setSearchQuery("");
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-[8px] text-xs font-bold transition-all ${
              activeTab === "foods"
                ? "bg-[#006AFA] text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <Apple className="h-4 w-4" />
            <span>Food & Nutrition Library ({foods.length})</span>
          </button>
          <button
            onClick={() => {
              setActiveTab("medicines");
              setSearchQuery("");
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-[8px] text-xs font-bold transition-all ${
              activeTab === "medicines"
                ? "bg-[#006AFA] text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <Pill className="h-4 w-4" />
            <span>Master Medicines ({medicines.length})</span>
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={activeTab === "foods" ? "Search foods, calories, GI..." : "Search medicine or generic name..."}
            className="pl-8 text-xs h-9"
          />
        </div>
      </div>

      {/* Foods Table */}
      {activeTab === "foods" && (
        <Card className="rounded-[8px] overflow-hidden border border-slate-200 dark:border-slate-800">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Food Item</th>
                  <th className="py-3 px-3">Portion</th>
                  <th className="py-3 px-3">Calories</th>
                  <th className="py-3 px-3">Macros (C / P / F)</th>
                  <th className="py-3 px-3">Glycemic Index</th>
                  <th className="py-3 px-3">Clinical Tags</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {filteredFoods.map((f) => (
                  <tr key={f.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 dark:text-white">{f.name}</div>
                      <div className="text-[11px] text-slate-500">{f.category}</div>
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-300 font-medium">{f.recommended_portion}</td>
                    <td className="py-3 px-3">
                      <span className="font-extrabold text-[#006AFA] dark:text-sky-400">{f.calories}</span> kcal
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-slate-600 dark:text-slate-300">
                      <span title="Carbs" className="text-amber-600 dark:text-amber-400 font-bold">{f.carbs}g C</span> •{" "}
                      <span title="Protein" className="text-emerald-600 dark:text-emerald-400 font-bold">{f.protein}g P</span> •{" "}
                      <span title="Fat" className="text-purple-600 dark:text-purple-400 font-bold">{f.fat}g F</span>
                    </td>
                    <td className="py-3 px-3">
                      <Badge
                        variant="outline"
                        className={`text-[10px] rounded-[6px] ${
                          f.gi_category === "Low"
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-300"
                            : f.gi_category === "Medium"
                            ? "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-300"
                            : "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border-rose-300"
                        }`}
                      >
                        GI {f.glycemic_index} ({f.gi_category})
                      </Badge>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex flex-wrap gap-1">
                        {f.is_diabetic_safe && (
                          <span className="px-1.5 py-0.5 rounded-[4px] bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 text-[10px] font-semibold border border-sky-200 dark:border-sky-800">
                            Diabetic Safe
                          </span>
                        )}
                        {f.is_hypertension_safe && (
                          <span className="px-1.5 py-0.5 rounded-[4px] bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 text-[10px] font-semibold border border-teal-200 dark:border-teal-800">
                            Low Sodium
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => handleDeleteFood(f.id)}
                        className="p-1.5 rounded-[6px] text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        title="Delete Food"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Medicines Table */}
      {activeTab === "medicines" && (
        <Card className="rounded-[8px] overflow-hidden border border-slate-200 dark:border-slate-800">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Brand / Trade Name</th>
                  <th className="py-3 px-3">Generic Name</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Dosage &amp; Form</th>
                  <th className="py-3 px-3">Standard Frequency</th>
                  <th className="py-3 px-3">Clinical Notes</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {filteredMedicines.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                      <div className="flex items-center gap-1.5">
                        <Pill className="h-3.5 w-3.5 text-[#006AFA]" />
                        <span>{m.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-600 dark:text-slate-300">{m.generic_name}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-[6px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-[10px]">
                        {m.category}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-extrabold text-slate-900 dark:text-white">{m.default_dosage}</span>
                      <span className="ml-1 uppercase text-[10px] text-slate-400 font-bold">({m.dosage_type})</span>
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-300 font-medium">{m.standard_frequency}</td>
                    <td className="py-3 px-3 text-slate-500 max-w-xs truncate" title={m.notes}>
                      {m.notes || "Standard prescription adherence"}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => handleDeleteMedicine(m.id)}
                        className="p-1.5 rounded-[6px] text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        title="Delete Medicine"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Add Food Modal */}
      {isAddingFood && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-[8px] max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Apple className="h-4 w-4 text-[#006AFA]" />
                Add Food &amp; Macro Item
              </h3>
              <button onClick={() => setIsAddingFood(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Food Name *</label>
                <Input
                  value={newFood.name || ""}
                  onChange={(e) => setNewFood({ ...newFood, name: e.target.value })}
                  placeholder="e.g. Quinoa (Cooked)"
                  className="h-9"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Category</label>
                  <Input
                    value={newFood.category || ""}
                    onChange={(e) => setNewFood({ ...newFood, category: e.target.value })}
                    placeholder="Grains / Fruits"
                    className="h-9"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Serving Portion</label>
                  <Input
                    value={newFood.recommended_portion || ""}
                    onChange={(e) => setNewFood({ ...newFood, recommended_portion: e.target.value })}
                    placeholder="1 cup (150g)"
                    className="h-9"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                <div>
                  <label className="font-semibold block mb-1">Calories</label>
                  <Input
                    type="number"
                    value={newFood.calories || 0}
                    onChange={(e) => setNewFood({ ...newFood, calories: Number(e.target.value) })}
                    className="h-9"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Carbs (g)</label>
                  <Input
                    type="number"
                    value={newFood.carbs || 0}
                    onChange={(e) => setNewFood({ ...newFood, carbs: Number(e.target.value) })}
                    className="h-9"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Protein (g)</label>
                  <Input
                    type="number"
                    value={newFood.protein || 0}
                    onChange={(e) => setNewFood({ ...newFood, protein: Number(e.target.value) })}
                    className="h-9"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Fat (g)</label>
                  <Input
                    type="number"
                    value={newFood.fat || 0}
                    onChange={(e) => setNewFood({ ...newFood, fat: Number(e.target.value) })}
                    className="h-9"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!newFood.is_diabetic_safe}
                    onChange={(e) => setNewFood({ ...newFood, is_diabetic_safe: e.target.checked })}
                    className="rounded-[4px] h-4 w-4 text-[#006AFA]"
                  />
                  <span>Diabetic Friendly</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!newFood.is_hypertension_safe}
                    onChange={(e) => setNewFood({ ...newFood, is_hypertension_safe: e.target.checked })}
                    className="rounded-[4px] h-4 w-4 text-emerald-600"
                  />
                  <span>Low Sodium</span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
              <Button variant="outline" size="sm" onClick={() => setIsAddingFood(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleAddFood} className="bg-[#006AFA] hover:bg-blue-600 text-white">
                Save Food
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Medicine Modal */}
      {isAddingMed && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-[8px] max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Pill className="h-4 w-4 text-[#006AFA]" />
                Add Master Medicine Preset
              </h3>
              <button onClick={() => setIsAddingMed(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Brand Name *</label>
                <Input
                  value={newMed.name || ""}
                  onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
                  placeholder="e.g. Glucophage / Lipitor"
                  className="h-9"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Generic Name</label>
                <Input
                  value={newMed.generic_name || ""}
                  onChange={(e) => setNewMed({ ...newMed, generic_name: e.target.value })}
                  placeholder="e.g. Metformin / Atorvastatin"
                  className="h-9"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Default Dosage</label>
                  <Input
                    value={newMed.default_dosage || ""}
                    onChange={(e) => setNewMed({ ...newMed, default_dosage: e.target.value })}
                    placeholder="e.g. 500 mg"
                    className="h-9"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Form</label>
                  <select
                    value={newMed.dosage_type || "tablet"}
                    onChange={(e) =>
                      setNewMed({ ...newMed, dosage_type: e.target.value as MasterMedicinePreset["dosage_type"] })
                    }
                    className="w-full h-9 rounded-[8px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 text-xs"
                  >
                    <option value="tablet">Tablet</option>
                    <option value="capsule">Capsule</option>
                    <option value="syrup">Syrup</option>
                    <option value="injection">Injection</option>
                    <option value="inhaler">Inhaler</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">Standard Frequency</label>
                <Input
                  value={newMed.standard_frequency || ""}
                  onChange={(e) => setNewMed({ ...newMed, standard_frequency: e.target.value })}
                  placeholder="e.g. Twice daily with meals"
                  className="h-9"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Clinical Notes &amp; Precautions</label>
                <Input
                  value={newMed.notes || ""}
                  onChange={(e) => setNewMed({ ...newMed, notes: e.target.value })}
                  placeholder="e.g. Take with food to reduce GI upset"
                  className="h-9"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
              <Button variant="outline" size="sm" onClick={() => setIsAddingMed(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleAddMedicine} className="bg-[#006AFA] hover:bg-blue-600 text-white">
                Save Medicine
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
