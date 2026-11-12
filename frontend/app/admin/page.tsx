'use client';
import { useEffect, useState } from 'react';
import { API } from '@/lib/api';

const call = async (p: string, o: RequestInit = {}) => {
  const r = await fetch(API + p, { credentials: 'include', ...o, headers: { ...(o.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }), ...(o.headers || {}) } });
  const j = await r.json(); if (!j.success) throw new Error(j.message); return j.data;
};
const T: Record<string, any> = {
  projects: { title: '', short: '', categories: [], tech: [], thumbnail: '', screenshots: [], overview: '', problem: '', solution: '', features: [], architecture: '', challenges: '', contribution: '', liveUrl: '', githubUrl: '', featured: false, published: true, order: 0 },
  skills: { name: '', category: '', order: 0, visible: true },
  experience: { company: '', role: '', type: '', mode: '', duration: '', startDate: '', description: [], tech: [], achievements: [], logo: '', order: 0 },
  education: { institution: '', degree: '', department: '', startYear: '', endYear: '', achievements: [], order: 0 },
  certifications: { title: '', issuer: '', date: '', image: '', url: '', order: 0 },
  profile: { fullName: '', title: '', intro: '', bio: '', summary: '', objectives: '', location: '', email: '', phone: '', image: '', github: '', linkedin: '', available: true },
  settings: { siteTitle: '', description: '', logo: '', favicon: '', accent: '#2563eb', footer: '', siteUrl: '' },
};
const single = ['profile', 'settings'];
const tabs = ['dashboard', 'profile', 'projects', 'skills', 'experience', 'education', 'certifications', 'resume', 'messages', 'settings'];
const long = /overview|problem|solution|architecture|challenges|contribution|bio|summary|intro|objectives|description$/;

function Form({ res, init, onSaved, onCancel }: any) {
  const [v, setV] = useState<any>({ ...T[res], ...init }); const [busy, setBusy] = useState(false); const [err, setErr] = useState('');
  const set = (k: string, x: any) => setV((o: any) => ({ ...o, [k]: x }));
  const up = async (k: string, f?: File) => { if (!f) return; const fd = new FormData(); fd.append('file', f);
    try { set(k, (await call('/upload', { method: 'POST', body: fd })).url); } catch (e: any) { setErr(e.message); } };
  async function save(e: React.FormEvent) { e.preventDefault(); setBusy(true); setErr('');
    try { const single_ = single.includes(res); await call(`/${res}${!single_ && v._id ? '/' + v._id : ''}`, { method: single_ || v._id ? 'PUT' : 'POST', body: JSON.stringify(v) }); onSaved(); }
    catch (e: any) { setErr(e.message); } setBusy(false); }
  return (<form onSubmit={save} className="card grid gap-3 p-4 sm:grid-cols-2">
    {Object.keys(T[res]).map(k => { const d = T[res][k]; return (<label key={k} className={`text-sm ${long.test(k) || Array.isArray(d) ? 'sm:col-span-2' : ''}`}>
      <span className="text-zinc-500">{k}{Array.isArray(d) && ' (comma separated)'}</span>
      {typeof d === 'boolean' ? <input type="checkbox" className="ml-2" checked={!!v[k]} onChange={e => set(k, e.target.checked)} />
        : Array.isArray(d) ? <input className="input mt-1" value={(v[k] || []).join(', ')} onChange={e => set(k, e.target.value.split(',').map(x => x.trim()).filter(Boolean))} />
        : long.test(k) ? <textarea rows={3} className="input mt-1" value={v[k] || ''} onChange={e => set(k, e.target.value)} />
        : <input type={typeof d === 'number' ? 'number' : 'text'} className="input mt-1" value={v[k] ?? ''} onChange={e => set(k, typeof d === 'number' ? Number(e.target.value) : e.target.value)} />}
      {/image|thumbnail|logo|favicon/.test(k) && <input type="file" accept="image/jpeg,image/png,image/webp" className="mt-1 text-xs" onChange={e => up(k, e.target.files?.[0])} />}</label>); })}
    <div className="flex items-center gap-2 sm:col-span-2"><button className="btn-primary" disabled={busy}>{busy ? 'Saving...' : 'Save changes'}</button>
      {onCancel && <button type="button" className="btn-ghost" onClick={onCancel}>Cancel</button>}{err && <span className="text-sm text-red-600">{err}</span>}</div></form>);
}

