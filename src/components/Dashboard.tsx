'use client';
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Users, Mail, Activity, Target, ArrowRight, Search } from 'lucide-react';

interface Props {
  onNavigate: (v: string) => void;
}

export default function Dashboard({ onNavigate }: Props) {
  const [stats, setStats] = useState({ prospects: 0, emails: 0, runs: 0, success: 0 });
  const [recent, setRecent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [p, e, r, recentRuns] = await Promise.all([
          supabase.from('prospects').select('id', { count: 'exact', head: true }),
          supabase.from('sales_outreach').select('id', { count: 'exact', head: true }),
          supabase.from('agent_runs').select('id', { count: 'exact', head: true }),
          supabase.from('agent_runs').select('*').order('created_at', { ascending: false }).limit(10)
        ]);

        if (recentRuns.error) console.error('[Dashboard] agent_runs error:', JSON.stringify(recentRuns.error));
        
        const totalRuns = r.count || 0;
        let successRate = 0;
        if (totalRuns > 0) {
          const { count: successRuns } = await supabase.from('agent_runs').select('id', { count: 'exact', head: true }).eq('status', 'completed');
          successRate = Math.round(((successRuns || 0) / totalRuns) * 100);
        }

        setStats({
          prospects: p.count || 0,
          emails: e.count || 0,
          runs: totalRuns,
          success: successRate
        });
        setRecent(recentRuns.data || []);
        console.log('[Dashboard] Loaded', recentRuns.data?.length, 'recent runs');
      } catch (err) {
        console.error('[Dashboard] load error:', err);
      }
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return <div className="dashboard" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading dashboard...</div>;
  }

  return (
    <div className="dashboard fade-in">
      <div className="dash-header">
        <h1 className="dash-title">Workspace Overview</h1>
        <p className="dash-subtitle">Real-time metrics and recent agent activity across your platform.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-label">Total Prospects</div>
            <Users className="stat-icon" />
          </div>
          <div className="stat-value">{stats.prospects}</div>
        </div>
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-label">Sales Emails</div>
            <Mail className="stat-icon" />
          </div>
          <div className="stat-value">{stats.emails}</div>
        </div>
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-label">Agent Runs</div>
            <Activity className="stat-icon" />
          </div>
          <div className="stat-value">{stats.runs}</div>
        </div>
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-label">Success Rate</div>
            <Target className="stat-icon" />
          </div>
          <div className="stat-value">{stats.success}%</div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600 }}>Recent Agent Runs</h2>
        <button className="btn btn-outline" style={{ padding: '6px 12px', fontSize: 12 }} onClick={() => onNavigate('history')}>
          View All <ArrowRight size={14} />
        </button>
      </div>

      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Agent</th>
              <th>Status</th>
              <th>Input Data</th>
              <th>Time</th>
              <th>Duration</th>
            </tr>
          </thead>
          <tbody>
            {recent.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-3)', padding: '32px' }}>No runs yet. Use the chat to launch an agent.</td></tr>
            ) : recent.map(r => (
              <tr key={r.id}>
                <td style={{ textTransform: 'capitalize', fontWeight: 500 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {r.agent_type === 'recruitment' ? <Users size={14} style={{ color: 'var(--color-recruit)' }}/> : 
                     r.agent_type === 'sales' ? <Mail size={14} style={{ color: 'var(--color-sales)' }}/> : 
                     <Search size={14} style={{ color: 'var(--color-prospect)' }}/>}
                    {r.agent_type}
                  </div>
                </td>
                <td>
                  <span className={`status-badge status-${r.status}`}>
                    {r.status === 'completed' && <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor' }} />}
                    {r.status === 'running' && <div className="typing-dot" style={{ background: 'currentColor', margin: 0, width: 6, height: 6 }} />}
                    {r.status}
                  </span>
                </td>
                <td style={{ color: 'var(--text-2)', maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {r.input_data?.url || r.input_data?.message || r.input_data?.query || '-'}
                  {r.output_data?.score && (
                    <span style={{ marginLeft: 8, padding: '2px 6px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: 4, fontSize: 11, fontWeight: 600 }}>
                      Score: {r.output_data.score}/100
                    </span>
                  )}
                </td>
                <td style={{ color: 'var(--text-2)' }}>{new Date(r.created_at).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</td>
                <td style={{ color: 'var(--text-2)', fontFamily: 'monospace' }}>
                  {r.duration_ms ? `${(r.duration_ms / 1000).toFixed(1)}s` : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
