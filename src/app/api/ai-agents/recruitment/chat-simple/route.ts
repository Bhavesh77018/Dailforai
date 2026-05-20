import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createServerClient } from '@/lib/supabase';
import crypto from 'crypto';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { message, profile, userId } = await req.json();

    const system = `You are an expert AI Recruitment Assistant powered by GPT-4o. 
You help HR professionals and recruiters with candidate evaluation, job design, and hiring strategy.
${profile ? `\nCurrently active candidate profile:\n${JSON.stringify(profile, null, 2)}` : ''}

Capabilities:
- Analyze candidate profiles and assess fit
- Design interview questions tailored to roles
- Explain the 100-point scoring rubric (Non-Negotiables 40pts, Skills 30pts, Interview 20pts, Location 10pts)
- Create comprehensive Job Postings
- Generate "Magic Application Links" for automatic candidate screening

IMPORTANT INSTRUCTION FOR MAGIC LINKS: 
If the user asks to "create a magic link", "post a job", or similar, you MUST generate a professional Job Posting and then append a shareable "DialforAI Magic Application Link" at the very end. 
Format it EXACTLY like this (as plain text, NOT markdown link):
**🚀 Magic Application Link:** https://dialforai.com/apply/req-<generate-random-id>
*(Candidates who apply via this link will automatically undergo technical screening and 100-point scoring by DialforAI.)*

Be concise, professional, and data-driven. If a user pastes a URL, tell them to use it directly in the chat (the system handles URL scraping automatically).`;

    const res = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'system', content: system }, { role: 'user', content: message }],
      temperature: 0.4,
      max_tokens: 800,
    });

    let reply = res.choices[0]?.message?.content || 'No response.';
    
    // Inject real random ID if magic link was generated
    const hasMagicLink = reply.includes('<generate-random-id>');
    const reqId = crypto.randomBytes(4).toString('hex');
    let activityMessage = `Chat: ${message.substring(0, 40)}...`;

    if (hasMagicLink) {
      reply = reply.replace(/<generate-random-id>/g, reqId);
      activityMessage = `Generated Job Posting & Magic Link: req-${reqId}`;
    }

    // Store ALL interactions in dashboard via agent_runs using Service Role to ensure it bypasses constraints if necessary, but link it to the user_id
    if (userId) {
      const supabaseServer = createServerClient();
      await supabaseServer.from('agent_runs').insert({
        user_id: userId,
        agent_type: 'recruitment',
        status: 'completed',
        input_data: { message: activityMessage, reqId: hasMagicLink ? reqId : undefined },
        output_data: { reply },
        duration_ms: 1200
      });
    }

    return NextResponse.json({ reply });
  } catch (error: any) {
    return NextResponse.json({ reply: `Error: ${error.message}` }, { status: 500 });
  }
}
