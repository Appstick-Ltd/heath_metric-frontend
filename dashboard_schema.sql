-- ==============================================================================
-- NutriHealth / HealthMetric Operations Dashboard - Supabase Cloud Migration
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/ejzyqswhgbknunqmvofq/sql
-- ==============================================================================

-- 1. CMS FOODS TABLE (Powers "Can I Eat?" and Meal Planner in mobile app & dashboard)
CREATE TABLE IF NOT EXISTS public.cms_foods (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'General',
    calories INTEGER NOT NULL DEFAULT 0,
    carbs NUMERIC NOT NULL DEFAULT 0.0,
    protein NUMERIC NOT NULL DEFAULT 0.0,
    fat NUMERIC NOT NULL DEFAULT 0.0,
    fiber NUMERIC NOT NULL DEFAULT 0.0,
    glycemic_index INTEGER NOT NULL DEFAULT 0,
    gi_category TEXT NOT NULL DEFAULT 'Low', -- 'Low', 'Medium', 'High'
    is_diabetic_safe BOOLEAN DEFAULT TRUE,
    is_hypertension_safe BOOLEAN DEFAULT TRUE,
    is_gluten_free BOOLEAN DEFAULT TRUE,
    is_renal_friendly BOOLEAN DEFAULT TRUE,
    description TEXT,
    recommended_portion TEXT DEFAULT '1 serving (100g)',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.cms_foods ENABLE ROW LEVEL SECURITY;

-- Allow public read so mobile app users and dashboard visitors can search foods
CREATE POLICY "Allow public read access for cms_foods"
    ON public.cms_foods FOR SELECT
    TO anon, authenticated
    USING (true);

-- Allow authenticated/admin insert and update
CREATE POLICY "Allow write access for authenticated users on cms_foods"
    ON public.cms_foods FOR ALL
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);


-- 2. MASTER MEDICINE PRESETS TABLE (Standard drug directory for mobile reminders)
CREATE TABLE IF NOT EXISTS public.master_medicines (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    generic_name TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'General',
    default_dosage TEXT NOT NULL DEFAULT '500 mg',
    dosage_type TEXT NOT NULL DEFAULT 'tablet', -- 'tablet', 'capsule', 'syrup', 'injection', 'inhaler'
    standard_frequency TEXT NOT NULL DEFAULT 'Once Daily',
    default_times TEXT[] DEFAULT ARRAY['08:00 AM'],
    contraindications TEXT[] DEFAULT '{}',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.master_medicines ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access for master_medicines"
    ON public.master_medicines FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Allow write access on master_medicines"
    ON public.master_medicines FOR ALL
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);


-- 3. ADMIN AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    admin_name TEXT NOT NULL,
    admin_role TEXT NOT NULL DEFAULT 'Admin',
    action TEXT NOT NULL,
    target TEXT,
    ip_address TEXT,
    severity TEXT NOT NULL DEFAULT 'info', -- 'info', 'warning', 'critical'
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read/write on admin_audit_logs"
    ON public.admin_audit_logs FOR ALL
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);


-- 4. APP SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.app_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read on app_settings"
    ON public.app_settings FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Allow write on app_settings"
    ON public.app_settings FOR ALL
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);

-- Insert default app settings if not exists
INSERT INTO public.app_settings (key, value)
VALUES 
  ('maintenance_mode', '{"enabled": false}'::jsonb),
  ('min_app_version', '{"version": "1.2.0"}'::jsonb),
  ('announcement_banner', '{"message": "Welcome to NutriHealth Operations. Real-time database connection established.", "active": true}'::jsonb)
ON CONFLICT (key) DO NOTHING;


-- 5. READ POLICIES FOR ADMIN DASHBOARD ANALYTICS & DIRECTORY
-- In production, the admin dashboard needs to read profiles, subscriptions, referrals, and vitals to display graphs and directory tables.
-- Run these policies so dashboard queries succeed:

