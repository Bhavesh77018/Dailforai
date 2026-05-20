'use client';
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Activity, Search, Users, Mail, Clock, Database, ArrowRight, X } from 'lucide-react';

export default function AgentHistory() {
  const [runs, setRuns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [selectedRun, setSelectedRun] = useState<any | null>(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    let q = supabase.from('agent_runs').select('*').order('created_at', { ascending: false });
    const { data } = await q;
    setRuns(data || []);
    setLoading(false);
  }

  const filtered = filter === 'all' ? runs : runs.filter(r => r.agent_type === filter);

  return (
    <div className="dashboard fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%', paddingBottom: 0 }}>
      <div className="dash-header" style={{ flexShrink: 0 }}>
        <h1 className="dash-title">Activity Log</h1>
        <p className="dash-subtitle">Complete history of all automated AI executions and their inputs/outputs.</p>
        
        <div style={{ display: 'flex', gap: 8, marginTop: 24 }}>
          {['all', 'recruitment', 'sales', 'prospect'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '6px 12px', borderRadius: 6, fontSize: 13, fontWeight: 500, textTransform: 'capitalize',
                background: filter === f ? 'var(--bg-btn)' : 'transparent',
                border: `1px solid ${filter === f ? 'var(--border-focus)' : 'var(--border)'}`,
                color: filter === f ? 'var(--text-1)' : 'var(--text-3)', cursor: 'pointer'
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 24, flex: 1, minHeight: 0, paddingBottom: 24 }}>
        {/* Table View */}
        <div className="data-table-container" style={{ flex: selectedRun ? '1' : '1', overflowY: 'auto' }}>
          <table className="data-table">
            <thead style={{ position: 'sticky', top: 0, background: 'var(--bg-card)', zIndex: 1 }}>
              <tr>
                <th>Agent</th>
                <th>Status</th>
                <th>Time</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} style={{ textAlign: 'center', padding: '40px' }}><div className="typing-dots" style={{ justifyContent: 'center' }}><div className="typing-dot"/><div className="typing-dot"/><div className="typing-dot"/></div></td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={4} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-3)' }}>No activity found.</td></tr>
              ) : filtered.map(r => (
                <tr key={r.id} onClick={() => setSelectedRun(r)} style={{ cursor: 'pointer', background: selectedRun?.id === r.id ? 'var(--bg-btn)' : '' }}>
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
                  <td style={{ color: 'var(--text-2)' }}>{new Date(r.created_at).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</td>
                  <td style={{ color: 'var(--text-2)', fontFamily: 'monospace' }}>
                    {r.duration_ms ? `${(r.duration_ms / 1000).toFixed(1)}s` : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Details Panel */}
        {selectedRun && (
          <div style={{ width: 400, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', display: 'flex', flexDirection: 'column', overflow: 'hidden', animation: 'fadeIn 0.2s ease-out' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: 15, fontWeight: 600 }}>Execution Details</h3>
              <button onClick={() => setSelectedRun(null)} style={{ background: 'transparent', border: 'none', color: 'var(--text-3)', cursor: 'pointer' }}><X size={16} /></button>
            </div>
            
            <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
              <div style={{ marginBottom: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 600, marginBottom: 4 }}>AGENT</div>
                  <div style={{ textTransform: 'capitalize', fontWeight: 500 }}>{selectedRun.agent_type}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 600, marginBottom: 4 }}>STATUS</div>
                  <div className={`status-badge status-${selectedRun.status}`} style={{ margin: 0 }}>{selectedRun.status}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 600, marginBottom: 4 }}>DURATION</div>
                  <div style={{ fontFamily: 'monospace' }}>{selectedRun.duration_ms ? `${(selectedRun.duration_ms / 1000).toFixed(1)}s` : '-'}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 600, marginBottom: 4 }}>COMPLETED</div>
                  <div>{selectedRun.completed_at ? new Date(selectedRun.completed_at).toLocaleTimeString() : '-'}</div>
                </div>
              </div>

              {selectedRun.error_message && (
                <div style={{ padding: 12, background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: 6, color: '#ef4444', marginBottom: 24, fontSize: 13 }}>
                  <strong>Error:</strong> {selectedRun.error_message}
                </div>
              )}

              {/* Custom Rendering for Candidate Interviews */}
              {selectedRun.input_data?.message?.includes('New Candidate Interview') ? (
                <div>
                  <div style={{ marginBottom: 24, padding: 16, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                      <div>
                        <div style={{ fontSize: 13, color: 'var(--text-3)', fontWeight: 600 }}>CANDIDATE EMAIL</div>
                        <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-1)' }}>{selectedRun.output_data?.candidate}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 13, color: 'var(--text-3)', fontWeight: 600 }}>FINAL SCORE</div>
                        <div style={{ fontSize: 24, fontWeight: 700, color: '#10b981' }}>{selectedRun.output_data?.score}<span style={{ fontSize: 14, color: 'var(--text-3)' }}>/100</span></div>
                      </div>
                    </div>
                    {selectedRun.output_data?.warnings > 0 ? (
                      <div style={{ padding: 12, background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: 8, fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Activity size={16} /> Candidate triggered {selectedRun.output_data.warnings} tab-switch/paste warnings!
                      </div>
                    ) : (
                      <div style={{ padding: 12, background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: 8, fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Activity size={16} /> No suspicious activity detected.
                      </div>
                    )}
                  </div>

                  <div style={{ fontSize: 13, color: 'var(--text-3)', fontWeight: 600, marginBottom: 12 }}>FULL INTERVIEW TRANSCRIPT</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 16, background: 'var(--bg-main)', borderRadius: 12, border: '1px solid var(--border)' }}>
                    {selectedRun.output_data?.transcript?.map((m: any, i: number) => (
                      <div key={i} style={{ display: 'flex', gap: 12, flexDirection: m.role === 'user' ? 'row-reverse' : 'row' }}>
                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: m.role === 'user' ? 'var(--bg-btn)' : '#4f46e5', color: m.role === 'user' ? 'var(--text-1)' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 12, fontWeight: 600 }}>
                          {m.role === 'user' ? 'C' : 'AI'}
                        </div>
                        <div style={{ background: m.role === 'user' ? 'var(--bg-btn)' : 'var(--bg-card)', border: m.role === 'user' ? 'none' : '1px solid var(--border)', color: 'var(--text-1)', padding: '10px 14px', borderRadius: 8, maxWidth: '85%', fontSize: 14, lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                          {m.content}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  <div style={{ marginBottom: 24 }}>
                    <div style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 600, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}><Database size={12}/> INPUT DATA</div>
                    <pre style={{ background: 'var(--bg-input)', padding: 12, borderRadius: 6, fontSize: 12, overflowX: 'auto', border: '1px solid var(--border)', color: 'var(--text-2)', whiteSpace: 'pre-wrap' }}>
                      {JSON.stringify(selectedRun.input_data, null, 2)}
                    </pre>
                  </div>

                  {selectedRun.output_data && (
                    <div>
                      <div style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 600, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}><Database size={12}/> OUTPUT DATA</div>
                      <pre style={{ background: 'var(--bg-input)', padding: 12, borderRadius: 6, fontSize: 12, overflowX: 'auto', border: '1px solid var(--border)', color: 'var(--text-2)', whiteSpace: 'pre-wrap' }}>
                        {JSON.stringify(selectedRun.output_data, null, 2)}
                      </pre>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
