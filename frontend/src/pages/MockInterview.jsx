import { useEffect, useRef, useState } from 'react';
import { marked } from 'marked';
import { useData } from '../context/DataContext';
import { useToast } from '../context/ToastContext';
import { evaluateTranscript, saveEvaluation, createMockSession } from '../api/endpoints';
import { fmtTime, pickWeighted, ratingClass, todayStr } from '../utils/helpers';
import CodeEditor from '../components/CodeEditor';
import VoiceRecorder from '../components/VoiceRecorder';

function Setup({ problems, onStart }) {
  const [n, setN] = useState(3);
  const [duration, setDuration] = useState(35);
  const [biasWeak, setBiasWeak] = useState(true);

  return (
    <div className="card" style={{ maxWidth: 520 }}>
      <div className="card-bar"><div className="dots"><i></i><i></i><i></i></div><span className="title">new_session.setup</span></div>
      <div className="card-body">
        <div className="field">
          <label>Number of problems</label>
          <input type="number" min={1} max={10} value={n} onChange={(e) => setN(Number(e.target.value))} />
        </div>
        <div className="field">
          <label>Time per problem</label>
          <select value={duration} onChange={(e) => setDuration(Number(e.target.value))}>
            <option value={25}>25 min</option>
            <option value={35}>35 min</option>
            <option value={45}>45 min</option>
          </select>
        </div>
        <div className="field">
          <label>
            <input type="checkbox" checked={biasWeak} onChange={(e) => setBiasWeak(e.target.checked)} style={{ width: 'auto', verticalAlign: 'middle' }} />
            {' '}Bias selection toward my weak topics
          </label>
        </div>
        <button
          className="btn btn-primary btn-block"
          disabled={!problems.length}
          onClick={() => onStart(Math.min(n, problems.length), duration, biasWeak)}
        >
          Start session
        </button>
        {!problems.length && (
          <div style={{ color: 'var(--text-faint)', fontSize: 12, marginTop: 8 }}>
            Log a few problems first — mock sessions pull from your library.
          </div>
        )}
      </div>
    </div>
  );
}

function Runner({ session, onFinishProblem, onSkip, onAbort }) {
  const p = session.problems[session.idx];
  const total = session.problems.length;
  const [timeLeft, setTimeLeft] = useState(session.duration * 60);
  const [code, setCode] = useState('');
  const timedOutRef = useRef(false);

  useEffect(() => {
    setTimeLeft(session.duration * 60);
    setCode('');
    timedOutRef.current = false;
  }, [session.idx, session.duration]);

  useEffect(() => {
    const id = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(id);
          if (!timedOutRef.current) {
            timedOutRef.current = true;
            onFinishProblem(true, code);
          }
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.idx]);

  return (
    <>
      <div className="mock-progress">
        {session.problems.map((_, i) => (
          <div key={i} className={`seg${i < session.idx ? ' done' : i === session.idx ? ' cur' : ''}`}></div>
        ))}
      </div>
      <div className="card">
        <div className="card-bar">
          <div className="dots"><i></i><i></i><i></i></div>
          <span className="title">problem {session.idx + 1} / {total}</span>
          <div className="spacer"></div>
          <span className={`timer${timeLeft < 60 ? ' warn' : ''}`}>{fmtTime(timeLeft)}</span>
        </div>
        <div className="card-body">
          <h2 style={{ marginTop: 0 }}>
            {p.title || 'Untitled'} <span className={`pill ${p.difficulty.toLowerCase()}`}>{p.difficulty}</span>
          </h2>
          <div className="md-preview" dangerouslySetInnerHTML={{ __html: marked.parse(p.description || '*No description saved for this problem.*') }} />
          <div className="field" style={{ marginTop: 12 }}>
            <label>Code (scratch space — not saved to the problem)</label>
            <CodeEditor value={code} language={p.codeVersions?.[0]?.language || 'python'} onChange={setCode} />
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
            <button className="btn btn-primary" onClick={() => onFinishProblem(false, code)}>Finish problem →</button>
            <button className="btn btn-ghost" onClick={onSkip}>Skip</button>
            <button className="btn btn-danger" style={{ marginLeft: 'auto' }} onClick={onAbort}>End session</button>
          </div>
        </div>
      </div>
    </>
  );
}

