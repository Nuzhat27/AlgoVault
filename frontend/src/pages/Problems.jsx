import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { STATUSES, DIFFICULTIES, allTopics, todayStr } from '../utils/helpers';
import ProblemRow from '../components/ProblemRow';
import ProblemWorkspace from '../components/ProblemWorkspace';

const DEFAULT_FILTERS = { search: '', difficulty: [], status: [], topic: '', due: false, sort: 'updated_desc' };

export default function Problems() {
  const { problems, loaded } = useData();
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [openId, setOpenId] = useState(null);
  const [creatingNew, setCreatingNew] = useState(false);

  useEffect(() => {
    const openParam = searchParams.get('open');
    const newParam = searchParams.get('new');
    if (openParam) setOpenId(openParam);
    if (newParam) setCreatingNew(true);
    if (openParam || newParam) setSearchParams({}, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggle = (arrName, value) => {
    setFilters((prev) => {
      const arr = prev[arrName];
      const next = arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
      return { ...prev, [arrName]: next };
    });
  };

  const filtered = useMemo(() => {
    let list = problems.filter((p) => {
      if (filters.search) {
        const hay = `${p.title} ${p.description} ${p.approach}`.toLowerCase();
        if (!hay.includes(filters.search.toLowerCase())) return false;
      }
      if (filters.difficulty.length && !filters.difficulty.includes(p.difficulty)) return false;
      if (filters.status.length && !filters.status.includes(p.status)) return false;
      if (filters.topic && !p.topics.includes(filters.topic)) return false;
      if (filters.due) {
        const today = todayStr();
        if (!(p.spacedRepetition?.nextReviewDate && todayStr(p.spacedRepetition.nextReviewDate) <= today)) return false;
      }
      return true;
    });
    list = list.slice().sort((a, b) => {
      switch (filters.sort) {
        case 'created_desc':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'difficulty': {
          const o = { Easy: 0, Medium: 1, Hard: 2 };
          return o[a.difficulty] - o[b.difficulty];
        }
        case 'revisits':
          return (b.practiceSessions || []).length - (a.practiceSessions || []).length;
        default:
          return new Date(b.updatedAt) - new Date(a.updatedAt);
      }
    });
    return list;
  }, [problems, filters]);

  const topics = useMemo(() => allTopics(problems), [problems]);
  const openProblem = problems.find((p) => p._id === openId);

  return (
    <section className="view active">
      <div className="page-head">
        <div>
          <h1>Problems</h1>
          <div className="sub">// your library</div>
        </div>
        <button className="btn btn-primary" onClick={() => setCreatingNew(true)}>+ New problem</button>
      </div>

      <div className="feature-hub">
        <div className="feature-card" onClick={() => window.location.href='/notes'}><div className="feature-icon">▤</div><h3>DSA Notes</h3><p>Capture patterns, mistakes and reusable explanations.</p><span className="feature-link">Open notes →</span></div>
        <div className="feature-card" onClick={() => window.location.href='/revision'}><div className="feature-icon">↻</div><h3>Smart Revision</h3><p>Work through problems scheduled by spaced repetition.</p><span className="feature-link">Open revision →</span></div>
        <div className="feature-card" onClick={() => window.location.href='/flashcards'}><div className="feature-icon">◇</div><h3>Flashcards</h3><p>Quick Q&A recall for patterns and concepts.</p><span className="feature-link">Open flashcards →</span></div>
        <div className="feature-card" onClick={() => window.location.href='/recall'}><div className="feature-icon">◎</div><h3>Active Recall</h3><p>Test yourself against your saved solutions.</p><span className="feature-link">Start session →</span></div>
        <div className="feature-card" onClick={() => window.location.href='/focus'}><div className="feature-icon">◷</div><h3>Focus Timer</h3><p>Pomodoro sessions with a simple completion counter.</p><span className="feature-link">Start focus →</span></div>
        <div className="feature-card" onClick={() => window.location.href='/analytics'}><div className="feature-icon">▥</div><h3>Analytics</h3><p>Weekly trend, topic distribution and difficulty mix.</p><span className="feature-link">View analytics →</span></div>
      </div>

      <div className="filterbar">
        <input
          type="search"
          placeholder="Search title, notes…"
          value={filters.search}
          onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
        />
        <div className="div"></div>
        <div className="grp">
          {DIFFICULTIES.map((d) => (
            <span key={d} className={`chip${filters.difficulty.includes(d) ? ' on' : ''}`} onClick={() => toggle('difficulty', d)}>{d}</span>
          ))}
        </div>
        <div className="div"></div>
        <div className="grp">
          {STATUSES.map((s) => (
            <span key={s} className={`chip${filters.status.includes(s) ? ' on' : ''}`} onClick={() => toggle('status', s)}>{s}</span>
          ))}
        </div>
        <div className="div"></div>
        <div className="grp">
          <span className={`chip${filters.due ? ' on' : ''}`} onClick={() => setFilters((f) => ({ ...f, due: !f.due }))}>Due for review</span>
        </div>
        <div className="div"></div>
        <select value={filters.sort} onChange={(e) => setFilters((f) => ({ ...f, sort: e.target.value }))}>
          <option value="updated_desc">Last updated</option>
          <option value="created_desc">Date added</option>
          <option value="difficulty">Difficulty</option>
          <option value="revisits">Most revisited</option>
        </select>
        <select value={filters.topic} onChange={(e) => setFilters((f) => ({ ...f, topic: e.target.value }))}>
          <option value="">All topics</option>
          {topics.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <button className="btn btn-ghost btn-sm" onClick={() => setFilters(DEFAULT_FILTERS)}>Clear</button>
      </div>

      {!loaded ? (
        <div className="empty"><b>Loading…</b></div>
      ) : filtered.length ? (
        <div className="plist">
          {filtered.map((p) => <ProblemRow key={p._id} problem={p} onOpen={setOpenId} />)}
        </div>
      ) : (
        <div className="empty"><b>No problems match.</b>Clear filters or log a new one to get started.</div>
      )}

      {(openProblem || openId) && (
        <ProblemWorkspace problem={openProblem} onClose={() => setOpenId(null)} />
      )}
      {creatingNew && (
        <ProblemWorkspace problem={null} onClose={() => setCreatingNew(false)} />
      )}
    </section>
  );
}
