import { createClient } from '@/lib/supabase/client';
import {
  KPISummary,
  UserGrowthDataPoint,
  RevenueDataPoint,
  ActivityEvent,
} from '@/types/dashboard';
import { normalizeBloodSugar } from './blood-sugar.service';
import { ProfileService } from './profile.service';

interface DbSubscription {
  user_id: string;
  plan_type: string;
  status: string;
  price_paid?: string | null;
  created_at?: string | null;
}

interface DbSugarRecord {
  id: string;
  user_id: string;
  value: number;
  reading_type: string;
  timestamp: string;
}

interface DbBpRecord {
  id: string;
  user_id: string;
  systolic: number;
  diastolic: number;
  pulse?: number | null;
  timestamp: string;
}

interface DbReferral {
  id: string;
  status: string;
  created_at: string;
}

export class DashboardService {
  private static getClient() {
    return createClient();
  }

  public static async getDashboardData(): Promise<{
    kpi: KPISummary;
    userGrowth: UserGrowthDataPoint[];
    revenue: RevenueDataPoint[];
    recentActivities: ActivityEvent[];
  }> {
    const supabase = this.getClient();

    // Query live Supabase tables with exact counts
    const [
      sugarCountRes,
      bpCountRes,
      weightCountRes,
      symCountRes,
      subsRes,
      sugarsRes,
      bpRes,
      referralsRes,
      profiles
    ] = await Promise.all([
      supabase.from('blood_sugar_records').select('*', { count: 'exact', head: true }),
      supabase.from('blood_pressure_records').select('*', { count: 'exact', head: true }),
      supabase.from('weight_records').select('*', { count: 'exact', head: true }),
      supabase.from('symptom_records').select('*', { count: 'exact', head: true }),
      supabase.from('subscriptions').select('user_id, plan_type, status, price_paid, created_at'),
      supabase.from('blood_sugar_records').select('id, user_id, value, reading_type, timestamp').order('timestamp', { ascending: false }).limit(20),
      supabase.from('blood_pressure_records').select('id, user_id, systolic, diastolic, pulse, timestamp').order('timestamp', { ascending: false }).limit(20),
      supabase.from('referrals').select('id, status, created_at'),
      ProfileService.getProfiles(),
    ]);

    const subscriptions = (subsRes.data || []) as DbSubscription[];
    const sugarRecords = (sugarsRes.data || []) as DbSugarRecord[];
    const bpRecords = (bpRes.data || []) as DbBpRecord[];
    const referrals = (referralsRes.data || []) as DbReferral[];

    // Map profiles for name resolution
    const userMap = new Map<string, string>();
    profiles.forEach((p) => {
      userMap.set(p.id, p.name || 'Patient');
      if (p.email) userMap.set(p.email, p.name || 'Patient');
    });

    const totalUsers = profiles.length;
    const activeProUsers = subscriptions.filter(
      (s) => s.status === 'active' && s.plan_type !== 'free'
    ).length;

    let mrr = 0;
    subscriptions.forEach((s) => {
      if (s.status === 'active') {
        const parsedPrice = s.price_paid ? parseFloat(s.price_paid.replace(/[^0-9.]/g, '')) : 0;
        if (s.plan_type === 'monthly') {
          mrr += parsedPrice > 0 ? parsedPrice : 4.99;
        } else if (s.plan_type === 'annual') {
          mrr += (parsedPrice > 0 ? parsedPrice : 39.99) / 12;
        }
      }
    });

    // Exact count of all vitals in database (Sugar + BP + Weight + Symptoms)
    const totalVitalsCount =
      (sugarCountRes.count || 0) +
      (bpCountRes.count || 0) +
      (weightCountRes.count || 0) +
      (symCountRes.count || 0);

    const rewardedReferrals = referrals.filter((r) => r.status === 'rewarded').length;
    const referralConversionRate =
      referrals.length > 0 ? Number(((rewardedReferrals / referrals.length) * 100).toFixed(1)) : 0;

    const kpi: KPISummary = {
      totalUsers,
      userGrowthPercent: totalUsers > 0 ? 100 : 0,
      activeProUsers,
      proGrowthPercent: activeProUsers > 0 ? 100 : 0,
      mrr: Number(mrr.toFixed(2)),
      mrrGrowthPercent: mrr > 0 ? 100 : 0,
      vitalsLoggedToday: totalVitalsCount,
      vitalsGrowthPercent: totalVitalsCount > 0 ? 100 : 0,
      referralConversionRate,
      referralGrowthPercent: 0,
    };

    // User growth timeline generated from actual database profiles
    const now = new Date();
    const userGrowth: UserGrowthDataPoint[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i * 4);
      const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      const countUpToDate = profiles.filter(
        (p) => new Date(p.created_at || now) <= d
      ).length;

      const vitalsUpToDate = [
        ...sugarRecords.filter((s) => new Date(s.timestamp) <= d),
        ...bpRecords.filter((b) => new Date(b.timestamp) <= d),
      ].length;

      const activeUsersCount = profiles.filter((p) => {
        const profileDate = new Date(p.created_at || now);
        return profileDate <= d;
      }).length;

      userGrowth.push({
        date: label,
        totalUsers: countUpToDate,
        activeUsers: activeUsersCount,
        vitalsLogged: vitalsUpToDate,
      });
    }

