import { useState } from 'react';
import Modal from './Modal';
import { useToast } from '../context/ToastContext';
import { createPattern, updatePattern } from '../api/endpoints';
import { useData } from '../context/DataContext';

export default function PatternModal({ pattern, onClose }) {
  const toast = useToast();
  const { upsertPattern } = useData();
  const [form, setForm] = useState({
    name: pattern?.name || '',
    description: pattern?.description || '',
    recognize: pattern?.recognize || '',
    apply: pattern?.apply || '',
  });
  const [busy, setBusy] = useState(false);

  const save = async () => {
    if (!form.name.trim()) {
      toast('Give the pattern a name.');
      return;
    }
    setBusy(true);
    try {
      const saved = pattern ? await updatePattern(pattern._id, form) : await createPattern(form);
      upsertPattern(saved);
      onClose();
    } catch {
      toast('Could not save pattern.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal onClose={onClose} narrow>
      <div className="modal-head">
        <h2>{pattern ? 'Edit pattern' : 'New pattern'}</h2>
        <button className="btn btn-ghost btn-sm" onClick={onClose}>✕</button>
      </div>
      <div className="modal-body">
        <div className="field">
          <label>Name</label>
          <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Sliding Window" autoFocus />
        </div>
        <div className="field">
          <label>Description</label>
          <textarea rows={2} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
        </div>
        <div className="field">
          <label>When to recognize it</label>
          <textarea rows={2} placeholder="Tell-tale signs in the problem statement…" value={form.recognize} onChange={(e) => setForm((f) => ({ ...f, recognize: e.target.value }))} />
        </div>
        <div className="field">
          <label>When to apply it</label>
          <textarea rows={2} value={form.apply} onChange={(e) => setForm((f) => ({ ...f, apply: e.target.value }))} />
        </div>
        <button className="btn btn-primary btn-block" onClick={save} disabled={busy}>Save pattern</button>
      </div>
    </Modal>
  );
}
