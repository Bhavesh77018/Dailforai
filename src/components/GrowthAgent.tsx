'use client';
import React, { useState } from 'react';
import {
  TrendingUp, Building2, Target, Users, Mail, Search, AlertTriangle,
  CheckCircle2, ArrowRight, Zap, BarChart3, Lightbulb, ShieldCheck,
  Clock, Star, MapPin, Globe, Briefcase, ChevronDown, ChevronUp,
  RefreshCw, Copy, Check, Rocket, Eye, Award, TrendingDown
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
  company: string; industry: string; location: string; size: string;
  score: number; whyMatch: string; hiringSignal: string;
  contactType: string; linkedinSearch: string; outreachAngle: string;
}

interface AnalysisData {
  companyProfile: { overview: string; coreServices: string[]; targetMarkets: string[]; valueProposition: string };
  icp: { idealClients: any[]; buyerPersonas: any[]; painPoints: string[] };
  marketOpportunity: { summary: string; estimatedMarketSize: string; growthRecommendations: string[] };
  leads: Lead[];
  competitors: any[];
  outreachIntelligence: { bestContacts: any[]; coldEmailTemplate: string; linkedinMessage: string; followUpStrategy: string[] };
  growthStrategy: { immediate: string[]; shortTerm: string[]; longTerm: string[] };
  insights: { topInsight: string; urgentAction: string; biggestOpportunity: string; warningSign: string };
}

/* ─── Helpers ─────────────────────────────────────────────────── */
const scoreColor = (s: number) => s >= 90 ? '#10b981' : s >= 75 ? '#f59e0b' : s >= 60 ? '#f97316' : '#ef4444';
const scoreLabel = (s: number) => s >= 90 ? 'Hot Lead' : s >= 75 ? 'Strong' : s >= 60 ? 'Moderate' : 'Cold';
const scoreGradient = (s: number) => s >= 90 ? 'rgba(16,185,129,0.1)' : s >= 75 ? 'rgba(245,158,11,0.1)' : 'rgba(249,115,22,0.1)';

