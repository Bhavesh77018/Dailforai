'use client';
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import {
  Briefcase, MapPin, Building2, Clock, Search, Filter,
  ChevronRight, X, Globe, Users, DollarSign, ExternalLink,
  Sparkles, Tag, ArrowRight, BookOpen, Bot
} from 'lucide-react';

interface Job {
  id: string;
  company_name: string;
  company_domain?: string;
  company_logo?: string;
  title: string;
  description: string;
  location: string;
  type: string;
  salary_range?: string;
  industry?: string;
  skills?: string[];
  req_id?: string;
  status?: 'open' | 'closed';
  posted_by?: string;
  created_at: string;
  is_external?: boolean;
  source?: string;
  source_color?: string;
  source_url?: string;
  external_url?: string;
}

const JOB_TYPES = ['All', 'Remote', 'Onsite', 'Hybrid'];
const INDUSTRIES = [
  'All Industries', 'IT Services', 'Healthcare', 'Manufacturing',
  'Finance', 'E-Commerce', 'SaaS', 'Consulting', 'BPO', 'Real Estate', 'Education'
];

function getTypeColor(type: string) {
  const t = type.toLowerCase();
  if (t.includes('remote')) return { color: '#10b981', bg: 'rgba(16,185,129,0.1)' };
  if (t.includes('hybrid')) return { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' };
  if (t.includes('onsite')) return { color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' };
  return { color: 'var(--text-2)', bg: 'var(--bg-btn)' };
}

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

interface Props {
  user: any;
  onLoginClick: () => void;
  initialSearch?: string;
}

export default function JobBoard({ user, onLoginClick, initialSearch = '' }: Props) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(initialSearch);
  const [searchTrigger, setSearchTrigger] = useState(0); // To trigger refetch with search term
  const [typeFilter, setTypeFilter] = useState('All');
  const [industryFilter, setIndustryFilter] = useState('All Industries');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [applySuccess, setApplySuccess] = useState(false);

  useEffect(() => { fetchJobs(); }, [searchTrigger]);

  async function fetchJobs() {
    setLoading(true);
    try {
      const internalJobs: Job[] = [];

      // 1. Internal Jobs from `jobs` table
      const { data: dbJobs, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('status', 'open')
        .order('created_at', { ascending: false });

      if (!error && dbJobs) {
        internalJobs.push(...dbJobs.map(j => ({
          ...j, 
          status: j.status as 'open' | 'closed',
          is_external: false, 
          source: 'DialforAI',
          source_color: '#3b82f6'
        })));
      }

      // 2. Legacy internal jobs from `recruitment_magic_links`
      const { data: links } = await supabase
        .from('recruitment_magic_links')
        .select('*')
        .order('created_at', { ascending: false });

      if (links) {
        internalJobs.push(...links.map((l: any) => ({
          id: `req-${l.req_id}`,
          company_name: l.company_name || 'Company',
          company_domain: l.company_domain,
          title: l.job_title || 'Open Position',
          description: l.job_description || 'No description provided.',
          location: l.location || 'Not specified',
          type: (l.job_type as any) || 'onsite',
          salary_range: l.salary_range,
          industry: l.industry,
          skills: l.skills || [],
          req_id: l.req_id,
          status: 'open' as 'open',
          created_at: l.created_at,
          is_external: false,
          source: 'DialforAI',
          source_color: '#3b82f6'
        })));
      }

      // 3. External Jobs
      let externalJobs: Job[] = [];
      try {
        const extRes = await fetch(`/api/jobs/external?q=${encodeURIComponent(search)}`);
        if (extRes.ok) {
          const extData = await extRes.json();
          externalJobs = extData.jobs || [];
        }
      } catch (err) {
        console.error('Failed to fetch external jobs', err);
      }

      // Sort internal first, then by date. External sorted by date.
      const sortedInternal = internalJobs.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      const sortedExternal = externalJobs.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      setJobs([...sortedInternal, ...sortedExternal]);
    } catch (e) {
      console.error('[JobBoard] error:', e);
    }
    setLoading(false);
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchTrigger(prev => prev + 1);
  };

  const filtered = jobs.filter(j => {
    // Client-side filtering for immediate feedback, server filtering also applied on submit
    const q = search.toLowerCase();
    const matchSearch = !q || j.title.toLowerCase().includes(q) || j.company_name.toLowerCase().includes(q) || j.location.toLowerCase().includes(q);
    const matchType = typeFilter === 'All' || j.type.toLowerCase().includes(typeFilter.toLowerCase());
    const matchIndustry = industryFilter === 'All Industries' || j.industry?.toLowerCase().includes(industryFilter.toLowerCase());
    return matchSearch && matchType && matchIndustry;
  });

  const handleApply = (job: Job) => {
    if (job.is_external && job.external_url) {
      // External Job -> new tab to original post
      window.open(job.external_url, '_blank');
    } else if (job.req_id) {
      // Internal Job with Recruiter pipeline -> AI screening test
      window.open(`/apply/${job.req_id}`, '_blank');
    } else {
      // Generic internal job without req_id (might need a generic screening flow later)
      setApplySuccess(true);
      setTimeout(() => setApplySuccess(false), 3000);
    }
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: 'clamp(16px,3vw,32px) clamp(16px,3vw,32px) 0', flexShrink: 0 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(59,130,246,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' }}>
              <Briefcase size={18} />
            </div>
            <div>
              <h1 style={{ fontSize: 'clamp(18px,3vw,24px)', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-1)' }}>Find Jobs</h1>
              <p style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 1 }}>
                {loading ? 'Loading...' : `${filtered.length} open position${filtered.length !== 1 ? 's' : ''} across the web`}
              </p>
            </div>
            {!user && (
              <button
                onClick={onLoginClick}
                style={{ marginLeft: 'auto', padding: '7px 16px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-btn)', color: 'var(--text-2)', cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6 }}
              >
                Sign in to apply
              </button>
            )}
          </div>

          {/* Search & Filters */}
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: 10, marginTop: 16, marginBottom: 16, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 200, position: 'relative', display: 'flex' }}>
              <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)', pointerEvents: 'none' }} />
              <input
                style={{ flex: 1, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px 0 0 8px', padding: '8px 12px 8px 34px', color: 'var(--text-1)', fontSize: 13, outline: 'none', fontFamily: 'inherit' }}
                placeholder="Search job title, company, location…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <button type="submit" style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '0 8px 8px 0', padding: '0 16px', fontWeight: 600, cursor: 'pointer' }}>
                Search
              </button>
            </div>
            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 12px', color: 'var(--text-2)', fontSize: 13, cursor: 'pointer', outline: 'none', fontFamily: 'inherit' }}
            >
              {JOB_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
            <select
              value={industryFilter}
              onChange={e => setIndustryFilter(e.target.value)}
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 12px', color: 'var(--text-2)', fontSize: 13, cursor: 'pointer', outline: 'none', fontFamily: 'inherit' }}
            >
              {INDUSTRIES.map(i => <option key={i}>{i}</option>)}
            </select>
          </form>
        </div>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 clamp(16px,3vw,32px) clamp(16px,3vw,32px)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', gap: 20, height: '100%' }}>

          {/* Job List */}
          <div style={{ flex: selectedJob ? '0 0 min(400px,50%)' : 1, display: 'flex', flexDirection: 'column', gap: 12, overflowY: selectedJob ? 'auto' : 'visible' }}>
            {loading ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 80, flexDirection: 'column', gap: 16 }}>
                <div className="typing-dots"><div className="typing-dot"/><div className="typing-dot"/><div className="typing-dot"/></div>
                <span style={{ color: 'var(--text-3)', fontSize: 13 }}>Fetching latest jobs…</span>
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 80, gap: 16, color: 'var(--text-3)', textAlign: 'center' }}>
                <Briefcase size={56} style={{ opacity: 0.25 }} />
                <div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-1)', marginBottom: 6 }}>No jobs found</div>
                  <div style={{ fontSize: 14, maxWidth: 320, lineHeight: 1.5 }}>
                    Try adjusting your search criteria or removing filters.
                  </div>
                </div>
              </div>
            ) : (
              filtered.map(job => {
                const tColor = getTypeColor(job.type);
                return (
                <button
                  key={job.id}
                  onClick={() => { setSelectedJob(job); setApplySuccess(false); }}
                  style={{
                    textAlign: 'left', padding: 20, borderRadius: 12,
                    border: `1px solid ${selectedJob?.id === job.id ? '#3b82f6' : 'var(--border)'}`,
                    background: selectedJob?.id === job.id ? 'rgba(59,130,246,0.05)' : 'var(--bg-card)',
                    cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'inherit',
                    display: 'flex', gap: 14, alignItems: 'flex-start'
                  }}
                >
                  {/* Company Avatar */}
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--bg-btn)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 800, color: '#3b82f6', flexShrink: 0, overflow: 'hidden' }}>
                    {job.company_logo ? (
                      <img src={job.company_logo} alt={job.company_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      job.company_name[0].toUpperCase()
                    )}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {job.title}
                      </div>
                      {job.is_external ? (
                        <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 6px', borderRadius: 6, background: `${job.source_color}15`, color: job.source_color, border: `1px solid ${job.source_color}30`, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 4 }}>
                          <ExternalLink size={10} /> {job.source}
                        </span>
                      ) : (
                        <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 6, background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(16,185,129,0.1))', color: '#10b981', border: '1px solid rgba(16,185,129,0.2)', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Sparkles size={10} /> DialforAI Verified
                        </span>
                      )}
                    </div>

                    <div style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Building2 size={12} /> {job.company_name}</span>
                      <span style={{ color: 'var(--border-2)' }}>·</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={12} /> {job.location}</span>
                    </div>

                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                      <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 999, background: tColor.bg, color: tColor.color }}>
                        {job.type.charAt(0).toUpperCase() + job.type.slice(1)}
                      </span>
                      {job.salary_range && (
                        <span style={{ fontSize: 11, color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: 3 }}>
                          <DollarSign size={10} />{job.salary_range}
                        </span>
                      )}
                      {job.industry && <span style={{ fontSize: 11, color: 'var(--text-3)' }}>{job.industry}</span>}
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flexShrink: 0 }}>
                    <span style={{ fontSize: 11, color: 'var(--text-3)' }}>{timeAgo(job.created_at)}</span>
                    <ChevronRight size={14} style={{ color: 'var(--text-3)' }} />
                  </div>
                </button>
              )})
            )}
          </div>

          {/* Job Detail Panel */}
          {selectedJob && (
            <div style={{ flex: 1, minWidth: 0, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, display: 'flex', flexDirection: 'column', overflow: 'hidden', maxHeight: '80vh', position: 'sticky', top: 0 }}>
              {/* Panel Header */}
              <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexShrink: 0 }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div style={{ width: 56, height: 56, borderRadius: 12, background: 'var(--bg-btn)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 800, color: '#3b82f6', flexShrink: 0, overflow: 'hidden' }}>
                    {selectedJob.company_logo ? (
                      <img src={selectedJob.company_logo} alt={selectedJob.company_name} style={{ width: '100%', height: '100%', objectFit: 'cover', background: '#fff' }} />
                    ) : (
                      selectedJob.company_name[0].toUpperCase()
                    )}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                      <div style={{ fontWeight: 800, fontSize: 18, color: 'var(--text-1)' }}>{selectedJob.title}</div>
                      {!selectedJob.is_external && (
                        <Sparkles size={14} color="#10b981" />
                      )}
                    </div>
                    <div style={{ fontSize: 14, color: 'var(--text-2)' }}>
                      {selectedJob.company_name} 
                      {selectedJob.is_external && (
                        <span style={{ color: 'var(--text-3)', marginLeft: 8 }}>via {selectedJob.source}</span>
                      )}
                    </div>
                  </div>
                </div>
                <button onClick={() => setSelectedJob(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-3)', display: 'flex', alignItems: 'center', padding: 4 }}>
                  <X size={18} />
                </button>
              </div>

              {/* Panel Body */}
              <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
                {/* Meta chips */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, padding: '4px 10px', borderRadius: 999, background: getTypeColor(selectedJob.type).bg, color: getTypeColor(selectedJob.type).color, fontWeight: 600 }}>
                    <Globe size={11} /> {selectedJob.type.charAt(0).toUpperCase() + selectedJob.type.slice(1)}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, padding: '4px 10px', borderRadius: 999, background: 'var(--bg-btn)', color: 'var(--text-2)' }}>
                    <MapPin size={11} /> {selectedJob.location}
                  </span>
                  {selectedJob.salary_range && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, padding: '4px 10px', borderRadius: 999, background: 'rgba(16,185,129,0.08)', color: '#10b981', fontWeight: 600 }}>
                      <DollarSign size={11} /> {selectedJob.salary_range}
                    </span>
                  )}
                  {selectedJob.industry && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, padding: '4px 10px', borderRadius: 999, background: 'var(--bg-btn)', color: 'var(--text-3)' }}>
                      <Tag size={11} /> {selectedJob.industry}
                    </span>
                  )}
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, padding: '4px 10px', borderRadius: 999, background: 'var(--bg-btn)', color: 'var(--text-3)' }}>
                    <Clock size={11} /> {timeAgo(selectedJob.created_at)}
                  </span>
                </div>

                {/* Description */}
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', letterSpacing: 0.8, marginBottom: 10 }}>JOB DESCRIPTION</div>
                  <div style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{selectedJob.description}</div>
                </div>

                {/* Skills/Tags */}
                {selectedJob.skills && selectedJob.skills.length > 0 && (
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', letterSpacing: 0.8, marginBottom: 10 }}>TAGS & SKILLS</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {selectedJob.skills.map((skill, i) => (
                        <span key={i} style={{ fontSize: 12, padding: '3px 10px', borderRadius: 999, background: 'rgba(79,70,229,0.1)', color: '#818cf8', border: '1px solid rgba(79,70,229,0.2)', fontWeight: 500 }}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Apply success */}
                {applySuccess && (
                  <div style={{ padding: 14, borderRadius: 10, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: '#10b981', fontSize: 13, fontWeight: 600, marginBottom: 16, textAlign: 'center' }}>
                    ✓ Application submitted successfully!
                  </div>
                )}
              </div>

              {/* Apply Button */}
              <div style={{ padding: '14px 20px', borderTop: '1px solid var(--border)', flexShrink: 0 }}>
                {user ? (
                  <button
                    onClick={() => handleApply(selectedJob)}
                    style={{ 
                      width: '100%', padding: '14px', borderRadius: 10, 
                      background: selectedJob.is_external ? 'var(--bg-btn)' : 'linear-gradient(135deg, #10b981, #059669)', 
                      color: selectedJob.is_external ? 'var(--text-1)' : '#fff', 
                      border: selectedJob.is_external ? '1px solid var(--border-2)' : 'none',
                      fontWeight: 700, fontSize: 15, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'inherit',
                      boxShadow: selectedJob.is_external ? 'none' : '0 4px 14px rgba(16,185,129,0.2)'
                    }}
                  >
                    {selectedJob.is_external ? (
                      <>Apply on {selectedJob.source} <ExternalLink size={16} /></>
                    ) : (
                      <>Take AI Screening Test <Bot size={18} /></>
                    )}
                  </button>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <p style={{ fontSize: 12, color: 'var(--text-3)', textAlign: 'center' }}>Sign in to apply for this position</p>
                    <button
                      onClick={onLoginClick}
                      style={{ width: '100%', padding: '12px', borderRadius: 10, border: 'none', background: 'var(--accent)', color: 'var(--accent-fg)', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}
                    >
                      Sign In to Apply
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
