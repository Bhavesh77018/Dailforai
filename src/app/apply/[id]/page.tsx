'use client';
import React, { useState, useEffect, use, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { Hexagon, CheckCircle2, ArrowRight, Bot, ShieldAlert, Send } from 'lucide-react';

export default function ApplicationPortal({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;
  
  const [user, setUser] = useState<any>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  
  // Interview State
  const [started, setStarted] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [messages, setMessages] = useState<{role: string, content: string}[]>([]);
  const [input, setInput] = useState('');
  const [loadingChat, setLoadingChat] = useState(false);
  
  // Cheating Detection
  const [warnings, setWarnings] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Check Auth
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user || null);
      setLoadingAuth(false);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => { authListener.subscription.unsubscribe(); };
  }, []);

  // Anti-Cheat: Tab Switching detection
  useEffect(() => {
    if (!started || completed) return;
    const handleVisibility = () => {
      if (document.hidden) {
        setWarnings(w => w + 1);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [started, completed]);

  // Auto-scroll chat
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const login = async () => {
    const email = prompt('Enter your email to authenticate:');
    if (!email) return;
    try {
      await supabase.auth.signInWithOtp({ email });
      alert('Check your email for the login link!');
    } catch (e: any) {
      alert(e.message);
    }
  };

  const startInterview = async () => {
    setStarted(true);
    setLoadingChat(true);
    try {
      const res = await fetch('/api/apply/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [], reqId: id, warnings })
      });
      const data = await res.json();
      setMessages([{ role: 'ai', content: data.reply }]);
    } catch(e) {
      console.error(e);
    }
    setLoadingChat(false);
  };

  const sendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || loadingChat) return;

    const text = input.trim();
    setInput('');
    const newMessages = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setLoadingChat(true);

    try {
      const res = await fetch('/api/apply/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: newMessages.map(m => ({ role: m.role === 'ai' ? 'assistant' : 'user', content: m.content })), 
          reqId: id, 
          warnings 
        })
      });
      const data = await res.json();
      let reply = data.reply;

      // Check for final score
      const scoreMatch = reply.match(/\[FINAL_SCORE:\s*(\d+)\]/);
      if (scoreMatch) {
        const finalScore = parseInt(scoreMatch[1]);
        reply = reply.replace(/\[FINAL_SCORE:\s*\d+\]/, '').trim();
        setMessages([...newMessages, { role: 'ai', content: reply }]);
        await completeInterview(finalScore, newMessages);
      } else {
        setMessages([...newMessages, { role: 'ai', content: reply }]);
      }
    } catch(e) {
      console.error(e);
    }
    setLoadingChat(false);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    // If they paste a large chunk of text, flag it
    const text = e.clipboardData.getData('text');
    if (text.length > 100) {
      setWarnings(w => w + 1);
    }
  };

  const completeInterview = async (score: number, transcript: any[]) => {
    setCompleted(true);
    try {
      // No auth token needed — the submit route uses the anon key directly via REST API
      const res = await fetch('/api/apply/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          score,
          candidate: user.email,
          reqId: id,
          warnings,
          transcript
        })
      });

      let result: any = {};
      try { result = await res.json(); } catch (_) {}

      if (!res.ok) {
        console.error('[apply] Failed to save interview to DB:', res.status, result);
      } else {
        console.log('[apply] ✅ Interview saved successfully:', result);
      }
    } catch (e: any) {
      // This catches network-level failures (server down, CORS, etc)
      console.error('[apply] Network error during submission:', e.message);
    }
  };

  if (loadingAuth) return <div style={{ minHeight: '100vh', background: 'var(--bg-main)', color: 'var(--text-1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading application...</div>;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-main)', color: 'var(--text-1)', fontFamily: 'var(--font-sans)', display: 'flex', flexDirection: 'column' }}>
      <nav style={{ padding: '16px 40px', borderBottom: '1px solid var(--border)', background: 'var(--bg-main)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Hexagon style={{ color: '#4f46e5' }} />
          <span style={{ fontSize: 18, fontWeight: 700 }}>DialforAI Applicant Portal</span>
        </div>
        {started && !completed && warnings > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#ef4444', fontSize: 12, fontWeight: 600, background: 'rgba(239, 68, 68, 0.1)', padding: '6px 12px', borderRadius: 999 }}>
            <ShieldAlert size={14} /> Suspicious Activity Logged
          </div>
        )}
      </nav>

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 20px', overflowY: 'auto' }}>
        
        {!user ? (
          <div style={{ maxWidth: 500, width: '100%', background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border)', padding: 40, textAlign: 'center', marginTop: '10vh' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--bg-btn)', margin: '0 auto 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-2)' }}>
              <Hexagon size={24} style={{ color: 'var(--text-3)' }} />
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>Authentication Required</h2>
            <p style={{ color: 'var(--text-2)', marginBottom: 24, lineHeight: 1.5 }}>
              You are applying for <strong>Req: {id}</strong>. You must verify your identity before starting the live AI interview.
            </p>
            <button className="btn btn-primary" onClick={login} style={{ padding: '12px 24px', borderRadius: 8, width: '100%' }}>
              Verify Identity via Email
            </button>
          </div>
        ) : !started ? (
          <div style={{ maxWidth: 600, width: '100%', background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border)', padding: 40, marginTop: '5vh' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
              <div>
                <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Role Requisition: {id}</h1>
                <p style={{ color: 'var(--text-2)' }}>Live AI Technical Interview</p>
              </div>
              <div style={{ padding: '4px 12px', background: 'rgba(79, 70, 229, 0.1)', color: '#4f46e5', borderRadius: 999, fontSize: 12, fontWeight: 600 }}>
                AI Monitored
              </div>
            </div>

            <div style={{ padding: 16, background: 'var(--bg-btn)', borderRadius: 8, fontSize: 13, color: 'var(--text-2)', marginBottom: 32 }}>
              Authenticated as <strong style={{ color: 'var(--text-1)' }}>{user.email}</strong>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 40 }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', color: 'var(--text-2)' }}>
                <CheckCircle2 size={18} style={{ color: '#10b981' }} /> The AI will ask you technical questions specific to the role.
              </div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', color: 'var(--text-2)' }}>
                <CheckCircle2 size={18} style={{ color: '#10b981' }} /> Respond as you would in a real interview.
              </div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', color: '#ef4444' }}>
                <ShieldAlert size={18} /> Tab switching and copying/pasting is monitored.
              </div>
            </div>

            <button className="btn btn-primary" onClick={startInterview} disabled={loadingChat} style={{ padding: '16px', borderRadius: 8, width: '100%', fontSize: 16, fontWeight: 600, display: 'flex', justifyContent: 'center', gap: 8 }}>
              {loadingChat ? 'Connecting to AI...' : 'Begin Interview'} <ArrowRight size={18} />
            </button>
          </div>
        ) : (
          <div style={{ maxWidth: 800, width: '100%', height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column', background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border)', overflow: 'hidden' }}>
            
            {/* Chat Area */}
            <div style={{ flex: 1, overflowY: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 24 }}>
              {messages.map((m, i) => (
                <div key={i} style={{ display: 'flex', gap: 16, flexDirection: m.role === 'user' ? 'row-reverse' : 'row' }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: m.role === 'user' ? 'var(--bg-btn)' : '#4f46e5', color: m.role === 'user' ? 'var(--text-1)' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {m.role === 'user' ? user.email[0].toUpperCase() : <Bot size={20} />}
                  </div>
                  <div style={{ background: m.role === 'user' ? 'var(--bg-btn)' : 'rgba(79, 70, 229, 0.1)', color: m.role === 'user' ? 'var(--text-1)' : 'var(--text-1)', padding: '12px 16px', borderRadius: 12, maxWidth: '80%', lineHeight: 1.6, fontSize: 15, whiteSpace: 'pre-wrap', border: m.role === 'ai' ? '1px solid rgba(79, 70, 229, 0.2)' : 'none' }}>
                    {m.content}
                  </div>
                </div>
              ))}
              {loadingChat && (
                <div style={{ display: 'flex', gap: 16 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#4f46e5', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Bot size={20} />
                  </div>
                  <div style={{ background: 'rgba(79, 70, 229, 0.1)', padding: '12px 16px', borderRadius: 12, color: '#4f46e5', fontSize: 14 }}>
                    Analyzing and typing...
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input Area */}
            {!completed ? (
              <form onSubmit={sendMessage} style={{ padding: 20, borderTop: '1px solid var(--border)', display: 'flex', gap: 12, background: 'var(--bg-main)' }}>
                <textarea 
                  rows={2}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                  onPaste={handlePaste}
                  placeholder="Type your answer here..."
                  style={{ flex: 1, background: 'var(--bg-input)', border: '1px solid var(--border-2)', borderRadius: 8, padding: '12px 16px', color: 'var(--text-1)', outline: 'none', resize: 'none', fontSize: 15 }}
                />
                <button type="submit" disabled={loadingChat || !input.trim()} className="btn btn-primary" style={{ padding: '0 24px', borderRadius: 8, alignSelf: 'stretch', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Send size={18} /> Send
                </button>
              </form>
            ) : (
              <div style={{ padding: 24, borderTop: '1px solid var(--border)', background: 'rgba(16, 185, 129, 0.05)', textAlign: 'center', color: '#10b981', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                <CheckCircle2 size={32} />
                <div>
                  <div style={{ fontSize: 18, fontWeight: 600 }}>Interview Completed</div>
                  <div style={{ fontSize: 14, opacity: 0.8 }}>Your results have been sent to the recruiter. You may now close this page.</div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
