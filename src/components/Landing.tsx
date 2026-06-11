import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Hexagon, Users, Search, TrendingUp, ArrowRight, Zap, ShieldCheck, BrainCircuit, Bot, Code, Sparkles, Cpu, Menu, X, Mail, Briefcase, MapPin, Building2, ChevronRight } from 'lucide-react';

interface LandingProps {
  onLaunchChat?: () => void;
  onSearchJobs?: (query: string) => void;
}

export default function Landing({ onLaunchChat, onSearchJobs }: LandingProps) {
  const [jobQuery, setJobQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [featuredJobs, setFeaturedJobs] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/jobs/external')
      .then(res => res.json())
      .then(data => {
        if (data.jobs && data.jobs.length > 0) {
          // Get the first 3 jobs
          setFeaturedJobs(data.jobs.slice(0, 3));
        }
      })
      .catch(err => console.error("Failed to fetch featured jobs:", err));
  }, []);

  const handleChat = () => {
    if (onLaunchChat) onLaunchChat();
    else window.location.href = '/';
  };

  const handleSearch = (e?: React.FormEvent, queryOverride?: string) => {
    if (e) e.preventDefault();
    const q = queryOverride !== undefined ? queryOverride : jobQuery;
    if (onSearchJobs) onSearchJobs(q);
    else window.location.href = '/';
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-main)', color: 'var(--text-1)', display: 'flex', flexDirection: 'column', overflowX: 'hidden' }}>
      
      {/* Navigation */}
      <nav style={{ padding: '16px clamp(20px, 4vw, 40px)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, background: 'var(--bg-main)', zIndex: 100 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-1)', textDecoration: 'none' }}>
          <Hexagon size={24} color="#3b82f6" />
          <span style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.02em' }}>DialforAI</span>
        </Link>
        
        {/* Desktop Nav */}
        <div className="about-nav-desktop" style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <a href="#agents" style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-1)', textDecoration: 'none' }}>Agents</a>
          <a href="#jobs" style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-1)', textDecoration: 'none' }}>Jobs</a>
          <Link href="/contact" style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-2)', textDecoration: 'none' }}>Contact</Link>
          <button className="btn btn-outline" onClick={handleChat} style={{ padding: '8px 16px', fontSize: 13, borderRadius: 8 }}>
            Chat with Agent
          </button>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="about-nav-mobile"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ background: 'transparent', border: 'none', color: 'var(--text-1)', cursor: 'pointer', padding: 4, display: 'none', alignItems: 'center', justifyContent: 'center' }}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div style={{ position: 'fixed', top: 65, left: 0, right: 0, background: 'var(--bg-main)', borderBottom: '1px solid var(--border)', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 8, zIndex: 99 }}>
          <a href="#agents" onClick={() => setMenuOpen(false)} style={{ padding: '12px 8px', fontSize: 15, fontWeight: 600, color: 'var(--text-1)', textDecoration: 'none' }}>Agents</a>
          <a href="#jobs" onClick={() => setMenuOpen(false)} style={{ padding: '12px 8px', fontSize: 15, fontWeight: 600, color: 'var(--text-1)', textDecoration: 'none' }}>Jobs</a>
          <Link href="/contact" onClick={() => setMenuOpen(false)} style={{ padding: '12px 8px', fontSize: 15, fontWeight: 500, color: 'var(--text-2)', textDecoration: 'none' }}>Contact</Link>
          <button onClick={() => { setMenuOpen(false); handleChat(); }} className="btn btn-primary" style={{ marginTop: 8, padding: '12px', borderRadius: 8, fontSize: 14, textAlign: 'center', justifyContent: 'center' }}>Chat with Agent</button>
        </div>
      )}

      {/* Hero Section */}
      <section style={{ position: 'relative', padding: 'clamp(60px, 12vw, 120px) 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -100, left: '50%', transform: 'translateX(-50%)', width: 600, height: 400, background: 'radial-gradient(circle, rgba(79, 70, 229, 0.15) 0%, transparent 70%)', filter: 'blur(60px)', zIndex: 0, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '20%', right: '10%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(236, 72, 153, 0.1) 0%, transparent 70%)', filter: 'blur(60px)', zIndex: 0, pointerEvents: 'none' }} />
        
        <div style={{ position: 'relative', zIndex: 1, display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', background: 'var(--bg-btn)', border: '1px solid var(--border-2)', borderRadius: 999, fontSize: 12, fontWeight: 600, color: 'var(--text-1)', marginBottom: 24, animation: 'slideUp 0.6s ease-out' }}>
          <Zap size={14} style={{ color: '#fbbf24' }} /> Multi-Agent Operating System
        </div>
        
        <h1 style={{ position: 'relative', zIndex: 1, fontSize: 'clamp(32px, 6vw, 72px)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.1, maxWidth: 900, marginBottom: 20, animation: 'slideUp 0.8s ease-out' }}>
          Automate your growth with{' '}
          <span style={{ background: 'linear-gradient(135deg, #4f46e5, #ec4899, #f59e0b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Autonomous Intelligence.</span>
        </h1>
        
        <p style={{ position: 'relative', zIndex: 1, fontSize: 'clamp(15px, 2vw, 20px)', color: 'var(--text-2)', lineHeight: 1.6, maxWidth: 620, margin: '0 auto 40px', animation: 'slideUp 1s ease-out' }}>
          DialforAI is a premium Agent OS that deploys autonomous AI workers to scale your recruitment, accelerate outbound sales, and find your ideal prospects on autopilot.
        </p>

        {/* 2 CTAs */}
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexWrap: 'wrap', gap: 20, animation: 'slideUp 1.2s ease-out', justifyContent: 'center', width: '100%', maxWidth: 800 }}>
          <button 
            onClick={handleChat} 
            className="btn btn-primary" 
            style={{ padding: 'clamp(14px,2vw,18px) clamp(24px,4vw,40px)', fontSize: 'clamp(14px,1.5vw,16px)', borderRadius: 16, display: 'inline-flex', alignItems: 'center', gap: 10, boxShadow: '0 10px 30px rgba(79, 70, 229, 0.3)', width: '100%', maxWidth: 280, justifyContent: 'center' }}
          >
            <Bot size={20} /> Chat with Agent
          </button>

          <form onSubmit={handleSearch} style={{ display: 'flex', width: '100%', maxWidth: 440, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: '6px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', padding: '0 12px', color: 'var(--text-3)' }}>
              <Search size={18} />
            </div>
            <input 
              value={jobQuery}
              onChange={e => setJobQuery(e.target.value)}
              placeholder="Search remote jobs, companies..."
              style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-1)', fontSize: 15, fontFamily: 'inherit' }}
            />
            <button type="submit" className="btn btn-outline" style={{ background: 'var(--bg-main)', padding: '10px 24px', borderRadius: 12, fontWeight: 700 }}>
              Search Jobs
            </button>
          </form>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section id="jobs" style={{ position: 'relative', padding: 'clamp(60px, 10vw, 100px) 20px', background: 'var(--bg-card)', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', borderRadius: 999, fontSize: 12, fontWeight: 600, marginBottom: 12 }}>
                <Briefcase size={14} /> Global Opportunities
              </div>
              <h2 style={{ fontSize: 'clamp(22px, 4vw, 36px)', fontWeight: 800, letterSpacing: '-0.03em' }}>Explore Open Roles</h2>
              <p style={{ color: 'var(--text-2)', marginTop: 8 }}>Find top remote positions curated by DialforAI.</p>
            </div>
            <button onClick={() => handleSearch(undefined, '')} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: 8, borderRadius: 12, padding: '10px 20px' }}>
              View All Jobs <ChevronRight size={16} />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
            {featuredJobs.length > 0 ? (
              featuredJobs.map((job, i) => (
                <div key={i} onClick={() => window.open(job.external_url, '_blank')} style={{ padding: 24, background: 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: 16, cursor: 'pointer', transition: 'all 0.2s', display: 'flex', flexDirection: 'column', gap: 16 }} className="hover-card">
                  <div>
                    <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>{job.title}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'var(--text-2)', fontSize: 13 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Building2 size={14}/> {job.company_name}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={14}/> {job.location || 'Remote'}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {(job.tags || []).slice(0, 3).map((tag: string) => (
                      <span key={tag} style={{ padding: '4px 10px', background: 'var(--bg-btn)', borderRadius: 6, fontSize: 11, fontWeight: 600, color: 'var(--text-3)' }}>{tag}</span>
                    ))}
                  </div>
                  <div style={{ marginTop: 'auto', paddingTop: 16, borderTop: '1px solid var(--border-2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 600, color: '#10b981', fontSize: 14 }}>{job.salary_range || 'Competitive'}</span>
                    <span style={{ color: 'var(--text-3)', fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 }}>Apply <ArrowRight size={14}/></span>
                  </div>
                </div>
              ))
            ) : (
              [
                { title: 'Senior Frontend Engineer', company_name: 'Loading...', location: 'Remote', salary_range: '...', tags: ['React', 'Next.js'] },
                { title: 'Machine Learning Architect', company_name: 'Loading...', location: 'Remote', salary_range: '...', tags: ['Python', 'LLMs'] },
                { title: 'Director of Outbound Sales', company_name: 'Loading...', location: 'Remote', salary_range: '...', tags: ['B2B', 'Salesforce'] }
              ].map((job, i) => (
                <div key={i} style={{ padding: 24, background: 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: 16, display: 'flex', flexDirection: 'column', gap: 16, opacity: 0.6 }}>
                  <div>
                    <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>{job.title}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'var(--text-2)', fontSize: 13 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Building2 size={14}/> {job.company_name}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Explore Agents */}
      <section id="agents" style={{ position: 'relative', padding: 'clamp(60px, 10vw, 120px) 20px', background: 'var(--bg-main)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(22px, 5vw, 48px)', fontWeight: 800, textAlign: 'center', marginBottom: 'clamp(40px, 6vw, 80px)', letterSpacing: '-0.03em' }}>Explore Our Agents</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(60px, 10vw, 100px)' }}>

            {/* Recruitment */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'clamp(24px, 5vw, 48px)', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', background: 'rgba(79, 70, 229, 0.1)', color: '#4f46e5', borderRadius: 999, fontSize: 12, fontWeight: 600, marginBottom: 20 }}>
                  <Users size={14} /> Recruitment Agent
                </div>
                <h3 style={{ fontSize: 'clamp(20px, 4vw, 36px)', fontWeight: 800, marginBottom: 16, lineHeight: 1.2 }}>Your Autonomous HR Partner.</h3>
                <p style={{ fontSize: 'clamp(13px, 1.8vw, 18px)', color: 'var(--text-2)', lineHeight: 1.6, marginBottom: 24 }}>
                  Stop manually reading resumes. The Recruitment Agent scrapes LinkedIn and GitHub, generates 100-point candidate scorecards, and conducts initial technical interviews.
                </p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: 'var(--text-1)', fontSize: 'clamp(12px, 1.5vw, 15px)', display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <li style={{ display: 'flex', gap: 10, alignItems: 'center' }}><ShieldCheck size={18} color="#4f46e5" /> Live resume and GitHub parsing</li>
                  <li style={{ display: 'flex', gap: 10, alignItems: 'center' }}><BrainCircuit size={18} color="#4f46e5" /> LLM-powered cheating detection</li>
                </ul>
              </div>
              <div style={{ background: 'var(--bg-card)', padding: 'clamp(20px, 4vw, 40px)', borderRadius: 20, border: '1px solid var(--border)', boxShadow: '0 16px 40px rgba(0,0,0,0.2)' }}>
                <div style={{ width: '100%', height: 240, background: 'var(--bg-input)', borderRadius: 12, border: '1px solid var(--border-2)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                  <div style={{ borderBottom: '1px solid var(--border-2)', padding: '10px 16px', display: 'flex', gap: 6 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }} />
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b' }} />
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981' }} />
                  </div>
                  <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={{ padding: 12, background: 'rgba(79, 70, 229, 0.1)', color: '#4f46e5', borderRadius: 8, fontSize: 13 }}>"Extracted profile for John Doe. Fit Score: 92/100"</div>
                    <div style={{ padding: 12, background: 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13 }}>Strong React fundamentals. Possible copy-paste anomaly detected.</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sales */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'clamp(24px, 5vw, 48px)', alignItems: 'center' }}>
              <div style={{ background: 'var(--bg-card)', padding: 'clamp(20px, 4vw, 40px)', borderRadius: 20, border: '1px solid var(--border)', boxShadow: '0 16px 40px rgba(0,0,0,0.2)', order: 1 }}>
                <div style={{ width: '100%', height: 240, background: 'var(--bg-input)', borderRadius: 12, border: '1px solid var(--border-2)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                  <div style={{ borderBottom: '1px solid var(--border-2)', padding: '10px 16px', display: 'flex', gap: 6 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }} />
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b' }} />
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981' }} />
                  </div>
                  <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={{ padding: 12, background: 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13, color: 'var(--text-3)' }}>Subject: Scaling your engineering team</div>
                    <div style={{ padding: 12, background: 'rgba(245, 158, 11, 0.1)', color: '#d97706', borderRadius: 8, fontSize: 13 }}>"Hi Sarah, noticed you just raised Series B. Instead of hiring 5 junior devs, DialforAI can..."</div>
                  </div>
                </div>
              </div>
              <div style={{ order: 0 }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', borderRadius: 999, fontSize: 12, fontWeight: 600, marginBottom: 20 }}>
                  <Mail size={14} /> Sales Agent
                </div>
                <h3 style={{ fontSize: 'clamp(20px, 4vw, 36px)', fontWeight: 800, marginBottom: 16, lineHeight: 1.2 }}>Outreach that converts.</h3>
                <p style={{ fontSize: 'clamp(13px, 1.8vw, 18px)', color: 'var(--text-2)', lineHeight: 1.6, marginBottom: 24 }}>
                  The Sales Agent creates highly targeted outreach, multi-touch follow-up sequences, and LinkedIn InMails tailored exactly to your prospect's pain points.
                </p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: 'var(--text-1)', fontSize: 'clamp(12px, 1.5vw, 15px)', display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <li style={{ display: 'flex', gap: 10, alignItems: 'center' }}><ShieldCheck size={18} color="#f59e0b" /> High-converting cold email generation</li>
                  <li style={{ display: 'flex', gap: 10, alignItems: 'center' }}><BrainCircuit size={18} color="#f59e0b" /> Intelligent follow-up cadence mapping</li>
                </ul>
              </div>
            </div>

            {/* Growth Intelligence */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'clamp(24px, 5vw, 48px)', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: 999, fontSize: 12, fontWeight: 600, marginBottom: 20 }}>
                  <TrendingUp size={14} /> Growth Agent
                </div>
                <h3 style={{ fontSize: 'clamp(20px, 4vw, 36px)', fontWeight: 800, marginBottom: 16, lineHeight: 1.2 }}>Senior BDM Consultant.</h3>
                <p style={{ fontSize: 'clamp(13px, 1.8vw, 18px)', color: 'var(--text-2)', lineHeight: 1.6, marginBottom: 24 }}>
                  Analyze company profiles, research market needs, identify Ideal Customer Profiles (ICP), build targeted lead opportunities, and draft competitor outreach tactics.
                </p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: 'var(--text-1)', fontSize: 'clamp(12px, 1.5vw, 15px)', display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <li style={{ display: 'flex', gap: 10, alignItems: 'center' }}><ShieldCheck size={18} color="#10b981" /> Full market research & competitor gap analysis</li>
                  <li style={{ display: 'flex', gap: 10, alignItems: 'center' }}><BrainCircuit size={18} color="#10b981" /> ICP building & outbound outreach strategies</li>
                </ul>
              </div>
              <div style={{ background: 'var(--bg-card)', padding: 'clamp(20px, 4vw, 40px)', borderRadius: 20, border: '1px solid var(--border)', boxShadow: '0 16px 40px rgba(0,0,0,0.2)' }}>
                <div style={{ width: '100%', height: 240, background: 'var(--bg-input)', borderRadius: 12, border: '1px solid var(--border-2)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                  <div style={{ borderBottom: '1px solid var(--border-2)', padding: '10px 16px', display: 'flex', gap: 6 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }} />
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b' }} />
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981' }} />
                  </div>
                  <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={{ padding: 12, background: 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13, color: 'var(--text-3)' }}>Company profile: Your Company</div>
                    <div style={{ padding: 12, background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: 8, fontSize: 13 }}>"BDM Growth Strategy: Target USA healthcare clinics with IT staffing. Competitor gap: custom EHR integrations."</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Built by Brilliant Brains */}
      <section style={{ padding: 'clamp(60px, 10vw, 120px) 20px', background: 'var(--bg-card)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <Cpu size={40} style={{ color: 'var(--text-1)', marginBottom: 24, opacity: 0.8 }} />
          <h2 style={{ fontSize: 'clamp(22px, 5vw, 40px)', fontWeight: 800, marginBottom: 20, letterSpacing: '-0.03em' }}>Built by Brilliant Brains</h2>
          <p style={{ fontSize: 'clamp(14px, 2vw, 20px)', color: 'var(--text-2)', lineHeight: 1.7, maxWidth: 760, margin: '0 auto' }}>
            DialforAI wasn't built by a standard agency. It is engineered by a specialized team of software engineers, AI researchers, and UX designers who previously scaled systems at top-tier tech giants. We obsessed over every line of code so you don't have to.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: 'clamp(24px, 4vw, 40px) 20px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 16, color: 'var(--text-3)', fontSize: 13 }}>
        <div>© 2026 DialforAI. All rights reserved.</div>
        <div style={{ display: 'flex', gap: 20 }}>
          <Link href="/contact" style={{ color: 'var(--text-3)', textDecoration: 'none' }}>Contact Us</Link>
          <Link href="/about" style={{ color: 'var(--text-3)', textDecoration: 'none' }}>About</Link>
        </div>
      </footer>

      <style>{`
        .hover-card:hover { transform: translateY(-4px); border-color: rgba(59, 130, 246, 0.4) !important; box-shadow: 0 12px 24px rgba(0,0,0,0.1); }
        .about-nav-desktop { display: flex; }
        .about-nav-mobile { display: none !important; }
        @media (max-width: 600px) {
          .about-nav-desktop { display: none !important; }
          .about-nav-mobile { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
