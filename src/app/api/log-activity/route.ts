import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ error: 'No auth token provided' }, { status: 401 });
    }

    // Create a client authenticated as the user — fully satisfies RLS
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { global: { headers: { Authorization: `Bearer ${token}` } } }
    );

    const body = await req.json();

    // Get the authenticated user's ID — required by RLS policy `user_id = auth.uid()`
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error('[log-activity] Could not get user from token:', userError?.message);
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }

    const { error } = await supabase.from('agent_runs').insert({
      user_id: user.id,                         // ← must match auth.uid() to pass RLS
      agent_type: body.agent_type || 'recruitment',
      status: 'completed',
      input_data: body.input_data,
      output_data: body.output_data,
      duration_ms: body.duration_ms || 1000
    });

    if (error) {
      console.error('[log-activity] Supabase error:', JSON.stringify(error));
      return NextResponse.json({ error: error.message, details: error }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('[log-activity] Unexpected error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
