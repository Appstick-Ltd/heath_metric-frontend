"use client";

import * as React from "react";
import {
  Salad,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Inbox,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { DataService } from "@/lib/data-service";
import { CMSFoodItem } from "@/types/database";

export default function CMSFoodsPage() {
  const [foods, setFoods] = React.useState<CMSFoodItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState("ALL");
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);

  // Form State
  const [newFood, setNewFood] = React.useState<Partial<CMSFoodItem>>({
    name: "",
    category: "Vegetables",
    calories: 100,
    carbs: 15,
    protein: 3,
    fat: 1,
    fiber: 2,
    glycemic_index: 35,
    gi_category: "Low",
    is_diabetic_safe: true,
    is_hypertension_safe: true,
    is_gluten_free: true,
    is_renal_friendly: true,
    description: "",
    recommended_portion: "1 serving (100g)",
  });

  const fetchFoods = async () => {
    setLoading(true);
    try {
      const data = await DataService.getCMSFoods();
      setFoods(data);
    } catch (e) {
      console.warn(e);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchFoods();
  }, []);

  const handleSaveFood = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFood.name) return;

    setSaving(true);
    const item: Omit<CMSFoodItem, "id" | "created_at"> = {
      name: newFood.name!,
      category: newFood.category || "General",
      calories: Number(newFood.calories) || 0,
      carbs: Number(newFood.carbs) || 0,
      protein: Number(newFood.protein) || 0,
      fat: Number(newFood.fat) || 0,
      fiber: Number(newFood.fiber) || 0,
      glycemic_index: Number(newFood.glycemic_index) || 0,
      gi_category: (newFood.glycemic_index || 0) > 55 ? "High" : "Low",
      is_diabetic_safe: Boolean(newFood.is_diabetic_safe),
      is_hypertension_safe: Boolean(newFood.is_hypertension_safe),
      is_gluten_free: Boolean(newFood.is_gluten_free),
      is_renal_friendly: Boolean(newFood.is_renal_friendly),
      description: newFood.description || "Clinical meal nutrition data.",
      recommended_portion: newFood.recommended_portion || "1 serving",
    };

    const saved = await DataService.addCMSFood(item);
    setSaving(false);

    if (saved) {
      setFoods([saved, ...foods]);
      setIsAddModalOpen(false);
      alert(`"${saved.name}" saved directly to Supabase \`cms_foods\`!`);
    } else {
      // If table does not exist in schema cache yet
      alert(
        "Could not insert to Supabase: Please make sure you have executed dashboard_schema.sql in your Supabase SQL Editor."
      );
    }
  };

  const filteredFoods = foods.filter((f) => {
    const matchesSearch =
      f.name?.toLowerCase().includes(search.toLowerCase()) ||
      f.category?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      categoryFilter === "ALL" || f.category?.toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Food & Nutrition CMS
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time database querying Supabase <code className="text-emerald-600">cms_foods</code> table
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchFoods}>
            <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button size="sm" onClick={() => setIsAddModalOpen(true)}>
            <Plus className="h-4 w-4 mr-1.5" />
            Add Master Food
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search foods in database..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 text-xs"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto text-xs">
            <Filter className="h-4 w-4 text-slate-400 shrink-0 ml-1" />
            <span className="text-slate-500 shrink-0">Category:</span>
            {["ALL", "Grains & Cereals", "Fish & Poultry", "Vegetables", "Fruits", "Nuts & Seeds"].map(
              (cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-xl font-medium shrink-0 transition-all ${
                    categoryFilter === cat
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
                  }`}
                >
                  {cat}
                </button>
              )
            )}
          </div>
        </div>
      </Card>

      {/* Foods Grid / Empty State */}
      {loading ? (
        <div className="p-16 text-center text-xs text-slate-400 flex flex-col items-center justify-center gap-2">
          <div className="h-7 w-7 rounded-full border-2 border-emerald-600 border-t-transparent animate-spin" />
          <span>Fetching foods from Supabase `cms_foods`...</span>
        </div>
      ) : filteredFoods.length === 0 ? (
        <Card className="p-12 text-center flex flex-col items-center justify-center gap-3">
          <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400">
            <Inbox className="h-8 w-8" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-200">
              No Food Records in Supabase
            </h3>
            <p className="text-xs text-slate-500 max-w-md mt-1">
              Click &quot;Add Master Food&quot; to insert your first clinical food item, or run the provided <code className="text-emerald-600">dashboard_schema.sql</code> script in Supabase SQL editor to seed standard items.
            </p>
          </div>
          <Button size="sm" onClick={() => setIsAddModalOpen(true)} className="mt-2">
            <Plus className="h-4 w-4 mr-1.5" />
            Add First Food Item
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredFoods.map((food) => (
            <Card key={food.id} className="p-5 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-all">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      {food.category}
                    </span>
                    <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 mt-0.5">
                      {food.name}
                    </h3>
                  </div>
                  <Badge
                    variant={food.gi_category === "Low" ? "success" : "danger"}
                    className="shrink-0 text-[10px]"
                  >
                    GI {food.glycemic_index} ({food.gi_category})
                  </Badge>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">
                  {food.description}
                </p>

                {/* Nutrition Macros */}
                <div className="mt-4 grid grid-cols-4 gap-1.5 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-center text-[11px]">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Calories</span>
                    <strong className="text-slate-800 dark:text-slate-200">{food.calories}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Carbs</span>
                    <strong className="text-slate-800 dark:text-slate-200">{food.carbs}g</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Protein</span>
                    <strong className="text-slate-800 dark:text-slate-200">{food.protein}g</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Fat</span>
                    <strong className="text-slate-800 dark:text-slate-200">{food.fat}g</strong>
                  </div>
                </div>

                {/* Clinical Condition Flags */}
                <div className="mt-4 space-y-1.5">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Condition Suitability
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-md font-medium ${
                        food.is_diabetic_safe
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                          : "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400"
                      }`}
                    >
                      {food.is_diabetic_safe ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                      Diabetic Safe
                    </span>

                    <span
                      className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-md font-medium ${
                        food.is_hypertension_safe
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                          : "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400"
                      }`}
                    >
                      {food.is_hypertension_safe ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                      Low Sodium
                    </span>

                    {food.is_gluten_free && (
                      <Badge variant="outline" className="text-[10px]">
                        Gluten-Free
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px] truncate max-w-[170px]">
                  Portion: {food.recommended_portion}
                </span>
                <span className="text-slate-400 font-mono text-[10px]">
                  ID: {food.id.slice(0, 8)}
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add New Food Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Food to Supabase Database"
        description="This will insert a new row into the `cms_foods` PostgreSQL table"
        maxWidth="lg"
      >
        <form onSubmit={handleSaveFood} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Food Name</label>
              <Input
                required
                placeholder="e.g. Boiled Sweet Potato"
                value={newFood.name}
                onChange={(e) => setNewFood({ ...newFood, name: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Category</label>
              <Input
                placeholder="e.g. Vegetables"
                value={newFood.category}
                onChange={(e) => setNewFood({ ...newFood, category: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Calories</label>
              <Input
                type="number"
                value={newFood.calories}
                onChange={(e) => setNewFood({ ...newFood, calories: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Carbs (g)</label>
              <Input
                type="number"
                value={newFood.carbs}
                onChange={(e) => setNewFood({ ...newFood, carbs: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Protein (g)</label>
              <Input
                type="number"
                value={newFood.protein}
                onChange={(e) => setNewFood({ ...newFood, protein: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Fat (g)</label>
              <Input
                type="number"
                value={newFood.fat}
                onChange={(e) => setNewFood({ ...newFood, fat: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Glycemic Index (0-100)</label>
              <Input
                type="number"
                value={newFood.glycemic_index}
                onChange={(e) => setNewFood({ ...newFood, glycemic_index: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Recommended Portion</label>
              <Input
                value={newFood.recommended_portion}
                onChange={(e) => setNewFood({ ...newFood, recommended_portion: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700 dark:text-slate-300">Clinical / Dietary Description</label>
            <Input
              value={newFood.description}
              onChange={(e) => setNewFood({ ...newFood, description: e.target.value })}
              placeholder="Clinical recommendations for diabetics..."
            />
          </div>

          {/* Condition Checkboxes */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 space-y-2">
            <span className="font-semibold text-slate-800 dark:text-slate-200 block">Condition Safety Flags</span>
            <div className="grid grid-cols-2 gap-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newFood.is_diabetic_safe}
                  onChange={(e) => setNewFood({ ...newFood, is_diabetic_safe: e.target.checked })}
                  className="accent-emerald-600 h-4 w-4"
                />
                <span>Safe for Diabetics</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newFood.is_hypertension_safe}
                  onChange={(e) => setNewFood({ ...newFood, is_hypertension_safe: e.target.checked })}
                  className="accent-emerald-600 h-4 w-4"
                />
                <span>Low Sodium</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newFood.is_gluten_free}
                  onChange={(e) => setNewFood({ ...newFood, is_gluten_free: e.target.checked })}
                  className="accent-emerald-600 h-4 w-4"
                />
                <span>Gluten Free</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newFood.is_renal_friendly}
                  onChange={(e) => setNewFood({ ...newFood, is_renal_friendly: e.target.checked })}
                  className="accent-emerald-600 h-4 w-4"
                />
                <span>Renal / Kidney Friendly</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="ghost" size="sm" onClick={() => setIsAddModalOpen(false)}>
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