function List({ res }: { res: string }) {
  const [items, setItems] = useState<any[]>([]); const [edit, setEdit] = useState<any>(null); const [error, setError] = useState(''); const [loading, setLoading] = useState(true);
  const load = () => { setLoading(true); setError(''); return call(`/${res}?all=1`).then(setItems).catch((e: any) => setError(e.message || 'Could not load records')).finally(() => setLoading(false)); }; useEffect(() => { setEdit(null); load(); }, [res]);
  const del = async (i: any) => { if (confirm('Delete this item? This cannot be undone.')) { try { await call(`/${res}/${i._id}`, { method: 'DELETE' }); load(); } catch (e: any) { setError(e.message); } } };
  if (edit) return <Form res={res} init={edit} onCancel={() => setEdit(null)} onSaved={() => { setEdit(null); load(); }} />;
  return (<div className="space-y-2"><button className="btn-primary" onClick={() => setEdit({})}>Add new</button>
    {loading && <p className="text-sm text-zinc-500" role="status">Loading records…</p>}{error && <p className="text-sm text-red-600" role="alert">{error}</p>}
    {!loading && !error && !items.length && <p className="text-sm text-zinc-500">Nothing here yet. Add your first item.</p>}
    {items.map(i => <div key={i._id} className="card flex items-center justify-between gap-2 p-3 text-sm">
      <span>{i.title || i.name || i.company || i.institution}{i.published === false || i.visible === false ? ' (hidden)' : ''}</span>
      <span className="flex gap-2"><button className="btn-ghost" onClick={() => setEdit(i)}>Edit</button><button className="btn-ghost text-red-600" onClick={() => del(i)}>Delete</button></span></div>)}</div>);
}

function Single({ res }: { res: string }) {
  const [d, setD] = useState<any>(null); const [k, setK] = useState(0); const [error, setError] = useState('');
  useEffect(() => { setError(''); call(`/${res}`).then(setD).catch((e: any) => setError(e.message || 'Could not load settings')); }, [res, k]);
  return d ? <Form key={res + k} res={res} init={d} onSaved={() => setK(k + 1)} /> : error ? <p className="text-sm text-red-600" role="alert">{error}</p> : <p className="text-sm text-zinc-500" role="status">Loading…</p>;
}

function Resume() {
  const [r, setR] = useState<any>(null); const [msg, setMsg] = useState('');
  const load = () => call('/resume').then(setR); useEffect(() => { load(); }, []);
  const up = async (f?: File) => { if (!f) return; const fd = new FormData(); fd.append('file', f); setMsg('Uploading...');
    try { await call('/resume/upload', { method: 'POST', body: fd }); setMsg('Resume saved.'); load(); } catch (e: any) { setMsg(e.message); } };
  return (<div className="card space-y-3 p-4 text-sm">
    {r?.exists ? <p>Current resume updated {new Date(r.updatedAt).toLocaleDateString()}, {r.downloads} downloads. <a className="text-accent underline" href={`${API}/resume/download`}>Download current resume</a></p> : <p>No resume uploaded yet.</p>}
    <input type="file" accept="application/pdf" onChange={e => up(e.target.files?.[0])} />
    {r?.exists && <button className="btn-ghost text-red-600" onClick={async () => { if (confirm('Delete the resume?')) { await call('/resume', { method: 'DELETE' }); load(); } }}>Delete resume</button>}
    <p className="text-zinc-500">{msg}</p></div>);
}

