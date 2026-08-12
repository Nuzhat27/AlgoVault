import { timeAgo, todayStr } from '../utils/helpers';

export default function ProblemRow({ problem, onOpen }) {
  const sessions = (problem.practiceSessions || []).length;
  const due = problem.spacedRepetition?.nextReviewDate && todayStr(problem.spacedRepetition.nextReviewDate) <= todayStr();
  return (
    <div className="prow" onClick={() => onOpen(problem._id)}>
      <div className="ttl">
        {problem.title || 'Untitled problem'}
        <small>
          {sessions} session{sessions === 1 ? '' : 's'} · updated {timeAgo(problem.updatedAt)}
          {due && <> · <span style={{ color: 'var(--amber)' }}>due for review</span></>}
        </small>
      </div>
      <div className="tags">
        {(problem.topics || []).slice(0, 3).map((t) => <span className="tag" key={t}>{t}</span>)}
      </div>
      <span className={`pill ${problem.difficulty.toLowerCase()}`}>{problem.difficulty}</span>
      <span className="status-chip">{problem.status}</span>
    </div>
  );
}
