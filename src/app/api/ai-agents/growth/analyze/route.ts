import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `You are a Senior Business Development Manager and Growth Intelligence Analyst with 15+ years of B2B experience. You think like a top-tier BDM consultant — data-driven, specific, and commercially sharp.

Given a company profile and their stated business needs, return ONLY a valid JSON object (no markdown, no explanation, raw JSON only) with this exact structure:

{
  "companyProfile": {
    "overview": "2-3 sentence punchy company overview",
    "coreServices": ["service1", "service2", "service3"],
    "targetMarkets": ["market1", "market2"],
    "valueProposition": "What makes this company unique in one sentence"
  },
  "icp": {
    "idealClients": [
      { "type": "Company type", "size": "Employee range", "reason": "Specific reason they need this company's services" }
    ],
    "buyerPersonas": [
      { "title": "Job Title", "department": "Department", "painPoint": "Their specific pain point", "trigger": "What triggers them to buy" }
    ],
    "painPoints": ["pain1", "pain2", "pain3", "pain4"]
  },
  "marketOpportunity": {
    "summary": "Concise market opportunity summary",
    "estimatedMarketSize": "e.g. $2.3B TAM in US IT staffing",
    "growthRecommendations": ["Specific recommendation 1", "Specific recommendation 2", "Specific recommendation 3", "Specific recommendation 4", "Specific recommendation 5"]
  },
  "leads": [
    {
      "company": "Real company name",
      "industry": "Industry vertical",
      "location": "City, Country",
      "size": "Employee count range",
      "score": 92,
      "whyMatch": "Specific reason this company is a perfect match",
      "hiringSignal": "Specific growth/hiring signal detected",
      "contactType": "VP of Talent Acquisition",
      "linkedinSearch": "site:linkedin.com VP Talent Acquisition [Company Name]",
      "outreachAngle": "Very specific outreach angle in one sentence"
    }
  ],
  "competitors": [
    {
      "name": "Competitor company name",
      "positioning": "How they position themselves in market",
      "strengths": "What they genuinely do well",
      "weakness": "Specific weakness or gap you can exploit",
      "clients": "Types of clients they typically win",
      "differentiation": "How the user's company can beat them"
    }
  ],
  "outreachIntelligence": {
    "bestContacts": [
      { "title": "Job Title", "why": "Why this person is the decision maker", "approach": "Specific approach to use" }
    ],
    "coldEmailTemplate": "Subject: [Specific subject line relevant to their pain]\\n\\nHi [First Name],\\n\\n[Opening hook - reference something specific about their company]\\n\\n[Value proposition - 2 sentences max]\\n\\n[Specific ask - soft CTA]\\n\\nBest,\\n[Your Name]",
    "linkedinMessage": "Exact LinkedIn connection request message (under 300 chars)",
    "followUpStrategy": ["Follow-up 1 (Day 3): ...", "Follow-up 2 (Day 7): ...", "Follow-up 3 (Day 14): ..."]
  },
  "growthStrategy": {
    "immediate": ["0-30 day action 1", "0-30 day action 2", "0-30 day action 3"],
    "shortTerm": ["30-90 day action 1", "30-90 day action 2", "30-90 day action 3"],
    "longTerm": ["90+ day action 1", "90+ day action 2", "90+ day action 3"]
  },
  "insights": {
    "topInsight": "The single most important strategic insight",
    "urgentAction": "Most urgent action to take THIS WEEK with specific detail",
    "biggestOpportunity": "The biggest growth opportunity identified with specifics",
    "warningSign": "One risk or blind spot the company should be aware of"
  }
}

CRITICAL RULES:
- Generate exactly 8-12 leads, all highly relevant and scored 60-99
- Use REAL company names for leads (Fortune 500, mid-market, or well-known companies)
- Make everything hyper-specific to the stated business needs
- Scores: 90-99 = strong match, 75-89 = good match, 60-74 = moderate match
- Never use placeholder text like [Company] — use actual company names
- For IT staffing/recruitment companies, focus on companies actively hiring at scale`;

export async function POST(req: NextRequest) {
  try {
    const { companyName, website, linkedin, industry, location, size, services, businessNeeds, userId } = await req.json();

    if (!businessNeeds && !companyName) {
      return NextResponse.json({ error: 'Please provide at least your company name and business needs.' }, { status: 400 });
    }

    const userPrompt = `Analyze this company and generate growth intelligence:

COMPANY PROFILE:
- Company Name: ${companyName || 'Not provided'}
- Website: ${website || 'Not provided'}
- LinkedIn: ${linkedin || 'Not provided'}
- Industry: ${industry || 'Not provided'}
- Location: ${location || 'Not provided'}
- Company Size: ${size || 'Not provided'}
- Services / What We Do: ${services || 'Not provided'}

BUSINESS NEEDS (from their team):
${businessNeeds || 'General business growth, lead generation, and client acquisition'}

Generate a comprehensive growth intelligence report. Make the leads VERY specific to their business needs. If they mention healthcare clients, give healthcare companies. If they mention IT staffing, give companies hiring contractors at scale. Use real company names.`;

    const res = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.65,
      max_tokens: 4000,
      response_format: { type: 'json_object' }
    });

    const content = res.choices[0]?.message?.content || '{}';
    const data = JSON.parse(content);

    return NextResponse.json({ success: true, data, companyName });
  } catch (error: any) {
    console.error('[growth/analyze] Error:', error);
    return NextResponse.json({ error: error.message || 'Analysis failed' }, { status: 500 });
  }
}
