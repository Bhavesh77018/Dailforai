import { NextResponse } from 'next/server';

const SOURCES = [
  {
    name: 'Remotive',
    color: '#6366f1',
    url: (q: string) =>
      `https://remotive.com/api/remote-jobs?limit=40${q ? `&search=${encodeURIComponent(q)}` : ''}`,
    map: (j: any) => ({
      id: `remotive-${j.id}`,
      source: 'Remotive',
      source_color: '#6366f1',
      source_url: 'https://remotive.com',
      external_url: j.url,
      title: j.title,
      company_name: j.company_name,
      company_logo: j.company_logo,
      location: j.candidate_required_location || 'Worldwide / Remote',
      type: 'remote',
      salary_range: j.salary || null,
      industry: j.category?.name || null,
      tags: Array.isArray(j.tags) ? j.tags : [],
      description: j.description?.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 800) || '',
      created_at: j.publication_date,
    }),
  },
  {
    name: 'RemoteOK',
    color: '#10b981',
    url: () => 'https://remoteok.com/api',
    map: (j: any) => ({
      id: `remoteok-${j.id || j.slug}`,
      source: 'RemoteOK',
      source_color: '#10b981',
      source_url: 'https://remoteok.com',
      external_url: j.url ? `https://remoteok.com${j.url}` : `https://remoteok.com`,
      title: j.position,
      company_name: j.company,
      company_logo: j.company_logo,
      location: j.location || 'Remote',
      type: 'remote',
      salary_range: j.salary_min && j.salary_max ? `$${j.salary_min}–$${j.salary_max}` : null,
      industry: Array.isArray(j.tags) ? j.tags[0] || null : null,
      tags: Array.isArray(j.tags) ? j.tags.slice(0, 6) : [],
      description: j.description?.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 800) || '',
      created_at: j.date || new Date().toISOString(),
    }),
    filterRaw: (data: any[]) => data.filter((j: any) => j && !j.legal && j.position),
  },
];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') || '';

  const results: any[] = [];

  await Promise.allSettled(
    SOURCES.map(async (src) => {
      try {
        const res = await fetch(src.url(q), {
          headers: { 'User-Agent': 'DialforAI/1.0 (https://dialforai.com)' },
          next: { revalidate: 300 }, // cache 5 min
        });
        if (!res.ok) return;
        let data = await res.json();

        // RemoteOK returns array with a legal notice as first item
        if (src.name === 'RemoteOK' && Array.isArray(data)) {
          data = (src as any).filterRaw ? (src as any).filterRaw(data) : data.slice(1);
        }

        const jobs = (src.name === 'Remotive' ? data.jobs : data) || [];
        const mapped = jobs.slice(0, 30).map(src.map).filter((j: any) => j.title && j.company_name);

        // Client-side search filter for sources that don't support ?search=
        const filtered =
          q && src.name !== 'Remotive'
            ? mapped.filter(
                (j: any) =>
                  j.title.toLowerCase().includes(q.toLowerCase()) ||
                  j.company_name.toLowerCase().includes(q.toLowerCase()) ||
                  j.tags?.some((t: string) => t.toLowerCase().includes(q.toLowerCase()))
              )
            : mapped;

        results.push(...filtered);
      } catch (e) {
        console.error(`[ExternalJobs] ${src.name} failed:`, e);
      }
    })
  );

  return NextResponse.json({ jobs: results, total: results.length });
}
