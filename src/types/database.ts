export interface Profile {
  id: string;
  name: string;
  age: number;
  gender: string;
  height: number;
  weight: number;
  blood_group: string;
  conditions: string[];
  goals: string[];
  email?: string | null;
  dietary_preference?: string | null;
  photo_url?: string | null;
  avatar_url?: string | null;
  last_login_at?: string | null;
  last_active_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface FamilyMember {
  id: string;
  user_id: string;
  name: string;
  relationship: string;
  role: string;
  age: number;
  gender: string;
  blood_group: string;
  avatar_color_index: number;
  photo_url?: string | null;
  conditions: string[];
  allergies: string[];
  emergency_phone?: string | null;
  notes?: string | null;
  is_primary: boolean;
  created_at?: string;
}

export interface FamilyInvitation {
  id: string;
  inviter_id: string;
  invitee_email: string;
  role: string;
  status: 'pending' | 'accepted' | 'declined' | 'revoked' | 'expired';
  created_at: string;
  expires_at: string;
}

export interface BloodSugarRecord {
  id: string;
  user_id: string;
  member_id?: string;
  value: number;
  reading_type: 'fasting' | 'post_meal' | 'postMeal' | 'bedtime' | 'random' | string;
  timestamp: string;
  unit?: string | null;
  note?: string | null;
}

export interface BloodPressureRecord {
  id: string;
  user_id: string;
  member_id?: string;
  systolic: number;
  diastolic: number;
  pulse?: number;
  timestamp: string;
  note?: string | null;
}

export interface WeightRecord {
  id: string;
  user_id: string;
  member_id?: string;
  weight: number;
  bmi: number;
  timestamp: string;
  note?: string | null;
}

export interface Medicine {
  id: string;
  user_id?: string;
  member_id?: string;
  name: string;
  dosage?: string;
  type?: string;
  frequency?: string;
  schedule_times?: string[];
  instructions?: string | null;
  start_date?: string;
  reminder_enabled?: boolean;
  item_json?: any;
}

export interface Meal {
  id: string;
  user_id: string;
  member_id?: string;
  name: string;
  meal_type: string;
  custom_type_name?: string | null;
  calories: number;
  carbs?: number;
  protein?: number;
  fat?: number;
  time: string;
  is_completed: boolean;
  date?: string;
  foods?: Array<{
    name: string;
    quantity?: string;
    portion?: string;
    calories?: number;
  }>;
}

export interface SymptomRecord {
  id: string;
  user_id: string;
  member_id?: string;
  body_region: string;
  is_front?: boolean;
  vas_score: number;
  sensation_qualities?: string[];
  aggravating_factors?: string[];
  timestamp: string;
  note?: string | null;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan_type: 'free' | 'monthly' | 'annual' | 'lifetime';
  status: 'active' | 'expired' | 'cancelled';
  start_date: string;
  expiry_date?: string | null;
  price_paid: string;
  created_at?: string;
  user_name?: string;
  user_email?: string;
  payment_method?: string | null;
  transaction_id?: string | null;
}

export interface PaymentTransaction {
  id: string;
  user_id: string;
  plan_type: string;
  amount: string;
  currency?: string;
  payment_method?: string | null;
  transaction_id?: string | null;
  status: 'completed' | 'refunded' | 'pending' | 'failed' | string;
  notes?: string | null;
  created_at: string;
}

export interface Referral {
  id: string;
  referrer_id: string;
  referral_code: string;
  referee_id?: string | null;
  status: 'pending' | 'rewarded';
  created_at: string;
  referrer_name?: string;
  referrer_email?: string;
  referee_name?: string;
  referee_email?: string;
}

export interface CMSFoodItem {
  id: string;
  name: string;
  category: string;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  fiber: number;
  glycemic_index: number;
  gi_category: 'Low' | 'Medium' | 'High';
  is_diabetic_safe: boolean;
  is_hypertension_safe: boolean;
  is_gluten_free: boolean;
  is_renal_friendly: boolean;
  description: string;
  recommended_portion: string;
}

export interface MasterMedicinePreset {
  id: string;
  name: string;
  generic_name: string;
  category: string;
  default_dosage: string;
  dosage_type: 'tablet' | 'capsule' | 'syrup' | 'injection' | 'inhaler';
  standard_frequency: string;
  default_times: string[];
  contraindications?: string[];
  notes?: string;
}

export interface AuditLog {
  id: string;
  admin_name: string;
  admin_role: string;
  action: string;
  target: string;
  ip_address: string;
  timestamp: string;
  severity: 'info' | 'warning' | 'critical';
}
