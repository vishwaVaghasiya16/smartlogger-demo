'use client';
import React, { useState } from 'react';
import axios from 'axios';

export default function TesterPage() {
  const [apiKey, setApiKey] = useState('');
  const [message, setMessage] = useState('DB connection failed');
  const [level, setLevel] = useState<'error'|'warn'|'info'|'debug'>('error');
  const [source, setSource] = useState('auth-svc');
  const [tags, setTags] = useState('db,startup');
  const [resp, setResp] = useState<any>(null);
  const [err, setErr] = useState<string | null>(null);

  async function sendLog() {
    setErr(null);
    try {
      const res = await axios.post('/api/logs/ingest', {
        events: [{
          level,
          message,
          source,
          tags: tags.split(',').map(s=>s.trim()).filter(Boolean)
        }]
      }, { headers: { 'x-api-key': apiKey } });
      setResp(res.data);
    } catch (e:any) {
      setErr(e?.response?.data?.message || 'Failed');
    }
  }

  return (
    <div className="grid">
      <div className="card">
        <h2>Send a Test Log</h2>
        <label className="label">API Key</label>
        <input placeholder="slk_live_xxx_yyy" value={apiKey} onChange={e=>setApiKey(e.target.value)} />
        <div className="row">
          <div style={{ flex: 1 }}>
            <label className="label">Message</label>
            <input value={message} onChange={e=>setMessage(e.target.value)} />
          </div>
          <div>
            <label className="label">Level</label>
            <select value={level} onChange={e=>setLevel(e.target.value as any)}>
              <option value="error">error</option>
              <option value="warn">warn</option>
              <option value="info">info</option>
              <option value="debug">debug</option>
            </select>
          </div>
        </div>
        <div className="row">
          <div style={{ flex: 1 }}>
            <label className="label">Source</label>
            <input value={source} onChange={e=>setSource(e.target.value)} />
          </div>
          <div style={{ flex: 1 }}>
            <label className="label">Tags (comma)</label>
            <input value={tags} onChange={e=>setTags(e.target.value)} />
          </div>
        </div>
        <div style={{ height: 8 }} />
        <button onClick={sendLog}>Send</button>
        {err && <p style={{ color: "#fca5a5" }}>{err}</p>}
      </div>

      <div className="card">
        <h2>Response</h2>
        <pre className="small">{resp ? JSON.stringify(resp, null, 2) : "No response yet."}</pre>
      </div>
    </div>
  );
}
