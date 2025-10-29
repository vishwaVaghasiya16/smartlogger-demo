'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

type Project = {
  _id: string;
  name: string;
  ownerEmail: string;
  plan: string;
  createdAt: string;
};

export default function ProjectsPage() {
  const [list, setList] = useState<Project[]>([]);
  const [name, setName] = useState('My Demo Project');
  const [email, setEmail] = useState('owner@example.com');
  const [newKey, setNewKey] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);

  async function refresh() {
    const res = await axios.get('/api/projects');
    setList(res.data.items || []);
  }
  useEffect(() => { refresh(); }, []);

  async function createProject() {
    const res = await axios.post('/api/projects', { name, ownerEmail: email });
    setNewKey(res.data.apiKey);
    setNote(res.data.note);
    await refresh();
  }

  return (
    <div className="grid">
      <div className="card">
        <h2>Create Project</h2>
        <label className="label">Project Name</label>
        <input value={name} onChange={e=>setName(e.target.value)} />
        <label className="label">Owner Email</label>
        <input value={email} onChange={e=>setEmail(e.target.value)} />
        <div style={{ height: 8 }} />
        <button onClick={createProject}>Create</button>
        {newKey && (
          <div style={{ marginTop: 12 }}>
            <div className="small">API Key (copy & store securely, shown once):</div>
            <code style={{ fontSize: 12 }}>{newKey}</code>
            {note && <div className="small" style={{ marginTop: 6 }}>{note}</div>}
          </div>
        )}
      </div>

      <div className="card">
        <h2>Projects</h2>
        <table className="table">
          <thead><tr><th>Name</th><th>Owner</th><th>Plan</th><th>Created</th></tr></thead>
          <tbody>
            {list.map(p=>(
              <tr key={p._id}>
                <td>{p.name}</td>
                <td className="small">{p.ownerEmail}</td>
                <td><span className="badge">{p.plan}</span></td>
                <td className="small">{new Date(p.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
