'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Hexagon, Users, Mail, Search, TrendingUp, ArrowRight, Zap, ShieldCheck, BrainCircuit, Bot, Code, Sparkles, Cpu, Menu, X } from 'lucide-react';


export default function AboutPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-main)', color: 'var(--text-1)', fontFamily: 'var(--font-sans)', display: 'flex', flexDirection: 'column', overflowX: 'hidden' }}>
      
      {/* Navigation */}
      <nav style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, background: 'var(--bg-main)', zIndex: 100 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: 'var(--text-1)' }}>
          <Hexagon size={20} />
          <span style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-0.02em' }}>DialforAI</span>
        </Link>

        {/* Desktop Nav */}
        <div className="about-nav-desktop" style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          <Link href="/about" style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-1)', textDecoration: 'none' }}>About</Link>
          <Link href="/contact" style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-2)', textDecoration: 'none' }}>Contact</Link>
          <Link href="/" className="btn btn-primary" style={{ padding: '8px 16px', borderRadius: 8, textDecoration: 'none', fontSize: 13 }}>Launch App</Link>
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
        <div style={{ position: 'fixed', top: 57, left: 0, right: 0, background: 'var(--bg-main)', borderBottom: '1px solid var(--border)', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 4, zIndex: 99 }}>
          <Link href="/about" onClick={() => setMenuOpen(false)} style={{ padding: '12px 8px', fontSize: 15, fontWeight: 600, color: 'var(--text-1)', textDecoration: 'none', borderRadius: 6 }}>About</Link>
          <Link href="/contact" onClick={() => setMenuOpen(false)} style={{ padding: '12px 8px', fontSize: 15, fontWeight: 500, color: 'var(--text-2)', textDecoration: 'none', borderRadius: 6 }}>Contact</Link>
          <Link href="/" onClick={() => setMenuOpen(false)} className="btn btn-primary" style={{ marginTop: 8, padding: '12px', borderRadius: 8, textDecoration: 'none', fontSize: 14, textAlign: 'center', justifyContent: 'center' }}>Launch App →</Link>
        </div>
      )}

      {/* Hero Section */}
      <section style={{ position: 'relative', padding: 'clamp(60px, 12vw, 120px) 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        
        {/* Ambient Glows */}
        <div style={{ position: 'absolute', top: -100, left: '50%', transform: 'translateX(-50%)', width: 600, height: 400, background: 'radial-gradient(circle, rgba(79, 70, 229, 0.15) 0%, transparent 70%)', filter: 'blur(60px)', zIndex: 0, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '20%', right: '10%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(236, 72, 153, 0.1) 0%, transparent 70%)', filter: 'blur(60px)', zIndex: 0, pointerEvents: 'none' }} />
        
        <div style={{ position: 'relative', zIndex: 1, display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', background: 'var(--bg-btn)', border: '1px solid var(--border-2)', borderRadius: 999, fontSize: 12, fontWeight: 600, color: 'var(--text-1)', marginBottom: 24, animation: 'slideUp 0.6s ease-out' }}>
          <Zap size={14} style={{ color: '#fbbf24' }} /> Multi-Agent Operating System
        </div>
        
        <h1 style={{ position: 'relative', zIndex: 1, fontSize: 'clamp(28px, 6vw, 72px)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.1, maxWidth: 900, marginBottom: 20, animation: 'slideUp 0.8s ease-out', padding: '0 4px' }}>
          Automate your growth with{' '}
          <span style={{ background: 'linear-gradient(135deg, #4f46e5, #ec4899, #f59e0b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Autonomous Intelligence.</span>
        </h1>
        
        <p style={{ position: 'relative', zIndex: 1, fontSize: 'clamp(14px, 2vw, 20px)', color: 'var(--text-2)', lineHeight: 1.6, maxWidth: 620, margin: '0 auto 32px', animation: 'slideUp 1s ease-out', padding: '0 4px' }}>
          DialforAI is a premium Agent OS that deploys autonomous AI workers to scale your recruitment, accelerate outbound sales, and find your ideal prospects on autopilot.
        </p>

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexWrap: 'wrap', gap: 12, animation: 'slideUp 1.2s ease-out', justifyContent: 'center' }}>
          <Link href="/" className="btn btn-primary" style={{ padding: 'clamp(10px,2vw,16px) clamp(20px,4vw,32px)', fontSize: 'clamp(13px,1.5vw,16px)', borderRadius: 12, display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            Start Building <ArrowRight size={16} />
          </Link>
          <Link href="/contact" className="btn btn-outline" style={{ padding: 'clamp(10px,2vw,16px) clamp(20px,4vw,32px)', fontSize: 'clamp(13px,1.5vw,16px)', borderRadius: 12, display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }}>
            Talk to Sales
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section style={{ position: 'relative', padding: 'clamp(60px, 10vw, 100px) 20px', background: 'var(--bg-card)', borderTop: '1px solid var(--border)', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', height: '100%', background: 'radial-gradient(ellipse at top, rgba(79, 70, 229, 0.05) 0%, transparent 80%)', pointerEvents: 'none' }} />
        
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 'clamp(22px, 5vw, 40px)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 12 }}>How DialforAI Works</h2>
            <p style={{ fontSize: 'clamp(13px, 1.8vw, 18px)', color: 'var(--text-2)', maxWidth: 560, margin: '0 auto' }}>The easiest way to integrate specialized AI agents into your business operations.</p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
            {[
              { step: '1', title: 'Select your Agent', desc: 'Choose the specialized worker you need — whether it\'s for finding prospects or interviewing candidates.' },
              { step: '2', title: 'Provide Context', desc: 'Drop in a LinkedIn URL, describe your ideal customer profile, or paste a resume. The agent ingests context instantly.' },
              { step: '3', title: 'Autonomous Execution', desc: 'The agent executes live web searches, writes emails, or scores candidates autonomously. You just review results.', accent: true },
            ].map(item => (
              <div key={item.step} style={{ padding: 'clamp(24px, 4vw, 40px)', background: 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: 20, textAlign: 'center' }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--bg-btn)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 700, margin: '0 auto 20px', border: item.accent ? '2px solid #4f46e5' : '2px solid var(--border-2)', color: item.accent ? '#4f46e5' : 'inherit' }}>{item.step}</div>
                <h3 style={{ fontSize: 'clamp(15px, 2vw, 20px)', fontWeight: 700, marginBottom: 12 }}>{item.title}</h3>
                <p style={{ color: 'var(--text-2)', lineHeight: 1.6, fontSize: 'clamp(12px, 1.5vw, 15px)' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Explore Agents */}
      <section style={{ position: 'relative', padding: 'clamp(60px, 10vw, 120px) 20px', background: 'var(--bg-main)', overflowX: 'hidden' }}>
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

            {/* Prospect Finder */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'clamp(24px, 5vw, 48px)', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: 999, fontSize: 12, fontWeight: 600, marginBottom: 20 }}>
                  <Search size={14} /> Prospect Finder
                </div>
                <h3 style={{ fontSize: 'clamp(20px, 4vw, 36px)', fontWeight: 800, marginBottom: 16, lineHeight: 1.2 }}>Find targets in real-time.</h3>
                <p style={{ fontSize: 'clamp(13px, 1.8vw, 18px)', color: 'var(--text-2)', lineHeight: 1.6, marginBottom: 24 }}>
                  Type an Ideal Customer Profile (e.g., "SaaS CTOs in NY") and the agent scours the internet, professional networks, and company pages to give you an actionable lead list.
                </p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: 'var(--text-1)', fontSize: 'clamp(12px, 1.5vw, 15px)', display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <li style={{ display: 'flex', gap: 10, alignItems: 'center' }}><ShieldCheck size={18} color="#10b981" /> Semantic intent filtering</li>
                  <li style={{ display: 'flex', gap: 10, alignItems: 'center' }}><BrainCircuit size={18} color="#10b981" /> Live cross-referencing from multiple sources</li>
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
                    <div style={{ padding: 12, background: 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13 }}>"Find SaaS CTOs in New York with 50-200 employees."</div>
                    <div style={{ padding: 12, background: 'rgba(16, 185, 129, 0.1)', color: '#059669', borderRadius: 8, fontSize: 13 }}>Found 4 matches.<br/>1. Jane Smith (CTO @ TechFlow)<br/>2. Mark Johnson (VP Eng @ DataSync)...</div>
                  </div>
                </div>
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
                    <div style={{ padding: 12, background: 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13, color: 'var(--text-3)' }}>Company profile: Infinity STS</div>
                    <div style={{ padding: 12, background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: 8, fontSize: 13 }}>"BDM Growth Strategy: Target USA healthcare clinics with IT staffing. Competitor gap: custom EHR integrations."</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Coming Soon */}
      <section style={{ padding: 'clamp(60px, 10vw, 120px) 20px', background: 'linear-gradient(180deg, var(--bg-main) 0%, var(--bg-card) 100%)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(22px, 5vw, 40px)', fontWeight: 800, marginBottom: 12, letterSpacing: '-0.03em' }}>More Agents Coming Soon</h2>
          <p style={{ fontSize: 'clamp(13px, 1.8vw, 18px)', color: 'var(--text-2)', maxWidth: 560, margin: '0 auto 48px' }}>We are constantly expanding the DialforAI operating system.</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
            {[
              { icon: <Bot size={22} />, title: 'Customer Support Agent', desc: 'Autonomous L1/L2 support hooked directly into your Zendesk or Intercom.' },
              { icon: <Sparkles size={22} />, title: 'Marketing Copy Agent', desc: 'Generates A/B tested ad copy, SEO blogs, and social campaigns aligned with your brand.' },
              { icon: <Code size={22} />, title: 'Code Review Agent', desc: 'Hooks into GitHub to automatically review PRs for security flaws and style violations.' },
            ].map(item => (
              <div key={item.title} style={{ padding: 'clamp(20px, 3vw, 32px)', background: 'var(--bg-main)', border: '1px dashed var(--border-2)', borderRadius: 20 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--bg-btn)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--text-3)' }}>
                  {item.icon}
                </div>
                <h3 style={{ fontSize: 'clamp(14px, 2vw, 18px)', fontWeight: 700, marginBottom: 10 }}>{item.title}</h3>
                <p style={{ color: 'var(--text-2)', lineHeight: 1.5, fontSize: 'clamp(12px, 1.3vw, 14px)' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Built by Brilliant Brains */}
      <section style={{ padding: 'clamp(60px, 10vw, 120px) 20px', background: 'var(--bg-main)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <Cpu size={40} style={{ color: 'var(--text-1)', marginBottom: 24, opacity: 0.8 }} />
          <h2 style={{ fontSize: 'clamp(22px, 5vw, 40px)', fontWeight: 800, marginBottom: 20, letterSpacing: '-0.03em' }}>Built by Brilliant Brains</h2>
          <p style={{ fontSize: 'clamp(14px, 2vw, 20px)', color: 'var(--text-2)', lineHeight: 1.7, maxWidth: 760, margin: '0 auto' }}>
            DialforAI wasn't built by a standard agency. It is engineered by a specialized team of software engineers, AI researchers, and UX designers who previously scaled systems at top-tier tech giants. We obsessed over every line of code so you don't have to.
          </p>
        </div>
      </section>

      {/* Footer CTA */}
      <section style={{ position: 'relative', padding: 'clamp(60px, 10vw, 120px) 20px clamp(80px, 12vw, 140px)', textAlign: 'center', background: 'var(--bg-main)', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', height: 400, background: 'radial-gradient(ellipse at bottom, rgba(79, 70, 229, 0.15) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none', zIndex: 0 }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontSize: 'clamp(22px, 5vw, 40px)', fontWeight: 800, marginBottom: 16 }}>Ready to scale your workforce?</h2>
          <p style={{ fontSize: 'clamp(13px, 1.8vw, 18px)', color: 'var(--text-2)', marginBottom: 32 }}>Deploy DialforAI's autonomous agents today and focus on what matters.</p>
          <Link href="/" className="btn btn-primary" style={{ padding: 'clamp(12px, 2vw, 16px) clamp(24px, 4vw, 40px)', fontSize: 'clamp(13px, 1.5vw, 16px)', borderRadius: 12, display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none', boxShadow: '0 10px 30px rgba(79, 70, 229, 0.3)' }}>
            Open Workspace <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: 'clamp(24px, 4vw, 40px) 20px', borderTop: '1px solid var(--border)', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 16, color: 'var(--text-3)', fontSize: 13 }}>
        <div>© 2026 DialforAI. All rights reserved.</div>
        <div style={{ display: 'flex', gap: 20 }}>
          <Link href="/contact" style={{ color: 'var(--text-3)', textDecoration: 'none' }}>Contact Us</Link>
          <Link href="/about" style={{ color: 'var(--text-3)', textDecoration: 'none' }}>About</Link>
        </div>
      </footer>

      <style>{`
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
