'use client';
import React from 'react';
import { Search, Globe, Filter, Users, ArrowRight } from 'lucide-react';

interface Props {
  onLaunch: () => void;
}

export default function ProspectFinder({ onLaunch }: Props) {
  return (
    <div className="fade-in" style={{ padding: 'clamp(32px, 6vw, 80px) clamp(16px, 4vw, 40px)', maxWidth: 1100, margin: '0 auto', width: '100%', height: '100%', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
      
      {/* Hero Section */}
      <div style={{ textAlign: 'center', marginBottom: 'clamp(40px, 8vw, 80px)', animation: 'slideUp 0.6s ease-out' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: 'rgba(52, 211, 153, 0.1)', border: '1px solid rgba(52, 211, 153, 0.2)', borderRadius: 999, fontSize: 13, fontWeight: 600, color: '#10b981', marginBottom: 24 }}>
          <Search size={16} /> Autonomous AI Agent
        </div>
        
        <h1 style={{ fontSize: 'clamp(28px, 6vw, 56px)', fontWeight: 800, letterSpacing: '-0.04em', marginBottom: 20, lineHeight: 1.1 }}>
          Discover Target Prospects <br/>
          <span style={{ background: 'linear-gradient(135deg, #10b981, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>In Real-Time.</span>
        </h1>
        
        <p style={{ fontSize: 'clamp(15px, 2vw, 19px)', color: 'var(--text-2)', lineHeight: 1.6, maxWidth: 650, margin: '0 auto 32px' }}>
          DialforAI acts as your autonomous research assistant. Provide natural language descriptions of your ideal customer profile, and it executes live web queries to find the exact decision makers.
        </p>

        <button className="btn btn-primary" onClick={onLaunch} style={{ padding: '14px 32px', fontSize: 16, borderRadius: 12, display: 'inline-flex', alignItems: 'center', gap: 10, boxShadow: '0 8px 30px rgba(16, 185, 129, 0.3)', transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
          Launch Prospect Finder <ArrowRight size={18} />
        </button>
      </div>

      {/* Feature Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, animation: 'slideUp 0.8s ease-out' }}>
        <div className="feature-card-premium" style={{ padding: 'clamp(20px, 4vw, 40px)', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 24, transition: 'all 0.3s' }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(52, 211, 153, 0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
            <Globe size={24} />
          </div>
          <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>Live Web Search</h3>
          <p style={{ color: 'var(--text-2)', lineHeight: 1.6, fontSize: 15 }}>Performs real-time research across the internet, synthesizing data from professional networks and company pages to find fresh contact details.</p>
        </div>
        
        <div className="feature-card-premium" style={{ padding: 'clamp(20px, 4vw, 40px)', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 24, transition: 'all 0.3s' }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
            <Filter size={24} />
          </div>
          <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>Semantic Filtering</h3>
          <p style={{ color: 'var(--text-2)', lineHeight: 1.6, fontSize: 15 }}>Understand complex natural language instructions. Filter targets by precise criteria like industry, company size, revenue, region, or tech stack.</p>
        </div>

        <div className="feature-card-premium" style={{ padding: 'clamp(20px, 4vw, 40px)', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 24, transition: 'all 0.3s' }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
            <Users size={24} />
          </div>
          <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>Role Matching</h3>
          <p style={{ color: 'var(--text-2)', lineHeight: 1.6, fontSize: 15 }}>Identify key decision-makers (CEOs, VPs, Directors) with high accuracy by analyzing organizational structure context.</p>
        </div>
      </div>

      {/* How to Use Section */}
      <div style={{ marginTop: 'clamp(50px, 10vw, 100px)', borderTop: '1px solid var(--border)', paddingTop: 'clamp(40px, 8vw, 80px)', paddingBottom: 'clamp(30px, 6vw, 60px)', animation: 'slideUp 1s ease-out' }}>
        <h2 style={{ fontSize: 'clamp(22px, 4vw, 32px)', fontWeight: 800, textAlign: 'center', marginBottom: 'clamp(24px, 5vw, 48px)' }}>How to use the Prospect Finder</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'clamp(20px, 4vw, 32px)', maxWidth: 900, margin: '0 auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--bg-btn)', color: 'var(--text-1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, marginBottom: 16 }}>1</div>
            <h4 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>Define your ICP</h4>
            <p style={{ color: 'var(--text-2)', lineHeight: 1.5, fontSize: 14 }}>Type in a plain-English description of your Ideal Customer Profile (e.g., "SaaS CTOs in New York with 50-200 employees").</p>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--bg-btn)', color: 'var(--text-1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, marginBottom: 16 }}>2</div>
            <h4 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>Agent Execution</h4>
            <p style={{ color: 'var(--text-2)', lineHeight: 1.5, fontSize: 14 }}>The agent will query live search engines and professional databases to find companies and individuals matching your exact criteria.</p>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--bg-btn)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, marginBottom: 16, border: '1px solid #10b981' }}>3</div>
            <h4 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>Export Data</h4>
            <p style={{ color: 'var(--text-2)', lineHeight: 1.5, fontSize: 14 }}>Review the verified list of prospects and smoothly export the contacts into your workspace for immediate outreach.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
