import { createClient } from '@/lib/supabase/client';
import { normalizeBloodSugar } from './blood-sugar.service';

export interface DashboardNotification {
  id: string;
  type: 'critical_vital' | 'new_user' | 'subscription' | 'referral';
  title: string;
  description: string;
  timestamp: string;
  severity: 'critical' | 'warning' | 'info';
  read: boolean;
}

export class NotificationService {
  private static getClient() {
    return createClient();
  }

  public static async getRecentNotifications(): Promise<DashboardNotification[]> {
    const supabase = this.getClient();
    const notifications: DashboardNotification[] = [];

    try {
      const [sugarRes, bpRes, profileRes, subRes, refRes, allProfilesRes] = await Promise.all([
        supabase
          .from('blood_sugar_records')
          .select('id, user_id, value, reading_type, timestamp')
          .order('timestamp', { ascending: false })
          .limit(10),
        supabase
          .from('blood_pressure_records')
          .select('id, user_id, systolic, diastolic, timestamp')
          .or('systolic.gte.140,diastolic.gte.90')
          .order('timestamp', { ascending: false })
          .limit(5),
        supabase
          .from('profiles')
          .select('id, name, email, created_at')
          .order('created_at', { ascending: false })
          .limit(4),
        supabase
          .from('subscriptions')
          .select('id, user_id, plan_type, status, created_at')
          .neq('plan_type', 'free')
          .order('created_at', { ascending: false })
          .limit(4),
        supabase
          .from('referrals')
          .select('id, referrer_id, referee_id, referral_code, created_at')
          .not('referee_id', 'is', null)
          .order('created_at', { ascending: false })
          .limit(4),
        supabase
          .from('profiles')
          .select('id, name, email'),
      ]);

      const profMap = new Map<string, { name: string; email: string }>();
      const allProfiles = (allProfilesRes.data || []) as Array<{ id: string; name?: string | null; email?: string | null }>;
      allProfiles.forEach((p) => {
        profMap.set(p.id, { name: p.name || 'Patient', email: p.email || '' });
      });

      // Normalize glucose readings to prevent false positives from mmol/L readings
      const sugars = (sugarRes.data || []) as Array<{ id: string; user_id: string; value: number | string; reading_type: string; timestamp: string }>;
      sugars.forEach((s) => {
        const norm = normalizeBloodSugar(Number(s.value));
        const user = profMap.get(s.user_id);
        const userName = user?.name || 'Patient';
        if (norm.category === 'Critical' || norm.category === 'High') {
          const isLow = norm.valMgDl < 70;
          notifications.push({
            id: `sugar-${s.id}`,
            type: 'critical_vital',
            title: isLow ? `⚠️ Low Glucose: ${norm.display}` : `🚨 High Glucose: ${norm.display}`,
            description: `${userName} logged ${s.reading_type} reading`,
            timestamp: s.timestamp,
            severity: norm.category === 'Critical' ? 'critical' : 'warning',
            read: false,
          });
        }
      });

      // Hypertension spikes
      const bps = (bpRes.data || []) as Array<{ id: string; user_id: string; systolic: number | string; diastolic: number | string; timestamp: string }>;
      bps.forEach((bp) => {
        const user = profMap.get(bp.user_id);
        const userName = user?.name || 'Patient';
        notifications.push({
          id: `bp-${bp.id}`,
          type: 'critical_vital',
          title: `🩺 Hypertension: ${bp.systolic}/${bp.diastolic} mmHg`,
          description: `${userName} exceeded safe threshold`,
          timestamp: bp.timestamp,
          severity: 'warning',
          read: false,
        });
      });

      // New referral claims
      const refs = (refRes.data || []) as Array<{ id: string; referrer_id: string; referee_id?: string | null; referral_code: string; created_at: string }>;
      refs.forEach((r) => {
        const referee = r.referee_id ? profMap.get(r.referee_id) : undefined;
        const referrer = profMap.get(r.referrer_id);
        const friendName = referee?.name || 'Friend';
        const inviterName = referrer?.name || 'Referrer';
        notifications.push({
          id: `ref-${r.id}`,
          type: 'referral',
          title: `🎁 Referral Claimed: ${friendName}`,
          description: `Joined using ${inviterName}'s code (${r.referral_code}) • +100 coins`,
          timestamp: r.created_at,
          severity: 'info',
          read: false,
        });
      });

      // New user signups
      const newProfiles = (profileRes.data || []) as Array<{ id: string; name?: string | null; email?: string | null; created_at: string }>;
      newProfiles.forEach((p) => {
        notifications.push({
          id: `user-${p.id}`,
          type: 'new_user',
          title: `👤 New User: ${p.name || 'Unnamed Patient'}`,
          description: p.email ? `Registered with ${p.email}` : 'Profile created in database',
          timestamp: p.created_at,
          severity: 'info',
          read: false,
        });
      });

      // New pro subscriptions
      const newSubs = (subRes.data || []) as Array<{ id: string; user_id: string; plan_type?: string | null; status?: string | null; created_at: string }>;
      newSubs.forEach((s) => {
        const user = profMap.get(s.user_id);
        const userName = user?.name || 'User';
        notifications.push({
          id: `sub-${s.id}`,
          type: 'subscription',
          title: `👑 New ${(s.plan_type || 'PRO').toUpperCase()} Pro Member`,
          description: `${userName} activated VIP Pro (${s.status || 'active'})`,
          timestamp: s.created_at,
          severity: 'info',
          read: false,
        });
      });

    } catch {
      // Silently return empty if DB unreachable
    }

    // Sort by most recent
    return notifications.sort(
      (a, b) => new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime()
    );
  }
}
