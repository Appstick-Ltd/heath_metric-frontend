import { createClient } from '@/lib/supabase/client';
import { CMSFoodItem, MasterMedicinePreset } from '@/types/database';

export class CmsService {
  private static getClient() {
    return createClient();
  }

  // ==========================================
  // CMS FOODS (NUTRITION & "CAN I EAT?")
  // ==========================================
  public static async getCmsFoods(): Promise<CMSFoodItem[]> {
    const supabase = this.getClient();
    const { data, error } = await supabase
      .from('cms_foods')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.warn('Supabase getCmsFoods notice:', error.message);
      return [];
    }
    return (data || []) as CMSFoodItem[];
  }

  public static async createCmsFood(food: Omit<CMSFoodItem, 'id'>): Promise<boolean> {
    const supabase = this.getClient();
    const { error } = await supabase.from('cms_foods').insert(food);
    return !error;
  }

  public static async updateCmsFood(id: string, food: Partial<CMSFoodItem>): Promise<boolean> {
    const supabase = this.getClient();
    const { error } = await supabase
      .from('cms_foods')
      .update({ ...food, updated_at: new Date().toISOString() })
      .eq('id', id);
    return !error;
  }

  public static async deleteCmsFood(id: string): Promise<boolean> {
    const supabase = this.getClient();
    const { error } = await supabase.from('cms_foods').delete().eq('id', id);
    return !error;
  }

  // ==========================================
  // MASTER MEDICINES PRESETS & DIRECTORY
  // ==========================================
  public static async getMasterMedicines(): Promise<MasterMedicinePreset[]> {
    const supabase = this.getClient();
    const { data, error } = await supabase
      .from('master_medicines')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.warn('Supabase getMasterMedicines notice:', error.message);
      return [];
    }
    return (data || []) as MasterMedicinePreset[];
  }

  public static async createMasterMedicine(med: Omit<MasterMedicinePreset, 'id'>): Promise<boolean> {
    const supabase = this.getClient();
    const { error } = await supabase.from('master_medicines').insert(med);
    return !error;
  }

  public static async updateMasterMedicine(id: string, med: Partial<MasterMedicinePreset>): Promise<boolean> {
    const supabase = this.getClient();
    const { error } = await supabase.from('master_medicines').update(med).eq('id', id);
    return !error;
  }

  public static async deleteMasterMedicine(id: string): Promise<boolean> {
    const supabase = this.getClient();
    const { error } = await supabase.from('master_medicines').delete().eq('id', id);
    return !error;
  }
}
