'use client';
import React from 'react';
import { Mail, Edit3, Target, Share2, ArrowRight } from 'lucide-react';

interface Props {
  onLaunch: () => void;
}

export default function SalesAgent({ onLaunch }: Props) {
  return (
    <div className="fade-in" style={{ padding: '80px 40px', maxWidth: 1100, margin: '0 auto', width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Hero Section */}
      <div style={{ textAlign: 'center', marginBottom: 80, animation: 'slideUp 0.6s ease-out' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: 999, fontSize: 13, fontWeight: 600, color: '#f59e0b', marginBottom: 32 }}>
          <Mail size={16} /> Autonomous AI Agent
        </div>
        
        <h1 style={{ fontSize: 56, fontWeight: 800, letterSpacing: '-0.04em', marginBottom: 24, lineHeight: 1.1 }}>
          AI Outreach <br/>
          <span style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>That Actually Converts.</span>
        </h1>
        
        <p style={{ fontSize: 19, color: 'var(--text-2)', lineHeight: 1.6, maxWidth: 650, margin: '0 auto 40px' }}>
          DailforAI generates hyper-personalized cold emails, follow-ups, and LinkedIn messages. It automatically adapts tone, structure, and Call-To-Action based on your target prospect.
        </p>

        <button className="btn btn-primary" onClick={onLaunch} style={{ padding: '14px 32px', fontSize: 16, borderRadius: 12, display: 'inline-flex', alignItems: 'center', gap: 10, boxShadow: '0 8px 30px rgba(245, 158, 11, 0.3)', transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
          Launch Sales Agent <ArrowRight size={18} />
        </button>
      </div>

      {/* Feature Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, animation: 'slideUp 0.8s ease-out' }}>
        <div className="feature-card-premium" style={{ padding: 40, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 24, transition: 'all 0.3s' }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
            <Edit3 size={24} />
          </div>
          <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>Cold Outreach</h3>
          <p style={{ color: 'var(--text-2)', lineHeight: 1.6, fontSize: 15 }}>Generates highly personalized B2B cold emails tailored to keep word count under 200, maximizing reply probability with high-impact subject lines.</p>
        </div>
        
        <div className="feature-card-premium" style={{ padding: 40, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 24, transition: 'all 0.3s' }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
            <Share2 size={24} />
          </div>
          <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>Follow-up Sequences</h3>
          <p style={{ color: 'var(--text-2)', lineHeight: 1.6, fontSize: 15 }}>Intelligently re-engages silent prospects with context-aware follow-up messages that build upon previous communications without being pushy.</p>
        </div>

        <div className="feature-card-premium" style={{ padding: 40, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 24, transition: 'all 0.3s' }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
            <Target size={24} />
          </div>
          <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>LinkedIn Engagement</h3>
          <p style={{ color: 'var(--text-2)', lineHeight: 1.6, fontSize: 15 }}>Drafts authentic connection requests and initial InMail pitches designed to break the ice and establish rapport on professional networks.</p>
        </div>
      </div>

      {/* How to Use Section */}
      <div style={{ marginTop: 100, borderTop: '1px solid var(--border)', paddingTop: 80, paddingBottom: 60, animation: 'slideUp 1s ease-out' }}>
        <h2 style={{ fontSize: 32, fontWeight: 800, textAlign: 'center', marginBottom: 48 }}>How to use the Sales Agent</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 32, maxWidth: 900, margin: '0 auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--bg-btn)', color: 'var(--text-1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, marginBottom: 16 }}>1</div>
            <h4 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>Define Your Target</h4>
            <p style={{ color: 'var(--text-2)', lineHeight: 1.5, fontSize: 14 }}>Tell the agent who you are selling to. Provide a URL, a LinkedIn profile, or a simple text description of the prospect's company and role.</p>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--bg-btn)', color: 'var(--text-1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, marginBottom: 16 }}>2</div>
            <h4 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>Set the Objective</h4>
            <p style={{ color: 'var(--text-2)', lineHeight: 1.5, fontSize: 14 }}>Instruct the agent on your goal (e.g., "Write a cold email asking for a 15-minute demo next Tuesday" or "Draft a polite LinkedIn follow-up").</p>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--bg-btn)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, marginBottom: 16, border: '1px solid #f59e0b' }}>3</div>
            <h4 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>Copy & Send</h4>
            <p style={{ color: 'var(--text-2)', lineHeight: 1.5, fontSize: 14 }}>The agent generates a hyper-personalized, high-converting message. Review it, copy it to your clipboard, and drop it into your CRM.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
