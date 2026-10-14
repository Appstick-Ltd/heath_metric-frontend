export interface KPISummary {
  totalUsers: number;
  userGrowthPercent: number;
  criticalAlerts: number;
  criticalAlertsChange: number;
  activeMedications: number;
  medicationsChange: number;
  vitalsLoggedToday: number;
  vitalsGrowthPercent: number;
  referralConversionRate: number;
  referralGrowthPercent: number;
  // Backward compatibility fields
  activeProUsers?: number;
  proGrowthPercent?: number;
  mrr?: number;
  mrrGrowthPercent?: number;
}

export interface UserGrowthDataPoint {
  date: string;
  totalUsers: number;
  activeUsers: number;
  vitalsLogged: number;
}

export interface RevenueDataPoint {
  month: string;
  monthlyRevenue: number;
  annualRevenue: number;
  lifetimeRevenue: number;
  total: number;
}

export interface HealthStagingData {
  category: string;
  count: number;
  percentage: number;
  status: 'normal' | 'warning' | 'critical';
  color: string;
}

export interface VitalDistributionData {
  category: string;
  count: number;
  percentage: number;
  color: string;
}

export interface ActivityEvent {
  id: string;
  type: 'vital_alert' | 'user_register' | 'medicine_warning' | 'cloud_sync' | 'referral_claim' | 'subscription_new';
  title: string;
  description: string;
  timestamp: string;
  severity: 'normal' | 'warning' | 'critical';
  user_name?: string;
  user_id?: string;
}
