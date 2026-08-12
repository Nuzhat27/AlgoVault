import { Navigate, Route, Routes } from 'react-router-dom';
import AuthNavbar from './components/AuthNavbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Problems from './pages/Problems';
import Progress from './pages/Progress';
import Profile from './pages/Profile';
import Notes from './pages/Notes';
import Revision from './pages/Revision';
import Flashcards from './pages/Flashcards';
import ActiveRecall from './pages/ActiveRecall';
import FocusTimer from './pages/FocusTimer';
import Analytics from './pages/Analytics';

function PublicLayout({ children }) {
  return <div className="site-shell public-shell"><AuthNavbar /><main className="site-main">{children}</main></div>;
}

function PrivateLayout({ children }) {
  return (
    <div className="site-shell private-shell">
      <AuthNavbar />
      <main className="site-main">{children}</main>
      <footer className="app-footer"><strong>AlgoFlow</strong><span>Focused DSA practice. Built for interview readiness.</span></footer>
    </div>
  );
}

function Home() {
  return (
    <section className="home-page">
      <div className="home-grid-bg" />
      <div className="home-copy">
        <span className="eyebrow">DSA COMMAND CENTER</span>
        <h1>Build your <em>interview edge.</em></h1>
        <p>One focused workspace to track problems, master patterns, review weak spots and build interview confidence.</p>
        <div className="home-actions">
          <a className="btn btn-primary" href="/register">Create account <span>→</span></a>
          <a className="btn btn-secondary" href="/login">Sign in</a>
        </div>
        <div className="home-points">
          <div><b>01</b><span>Track progress</span><small>Know exactly what you have mastered.</small></div>
          <div><b>02</b><span>Practice with intent</span><small>Turn solved problems into repeatable patterns.</small></div>
          <div><b>03</b><span>Stay interview-ready</span><small>Use review, recall and analytics to close weak spots.</small></div>
        </div>
      </div>
      <div className="home-visual">
        <div className="glow-orb" />
        <div className="terminal-window">
          <div className="terminal-top"><span /><span /><span /><b>algoflow://workspace</b></div>
          <div className="terminal-body">
            <div className="code-line"><i>01</i><span><em>function</em> solve(problem) {'{'}</span></div>
            <div className="code-line"><i>02</i><span>&nbsp;&nbsp;const pattern = <strong>recognize(problem)</strong>;</span></div>
            <div className="code-line"><i>03</i><span>&nbsp;&nbsp;return <strong>practice(pattern)</strong>;</span></div>
            <div className="code-line"><i>04</i><span>{'}'}</span></div>
            <div className="metric-row"><span>INTERVIEW READINESS</span><b>78%</b></div>
            <div className="progress-line"><span style={{ width: '78%' }} /></div>
            <div className="mini-grid"><span>342 solved</span><span>18 day streak</span><span>27 patterns</span></div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
      <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
      <Route path="/register" element={<PublicLayout><Register /></PublicLayout>} />
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<PrivateLayout><Dashboard /></PrivateLayout>} />
        <Route path="/practice" element={<PrivateLayout><Problems /></PrivateLayout>} />
        <Route path="/progress" element={<PrivateLayout><Progress /></PrivateLayout>} />
        <Route path="/profile" element={<PrivateLayout><Profile /></PrivateLayout>} />
        <Route path="/notes" element={<PrivateLayout><Notes /></PrivateLayout>} />
        <Route path="/revision" element={<PrivateLayout><Revision /></PrivateLayout>} />
        <Route path="/flashcards" element={<PrivateLayout><Flashcards /></PrivateLayout>} />
        <Route path="/recall" element={<PrivateLayout><ActiveRecall /></PrivateLayout>} />
        <Route path="/focus" element={<PrivateLayout><FocusTimer /></PrivateLayout>} />
        <Route path="/analytics" element={<PrivateLayout><Analytics /></PrivateLayout>} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
