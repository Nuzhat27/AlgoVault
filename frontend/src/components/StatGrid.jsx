import { useMemo } from 'react';
import { daysBetween, todayStr, allTopics } from '../utils/helpers';

function computeStreak(problems, mockSessions) {
  const days = new Set();
  problems.forEach((p) => (p.practiceSessions || []).forEach((s) => days.add(s.timestamp.slice(0, 10))));
  mockSessions.forEach((m) => days.add(m.date));
  if (days.size === 0) return { current: 0, longest: 0 };
  const sorted = [...days].sort();
  let longest = 1;
  let run = 1;
  for (let i = 1; i < sorted.length; i++) {
    if (daysBetween(sorted[i - 1], sorted[i]) === 1) run++;
    else run = 1;
    longest = Math.max(longest, run);
  }
  let cur = 0;
  const cursor = new Date();
  while (days.has(todayStr(cursor))) {
    cur++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return { current: cur, longest };
}

export default function StatGrid({ problems, mockSessions }) {
  const stats = useMemo(() => {
    const total = problems.length;
    const solved = problems.filter((p) => ['Solved', 'Solved-Optimally', 'Mastered'].includes(p.status)).length;
    const mastered = problems.filter((p) => p.status === 'Mastered').length;
    const streak = computeStreak(problems, mockSessions);
    const evals = problems.flatMap((p) => p.evaluations || []);
    const avgScore = evals.length
      ? (evals.reduce((a, e) => a + (e.report?.overallScore || 0), 0) / evals.length).toFixed(1)
      : '—';
    const topics = allTopics(problems);
    const coverage = topics.length
      ? Math.round(
          (topics.filter((t) => problems.some((p) => p.topics.includes(t) && ['Solved', 'Solved-Optimally', 'Mastered'].includes(p.status))).length /
            topics.length) *
            100
        )
      : 0;
    const readiness = Math.round(
      coverage * 0.5 +
        (Math.min(streak.current, 14) / 14) * 25 +
        (evals.length ? (evals.reduce((a, e) => a + (e.report?.overallScore || 0), 0) / evals.length) / 10 : 0) * 25
    );

    return [
      { n: total, l: 'Logged' },
      { n: solved, l: 'Solved' },
      { n: mastered, l: 'Mastered' },
      { n: streak.current, l: 'Day streak', up: streak.current > 0 },
      { n: streak.longest, l: 'Longest streak' },
      { n: avgScore, l: 'Avg. eval score' },
      { n: `${readiness}%`, l: 'Interview readiness' },
    ];
  }, [problems, mockSessions]);

  return (
    <div className="stat-grid">
      {stats.map((s) => (
        <div className="stat" key={s.l}>
          <div className="n">{s.n}</div>
          <div className={`l${s.up ? ' up' : ''}`}>{s.l}</div>
        </div>
      ))}
    </div>
  );
}
