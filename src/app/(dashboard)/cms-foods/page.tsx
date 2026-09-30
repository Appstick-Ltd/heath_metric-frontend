"use client";

import * as React from "react";
import {
  UtensilsCrossed,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Edit2,
  Trash2,
  RefreshCw,
  Inbox,
  AlertCircle,
  Apple,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { TableSkeleton } from "@/components/ui/skeleton";
import { LoadingSpinner } from "@/components/ui/loader";
import { DataService } from "@/lib/data-service";
import { CMSFoodItem } from "@/types/database";

export default function CmsFoodsPage() {
  const [foods, setFoods] = React.useState<CMSFoodItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState("ALL");

  // Modal State
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingFood, setEditingFood] = React.useState<CMSFoodItem | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);

  // Form State
  const [name, setName] = React.useState("");
  const [category, setCategory] = React.useState("Grains & Cereals");
  const [portion, setPortion] = React.useState("1 serving (100g)");
  const [calories, setCalories] = React.useState(100);
  const [carbs, setCarbs] = React.useState(20);
  const [protein, setProtein] = React.useState(5);
  const [fat, setFat] = React.useState(2);
  const [fiber, setFiber] = React.useState(2);
  const [glycemicIndex, setGlycemicIndex] = React.useState(45);
  const [giCategory, setGiCategory] = React.useState<"Low" | "Medium" | "High">("Low");
  const [isDiabeticSafe, setIsDiabeticSafe] = React.useState(true);
  const [isHypertensionSafe, setIsHypertensionSafe] = React.useState(true);
  const [isGlutenFree, setIsGlutenFree] = React.useState(true);
  const [isRenalFriendly, setIsRenalFriendly] = React.useState(true);
  const [description, setDescription] = React.useState("");

  const fetchFoods = async () => {
    setLoading(true);
    try {
      const data = await DataService.getCmsFoods();
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

  const openCreateModal = () => {
    setEditingFood(null);
    setName("");
    setCategory("Grains & Cereals");
    setPortion("1 serving (100g)");
    setCalories(100);
    setCarbs(20);
    setProtein(5);
    setFat(2);
    setFiber(2);
    setGlycemicIndex(45);
    setGiCategory("Low");
    setIsDiabeticSafe(true);
    setIsHypertensionSafe(true);
    setIsGlutenFree(true);
    setIsRenalFriendly(true);
    setDescription("");
    setIsModalOpen(true);
  };

  const openEditModal = (food: CMSFoodItem) => {
    setEditingFood(food);
    setName(food.name);
    setCategory(food.category);
    setPortion(food.recommended_portion || "1 serving (100g)");
    setCalories(food.calories);
    setCarbs(Number(food.carbs));
    setProtein(Number(food.protein));
    setFat(Number(food.fat));
    setFiber(Number(food.fiber));
    setGlycemicIndex(food.glycemic_index);
    setGiCategory(food.gi_category || "Low");
    setIsDiabeticSafe(food.is_diabetic_safe ?? true);
    setIsHypertensionSafe(food.is_hypertension_safe ?? true);
    setIsGlutenFree(food.is_gluten_free ?? true);
    setIsRenalFriendly(food.is_renal_friendly ?? true);
    setDescription(food.description || "");
    setIsModalOpen(true);
  };

  const handleSaveFood = async () => {
    if (!name.trim()) {
      alert("Food name is required");
      return;
    }
    setIsSaving(true);
    try {
      if (editingFood) {
        const ok = await DataService.updateCmsFood(editingFood.id, {
          name,
          category,
          recommended_portion: portion,
          calories: Number(calories),
          carbs: Number(carbs),
          protein: Number(protein),
          fat: Number(fat),
          fiber: Number(fiber),
          glycemic_index: Number(glycemicIndex),
          gi_category: giCategory,
          is_diabetic_safe: isDiabeticSafe,
          is_hypertension_safe: isHypertensionSafe,
          is_gluten_free: isGlutenFree,
          is_renal_friendly: isRenalFriendly,
          description,
        });
        if (ok) {
          fetchFoods();
          setIsModalOpen(false);
        } else {
          alert("Failed to update food in Supabase.");
        }
      } else {
        const ok = await DataService.createCmsFood({
          name,
          category,
          recommended_portion: portion,
          calories: Number(calories),
          carbs: Number(carbs),
          protein: Number(protein),
          fat: Number(fat),
          fiber: Number(fiber),
          glycemic_index: Number(glycemicIndex),
          gi_category: giCategory,
          is_diabetic_safe: isDiabeticSafe,
          is_hypertension_safe: isHypertensionSafe,
          is_gluten_free: isGlutenFree,
          is_renal_friendly: isRenalFriendly,
          description,
        });
        if (ok) {
          fetchFoods();
          setIsModalOpen(false);
        } else {
          alert("Failed to save food in Supabase.");
        }
      }
    } catch (e: any) {
      alert(e?.message || "An error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteFood = async (food: CMSFoodItem) => {
    if (confirm(`Are you sure you want to delete "${food.name}" from the food database?`)) {
      const ok = await DataService.deleteCmsFood(food.id);
      if (ok) {
        setFoods((prev) => prev.filter((f) => f.id !== food.id));
      } else {
        alert("Failed to delete food record.");
      }
    }
  };

  const categories = [
    "ALL",
    "Grains & Cereals",
    "Fish & Poultry",
    "Legumes & Pulses",
    "Vegetables",
    "Fruits",
    "Nuts & Seeds",
    "Dairy",
  ];

  const filteredFoods = foods.filter((f) => {
    const matchesSearch =
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (f.description && f.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      categoryFilter === "ALL" || f.category.toLowerCase() === categoryFilter.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Apple className="h-6 w-6 text-emerald-600" />
            Food Database & &quot;Can I Eat?&quot; CMS
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Clinical nutritional values & condition suitability syncing with mobile app meal planner
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchFoods}>
            <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button size="sm" onClick={openCreateModal}>
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            Add Food Item
          </Button>
        </div>
      </div>

      {/* Search & Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search foods, categories, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 text-xs"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <Filter className="h-4 w-4 text-slate-400 shrink-0 ml-1" />
            <span className="text-xs text-slate-500 shrink-0 mr-1">Category:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`text-xs px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all ${
                  categoryFilter === cat
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Foods Table */}
      <Card className="overflow-hidden">
        {loading ? (
          <div>
            <div className="flex items-center gap-2 px-4 py-3 bg-emerald-50/70 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 text-xs font-medium border-b border-emerald-100 dark:border-emerald-900/30">
              <LoadingSpinner size="xs" variant="primary" />
              <span>Fetching verified clinical food entries from Supabase cms_foods...</span>
            </div>
            <TableSkeleton rows={6} columns={6} />
          </div>
        ) : filteredFoods.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center gap-3">
            <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400">
              <Inbox className="h-8 w-8" />
            </div>
            <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-200">
              No Foods Found in Database
            </h3>
            <p className="text-xs text-slate-500 max-w-md mt-1">
              Add new food items to help mobile app users understand glycemic indexes, nutrition, and condition safety.
            </p>
            <Button size="sm" onClick={openCreateModal} className="mt-2">
              <Plus className="h-3.5 w-3.5 mr-1" /> Add First Food Item
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/75 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Food Name & Portion</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Macros per Serving</th>
                  <th className="py-3.5 px-4">Glycemic Index</th>
                  <th className="py-3.5 px-4">Condition Safety</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filteredFoods.map((food) => (
                  <tr
                    key={food.id}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <div>
                        <p className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                          {food.name}
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {food.recommended_portion || "1 serving"}
                        </p>
                        {food.description && (
                          <p className="text-[10px] text-slate-400 italic mt-1 line-clamp-1 max-w-sm">
                            {food.description}
                          </p>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <Badge variant="outline">{food.category}</Badge>
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-800 dark:text-slate-200">
                        {food.calories} kcal
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        C: {food.carbs}g • P: {food.protein}g • F: {food.fat}g • Fib: {food.fiber}g
                      </p>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900 dark:text-white">
                          GI: {food.glycemic_index}
                        </span>
                        <Badge
                          variant={
                            food.gi_category === "Low"
                              ? "success"
                              : food.gi_category === "Medium"
                              ? "warning"
                              : "danger"
                          }
                          className="text-[10px]"
                        >
                          {food.gi_category}
                        </Badge>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        <Badge
                          variant={food.is_diabetic_safe ? "success" : "outline"}
                          className="text-[10px]"
                        >
                          {food.is_diabetic_safe ? "✓ Diabetic" : "✕ Not Diabetic"}
                        </Badge>
                        <Badge
                          variant={food.is_hypertension_safe ? "info" : "outline"}
                          className="text-[10px]"
                        >
                          {food.is_hypertension_safe ? "✓ Low Sodium" : "✕ High Sodium"}
                        </Badge>
                        {food.is_gluten_free && (
                          <Badge variant="outline" className="text-[10px]">
                            Gluten-Free
                          </Badge>
                        )}
                        {food.is_renal_friendly && (
                          <Badge variant="outline" className="text-[10px]">
                            Renal
                          </Badge>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openEditModal(food)}
                          title="Edit Food Details"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteFood(food)}
                          title="Delete Food Item"
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

      {/* Add / Edit Food Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingFood ? `Edit Food: ${editingFood.name}` : "Add New Food to Catalog"}
        description="This food will immediately be available in mobile app's 'Can I Eat?' searches and meal planner."
        maxWidth="lg"
      >
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Food Name *
              </label>
              <Input
                placeholder="e.g. Steamed Brown Rice"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs"
              >
                {categories.filter((c) => c !== "ALL").map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Portion Size
              </label>
              <Input
                placeholder="e.g. 1 medium bowl (100g cooked)"
                value={portion}
                onChange={(e) => setPortion(e.target.value)}
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Calories (kcal)
              </label>
              <Input
                type="number"
                value={calories}
                onChange={(e) => setCalories(Number(e.target.value))}
              />
            </div>
          </div>

          {/* Macros */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Carbs (g)
              </label>
              <Input
                type="number"
                value={carbs}
                onChange={(e) => setCarbs(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Protein (g)
              </label>
              <Input
                type="number"
                value={protein}
                onChange={(e) => setProtein(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Fat (g)
              </label>
              <Input
                type="number"
                value={fat}
                onChange={(e) => setFat(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Fiber (g)
              </label>
              <Input
                type="number"
                value={fiber}
                onChange={(e) => setFiber(Number(e.target.value))}
              />
            </div>
          </div>

          {/* Glycemic Index */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Glycemic Index (0 - 100)
              </label>
              <Input
                type="number"
                value={glycemicIndex}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setGlycemicIndex(val);
                  if (val <= 55) setGiCategory("Low");
                  else if (val <= 69) setGiCategory("Medium");
                  else setGiCategory("High");
                }}
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                GI Category
              </label>
              <select
                value={giCategory}
                onChange={(e) => setGiCategory(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs"
              >
                <option value="Low">Low (&le; 55)</option>
                <option value="Medium">Medium (56 - 69)</option>
                <option value="High">High (&ge; 70)</option>
              </select>
            </div>
          </div>

          {/* Condition Safety Flags */}
          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-2">
              Clinical Condition Compatibility
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <label className="flex items-center gap-2 p-2 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isDiabeticSafe}
                  onChange={(e) => setIsDiabeticSafe(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>Diabetic Safe</span>
              </label>
              <label className="flex items-center gap-2 p-2 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isHypertensionSafe}
                  onChange={(e) => setIsHypertensionSafe(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>BP / Low Na</span>
              </label>
              <label className="flex items-center gap-2 p-2 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isGlutenFree}
                  onChange={(e) => setIsGlutenFree(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>Gluten Free</span>
              </label>
              <label className="flex items-center gap-2 p-2 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isRenalFriendly}
                  onChange={(e) => setIsRenalFriendly(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>Renal Friendly</span>
              </label>
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Clinical / Dietary Guidance Note
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Rich in manganese and complex fibers. Excellent slow-release carb option."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSaveFood} disabled={isSaving}>
              {isSaving ? "Saving..." : editingFood ? "Save Changes" : "Create Food"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