const TABS = [
  { id: 'leads',      label: 'Lead Discovery',    icon: <Target size={14}/> },
  { id: 'icp',        label: 'ICP & Personas',     icon: <Users size={14}/> },
  { id: 'competitors',label: 'Competitors',         icon: <TrendingDown size={14}/> },
  { id: 'outreach',   label: 'Outreach Intel',      icon: <Mail size={14}/> },
  { id: 'strategy',   label: 'Growth Strategy',     icon: <Rocket size={14}/> },
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

/* ─── Main Component ──────────────────────────────────────────── */
export default function GrowthAgent({ user }: { user?: any }) {
  const [step, setStep] = useState<'input' | 'loading' | 'results'>('input');
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('leads');
  const [expandedLead, setExpandedLead] = useState<number | null>(null);
  const [result, setResult] = useState<AnalysisData | null>(null);

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
      setStep('results');
      setActiveTab('leads');
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
    <div style={{ flex: 1, overflowY: 'auto', padding: 'clamp(16px, 3vw, 40px)', paddingTop: 'clamp(24px, 4vw, 48px)' }}>
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
              { label: 'Company Name *', key: 'companyName', placeholder: 'e.g. Infinity STS', type: 'input' },
              { label: 'Website', key: 'website', placeholder: 'e.g. www.infinitysts.com', type: 'input' },
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
            <label className="form-label">Services / What Your Company Does</label>
            <textarea
              className="form-input"
              rows={3}
              placeholder="e.g. We provide IT staffing, permanent recruitment, and contract workforce solutions for mid-large enterprises across the US and India."
              value={form.services}
              onChange={set('services')}
              style={{ resize: 'vertical', lineHeight: 1.6 }}
            />
          </div>
        </div>

        {/* Business Needs Section */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 16, padding: 'clamp(16px, 3vw, 28px)', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, paddingBottom: 14, borderBottom: '1px solid var(--border)' }}>
            <Target size={16} color="#10b981"/>
            <span style={{ fontWeight: 700, fontSize: 14 }}>Business Needs & Goals *</span>
            <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-3)' }}>The more detail, the better leads you get</span>
          </div>
          <textarea
            className="form-input"
            rows={5}
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
          <button onClick={() => { setStep('input'); setResult(null); }} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-btn)', color: 'var(--text-2)', cursor: 'pointer', fontSize: 13, fontWeight: 500, fontFamily: 'inherit' }}>
            <RefreshCw size={13}/> New Analysis
          </button>
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
                      {expandedLead === i ? <ChevronUp size={14} color="var(--text-3)"/> : <ChevronDown size={14} color="var(--text-3)"/>}
                    </div>
                  </div>

                  {/* Expanded detail */}
                  {expandedLead === i && (
                    <div style={{ borderTop: '1px solid var(--border)', padding: '14px 16px', background: 'var(--bg-main)' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 12 }}>
                        <div>
                          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', marginBottom: 6 }}>WHY THIS IS A MATCH</div>
                          <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6 }}>{lead.whyMatch}</p>
                        </div>
                        <div>
                          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', marginBottom: 6 }}>OUTREACH ANGLE</div>
                          <p style={{ fontSize: 13, color: 'var(--text-1)', lineHeight: 1.6, fontStyle: 'italic' }}>"{lead.outreachAngle}"</p>
                        </div>
                      </div>
                      <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
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
            <SectionCard title="Ideal Customer Profile (ICP)" icon={<Target size={15}/>} accent="#4f46e5">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 12 }}>
                {icp?.idealClients?.map((c: any, i: number) => (
                  <div key={i} style={{ background: 'var(--bg-btn)', borderRadius: 10, padding: 14 }}>
                    <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-1)', marginBottom: 4 }}>{c.type}</div>
                    {c.size && <div style={{ fontSize: 11, color: '#4f46e5', fontWeight: 600, marginBottom: 6 }}>{c.size} employees</div>}
                    <div style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.5 }}>{c.reason}</div>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard title="Buyer Personas" icon={<Users size={15}/>} accent="#f59e0b">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {icp?.buyerPersonas?.map((p: any, i: number) => (
                  <div key={i} style={{ display: 'flex', gap: 14, padding: '12px 14px', background: 'var(--bg-btn)', borderRadius: 10, alignItems: 'flex-start' }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(245,158,11,0.15)', border: '2px solid rgba(245,158,11,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 16 }}>
                      {['👤', '💼', '🎯', '🏢', '⚡'][i % 5]}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                        <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-1)' }}>{p.title}</span>
                        {p.department && <Pill text={p.department}/>}
                      </div>
                      <div style={{ fontSize: 12, color: '#ef4444', marginBottom: 4 }}>Pain: {p.painPoint}</div>
                      {p.trigger && <div style={{ fontSize: 12, color: '#10b981' }}>Trigger: {p.trigger}</div>}
                    </div>
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
                  <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--text-1)' }}>{c.name}</div>
                  <Pill text="Competitor" color="#ef4444"/>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
                  {[
                    { label: 'POSITIONING', value: c.positioning, color: 'var(--text-2)' },
                    { label: 'THEIR STRENGTHS', value: c.strengths, color: '#f59e0b' },
                    { label: 'THEIR WEAKNESS', value: c.weakness, color: '#10b981' },
                    { label: 'HOW YOU WIN', value: c.differentiation, color: '#4f46e5' },
                  ].map((d, j) => (
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
                  <div key={i} style={{ display: 'flex', gap: 12, padding: '12px 14px', background: 'var(--bg-btn)', borderRadius: 10, alignItems: 'flex-start' }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(79,70,229,0.15)', border: '1px solid rgba(79,70,229,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 14 }}>
                      {['🎯', '💼', '🏢', '⚡'][i % 4]}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 13, color: '#4f46e5', marginBottom: 4 }}>{c.title}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 4 }}>{c.why}</div>
                      <div style={{ fontSize: 12, color: '#10b981', fontWeight: 600 }}>Approach: {c.approach}</div>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>

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
          </div>
        )}

        {/* ══ TAB: GROWTH STRATEGY ═════════════════════════════ */}
        {activeTab === 'strategy' && (
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
        )}

        <div style={{ height: 40 }}/>
      </div>

      <style>{`
        @media (max-width: 480px) { .tab-label { display: none; } }
      `}</style>
    </div>
  );
}
