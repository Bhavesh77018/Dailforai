import React, { useState } from 'react';
import { Hexagon, Users, Search, TrendingUp, ArrowRight, Zap, ShieldCheck, BrainCircuit, Bot, Code, Sparkles, Cpu, Mail } from 'lucide-react';

interface LandingProps {
  onLaunchChat: () => void;
  onSearchJobs: (query: string) => void;
}

export default function Landing({ onLaunchChat, onSearchJobs }: LandingProps) {
  const [jobQuery, setJobQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchJobs(jobQuery);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-main)', color: 'var(--text-1)', display: 'flex', flexDirection: 'column', overflowX: 'hidden' }}>
      
      {/* Navigation */}
      <nav style={{ padding: '16px clamp(20px, 4vw, 40px)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, background: 'var(--bg-main)', zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-1)' }}>
          <Hexagon size={24} color="#3b82f6" />
          <span style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.02em' }}>DialforAI</span>
        </div>
        <div style={{ display: 'flex', gap: 16 }}>
          <button className="btn btn-outline" onClick={onLaunchChat} style={{ padding: '8px 16px', fontSize: 13, borderRadius: 8 }}>
            Sign In
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ position: 'relative', padding: 'clamp(60px, 12vw, 120px) 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        
        {/* Ambient Glows */}
        <div style={{ position: 'absolute', top: -100, left: '50%', transform: 'translateX(-50%)', width: 600, height: 400, background: 'radial-gradient(circle, rgba(79, 70, 229, 0.15) 0%, transparent 70%)', filter: 'blur(60px)', zIndex: 0, pointerEvents: 'none' }} />
        
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
            onClick={onLaunchChat} 
            className="btn btn-primary" 
            style={{ padding: 'clamp(14px,2vw,18px) clamp(24px,4vw,40px)', fontSize: 'clamp(14px,1.5vw,16px)', borderRadius: 16, display: 'inline-flex', alignItems: 'center', gap: 10, boxShadow: '0 10px 30px rgba(79, 70, 229, 0.3)', width: '100%', maxWidth: 300, justifyContent: 'center' }}
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

      {/* Explore Agents */}
      <section style={{ position: 'relative', padding: 'clamp(60px, 10vw, 120px) 20px', background: 'var(--bg-card)', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(22px, 5vw, 40px)', fontWeight: 800, textAlign: 'center', marginBottom: 'clamp(40px, 6vw, 80px)', letterSpacing: '-0.03em' }}>Explore Our Agents</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'clamp(24px, 5vw, 40px)' }}>
            {[
              { icon: <Users size={24}/>, title: 'Recruitment Agent', desc: 'Live resume parsing, GitHub analysis, and 100-point candidate scorecards.', color: '#4f46e5' },
              { icon: <Search size={24}/>, title: 'Prospect Finder', desc: 'Find high-intent targets globally based on dynamic semantic queries.', color: '#10b981' },
              { icon: <TrendingUp size={24}/>, title: 'Growth Agent', desc: 'Senior BDM mapping competitor gaps, market sizing, and pipeline hooks.', color: '#8b5cf6' },
              { icon: <Mail size={24}/>, title: 'Sales Agent', desc: 'Writes high-converting cold outreach sequences tailored to ICP pain points.', color: '#f59e0b' }
            ].map((agent, i) => (
              <div key={i} style={{ padding: 32, background: 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: 24, cursor: 'pointer', transition: 'all 0.2s' }} onClick={onLaunchChat}>
                <div style={{ width: 56, height: 56, borderRadius: 16, background: `${agent.color}15`, color: agent.color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                  {agent.icon}
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 12 }}>{agent.title}</h3>
                <p style={{ color: 'var(--text-2)', lineHeight: 1.6, fontSize: 15 }}>{agent.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
