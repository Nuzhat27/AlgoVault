import { useEffect, useMemo, useState } from 'react';
import { marked } from 'marked';

const KEY = 'algoflow_notes_v1';
const starter = { id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, title: 'Sliding Window — Core Idea', tags: 'sliding-window, arrays', content: '# Sliding Window\n\nMaintain a window with two pointers. Expand the right pointer and shrink from the left whenever the constraint breaks.\n\n**Checklist**\n- Define the invariant\n- Decide when to expand\n- Decide when to shrink' };

function loadNotes() { try { const raw = localStorage.getItem(KEY); return raw ? JSON.parse(raw) : [starter]; } catch { return [starter]; } }

export default function Notes() {
  const [notes, setNotes] = useState(loadNotes);
  const [selected, setSelected] = useState(notes[0]?.id || null);
  const [draft, setDraft] = useState(notes[0] || starter);
  const current = notes.find(n => n.id === selected);

  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(notes)); }, [notes]);
  useEffect(() => { if (current) setDraft(current); }, [selected]);

  const save = () => setNotes(prev => prev.map(n => n.id === draft.id ? { ...draft, updatedAt: Date.now() } : n));
  const create = () => { const note = { id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, title: 'Untitled note', tags: '', content: '' }; setNotes(prev => [note, ...prev]); setSelected(note.id); setDraft(note); };
  const remove = () => { const next = notes.filter(n => n.id !== draft.id); setNotes(next); setSelected(next[0]?.id || null); setDraft(next[0] || starter); };
  const preview = useMemo(() => ({ __html: marked.parse(draft.content || '*Start writing your note…*') }), [draft.content]);

  return <section className="view">
    <div className="page-head"><div><span className="eyebrow">DSA NOTES</span><h1>Build your own knowledge base</h1><div className="sub">Markdown-friendly notes for patterns, mistakes and interview reminders.</div></div><button className="btn btn-primary" onClick={create}>+ New note</button></div>
    <div className="note-grid">
      <aside className="tool-card"><div className="tool-list note-list">{notes.map(n => <button key={n.id} className={`note-item ${n.id === selected ? 'active' : ''}`} onClick={() => setSelected(n.id)}><strong>{n.title || 'Untitled note'}</strong><small>{n.tags || 'No tags'}</small></button>)}</div></aside>
      <div className="tool-card">
        <div className="note-editor">
          <input value={draft.title} onChange={e => setDraft({ ...draft, title: e.target.value })} placeholder="Note title" />
          <input value={draft.tags} onChange={e => setDraft({ ...draft, tags: e.target.value })} placeholder="Tags: trees, dp, mistakes" />
          <textarea value={draft.content} onChange={e => setDraft({ ...draft, content: e.target.value })} placeholder="Write your DSA note in Markdown…" />
          <div style={{display:'flex',gap:8}}><button className="btn btn-primary" onClick={save}>Save note</button><button className="btn btn-ghost" onClick={remove}>Delete</button></div>
        </div>
        <div className="section-heading" style={{marginTop:30}}><div><span className="eyebrow">PREVIEW</span><h2>Rendered note</h2></div></div>
        <div className="markdown-preview" dangerouslySetInnerHTML={preview} />
      </div>
    </div>
  </section>;
}
