'use client';
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import {
  TrendingUp, Building2, Target, Users, Mail, Search, AlertTriangle,
  CheckCircle2, ArrowRight, Zap, BarChart3, Lightbulb, ShieldCheck,
  Clock, Star, MapPin, Globe, Briefcase, ChevronDown, ChevronUp,
  RefreshCw, Copy, Check, Rocket, Eye, Award, TrendingDown, Lock, Download
} from 'lucide-react';

/* ─── Types ───────────────────────────────────────────────────── */
interface GrowthForm {
  companyName: string;
  website: string;
  linkedin: string;
  industry: string;
  location: string;
  size: string;
  services: string;
  businessNeeds: string;
}

interface Lead {
  company: string; industry: string; subIndustry?: string; location: string; size: string;
  estimatedRevenue?: string; score: number; scoreReason?: string;
  whyMatch: string; hiringSignal: string; urgencyLevel?: string;
  contactType: string; contactDepartment?: string; linkedinSearch: string;
  outreachAngle: string; estimatedDealValue?: string;
}

interface AnalysisData {
  companyProfile: { overview: string; coreServices: string[]; targetMarkets: string[]; valueProposition: string; currentGrowthStage?: string; revenueModel?: string };
  icp: { idealClients: any[]; buyerPersonas: any[]; painPoints: string[]; idealDealSize?: string; salesCycleLength?: string };
  marketOpportunity: { summary: string; estimatedMarketSize: string; addressableSegment?: string; keyTrend1?: string; keyTrend2?: string; keyTrend3?: string; growthRecommendations: string[] };
  leads: Lead[];
  competitors: any[];
  outreachIntelligence: { bestContacts: any[]; coldEmailTemplate: string; linkedinMessage: string; subjectLineVariants?: string[]; followUpStrategy: string[]; doNotDo?: string[] };
  growthStrategy: { immediate: string[]; shortTerm: string[]; longTerm: string[]; quickWins?: string[]; channelStrategy?: { primaryChannel: string; secondaryChannel: string; reasoning: string } };
  insights: { topInsight: string; urgentAction: string; biggestOpportunity: string; warningSign: string; competitiveAdvantage?: string; northStar?: string };
}

/* ─── Helpers ─────────────────────────────────────────────────── */
const scoreColor = (s: number) => s >= 90 ? '#10b981' : s >= 75 ? '#f59e0b' : s >= 65 ? '#f97316' : '#ef4444';
const scoreLabel = (s: number) => s >= 90 ? '🔥 Hot' : s >= 75 ? '⭐ Strong' : s >= 65 ? 'Moderate' : 'Low';
const scoreGradient = (s: number) => s >= 90 ? 'rgba(16,185,129,0.08)' : s >= 75 ? 'rgba(245,158,11,0.08)' : 'rgba(249,115,22,0.08)';
const urgencyColor = (u?: string) => u === 'High' ? '#ef4444' : u === 'Medium' ? '#f59e0b' : '#6b7280';

const TABS = [
  { id: 'dashboard',  label: 'CEO Dashboard',    icon: <BarChart3 size={14}/> },
  { id: 'leads',      label: 'Lead Discovery',   icon: <Target size={14}/> },
  { id: 'icp',        label: 'ICP & Personas',   icon: <Users size={14}/> },
  { id: 'competitors',label: 'Competitors',       icon: <TrendingDown size={14}/> },
  { id: 'outreach',   label: 'Outreach Intel',   icon: <Mail size={14}/> },
  { id: 'strategy',   label: 'Growth Strategy',  icon: <Rocket size={14}/> },
];

const INDUSTRY_OPTIONS = [
  'IT Services / Staffing', 'Healthcare', 'Manufacturing', 'Finance / FinTech',
  'E-Commerce / Retail', 'Real Estate', 'Education', 'Logistics / Supply Chain',
  'SaaS / Software', 'Consulting', 'BPO / Outsourcing', 'Other'
];
const SIZE_OPTIONS = ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'];

const LOADING_STEPS = [
  '🔍  Analyzing your company profile…',
  '🎯  Building Ideal Customer Profile…',
  '📊  Scanning market opportunities…',
  '🏢  Finding high-value target leads…',
  '⚡  Detecting hiring & growth signals…',
  '🕵️  Running competitor analysis…',
  '✉️  Crafting outreach intelligence…',
  '📈  Formulating growth strategy…',
  '✅  Finalizing report…',
];

/* ─── CopyButton ──────────────────────────────────────────────── */
function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      style={{ background: 'transparent', border: '1px solid var(--border)', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', color: copied ? '#10b981' : 'var(--text-3)', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4, transition: 'all 0.2s' }}
    >
      {copied ? <><Check size={11}/> Copied</> : <><Copy size={11}/> Copy</>}
    </button>
  );
}

/* ─── Section Card ────────────────────────────────────────────── */
function SectionCard({ title, icon, children, accent }: { title: string; icon: React.ReactNode; children: React.ReactNode; accent?: string }) {
  return (
    <div style={{ background: 'var(--bg-card)', border: `1px solid ${accent || 'var(--border)'}`, borderRadius: 16, overflow: 'hidden', marginBottom: 20 }}>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10, background: accent ? `${accent}08` : 'transparent' }}>
        <span style={{ color: accent || 'var(--text-2)' }}>{icon}</span>
        <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-1)' }}>{title}</span>
      </div>
      <div style={{ padding: 20 }}>{children}</div>
    </div>
  );
}

/* ─── Pill badge ──────────────────────────────────────────────── */
function Pill({ text, color }: { text: string; color?: string }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 600, background: color ? `${color}15` : 'var(--bg-btn)', color: color || 'var(--text-2)', border: `1px solid ${color ? `${color}30` : 'var(--border)'}`, whiteSpace: 'nowrap' }}>
      {text}
    </span>
  );
}

interface GrowthAgentProps {
  user?: any;
  onLaunch?: () => void;
}

