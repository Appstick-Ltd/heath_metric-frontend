export interface KPISummary {
  totalUsers: number;
  userGrowthPercent: number;
  activeProUsers: number;
  proGrowthPercent: number;
  mrr: number;
  mrrGrowthPercent: number;
  vitalsLoggedToday: number;
  vitalsGrowthPercent: number;
  referralConversionRate: number;
  referralGrowthPercent: number;
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

export interface VitalDistributionData {
  category: string;
  count: number;
  percentage: number;
  color: string;
}

export interface ActivityEvent {
  id: string;
  type: 'vital_alert' | 'subscription_new' | 'user_register' | 'referral_claim' | 'medicine_warning';
  title: string;
  description: string;
  timestamp: string;
  severity: 'normal' | 'warning' | 'critical';
  user_name?: string;
  user_id?: string;
}