function EvalStep({ problem, timedOut, onDone }) {
  const toast = useToast();

  const handleSubmit = async (transcript) => {
    try {
      const report = await evaluateTranscript(problem, transcript);
      const updated = await saveEvaluation(problem._id, transcript, report);
      onDone({ problem: updated, report, skipped: false });
    } catch (err) {
      toast(err.response?.data?.message || 'Evaluation failed — please try again.');
      throw err;
    }
  };

  return (
    <div className="card">
      <div className="card-bar"><div className="dots"><i></i><i></i><i></i></div><span className="title">voice_evaluation.eval — {problem.title || 'Untitled'}</span></div>
      <div className="card-body">
        {timedOut && <p style={{ color: 'var(--hard)', fontSize: 13 }}>Time's up — explain what you have so far.</p>}
        <VoiceRecorder onSubmit={handleSubmit} submitLabel="Submit & continue →" />
      </div>
    </div>
  );
}

function Summary({ results, onDone }) {
  const scored = results.filter((r) => r.report);
  const avg = scored.length ? (scored.reduce((a, r) => a + r.report.overallScore, 0) / scored.length).toFixed(1) : '—';

  return (
    <div className="card">
      <div className="card-bar"><div className="dots"><i></i><i></i><i></i></div><span className="title">session_summary.log</span></div>
      <div className="card-body">
        <div className="stat-grid" style={{ marginBottom: 16 }}>
          <div className="stat"><div className="n">{results.length}</div><div className="l">Attempted</div></div>
          <div className="stat"><div className="n">{scored.length}</div><div className="l">Evaluated</div></div>
          <div className="stat"><div className="n">{avg}</div><div className="l">Avg. score</div></div>
        </div>
        {results.map((r, i) => (
          <div className="due-row" key={i}>
            <span>{r.problem.title || 'Untitled'} {r.skipped && <span style={{ color: 'var(--text-faint)' }}>(skipped)</span>}</span>
            <span style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              {r.report && <span className={`rating-badge ${ratingClass(r.report.rating)}`}>{r.report.rating}</span>}
            </span>
          </div>
        ))}
        <button className="btn btn-primary" style={{ marginTop: 14 }} onClick={onDone}>Back to setup</button>
      </div>
    </div>
  );
}

export default function MockInterview() {
  const { problems, upsertProblem, addMockSession } = useData();
  const [session, setSession] = useState(null); // { problems, idx, duration }
  const [phase, setPhase] = useState('setup'); // setup | eval | summary
  const [evalCtx, setEvalCtx] = useState(null); // { timedOut }
  const [results, setResults] = useState([]);

  const startSession = (n, duration, biasWeak) => {
    const picked = pickWeighted(problems, n, biasWeak);
    setSession({ problems: picked, idx: 0, duration });
    setResults([]);
    setPhase('runner');
  };

  const finishProblem = (timedOut) => {
    setEvalCtx({ timedOut });
    setPhase('eval');
  };

  const skip = () => {
    const p = session.problems[session.idx];
    recordResultAndAdvance({ problem: p, skipped: true });
  };

  const abort = () => {
    if (window.confirm('End this mock session early?')) finalizeSession(results);
  };

  const onEvalDone = (result) => {
    upsertProblem(result.problem);
    recordResultAndAdvance(result);
  };

  function recordResultAndAdvance(result) {
    const nextResults = result ? [...results, result] : results;
    setResults(nextResults);
    const nextIdx = session.idx + 1;
    if (nextIdx >= session.problems.length) {
      finalizeSession(nextResults);
    } else {
      setSession((prev) => ({ ...prev, idx: nextIdx }));
      setPhase('runner');
    }
  }

  const finalizeSession = async (finalResults) => {
    setPhase('summary');
    try {
      const created = await createMockSession({
        date: todayStr(),
        problems: finalResults.map((r) => r.problem._id),
        results: finalResults.map((r) => ({ problemId: r.problem._id, score: r.report ? r.report.overallScore : null, skipped: !!r.skipped })),
      });
      addMockSession(created);
    } catch {
      // non-critical if the session summary fails to persist
    }
  };

  const backToSetup = () => {
    setSession(null);
    setResults([]);
    setPhase('setup');
  };

  return (
    <section className="view active">
      <div className="page-head">
        <div>
          <h1>Mock Interview</h1>
          <div className="sub">// timed, judged, no analytics safety net</div>
        </div>
      </div>

      {phase === 'setup' && <Setup problems={problems} onStart={startSession} />}
      {phase === 'runner' && session && (
        <Runner session={session} onFinishProblem={finishProblem} onSkip={skip} onAbort={abort} />
      )}
      {phase === 'eval' && session && (
        <EvalStep problem={session.problems[session.idx]} timedOut={evalCtx?.timedOut} onDone={onEvalDone} />
      )}
      {phase === 'summary' && <Summary results={results} onDone={backToSetup} />}
    </section>
  );
}