/* ─── Main Component ──────────────────────────────────────────── */
export default function GrowthAgent({ user, onLaunch }: GrowthAgentProps) {
  const [step, setStep] = useState<'landing' | 'input' | 'loading' | 'results'>('landing');
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [expandedLead, setExpandedLead] = useState<number | null>(null);
  const [result, setResult] = useState<AnalysisData | null>(null);
  const [hasSavedProfile, setHasSavedProfile] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [savedLeadCount, setSavedLeadCount] = useState<number>(0);

  useEffect(() => {
    async function fetchProfile() {
      if (!user?.id) return;
      const { data, error } = await supabase
        .from('company_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (data) {
        setForm(f => ({
          ...f,
          companyName: data.company_name || f.companyName,
          website: data.website || f.website,
          linkedin: data.linkedin || f.linkedin,
          industry: data.industry || f.industry,
          location: data.location || f.location,
          size: data.size || f.size,
          services: data.services || f.services,
          businessNeeds: data.business_needs || f.businessNeeds,
        }));
        setHasSavedProfile(true);
        setSavedAt(data.updated_at || data.created_at || null);
        if (data.latest_analysis) {
          setResult(data.latest_analysis);
          setSavedLeadCount(data.latest_analysis?.leads?.length || 0);
        }
      }
    }
    fetchProfile();
  }, [user?.id]);

  const defaultEmail = user?.email || '';
  const emailDomain = defaultEmail.split('@')[1]?.split('.')[0] || '';

  const [form, setForm] = useState<GrowthForm>({
    companyName: user?.user_metadata?.company || (emailDomain ? emailDomain.charAt(0).toUpperCase() + emailDomain.slice(1) : ''),
    website: emailDomain ? `www.${defaultEmail.split('@')[1]}` : '',
    linkedin: '',
    industry: '',
    location: '',
    size: '',
    services: '',
    businessNeeds: '',
  });

  const set = (k: keyof GrowthForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  /* ══════════════════════════════════════════════════════════════
     LANDING STEP
     ══════════════════════════════════════════════════════════════ */
  if (step === 'landing') {

    return (
    <div className="fade-in" style={{ padding: 'clamp(32px, 6vw, 80px) clamp(16px, 4vw, 40px)', maxWidth: 1100, margin: '0 auto', width: '100%', height: '100%', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
      
      {/* Hero Section */}
      <div style={{ textAlign: 'center', marginBottom: 60, animation: 'slideUp 0.6s ease-out' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 28, flexWrap: 'wrap' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: 999, fontSize: 13, fontWeight: 600, color: '#10b981' }}>
            <TrendingUp size={16} /> Company AI Agent
          </div>
          <button onClick={() => {}} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 18px', background: 'linear-gradient(135deg, #f59e0b, #ef4444)', border: 'none', borderRadius: 999, fontSize: 12, fontWeight: 700, color: '#fff', cursor: 'pointer', fontFamily: 'inherit' }}>
            ⚡ Go with Pro
          </button>
        </div>

        <h1 style={{ fontSize: 'clamp(28px, 6vw, 56px)', fontWeight: 800, letterSpacing: '-0.04em', marginBottom: 20, lineHeight: 1.1 }}>
          How can I help grow your<br />
          <span style={{ background: 'linear-gradient(135deg, #10b981, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>business today?</span>
        </h1>

        <p style={{ fontSize: 'clamp(14px, 3vw, 18px)', color: 'var(--text-2)', lineHeight: 1.6, maxWidth: 620, margin: '0 auto 36px' }}>
          Your AI-powered Business Development Consultant, Growth Strategist &amp; Lead Intelligence Engine — built exclusively for companies.
        </p>

        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            className="btn btn-primary"
            onClick={() => setStep('input')}
            style={{ padding: '14px 32px', fontSize: 15, borderRadius: 12, display: 'inline-flex', alignItems: 'center', gap: 10, boxShadow: '0 8px 30px rgba(16,185,129,0.3)', transition: 'all 0.3s' }}
            onMouseOver={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
            onMouseOut={e => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            Launch Growth Intelligence <ArrowRight size={18} />
          </button>
          {hasSavedProfile && result ? (
            <button
              className="btn btn-outline"
              onClick={() => setStep('results')}
              style={{ padding: '14px 32px', fontSize: 15, borderRadius: 12, display: 'inline-flex', alignItems: 'center', gap: 10, transition: 'all 0.3s' }}
              onMouseOver={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseOut={e => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              View Latest Insights <Eye size={18} />
            </button>
          ) : (
            <button
              className="btn btn-outline"
              onClick={() => setStep('input')}
              style={{ padding: '14px 32px', fontSize: 15, borderRadius: 12, display: 'inline-flex', alignItems: 'center', gap: 10, transition: 'all 0.3s' }}
              onMouseOver={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseOut={e => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              Generate Full Report <Zap size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Welcome Back Banner */}
      {hasSavedProfile && result && (
        <div style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.08), rgba(59,130,246,0.08))', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 20, padding: '24px 28px', marginBottom: 32, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Building2 size={22} color="#10b981" />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-1)', marginBottom: 4 }}>
                👋 Welcome back, {form.companyName || 'your company'}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                {savedAt && <span>Last analysis: {new Date(savedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>}
                {savedLeadCount > 0 && <span style={{ color: '#10b981', fontWeight: 600 }}>• {savedLeadCount} leads found</span>}
                {form.industry && <span>• {form.industry}</span>}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button onClick={() => { setActiveTab('dashboard'); setStep('results'); }} style={{ padding: '10px 20px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'inherit' }}>
              <Eye size={14} /> View Latest Insights
            </button>
            <button onClick={() => setStep('input')} style={{ padding: '10px 20px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg-btn)', color: 'var(--text-2)', fontWeight: 600, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'inherit' }}>
              <RefreshCw size={14} /> Run Fresh Analysis
            </button>
          </div>
        </div>
      )}

      {/* 8-Card AI Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 60 }}>
        {[
          { icon: <Users size={20}/>, title: 'Find Leads', desc: 'Discover companies hiring, growing, or needing services — ranked by match score.', color: '#10b981', bg: 'rgba(16,185,129,0.08)' },
          { icon: <Building2 size={20}/>, title: 'Competitor Analysis', desc: 'Battle cards mapping competitor strengths, weaknesses, and differentiation win tactics.', color: '#3b82f6', bg: 'rgba(59,130,246,0.08)' },
          { icon: <Target size={20}/>, title: 'ICP & Persona Mapping', desc: 'Define ideal customer profiles and buyer personas based on pain points and triggers.', color: '#8b5cf6', bg: 'rgba(139,92,246,0.08)' },
          { icon: <Mail size={20}/>, title: 'Outreach Strategy', desc: 'Cold email templates, LinkedIn messages, follow-up sequences, and sales scripts.', color: '#ec4899', bg: 'rgba(236,72,153,0.08)' },
          { icon: <Star size={20}/>, title: 'Growth Opportunities', desc: 'Discover new revenue streams, strategic partnerships, and market expansion paths.', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)' },
          { icon: <Globe size={20}/>, title: 'Market Expansion', desc: 'Identify new regions, industries, and untapped markets for business scaling.', color: '#06b6d4', bg: 'rgba(6,182,212,0.08)' },
          { icon: <Briefcase size={20}/>, title: 'BDM Strategy', desc: 'Business development planning, partnership blueprints, and pipeline improvement.', color: '#f97316', bg: 'rgba(249,115,22,0.08)' },
          { icon: <BarChart3 size={20}/>, title: 'Sales Intelligence', desc: 'Improve sales process, track opportunities, and optimize conversion rates.', color: '#a855f7', bg: 'rgba(168,85,247,0.08)' },
        ].map((card, i) => (
          <button
            key={i}
            onClick={() => setStep('input')}
            style={{ textAlign: 'left', padding: 22, borderRadius: 16, border: `1px solid ${card.color}20`, background: card.bg, cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'inherit' }}
            onMouseOver={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 8px 24px ${card.color}15`; }}
            onMouseOut={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none'; }}
          >
            <div style={{ width: 40, height: 40, borderRadius: 10, background: `${card.color}15`, color: card.color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
              {card.icon}
            </div>
            <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-1)', marginBottom: 6 }}>{card.title}</div>
            <div style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.6 }}>{card.desc}</div>
          </button>
        ))}
      </div>

      {/* How it works */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: 56, paddingBottom: 40 }}>
        <h2 style={{ fontSize: 'clamp(20px,4vw,28px)', fontWeight: 800, textAlign: 'center', marginBottom: 40 }}>How Growth Intelligence works</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 28, maxWidth: 900, margin: '0 auto' }}>
          {[
            { n: '1', label: 'Provide Company Info', desc: 'Share your company details, industry, and target market or business goals.' },
            { n: '2', label: 'AI Researches & Strategizes', desc: 'The agent scans market dynamics, maps competitors, and uncovers high-value prospects.' },
            { n: '3', label: 'Deploy Growth Tactics', desc: 'Use the leads list, outreach hooks, and action timeline to drive revenue.', green: true },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: item.green ? 'rgba(16,185,129,0.1)' : 'var(--bg-btn)', color: item.green ? '#10b981' : 'var(--text-1)', border: item.green ? '1px solid #10b981' : '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, marginBottom: 14 }}>{item.n}</div>
              <h4 style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{item.label}</h4>
              <p style={{ color: 'var(--text-2)', lineHeight: 1.5, fontSize: 13 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
    );
  }

  /* ── Download Report ──────────────────────────────────────── */
  const downloadReport = () => {
    if (!result) return;
    const content = `# Growth Intelligence Report: ${form.companyName || 'Your Company'}\n\n` +
      `Generated on: ${new Date().toLocaleDateString()}\n\n` +
      `## 1. Top Insights\n` +
      `- **Top Insight:** ${result.insights?.topInsight || 'N/A'}\n` +
      `- **Urgent Action:** ${result.insights?.urgentAction || 'N/A'}\n` +
      `- **Biggest Opportunity:** ${result.insights?.biggestOpportunity || 'N/A'}\n` +
      `- **Watch Out For:** ${result.insights?.warningSign || 'N/A'}\n\n` +
      `## 2. Company & Market\n` +
      `**Overview:** ${result.companyProfile?.overview || 'N/A'}\n\n` +
      `**Market Opportunity:** ${result.marketOpportunity?.summary || 'N/A'}\n\n` +
      `**Estimated Market Size:** ${result.marketOpportunity?.estimatedMarketSize || 'N/A'}\n\n` +
      `## 3. High-Value Leads\n\n` +
      (result.leads || []).map((l: any, i: number) => `### ${i+1}. ${l.company} (Score: ${l.score})\n- **Industry:** ${l.industry}\n- **Why Match:** ${l.whyMatch}\n- **Hiring Signal:** ${l.hiringSignal}\n- **Angle:** ${l.outreachAngle}\n`).join('\n') +
      `\n## 4. Outreach Strategy\n\n` +
      `**Cold Email Template:**\n\n${result.outreachIntelligence?.coldEmailTemplate || 'N/A'}\n\n` +
      `**LinkedIn Message:**\n\n${result.outreachIntelligence?.linkedinMessage || 'N/A'}\n\n`;

    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Growth_Report_${form.companyName?.replace(/\s+/g, '_') || 'Company'}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  /* ── Run analysis ─────────────────────────────────────────── */
  const analyze = async () => {
    if (!form.companyName.trim() && !form.businessNeeds.trim()) {
      setError('Please enter at least your company name and business needs.'); return;
    }
    setError('');
    setStep('loading');
    setLoadingStep(0);

    // Cycle loading messages
    const interval = setInterval(() => {
      setLoadingStep(s => (s + 1) % LOADING_STEPS.length);
    }, 1400);

    // Eagerly save form details so they aren't lost if the request fails
    if (user?.id) {
      await supabase.from('company_profiles').upsert({
        user_id: user.id,
        company_name: form.companyName,
        website: form.website,
        linkedin: form.linkedin,
        industry: form.industry,
        location: form.location,
        size: form.size,
        services: form.services,
        business_needs: form.businessNeeds,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' });
    }

    try {
      const res = await fetch('/api/ai-agents/growth/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, userId: user?.id })
      });
      const json = await res.json();
      clearInterval(interval);

      if (!res.ok || !json.success) throw new Error(json.error || 'Analysis failed');
      setResult(json.data);
      
      // Save to database
      if (user?.id) {
        await supabase.from('company_profiles').upsert({
          user_id: user.id,
          company_name: form.companyName,
          website: form.website,
          linkedin: form.linkedin,
          industry: form.industry,
          location: form.location,
          size: form.size,
          services: form.services,
          business_needs: form.businessNeeds,
          latest_analysis: json.data,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' });
        setHasSavedProfile(true);
        setSavedLeadCount(json.data?.leads?.length || 0);
        setSavedAt(new Date().toISOString());
      }

      setStep('results');
      setActiveTab('dashboard');

    } catch (e: any) {
      clearInterval(interval);
      setError(e.message || 'Something went wrong. Please try again.');
      setStep('input');
    }
  };

  /* ══════════════════════════════════════════════════════════════
     INPUT STEP
  ══════════════════════════════════════════════════════════════ */
  if (step === 'input') return (
    <div style={{ flex: 1, overflowY: 'auto', padding: 'clamp(16px, 3vw, 40px)' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: 32, textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', background: 'rgba(16,185,129,0.1)', color: '#10b981', borderRadius: 999, fontSize: 12, fontWeight: 700, marginBottom: 16, border: '1px solid rgba(16,185,129,0.2)' }}>
            <TrendingUp size={14}/> Growth Intelligence Agent
          </div>
          <h1 style={{ fontSize: 'clamp(22px, 4vw, 32px)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 10, color: 'var(--text-1)' }}>
            Your AI Senior BDM Consultant
          </h1>
          <p style={{ color: 'var(--text-2)', fontSize: 14, lineHeight: 1.6, maxWidth: 560, margin: '0 auto' }}>
            Enter your company profile and business goals. The agent will analyze your market, find the best leads, map competitors, and build your outreach strategy.
          </p>
        </div>

        {error && (
          <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', borderRadius: 10, padding: '12px 16px', fontSize: 13, marginBottom: 20 }}>
            {error}
          </div>
        )}

        {/* Company Profile Section */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: 'clamp(16px, 3vw, 28px)', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
            <Building2 size={16} color="#4f46e5"/>
            <span style={{ fontWeight: 700, fontSize: 14 }}>Company Profile</span>
            {user && <span style={{ marginLeft: 'auto', fontSize: 11, color: '#10b981', fontWeight: 600 }}>✓ Auto-detected from account</span>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
            {[
              { label: 'Company Name *', key: 'companyName', placeholder: 'e.g. Your Company', type: 'input' },
              { label: 'Website', key: 'website', placeholder: 'e.g. www.yourcompany.com', type: 'input' },
              { label: 'LinkedIn Company URL', key: 'linkedin', placeholder: 'linkedin.com/company/yourcompany', type: 'input' },
              { label: 'Location', key: 'location', placeholder: 'e.g. India / USA / Remote', type: 'input' },
            ].map(f => (
              <div key={f.key} className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">{f.label}</label>
                <input className="form-input" placeholder={f.placeholder} value={form[f.key as keyof GrowthForm]} onChange={set(f.key as keyof GrowthForm)} />
              </div>
            ))}

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Industry</label>
              <select className="form-input" value={form.industry} onChange={set('industry')} style={{ cursor: 'pointer' }}>
                <option value="">Select industry…</option>
                {INDUSTRY_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Company Size</label>
              <select className="form-input" value={form.size} onChange={set('size')} style={{ cursor: 'pointer' }}>
                <option value="">Select size…</option>
                {SIZE_OPTIONS.map(o => <option key={o} value={o}>{o} employees</option>)}
              </select>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0, marginTop: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <label className="form-label" style={{ marginBottom: 0 }}>Services / What Your Company Does</label>
              <span style={{ fontSize: 11, color: form.services.length >= 1000 ? '#ef4444' : 'var(--text-3)', fontWeight: 500 }}>
                {form.services.length} / 1000 max
              </span>
            </div>
            <textarea
              className="form-input"
              rows={3}
              maxLength={1000}
              placeholder="e.g. We provide IT staffing, permanent recruitment, and contract workforce solutions for mid-large enterprises across the US and India."
              value={form.services}
              onChange={set('services')}
              style={{ resize: 'vertical', lineHeight: 1.6 }}
            />
          </div>
        </div>

        {/* Business Needs Section */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 16, padding: 'clamp(16px, 3vw, 28px)', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, paddingBottom: 14, borderBottom: '1px solid var(--border)', flexWrap: 'wrap' }}>
            <Target size={16} color="#10b981"/>
            <span style={{ fontWeight: 700, fontSize: 14 }}>Business Needs & Goals *</span>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 11, color: 'var(--text-3)' }} className="hide-on-mobile">The more detail, the better leads you get</span>
              <span style={{ fontSize: 11, color: form.businessNeeds.length >= 2000 ? '#ef4444' : 'var(--text-3)', fontWeight: 600, background: 'var(--bg-btn)', padding: '4px 8px', borderRadius: 6 }}>
                {form.businessNeeds.length} / 2000 limit
              </span>
            </div>
          </div>
          <textarea
            className="form-input"
            rows={5}
            maxLength={2000}
            placeholder={`Tell the agent exactly what you need. Examples:\n\n• We need recruitment clients in the pharma/healthcare space in USA\n• Looking for manufacturing companies hiring SAP consultants\n• Need IT staffing clients — companies hiring 50+ contractors\n• Want to find investors / VCs interested in HR-tech\n• Need software development clients in fintech sector`}
            value={form.businessNeeds}
            onChange={set('businessNeeds')}
            style={{ resize: 'vertical', lineHeight: 1.7, fontSize: 13 }}
          />
          <p style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 8 }}>
            💡 Tip: Be specific about industry, geography, company size, and the type of engagement you're looking for.
          </p>
        </div>

        <button
          onClick={analyze}
          disabled={!form.companyName && !form.businessNeeds}
          style={{ width: '100%', padding: '15px 24px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, opacity: (!form.companyName && !form.businessNeeds) ? 0.5 : 1, transition: 'opacity 0.2s', fontFamily: 'inherit' }}
        >
          <TrendingUp size={18}/> Run Growth Intelligence Analysis
        </button>
      </div>
    </div>
  );

  /* ══════════════════════════════════════════════════════════════
     LOADING STEP
  ══════════════════════════════════════════════════════════════ */
  if (step === 'loading') return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40, gap: 32 }}>
      {/* Animated orb */}
      <div style={{ position: 'relative', width: 100, height: 100 }}>
        <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'linear-gradient(135deg, rgba(16,185,129,0.3), rgba(79,70,229,0.3))', animation: 'spin 2s linear infinite' }} />
        <div style={{ position: 'absolute', inset: 8, borderRadius: '50%', background: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <TrendingUp size={32} color="#10b981"/>
        </div>
      </div>

      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 8, color: 'var(--text-1)' }}>Running Growth Analysis…</div>
        <div style={{ fontSize: 14, color: '#10b981', fontWeight: 600, minHeight: 22, transition: 'all 0.3s' }}>{LOADING_STEPS[loadingStep]}</div>
        <div style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 8 }}>This may take 20-30 seconds. Your Senior BDM Agent is working hard.</div>
      </div>

      {/* Progress steps */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%', maxWidth: 360 }}>
        {LOADING_STEPS.slice(0, 6).map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, opacity: i <= loadingStep ? 1 : 0.3, transition: 'opacity 0.4s' }}>
            <div style={{ width: 18, height: 18, borderRadius: '50%', background: i < loadingStep ? '#10b981' : i === loadingStep ? 'rgba(16,185,129,0.3)' : 'var(--bg-btn)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {i < loadingStep && <Check size={10} color="#fff"/>}
            </div>
            <span style={{ fontSize: 12, color: i <= loadingStep ? 'var(--text-1)' : 'var(--text-3)' }}>{s.replace(/^[^ ]+ /, '')}</span>
          </div>
        ))}
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  /* ══════════════════════════════════════════════════════════════
     RESULTS STEP
  ══════════════════════════════════════════════════════════════ */
  if (!result) return null;
  const { companyProfile, icp, marketOpportunity, leads, competitors, outreachIntelligence, growthStrategy, insights } = result;

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: 'clamp(12px, 2vw, 24px)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* ── Top Bar ──────────────────────────────────────────── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <TrendingUp size={18} color="#10b981"/>
              <span style={{ fontWeight: 800, fontSize: 18, color: 'var(--text-1)' }}>Growth Intelligence Report</span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{form.companyName || 'Your Company'} · {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={downloadReport} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-btn)', color: 'var(--text-1)', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'inherit' }}>
              <Download size={13}/> Download Report
            </button>
            <button onClick={() => { setStep('input'); }} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-btn)', color: 'var(--text-2)', cursor: 'pointer', fontSize: 13, fontWeight: 500, fontFamily: 'inherit' }}>
              <RefreshCw size={13}/> Change Details & Rerun
            </button>
          </div>
        </div>

        {/* ── Insight Cards ─────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12, marginBottom: 20 }}>
          {[
            { icon: <Lightbulb size={16}/>, label: 'Top Insight', value: insights?.topInsight, color: '#4f46e5' },
            { icon: <Zap size={16}/>, label: 'Urgent Action', value: insights?.urgentAction, color: '#f59e0b' },
            { icon: <Star size={16}/>, label: 'Biggest Opportunity', value: insights?.biggestOpportunity, color: '#10b981' },
            { icon: <AlertTriangle size={16}/>, label: 'Watch Out For', value: insights?.warningSign, color: '#ef4444' },
          ].map((c, i) => (
            <div key={i} style={{ background: 'var(--bg-card)', border: `1px solid ${c.color}25`, borderRadius: 12, padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, color: c.color }}>
                {c.icon}
                <span style={{ fontSize: 11, fontWeight: 700, color: c.color }}>{c.label.toUpperCase()}</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.5 }}>{c.value || '—'}</div>
            </div>
          ))}
        </div>

        {/* ── Company Overview + Market Size ───────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16, marginBottom: 20 }}>
          <SectionCard title="Company Overview" icon={<Building2 size={15}/>} accent="#4f46e5">
            <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.7, marginBottom: 14 }}>{companyProfile?.overview}</p>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-3)', marginBottom: 8 }}>CORE SERVICES</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
              {companyProfile?.coreServices?.map((s: string, i: number) => <Pill key={i} text={s} color="#4f46e5"/>)}
            </div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-3)', marginBottom: 8 }}>VALUE PROPOSITION</div>
            <div style={{ fontSize: 13, color: 'var(--text-1)', fontStyle: 'italic', background: 'var(--bg-btn)', padding: '10px 12px', borderRadius: 8 }}>"{companyProfile?.valueProposition}"</div>
          </SectionCard>

          <SectionCard title="Market Opportunity" icon={<BarChart3 size={15}/>} accent="#10b981">
            <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.7, marginBottom: 14 }}>{marketOpportunity?.summary}</p>
            {marketOpportunity?.estimatedMarketSize && (
              <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 8, padding: '10px 14px', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Award size={16} color="#10b981"/>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#10b981' }}>{marketOpportunity.estimatedMarketSize}</span>
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {marketOpportunity?.growthRecommendations?.slice(0, 4).map((r: string, i: number) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12, color: 'var(--text-2)' }}>
                  <CheckCircle2 size={13} color="#10b981" style={{ flexShrink: 0, marginTop: 1 }}/>
                  {r}
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        {/* ── Tabs ─────────────────────────────────────────────── */}
        <div style={{ background: 'var(--bg-btn)', borderRadius: 10, padding: 4, display: 'flex', gap: 2, marginBottom: 16, overflowX: 'auto', flexWrap: 'nowrap' }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '8px 12px', borderRadius: 7, border: 'none', background: activeTab === t.id ? 'var(--bg-card)' : 'transparent', color: activeTab === t.id ? 'var(--text-1)' : 'var(--text-3)', fontWeight: activeTab === t.id ? 600 : 500, fontSize: 12, cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.15s', fontFamily: 'inherit' }}>
              {t.icon} <span className="tab-label">{t.label}</span>
            </button>
          ))}
        </div>

        {/* ══ TAB: CEO DASHBOARD ═══════════════════════════════ */}
        {activeTab === 'dashboard' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* North Star + Competitive Advantage */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
              {insights?.northStar && (
                <div style={{ background: 'linear-gradient(135deg, rgba(79,70,229,0.1), rgba(16,185,129,0.08))', border: '1px solid rgba(79,70,229,0.3)', borderRadius: 16, padding: 24 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#4f46e5', marginBottom: 10, letterSpacing: '0.06em' }}>🧭 NORTH STAR METRIC</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-1)', lineHeight: 1.4 }}>{insights.northStar}</div>
                </div>
              )}
              {insights?.competitiveAdvantage && (
                <div style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(6,182,212,0.08))', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 16, padding: 24 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#10b981', marginBottom: 10, letterSpacing: '0.06em' }}>🏆 COMPETITIVE ADVANTAGE</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-1)', lineHeight: 1.5 }}>{insights.competitiveAdvantage}</div>
                </div>
              )}
            </div>

            {/* KPI tiles */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
              {[
                { label: 'Growth Stage', value: companyProfile?.currentGrowthStage, color: '#8b5cf6' },
                { label: 'Revenue Model', value: companyProfile?.revenueModel, color: '#3b82f6' },
                { label: 'Addressable Market', value: marketOpportunity?.addressableSegment, color: '#10b981' },
                { label: 'Ideal Deal Size', value: icp?.idealDealSize, color: '#f59e0b' },
                { label: 'Sales Cycle', value: icp?.salesCycleLength, color: '#ec4899' },
              ].filter(k => k.value).map((kpi, i) => (
                <div key={i} style={{ background: 'var(--bg-card)', border: `1px solid ${kpi.color}20`, borderRadius: 12, padding: '14px 16px' }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: kpi.color, marginBottom: 6, letterSpacing: '0.05em' }}>{kpi.label.toUpperCase()}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-1)', lineHeight: 1.4 }}>{kpi.value}</div>
                </div>
              ))}
            </div>

            {/* Market Trends */}
            {(marketOpportunity?.keyTrend1 || marketOpportunity?.keyTrend2 || marketOpportunity?.keyTrend3) && (
              <SectionCard title="Key Market Trends" icon={<TrendingUp size={15}/>} accent="#06b6d4">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {[marketOpportunity?.keyTrend1, marketOpportunity?.keyTrend2, marketOpportunity?.keyTrend3].filter(Boolean).map((trend, i) => (
                    <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                      <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(6,182,212,0.12)', border: '1px solid rgba(6,182,212,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#06b6d4', flexShrink: 0 }}>T{i + 1}</div>
                      <div style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6, paddingTop: 4 }}>{trend}</div>
                    </div>
                  ))}
                </div>
              </SectionCard>
            )}

            {/* Quick Wins */}
            {growthStrategy?.quickWins && growthStrategy.quickWins.length > 0 && (
              <SectionCard title="Quick Wins — Do This Week" icon={<Zap size={15}/>} accent="#10b981">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
                  {growthStrategy.quickWins.map((win: string, i: number) => (
                    <div key={i} style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 12, padding: '16px 18px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                      <CheckCircle2 size={18} color="#10b981" style={{ flexShrink: 0, marginTop: 2 }}/>
                      <span style={{ fontSize: 13, color: 'var(--text-1)', lineHeight: 1.6, fontWeight: 600 }}>{win}</span>
                    </div>
                  ))}
                </div>
              </SectionCard>
            )}

            {/* Channel Strategy */}
            {growthStrategy?.channelStrategy && (
              <SectionCard title="Channel Strategy" icon={<Globe size={15}/>} accent="#8b5cf6">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 16 }}>
                  <div style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: 10, padding: '14px 16px' }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: '#8b5cf6', marginBottom: 6 }}>PRIMARY CHANNEL</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-1)' }}>{growthStrategy.channelStrategy.primaryChannel}</div>
                  </div>
                  <div style={{ background: 'rgba(139,92,246,0.04)', border: '1px solid rgba(139,92,246,0.15)', borderRadius: 10, padding: '14px 16px' }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: '#8b5cf6', marginBottom: 6 }}>SECONDARY CHANNEL</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-1)' }}>{growthStrategy.channelStrategy.secondaryChannel}</div>
                  </div>
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6, background: 'var(--bg-btn)', padding: '12px 14px', borderRadius: 8 }}>
                  💡 {growthStrategy.channelStrategy.reasoning}
                </div>
              </SectionCard>
            )}
          </div>
        )}

        {/* ══ TAB: LEAD DISCOVERY ══════════════════════════════ */}
        {activeTab === 'leads' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ fontSize: 13, color: 'var(--text-2)' }}>
                Found <strong style={{ color: 'var(--text-1)' }}>{leads?.length || 0}</strong> qualified leads ranked by opportunity score
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <Pill text={`🔥 Hot: ${leads?.filter(l => l.score >= 90).length || 0}`} color="#10b981"/>
                <Pill text={`⭐ Strong: ${leads?.filter(l => l.score >= 75 && l.score < 90).length || 0}`} color="#f59e0b"/>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {leads?.sort((a, b) => b.score - a.score).map((lead, i) => (
                <div key={i} style={{ background: 'var(--bg-card)', border: `1px solid ${lead.score >= 90 ? 'rgba(16,185,129,0.25)' : lead.score >= 75 ? 'rgba(245,158,11,0.2)' : 'var(--border)'}`, borderRadius: 14, overflow: 'hidden', transition: 'all 0.2s' }}>
                  {/* Lead header row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', cursor: 'pointer' }} onClick={() => setExpandedLead(expandedLead === i ? null : i)}>
                    {/* Score circle */}
                    <div style={{ width: 52, height: 52, borderRadius: '50%', background: scoreGradient(lead.score), border: `2px solid ${scoreColor(lead.score)}40`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ fontSize: 14, fontWeight: 800, color: scoreColor(lead.score), lineHeight: 1 }}>{lead.score}</span>
                      <span style={{ fontSize: 9, color: scoreColor(lead.score), fontWeight: 600 }}>%</span>
                    </div>

                    {/* Company info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                        <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-1)' }}>{lead.company}</span>
                        <Pill text={scoreLabel(lead.score)} color={scoreColor(lead.score)}/>
                        <Pill text={lead.industry} />
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 12, color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={11}/>{lead.location}</span>
                        <span style={{ fontSize: 12, color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: 4 }}><Users size={11}/>{lead.size}</span>
                        <span style={{ fontSize: 12, color: '#f59e0b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}><Zap size={11}/>{lead.hiringSignal}</span>
                      </div>
                    </div>

                    {/* Contact badge */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flexShrink: 0 }}>
                      <span style={{ fontSize: 11, color: '#4f46e5', fontWeight: 600, background: 'rgba(79,70,229,0.1)', padding: '3px 8px', borderRadius: 6 }}>{lead.contactType}</span>
                      {lead.contactDepartment && <span style={{ fontSize: 10, color: 'var(--text-3)' }}>{lead.contactDepartment}</span>}
                      {lead.urgencyLevel && <span style={{ fontSize: 10, fontWeight: 700, color: urgencyColor(lead.urgencyLevel) }}>{lead.urgencyLevel} Urgency</span>}
                      {expandedLead === i ? <ChevronUp size={14} color="var(--text-3)"/> : <ChevronDown size={14} color="var(--text-3)"/>}
                    </div>
                  </div>

                  {/* Expanded detail */}
                  {expandedLead === i && (
                    <div style={{ borderTop: '1px solid var(--border)', padding: '14px 16px', background: 'var(--bg-main)' }}>
                      {lead.scoreReason && (
                        <div style={{ marginBottom: 12, padding: '10px 14px', background: 'rgba(16,185,129,0.08)', borderRadius: 8, border: '1px solid rgba(16,185,129,0.2)' }}>
                          <span style={{ fontSize: 11, fontWeight: 700, color: '#10b981' }}>SCORE REASON: </span>
                          <span style={{ fontSize: 12, color: 'var(--text-2)' }}>{lead.scoreReason}</span>
                        </div>
                      )}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 12, marginBottom: 12 }}>
                        <div>
                          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', marginBottom: 6 }}>WHY THIS IS A MATCH</div>
                          <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6 }}>{lead.whyMatch}</p>
                        </div>
                        <div>
                          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', marginBottom: 6 }}>OUTREACH ANGLE</div>
                          <p style={{ fontSize: 13, color: 'var(--text-1)', lineHeight: 1.6, fontStyle: 'italic' }}>"{lead.outreachAngle}"</p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 12 }}>
                        {lead.estimatedRevenue && <div style={{ fontSize: 12, color: 'var(--text-2)' }}>💰 Revenue: <strong style={{ color: 'var(--text-1)' }}>{lead.estimatedRevenue}</strong></div>}
                        {lead.estimatedDealValue && <div style={{ fontSize: 12, color: 'var(--text-2)' }}>🤝 Deal Value: <strong style={{ color: '#10b981' }}>{lead.estimatedDealValue}</strong></div>}
                        {lead.subIndustry && <Pill text={lead.subIndustry} color="#06b6d4"/>}
                      </div>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {lead.linkedinSearch && (
                          <a href={`https://www.google.com/search?q=${encodeURIComponent(lead.linkedinSearch)}`} target="_blank" rel="noopener noreferrer"
                            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 7, background: 'rgba(79,70,229,0.1)', color: '#4f46e5', fontSize: 12, fontWeight: 600, textDecoration: 'none', border: '1px solid rgba(79,70,229,0.2)' }}>
                            <Search size={12}/> Find Contact on LinkedIn
                          </a>
                        )}
                        <a href={`https://www.google.com/search?q=${encodeURIComponent(lead.company + ' careers hiring')}`} target="_blank" rel="noopener noreferrer"
                          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 7, background: 'rgba(245,158,11,0.1)', color: '#f59e0b', fontSize: 12, fontWeight: 600, textDecoration: 'none', border: '1px solid rgba(245,158,11,0.2)' }}>
                          <Eye size={12}/> View Hiring Activity
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ TAB: ICP & PERSONAS ══════════════════════════════ */}
        {activeTab === 'icp' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Deal size + Sales cycle KPIs */}
            {(icp?.idealDealSize || icp?.salesCycleLength) && (
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {icp?.idealDealSize && <div style={{ flex: 1, minWidth: 180, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 12, padding: '14px 18px' }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#10b981', marginBottom: 4 }}>IDEAL DEAL SIZE</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-1)' }}>{icp.idealDealSize}</div>
                </div>}
                {icp?.salesCycleLength && <div style={{ flex: 1, minWidth: 180, background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 12, padding: '14px 18px' }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#f59e0b', marginBottom: 4 }}>TYPICAL SALES CYCLE</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-1)' }}>{icp.salesCycleLength}</div>
                </div>}
              </div>
            )}

            <SectionCard title="Ideal Customer Profile (ICP)" icon={<Target size={15}/>} accent="#4f46e5">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 12 }}>
                {icp?.idealClients?.map((c: any, i: number) => (
                  <div key={i} style={{ background: 'var(--bg-btn)', borderRadius: 10, padding: 14 }}>
                    <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-1)', marginBottom: 4 }}>{c.type}</div>
                    {c.size && <div style={{ fontSize: 11, color: '#4f46e5', fontWeight: 600, marginBottom: 4 }}>{c.size} employees {c.annualRevenue ? `· ${c.annualRevenue}` : ''}</div>}
                    {c.location && <div style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 6 }}>📍 {c.location}</div>}
                    <div style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.5, marginBottom: c.buyingTrigger ? 8 : 0 }}>{c.reason}</div>
                    {c.buyingTrigger && <div style={{ fontSize: 11, color: '#10b981', fontWeight: 600, background: 'rgba(16,185,129,0.08)', padding: '6px 8px', borderRadius: 6 }}>⚡ Trigger: {c.buyingTrigger}</div>}
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard title="Buyer Personas" icon={<Users size={15}/>} accent="#f59e0b">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {icp?.buyerPersonas?.map((p: any, i: number) => (
                  <div key={i} style={{ padding: '16px', background: 'var(--bg-btn)', borderRadius: 12, border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
                      <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(245,158,11,0.15)', border: '2px solid rgba(245,158,11,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 16 }}>
                        {['👤', '💼', '🎯', '🏢', '⚡'][i % 5]}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                          <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-1)' }}>{p.title}</span>
                          {p.department && <Pill text={p.department}/>}
                        </div>
                        {p.linkedinTitle && (
                          <a href={`https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(p.linkedinTitle)}`} target="_blank" rel="noopener noreferrer"
                            style={{ fontSize: 11, color: '#0077b5', fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 8 }}>
                            <Search size={10}/> Find on LinkedIn: {p.linkedinTitle}
                          </a>
                        )}
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 8, marginBottom: p.messagingHook ? 12 : 0 }}>
                      <div style={{ fontSize: 12, color: '#ef4444', lineHeight: 1.5 }}><strong>Pain:</strong> {p.painPoint}</div>
                      {p.trigger && <div style={{ fontSize: 12, color: '#10b981', lineHeight: 1.5 }}><strong>Trigger:</strong> {p.trigger}</div>}
                      {p.objection && <div style={{ fontSize: 12, color: '#f59e0b', lineHeight: 1.5 }}><strong>Objection & Handle:</strong> {p.objection}</div>}
                    </div>
                    {p.messagingHook && (
                      <div style={{ background: 'rgba(79,70,229,0.08)', border: '1px solid rgba(79,70,229,0.2)', borderRadius: 8, padding: '10px 14px' }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: '#4f46e5', marginBottom: 4 }}>💬 MESSAGING HOOK</div>
                        <div style={{ fontSize: 13, color: 'var(--text-1)', fontStyle: 'italic', fontWeight: 600 }}>"{p.messagingHook}"</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard title="Pain Points to Address" icon={<AlertTriangle size={15}/>} accent="#ef4444">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10 }}>
                {icp?.painPoints?.map((p: string, i: number) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 8 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#ef4444', flexShrink: 0 }}/>
                    <span style={{ fontSize: 13, color: 'var(--text-2)' }}>{p}</span>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>
        )}

        {/* ══ TAB: COMPETITORS ═════════════════════════════════ */}
        {activeTab === 'competitors' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {competitors?.map((c: any, i: number) => (
              <div key={i} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--text-1)', marginBottom: 2 }}>{c.name}</div>
                    {c.size && <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{c.size}</div>}
                  </div>
                  <Pill text="Competitor" color="#ef4444"/>
                </div>
                {(c.battleCard || c.differentiationStrategy) && (
                  <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 10, padding: '12px 16px', marginBottom: 14 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: '#10b981', marginBottom: 6, letterSpacing: '0.05em' }}>⚔️ BATTLE CARD — What to say in a sales call</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-1)', fontStyle: 'italic' }}>"{c.battleCard || c.differentiationStrategy}"</div>
                  </div>
                )}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
                  {[
                    { label: 'POSITIONING', value: c.positioning, color: 'var(--text-2)' },
                    { label: 'CLIENTS THEY WIN', value: c.clientsTheyWin, color: '#3b82f6' },
                    { label: 'THEIR STRENGTHS', value: c.strengths, color: '#f59e0b' },
                    { label: 'THEIR WEAKNESSES', value: c.weaknesses || c.weakness, color: '#10b981' },
                    { label: 'PRICING SIGNAL', value: c.pricingSignal, color: '#8b5cf6' },
                    { label: 'HOW YOU WIN', value: c.differentiationStrategy || c.differentiation, color: '#4f46e5' },
                  ].filter(d => d.value).map((d, j) => (
                    <div key={j} style={{ background: 'var(--bg-btn)', borderRadius: 8, padding: '10px 12px' }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-3)', marginBottom: 6 }}>{d.label}</div>
                      <div style={{ fontSize: 12, color: d.color, lineHeight: 1.5 }}>{d.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ══ TAB: OUTREACH INTELLIGENCE ═══════════════════════ */}
        {activeTab === 'outreach' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <SectionCard title="Best People to Contact" icon={<Users size={15}/>} accent="#4f46e5">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {outreachIntelligence?.bestContacts?.map((c: any, i: number) => (
                  <div key={i} style={{ padding: '14px', background: 'var(--bg-btn)', borderRadius: 10, border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: c.avoidMistake ? 10 : 0 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(79,70,229,0.15)', border: '1px solid rgba(79,70,229,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 14 }}>
                        {['🎯', '💼', '🏢', '⚡'][i % 4]}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: 13, color: '#4f46e5', marginBottom: 4 }}>{c.title}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 4 }}>{c.why}</div>
                        <div style={{ fontSize: 12, color: '#10b981', fontWeight: 600 }}>Approach: {c.approach}</div>
                      </div>
                    </div>
                    {c.avoidMistake && (
                      <div style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 7, padding: '8px 12px', fontSize: 11, color: '#ef4444' }}>
                        ⚠️ <strong>Avoid:</strong> {c.avoidMistake}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </SectionCard>

            {outreachIntelligence?.subjectLineVariants && outreachIntelligence.subjectLineVariants.length > 0 && (
              <SectionCard title="Subject Line Variants" icon={<Zap size={15}/>} accent="#f59e0b">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {outreachIntelligence.subjectLineVariants.map((s: string, i: number) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, background: 'var(--bg-btn)', borderRadius: 8, padding: '10px 14px' }}>
                      <span style={{ fontSize: 13, color: 'var(--text-1)', fontWeight: 500 }}>{s}</span>
                      <CopyBtn text={s}/>
                    </div>
                  ))}
                </div>
              </SectionCard>
            )}

            {outreachIntelligence?.coldEmailTemplate && (
              <SectionCard title="Cold Email Template" icon={<Mail size={15}/>} accent="#f59e0b">
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10 }}>
                  <CopyBtn text={outreachIntelligence.coldEmailTemplate}/>
                </div>
                <pre style={{ fontFamily: 'inherit', fontSize: 13, color: 'var(--text-2)', lineHeight: 1.7, background: 'var(--bg-btn)', padding: '14px 16px', borderRadius: 10, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {outreachIntelligence.coldEmailTemplate}
                </pre>
              </SectionCard>
            )}

            {outreachIntelligence?.linkedinMessage && (
              <SectionCard title="LinkedIn Connection Message" icon={<Globe size={15}/>} accent="#0077b5">
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10 }}>
                  <CopyBtn text={outreachIntelligence.linkedinMessage}/>
                </div>
                <div style={{ background: 'var(--bg-btn)', padding: '14px 16px', borderRadius: 10, fontSize: 13, color: 'var(--text-2)', lineHeight: 1.7, fontStyle: 'italic' }}>
                  "{outreachIntelligence.linkedinMessage}"
                </div>
              </SectionCard>
            )}

            {outreachIntelligence?.followUpStrategy?.length > 0 && (
              <SectionCard title="Follow-Up Sequence" icon={<Clock size={15}/>} accent="#10b981">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {outreachIntelligence.followUpStrategy.map((f: string, i: number) => (
                    <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                      <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#10b981', flexShrink: 0 }}>{i + 1}</div>
                      <div style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6, paddingTop: 2 }}>{f}</div>
                    </div>
                  ))}
                </div>
              </SectionCard>
            )}

            {outreachIntelligence?.doNotDo && outreachIntelligence.doNotDo.length > 0 && (
              <SectionCard title="Common Outreach Mistakes to Avoid" icon={<AlertTriangle size={15}/>} accent="#ef4444">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {outreachIntelligence.doNotDo.map((m: string, i: number) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 12px', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 8 }}>
                      <span style={{ fontSize: 14, flexShrink: 0 }}>❌</span>
                      <span style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.5 }}>{m}</span>
                    </div>
                  ))}
                </div>
              </SectionCard>
            )}
          </div>
        )}

        {/* ══ TAB: GROWTH STRATEGY ═════════════════════════════ */}
        {activeTab === 'strategy' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {growthStrategy?.quickWins && growthStrategy.quickWins.length > 0 && (
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#10b981', marginBottom: 10 }}>⚡ QUICK WINS — Under 2 Weeks</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 10 }}>
                  {growthStrategy.quickWins.map((win: string, i: number) => (
                    <div key={i} style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 12, padding: '14px 16px', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                      <CheckCircle2 size={16} color="#10b981" style={{ flexShrink: 0, marginTop: 1 }}/>
                      <span style={{ fontSize: 13, color: 'var(--text-1)', lineHeight: 1.5, fontWeight: 600 }}>{win}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
              {[
                { label: '🚀 Immediate Actions', subtitle: '0–30 Days', items: growthStrategy?.immediate, color: '#ef4444' },
                { label: '📈 Short Term', subtitle: '30–90 Days', items: growthStrategy?.shortTerm, color: '#f59e0b' },
                { label: '🏆 Long Term', subtitle: '90+ Days', items: growthStrategy?.longTerm, color: '#10b981' },
              ].map((phase, pi) => (
                <div key={pi} style={{ background: 'var(--bg-card)', border: `1px solid ${phase.color}25`, borderRadius: 16, overflow: 'hidden' }}>
                  <div style={{ padding: '14px 18px', background: `${phase.color}10`, borderBottom: '1px solid var(--border)' }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-1)', marginBottom: 2 }}>{phase.label}</div>
                    <div style={{ fontSize: 11, color: phase.color, fontWeight: 600 }}>{phase.subtitle}</div>
                  </div>
                  <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {phase.items?.map((item: string, i: number) => (
                      <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                        <ArrowRight size={13} color={phase.color} style={{ flexShrink: 0, marginTop: 2 }}/>
                        <span style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.5 }}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {growthStrategy?.channelStrategy && (
              <div style={{ background: 'var(--bg-card)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: 16, padding: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#8b5cf6', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Globe size={14}/> Channel Strategy
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 14 }}>
                  <div style={{ background: 'rgba(139,92,246,0.08)', borderRadius: 10, padding: '12px 14px' }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: '#8b5cf6', marginBottom: 4 }}>PRIMARY</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-1)' }}>{growthStrategy.channelStrategy.primaryChannel}</div>
                  </div>
                  <div style={{ background: 'rgba(139,92,246,0.04)', borderRadius: 10, padding: '12px 14px' }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: '#8b5cf6', marginBottom: 4 }}>SECONDARY</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-1)' }}>{growthStrategy.channelStrategy.secondaryChannel}</div>
                  </div>
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6, background: 'var(--bg-btn)', padding: '12px 14px', borderRadius: 8 }}>
                  💡 {growthStrategy.channelStrategy.reasoning}
                </div>
              </div>
            )}
          </div>
        )}

        <div style={{ height: 40 }}/>
      </div>

      <style>{`
        @media (max-width: 480px) { .tab-label { display: none; } }
      `}</style>
    </div>
  );
}
