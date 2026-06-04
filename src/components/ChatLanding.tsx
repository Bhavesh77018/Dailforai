'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Users, Mail, Search, Link as LinkIcon, Code, Briefcase, HelpCircle, Building2, UserCircle, Target, UserPlus, TrendingUp, Lightbulb, Zap, Star } from 'lucide-react';
import { supabase } from '@/lib/supabase';

type AgentType = 'recruitment' | 'sales' | 'prospect' | 'growth';
type Msg = { role: 'user' | 'ai'; content: string; extra?: any };

const AGENTS = [
  { id: 'recruitment' as AgentType, label: 'Recruitment', icon: <Users size={16} />, classSuffix: 'recruit', endpoint: '/api/ai-agents/recruitment/chat-simple' },
  { id: 'sales' as AgentType, label: 'Sales', icon: <Mail size={16} />, classSuffix: 'sales', endpoint: '/api/ai-agents/sales/generate' },
  { id: 'prospect' as AgentType, label: 'Prospects', icon: <Search size={16} />, classSuffix: 'prospect', endpoint: '/api/ai-agents/prospect/find' },
  { id: 'growth' as AgentType, label: 'Growth', icon: <TrendingUp size={16} />, classSuffix: 'growth', endpoint: '/api/ai-agents/growth/chat' },
];

const QUICK_CARDS: Record<AgentType, { title: string; desc: string; prompt: string, icon: React.ReactNode }[]> = {
  recruitment: [
    { icon: <Briefcase />, title: 'Post a Job', desc: 'Create a magic link', prompt: 'Generate a job posting for a Senior React Developer and create a magic application link.' },
    { icon: <LinkIcon />, title: 'Scrape LinkedIn', desc: 'Extract full structured data', prompt: 'https://linkedin.com/in/example-profile' },
    { icon: <Code />, title: 'GitHub Profile', desc: 'Analyze a developer profile', prompt: 'https://github.com/example-dev' },
    { icon: <Briefcase />, title: 'Naukri Profile', desc: 'Extract resume from Naukri', prompt: 'https://naukri.com/mnjuser/profile' },
  ],
  sales: [
    { icon: <Mail />, title: 'Cold Outreach', desc: 'Write a B2B cold email', prompt: 'Write a cold outreach email for a SaaS CEO about our AI platform' },
    { icon: <UserCircle />, title: 'Follow-up Email', desc: 'Re-engage a silent prospect', prompt: 'Write a follow-up email for a prospect who went silent for 2 weeks' },
    { icon: <LinkIcon />, title: 'LinkedIn Message', desc: 'Connection request message', prompt: 'Write a LinkedIn connection message for a VP of Sales at a fintech startup' },
    { icon: <Target />, title: 'Personalized Pitch', desc: 'Tailored pitch for a target', prompt: 'Write a personalized pitch for a Marketing Director at an e-commerce brand' },
  ],
  prospect: [
    { icon: <Building2 />, title: 'Find SaaS Founders', desc: 'B2B decision makers', prompt: 'Find founders of B2B SaaS companies in the US focused on HR tech with 10-50 employees' },
    { icon: <UserPlus />, title: 'VPs of Sales', desc: 'Series A-B startup leaders', prompt: 'Find VP of Sales at Series A-B fintech startups in Europe' },
    { icon: <Target />, title: 'AI Startup CEOs', desc: 'Research automation leaders', prompt: 'Research AI automation startup CEOs and decision makers' },
    { icon: <Briefcase />, title: 'Marketing Directors', desc: 'E-commerce brand CMOs', prompt: 'Find Marketing Directors at e-commerce brands with revenue above $10M' },
  ],
  growth: [
    { icon: <TrendingUp />, title: 'BDM Strategy', desc: 'Targeted growth recommendation', prompt: 'Suggest a B2B growth strategy for a software agency targeting healthcare clients in the US.' },
    { icon: <Target />, title: 'Define ICP', desc: 'Find your ideal customer profile', prompt: 'Define the Ideal Customer Profile (ICP) and buyer personas for a cybersecurity SaaS startup.' },
    { icon: <Building2 />, title: 'Competitor Battle Card', desc: 'Analyze how to win clients', prompt: 'Draft a competitor comparison battle card for an AI-powered customer support chatbot.' },
    { icon: <Mail />, title: 'Outreach Strategy', desc: 'Convert cold leads into calls', prompt: 'Create a cold outreach sequence (LinkedIn + Cold Email) for selling IT recruitment services.' },
  ],
};