function Messages() {
  const [m, setM] = useState<any[]>([]); const load = () => call('/contact').then(setM); useEffect(() => { load(); }, []);
  const upd = async (x: any, p: any) => { await call(`/contact/${x._id}`, { method: 'PUT', body: JSON.stringify({ read: x.read, archived: x.archived, ...p }) }); load(); };
  return (<div className="space-y-2">{!m.length && <p className="text-sm text-zinc-500">No messages yet.</p>}
    {m.map(x => <div key={x._id} className={`card space-y-1 p-3 text-sm ${x.archived ? 'opacity-50' : ''}`}>
      <p className="font-medium">{!x.read && <span className="mr-2 text-accent">New</span>}{x.subject} <span className="font-normal text-zinc-500">from {x.name} ({x.email})</span></p>
      <p className="whitespace-pre-wrap text-zinc-600 dark:text-zinc-400">{x.message}</p>
      <div className="flex gap-2 pt-1"><button className="btn-ghost" onClick={() => upd(x, { read: !x.read })}>{x.read ? 'Mark unread' : 'Mark read'}</button>
        <button className="btn-ghost" onClick={() => upd(x, { archived: !x.archived })}>{x.archived ? 'Unarchive' : 'Archive'}</button>
        <button className="btn-ghost text-red-600" onClick={async () => { if (confirm('Delete this message?')) { await call(`/contact/${x._id}`, { method: 'DELETE' }); load(); } }}>Delete</button></div></div>)}</div>);
}

function Dashboard() {
  const [s, setS] = useState<any>(null); const [error, setError] = useState(''); useEffect(() => { call('/stats').then(setS).catch((e: any) => setError(e.message || 'Could not load dashboard')); }, []);
  if (error) return <p className="text-sm text-red-600" role="alert">{error}</p>; if (!s) return <p className="text-sm text-zinc-500" role="status">Loading dashboard…</p>;
  return (<div className="space-y-4"><div className="grid grid-cols-2 gap-3 md:grid-cols-3">
    {[['Projects', s.projects], ['Featured', s.featured], ['Skills', s.skills], ['Messages', s.messages], ['Unread', s.unread], ['Resume downloads', s.downloads]].map(([l, n]) =>
      <div key={l as string} className="card p-4"><p className="text-2xl font-semibold">{n}</p><p className="text-sm text-zinc-500">{l}</p></div>)}</div>
    <div className="card p-4 text-sm"><h3 className="mb-2 font-semibold">Recent activity</h3>{s.activity.map((a: any) => <p key={a._id} className="text-zinc-500">{a.action} {a.entity}, {new Date(a.createdAt).toLocaleString()}</p>)}</div></div>);
}

export default function Admin() {
  const [authed, setAuthed] = useState<boolean | null>(null); const [tab, setTab] = useState('dashboard'); const [err, setErr] = useState('');
  useEffect(() => { call('/auth/me').then(() => setAuthed(true)).catch(() => setAuthed(false)); }, []);
  async function login(e: React.FormEvent<HTMLFormElement>) { e.preventDefault();
    try { await call('/auth/login', { method: 'POST', body: JSON.stringify(Object.fromEntries(new FormData(e.currentTarget))) }); setAuthed(true); setErr(''); } catch (x: any) { setErr(x.message); } }
  if (authed === null) return <main className="mx-auto max-w-sm px-5 py-24 text-sm text-zinc-500" role="status">Checking admin session…</main>;
  if (!authed) return (<main className="mx-auto mt-24 max-w-sm px-5"><form onSubmit={login} className="card space-y-3 p-5"><h1 className="text-xl font-semibold">Admin sign in</h1>
    <input name="email" type="email" required placeholder="Email" className="input" /><input name="password" type="password" required placeholder="Password" className="input" />
    <button className="btn-primary w-full">Sign in</button>{err && <p className="text-sm text-red-600">{err}</p>}</form></main>);
  const body = tab === 'dashboard' ? <Dashboard /> : tab === 'resume' ? <Resume /> : tab === 'messages' ? <Messages /> : single.includes(tab) ? <Single res={tab} /> : <List res={tab} />;
  return (<div className="mx-auto max-w-5xl gap-6 p-4 md:flex">
    <nav aria-label="Admin" className="mb-4 flex gap-1 overflow-x-auto md:mb-0 md:w-44 md:flex-col md:overflow-visible">
      {tabs.map(t => <button key={t} onClick={() => setTab(t)} className={`btn shrink-0 justify-start capitalize ${tab === t ? 'bg-accent text-white' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}>{t}</button>)}
      <button className="btn justify-start text-red-600" onClick={async () => { await call('/auth/logout', { method: 'POST' }); setAuthed(false); }}>Logout</button></nav>
    <section className="min-w-0 flex-1"><h1 className="mb-4 text-xl font-semibold capitalize">{tab}</h1>{body}</section></div>);
}
