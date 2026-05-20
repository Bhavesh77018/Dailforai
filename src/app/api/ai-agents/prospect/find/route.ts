import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createServerClient } from '@/lib/supabase';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const PROSPECT_SYSTEM = `You are an elite AI Prospect Finder and Business Intelligence Agent.

Given a description of an ideal target (role, industry, company size, location, etc.), you:
1. Generate detailed, realistic prospect profiles based on the criteria
2. Provide actionable intelligence on each prospect
3. Identify likely pain points and triggers
4. Suggest outreach strategies

ALWAYS respond with valid JSON:
{
  "reply": "Summary of what you found and your research strategy",
  "prospects": [
    {
      "name": "Full Name",
      "role": "Job Title",
      "company": "Company Name",
      "location": "City, Country",
      "email": "likely email format or null",
      "linkedin": "LinkedIn URL pattern or null",
      "companySize": "1-10 | 11-50 | 51-200 | 201-1000 | 1000+",
      "industry": "Industry vertical",
      "score": 85,
      "why": "Why this person matches the criteria",
      "painPoints": ["pain point 1", "pain point 2"],
      "trigger": "Recent event or signal that makes them a good prospect",
      "outreachTip": "Specific advice for approaching this person"
    }
  ],
  "searchStrategy": "Explanation of how to find more like these",
  "totalEstimate": 500
}

Generate 3-5 highly realistic prospects per query. Score from 0-100 based on ideal fit.
If conversation continues, refine or expand the prospect list.

IMPORTANT: Make prospects realistic and specific. Include actual-sounding names, companies relevant to the industry, and specific pain points.`;

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  const supabase = createServerClient();
  let runId: string | null = null;

  try {
    const { query, conversationHistory = [] } = await req.json();

    // Log run
    const { data: runData } = await supabase.from('agent_runs').insert({
      agent_type: 'prospect',
      status: 'running',
      input_data: { query },
    }).select('id').single();
    runId = runData?.id;

    const messages = [
      { role: 'system' as const, content: PROSPECT_SYSTEM },
      ...conversationHistory.slice(-6),
      { role: 'user' as const, content: query },
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages,
      temperature: 0.6,
      response_format: { type: 'json_object' },
    });

    const parsed = JSON.parse(completion.choices[0]?.message?.content || '{}');

    // Save prospects to DB
    if (parsed.prospects?.length) {
      const rows = parsed.prospects.map((p: any) => ({
        name: p.name,
        company: p.company,
        role: p.role,
        email: p.email,
        location: p.location,
        linkedin_url: p.linkedin,
        skills: [],
        source_type: 'ai_generated',
        score: p.score,
        tags: p.painPoints || [],
        notes: p.why,
        status: 'new',
        agent_run_id: runId,
      }));
      await supabase.from('prospects').insert(rows);
    }

    if (runId) {
      await supabase.from('agent_runs').update({
        status: 'completed',
        output_data: { prospectsCount: parsed.prospects?.length || 0, reply: parsed.reply },
        duration_ms: Date.now() - startTime,
        completed_at: new Date().toISOString(),
      }).eq('id', runId);
    }

    return NextResponse.json(parsed);
  } catch (error: any) {
    if (runId) {
      const supabase = createServerClient();
      await supabase.from('agent_runs').update({
        status: 'failed',
        error_message: error.message,
        duration_ms: Date.now() - startTime,
      }).eq('id', runId);
    }
    return NextResponse.json({ reply: `Error: ${error.message}`, prospects: [] }, { status: 500 });
  }
}
