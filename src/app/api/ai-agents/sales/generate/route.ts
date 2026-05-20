import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createServerClient } from '@/lib/supabase';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SALES_SYSTEM = `You are an elite AI Sales Agent specialized in writing high-converting B2B outreach emails and messages.

Your capabilities:
1. Write personalized cold outreach emails
2. Write follow-up sequences
3. Write LinkedIn connection messages
4. Analyze prospect pain points
5. Suggest subject lines with high open rates
6. Adapt tone: professional, friendly, direct, consultative

When generating an email, ALWAYS respond with valid JSON in this format:
{
  "reply": "Brief explanation of what you created and why",
  "emailGenerated": true,
  "email": {
    "subject": "Email subject line",
    "body": "Full email body with proper formatting",
    "tone": "professional | friendly | direct | consultative",
    "callToAction": "What you want them to do"
  }
}

When NOT generating an email (e.g., answering questions, refining), respond with:
{
  "reply": "Your conversational response",
  "emailGenerated": false
}

IMPORTANT RULES:
- Never use generic templates. Always personalize.
- Keep emails under 200 words unless asked otherwise.
- Include a clear, low-friction CTA.
- Use the prospect's name, company, or context whenever possible.
- Subject lines must be under 50 characters.`;

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  const supabase = createServerClient();
  let runId: string | null = null;

  try {
    const { message, conversationHistory = [] } = await req.json();

    // Log the run
    const { data: runData } = await supabase.from('agent_runs').insert({
      agent_type: 'sales',
      status: 'running',
      input_data: { message },
    }).select('id').single();
    runId = runData?.id;

    const messages = [
      { role: 'system' as const, content: SALES_SYSTEM },
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

    // Save email to DB if generated
    if (parsed.emailGenerated && parsed.email) {
      await supabase.from('sales_outreach').insert({
        subject: parsed.email.subject,
        email_body: parsed.email.body,
        tone: parsed.email.tone,
        purpose: message.slice(0, 100),
        agent_run_id: runId,
        status: 'draft',
      });
    }

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
    return NextResponse.json({ reply: `Error: ${error.message}`, emailGenerated: false }, { status: 500 });
  }
}
