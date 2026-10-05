import { createClient } from '@/lib/supabase/client';
import { VitalDistributionData } from '@/types/dashboard';
import { normalizeBloodSugar } from './blood-sugar.service';

export class HealthAnalyticsService {
  private static getClient() {
    return createClient();
  }

  public static async getHealthDistributionData(): Promise<{
    sugarDistribution: VitalDistributionData[];
    bpDistribution: VitalDistributionData[];
    symptomAggregates: Array<{ region: string; count: number; avgVas: number }>;
  }> {
    const supabase = this.getClient();

    const [sugarRes, bpRes, symptomRes] = await Promise.all([
      supabase.from('blood_sugar_records').select('value'),
      supabase.from('blood_pressure_records').select('systolic, diastolic'),
      supabase.from('symptom_records').select('body_region, vas_score'),
    ]);

    const sugars = (sugarRes.data || []) as Array<{ value: number | string }>;
    const bps = (bpRes.data || []) as Array<{ systolic: number | string; diastolic: number | string }>;
    const symptoms = (symptomRes.data || []) as Array<{ body_region?: string | null; vas_score?: number | string | null }>;

    // Compute live Blood Sugar ADA bands normalized from mmol/L or mg/dL
    let normalSugar = 0, preSugar = 0, highSugar = 0, critSugar = 0;
    sugars.forEach((s) => {
      const norm = normalizeBloodSugar(Number(s.value));
      if (norm.valMgDl < 100) normalSugar++;
      else if (norm.valMgDl <= 125) preSugar++;
      else if (norm.valMgDl < 200) highSugar++;
      else critSugar++;
    });

    const totalSugars = Math.max(sugars.length, 1);
    const sugarDistribution: VitalDistributionData[] = [
      { category: 'Normal (< 100 mg/dL / < 5.5 mmol/L)', count: normalSugar, percentage: Math.round((normalSugar / totalSugars) * 100), color: '#10b981' },
      { category: 'Pre-diabetic (100-125 / 5.6-6.9)', count: preSugar, percentage: Math.round((preSugar / totalSugars) * 100), color: '#f59e0b' },
      { category: 'High (126-199 / 7.0-11.0)', count: highSugar, percentage: Math.round((highSugar / totalSugars) * 100), color: '#f97316' },
      { category: 'Critical (>= 200 / >= 11.1)', count: critSugar, percentage: Math.round((critSugar / totalSugars) * 100), color: '#ef4444' },
    ];

    // Compute live Blood Pressure AHA bands
    let optBP = 0, elevBP = 0, stg1BP = 0, stg2BP = 0;
    bps.forEach((b) => {
      const s = Number(b.systolic);
      const d = Number(b.diastolic);
      if (s < 120 && d < 80) optBP++;
      else if (s <= 129 && d < 80) elevBP++;
      else if (s <= 139 || d <= 89) stg1BP++;
      else stg2BP++;
    });

    const totalBPs = Math.max(bps.length, 1);
    const bpDistribution: VitalDistributionData[] = [
      { category: 'Optimal (< 120/80)', count: optBP, percentage: Math.round((optBP / totalBPs) * 100), color: '#10b981' },
      { category: 'Elevated (120-129/<80)', count: elevBP, percentage: Math.round((elevBP / totalBPs) * 100), color: '#3b82f6' },
      { category: 'Stage 1 HTN (130-139)', count: stg1BP, percentage: Math.round((stg1BP / totalBPs) * 100), color: '#f59e0b' },
      { category: 'Stage 2 HTN (>= 140/90)', count: stg2BP, percentage: Math.round((stg2BP / totalBPs) * 100), color: '#ef4444' },
    ];

    const regionMap: Record<string, { count: number; totalVas: number }> = {};
    symptoms.forEach((sym) => {
      const r = sym.body_region || 'Unspecified';
      if (!regionMap[r]) regionMap[r] = { count: 0, totalVas: 0 };
      regionMap[r].count += 1;
      regionMap[r].totalVas += Number(sym.vas_score || 5);
    });

    const symptomAggregates = Object.entries(regionMap).map(([region, stat]) => ({
      region,
      count: stat.count,
      avgVas: Number((stat.totalVas / stat.count).toFixed(1)),
    }));

    return {
      sugarDistribution,
      bpDistribution,
      symptomAggregates,
    };
  }
}
