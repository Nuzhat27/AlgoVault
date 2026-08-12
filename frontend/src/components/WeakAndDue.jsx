import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { allTopics, todayStr } from '../utils/helpers';

export default function WeakAndDue({ problems }) {
  const navigate = useNavigate();

  const weak = useMemo(() => {
    const topics = allTopics(problems);
    return topics
      .map((t) => {
        const probs = problems.filter((p) => p.topics.includes(t));
        const solved = probs.filter((p) => ['Solved', 'Solved-Optimally', 'Mastered'].includes(p.status)).length;
        const revisit = probs.filter((p) => p.status === 'Needs Revisit').length;
        const rate = probs.length ? solved / probs.length : 0;
        return { t, probs: probs.length, rate, revisit };
      })
      .filter((r) => r.probs > 0)
      .sort((a, b) => a.rate - b.revisit * 0.1 - (b.rate - a.revisit * 0.1))
      .slice(0, 4);
  }, [problems]);

  const due = useMemo(() => {
    const today = todayStr();
    return problems.filter((p) => p.spacedRepetition?.nextReviewDate && todayStr(p.spacedRepetition.nextReviewDate) <= today);
  }, [problems]);

  return (
    <div className="card">
      <div className="card-bar">
        <div className="dots"><i></i><i></i><i></i></div>
        <span className="title">weak_spots &amp; due_review</span>
      </div>
      <div className="card-body">
        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: 'var(--text-faint)', marginBottom: 6 }}>WEAKEST TOPICS</div>
        <div style={{ marginBottom: 14 }}>
          {weak.length ? (
            weak.map((r) => (
              <div className="due-row" key={r.t}>
                <span>{r.t} <span style={{ color: 'var(--text-faint)' }}>({r.probs} logged)</span></span>
                <span className="status-chip">{Math.round(r.rate * 100)}% solved</span>
              </div>
            ))
          ) : (
            <div style={{ color: 'var(--text-faint)', fontSize: 12.5 }}>Log a few problems to see weak spots.</div>
          )}
        </div>
        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: 'var(--text-faint)', marginBottom: 6 }}>DUE FOR REVIEW TODAY</div>
        <div>
          {due.length ? (
            due.map((p) => (
              <div className="due-row" key={p._id}>
                <span>{p.title || 'Untitled'}</span>
                <button className="btn btn-sm btn-ghost" onClick={() => navigate(`/problems?open=${p._id}`)}>Review →</button>
              </div>
            ))
          ) : (
            <div style={{ color: 'var(--text-faint)', fontSize: 12.5 }}>Nothing due today. 🎉</div>
          )}
        </div>
      </div>
    </div>
  );
}
