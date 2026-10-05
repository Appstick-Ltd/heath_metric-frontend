import { createClient } from '@/lib/supabase/client';
import { Referral } from '@/types/database';
import { ProfileService } from './profile.service';
import { SettingsService } from './settings.service';

export class ReferralService {
  private static getClient() {
    return createClient();
  }

  public static async getReferrals(): Promise<Referral[]> {
    const supabase = this.getClient();
    const [refsRes, profsRes] = await Promise.all([
      supabase.from('referrals').select('*').order('created_at', { ascending: false }),
      supabase.from('profiles').select('id, name, email'),
    ]);

    if (refsRes.error) {
      console.warn('Supabase getReferrals notice:', refsRes.error.message);
      return [];
    }

    const profMap = new Map<string, { name: string; email: string }>();
    const profs = (profsRes.data || []) as Array<{ id: string; name?: string | null; email?: string | null }>;
    profs.forEach((p) => {
      profMap.set(p.id, {
        name: p.name || 'User',
        email: ProfileService.resolveProfileEmail(p),
      });
    });

    const rawList = (refsRes.data || []) as Referral[];
    const seenBaseCodes = new Set<string>();
    const deduplicatedList: Referral[] = [];

    for (const r of rawList) {
      if (!r.referee_id) {
        if (!seenBaseCodes.has(r.referral_code)) {
          seenBaseCodes.add(r.referral_code);
          deduplicatedList.push(r);
        }
      } else {
        deduplicatedList.push(r);
      }
    }

    return deduplicatedList.map((r) => {
      const refInfo = profMap.get(r.referrer_id);
      const refereeInfo = r.referee_id ? profMap.get(r.referee_id) : null;
      return {
        ...r,
        referrer_name: refInfo?.name || 'Referrer',
        referrer_email: refInfo?.email || '',
        referee_name: refereeInfo?.name,
        referee_email: refereeInfo?.email || '',
      };
    });
  }

  public static async updateReferralStatus(
    referralId: string,
    status: 'rewarded' | 'pending'
  ): Promise<boolean> {
    const supabase = this.getClient();
    const { error } = await supabase
      .from('referrals')
      .update({ status })
      .eq('id', referralId);

    return !error;
  }

  public static async createReferral(
    referrerId: string,
    referralCode: string,
    refereeId?: string,
    status: 'pending' | 'rewarded' = 'pending'
  ): Promise<{ success: boolean; error?: string }> {
    const supabase = this.getClient();
    const payload: Record<string, unknown> = {
      referrer_id: referrerId,
      referral_code: referralCode.trim().toUpperCase(),
      status,
      created_at: new Date().toISOString(),
    };
    if (refereeId && refereeId.trim()) {
      payload.referee_id = refereeId.trim();
    }
    const { error } = await supabase.from('referrals').insert(payload);
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  }

  public static async deleteReferral(referralId: string): Promise<boolean> {
    const supabase = this.getClient();
    const { error } = await supabase.from('referrals').delete().eq('id', referralId);
    return !error;
  }

  public static async grantProSubscription(
    userId: string,
    durationDays = 30,
    note = 'Referral Reward'
  ): Promise<{ success: boolean; error?: string }> {
    const supabase = this.getClient();
    const now = new Date();
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + durationDays);

    const payload = {
      user_id: userId,
      plan_type: 'monthly',
      status: 'active',
      price_paid: 'Reward ($0.00)',
      start_date: now.toISOString(),
      expiry_date: expiry.toISOString(),
      updated_at: now.toISOString(),
    };

    try {
      // Check existing subscription
      const { data: existing } = await supabase
        .from('subscriptions')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();

      if (existing?.id) {
        const { error } = await supabase
          .from('subscriptions')
          .update(payload)
          .eq('user_id', userId);
        if (error) return { success: false, error: error.message };
      } else {
        const { error } = await supabase.from('subscriptions').insert(payload);
        if (error) return { success: false, error: error.message };
      }

      await SettingsService.logAdminAction(
        'System Admin',
        'Administrator',
        `Granted ${durationDays}-day VIP Pro subscription to user ${userId} (${note})`,
        userId,
        'info'
      );

      return { success: true };
    } catch (e: unknown) {
      const err = e as Error;
      return { success: false, error: err?.message || 'Failed to grant subscription' };
    }
  }
}
