import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ejzyqswhgbknunqmvofq.supabase.co';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_wZ8u2PtygwdAndB_QFW_Mw_np6iteKk';

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
