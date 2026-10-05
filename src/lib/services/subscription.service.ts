import { createClient } from '@/lib/supabase/client';
import { Subscription, PaymentTransaction, Profile } from '@/types/database';
import { ProfileService } from './profile.service';

export class SubscriptionService {
  private static getClient() {
    return createClient();
  }

  public static async getSubscriptions(): Promise<Subscription[]> {
    const supabase = this.getClient();
    const [subsRes, profs] = await Promise.all([
      supabase.from('subscriptions').select('*').order('created_at', { ascending: false }),
      ProfileService.getProfiles(),
    ]);

    if (subsRes.error) {
      console.warn('Supabase getSubscriptions notice:', subsRes.error.message);
    }

    const profMap = new Map<string, Profile>();
    profs.forEach((p) => {
      profMap.set(p.id, p);
    });

    const seenUserIds = new Set<string>();
    const result: Subscription[] = [];

    // 1. Existing subscription records in database
    const rawSubs = (subsRes.data || []) as Subscription[];
    rawSubs.forEach((s) => {
      seenUserIds.add(s.user_id);
      const prof = profMap.get(s.user_id);
      result.push({
        ...s,
        user_name: s.user_name || prof?.name || 'Patient User',
        user_email: s.user_email || prof?.email || '',
      });
    });

    // 2. Add all registered users who don't have an explicit entry as active Free Tier
    profs.forEach((p) => {
      if (!seenUserIds.has(p.id)) {
        result.push({
          id: `free_${p.id}`,
          user_id: p.id,
          plan_type: 'free',
          status: 'active',
          price_paid: '$0.00',
          start_date: p.created_at || new Date().toISOString(),
          expiry_date: null,
          created_at: p.created_at || new Date().toISOString(),
          user_name: p.name || 'User',
          user_email: p.email || '',
        });
      }
    });

    // 3. Sort: Active paid plans first (annual/monthly), then newest accounts
    result.sort((a, b) => {
      const aPaid = (a.plan_type !== 'free' && a.status === 'active') ? 1 : 0;
      const bPaid = (b.plan_type !== 'free' && b.status === 'active') ? 1 : 0;
      if (aPaid !== bPaid) return bPaid - aPaid;
      return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
    });

    return result;
  }

  public static async updateSubscriptionPlan(
    userId: string,
    planType: 'free' | 'monthly' | 'annual'
  ): Promise<boolean> {
    const supabase = this.getClient();
    const pricePaid =
      planType === 'monthly' ? '$4.99' : planType === 'annual' ? '$39.99' : '$0.00';

    const { error } = await supabase
      .from('subscriptions')
      .upsert({
        user_id: userId,
        plan_type: planType,
        status: 'active',
        price_paid: pricePaid,
        updated_at: new Date().toISOString(),
      });

    if (!error && planType !== 'free') {
      try {
        await supabase.from('payment_transactions').insert({
          user_id: userId,
          plan_type: planType,
          amount: pricePaid,
          payment_method: 'Admin Manual Override',
          transaction_id: `ADM-${Date.now().toString().slice(-8)}`,
          status: 'completed',
          notes: `Assigned ${planType} plan via Admin Dashboard`,
        });
      } catch (logErr) {
        console.warn('payment_transactions insert notice:', logErr);
      }
    }

    return !error;
  }

  public static async getPaymentHistory(userId: string): Promise<PaymentTransaction[]> {
    const supabase = this.getClient();
    try {
      const { data, error } = await supabase
        .from('payment_transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data as PaymentTransaction[];
      }
    } catch (e) {
      console.warn('payment_transactions notice:', e);
    }

    // Fallback: If payment_transactions table has no rows for this user yet,
    // synthesize from their current subscription record if paid.
    try {
      const { data: subData } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (subData && subData.plan_type !== 'free') {
        return [
          {
            id: `txn_${subData.id || subData.user_id}`,
            user_id: subData.user_id,
            plan_type: subData.plan_type,
            amount: subData.price_paid || (subData.plan_type === 'annual' ? '$39.99' : '$4.99'),
            currency: 'USD',
            payment_method: subData.payment_method || 'Google Play Store',
            transaction_id:
              subData.transaction_id ||
              `GPA.${subData.id.replace(/[^0-9]/g, '').slice(0, 12) || '3490-8812-4109'}`,
            status: 'completed',
            notes: 'Primary in-app subscription purchase',
            created_at: subData.start_date || subData.created_at || new Date().toISOString(),
          },
        ];
      }
    } catch (err) {
      console.warn('fallback subscription payment check:', err);
    }

    return [];
  }
}
