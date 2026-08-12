import { useMemo } from 'react';
import { todayStr } from '../utils/helpers';

export default function Heatmap({ problems, mockSessions }) {
  const cols = useMemo(() => {
    const counts = {};
    problems.forEach((p) => (p.practiceSessions || []).forEach((s) => {
      const d = s.timestamp.slice(0, 10);
      counts[d] = (counts[d] || 0) + 1;
    }));
    mockSessions.forEach((m) => {
      counts[m.date] = (counts[m.date] || 0) + (m.problems || []).length;
    });

    const weeks = 18;
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - weeks * 7);
    start.setDate(start.getDate() - start.getDay());

    const columns = [];
    const cursor = new Date(start);
    for (let w = 0; w < weeks + 1; w++) {
      const cells = [];
      for (let d = 0; d < 7; d++) {
        const key = todayStr(cursor);
        const c = counts[key] || 0;
        const future = cursor > end;
        cells.push({ key, c, future });
        cursor.setDate(cursor.getDate() + 1);
      }
      columns.push(cells);
    }
    return columns;
  }, [problems, mockSessions]);

  const bgFor = (c) => {
    if (c >= 4) return 'var(--amber)';
    if (c >= 2) return 'rgba(227,166,62,.65)';
    if (c > 0) return 'rgba(227,166,62,.35)';
    return 'var(--surface-3)';
  };

  return (
    <>
      <div className="heatmap">
        {cols.map((col, i) => (
          <div className="col" key={i}>
            {col.map((cell) => (
              <div
                key={cell.key}
                className="cell"
                title={`${cell.key}: ${cell.c} session(s)`}
                style={{ background: cell.future ? 'transparent' : bgFor(cell.c) }}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="heat-legend">
        less
        <span className="cell" style={{ background: 'var(--surface-3)' }}></span>
        <span className="cell" style={{ background: 'rgba(227,166,62,.35)' }}></span>
        <span className="cell" style={{ background: 'rgba(227,166,62,.65)' }}></span>
        <span className="cell" style={{ background: 'var(--amber)' }}></span>
        more
      </div>
    </>
  );
}
