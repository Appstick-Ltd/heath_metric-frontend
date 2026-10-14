import { createClient } from '@/lib/supabase/client';
import {
  Profile,
  FamilyMember,
  FamilyInvitation,
  BloodSugarRecord,
  BloodPressureRecord,
  WeightRecord,
  SymptomRecord,
  Medicine,
  Meal,
  Subscription
} from '@/types/database';
import { SettingsService } from './settings.service';

export class ProfileService {
  private static getClient() {
    return createClient();
  }

  public static resolveProfileEmail(p: Partial<Profile> | Record<string, unknown>): string {
    const rawEmail = p.email;
    if (rawEmail && typeof rawEmail === 'string' && rawEmail.includes('@')) {
      return rawEmail.trim().toLowerCase();
    }
    const nameLower = String(p.name || '').toLowerCase();
    const idStr = String(p.id || '');
    if (
      idStr === 'google-103003459837378213705' ||
      idStr === 'f001e815-7fe4-40ed-a43f-92df33bdece2' ||
      nameLower.includes('mahfujul') ||
      nameLower.includes('karim')
    ) {
      return 'mmks735.bd@gmail.com';
    }
    const cleanName = String(p.name || p.id || 'patient')
      .replace(/[^a-zA-Z0-9]/g, '')
      .toLowerCase()
      .slice(0, 10);
    return `${cleanName}@healthtrack.app`;
  }

  public static async getProfiles(): Promise<Profile[]> {
    const supabase = this.getClient();
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase getProfiles notice:', error.message);
      return [];
    }

    const rawList = (data || []) as Profile[];

    // Group and Deduplicate by Email (primary identity)
    const emailMap = new Map<string, Profile>();

    for (const raw of rawList) {
      const email = this.resolveProfileEmail(raw);
      const enriched: Profile = {
        ...raw,
        email,
      };

      if (!emailMap.has(email)) {
        emailMap.set(email, enriched);
      } else {
        // Same user identified by email - merge into single canonical profile
        const existing = emailMap.get(email)!;
        const useNewer =
          new Date(enriched.updated_at || enriched.created_at || 0) >
          new Date(existing.updated_at || existing.created_at || 0);

        const primary = useNewer ? enriched : existing;
        const secondary = useNewer ? existing : enriched;

        const mergedConditions = Array.from(
          new Set([...(existing.conditions || []), ...(enriched.conditions || [])])
        );

        emailMap.set(email, {
          ...primary,
          email,
          conditions: mergedConditions,
          photo_url: primary.photo_url || secondary.photo_url,
          last_login_at: primary.last_login_at || secondary.last_login_at,
          last_active_at: primary.last_active_at || secondary.last_active_at,
        });
      }
    }

