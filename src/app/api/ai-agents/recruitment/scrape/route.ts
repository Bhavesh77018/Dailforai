import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createServerClient } from '@/lib/supabase';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ─── System Prompt for Extraction ────────────────────────────────────────────
const SCRAPE_SYSTEM_PROMPT = `You are an expert at extracting structured professional profile data from raw web content.

Your job is to synthesize data from multiple sources (JSON-LD metadata, reader text, search snippets) into a clean profile JSON.

Return ONLY valid JSON with these fields (use null for anything not found — NEVER guess or hallucinate):

{
  "name": "Full name",
  "headline": "Professional headline",
  "email": "Email if visible",
  "phone": "Phone if visible",
  "location": "City, Country",
  "currentRole": "Current job title",
  "currentCompany": "Current employer",
  "summary": "Professional summary or About section",
  "skills": ["skill1", "skill2"],
  "workHistory": [
    {
      "role": "Job Title",
      "company": "Company Name",
      "type": "full-time | internship | part-time | contract",
      "duration": "Sep 2024 - Aug 2025 (1 yr)",
      "description": "Key responsibilities"
    }
  ],
  "education": [
    {
      "degree": "B.Tech in Computer Science",
      "institution": "Maharaja Surajmal Institute of Technology",
      "year": "Jul 2021 - May 2025",
      "grade": "8.99 CGPA"
    }
  ],
  "certifications": ["cert1"],
  "languages": ["English", "Hindi"],
  "endorsements": ["Leadership", "React.js"],
  "sourceType": "linkedin | naukri | github | portfolio | resume | other",
  "restricted_view": false
}

RULES:
- Do NOT add placeholder text like "[Not specified]". Use null.
- For workHistory.type: "full-time" = permanent role, "internship" = intern role.
- Extract EXACT dates from content. Do NOT calculate or estimate years.
- If the content contains "Sign in", "Join LinkedIn", or "Create account", set restricted_view: true.
- Extract all skills including those in education skill tags.`;

// ─── Utility: Detect platform ─────────────────────────────────────────────────
function detectPlatform(url: string): 'linkedin' | 'naukri' | 'github' | 'other' {
  if (url.includes('linkedin.com')) return 'linkedin';
  if (url.includes('naukri.com')) return 'naukri';
  if (url.includes('github.com')) return 'github';
  return 'other';
}

// ─── Core: Multi-Source Scrape ────────────────────────────────────────────────
async function deepScrapeUrl(url: string): Promise<{ pageText: string; htmlContent: string; searchSnippets: string }> {
  const jinaUrl = `https://r.jina.ai/${url}`;
  let pageText = '';
  let htmlContent = '';
  let searchSnippets = '';

  const [textRes, htmlRes, searchRes] = await Promise.allSettled([
    fetch(jinaUrl, {
      headers: { 'Accept': 'text/plain', 'X-Return-Format': 'text', 'X-No-Cache': 'true' },
      signal: AbortSignal.timeout(15000),
    }),
    fetch(jinaUrl, {
      headers: { 'Accept': 'text/html', 'X-Return-Format': 'html', 'X-No-Cache': 'true' },
      signal: AbortSignal.timeout(15000),
    }),
    fetch(`https://s.jina.ai/${encodeURIComponent(url)}`, {
      headers: { 'Accept': 'text/plain', 'X-No-Cache': 'true' },
      signal: AbortSignal.timeout(10000),
    }),
  ]);

  if (textRes.status === 'fulfilled' && textRes.value.ok) {
    pageText = await textRes.value.text();
    if (pageText.length > 25000) pageText = pageText.slice(0, 25000);
  }
  if (htmlRes.status === 'fulfilled' && htmlRes.value.ok) {
    htmlContent = await htmlRes.value.text();
  }
  if (searchRes.status === 'fulfilled' && searchRes.value.ok) {
    searchSnippets = await searchRes.value.text();
    if (searchSnippets.length > 8000) searchSnippets = searchSnippets.slice(0, 8000);
  }

  return { pageText, htmlContent, searchSnippets };
}

