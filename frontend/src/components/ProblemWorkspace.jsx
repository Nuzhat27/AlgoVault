import { useEffect, useRef, useState } from 'react';
import {
  createProblem,
  updateProblem,
  deleteProblem,
  logPracticeSession,
  scheduleReview,
  saveEvaluation,
  evaluateTranscript,
  createPattern,
} from '../api/endpoints';
import { useToast } from '../context/ToastContext';
import { useData } from '../context/DataContext';
import { useDebouncedCallback } from '../utils/useDebouncedCallback';
import { STATUSES, DIFFICULTIES, LANGUAGES, todayStr } from '../utils/helpers';
import TagInput from './TagInput';
import CodeEditor from './CodeEditor';
import MarkdownField from './MarkdownField';
import VoiceRecorder from './VoiceRecorder';
import EvalHistory from './EvalHistory';

function blankProblem() {
  return {
    title: '',
    topics: [],
    patterns: [],
    sourceLink: '',
    difficulty: 'Medium',
    personalDifficulty: '',
    description: '',
    approach: '',
    timeComplexity: '',
    spaceComplexity: '',
    status: 'New',
    codeVersions: [{ label: 'attempt 1', language: 'python', code: '' }],
    activeVersionIndex: 0,
    spacedRepetition: { nextReviewDate: null },
    practiceSessions: [],
    evaluations: [],
  };
}

function sanitize(p) {
  const { _id, user, __v, createdAt, updatedAt, ...rest } = p;
  return rest;
}

const OUTCOME_ICON = { solved: '✓', partial: '◐', gave_up: '✕', reviewed: '↻' };
const OUTCOME_LABEL = { solved: '✓ Solved', partial: '◐ Partially solved', gave_up: '✕ Gave up', reviewed: '↻ Reviewed notes' };

