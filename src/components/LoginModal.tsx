'use client';
import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Props {
  onClose: () => void;
  onSuccess: (user: any) => void;
}

export default function LoginModal({ onClose, onSuccess }: Props) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handle = async () => {
    if (!email || !password) { setError('Please fill all fields.'); return; }
    setLoading(true); setError(''); setSuccess('');
    try {
      if (mode === 'login') {
        const { data, error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) throw err;
        onSuccess(data.user);
      } else {
        const { data, error: err } = await supabase.auth.signUp({
          email, password,
          options: { data: { full_name: name } },
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

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box fade-up" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: 'var(--grad-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, margin: '0 auto 14px' }}>🤖</div>
          <div className="modal-title">{mode === 'login' ? 'Welcome back' : 'Create account'}</div>
          <div className="modal-subtitle">{mode === 'login' ? 'Sign in to access your dashboard' : 'Start using AI Agents for free'}</div>
        </div>

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

        {mode === 'signup' && (
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input className="form-input" placeholder="Jane Doe" value={name} onChange={e => setName(e.target.value)} />
          </div>
        )}
        <div className="form-group">
          <label className="form-label">Email</label>
          <input className="form-input" type="email" placeholder="you@company.com" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input className="form-input" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handle()} />
        </div>

        <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: 15, marginBottom: 14 }} onClick={handle} disabled={loading}>
          {loading ? <span className="spinner" /> : mode === 'login' ? '→ Sign In' : '→ Create Account'}
        </button>

        <div className="divider">or</div>

        <div style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-2)' }}>
          {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
          <span style={{ color: '#a78bfa', cursor: 'pointer', fontWeight: 600 }} onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); }}>
            {mode === 'login' ? 'Sign up' : 'Sign in'}
          </span>
        </div>
      </div>
    </div>
  );
}
