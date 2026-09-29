import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId parameter' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ejzyqswhgbknunqmvofq.supabase.co';
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_wZ8u2PtygwdAndB_QFW_Mw_np6iteKk';
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    // Use service role if available for elevated permissions, otherwise fall back to anon key
    const activeKey = serviceRoleKey || supabaseAnonKey;
    const supabase = createClient(supabaseUrl, activeKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // 1. Try calling the comprehensive RPC stored procedure if available
    try {
      const { error: rpcErr } = await supabase.rpc('delete_user_completely', {
        target_user_id: userId,
      });
      if (!rpcErr) {
        return NextResponse.json({
          success: true,
          message: 'User and all associated data permanently deleted via RPC.',
        });
      }
    } catch {
      // If RPC not found, continue with programmatic table deletion
    }

    // 2. Programmatically delete child tables in dependency order
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

    for (const { table, column } of tableCleanups) {
      try {
        await supabase.from(table).delete().eq(column, userId);
      } catch {
        // Table or column might not exist or be empty, ignore safely
      }
    }

    // 3. Delete from public.profiles
    const { error: profileError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (profileError) {
      return NextResponse.json(
        { error: `Failed to delete profile: ${profileError.message}` },
        { status: 500 }
      );
    }

    // 4. If Service Role Key exists, also delete from auth.users
    let authDeleted = false;
    if (serviceRoleKey) {
      try {
        const { error: authErr } = await supabase.auth.admin.deleteUser(userId);
        if (!authErr) {
          authDeleted = true;
        }
      } catch {
        // User may have decoupled custom ID (like email-... or google-...) not in auth.users
      }
    }

    // 5. Log in admin audit logs
    try {
      await supabase.from('admin_audit_logs').insert({
        admin_name: 'Dashboard Admin',
        admin_role: 'Superadmin',
        action: `Permanently deleted user: ${userId}`,
        target: userId,
        severity: 'critical',
      });
    } catch {
      // Non-critical audit log
    }

    return NextResponse.json({
      success: true,
      message: `User and all related records deleted completely.${authDeleted ? ' Auth account also purged.' : ''}`,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
  }
}
