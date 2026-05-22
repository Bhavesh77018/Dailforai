'use client';
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useTheme } from '@/contexts/ThemeContext';
import Sidebar, { ChatSession } from '@/components/Sidebar';
import LoginModal from '@/components/LoginModal';
import ChatLanding from '@/components/ChatLanding';
import Dashboard from '@/components/Dashboard';
import RecruitmentAgent from '@/components/RecruitmentAgent';
import SalesAgent from '@/components/SalesAgent';
import ProspectFinder from '@/components/ProspectFinder';
import AgentHistory from '@/components/AgentHistory';
import RecruitmentDashboard from '@/components/RecruitmentDashboard';
import GrowthAgent from '@/components/GrowthAgent';

type View = 'chat' | 'recruitment' | 'sales' | 'prospect' | 'dashboard' | 'history' | 'pipeline' | 'growth';

export default function Home() {
  const [view, setView] = useState<View>('chat');
  const [selectedAgent, setSelectedAgent] = useState<'recruitment' | 'sales' | 'prospect' | 'growth'>('recruitment');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [counts, setCounts] = useState({ prospects: 0, runs: 0, emails: 0 });
  const [chatCount, setChatCount] = useState(0);
  // Chat session management
  const [sessionId, setSessionId] = useState<string>(() => crypto.randomUUID());
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [initialMessages, setInitialMessages] = useState<any[] | undefined>(undefined);
  const { theme, toggle } = useTheme();

  /* ── Auth ── */
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  /* ── Lock html/body for workspace ── */
  useEffect(() => {
    document.documentElement.classList.add('workspace-locked');
    document.body.classList.add('workspace-locked');
    return () => {
      document.documentElement.classList.remove('workspace-locked');
      document.body.classList.remove('workspace-locked');
    };
  }, []);

  /* ── Counts from Supabase ── */
  useEffect(() => {
    async function load() {
      try {
        const [p, r, e] = await Promise.allSettled([
          supabase.from('prospects').select('id', { count: 'exact', head: true }),
          supabase.from('agent_runs').select('id', { count: 'exact', head: true }),
          supabase.from('sales_outreach').select('id', { count: 'exact', head: true }),
        ]);
        setCounts({
          prospects: p.status === 'fulfilled' ? p.value.count || 0 : 0,
          runs: r.status === 'fulfilled' ? r.value.count || 0 : 0,
          emails: e.status === 'fulfilled' ? e.value.count || 0 : 0,
        });
      } catch {}
    }
    load();
    const t = setInterval(load, 30000);
    return () => clearInterval(t);
  }, []);

  const navigate = (v: string) => {
    if ((v === 'dashboard' || v === 'pipeline') && !user) { setShowLogin(true); return; }
    setView(v as View);
    setSidebarOpen(false);
  };

  const handleNewChat = () => {
    setSessionId(crypto.randomUUID());
    setActiveChatId(null);
    setInitialMessages(undefined);
    setView('chat');
    setSidebarOpen(false);
  };

  const handleLoadSession = (session: ChatSession) => {
    setSessionId(session.id);
    setActiveChatId(session.id);
    setSelectedAgent(session.agent as any);
    setInitialMessages(session.messages);
    setView('chat');
    setSidebarOpen(false);
  };

  const launchAgent = (agent: 'recruitment' | 'sales' | 'prospect' | 'growth') => {
    setSelectedAgent(agent);
    setView('chat');
    setSidebarOpen(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setView('chat');
  };

  const handleLoginSuccess = (u: any) => {
    setUser(u);
    setShowLogin(false);
    if (view === 'chat') {
      // Stay on chat if they were forced to login from chatting
    } else {
      setView('dashboard');
    }
  };

  const handleChatAction = () => {
    if (!user) {
      if (chatCount >= 1) {
        setShowLogin(true);
        return false; // prevent chat
      }
      setChatCount(c => c + 1);
    }
    return true; // allow chat
  };

  return (
    <div className="app-shell">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.6)', zIndex: 49 }} />
      )}

      <Sidebar
        activeView={view}
        onNavigate={navigate}
        isOpen={sidebarOpen}
        isCollapsed={sidebarCollapsed}
        user={user}
        onLoginClick={() => setShowLogin(true)}
        onLogout={handleLogout}
        counts={counts}
        onNewChat={handleNewChat}
        onLoadSession={handleLoadSession}
        activeChatId={activeChatId}
      />

      <div className="main-area">
        {/* Topbar */}
        <div className="topbar">
          <div className="topbar-left">
            <button className="toggle-sidebar-btn" onClick={() => {
              if (typeof window !== 'undefined' && window.innerWidth <= 768) {
                setSidebarOpen(!sidebarOpen);
              } else {
                setSidebarCollapsed(!sidebarCollapsed);
              }
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>
            <span style={{ fontWeight: 600, fontSize: 15, display: sidebarCollapsed || (typeof window !== 'undefined' && window.innerWidth <= 768) ? 'block' : 'none' }}>
              DialforAI
            </span>
          </div>
          <div className="topbar-actions">
            <button className="theme-toggle" onClick={toggle}>
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
          </div>
        </div>

        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {view === 'chat' && <ChatLanding onNavigate={navigate} onChatAction={handleChatAction} user={user} selectedAgent={selectedAgent} setSelectedAgent={setSelectedAgent} sessionId={sessionId} initialMessages={initialMessages} onNewChat={handleNewChat} />}
          {view === 'dashboard' && user && <Dashboard onNavigate={navigate} />}
          {view === 'recruitment' && <RecruitmentAgent onLaunch={() => launchAgent('recruitment')} />}
          {view === 'sales' && <SalesAgent onLaunch={() => launchAgent('sales')} />}
          {view === 'prospect' && <ProspectFinder onLaunch={() => launchAgent('prospect')} />}
          {view === 'history' && <AgentHistory />}
          {view === 'pipeline' && user && <RecruitmentDashboard onLaunchRecruitment={() => launchAgent('recruitment')} />}
          {view === 'growth' && <GrowthAgent user={user} onLaunch={() => launchAgent('growth')} />}

          {/* Guard: dashboard requires login */}
          {view === 'dashboard' && !user && (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16, padding: 40 }}>
              <div style={{ fontSize: 48 }}>🔐</div>
              <div style={{ fontSize: 20, fontWeight: 700 }}>Dashboard requires login</div>
              <div style={{ color: 'var(--text-2)' }}>Sign in to access your recruiter pipeline dashboard.</div>
              <button className="btn btn-primary" onClick={() => setShowLogin(true)}>Sign In →</button>
            </div>
          )}

          {/* Guard: pipeline requires login */}
          {view === 'pipeline' && !user && (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16, padding: 40 }}>
              <div style={{ fontSize: 48 }}>🔐</div>
              <div style={{ fontSize: 20, fontWeight: 700 }}>Recruitment Pipeline requires login</div>
              <div style={{ color: 'var(--text-2)', textAlign: 'center' }}>Sign in to view job campaigns, candidate scores, and live interviews.</div>
              <button className="btn btn-primary" onClick={() => setShowLogin(true)}>Sign In →</button>
            </div>
          )}
        </div>
      </div>

      {showLogin && (
        <LoginModal onClose={() => setShowLogin(false)} onSuccess={handleLoginSuccess} />
      )}
    </div>
  );
}
