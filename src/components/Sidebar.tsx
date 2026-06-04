'use client';
import React, { useState, useEffect } from 'react';
import { Bot, MessageSquare, LayoutDashboard, Search, Users, Mail, Activity, LogOut, Hexagon, GitBranch, Clock, ChevronRight, Trash2, Plus, TrendingUp, Briefcase } from 'lucide-react';

type View = 'chat' | 'recruitment' | 'sales' | 'prospect' | 'dashboard' | 'history' | 'pipeline' | 'growth' | 'jobs';

export interface ChatSession {
  id: string;
  title: string;
  agent: string;
  createdAt: string;
  messages: any[];
}

interface Props {
  activeView: View;
  onNavigate: (v: View) => void;
  isOpen: boolean;
  isCollapsed: boolean;
  user: any | null;
  onLoginClick: () => void;
  onLogout: () => void;
  counts: { prospects: number; runs: number; emails: number };
  onNewChat: () => void;
  onLoadSession: (session: ChatSession) => void;
  activeChatId: string | null;
}

function getStoredSessions(userId: string): ChatSession[] {
  try {
    const raw = localStorage.getItem(`sessions_${userId}`);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export default function Sidebar({ activeView, onNavigate, isOpen, isCollapsed, user, onLoginClick, onLogout, counts, onNewChat, onLoadSession, activeChatId }: Props) {
  const go = (v: View) => () => onNavigate(v);
  const [sessions, setSessions] = useState<ChatSession[]>([]);

  // Reload sessions whenever the sidebar opens or user changes
  useEffect(() => {
    if (user?.id) {
      setSessions(getStoredSessions(user.id));
    } else {
      setSessions([]);
    }
  }, [user, activeView, activeChatId]);

  // Also poll for new sessions every 2s when chat is active
  useEffect(() => {
    if (!user?.id) return;
    const t = setInterval(() => {
      setSessions(getStoredSessions(user.id));
    }, 2000);
    return () => clearInterval(t);
  }, [user]);

  const deleteSession = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    if (!user?.id) return;
    const updated = sessions.filter(s => s.id !== sessionId);
    localStorage.setItem(`sessions_${user.id}`, JSON.stringify(updated));
    setSessions(updated);
  };

  const agentColor = (agent: string) => {
    if (agent === 'recruitment') return 'var(--color-recruit)';
    if (agent === 'sales') return 'var(--color-sales)';
    if (agent === 'growth') return '#10b981';
    return 'var(--color-prospect)';
  };

  const agentLabel = (agent: string) => {
    if (agent === 'recruitment') return 'Recruit';
    if (agent === 'sales') return 'Sales';
    if (agent === 'growth') return 'Growth';
    return 'Prospect';
  };

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`} style={{ width: isCollapsed ? 0 : undefined, borderRightWidth: isCollapsed ? 0 : 1 }}>
      <div className="sidebar-top">
        <div className="brand">
          <Hexagon />
          <div className="brand-name">DialforAI</div>
        </div>
        <button className="new-chat-btn" onClick={onNewChat}>
          <Plus size={15} />
          <span>New Chat</span>
        </button>
      </div>

      <nav className="sidebar-nav" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        <div className="nav-label">WORKSPACE</div>
        <button className={`nav-item ${activeView === 'chat' && !activeChatId ? 'active' : ''}`} onClick={go('chat')}>
          <Bot size={16} /> Chat
        </button>

        <button className={`nav-item ${activeView === 'jobs' ? 'active' : ''}`} onClick={go('jobs')}>
          <Briefcase size={16} /> Find Jobs
          <span className="nav-badge" style={{ color: '#3b82f6', borderColor: 'rgba(59,130,246,0.2)', background: 'rgba(59,130,246,0.08)', marginLeft: 'auto' }}>New</span>
        </button>

        {user && (
          <button className={`nav-item ${activeView === 'dashboard' ? 'active' : ''}`} onClick={go('dashboard')}>
            <LayoutDashboard size={16} /> Dashboard
          </button>
        )}

        {/* Chat History */}
        {user && sessions.length > 0 && (
          <>
            <div className="nav-label" style={{ marginTop: 8 }}>RECENT CHATS</div>
            {sessions.slice(0, 12).map(session => (
              <button
                key={session.id}
                className={`nav-item ${activeChatId === session.id ? 'active' : ''}`}
                onClick={() => { onLoadSession(session); onNavigate('chat'); }}
                style={{ paddingRight: 4, gap: 8 }}
              >
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: agentColor(session.agent), flexShrink: 0 }} />
                <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 13 }}>
                  {session.title}
                </span>
                <div
                  role="button"
                  tabIndex={0}
                  onClick={(e) => deleteSession(e, session.id)}
                  onKeyDown={(e) => e.key === 'Enter' && deleteSession(e as any, session.id)}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-3)', padding: '2px 4px', borderRadius: 4, opacity: 0, flexShrink: 0, display: 'flex', alignItems: 'center' }}
                  className="session-delete-btn"
                >
                  <Trash2 size={12} />
                </div>
              </button>
            ))}
          </>
        )}

        <div className="nav-label" style={{ marginTop: 8 }}>AGENTS</div>

        <button className={`nav-item ${activeView === 'recruitment' ? 'active' : ''}`} onClick={go('recruitment')}>
          <Users size={16} /> Recruitment Agent
          <span className="nav-badge" style={{ color: 'var(--color-recruit)', borderColor: 'rgba(129,140,248,0.2)' }}>Live</span>
        </button>

        <button className={`nav-item ${activeView === 'sales' ? 'active' : ''}`} onClick={go('sales')}>
          <Mail size={16} /> Sales Agent
          {counts.emails > 0 && <span className="nav-badge" style={{ color: 'var(--color-sales)', borderColor: 'rgba(251,191,36,0.2)' }}>{counts.emails}</span>}
        </button>

        <button className={`nav-item ${activeView === 'prospect' ? 'active' : ''}`} onClick={go('prospect')}>
          <Search size={16} /> Prospect Finder
        </button>

        <button className={`nav-item ${activeView === 'growth' ? 'active' : ''}`} onClick={go('growth')} style={{ position: 'relative' }}>
          <TrendingUp size={16} />
          Growth Intelligence
          <span className="nav-badge" style={{ color: '#10b981', borderColor: 'rgba(16,185,129,0.2)', background: 'rgba(16,185,129,0.08)' }}>New</span>
        </button>

        <div className="nav-label" style={{ marginTop: 8 }}>DATA</div>
        <button className={`nav-item ${activeView === 'history' ? 'active' : ''}`} onClick={go('history')}>
          <Activity size={16} /> Activity Log
          {counts.runs > 0 && <span className="nav-badge" style={{ color: 'var(--color-prospect)', borderColor: 'rgba(52,211,153,0.2)' }}>{counts.runs}</span>}
        </button>

        <button className={`nav-item ${activeView === 'pipeline' ? 'active' : ''}`} onClick={go('pipeline')}>
          <GitBranch size={16} /> Recruitment Pipeline
        </button>
      </nav>

      <div className="sidebar-footer">
        {user ? (
          <div>
            <div className="user-row">
              <div className="user-avatar">{(user.user_metadata?.full_name || user.email || 'U')[0].toUpperCase()}</div>
              <div className="user-info">
                <div className="user-name">{user.user_metadata?.full_name || 'User'}</div>
                <div className="user-email">{user.email}</div>
              </div>
            </div>
            <button className="nav-item" style={{ marginTop: 4, color: 'var(--text-3)' }} onClick={onLogout}>
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        ) : (
          <button className="btn btn-outline" style={{ width: '100%', marginBottom: 8 }} onClick={onLoginClick}>
            Sign In
          </button>
        )}
        <a href="/about" className="nav-item" style={{ color: 'var(--text-3)', textDecoration: 'none' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0, opacity: 0.7 }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
          Know More
        </a>
      </div>
    </aside>
  );
}
