import { NextRequest, NextResponse } from 'next/server';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

async function supabaseGet(table: string, filter: string) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${filter}`, {
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    }
  });
  return res.json();
}

async function supabaseInsert(table: string, payload: object) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal'   // don't SELECT back — anon role has no SELECT policy
    },
    body: JSON.stringify(payload)
  });
  const text = await res.text();
  return { ok: res.ok, status: res.status, body: text ? JSON.parse(text) : null };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { score, candidate, reqId, warnings, transcript } = body;
    console.log('[submit] START — candidate:', candidate, 'reqId:', reqId, 'score:', score);

    if (!candidate || !reqId) {
      return NextResponse.json({ error: 'candidate and reqId are required' }, { status: 400 });
    }

    // Look up the recruiter from the PUBLIC lookup table
    let recruiterUserId: string | null = null;
    let jobTitle: string | null = null;

    const linkRows = await supabaseGet(
      'recruitment_magic_links',
      `req_id=eq.${encodeURIComponent(reqId)}&select=recruiter_user_id,job_title&limit=1`
    );
    console.log('[submit] Magic link lookup result:', JSON.stringify(linkRows));

    if (Array.isArray(linkRows) && linkRows.length > 0) {
      recruiterUserId = linkRows[0].recruiter_user_id ?? null;
      jobTitle = linkRows[0].job_title ?? null;
    }
    console.log('[submit] recruiterUserId:', recruiterUserId, '| jobTitle:', jobTitle);

    // Insert the candidate interview result via raw REST API
    const insertPayload = {
      user_id: null,           // explicit null — matches RLS "insert_candidate_interviews" policy
      agent_type: 'recruitment',
      status: 'completed',
      input_data: {
        message: `🎯 Candidate Interview: ${candidate}`,
        type: 'candidate_interview',
        reqId,
        candidate,
        jobTitle,
        recruiter_user_id: recruiterUserId
      },
      output_data: {
        score: score ?? 0,
        candidate,
        reqId,
        jobTitle,
        warnings: warnings ?? 0,
        cheatingDetected: (warnings ?? 0) > 0,
        transcript: transcript ?? []
      },
      duration_ms: 5000
    };

    console.log('[submit] Calling Supabase REST insert...');
    const { ok, status, body: insertResult } = await supabaseInsert('agent_runs', insertPayload);

    if (!ok) {
      console.error('[submit] INSERT FAILED — HTTP', status, '—', JSON.stringify(insertResult));
      return NextResponse.json({
        error: 'Database insert failed',
        status,
        details: insertResult
      }, { status: 500 });
    }

    const rowId = Array.isArray(insertResult) ? insertResult[0]?.id : insertResult?.id;
    console.log('[submit] ✅ SUCCESS — row id:', rowId);
    return NextResponse.json({ success: true, id: rowId });

  } catch (err: any) {
    console.error('[submit] EXCEPTION:', err.message, '\n', err.stack);
    return NextResponse.json({ error: err.message ?? 'Unexpected server error' }, { status: 500 });
  }
}
