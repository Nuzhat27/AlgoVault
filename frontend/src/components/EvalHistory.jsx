import { ratingClass } from '../utils/helpers';

export default function EvalHistory({ evaluations }) {
  if (!evaluations?.length) return null;
  const sorted = [...evaluations].reverse();
  return (
    <div style={{ marginTop: 14 }}>
      {sorted.map((e) => {
        const r = e.report || {};
        return (
          <div className="evalcard" key={e._id || e.createdAt}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span className={`rating-badge ${ratingClass(r.rating)}`}>{r.rating || '—'}</span>
              <span style={{ color: 'var(--text-faint)', fontSize: 11.5 }}>
                {new Date(e.createdAt).toLocaleString()} · overall {r.overallScore ?? '—'}/10
              </span>
            </div>
            {(r.sectionScores || []).map((sc) => (
              <div className="score-row" key={sc.name}>
                <span>{sc.name}</span>
                <b>{sc.score}/10</b>
              </div>
            ))}
            {r.shortcomings?.length > 0 && (
              <div style={{ marginTop: 8 }}>
                <b style={{ fontSize: 12 }}>Shortcomings</b>
                <ul style={{ margin: '4px 0 0', paddingLeft: 18, fontSize: 12.5, color: 'var(--text-dim)' }}>
                  {r.shortcomings.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
            )}
            {r.suggestions?.length > 0 && (
              <div style={{ marginTop: 8 }}>
                <b style={{ fontSize: 12 }}>Suggestions</b>
                <ul style={{ margin: '4px 0 0', paddingLeft: 18, fontSize: 12.5, color: 'var(--text-dim)' }}>
                  {r.suggestions.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
            )}
            {r.modelAnswer && (
              <div style={{ marginTop: 8 }}>
                <b style={{ fontSize: 12 }}>Ideal explanation</b>
                <div style={{ fontSize: 12.5, color: 'var(--text-dim)', marginTop: 3 }}>{r.modelAnswer}</div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
