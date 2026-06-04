'use client';
import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Building2, User, AlertCircle } from 'lucide-react';

interface Props {
  onClose: () => void;
  onSuccess: (user: any) => void;
}

// Personal/free email domains to block for company login
const PERSONAL_DOMAINS = [
  'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com',
  'aol.com', 'live.com', 'msn.com', 'ymail.com', 'protonmail.com',
  'zoho.com', 'mail.com', 'inbox.com', 'gmx.com', 'rediffmail.com',
  'rocketmail.com', 'yandex.com', 'tutanota.com', 'fastmail.com',
];

function isPersonalEmail(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase();
  return PERSONAL_DOMAINS.includes(domain);
}

export default function LoginModal({ onClose, onSuccess }: Props) {
  const [loginType, setLoginType] = useState<'individual' | 'company'>('individual');
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const resetForm = () => {
    setEmail(''); setPassword(''); setName('');
    setCompanyName(''); setError(''); setSuccess('');
  };

  const switchType = (t: 'individual' | 'company') => {
    setLoginType(t); resetForm();
  };

  const switchMode = (m: 'login' | 'signup') => {
    setMode(m); setError(''); setSuccess('');
  };

  const handle = async () => {
    if (!email || !password) { setError('Please fill all required fields.'); return; }

    // Company email validation
    if (loginType === 'company') {
      if (isPersonalEmail(email)) {
        setError('Company login requires a work email address. Personal emails (Gmail, Yahoo, Outlook, etc.) are not allowed.');
        return;
      }
    }

    setLoading(true); setError(''); setSuccess('');
    try {
      if (mode === 'login') {
        const { data, error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) throw err;
        onSuccess(data.user);
      } else {
        const metadata: Record<string, any> = {
          full_name: name,
          account_type: loginType,
        };
        if (loginType === 'company') {
          metadata.company_name = companyName;
          metadata.company_domain = email.split('@')[1];
        }

        const { data, error: err } = await supabase.auth.signUp({
          email, password,
          options: { data: metadata },
        });
        if (err) throw err;
        if (data.user && !data.user.confirmed_at) {
          setSuccess('Check your email to confirm your account!');
        } else {
          onSuccess(data.user);
        }
      }
    } catch (e: any) {
      setError(e.message || 'Authentication failed.');
    }
    setLoading(false);
  };

  const isCompany = loginType === 'company';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box fade-up" onClick={e => e.stopPropagation()} style={{ maxWidth: 440 }}>
        <button className="modal-close" onClick={onClose}>×</button>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: isCompany ? 'linear-gradient(135deg, #10b981, #3b82f6)' : 'var(--grad-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, margin: '0 auto 14px' }}>
            {isCompany ? <Building2 size={24} color="#fff" /> : '🤖'}
          </div>
          <div className="modal-title">
            {mode === 'login' ? 'Welcome back' : isCompany ? 'Company Account' : 'Create Account'}
          </div>
          <div className="modal-subtitle">
            {mode === 'login'
              ? `Sign in to your ${isCompany ? 'company' : 'personal'} account`
              : isCompany ? 'Register your company on DialforAI' : 'Start using AI Agents for free'}
          </div>
        </div>

        {/* Type Toggle */}
        <div style={{ display: 'flex', background: 'var(--bg-btn)', borderRadius: 10, padding: 4, marginBottom: 20, gap: 4 }}>
          {(['individual', 'company'] as const).map(type => (
            <button
              key={type}
              onClick={() => switchType(type)}
              style={{
                flex: 1, padding: '8px 12px', borderRadius: 7, cursor: 'pointer',
                fontWeight: 600, fontSize: 13, fontFamily: 'inherit', transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                background: loginType === type ? 'var(--bg-card)' : 'transparent',
                color: loginType === type ? 'var(--text-1)' : 'var(--text-3)',
                boxShadow: loginType === type ? '0 1px 4px rgba(0,0,0,0.15)' : 'none',
                border: loginType === type ? '1px solid var(--border)' : '1px solid transparent',
              }}
            >
              {type === 'individual' ? <User size={14} /> : <Building2 size={14} />}
              {type === 'individual' ? 'Individual' : 'Company'}
            </button>
          ))}
        </div>

        {/* Company notice */}
        {isCompany && (
          <div style={{ display: 'flex', gap: 8, padding: '10px 12px', borderRadius: 8, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', marginBottom: 16 }}>
            <AlertCircle size={14} style={{ color: '#10b981', flexShrink: 0, marginTop: 1 }} />
            <p style={{ fontSize: 12, color: '#10b981', lineHeight: 1.5, margin: 0 }}>
              Company accounts require a <strong>work email</strong> (not Gmail, Yahoo, or other personal providers). Growth Intelligence features are exclusive to company accounts.
            </p>
          </div>
        )}

        {/* Alerts */}
        {error && (
          <div style={{ background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.2)', color: '#f87171', borderRadius: 8, padding: '10px 14px', fontSize: 13, marginBottom: 16 }}>
            {error}
          </div>
        )}
        {success && (
          <div style={{ background: 'rgba(16,185,129,.1)', border: '1px solid rgba(16,185,129,.2)', color: '#34d399', borderRadius: 8, padding: '10px 14px', fontSize: 13, marginBottom: 16 }}>
            {success}
          </div>
        )}

        {/* Form Fields */}
        {mode === 'signup' && (
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input className="form-input" placeholder="Jane Doe" value={name} onChange={e => setName(e.target.value)} />
          </div>
        )}

        {mode === 'signup' && isCompany && (
          <div className="form-group">
            <label className="form-label">Company Name *</label>
            <input className="form-input" placeholder="e.g. Infinity STS" value={companyName} onChange={e => setCompanyName(e.target.value)} />
          </div>
        )}

        <div className="form-group">
          <label className="form-label">
            {isCompany ? 'Work Email Address *' : 'Email'}
          </label>
          <input
            className="form-input"
            type="email"
            placeholder={isCompany ? 'you@yourcompany.com' : 'you@example.com'}
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          {isCompany && mode === 'signup' && (
            <p style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4 }}>
              Your company domain will be derived from this email.
            </p>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            className="form-input"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handle()}
          />
        </div>

        <button
          className="btn btn-primary"
          style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: 15, marginBottom: 14 }}
          onClick={handle}
          disabled={loading}
        >
          {loading ? <span className="spinner" /> : mode === 'login' ? '→ Sign In' : isCompany ? '→ Register Company' : '→ Create Account'}
        </button>

        <div className="divider">or</div>

        <div style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-2)' }}>
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <span style={{ color: '#a78bfa', cursor: 'pointer', fontWeight: 600 }} onClick={() => switchMode(mode === 'login' ? 'signup' : 'login')}>
            {mode === 'login' ? 'Sign up' : 'Sign in'}
          </span>
        </div>
      </div>
    </div>
  );
}
