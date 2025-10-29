'use client';
import React, { useState } from 'react';
import axios from 'axios';

export default function Page() {
  const [apiKey, setApiKey] = useState('');
  const [stats, setStats] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  async function fetchStats() {
    setError(null);
    try {
      const res = await axios.get('/api/stats', {
        headers: { 'x-api-key': apiKey }
      });
      setStats(res.data);
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to fetch stats');
    }
  }

  return (
    <div className="grid">
      <div className="card">
        <h2>Dashboard</h2>
        <p className="small">Paste an API key for a project to see quick stats.</p>
        <label className="label">API Key</label>
        <input placeholder="slk_live_xxxx_yyyy" value={apiKey} onChange={e=>setApiKey(e.target.value)} />
        <div style={{ height: 8 }} />
        <button onClick={fetchStats}>Fetch Stats</button>
        {error && <p style={{ color: "#fca5a5" }}>{error}</p>}
      </div>

      <div className="card">
        <h2>Results</h2>
        {!stats ? <p className="small">No data yet.</p> : (
          <div>
            <div className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
              <span className="badge">errors: {stats.errorCount}</span>
              <span className="badge">warnings: {stats.warnCount}</span>
              <span className="badge">info: {stats.infoCount}</span>
              <span className="badge">debug: {stats.debugCount}</span>
            </div>
            <div style={{ height: 12 }} />
            <h3 style={{ fontSize: 14 }}>Top Messages</h3>
            <ul>
              {(stats.topMessages || []).map((x:any, i:number)=>(
                <li key={i} className="small">{x.message} — {x.count}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