// ─── Extract JSON-LD blocks from HTML ─────────────────────────────────────────
function extractJsonLd(htmlContent: string): any[] {
  if (!htmlContent) return [];
  const blocks: any[] = [];
  const regex = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;
  let match;
  while ((match = regex.exec(htmlContent)) !== null) {
    try {
      blocks.push(JSON.parse(match[1].trim()));
    } catch {}
  }
  return blocks;
}

// ─── GPT Extraction with Thinking Phase ──────────────────────────────────────
async function extractWithGPT(url: string, knowledgeBase: string): Promise<any> {
  const firstPass = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: SCRAPE_SYSTEM_PROMPT },
      { role: 'user', content: `Profile URL: ${url}\n\n${knowledgeBase}` },
    ],
    temperature: 0.05,
    response_format: { type: 'json_object' },
  });

  let extracted = JSON.parse(firstPass.choices[0]?.message?.content || '{}');

  const needsDeepDive = !extracted.workHistory?.length || !extracted.education?.length || extracted.restricted_view;

  if (needsDeepDive) {
    const secondPass = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: SCRAPE_SYSTEM_PROMPT + `\n\nSECOND PASS — The first extraction missed work history or education. 
Look EXTREMELY carefully through the SEARCH ENGINE SNIPPETS and PAGE TEXT for:
- Any mention of company names, job titles, or employment dates
- Any mention of universities, colleges, or degrees
- Any skill endorsements or listed technologies
Even partial data beats null. Previous extraction: ${JSON.stringify(extracted)}`,
        },
        { role: 'user', content: `Profile URL: ${url}\n\n${knowledgeBase}` },
      ],
      temperature: 0.05,
      response_format: { type: 'json_object' },
    });
    const refined = JSON.parse(secondPass.choices[0]?.message?.content || '{}');
    if ((refined.workHistory?.length || 0) > (extracted.workHistory?.length || 0)) extracted.workHistory = refined.workHistory;
    if ((refined.education?.length || 0) > (extracted.education?.length || 0)) extracted.education = refined.education;
    if ((refined.skills?.length || 0) > (extracted.skills?.length || 0)) extracted.skills = refined.skills;
    extracted.name = extracted.name || refined.name;
    extracted.email = extracted.email || refined.email;
    extracted.phone = extracted.phone || refined.phone;
    extracted.location = extracted.location || refined.location;
    extracted.currentRole = extracted.currentRole || refined.currentRole;
    extracted.currentCompany = extracted.currentCompany || refined.currentCompany;
    extracted.summary = extracted.summary || refined.summary;
  }

  return extracted;
}

// ─── Generate structured resumeMarkdown ─────────────────────────────────────
function generateResumeMarkdown(extracted: any): string {
  const lines: string[] = [];

  if (extracted.name) lines.push(`# ${extracted.name}`);
  if (extracted.headline) lines.push(`**${extracted.headline}**`);
  const contacts = [extracted.email, extracted.phone, extracted.location].filter(Boolean).join(' · ');
  if (contacts) lines.push(contacts);
  lines.push('');

  if (extracted.summary) {
    lines.push('## Summary');
    lines.push(extracted.summary);
    lines.push('');
  }

  if (extracted.workHistory?.length) {
    lines.push('## Experience');
    for (const job of extracted.workHistory) {
      lines.push(`### ${job.role} — ${job.company} *(${job.type})*`);
      if (job.duration) lines.push(`📅 ${job.duration}`);
      if (job.description) lines.push(job.description);
      lines.push('');
    }
  }

  if (extracted.education?.length) {
    lines.push('## Education');
    for (const edu of extracted.education) {
      lines.push(`### ${edu.degree}`);
      lines.push(`🏛️ ${edu.institution}`);
      if (edu.year) lines.push(`📅 ${edu.year}`);
      if (edu.grade) lines.push(`🎓 Grade: ${edu.grade}`);
      lines.push('');
    }
  }

  if (extracted.skills?.length) {
    lines.push('## Skills');
    lines.push(extracted.skills.join(', '));
    lines.push('');
  }

  if (extracted.certifications?.length) {
    lines.push('## Certifications');
    for (const c of extracted.certifications) lines.push(`- ${c}`);
    lines.push('');
  }

  return lines.join('\n');
}

