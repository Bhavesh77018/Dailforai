/**
 * logActivity - logs an agent_runs record to Supabase via the user-authenticated API route.
 * This satisfies RLS without needing a service role key.
 */
export async function logActivity(params: {
  agentType: string;
  inputData: Record<string, any>;
  outputData?: Record<string, any>;
  durationMs?: number;
}) {
  try {
    // Get the current session token
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // This runs client-side so we can get the session
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    if (!token) {
      console.warn('[logActivity] No active session, cannot log.');
      return;
    }

    const res = await fetch('/api/log-activity', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        agent_type: params.agentType,
        input_data: params.inputData,
        output_data: params.outputData,
        duration_ms: params.durationMs || 1000
      })
    });

    if (!res.ok) {
      const err = await res.json();
      console.error('[logActivity] Failed:', err);
    }
  } catch (e) {
    console.error('[logActivity] Exception:', e);
  }
}
