'use client';
import React from 'react';
import { Users, Search, BrainCircuit, ShieldCheck, ArrowRight, Zap } from 'lucide-react';

interface Props {
  onLaunch: () => void;
}

export default function RecruitmentAgent({ onLaunch }: Props) {
  return (
    <div className="fade-in" style={{ padding: '80px 40px', maxWidth: 1100, margin: '0 auto', width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Hero Section */}
      <div style={{ textAlign: 'center', marginBottom: 80, animation: 'slideUp 0.6s ease-out' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: 'rgba(79, 70, 229, 0.1)', border: '1px solid rgba(79, 70, 229, 0.2)', borderRadius: 999, fontSize: 13, fontWeight: 600, color: 'var(--color-recruit)', marginBottom: 32 }}>
          <Users size={16} /> Autonomous AI Agent
        </div>
        
        <h1 style={{ fontSize: 56, fontWeight: 800, letterSpacing: '-0.04em', marginBottom: 24, lineHeight: 1.1 }}>
          Candidate Intelligence, <br/>
          <span style={{ background: 'linear-gradient(135deg, #4f46e5, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Fully Automated.</span>
        </h1>
        
        <p style={{ fontSize: 19, color: 'var(--text-2)', lineHeight: 1.6, maxWidth: 650, margin: '0 auto 40px' }}>
          DialforAI uses advanced multi-pass extraction to build structured profiles from LinkedIn, GitHub, and Naukri. It conducts interviews, detects cheating, and scores candidates on a transparent rubric.
        </p>

        <button className="btn btn-primary" onClick={onLaunch} style={{ padding: '14px 32px', fontSize: 16, borderRadius: 12, display: 'inline-flex', alignItems: 'center', gap: 10, boxShadow: '0 8px 30px rgba(79, 70, 229, 0.3)', transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
          Launch Recruitment Agent <ArrowRight size={18} />
        </button>
      </div>

      {/* Feature Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24, animation: 'slideUp 0.8s ease-out' }}>
        <div className="feature-card-premium" style={{ padding: 40, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 24, transition: 'all 0.3s' }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(79, 70, 229, 0.1)', color: 'var(--color-recruit)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
            <Search size={24} />
          </div>
          <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>Multi-Source Scraping</h3>
          <p style={{ color: 'var(--text-2)', lineHeight: 1.6, fontSize: 15 }}>Extracts comprehensive data from LinkedIn, GitHub, and Naukri simultaneously using dual-pass intelligence.</p>
        </div>
        
        <div className="feature-card-premium" style={{ padding: 40, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 24, transition: 'all 0.3s' }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(236, 72, 153, 0.1)', color: '#ec4899', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
            <BrainCircuit size={24} />
          </div>
          <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>Technical Interviewing</h3>
          <p style={{ color: 'var(--text-2)', lineHeight: 1.6, fontSize: 15 }}>Conducts 3–5 tailored technical Q&A questions automatically based on the job spec non-negotiables.</p>
        </div>

        <div className="feature-card-premium" style={{ padding: 40, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 24, transition: 'all 0.3s' }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
            <ShieldCheck size={24} />
          </div>
          <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>Cheat Detection</h3>
          <p style={{ color: 'var(--text-2)', lineHeight: 1.6, fontSize: 15 }}>Real-time anomaly detection flags robotic or copy-paste answers, penalizing candidate scores dynamically.</p>
        </div>

        <div className="feature-card-premium" style={{ padding: 40, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 24, transition: 'all 0.3s' }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
            <Zap size={24} />
          </div>
          <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>100-Point Scoring</h3>
          <p style={{ color: 'var(--text-2)', lineHeight: 1.6, fontSize: 15 }}>Transparent grading across Profile (40), Skills (30), Interview (20), and Location/Logistics (10).</p>
        </div>
      </div>

      {/* How to Use Section */}
      <div style={{ marginTop: 100, borderTop: '1px solid var(--border)', paddingTop: 80, paddingBottom: 60, animation: 'slideUp 1s ease-out' }}>
        <h2 style={{ fontSize: 32, fontWeight: 800, textAlign: 'center', marginBottom: 48 }}>How to use the Recruitment Agent</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 32, maxWidth: 900, margin: '0 auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--bg-btn)', color: 'var(--text-1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, marginBottom: 16 }}>1</div>
            <h4 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>Paste a Profile URL</h4>
            <p style={{ color: 'var(--text-2)', lineHeight: 1.5, fontSize: 14 }}>Simply drop a link to a candidate's LinkedIn, GitHub, or Naukri profile into the chat. The agent will instantly ingest it.</p>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--bg-btn)', color: 'var(--text-1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, marginBottom: 16 }}>2</div>
            <h4 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>AI Processing & Interview</h4>
            <p style={{ color: 'var(--text-2)', lineHeight: 1.5, fontSize: 14 }}>The agent bypasses blockers, extracts the structured data, and optionally generates tailored technical screening questions.</p>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--bg-btn)', color: 'var(--color-recruit)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, marginBottom: 16, border: '1px solid var(--color-recruit)' }}>3</div>
            <h4 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>Review & Decide</h4>
            <p style={{ color: 'var(--text-2)', lineHeight: 1.5, fontSize: 14 }}>Receive a standardized candidate card with a 100-point score, cheat-detection metrics, and a summary ready for your ATS.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
