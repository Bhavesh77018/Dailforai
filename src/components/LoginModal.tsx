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

  const handleOAuth = async (provider: 'google' | 'azure') => {
    setLoading(true); setError('');
    try {
      const { error: err } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin,
          scopes: provider === 'azure' ? 'email profile openid' : undefined,
        },
      });
      if (err) throw err;
      // Redirect happens automatically — browser leaves the page
    } catch (e: any) {
      setError(e.message || 'OAuth sign-in failed.');
      setLoading(false);
    }
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

        {/* OAuth Divider */}
        <div className="divider">or continue with</div>

        {/* Google OAuth */}
        <button
          onClick={() => handleOAuth('google')}
          disabled={loading}
          style={{
            width: '100%', padding: '10px 16px', borderRadius: 8,
            border: '1px solid var(--border)', background: 'var(--bg-btn)',
            color: 'var(--text-1)', cursor: 'pointer', fontSize: 14, fontWeight: 600,
            fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 10, marginBottom: 10, transition: 'all 0.2s',
          }}
          onMouseOver={e => (e.currentTarget.style.borderColor = 'var(--border-focus)')}
          onMouseOut={e => (e.currentTarget.style.borderColor = 'var(--border)')}
        >
          {/* Google Icon */}
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M23.745 12.27c0-.79-.07-1.54-.19-2.27h-11.3v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"/>
            <path fill="#34A853" d="M12.255 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96h-3.98v3.09C3.515 21.3 7.615 24 12.255 24z"/>
            <path fill="#FBBC05" d="M5.525 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62h-3.98a11.86 11.86 0 000 10.76l3.98-3.09z"/>
            <path fill="#EA4335" d="M12.255 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C18.205 1.19 15.495 0 12.255 0c-4.64 0-8.74 2.7-10.71 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"/>
          </svg>
          Continue with Google
        </button>

        {/* Microsoft OAuth */}
        <button
          onClick={() => handleOAuth('azure')}
          disabled={loading}
          style={{
            width: '100%', padding: '10px 16px', borderRadius: 8,
            border: '1px solid var(--border)', background: 'var(--bg-btn)',
            color: 'var(--text-1)', cursor: 'pointer', fontSize: 14, fontWeight: 600,
            fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 10, marginBottom: 16, transition: 'all 0.2s',
          }}
          onMouseOver={e => (e.currentTarget.style.borderColor = 'var(--border-focus)')}
          onMouseOut={e => (e.currentTarget.style.borderColor = 'var(--border)')}
        >
          {/* Microsoft Icon */}
          <svg width="18" height="18" viewBox="0 0 23 23">
            <rect x="1" y="1" width="10" height="10" fill="#F25022"/>
            <rect x="12" y="1" width="10" height="10" fill="#7FBA00"/>
            <rect x="1" y="12" width="10" height="10" fill="#00A4EF"/>
            <rect x="12" y="12" width="10" height="10" fill="#FFB900"/>
          </svg>
          Continue with Microsoft
        </button>

        <div className="divider">or use email</div>

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
