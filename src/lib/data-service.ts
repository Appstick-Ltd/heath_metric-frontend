/**
 * DataService - Unified Facade for Platform Clinical & Management Operations
 * Implements Clean Architecture with Separation of Concerns:
 * - BloodSugar: normalization and ADA bands
 * - Dashboard: aggregate analytics, MRR, engagement KPIs
 * - Profiles: patient directory, aliases, and deletion
 * - Subscriptions: tiers, manual overrides, payment transactions
 * - Referrals: viral referral trees, fraud checks, VIP grants
 * - CMS: food database and master medication directory
 * - HealthAnalytics: glycemic, BP, and symptom population distributions
 * - Settings: operational toggles and audit logging
 * - Notifications: real-time patient vital and system alerts
 */

import { ProfileService } from './services/profile.service';
import { DashboardService } from './services/dashboard.service';
import { SubscriptionService } from './services/subscription.service';
import { ReferralService } from './services/referral.service';
import { CmsService } from './services/cms.service';
import { HealthAnalyticsService } from './services/health-analytics.service';
import { SettingsService } from './services/settings.service';
import { NotificationService } from './services/notification.service';
import { normalizeBloodSugar } from './services/blood-sugar.service';

import type {
  Profile,
  FamilyMember,
  FamilyInvitation,
  BloodSugarRecord,
  BloodPressureRecord,
  WeightRecord,
  SymptomRecord,
  Medicine,
  Meal,
  Subscription,
  PaymentTransaction,
  Referral,
  AuditLog,
  CMSFoodItem,
  MasterMedicinePreset,
} from '@/types/database';

import type {
  KPISummary,
  UserGrowthDataPoint,
  RevenueDataPoint,
  ActivityEvent,
  VitalDistributionData,
} from '@/types/dashboard';

// Re-export blood sugar normalizer for backward compatibility
export { normalizeBloodSugar };

export class DataService {
  // 1. Dashboard & Aggregates
  public static async getDashboardData(): Promise<{
    kpi: KPISummary;
    userGrowth: UserGrowthDataPoint[];
    revenue: RevenueDataPoint[];
    recentActivities: ActivityEvent[];
  }> {
    return DashboardService.getDashboardData();
  }

  // 2. User & Profiles
  public static resolveProfileEmail(p: Partial<Profile> | Record<string, unknown>): string {
    return ProfileService.resolveProfileEmail(p);
  }

  public static async getProfiles(): Promise<Profile[]> {
    return ProfileService.getProfiles();
  }

  public static async getCurrentProfile(): Promise<Profile | null> {
    return ProfileService.getCurrentProfile();
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
    return ProfileService.getProfileDetails(userId);
  }

  public static async deleteUserAllData(userId: string): Promise<{ success: boolean; error?: string }> {
    return ProfileService.deleteUserAllData(userId);
  }

  // 3. Subscriptions & Revenue
  public static async getSubscriptions(): Promise<Subscription[]> {
    return SubscriptionService.getSubscriptions();
  }

  public static async updateSubscriptionPlan(
    userId: string,
    planType: 'free' | 'monthly' | 'annual'
  ): Promise<boolean> {
    return SubscriptionService.updateSubscriptionPlan(userId, planType);
  }

  public static async getPaymentHistory(userId: string): Promise<PaymentTransaction[]> {
    return SubscriptionService.getPaymentHistory(userId);
  }

  // 4. Referrals & VIP Rewards
  public static async getReferrals(): Promise<Referral[]> {
    return ReferralService.getReferrals();
  }

  public static async updateReferralStatus(
    referralId: string,
    status: 'rewarded' | 'pending'
  ): Promise<boolean> {
    return ReferralService.updateReferralStatus(referralId, status);
  }

  public static async createReferral(
    referrerId: string,
    referralCode: string,
    refereeId?: string,
    status: 'pending' | 'rewarded' = 'pending'
  ): Promise<{ success: boolean; error?: string }> {
    return ReferralService.createReferral(referrerId, referralCode, refereeId, status);
  }

  public static async deleteReferral(referralId: string): Promise<boolean> {
    return ReferralService.deleteReferral(referralId);
  }

  public static async grantProSubscription(
    userId: string,
    durationDays = 30,
    note = 'Referral Reward'
  ): Promise<{ success: boolean; error?: string }> {
    return ReferralService.grantProSubscription(userId, durationDays, note);
  }

  // 5. CMS Foods
  public static async getCmsFoods(): Promise<CMSFoodItem[]> {
    return CmsService.getCmsFoods();
  }

  public static async createCmsFood(food: Omit<CMSFoodItem, 'id'>): Promise<boolean> {
    return CmsService.createCmsFood(food);
  }

  public static async updateCmsFood(id: string, food: Partial<CMSFoodItem>): Promise<boolean> {
    return CmsService.updateCmsFood(id, food);
  }

  public static async deleteCmsFood(id: string): Promise<boolean> {
    return CmsService.deleteCmsFood(id);
  }

  // 6. Master Medicines
  public static async getMasterMedicines(): Promise<MasterMedicinePreset[]> {
    return CmsService.getMasterMedicines();
  }

  public static async createMasterMedicine(med: Omit<MasterMedicinePreset, 'id'>): Promise<boolean> {
    return CmsService.createMasterMedicine(med);
  }

  public static async updateMasterMedicine(id: string, med: Partial<MasterMedicinePreset>): Promise<boolean> {
    return CmsService.updateMasterMedicine(id, med);
  }

  public static async deleteMasterMedicine(id: string): Promise<boolean> {
    return CmsService.deleteMasterMedicine(id);
  }

  // 7. Population Health Analytics
  public static async getHealthDistributionData(): Promise<{
    sugarDistribution: VitalDistributionData[];
    bpDistribution: VitalDistributionData[];
    symptomAggregates: Array<{ region: string; count: number; avgVas: number }>;
  }> {
    return HealthAnalyticsService.getHealthDistributionData();
  }

  // 8. Audit Logs
  public static async getAuditLogs(): Promise<AuditLog[]> {
    return SettingsService.getAuditLogs();
  }

  public static async logAdminAction(
    adminName: string,
    adminRole: string,
    action: string,
    target?: string,
    severity: 'info' | 'warning' | 'critical' = 'info'
  ): Promise<void> {
    return SettingsService.logAdminAction(adminName, adminRole, action, target, severity);
  }

  // 9. App Settings
  public static async getAppSettings(): Promise<Record<string, unknown>> {
    return SettingsService.getAppSettings();
  }

  public static async updateAppSetting(key: string, value: unknown): Promise<boolean> {
    return SettingsService.updateAppSetting(key, value);
  }

  // 10. Real-time Notifications
  public static async getRecentNotifications() {
    return NotificationService.getRecentNotifications();
  }
}