interface Props {
  onNavigate: (v: string) => void;
  onChatAction?: () => boolean;
  user?: any;
  selectedAgent: AgentType;
  setSelectedAgent: (a: AgentType) => void;
  sessionId: string;
  initialMessages?: any[];
  onNewChat?: () => void;     // triggers a new session from parent
}

export default function ChatLanding({ onNavigate, onChatAction, user, selectedAgent, setSelectedAgent, sessionId, initialMessages, onNewChat }: Props) {
  const [messages, setMessages] = useState<Msg[]>(initialMessages || []);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [pendingAgent, setPendingAgent] = useState<AgentType | null>(null); // agent-switch confirmation
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // When sessionId changes (New Chat clicked), reset messages
  useEffect(() => {
    setMessages(initialMessages || []);
    setInput('');
  }, [sessionId]);

  // When initialMessages change (loading a past session), restore them
  useEffect(() => {
    if (initialMessages && initialMessages.length > 0) {
      setMessages(initialMessages);
    }
  }, [initialMessages]);

  // Save session to DB + localStorage after every message
  useEffect(() => {
    if (!user?.id || messages.length === 0) return;
    const key = `sessions_${user.id}`;
    const existing: any[] = (() => { try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; } })();
    // Derive title from first user message
    const firstUser = messages.find(m => m.role === 'user');
    const title = firstUser ? firstUser.content.substring(0, 42) + (firstUser.content.length > 42 ? '…' : '') : 'New Chat';
    
    // DB save (non-blocking)
    supabase.from('chat_sessions').upsert({
      id: sessionId,
      user_id: user.id,
      title,
      agent: selectedAgent,
      messages,
      updated_at: new Date().toISOString()
    }).then();

    const session = { id: sessionId, title, agent: selectedAgent, createdAt: new Date().toISOString(), messages };
    const withoutThis = existing.filter((s: any) => s.id !== sessionId);
    const updated = [session, ...withoutThis].slice(0, 30); // keep last 30 sessions
    localStorage.setItem(key, JSON.stringify(updated));
  }, [messages, user, sessionId, selectedAgent]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  // ────────────────────────────────────────────────────────────────────
  // Logs an activity record using the user's live auth token so RLS is
  // satisfied. Falls back silently if the user is not logged in.
  // ────────────────────────────────────────────────────────────────────
  const logToDb = async (inputData: Record<string, any>, outputData?: Record<string, any>, durationMs = 1200) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) return;
      await fetch('/api/log-activity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          agent_type: selectedAgent,
          input_data: inputData,
          output_data: outputData,
          duration_ms: durationMs
        })
      });
    } catch (e) {
      console.error('[logToDb]', e);
    }
  };

  const send = async () => {
    if (!input.trim() || loading) return;
    if (onChatAction) {
      const allowed = onChatAction();
      if (!allowed) return;
    }

    const text = input.trim();
    setInput('');
    setMessages(p => [...p, { role: 'user', content: text }]);
    setLoading(true);

    const agent = AGENTS.find(a => a.id === selectedAgent)!;
    const isUrl = text.match(/https?:\/\//i) || text.includes('linkedin.com') || text.includes('github.com') || text.includes('naukri.com');

    try {
      let endpoint = agent.endpoint;
      let body: any = {};

      if (selectedAgent === 'recruitment') {
        if (isUrl) {
          endpoint = '/api/ai-agents/recruitment/scrape';
          body = { url: text, userId: user?.id };
        } else {
          endpoint = '/api/ai-agents/recruitment/chat-simple';
          body = { message: text, userId: user?.id };
        }
      } else if (selectedAgent === 'sales' || selectedAgent === 'growth') {
        body = { message: text, conversationHistory: messages.map(m => ({ role: m.role === 'ai' ? 'assistant' : 'user', content: m.content })), userId: user?.id };
      } else {
        body = { query: text, conversationHistory: messages.map(m => ({ role: m.role === 'ai' ? 'assistant' : 'user', content: m.content })), userId: user?.id };
      }

      const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const data = await res.json();

      if (selectedAgent === 'recruitment' && isUrl) {
        const p = data.extractedProfile;
        const msg = data.error
          ? `❌ ${data.error}`
          : `${data.message}\n\n${p?.skills?.length ? `**Skills:** ${p.skills.slice(0, 8).join(', ')}` : ''}`;
        setMessages(prev => [...prev, { role: 'ai', content: msg, extra: data.extractedProfile }]);
        // Log profile scrape
        logToDb(
          { message: `Scraped profile: ${text}`, url: text },
          { candidate: p?.name, role: p?.role, skills: p?.skills, score: p?.score },
          2000
        );
      } else if (selectedAgent === 'sales') {
        setMessages(prev => [...prev, { role: 'ai', content: data.reply || 'Done!', extra: data.email }]);
        logToDb({ message: `Sales: ${text.substring(0, 60)}` }, { reply: data.reply });
      } else if (selectedAgent === 'growth') {
        setMessages(prev => [...prev, { role: 'ai', content: data.reply || 'Analysis complete.', extra: data.insights }]);
        logToDb({ message: `Growth: ${text.substring(0, 60)}` }, { reply: data.reply, insights: data.insights });
      } else if (selectedAgent === 'prospect') {
        setMessages(prev => [...prev, { role: 'ai', content: data.reply || 'Found prospects!', extra: data.prospects }]);
        logToDb({ message: `Prospect search: ${text.substring(0, 60)}` }, { count: data.prospects?.length });
      } else if (selectedAgent === 'recruitment') {
        const reply = data.reply || data.error || 'Response received.';
        setMessages(prev => [...prev, { role: 'ai', content: reply }]);
        // Detect magic link in reply
        const magicMatch = reply.match(/https:\/\/(?:www\.)?dialforai\.com\/apply\/req-([a-zA-Z0-9-]+)/);
        if (magicMatch) {
          const reqId = magicMatch[1];
          // Extract job title from the reply (first heading line)
          const jobTitleMatch = reply.match(/(?:Position|Job Title|Role)[:\s]+([^\n]+)/i);
          const jobTitle = jobTitleMatch?.[1]?.trim() || 'Untitled Position';

          // 1. Log to activity log (agent_runs)
          logToDb(
            { message: `Generated Job Posting & Magic Link: req-${reqId}`, reqId },
            { reply, link: `https://www.dialforai.com/apply/${reqId}`, jobTitle },
            1500
          );

          // 2. Register magic link → recruiter mapping in the PUBLIC lookup table
          //    This allows the candidate submit route to find the recruiter without auth
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.access_token) {
            fetch('/api/recruitment/register-magic-link', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.access_token}`
              },
              body: JSON.stringify({ reqId, jobTitle })
            }).then(r => r.json()).then(d => {
              if (d.success) console.log('[magic-link] Registered req_id:', reqId);
              else console.error('[magic-link] Registration failed:', d);
            });
          }
        } else {
          logToDb(
            { message: `Recruitment Chat: ${text.substring(0, 60)}` },
            { reply }
          );
        }
      } else {
        setMessages(prev => [...prev, { role: 'ai', content: data.reply || data.error || 'Response received.' }]);
      }
    } catch {
      setMessages(prev => [...prev, { role: 'ai', content: '❌ Error connecting to agent. Check your connection.' }]);
    }
    setLoading(false);
  };

  const showHero = messages.length === 0;

  return (
    <div className="chat-page">
      <div className="chat-scroll-area">
        {showHero ? (
          <div className="hero-section fade-in">
            <h1 className="hero-title">How can I help you today?</h1>
            
            {/* Agent selector pills */}
            <div className="agent-selector slide-up" style={{ animationDelay: '0.05s' }}>
              {AGENTS.map(a => (
                <button 
                  key={a.id} 
                  className={`agent-pill ${selectedAgent === a.id ? `selected selected-${a.classSuffix}` : ''}`} 
                  onClick={() => {
                    if (a.id === selectedAgent) return;
                    if (messages.length > 0) {
                      setPendingAgent(a.id); // show confirmation modal
                    } else {
                      setSelectedAgent(a.id);
                    }
                  }}
                >
                  {a.icon} {a.label}
                </button>
              ))}
            </div>

            {/* Quick action cards */}
            <div className="quick-actions slide-up" style={{ animationDelay: '0.1s' }}>
              {QUICK_CARDS[selectedAgent].map(c => (
                <div key={c.title} className="quick-card" onClick={() => { setInput(c.prompt); textareaRef.current?.focus(); }}>
                  <div className="quick-card-title">{c.icon} {c.title}</div>
                  <div className="quick-card-desc">{c.desc}</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="chat-body fade-in">
            {messages.map((m, i) => (
              <div key={i} className={`msg-row ${m.role}`}>
                <div className={`msg-avatar ${m.role}`}>
                  {m.role === 'user' ? (user ? (user.user_metadata?.full_name?.[0] || 'U') : 'U') : <Bot />}
                </div>
                <div className={`msg-bubble ${m.role}`}>
                  <div style={{ whiteSpace: 'pre-wrap' }}>
                    {m.content
                      .replace(/\*?\*?🚀 Magic Application Link:\*?\*?.*?(\n|$)/gi, '')
                      .replace(/\*?\(Candidates who apply via this link.*?\)\*?/gi, '')
                      .replace(/<generate-random-id>/gi, '')
                      .replace(/\[https:\/\/(?:www\.)?dialforai\.com\/apply\/req-\]\(https:\/\/(?:www\.)?dialforai\.com\/apply\/req-\)/gi, '')
                      .replace(/\*\*(.*?)\*\*/g, '$1')
                      .trim()}
                  </div>
                  
                  {/* Custom Renderers for Extracted Data */}
                  {m.extra && Array.isArray(m.extra) && m.extra.length > 0 && (
                    <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {m.extra.map((p: any, pi: number) => (
                        <div key={pi} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, padding: 16 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                            <div>
                              <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--text-1)' }}>{p.name}</div>
                              <div style={{ fontSize: 13, color: 'var(--color-prospect)' }}>{p.role}</div>
                              <div style={{ fontSize: 13, color: 'var(--text-2)' }}>{p.company}</div>
                            </div>
                            {p.score && (
                              <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-1)' }}>{p.score}</div>
                                <div style={{ fontSize: 11, color: 'var(--text-3)' }}>Fit Score</div>
                              </div>
                            )}
                          </div>
                          {p.why && <div style={{ fontSize: 13, color: 'var(--text-2)', marginTop: 8, borderTop: '1px solid var(--border)', paddingTop: 12 }}>{p.why}</div>}
                        </div>
                      ))}
                    </div>
                  )}
                  {m.extra && !Array.isArray(m.extra) && m.extra?.subject && (
                    <div style={{ marginTop: 16, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, padding: 16 }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-3)', marginBottom: 4 }}>SUBJECT</div>
                      <div style={{ fontWeight: 500, fontSize: 14, color: 'var(--text-1)', marginBottom: 16 }}>{m.extra.subject}</div>
                      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-3)', marginBottom: 4 }}>BODY</div>
                      <div style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--text-2)', whiteSpace: 'pre-wrap' }}>{m.extra.body}</div>
                    </div>
                  )}

                  {/* Growth Insights Card */}
                  {m.role === 'ai' && m.extra && !Array.isArray(m.extra) && (m.extra.topInsight || m.extra.urgentAction || m.extra.biggestOpportunity) && (
                    <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
                      {m.extra.topInsight && (
                        <div style={{ background: 'var(--bg-card)', border: '1px solid rgba(79, 70, 229, 0.25)', borderRadius: 12, padding: 16 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, color: '#4f46e5' }}>
                            <Lightbulb size={16}/>
                            <span style={{ fontSize: 11, fontWeight: 700 }}>TOP INSIGHT</span>
                          </div>
                          <div style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.5 }}>{m.extra.topInsight}</div>
                        </div>
                      )}
                      {m.extra.urgentAction && (
                        <div style={{ background: 'var(--bg-card)', border: '1px solid rgba(245, 158, 11, 0.25)', borderRadius: 12, padding: 16 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, color: '#f59e0b' }}>
                            <Zap size={16}/>
                            <span style={{ fontSize: 11, fontWeight: 700 }}>URGENT ACTION</span>
                          </div>
                          <div style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.5 }}>{m.extra.urgentAction}</div>
                        </div>
                      )}
                      {m.extra.biggestOpportunity && (
                        <div style={{ background: 'var(--bg-card)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: 12, padding: 16 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, color: '#10b981' }}>
                            <Star size={16}/>
                            <span style={{ fontSize: 11, fontWeight: 700 }}>BIGGEST OPPORTUNITY</span>
                          </div>
                          <div style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.5 }}>{m.extra.biggestOpportunity}</div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Magic Link Renderer */}
                  {m.role === 'ai' && (m.content.includes('dialforai.com/apply/req-') || m.content.includes('www.dialforai.com/apply/req-')) && (
                    <div style={{ marginTop: 16, background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.1), rgba(236, 72, 153, 0.05))', border: '1px solid rgba(79, 70, 229, 0.2)', borderRadius: 12, padding: 16 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, color: '#4f46e5', fontWeight: 600 }}>
                        <LinkIcon size={16} /> Magic Application Link Generated
                      </div>
                      <p style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 16 }}>
                        Share this link with candidates. When they apply, DialforAI will automatically screen and score them.
                      </p>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <input 
                          readOnly 
                          value={(() => { return m.content.match(/https:\/\/(?:www\.)?dialforai\.com\/apply\/req-[a-zA-Z0-9-]+/)?.[0]?.replace('https://dialforai.com', 'https://www.dialforai.com') || `https://www.dialforai.com/apply/req-new`; })()}
                          style={{ flex: 1, padding: '8px 12px', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg-input)', color: 'var(--text-1)', fontSize: 13 }}
                        />
                        <button 
                          className="btn btn-primary" 
                          style={{ padding: '8px 16px', borderRadius: 6, display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}
                          onClick={(e) => {
                            const link = m.content.match(/https:\/\/(?:www\.)?dialforai\.com\/apply\/req-[a-zA-Z0-9-]+/)?.[0]?.replace('https://dialforai.com', 'https://www.dialforai.com') || `https://www.dialforai.com/apply/req-new`;
                            navigator.clipboard.writeText(link);
                            const btn = e.currentTarget;
                            const originalHTML = btn.innerHTML;
                            btn.innerHTML = 'Copied!';
                            setTimeout(() => { btn.innerHTML = originalHTML; }, 2000);
                          }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
                          Share
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="msg-row ai">
                <div className="msg-avatar ai"><Bot /></div>
                <div className="msg-bubble ai"><div className="typing-dots"><div className="typing-dot"/><div className="typing-dot"/><div className="typing-dot"/></div></div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      <div className="chat-input-area slide-up">
        {/* Agent selector when chatting */}
        {!showHero && (
          <div style={{ display: 'flex', gap: 6, marginBottom: 12, width: '100%', maxWidth: 760 }}>
            {AGENTS.map(a => (
              <button 
                key={a.id} 
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '4px 10px', borderRadius: 6, fontSize: 12, fontWeight: 500,
                  border: `1px solid ${selectedAgent === a.id ? 'var(--border-focus)' : 'transparent'}`,
                  background: selectedAgent === a.id ? 'var(--bg-btn)' : 'transparent',
                  color: selectedAgent === a.id ? 'var(--text-1)' : 'var(--text-3)', cursor: 'pointer',
                }} 
                onClick={() => {
                  if (a.id === selectedAgent) return;
                  if (messages.length > 0) {
                    setPendingAgent(a.id);
                  } else {
                    setSelectedAgent(a.id);
                  }
                }}
              >
                {a.icon} {a.label}
              </button>
            ))}
          </div>
        )}
        
        <div className="chat-input-wrap">
          <div className="chat-input-box">
            <textarea
              ref={textareaRef}
              className="chat-textarea"
              rows={1}
              placeholder={`Ask ${AGENTS.find(a => a.id === selectedAgent)?.label.toLowerCase()} anything...`}
              value={input}
              onChange={e => {
                setInput(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 200) + 'px';
              }}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
            />
            <button
              className="send-btn"
              onClick={send}
              disabled={!input.trim() || loading}
            >
              <Send size={16} />
            </button>
          </div>
          <div className="chat-footer-note">DialforAI is an AI system and may provide inaccurate information.</div>
        </div>
      </div>

      {/* ── Agent Switch Confirmation Modal ────────────────────────────── */}
      {pendingAgent && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'fadeIn 0.15s ease'
        }}>
          <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 16, padding: '32px 28px', width: '100%', maxWidth: 400,
            boxShadow: '0 24px 48px rgba(0,0,0,0.3)',
            animation: 'slideUp 0.2s ease'
          }}>
            {/* Icon */}
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(251,191,36,0.12)', border: '1px solid rgba(251,191,36,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, marginBottom: 16 }}>
              ⚠️
            </div>

            <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-1)', marginBottom: 8 }}>
              Switch Agent?
            </h2>
            <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.6, marginBottom: 24 }}>
              Switching to the <strong style={{ color: 'var(--text-1)' }}>{AGENTS.find(a => a.id === pendingAgent)?.label}</strong> agent will start a new chat. Your current conversation will be saved in history.
            </p>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => setPendingAgent(null)}
                style={{
                  flex: 1, padding: '10px 0', borderRadius: 8, border: '1px solid var(--border)',
                  background: 'var(--bg-btn)', color: 'var(--text-1)', fontWeight: 600,
                  fontSize: 14, cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (pendingAgent) {
                    setSelectedAgent(pendingAgent);
                    setPendingAgent(null);
                    // Trigger new chat session from parent
                    if (onNewChat) {
                      onNewChat();
                    } else {
                      setMessages([]);
                      setInput('');
                    }
                  }
                }}
                style={{
                  flex: 1, padding: '10px 0', borderRadius: 8, border: 'none',
                  background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                  color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer'
                }}
              >
                Switch & New Chat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