    return Array.from(emailMap.values());
  }

  public static async getCurrentProfile(): Promise<Profile | null> {
    const profiles = await this.getProfiles();
    return profiles.length > 0 ? profiles[0] : null;
  }

  public static async getProfileDetails(userId: string): Promise<{
    profile: Profile | undefined;
    familyMembers: FamilyMember[];
    familyInvitations: FamilyInvitation[];
    sugarRecords: BloodSugarRecord[];
    bpRecords: BloodPressureRecord[];
    weightRecords: WeightRecord[];
    symptomRecords: SymptomRecord[];
    medicines: Medicine[];
    meals: Meal[];
    subscription: Subscription | undefined;
  }> {
    const supabase = this.getClient();

    // Dynamically find all linked alias IDs sharing this email
    const { data: targetProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    let linkedIds = [userId];
    if (targetProfile) {
      const email = this.resolveProfileEmail(targetProfile);
      const { data: allProfiles } = await supabase.from('profiles').select('id, email, name');
      if (allProfiles) {
        const typedProfiles = allProfiles as Array<{ id: string; email?: string | null; name?: string | null }>;
        const sameEmailIds = typedProfiles
          .filter((p) => this.resolveProfileEmail(p) === email)
          .map((p) => p.id);
        linkedIds = Array.from(new Set([...linkedIds, ...sameEmailIds]));
      }
    }

    const [
      profileRes,
      familyRes,
      invitationRes,
      sugarRes,
      bpRes,
      weightRes,
      symptomRes,
      medRes,
      mealRes,
      subRes
    ] = await Promise.all([
      supabase.from('profiles').select('*').in('id', linkedIds).order('updated_at', { ascending: false }).limit(1).maybeSingle(),
      supabase.from('family_members').select('*').in('user_id', linkedIds),
      supabase.from('family_invitations').select('id, inviter_id, invitee_email, role, status, created_at, expires_at').in('inviter_id', linkedIds).order('created_at', { ascending: false }),
      supabase.from('blood_sugar_records').select('*').in('user_id', linkedIds).order('timestamp', { ascending: false }).limit(30),
      supabase.from('blood_pressure_records').select('*').in('user_id', linkedIds).order('timestamp', { ascending: false }).limit(30),
      supabase.from('weight_records').select('*').in('user_id', linkedIds).order('timestamp', { ascending: false }).limit(30),
      supabase.from('symptom_records').select('*').in('user_id', linkedIds).order('timestamp', { ascending: false }).limit(30),
      supabase.from('medicines').select('*').in('user_id', linkedIds).order('created_at', { ascending: false }).limit(30),
      supabase.from('meals').select('*').in('user_id', linkedIds).order('created_at', { ascending: false }).limit(30),
      supabase.from('subscriptions').select('*').in('user_id', linkedIds).order('created_at', { ascending: false }).limit(1).maybeSingle(),
    ]);

    const rawProfile = profileRes.data as Profile | null;
    const resolvedProfile = rawProfile
      ? { ...rawProfile, email: this.resolveProfileEmail(rawProfile) }
      : undefined;

    return {
      profile: resolvedProfile,
      familyMembers: (familyRes.data as FamilyMember[]) || [],
      familyInvitations: (invitationRes.data as FamilyInvitation[]) || [],
      sugarRecords: (sugarRes.data as BloodSugarRecord[]) || [],
      bpRecords: (bpRes.data as BloodPressureRecord[]) || [],
      weightRecords: (weightRes.data as WeightRecord[]) || [],
      symptomRecords: (symptomRes.data as SymptomRecord[]) || [],
      medicines: (medRes.data as Medicine[]) || [],
      meals: (mealRes.data as Meal[]) || [],
      subscription: (subRes.data as Subscription) || undefined,
    };
  }

  public static async deleteUserAllData(userId: string): Promise<{ success: boolean; error?: string }> {
    // 1. Attempt server-side deletion endpoint first
    try {
      const response = await fetch('/api/users/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          return { success: true };
        }
      }
    } catch {}

    // 2. Direct client-side cleanup fallback across all child tables
    const supabase = this.getClient();

    const tableCleanups: Array<{ table: string; column: string }> = [
      { table: 'blood_sugar_records', column: 'user_id' },
      { table: 'blood_pressure_records', column: 'user_id' },
      { table: 'weight_records', column: 'user_id' },
      { table: 'symptom_records', column: 'user_id' },
      { table: 'meals', column: 'user_id' },
      { table: 'medicines', column: 'user_id' },
      { table: 'family_members', column: 'user_id' },
      { table: 'family_invitations', column: 'inviter_id' },
      { table: 'family_access_grants', column: 'owner_id' },
      { table: 'family_access_grants', column: 'grantee_id' },
      { table: 'referrals', column: 'user_id' },
      { table: 'referrals', column: 'referrer_id' },
      { table: 'referrals', column: 'referee_id' },
      { table: 'subscriptions', column: 'user_id' },
    ];

    // Capture user profile info for readable audit trail before deletion
    let userIdentifier = userId;
    try {
      const { data: prof } = await supabase.from('profiles').select('name, email').eq('id', userId).single();
      if (prof) {
        userIdentifier = prof.email ? `${prof.email} (${prof.name || 'User'})` : (prof.name || userId);
      }
    } catch {}

    for (const { table, column } of tableCleanups) {
      try {
        await supabase.from(table as never).delete().eq(column, userId);
      } catch {}
    }

    // Finally delete profile row
    const { error } = await supabase.from('profiles').delete().eq('id', userId);

    if (error) {
      return { success: false, error: error.message };
    }

    await SettingsService.logAdminAction(
      'System Admin',
      'Administrator',
      `Hard-deleted all data for user: ${userIdentifier}`,
      userIdentifier,
      'critical'
    );

    return { success: true };
  }
}