    // Revenue breakdown from live subscriptions
    let monthlyRevenue = 0;
    let annualRevenue = 0;
    let lifetimeRevenue = 0;

    subscriptions.forEach((s) => {
      if (s.status === 'active') {
        const parsedPrice = s.price_paid ? parseFloat(s.price_paid.replace(/[^0-9.]/g, '')) : 0;
        if (s.plan_type === 'monthly') {
          monthlyRevenue += parsedPrice > 0 ? parsedPrice : 4.99;
        } else if (s.plan_type === 'annual') {
          annualRevenue += parsedPrice > 0 ? parsedPrice : 39.99;
        } else if (s.plan_type === 'lifetime') {
          lifetimeRevenue += parsedPrice > 0 ? parsedPrice : 149.00;
        }
      }
    });

    const revenue: RevenueDataPoint[] = [
      {
        month: 'Current',
        monthlyRevenue: Number(monthlyRevenue.toFixed(2)),
        annualRevenue: Number(annualRevenue.toFixed(2)),
        lifetimeRevenue: Number(lifetimeRevenue.toFixed(2)),
        total: Number((monthlyRevenue + annualRevenue + lifetimeRevenue).toFixed(2)),
      }
    ];

    // Combine latest database activities with normalized glucose & resolved user names
    const recentActivities: ActivityEvent[] = [];

    // Critical/High Sugar alerts
    sugarRecords.forEach((s) => {
      const norm = normalizeBloodSugar(Number(s.value));
      if (norm.category === 'Critical' || norm.category === 'High') {
        const userName = userMap.get(s.user_id) || 'Patient';
        recentActivities.push({
          id: `sugar-${s.id}`,
          type: 'vital_alert',
          title: norm.category === 'Critical' ? `Critical Glucose: ${norm.display}` : `High Glucose: ${norm.display}`,
          description: `${userName} logged ${s.reading_type} reading out of safe range.`,
          timestamp: new Date(s.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          severity: norm.category === 'Critical' ? 'critical' : 'warning',
          user_id: s.user_id,
        });
      }
    });

    // High Blood Pressure alerts from database
    bpRecords.forEach((bp) => {
      if (bp.systolic >= 140 || bp.diastolic >= 90) {
        const userName = userMap.get(bp.user_id) || 'Patient';
        recentActivities.push({
          id: `bp-${bp.id}`,
          type: 'vital_alert',
          title: `Hypertension Spike: ${bp.systolic}/${bp.diastolic} mmHg`,
          description: `Pulse: ${bp.pulse || 72} bpm logged by ${userName}`,
          timestamp: new Date(bp.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          severity: 'warning',
          user_id: bp.user_id,
        });
      }
    });

    // Subscriptions
    subscriptions.slice(0, 3).forEach((sub, i) => {
      const userName = userMap.get(sub.user_id) || 'Patient';
      recentActivities.push({
        id: `sub-${i}`,
        type: 'subscription_new',
        title: `Subscription: ${sub.plan_type?.toUpperCase()} (${sub.price_paid || (sub.plan_type === 'annual' ? '$39.99' : '$4.99')})`,
        description: `Status: ${sub.status} — Active for ${userName}`,
        timestamp: 'Live DB',
        severity: 'normal',
      });
    });

    return {
      kpi,
      userGrowth,
      revenue,
      recentActivities,
    };
  }
}
