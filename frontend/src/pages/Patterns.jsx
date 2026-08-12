import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { deletePattern as deletePatternApi } from '../api/endpoints';
import { useToast } from '../context/ToastContext';
import PatternModal from '../components/PatternModal';

export default function Patterns() {
  const { patterns, problems, removePattern } = useData();
  const toast = useToast();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);

  const problemsWithPattern = (id) => problems.filter((p) => (p.patterns || []).includes(id));

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this pattern? It will be unlinked from all problems.')) return;
    try {
      await deletePatternApi(id);
      removePattern(id);
    } catch {
      toast('Could not delete pattern.');
    }
  };

  return (
    <section className="view active">
      <div className="page-head">
        <div>
          <h1>Pattern Library</h1>
          <div className="sub">// recognize it before you solve it</div>
        </div>
        <button className="btn btn-primary" onClick={() => setCreating(true)}>+ New pattern</button>
      </div>

      {patterns.length ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 12 }}>
          {patterns.map((pt) => {
            const probs = problemsWithPattern(pt._id);
            return (
              <div className="pattern-card" key={pt._id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h3>{pt.name}</h3>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => setEditing(pt)}>edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(pt._id)}>del</button>
                  </div>
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-dim)' }}>
                  {pt.description || <span style={{ color: 'var(--text-faint)' }}>No description yet.</span>}
                </div>
                <div className="lbl">Recognize it when…</div>
                <div style={{ fontSize: 12.5, color: 'var(--text-dim)' }}>{pt.recognize || '—'}</div>
                <div className="lbl">Apply it when…</div>
                <div style={{ fontSize: 12.5, color: 'var(--text-dim)' }}>{pt.apply || '—'}</div>
                <div className="lbl">{probs.length} linked problem{probs.length === 1 ? '' : 's'}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {probs.slice(0, 4).map((pr) => (
                    <a href="#" key={pr._id} style={{ fontSize: 12.5 }} onClick={(e) => { e.preventDefault(); navigate(`/problems?open=${pr._id}`); }}>
                      {pr.title || 'Untitled'}
                    </a>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="empty"><b>No patterns yet.</b>Add one, or tag a problem with a pattern name to auto-create it.</div>
      )}

      {editing && <PatternModal pattern={editing} onClose={() => setEditing(null)} />}
      {creating && <PatternModal pattern={null} onClose={() => setCreating(false)} />}
    </section>
  );
}
