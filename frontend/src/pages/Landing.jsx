import { Link } from 'react-router-dom';

const points = [
  ['01', 'Track progress', 'Know what is solved, what needs review, and where you are improving.'],
  ['02', 'Practice with intent', 'Keep your DSA problems, notes, patterns, and revision work in one place.'],
  ['03', 'Stay interview-ready', 'Use focused practice and mock interview sessions to build confidence.'],
];

export default function Landing() {
  return (
    <div className="public-shell">
      <main className="landing">
        <section className="landing-copy">
          <span className="eyebrow">DSA COMMAND CENTER</span>
          <h1>Build your <em>interview edge.</em></h1>
          <p className="landing-lead">
            A focused workspace for solving DSA problems, reviewing weak areas, and turning practice into interview readiness.
          </p>
          <div className="landing-actions">
            <Link className="btn btn-primary landing-button" to="/register">Create your workspace <span>→</span></Link>
            <Link className="landing-login" to="/login">Already have an account? <b>Sign in</b></Link>
          </div>
          <div className="landing-points">
            {points.map(([number, title, text]) => (
              <article key={number}>
                <span className="point-number">{number}</span>
                <div><strong>{title}</strong><p>{text}</p></div>
              </article>
            ))}
          </div>
        </section>

        <section className="landing-visual" aria-label="AlgoFlow workspace preview">
          <div className="blue-grid" />
          <div className="code-window">
            <div className="window-top"><span /><span /><span /><b>practice.session</b></div>
            <div className="code-lines">
              <i>01</i><span>function solve(problem) {'{'}</span>
              <i>02</i><span className="indent">const pattern = identify(problem);</span>
              <i>03</i><span className="indent">return pattern.apply(problem);</span>
              <i>04</i><span>{'}'}</span>
            </div>
          </div>
          <div className="visual-card visual-card-top"><small>PROGRESS</small><strong>78%</strong><span>Interview readiness</span></div>
          <div className="visual-card visual-card-bottom"><small>PROBLEMS SOLVED</small><strong>128</strong><span>+12 this week</span></div>
          <div className="visual-ring"><span /></div>
        </section>
      </main>
    </div>
  );
}
