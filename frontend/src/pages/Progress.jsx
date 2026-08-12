import { useMemo } from 'react';
import { useData } from '../context/DataContext';
import { allTopics } from '../utils/helpers';

export default function Progress() {
  const { problems, mockSessions, patterns, loaded } = useData();
  const solved = useMemo(() => problems.filter(p => ['Solved','Solved-Optimally','Mastered'].includes(p.status)).length, [problems]);
  const mastered = useMemo(() => problems.filter(p => p.status === 'Mastered').length, [problems]);
  const due = useMemo(() => problems.filter(p => p.spacedRepetition?.nextReviewDate && new Date(p.spacedRepetition.nextReviewDate) <= new Date()).length, [problems]);
  const topics = allTopics(problems);
  const coverage = topics.length ? Math.round((topics.filter(t => problems.some(p => p.topics?.includes(t) && ['Solved','Solved-Optimally','Mastered'].includes(p.status))).length / topics.length) * 100) : 0;

  if (!loaded) return <section className="view"><div className="empty">Loading your progress…</div></section>;

  return <section className="progress-page">
    <div className="progress-header"><span className="eyebrow">PROGRESS</span><h1>Your interview progress</h1><p>A clear picture of what you have solved, mastered and what deserves another pass.</p></div>
    <div className="progress-stat-row">
      <div className="progress-stat"><strong>{solved}</strong><span>Problems solved</span></div>
      <div className="progress-stat"><strong>{mastered}</strong><span>Problems mastered</span></div>
      <div className="progress-stat"><strong>{patterns.length}</strong><span>Patterns saved</span></div>
      <div className="progress-stat"><strong>{coverage}%</strong><span>Topic coverage</span></div>
    </div>
    <div className="progress-cards">
      <article className="progress-card"><span className="index">01</span><h3>Problems achieved</h3><p>Review your completed DSA practice and keep converting attempts into durable knowledge.</p></article>
      <article className="progress-card"><span className="index">02</span><h3>Patterns mastered</h3><p>Use the pattern library to see which approaches are becoming second nature.</p></article>
      <article className="progress-card"><span className="index">03</span><h3>Weak areas</h3><p>{due ? `${due} problem${due === 1 ? '' : 's'} are due for review.` : 'No reviews are due right now. Keep your queue clean.'}</p></article>
    </div>
    <div className="section-heading"><div><span className="eyebrow">NEXT MOVES</span><h2>Turn progress into momentum.</h2></div></div>
    <div className="feature-hub">
      <article className="feature-card" onClick={() => window.location.href='/revision'}><div className="feature-icon">↻</div><h3>Smart Revision</h3><p>Work through your scheduled reviews before they become weak spots.</p><span className="feature-link">Open revision →</span></article>
      <article className="feature-card" onClick={() => window.location.href='/recall'}><div className="feature-icon">◎</div><h3>Active Recall</h3><p>Test yourself without looking at your notes and track the score.</p><span className="feature-link">Start recall →</span></article>
      <article className="feature-card" onClick={() => window.location.href='/analytics'}><div className="feature-icon">▥</div><h3>Analytics</h3><p>See weekly activity, difficulty mix and topic distribution.</p><span className="feature-link">View analytics →</span></article>
    </div>
  </section>;
}