export default function ProblemWorkspace({ problem, onClose }) {
  const toast = useToast();
  const { patterns, upsertProblem, removeProblem, upsertPattern } = useData();
  const [draft, setDraft] = useState(problem || blankProblem());
  const [saveState, setSaveState] = useState('');
  const persistedIdRef = useRef(problem?._id || null);
  const [topicInput, setTopicInput] = useState('');
  const [patternInput, setPatternInput] = useState('');

  const persist = useDebouncedCallback(async (currentDraft) => {
    setSaveState('saving…');
    try {
      if (persistedIdRef.current) {
        const updated = await updateProblem(persistedIdRef.current, sanitize(currentDraft));
        upsertProblem(updated);
      }
      setSaveState('saved ✓');
    } catch {
      setSaveState('save failed');
    }
  }, 500);

  // Create the problem immediately in the backend on first open, mirroring the original
  // "unshift a stub into the list" behavior — deleted again on close if left empty.
  useEffect(() => {
    let cancelled = false;
    if (!problem) {
      (async () => {
        try {
          const created = await createProblem(blankProblem());
          if (cancelled) return;
          persistedIdRef.current = created._id;
          setDraft(created);
          upsertProblem(created);
        } catch {
          toast('Could not start a new problem — please try again.');
          onClose();
        }
      })();
    }
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function set(field, value) {
    setDraft((prev) => {
      const next = { ...prev, [field]: value };
      persist(next);
      return next;
    });
  }

  function updateActiveVersion(patch) {
    setDraft((prev) => {
      const versions = prev.codeVersions.slice();
      versions[prev.activeVersionIndex] = { ...versions[prev.activeVersionIndex], ...patch };
      const next = { ...prev, codeVersions: versions };
      persist(next);
      return next;
    });
  }

  function addVersion() {
    setDraft((prev) => {
      const versions = [...prev.codeVersions, { label: `attempt ${prev.codeVersions.length + 1}`, language: 'python', code: '' }];
      const next = { ...prev, codeVersions: versions, activeVersionIndex: versions.length - 1 };
      persist(next);
      return next;
    });
  }

  function switchVersion(i) {
    setDraft((prev) => ({ ...prev, activeVersionIndex: i }));
  }

  function deleteVersion() {
    if (draft.codeVersions.length <= 1) {
      toast('At least one version is required.');
      return;
    }
    setDraft((prev) => {
      const versions = prev.codeVersions.filter((_, i) => i !== prev.activeVersionIndex);
      const activeVersionIndex = Math.max(0, prev.activeVersionIndex - 1);
      const next = { ...prev, codeVersions: versions, activeVersionIndex };
      persist(next);
      return next;
    });
  }

  function addTopic(name) {
    if (draft.topics.includes(name)) return;
    set('topics', [...draft.topics, name]);
  }
  function removeTopic(item) {
    set('topics', draft.topics.filter((t) => t !== item.label));
  }

  async function addPattern(name) {
    let pattern = patterns.find((p) => p.name.toLowerCase() === name.toLowerCase());
    if (!pattern) {
      try {
        pattern = await createPattern({ name, description: '', recognize: '', apply: '' });
        upsertPattern(pattern);
      } catch {
        toast('Could not create pattern.');
        return;
      }
    }
    if (!draft.patterns.includes(pattern._id)) {
      set('patterns', [...draft.patterns, pattern._id]);
    }
  }
  function removePattern(item) {
    set('patterns', draft.patterns.filter((id) => id !== item.id));
  }

  async function logSession(outcome) {
    if (!persistedIdRef.current) return;
    try {
      const updated = await logPracticeSession(persistedIdRef.current, outcome);
      setDraft(updated);
      upsertProblem(updated);
      toast('Session logged.');
    } catch {
      toast('Could not log session.');
    }
  }

  async function schedule(days) {
    if (!persistedIdRef.current) return;
    try {
      const updated = await scheduleReview(persistedIdRef.current, days);
      setDraft(updated);
      upsertProblem(updated);
      toast(`Scheduled for review on ${todayStr(updated.spacedRepetition.nextReviewDate)}`);
    } catch {
      toast('Could not schedule review.');
    }
  }

  async function handleEvaluate(transcript) {
    try {
      const report = await evaluateTranscript(draft, transcript);
      const updated = await saveEvaluation(persistedIdRef.current, transcript, report);
      setDraft(updated);
      upsertProblem(updated);
      toast('Evaluation ready.');
    } catch (err) {
      toast(err.response?.data?.message || 'Evaluation failed — please try again.');
      throw err;
    }
  }

  async function handleClose() {
    const isEmpty = !draft.title && !draft.description && !(draft.codeVersions || []).some((v) => v.code);
    if (persistedIdRef.current) {
      if (isEmpty) {
        try {
          await deleteProblem(persistedIdRef.current);
          removeProblem(persistedIdRef.current);
        } catch {
          // ignore — nothing user-visible was created
        }
      } else {
        try {
          const updated = await updateProblem(persistedIdRef.current, sanitize(draft));
          upsertProblem(updated);
        } catch {
          // best-effort final save
        }
      }
    }
    onClose();
  }

  const activeVersion = draft.codeVersions[draft.activeVersionIndex] || draft.codeVersions[0];
  const patternById = (id) => patterns.find((p) => p._id === id);

  return (
    <div
      className="overlay show"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className="modal">
        <div className="modal-head">
          <h2>{draft.title || 'New problem'}</h2>
          <div style={{ display: 'flex', gap: 8 }}>
            <span style={{ fontFamily: "'JetBrains Mono',monospace", color: 'var(--text-faint)', fontSize: 11, alignSelf: 'center' }}>{saveState}</span>
            <button className="btn btn-ghost btn-sm" onClick={handleClose}>✕</button>
          </div>
        </div>
        <div className="modal-body">
          <div className="row">
            <div className="field" style={{ flex: 2 }}>
              <label>Title</label>
              <input value={draft.title} onChange={(e) => set('title', e.target.value)} placeholder="e.g. Longest Substring Without Repeating Characters" />
            </div>
            <div className="field">
              <label>Source link</label>
              <input value={draft.sourceLink} onChange={(e) => set('sourceLink', e.target.value)} placeholder="https://leetcode.com/…" />
            </div>
          </div>

          <div className="row">
            <div className="field">
              <label>Difficulty</label>
              <select value={draft.difficulty} onChange={(e) => set('difficulty', e.target.value)}>
                {DIFFICULTIES.map((d) => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div className="field">
              <label>Felt like (optional)</label>
              <select value={draft.personalDifficulty} onChange={(e) => set('personalDifficulty', e.target.value)}>
                {['', ...DIFFICULTIES].map((d) => <option key={d || 'none'} value={d}>{d || '—'}</option>)}
              </select>
            </div>
            <div className="field">
              <label>Status</label>
              <select value={draft.status} onChange={(e) => set('status', e.target.value)}>
                {STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="row">
            <div className="field">
              <label>Topics</label>
              <TagInput
                items={draft.topics.map((t) => ({ label: t }))}
                onAdd={addTopic}
                onRemove={removeTopic}
              />
            </div>
            <div className="field">
              <label>Patterns</label>
              <TagInput
                items={draft.patterns.map((id) => ({ id, label: patternById(id)?.name || '?' }))}
                onAdd={addPattern}
                onRemove={removePattern}
              />
            </div>
          </div>

          <div className="row">
            <div className="field">
              <label>Time complexity</label>
              <input value={draft.timeComplexity} onChange={(e) => set('timeComplexity', e.target.value)} placeholder="O(n log n)" />
            </div>
            <div className="field">
              <label>Space complexity</label>
              <input value={draft.spaceComplexity} onChange={(e) => set('spaceComplexity', e.target.value)} placeholder="O(1)" />
            </div>
          </div>

          <MarkdownField label="Problem description" value={draft.description} onChange={(v) => set('description', v)} />
          <MarkdownField label="My approach" value={draft.approach} onChange={(v) => set('approach', v)} />

          <div className="field">
            <label>Code</label>
            <div className="tabs">
              {draft.codeVersions.map((v, i) => (
                <button key={v._id || i} type="button" className={i === draft.activeVersionIndex ? 'active' : ''} onClick={() => switchVersion(i)}>
                  {v.label}
                </button>
              ))}
              <button type="button" className="add" onClick={addVersion}>+ version</button>
            </div>
            <div className="row" style={{ margin: '8px 0' }}>
              <select style={{ maxWidth: 140 }} value={activeVersion.language} onChange={(e) => updateActiveVersion({ language: e.target.value })}>
                {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
              <input
                style={{ maxWidth: 220 }}
                value={activeVersion.label}
                onChange={(e) => updateActiveVersion({ label: e.target.value })}
                placeholder="version label"
              />
              <button type="button" className="btn btn-sm btn-danger" onClick={deleteVersion}>Delete version</button>
            </div>
            <CodeEditor value={activeVersion.code} language={activeVersion.language} onChange={(code) => updateActiveVersion({ code })} />
          </div>

          <div className="field">
            <label>Spaced repetition</label>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
              <button type="button" className="btn btn-sm" onClick={() => schedule(3)}>in 3 days</button>
              <button type="button" className="btn btn-sm" onClick={() => schedule(7)}>in 1 week</button>
              <button type="button" className="btn btn-sm" onClick={() => schedule(30)}>in 1 month</button>
              <span className="status-chip">
                {draft.spacedRepetition?.nextReviewDate ? `due ${todayStr(draft.spacedRepetition.nextReviewDate)}` : 'not scheduled'}
              </span>
            </div>
          </div>

          <div className="field">
            <label>Log practice session</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {Object.keys(OUTCOME_LABEL).map((o) => (
                <button key={o} type="button" className="btn btn-sm" onClick={() => logSession(o)}>{OUTCOME_LABEL[o]}</button>
              ))}
            </div>
            <div style={{ marginTop: 10 }}>
              {(draft.practiceSessions || []).length ? (
                draft.practiceSessions.slice().reverse().slice(0, 6).map((s) => (
                  <div className="due-row" key={s._id || s.timestamp}>
                    <span>{OUTCOME_ICON[s.outcome] || '•'} {s.outcome.replace('_', ' ')}</span>
                    <span style={{ color: 'var(--text-faint)' }}>{new Date(s.timestamp).toLocaleString()}</span>
                  </div>
                ))
              ) : (
                <div style={{ color: 'var(--text-faint)', fontSize: 12 }}>No sessions logged yet.</div>
              )}
            </div>
          </div>

          <div className="field">
            <label>Voice explanation + AI evaluation</label>
            <div className="card">
              <div className="card-bar"><div className="dots"><i></i><i></i><i></i></div><span className="title">mock_interviewer.eval</span></div>
              <div className="card-body">
                <VoiceRecorder onSubmit={handleEvaluate} submitLabel="Get evaluation →" />
                <EvalHistory evaluations={draft.evaluations} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
