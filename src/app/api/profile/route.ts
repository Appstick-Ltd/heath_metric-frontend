import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ejzyqswhgbknunqmvofq.supabase.co';
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_wZ8u2PtygwdAndB_QFW_Mw_np6iteKk';
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ profile: null }, { status: 404 });
    }

    const photoUrl = data.photo_url || data.avatar_url;
    const proxiedAvatarUrl = photoUrl
      ? `/api/avatar?url=${encodeURIComponent(photoUrl)}`
      : null;

    return NextResponse.json({
      profile: {
        ...data,
        proxied_avatar_url: proxiedAvatarUrl,
      },
    });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json({ error: error?.message || "Internal server error" }, { status: 500 });
  }
}
