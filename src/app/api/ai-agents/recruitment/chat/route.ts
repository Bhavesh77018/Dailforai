import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { message, profile } = await req.json();

    const systemPrompt = `You are an expert AI Recruitment Assistant powered by GPT-4o. 
You help recruiters analyze candidate profiles, assess fit, and make data-driven hiring decisions.
${profile ? `\nCurrently loaded candidate profile:\n${JSON.stringify(profile, null, 2)}` : ''}

Be concise, professional, and data-driven. Use bullet points for clarity.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message },
      ],
      temperature: 0.4,
      max_tokens: 800,
    });

    return NextResponse.json({ reply: completion.choices[0]?.message?.content || 'No response.' });
  } catch (error: any) {
    return NextResponse.json({ reply: `Error: ${error.message}` }, { status: 500 });
  }
}
