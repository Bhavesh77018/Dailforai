import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { reqId, jobTitle } = await req.json();
    if (!reqId) return NextResponse.json({ error: 'reqId required' }, { status: 400 });

    // Create auth'd client so we know who the recruiter is
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { global: { headers: { Authorization: `Bearer ${token}` } } }
    );

    // Get the recruiter's user id from their session
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Invalid session' }, { status: 401 });

    // Upsert: if same reqId generated again, just update
    const { error } = await supabase
      .from('recruitment_magic_links')
      .upsert({ req_id: reqId, recruiter_user_id: user.id, job_title: jobTitle || null }, { onConflict: 'req_id' });

    if (error) {
      console.error('[register-magic-link] Error:', JSON.stringify(error));
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log('[register-magic-link] Registered req_id:', reqId, 'for recruiter:', user.id);
    return NextResponse.json({ success: true, reqId, recruiterId: user.id });
  } catch (err: any) {
    console.error('[register-magic-link] Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
