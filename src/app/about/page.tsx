import React from 'react';
import Link from 'next/link';
import { Hexagon, Users, Mail, Search, ArrowRight, Zap, ShieldCheck, BrainCircuit, Bot, Code, Database, Sparkles, Cpu, Layers } from 'lucide-react';

export default function AboutPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-main)', color: 'var(--text-1)', fontFamily: 'var(--font-sans)', display: 'flex', flexDirection: 'column' }}>
      
      {/* Navigation */}
      <nav style={{ padding: '24px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, background: 'var(--bg-main)', zIndex: 100 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: 'var(--text-1)' }}>
          <Hexagon />
          <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em' }}>DailforAI</span>
        </Link>
        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <Link href="/about" style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-1)', textDecoration: 'none' }}>About</Link>
          <Link href="/contact" style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-2)', textDecoration: 'none' }}>Contact</Link>
          <Link href="/" className="btn btn-primary" style={{ padding: '8px 16px', borderRadius: 8, textDecoration: 'none', fontSize: 14 }}>Launch App</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ position: 'relative', padding: '120px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        
        {/* Ambient Hero Glows */}
        <div style={{ position: 'absolute', top: -100, left: '50%', transform: 'translateX(-50%)', width: 600, height: 400, background: 'radial-gradient(circle, rgba(79, 70, 229, 0.15) 0%, transparent 70%)', filter: 'blur(60px)', zIndex: 0, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '20%', right: '10%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(236, 72, 153, 0.1) 0%, transparent 70%)', filter: 'blur(60px)', zIndex: 0, pointerEvents: 'none' }} />
        
        <div style={{ position: 'relative', zIndex: 1, display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: 'var(--bg-btn)', border: '1px solid var(--border-2)', borderRadius: 999, fontSize: 13, fontWeight: 600, color: 'var(--text-1)', marginBottom: 32, animation: 'slideUp 0.6s ease-out' }}>
          <Zap size={16} style={{ color: '#fbbf24' }} /> Multi-Agent Operating System
        </div>
        
        <h1 style={{ fontSize: 'clamp(48px, 6vw, 72px)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.1, maxWidth: 900, marginBottom: 24, animation: 'slideUp 0.8s ease-out' }}>
          Automate your growth with <br/>
          <span style={{ background: 'linear-gradient(135deg, #4f46e5, #ec4899, #f59e0b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Autonomous Intelligence.</span>
        </h1>
        
        <p style={{ fontSize: 'clamp(18px, 2vw, 22px)', color: 'var(--text-2)', lineHeight: 1.6, maxWidth: 700, margin: '0 auto 40px', animation: 'slideUp 1s ease-out' }}>
          DailforAI is a premium Agent OS that deploys autonomous AI workers to scale your recruitment, accelerate outbound sales, and find your ideal prospects on autopilot.
        </p>

        <div style={{ display: 'flex', gap: 16, animation: 'slideUp 1.2s ease-out' }}>
          <Link href="/" className="btn btn-primary" style={{ padding: '16px 32px', fontSize: 16, borderRadius: 12, display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            Start Building <ArrowRight size={18} />
          </Link>
          <Link href="/contact" className="btn btn-outline" style={{ padding: '16px 32px', fontSize: 16, borderRadius: 12, display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }}>
            Talk to Sales
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section style={{ position: 'relative', padding: '100px 40px', background: 'var(--bg-card)', borderTop: '1px solid var(--border)', overflow: 'hidden' }}>
        {/* Subtle Section Glow */}
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', height: '100%', background: 'radial-gradient(ellipse at top, rgba(79, 70, 229, 0.05) 0%, transparent 80%)', pointerEvents: 'none' }} />
        
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <h2 style={{ fontSize: 40, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 16 }}>How DailforAI Works</h2>
            <p style={{ fontSize: 18, color: 'var(--text-2)', maxWidth: 600, margin: '0 auto' }}>The easiest way to integrate specialized AI agents into your business operations.</p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 32 }}>
            <div style={{ padding: 40, background: 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: 24, textAlign: 'center' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--bg-btn)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 700, margin: '0 auto 24px', border: '2px solid var(--border-2)' }}>1</div>
              <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Select your Agent</h3>
              <p style={{ color: 'var(--text-2)', lineHeight: 1.6 }}>Choose the specialized worker you need from our OS dashboard—whether it's for finding prospects or interviewing candidates.</p>
            </div>
            
            <div style={{ padding: 40, background: 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: 24, textAlign: 'center' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--bg-btn)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 700, margin: '0 auto 24px', border: '2px solid var(--border-2)' }}>2</div>
              <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Provide Context</h3>
              <p style={{ color: 'var(--text-2)', lineHeight: 1.6 }}>Drop in a LinkedIn URL, describe your ideal customer profile, or paste a resume. The agent ingests context instantly.</p>
            </div>
            
            <div style={{ padding: 40, background: 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: 24, textAlign: 'center' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--bg-btn)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 700, margin: '0 auto 24px', border: '2px solid #4f46e5', color: '#4f46e5' }}>3</div>
              <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Autonomous Execution</h3>
              <p style={{ color: 'var(--text-2)', lineHeight: 1.6 }}>The agent executes live web searches, writes personalized emails, or scores candidates autonomously. You just review the results.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Deep Dive into Agents */}
      <section style={{ position: 'relative', padding: '120px 40px', background: 'var(--bg-main)' }}>
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 1200, margin: '0 auto' }}>
          <h2 style={{ fontSize: 48, fontWeight: 800, textAlign: 'center', marginBottom: 80, letterSpacing: '-0.03em' }}>Explore Our Agents</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 120 }}>
            {/* Recruitment Detail */}
            <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 64, alignItems: 'center' }}>
              <div style={{ position: 'absolute', top: '50%', left: '20%', transform: 'translate(-50%, -50%)', width: 500, height: 500, background: 'radial-gradient(circle, rgba(79, 70, 229, 0.08) 0%, transparent 70%)', filter: 'blur(80px)', zIndex: 0, pointerEvents: 'none' }} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: 'rgba(79, 70, 229, 0.1)', color: '#4f46e5', borderRadius: 999, fontSize: 13, fontWeight: 600, marginBottom: 24 }}>
                  <Users size={16} /> Recruitment Agent
                </div>
                <h3 style={{ fontSize: 36, fontWeight: 800, marginBottom: 24, lineHeight: 1.2 }}>Your Autonomous HR Partner.</h3>
                <p style={{ fontSize: 18, color: 'var(--text-2)', lineHeight: 1.6, marginBottom: 32 }}>
                  Stop manually reading resumes. The Recruitment Agent scrapes LinkedIn and GitHub, generates 100-point candidate scorecards, conducts initial technical interviews, and even detects AI cheating during screening.
                </p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: 'var(--text-1)', fontSize: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <li style={{ display: 'flex', gap: 12, alignItems: 'center' }}><ShieldCheck size={20} color="#4f46e5"/> Live resume and GitHub parsing</li>
                  <li style={{ display: 'flex', gap: 12, alignItems: 'center' }}><BrainCircuit size={20} color="#4f46e5"/> LLM-powered cheating detection</li>
                  <li style={{ display: 'flex', gap: 12, alignItems: 'center' }}><Layers size={20} color="#4f46e5"/> 100-point automated grading rubrics</li>
                </ul>
              </div>
              <div style={{ background: 'var(--bg-card)', padding: 40, borderRadius: 24, border: '1px solid var(--border)', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
                <div style={{ width: '100%', height: 300, background: 'var(--bg-input)', borderRadius: 16, border: '1px solid var(--border-2)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                  <div style={{ borderBottom: '1px solid var(--border-2)', padding: '12px 20px', display: 'flex', gap: 8 }}>
                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ef4444' }} />
                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#f59e0b' }} />
                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#10b981' }} />
                  </div>
                  <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ padding: 16, background: 'rgba(79, 70, 229, 0.1)', color: '#4f46e5', borderRadius: 8, fontSize: 14 }}>"Extracted profile for John Doe. Fit Score: 92/100"</div>
                    <div style={{ padding: 16, background: 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 14 }}>Strong React fundamentals. Minor anomaly detected in algorithm response time (possible copy-paste).</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sales Detail */}
            <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 64, alignItems: 'center' }}>
              <div style={{ position: 'absolute', top: '50%', right: '20%', transform: 'translate(50%, -50%)', width: 500, height: 500, background: 'radial-gradient(circle, rgba(245, 158, 11, 0.08) 0%, transparent 70%)', filter: 'blur(80px)', zIndex: 0, pointerEvents: 'none' }} />
              <div style={{ position: 'relative', zIndex: 1, background: 'var(--bg-card)', padding: 40, borderRadius: 24, border: '1px solid var(--border)', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
                <div style={{ width: '100%', height: 300, background: 'var(--bg-input)', borderRadius: 16, border: '1px solid var(--border-2)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                  <div style={{ borderBottom: '1px solid var(--border-2)', padding: '12px 20px', display: 'flex', gap: 8 }}>
                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ef4444' }} />
                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#f59e0b' }} />
                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#10b981' }} />
                  </div>
                  <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ padding: 16, background: 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 14, color: 'var(--text-3)' }}>Subject: Scaling your engineering team</div>
                    <div style={{ padding: 16, background: 'rgba(245, 158, 11, 0.1)', color: '#d97706', borderRadius: 8, fontSize: 14 }}>"Hi Sarah, noticed you just raised Series B. Instead of hiring 5 junior devs, DailforAI can..."</div>
                  </div>
                </div>
              </div>
              <div style={{ order: -1 }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', borderRadius: 999, fontSize: 13, fontWeight: 600, marginBottom: 24 }}>
                  <Mail size={16} /> Sales Agent
                </div>
                <h3 style={{ fontSize: 36, fontWeight: 800, marginBottom: 24, lineHeight: 1.2 }}>Outreach that converts.</h3>
                <p style={{ fontSize: 18, color: 'var(--text-2)', lineHeight: 1.6, marginBottom: 32 }}>
                  Generating personalized cold emails takes time. The Sales Agent creates highly targeted outreach, multi-touch follow-up sequences, and LinkedIn InMails tailored exactly to your prospect's pain points while keeping word count under 200.
                </p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: 'var(--text-1)', fontSize: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <li style={{ display: 'flex', gap: 12, alignItems: 'center' }}><ShieldCheck size={20} color="#f59e0b"/> High-converting cold email generation</li>
                  <li style={{ display: 'flex', gap: 12, alignItems: 'center' }}><BrainCircuit size={20} color="#f59e0b"/> Intelligent follow-up cadence mapping</li>
                </ul>
              </div>
            </div>

            {/* Prospect Finder Detail */}
            <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 64, alignItems: 'center' }}>
              <div style={{ position: 'absolute', top: '50%', left: '20%', transform: 'translate(-50%, -50%)', width: 500, height: 500, background: 'radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, transparent 70%)', filter: 'blur(80px)', zIndex: 0, pointerEvents: 'none' }} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: 999, fontSize: 13, fontWeight: 600, marginBottom: 24 }}>
                  <Search size={16} /> Prospect Finder
                </div>
                <h3 style={{ fontSize: 36, fontWeight: 800, marginBottom: 24, lineHeight: 1.2 }}>Find targets in real-time.</h3>
                <p style={{ fontSize: 18, color: 'var(--text-2)', lineHeight: 1.6, marginBottom: 32 }}>
                  Your autonomous research assistant. Type an Ideal Customer Profile (e.g., "SaaS CTOs in NY") and the agent scours the internet, professional networks, and company pages to give you an actionable lead list.
                </p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: 'var(--text-1)', fontSize: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <li style={{ display: 'flex', gap: 12, alignItems: 'center' }}><ShieldCheck size={20} color="#10b981"/> Semantic intent filtering</li>
                  <li style={{ display: 'flex', gap: 12, alignItems: 'center' }}><BrainCircuit size={20} color="#10b981"/> Live cross-referencing from multiple sources</li>
                </ul>
              </div>
              <div style={{ background: 'var(--bg-card)', padding: 40, borderRadius: 24, border: '1px solid var(--border)', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
                <div style={{ width: '100%', height: 300, background: 'var(--bg-input)', borderRadius: 16, border: '1px solid var(--border-2)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                  <div style={{ borderBottom: '1px solid var(--border-2)', padding: '12px 20px', display: 'flex', gap: 8 }}>
                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ef4444' }} />
                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#f59e0b' }} />
                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#10b981' }} />
                  </div>
                  <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ padding: 16, background: 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 14 }}>"Find SaaS CTOs in New York with 50-200 employees."</div>
                    <div style={{ padding: 16, background: 'rgba(16, 185, 129, 0.1)', color: '#059669', borderRadius: 8, fontSize: 14 }}>Found 4 matches.<br/><br/>1. Jane Smith (CTO @ TechFlow)<br/>2. Mark Johnson (VP Eng @ DataSync)...</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Agents */}
      <section style={{ padding: '120px 40px', background: 'linear-gradient(180deg, var(--bg-main) 0%, var(--bg-card) 100%)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 40, fontWeight: 800, marginBottom: 16, letterSpacing: '-0.03em' }}>More Agents Coming Soon</h2>
          <p style={{ fontSize: 18, color: 'var(--text-2)', maxWidth: 600, margin: '0 auto 64px' }}>We are constantly expanding the DailforAI operating system. Here is what's next on the roadmap.</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 24 }}>
            <div style={{ padding: 32, background: 'var(--bg-main)', border: '1px dashed var(--border-2)', borderRadius: 24 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--bg-btn)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: 'var(--text-3)' }}>
                <Bot size={24} />
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>Customer Support Agent</h3>
              <p style={{ color: 'var(--text-2)', lineHeight: 1.5, fontSize: 14 }}>Autonomous L1 and L2 support resolution hooked directly into your Zendesk or Intercom.</p>
            </div>
            
            <div style={{ padding: 32, background: 'var(--bg-main)', border: '1px dashed var(--border-2)', borderRadius: 24 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--bg-btn)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: 'var(--text-3)' }}>
                <Sparkles size={24} />
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>Marketing Copy Agent</h3>
              <p style={{ color: 'var(--text-2)', lineHeight: 1.5, fontSize: 14 }}>Generates A/B tested ad copy, SEO blogs, and social media campaigns perfectly aligned with your brand voice.</p>
            </div>
            
            <div style={{ padding: 32, background: 'var(--bg-main)', border: '1px dashed var(--border-2)', borderRadius: 24 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--bg-btn)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: 'var(--text-3)' }}>
                <Code size={24} />
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>Code Review Agent</h3>
              <p style={{ color: 'var(--text-2)', lineHeight: 1.5, fontSize: 14 }}>Hooks into GitHub to automatically review PRs for security flaws, performance issues, and style violations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* The Team / Brains Section */}
      <section style={{ padding: '120px 40px', background: 'var(--bg-main)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>
          <Cpu size={48} style={{ color: 'var(--text-1)', marginBottom: 32, opacity: 0.8 }} />
          <h2 style={{ fontSize: 40, fontWeight: 800, marginBottom: 24, letterSpacing: '-0.03em' }}>Built by Brilliant Brains</h2>
          <p style={{ fontSize: 20, color: 'var(--text-2)', lineHeight: 1.7, maxWidth: 800, margin: '0 auto' }}>
            DailforAI wasn't built by a standard agency. It is engineered by a specialized team of brilliant software engineers, AI researchers, and UX designers who previously scaled systems at top-tier tech giants. We understand exactly what it takes to build highly reliable, autonomous software that safely interfaces with your production data. We obsessed over every line of code so you don't have to.
          </p>
        </div>
      </section>

      {/* Footer CTA */}
      <section style={{ position: 'relative', padding: '120px 40px 140px', textAlign: 'center', background: 'var(--bg-main)', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', height: 400, background: 'radial-gradient(ellipse at bottom, rgba(79, 70, 229, 0.15) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none', zIndex: 0 }} />
        
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontSize: 40, fontWeight: 800, marginBottom: 24 }}>Ready to scale your workforce?</h2>
          <p style={{ fontSize: 18, color: 'var(--text-2)', marginBottom: 40 }}>Deploy DailforAI's autonomous agents today and focus on what matters.</p>
          <Link href="/" className="btn btn-primary" style={{ padding: '16px 40px', fontSize: 16, borderRadius: 12, display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none', boxShadow: '0 10px 30px rgba(79, 70, 229, 0.3)' }}>
            Open Workspace <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Footer footer */}
      <footer style={{ padding: '40px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-3)', fontSize: 14 }}>
        <div>&copy; 2026 DailforAI. All rights reserved.</div>
        <div style={{ display: 'flex', gap: 24 }}>
          <Link href="/contact" style={{ color: 'var(--text-3)', textDecoration: 'none' }}>Contact Us</Link>
          <Link href="/about" style={{ color: 'var(--text-3)', textDecoration: 'none' }}>About</Link>
        </div>
      </footer>
    </div>
  );
}
