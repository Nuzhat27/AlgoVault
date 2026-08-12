import { useMemo } from 'react';
import { useData } from '../context/DataContext';
import { todayStr } from '../utils/helpers';

export default function Revision() {
  const { problems, loaded } = useData();
  const due = useMemo(() => problems.filter(p => p.spacedRepetition?.nextReviewDate && todayStr(p.spacedRepetition.nextReviewDate) <= todayStr()).sort((a,b) => new Date(a.spacedRepetition.nextReviewDate) - new Date(b.spacedRepetition.nextReviewDate)), [problems]);
  const upcoming = useMemo(() => problems.filter(p => p.spacedRepetition?.nextReviewDate && todayStr(p.spacedRepetition.nextReviewDate) > todayStr()).slice(0,8), [problems]);
  if (!loaded) return <section className="view"><div className="empty">Loading revision queue…</div></section>;
  return <section className="view">
    <div className="page-head"><div><span className="eyebrow">SMART REVISION</span><h1>Your review queue</h1><div className="sub">Spaced repetition keeps solved problems from becoming forgotten problems.</div></div><span className="muted-chip">{due.length} due today</span></div>
    <div className="tool-layout">
      <div className="tool-card"><div className="card-heading"><div><span className="section-kicker">TODAY</span><h3>Due for review</h3></div></div><div className="tool-list">{due.length ? due.map(p => <div className="tool-list-item" key={p._id}><strong>{p.title || 'Untitled problem'}</strong><small>{p.difficulty} · {p.status} · Review now in Practice</small></div>) : <div className="empty">You're caught up. Nice work.</div>}</div></div>
      <div className="tool-card"><span className="section-kicker">UP NEXT</span><h3>Upcoming reviews</h3><div className="tool-list">{upcoming.length ? upcoming.map(p => <div className="tool-list-item" key={p._id}><strong>{p.title || 'Untitled problem'}</strong><small>{new Date(p.spacedRepetition.nextReviewDate).toLocaleDateString()}</small></div>) : <p>No upcoming reviews yet.</p>}</div></div>
    </div>
  </section>;
}
