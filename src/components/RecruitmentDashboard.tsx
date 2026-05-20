'use client';
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import {
  Users, Link as LinkIcon, ShieldAlert, ShieldCheck, Trophy,
  ChevronRight, Bot, UserCircle, Clock, Hash, X, Copy, CheckCircle2, AlertTriangle
} from 'lucide-react';

interface MagicLink {
  req_id: string;
  job_title: string;
  created_at: string;
  candidates: Candidate[];
}

interface Candidate {
  id: string;
  email: string;
  score: number;
  warnings: number;
  cheatingDetected: boolean;
  reqId: string;
  jobTitle: string;
  transcript: { role: string; content: string }[];
  created_at: string;
}

export default function RecruitmentDashboard() {
  const [jobs, setJobs] = useState<MagicLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<MagicLink | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      // Fetch all magic links for this recruiter
      const { data: links, error: linksErr } = await supabase
        .from('recruitment_magic_links')
        .select('*')
        .order('created_at', { ascending: false });

      if (linksErr) { console.error('[RecruitmentDashboard] links error:', linksErr); }

      // Fetch all candidate interview submissions linked to this recruiter
      const { data: interviews, error: interviewErr } = await supabase
        .from('agent_runs')
        .select('*')
        .eq('agent_type', 'recruitment')
        .eq('input_data->>type', 'candidate_interview')
        .order('created_at', { ascending: false });

      if (interviewErr) { console.error('[RecruitmentDashboard] interviews error:', interviewErr); }

      // Build jobs array, mapping candidates to their req_id
      const jobMap: Record<string, MagicLink> = {};

      // Seed from magic links table
      for (const link of (links || [])) {
        jobMap[link.req_id] = {
          req_id: link.req_id,
          job_title: link.job_title || 'Untitled Position',
          created_at: link.created_at,
          candidates: []
        };
      }

      // Attach candidates from agent_runs
      for (const run of (interviews || [])) {
        const reqId = run.input_data?.reqId || run.output_data?.reqId;
        if (!reqId) continue;

        const candidate: Candidate = {
          id: run.id,
          email: run.output_data?.candidate || run.input_data?.candidate || 'Unknown',
          score: run.output_data?.score ?? 0,
          warnings: run.output_data?.warnings ?? 0,
          cheatingDetected: run.output_data?.cheatingDetected ?? false,
          reqId,
          jobTitle: run.input_data?.jobTitle || run.output_data?.jobTitle || 'Untitled Position',
          transcript: run.output_data?.transcript || [],
          created_at: run.created_at
        };

        if (jobMap[reqId]) {
          jobMap[reqId].candidates.push(candidate);
        } else {
          // Candidate for a job not yet in magic_links (edge case) — create a stub entry
          jobMap[reqId] = {
            req_id: reqId,
            job_title: candidate.jobTitle,
            created_at: run.created_at,
            candidates: [candidate]
          };
        }
      }

      const jobList = Object.values(jobMap);
      setJobs(jobList);
      if (jobList.length > 0 && !selectedJob) setSelectedJob(jobList[0]);
    } catch (e) {
      console.error('[RecruitmentDashboard] error:', e);
    }
    setLoading(false);
  }

  const copyLink = (reqId: string) => {
    const base = typeof window !== 'undefined' ? window.location.origin : '';
    navigator.clipboard.writeText(`${base}/apply/${reqId}`);
    setCopied(reqId);
    setTimeout(() => setCopied(null), 2000);
  };

  const scoreColor = (score: number) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const scoreLabel = (score: number) => {
    if (score >= 80) return 'Strong Hire';
    if (score >= 60) return 'Maybe';
    return 'No Hire';
  };

  if (loading) {
    return (
      <div className="dashboard" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
        <div className="typing-dots"><div className="typing-dot"/><div className="typing-dot"/><div className="typing-dot"/></div>
        <span style={{ color: 'var(--text-3)', fontSize: 14 }}>Loading recruitment pipeline...</span>
      </div>
    );
  }

  return (
    <div className="dashboard fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%', paddingBottom: 0, overflow: 'hidden' }}>
      <div className="dash-header" style={{ flexShrink: 0 }}>
        <h1 className="dash-title">Recruitment Pipeline</h1>
        <p className="dash-subtitle">All posted jobs, candidate applications, AI scores, and interview details.</p>
      </div>

      {jobs.length === 0 ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-3)', gap: 16 }}>
          <Users size={48} style={{ opacity: 0.3 }} />
          <div style={{ fontSize: 18, fontWeight: 600 }}>No job postings yet</div>
          <div style={{ fontSize: 14 }}>Go to Chat → Recruitment Agent → "Post a job" to generate your first Magic Link</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flex: 1, gap: 20, minHeight: 0, paddingBottom: 24 }}>

          {/* LEFT: Job List */}
          <div style={{ width: 280, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 10, overflowY: 'auto' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', letterSpacing: 1, marginBottom: 4 }}>POSTED JOBS ({jobs.length})</div>
            {jobs.map(job => (
              <button
                key={job.req_id}
                onClick={() => { setSelectedJob(job); setSelectedCandidate(null); }}
                style={{
                  textAlign: 'left', padding: 14, borderRadius: 10, border: `1px solid ${selectedJob?.req_id === job.req_id ? 'var(--border-focus)' : 'var(--border)'}`,
                  background: selectedJob?.req_id === job.req_id ? 'var(--bg-btn)' : 'var(--bg-card)',
                  cursor: 'pointer', transition: 'all 0.15s ease'
                }}
              >
                <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-1)', marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {job.job_title}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text-3)' }}>
                  <Hash size={10} /> req-{job.req_id}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                  <div style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 4, color: 'var(--color-recruit)' }}>
                    <Users size={12} /> {job.candidates.length} {job.candidates.length === 1 ? 'applicant' : 'applicants'}
                  </div>
                  <ChevronRight size={14} style={{ color: 'var(--text-3)' }} />
                </div>
              </button>
            ))}
          </div>

          {/* MIDDLE: Candidates for selected job */}
          {selectedJob && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, minHeight: 0 }}>
              {/* Job Header */}
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: 20, marginBottom: 16, flexShrink: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                  <div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-1)', marginBottom: 6 }}>{selectedJob.job_title}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 12, color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Hash size={11} /> req-{selectedJob.req_id}
                      </span>
                      <span style={{ fontSize: 12, color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Clock size={11} /> {new Date(selectedJob.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <span style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 4, color: '#10b981' }}>
                        <Users size={11} /> {selectedJob.candidates.length} applicant{selectedJob.candidates.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => copyLink(selectedJob.req_id)}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8, background: copied === selectedJob.req_id ? 'rgba(16,185,129,0.1)' : 'rgba(79,70,229,0.1)', color: copied === selectedJob.req_id ? '#10b981' : '#4f46e5', border: `1px solid ${copied === selectedJob.req_id ? 'rgba(16,185,129,0.2)' : 'rgba(79,70,229,0.2)'}`, cursor: 'pointer', fontSize: 13, fontWeight: 600, flexShrink: 0 }}
                  >
                    {copied === selectedJob.req_id ? <><CheckCircle2 size={14} /> Copied!</> : <><LinkIcon size={14} /> Share Link</>}
                  </button>
                </div>
              </div>

              {/* Candidates List */}
              <div style={{ flex: 1, overflowY: 'auto' }}>
                {selectedJob.candidates.length === 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 200, color: 'var(--text-3)', gap: 12 }}>
                    <UserCircle size={36} style={{ opacity: 0.3 }} />
                    <div style={{ fontSize: 14 }}>No candidates yet. Share the Magic Link to start screening.</div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {selectedJob.candidates.map(c => (
                      <button
                        key={c.id}
                        onClick={() => setSelectedCandidate(c)}
                        style={{
                          textAlign: 'left', padding: 16, borderRadius: 10, border: `1px solid ${selectedCandidate?.id === c.id ? 'var(--border-focus)' : 'var(--border)'}`,
                          background: selectedCandidate?.id === c.id ? 'var(--bg-btn)' : 'var(--bg-card)',
                          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 16, transition: 'all 0.15s ease'
                        }}
                      >
                        {/* Avatar */}
                        <div style={{ width: 44, height: 44, borderRadius: '50%', background: `${scoreColor(c.score)}20`, border: `2px solid ${scoreColor(c.score)}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, color: scoreColor(c.score), flexShrink: 0 }}>
                          {c.email[0].toUpperCase()}
                        </div>

                        {/* Details */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-1)', marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.email}</div>
                          <div style={{ fontSize: 12, color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Clock size={10} /> {new Date(c.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                          </div>
                        </div>

                        {/* Score Badge */}
                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                          <div style={{ fontSize: 22, fontWeight: 800, color: scoreColor(c.score) }}>{c.score}<span style={{ fontSize: 12, fontWeight: 400, color: 'var(--text-3)' }}>/100</span></div>
                          <div style={{ fontSize: 11, fontWeight: 600, color: scoreColor(c.score) }}>{scoreLabel(c.score)}</div>
                        </div>

                        {/* Cheating indicator */}
                        {c.cheatingDetected ? (
                          <ShieldAlert size={18} style={{ color: '#ef4444', flexShrink: 0 }} />
                        ) : (
                          <ShieldCheck size={18} style={{ color: '#10b981', flexShrink: 0 }} />
                        )}

                        <ChevronRight size={16} style={{ color: 'var(--text-3)', flexShrink: 0 }} />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* RIGHT PANEL: Candidate Detail */}
          {selectedCandidate && (
            <div style={{ width: 420, flexShrink: 0, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              {/* Header */}
              <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 15 }}>Candidate Report</div>
                <button onClick={() => setSelectedCandidate(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-3)', display: 'flex', alignItems: 'center' }}>
                  <X size={18} />
                </button>
              </div>

              <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
                {/* Score card */}
                <div style={{ background: `${scoreColor(selectedCandidate.score)}12`, border: `1px solid ${scoreColor(selectedCandidate.score)}30`, borderRadius: 12, padding: 20, marginBottom: 20, textAlign: 'center' }}>
                  <div style={{ fontSize: 48, fontWeight: 800, color: scoreColor(selectedCandidate.score) }}>{selectedCandidate.score}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-2)' }}>AI Fit Score out of 100</div>
                  <div style={{ marginTop: 8, display: 'inline-block', padding: '4px 14px', background: `${scoreColor(selectedCandidate.score)}20`, color: scoreColor(selectedCandidate.score), borderRadius: 999, fontWeight: 700, fontSize: 13 }}>
                    {scoreLabel(selectedCandidate.score)}
                  </div>
                </div>

                {/* Candidate info grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
                  <div style={{ background: 'var(--bg-btn)', borderRadius: 8, padding: 12 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-3)', marginBottom: 4 }}>EMAIL</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-1)', wordBreak: 'break-all' }}>{selectedCandidate.email}</div>
                  </div>
                  <div style={{ background: 'var(--bg-btn)', borderRadius: 8, padding: 12 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-3)', marginBottom: 4 }}>APPLIED ON</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-1)' }}>
                      {new Date(selectedCandidate.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>
                  <div style={{ background: 'var(--bg-btn)', borderRadius: 8, padding: 12 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-3)', marginBottom: 4 }}>REQUISITION ID</div>
                    <div style={{ fontSize: 12, fontFamily: 'monospace', color: 'var(--text-1)' }}>req-{selectedCandidate.reqId}</div>
                  </div>
                  <div style={{ background: 'var(--bg-btn)', borderRadius: 8, padding: 12 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-3)', marginBottom: 4 }}>APPLIED FOR</div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{selectedCandidate.jobTitle}</div>
                  </div>
                </div>

                {/* Integrity check */}
                <div style={{ padding: 14, borderRadius: 10, marginBottom: 20, display: 'flex', gap: 12, alignItems: 'flex-start', background: selectedCandidate.cheatingDetected ? 'rgba(239,68,68,0.08)' : 'rgba(16,185,129,0.08)', border: `1px solid ${selectedCandidate.cheatingDetected ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.2)'}` }}>
                  {selectedCandidate.cheatingDetected ? <AlertTriangle size={20} style={{ color: '#ef4444', flexShrink: 0, marginTop: 2 }} /> : <ShieldCheck size={20} style={{ color: '#10b981', flexShrink: 0, marginTop: 2 }} />}
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: selectedCandidate.cheatingDetected ? '#ef4444' : '#10b981', marginBottom: 4 }}>
                      {selectedCandidate.cheatingDetected ? '⚠️ Integrity Warning' : '✅ Clean Interview'}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.5 }}>
                      {selectedCandidate.cheatingDetected
                        ? `Detected ${selectedCandidate.warnings} suspicious event${selectedCandidate.warnings !== 1 ? 's' : ''} (tab switching / paste). AI score may be inflated — manual review recommended.`
                        : 'No suspicious activity detected during the interview. Score reflects genuine ability.'}
                    </div>
                  </div>
                </div>

                {/* Transcript */}
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-3)', letterSpacing: 0.5, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Bot size={14} /> INTERVIEW TRANSCRIPT
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {selectedCandidate.transcript.length === 0 ? (
                    <div style={{ color: 'var(--text-3)', fontSize: 13, textAlign: 'center', padding: '20px 0' }}>No transcript available</div>
                  ) : selectedCandidate.transcript.map((msg, i) => (
                    <div key={i} style={{ display: 'flex', gap: 10, flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}>
                      <div style={{ width: 28, height: 28, borderRadius: '50%', background: msg.role === 'user' ? 'var(--bg-main)' : '#4f46e5', color: msg.role === 'user' ? 'var(--text-1)' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 11, fontWeight: 700 }}>
                        {msg.role === 'user' ? 'C' : 'AI'}
                      </div>
                      <div style={{ background: msg.role === 'user' ? 'var(--bg-btn)' : 'rgba(79,70,229,0.08)', border: msg.role === 'ai' ? '1px solid rgba(79,70,229,0.15)' : 'none', color: 'var(--text-1)', padding: '10px 14px', borderRadius: 8, maxWidth: '85%', fontSize: 13, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                        {msg.content}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
