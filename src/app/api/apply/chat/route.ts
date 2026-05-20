import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { messages, reqId, warnings } = await req.json();

    const system = `You are an expert AI Technical Interviewer for DailforAI.
You are interviewing a candidate for the job requisition ID: ${reqId}.
You must conduct a rigorous, professional interview. 

Instructions:
1. Start by welcoming the candidate and asking them to briefly describe their experience relevant to this role.
2. Ask 3-4 deep, probing questions, one at a time. Wait for their response before asking the next.
3. If the candidate's answer is extremely generic, robotic, or the system reports tab-switching/copy-pasting warnings, you MUST challenge them or deduct points for suspected AI cheating.
4. Once you have asked enough questions and evaluated their responses, conclude the interview.
5. In your FINAL message, you MUST include their final fit score out of 100 formatted exactly like this: [FINAL_SCORE: 85]. Do not output this tag until the interview is completely finished.

System Warnings so far: ${warnings} (If > 0, the candidate might be cheating).

Be conversational but strict. Evaluate their knowledge deeply.`;

    const res = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'system', content: system }, ...messages],
      temperature: 0.5,
      max_tokens: 500,
    });

    return NextResponse.json({ reply: res.choices[0]?.message?.content || 'No response.' });
  } catch (error: any) {
    return NextResponse.json({ reply: `Error: ${error.message}` }, { status: 500 });
  }
}