-- Ensure photo_url columns exist on profiles and family_members
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS photo_url TEXT;
ALTER TABLE public.family_members ADD COLUMN IF NOT EXISTS photo_url TEXT;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow read access for admin dashboard on profiles') THEN
        CREATE POLICY "Allow read access for admin dashboard on profiles" ON public.profiles FOR SELECT TO anon, authenticated USING (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow read access for admin dashboard on subscriptions') THEN
        CREATE POLICY "Allow read access for admin dashboard on subscriptions" ON public.subscriptions FOR SELECT TO anon, authenticated USING (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow read access for admin dashboard on referrals') THEN
        CREATE POLICY "Allow read access for admin dashboard on referrals" ON public.referrals FOR SELECT TO anon, authenticated USING (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow read access for admin dashboard on blood_sugar_records') THEN
        CREATE POLICY "Allow read access for admin dashboard on blood_sugar_records" ON public.blood_sugar_records FOR SELECT TO anon, authenticated USING (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow read access for admin dashboard on blood_pressure_records') THEN
        CREATE POLICY "Allow read access for admin dashboard on blood_pressure_records" ON public.blood_pressure_records FOR SELECT TO anon, authenticated USING (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow read access for admin dashboard on weight_records') THEN
        CREATE POLICY "Allow read access for admin dashboard on weight_records" ON public.weight_records FOR SELECT TO anon, authenticated USING (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow read access for admin dashboard on symptom_records') THEN
        CREATE POLICY "Allow read access for admin dashboard on symptom_records" ON public.symptom_records FOR SELECT TO anon, authenticated USING (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow read access for admin dashboard on family_members') THEN
        CREATE POLICY "Allow read access for admin dashboard on family_members" ON public.family_members FOR SELECT TO anon, authenticated USING (true);
    END IF;
END $$;


-- 6. INITIAL OFFICIAL CLINICAL SEED DATA (Foods & Medicine Presets)
INSERT INTO public.cms_foods (name, category, calories, carbs, protein, fat, fiber, glycemic_index, gi_category, is_diabetic_safe, is_hypertension_safe, is_gluten_free, is_renal_friendly, description, recommended_portion)
VALUES 
  ('Steamed Brown Rice', 'Grains & Cereals', 111, 23.0, 2.6, 0.9, 1.8, 50, 'Low', true, true, true, true, 'Whole grain rich in manganese and fiber. Excellent complex carbohydrate option for diabetic control.', '1 medium bowl (100g cooked)'),
  ('Baked Salmon Fillet', 'Fish & Poultry', 208, 0.0, 22.0, 13.0, 0.0, 0, 'Low', true, true, true, false, 'Rich in EPA/DHA Omega-3 fatty acids for arterial elasticity and cardiovascular health.', '1 fillet (150g)'),
  ('Green Moong Dal (Lentil)', 'Legumes & Pulses', 105, 18.5, 7.2, 0.4, 4.5, 38, 'Low', true, true, true, false, 'Plant-based lean protein with soluble dietary fiber to stabilize insulin release.', '1 bowl (150ml)'),
  ('Fresh Spinach (Palak)', 'Vegetables', 23, 3.6, 2.9, 0.4, 2.2, 15, 'Low', true, true, true, false, 'Packed with potassium and magnesium that assist in arterial dilation and BP regulation.', '1 cup cooked (180g)'),
  ('Green Apple (Granny Smith)', 'Fruits', 52, 14.0, 0.3, 0.2, 2.4, 39, 'Low', true, true, true, true, 'High pectin content delays gastric emptying, attenuating sugar spikes.', '1 small apple (120g)'),
  ('Raw Unsalted Almonds', 'Nuts & Seeds', 164, 6.0, 6.0, 14.0, 3.5, 10, 'Low', true, true, true, true, 'Monounsaturated healthy fats providing satiety and vascular support.', '10-12 nuts (28g)')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.master_medicines (name, generic_name, category, default_dosage, dosage_type, standard_frequency, default_times, contraindications, notes)
VALUES 
  ('Metformin Hydrochloride', 'Metformin HCl', 'Antidiabetic (Biguanide)', '500 mg', 'tablet', 'Twice Daily', ARRAY['08:00 AM', '08:00 PM'], ARRAY['Severe Renal Impairment', 'Metabolic Acidosis'], 'Take with or immediately after meals to reduce GI irritation.'),
  ('Amlodipine Besylate', 'Amlodipine', 'Antihypertensive (CCB)', '5 mg', 'tablet', 'Once Daily', ARRAY['09:00 AM'], ARRAY['Severe Aortic Stenosis'], 'Monitor for pedal edema in lower extremities.'),
  ('Atorvastatin Calcium', 'Atorvastatin', 'Lipid-Lowering (Statin)', '10 mg', 'tablet', 'Once Daily (Bedtime)', ARRAY['10:00 PM'], ARRAY['Active Liver Disease'], 'Best administered at bedtime when hepatic cholesterol synthesis is highest.'),
  ('Lisinopril', 'Lisinopril', 'ACE Inhibitor', '10 mg', 'tablet', 'Once Daily', ARRAY['08:00 AM'], ARRAY['History of Angioedema', 'Pregnancy'], 'Monitor serum potassium and renal functions periodically.'),
  ('Cholecalciferol (Vitamin D3)', 'Vitamin D3', 'Vitamin Supplement', '40,000 IU', 'capsule', 'Once Weekly', ARRAY['10:00 AM'], ARRAY['Hypercalcemia'], 'Take with a meal containing healthy fats for optimal absorption.')
ON CONFLICT (id) DO NOTHING;

-- 7. USER ACTIVITY & LAST LOGIN TRACKING
-- Ensure last_login_at and last_active_at columns exist on public.profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_active_at TIMESTAMPTZ DEFAULT NOW();

-- Auto-sync last_sign_in_at from auth.users to public.profiles
CREATE OR REPLACE FUNCTION public.handle_user_login_sync()
RETURNS trigger AS $$
BEGIN
  UPDATE public.profiles
  SET last_login_at = NEW.last_sign_in_at,
      last_active_at = NOW()
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_sign_in ON auth.users;
CREATE TRIGGER on_auth_user_sign_in
  AFTER UPDATE OF last_sign_in_at ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_user_login_sync();