// ─── POST /api/ai-agents/recruitment/scrape ───────────────────────────────────
export async function POST(req: NextRequest) {
  const startTime = Date.now();
  const supabase = createServerClient();
  let runId: string | null = null;

  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required.' }, { status: 400 });
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url.startsWith('http') ? url : `https://${url}`);
    } catch {
      return NextResponse.json({ error: 'Invalid URL format.' }, { status: 400 });
    }

    // Log agent run
    const { data: runData } = await supabase.from('agent_runs').insert({
      agent_type: 'recruitment',
      status: 'running',
      input_data: { url },
    }).select('id').single();
    runId = runData?.id;

    const cleanUrl = parsedUrl.toString();
    const { pageText, htmlContent, searchSnippets } = await deepScrapeUrl(cleanUrl);
    const jsonLdBlocks = extractJsonLd(htmlContent);

    const knowledgeBase = [
      jsonLdBlocks.length > 0 ? `=== LINKEDIN/SEO JSON-LD METADATA ===\n${JSON.stringify(jsonLdBlocks)}` : null,
      pageText ? `=== PROFILE PAGE TEXT ===\n${pageText}` : null,
      searchSnippets ? `=== SEARCH ENGINE SNIPPETS ===\n${searchSnippets}` : null,
    ]
      .filter(Boolean)
      .join('\n\n---\n\n');

    if (!knowledgeBase || knowledgeBase.length < 50) {
      if (runId) await supabase.from('agent_runs').update({ status: 'failed', error_message: 'No content returned', duration_ms: Date.now() - startTime }).eq('id', runId);
      return NextResponse.json(
        { error: 'The profile returned no content. It may require login or be private.' },
        { status: 422 }
      );
    }

    const extractedProfile = await extractWithGPT(cleanUrl, knowledgeBase);
    extractedProfile.profileUrl = cleanUrl;
    extractedProfile.sourceType = detectPlatform(cleanUrl);

    const resumeMarkdown = generateResumeMarkdown(extractedProfile);

    // Save prospect to Supabase
    await supabase.from('prospects').upsert({
      name: extractedProfile.name,
      company: extractedProfile.currentCompany,
      role: extractedProfile.currentRole,
      email: extractedProfile.email,
      phone: extractedProfile.phone,
      location: extractedProfile.location,
      linkedin_url: detectPlatform(cleanUrl) === 'linkedin' ? cleanUrl : null,
      skills: extractedProfile.skills || [],
      summary: extractedProfile.summary,
      source_type: extractedProfile.sourceType,
      profile_url: cleanUrl,
      work_history: extractedProfile.workHistory || [],
      education: extractedProfile.education || [],
      agent_run_id: runId,
      status: 'new',
    }, { onConflict: 'profile_url' });

    if (runId) {
      await supabase.from('agent_runs').update({
        status: 'completed',
        output_data: { name: extractedProfile.name, role: extractedProfile.currentRole },
        duration_ms: Date.now() - startTime,
        completed_at: new Date().toISOString(),
      }).eq('id', runId);
    }

    return NextResponse.json({
      success: true,
      extractedProfile,
      resumeMarkdown,
      isRestricted: extractedProfile.restricted_view === true,
      platform: extractedProfile.sourceType,
      message: extractedProfile.restricted_view
        ? '⚠️ Profile is partially restricted. Extracted what was visible.'
        : `✅ Profile extracted successfully! Found: ${[
            extractedProfile.name,
            extractedProfile.currentRole,
            extractedProfile.workHistory?.length ? `${extractedProfile.workHistory.length} work entries` : null,
            extractedProfile.education?.length ? `${extractedProfile.education.length} education entries` : null,
          ]
            .filter(Boolean)
            .join(', ')}`,
    });
  } catch (error: any) {
    console.error('[Scrape API Error]', error);
    if (runId) {
      const supabase = createServerClient();
      await supabase.from('agent_runs').update({ status: 'failed', error_message: error.message, duration_ms: Date.now() - startTime }).eq('id', runId);
    }
    return NextResponse.json({ error: error.message || 'Internal error.' }, { status: 500 });
  }
}
