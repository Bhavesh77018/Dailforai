'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Hexagon, Mail, MessageSquare, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-main)', color: 'var(--text-1)', fontFamily: 'var(--font-sans)', display: 'flex', flexDirection: 'column' }}>
      
      {/* Navigation */}
      <nav style={{ padding: '24px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, background: 'var(--bg-main)', zIndex: 100 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: 'var(--text-1)' }}>
          <Hexagon />
          <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em' }}>DailforAI</span>
        </Link>
        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <Link href="/about" style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-2)', textDecoration: 'none' }}>About</Link>
          <Link href="/contact" style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-1)', textDecoration: 'none' }}>Contact</Link>
          <Link href="/" className="btn btn-primary" style={{ padding: '8px 16px', borderRadius: 8, textDecoration: 'none', fontSize: 14 }}>Launch App</Link>
        </div>
      </nav>

      {/* Main Content */}
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 20px' }}>
        <div style={{ maxWidth: 1000, width: '100%', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 64, alignItems: 'center' }}>
          
          {/* Left: Copy */}
          <div className="fade-in">
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: 'var(--bg-btn)', border: '1px solid var(--border-2)', borderRadius: 999, fontSize: 13, fontWeight: 600, color: 'var(--text-1)', marginBottom: 24 }}>
              <MessageSquare size={16} style={{ color: '#3b82f6' }} /> Get in Touch
            </div>
            
            <h1 style={{ fontSize: 'clamp(40px, 5vw, 56px)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: 24 }}>
              Let's build your <br/>
              <span style={{ color: '#3b82f6' }}>Custom AI Agent.</span>
            </h1>
            
            <p style={{ fontSize: 18, color: 'var(--text-2)', lineHeight: 1.6, marginBottom: 40 }}>
              Need modifications, custom enterprise integrations, or have questions about how DailforAI can scale your workflow? Our engineering team is ready to help.
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--bg-card)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-2)' }}>
                  <Mail size={20} />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-3)', marginBottom: 4 }}>EMAIL US</div>
                  <div style={{ fontSize: 16, fontWeight: 500 }}>hello@dailforai.com</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div className="slide-up" style={{ background: 'var(--bg-card)', padding: 40, borderRadius: 24, border: '1px solid var(--border)', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24, color: '#10b981' }}>
                  <CheckCircle2 size={64} />
                </div>
                <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>Message Sent</h2>
                <p style={{ color: 'var(--text-2)', lineHeight: 1.6, marginBottom: 32 }}>We've received your request and our team will get back to you within 24 hours.</p>
                <button className="btn btn-primary" onClick={() => setSubmitted(false)} style={{ padding: '12px 24px', borderRadius: 8 }}>Send another message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <h3 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Send a Message</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)' }}>Full Name</label>
                  <input required type="text" placeholder="John Doe" style={{ width: '100%', padding: '12px 16px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-input)', color: 'var(--text-1)', fontSize: 15, outline: 'none' }} />
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)' }}>Work Email</label>
                  <input required type="email" placeholder="john@company.com" style={{ width: '100%', padding: '12px 16px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-input)', color: 'var(--text-1)', fontSize: 15, outline: 'none' }} />
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)' }}>How can we help?</label>
                  <textarea required rows={4} placeholder="Tell us about your custom agent needs..." style={{ width: '100%', padding: '12px 16px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-input)', color: 'var(--text-1)', fontSize: 15, outline: 'none', resize: 'vertical' }} />
                </div>
                
                <button type="submit" className="btn btn-primary" style={{ padding: '16px', borderRadius: 8, fontSize: 16, fontWeight: 600, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 8 }}>
                  Send Message <ArrowRight size={18} />
                </button>
              </form>
            )}
          </div>
          
        </div>
      </main>

      {/* Footer */}
      <footer style={{ padding: '40px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-3)', fontSize: 14 }}>
        <div>&copy; 2026 DailforAI. All rights reserved.</div>
        <div style={{ display: 'flex', gap: 24 }}>
          <Link href="/contact" style={{ color: 'var(--text-3)', textDecoration: 'none' }}>Contact Us</Link>
          <Link href="/about" style={{ color: 'var(--text-3)', textDecoration: 'none' }}>About</Link>
        </div>
      </footer>
    </div>
  );
}
