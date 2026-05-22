import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createServerClient } from '@/lib/supabase';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const GROWTH_SYSTEM = `You are DialforAI's elite AI Growth Agent (Senior Business Development Consultant).

Your goal is to help businesses scale, acquire clients, refine their Ideal Customer Profile (ICP), design cold outreach strategies, perform competitor positioning analysis, and identify immediate growth wins.

When interacting with the user, ALWAYS respond with valid JSON in this format:
{
  "reply": "Your conversational advice (formatted in Markdown, using bullet points and clear bold headings if appropriate)",
  "insights": {
    "topInsight": "One line summarizing the core strategic insight for the user's situation (or null if not applicable)",
    "urgentAction": "The single most critical action the user should take next (or null if not applicable)",
    "biggestOpportunity": "The most lucrative opportunity identified (or null if not applicable)"
  }
}

Keep your reply commercially sharp, actionable, and tailored to the user's specific query. Use realistic examples and specific B2B strategies for their target industry.`;

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  const supabase = createServerClient();
  let runId: string | null = null;

  try {
    const { message, conversationHistory = [] } = await req.json();

    // Log the run in agent_runs
    const { data: runData } = await supabase.from('agent_runs').insert({
      agent_type: 'growth',
      status: 'running',
      input_data: { message },
    }).select('id').single();
    runId = runData?.id;

    const messages = [
      { role: 'system' as const, content: GROWTH_SYSTEM },
      ...conversationHistory.slice(-6),
      { role: 'user' as const, content: message },
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages,
      temperature: 0.7,
      response_format: { type: 'json_object' },
    });

    const parsed = JSON.parse(completion.choices[0]?.message?.content || '{}');

    // Update run as completed
    if (runId) {
      await supabase.from('agent_runs').update({
        status: 'completed',
        output_data: parsed,
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
    return NextResponse.json({ reply: `Error: ${error.message}`, insights: null }, { status: 500 });
  }
}
