import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import StatGrid from '../components/StatGrid';
import Heatmap from '../components/Heatmap';
import WeakAndDue from '../components/WeakAndDue';
import { TopicsChart, DifficultyChart, TrendChart } from '../components/DashboardCharts';

export default function Dashboard() {
  const { problems, mockSessions, loaded, error } = useData();
  const { user } = useAuth();
  const navigate = useNavigate();
  const firstName = user?.name?.split(' ')[0] || 'there';
  const solved = useMemo(() => problems.filter(p => ['Solved','Solved-Optimally','Mastered'].includes(p.status)).length, [problems]);
  const mastery = problems.length ? Math.round((solved / problems.length) * 100) : 0;

  return (
    <section className="view dashboard-view">
      <div className="dashboard-topline"><div><span className="eyebrow">YOUR COMMAND CENTER</span><h1>Good morning, {firstName}. <span>✦</span></h1><p>One focused session today is another step toward your next offer.</p></div><button className="btn btn-primary hero-action" onClick={() => navigate('/practice?new=1')}>+ Log a problem</button></div>
      {!loaded ? <div className="empty"><b>Loading your workspace…</b></div> : <>
        {error && <div className="empty" style={{marginBottom:18}}><b>{error}</b><div style={{marginTop:8}}>Your interface is ready; start the backend or refresh to load live data.</div></div>}
        <div className="hero-grid">
          <div className="hero-card">
            <div className="hero-card-copy"><span className="section-kicker">CURRENT MOMENTUM</span><h2>{solved} <small>problems solved</small></h2><p>{mastery >= 70 ? 'Your consistency is paying off. Keep the streak alive.' : 'Build your base one problem at a time. Consistency beats intensity.'}</p><button className="text-action" onClick={() => navigate('/practice')}>Open problem library <span>↗</span></button></div>
            <div className="readiness-ring" style={{ '--progress': `${Math.max(mastery, 4)}%` }}><div><strong>{mastery}%</strong><span>mastery</span></div></div>
          </div>
          <div className="focus-card"><div className="focus-top"><span className="section-kicker">TODAY'S FOCUS</span><span className="focus-icon">✦</span></div><h3>{problems.find(p => p.status === 'Needs Revisit')?.title || 'Choose your next challenge'}</h3><p>{problems.some(p => p.status === 'Needs Revisit') ? 'A weak spot is waiting for a second pass.' : 'Log a problem and build your first review queue.'}</p><button className="btn btn-secondary" onClick={() => navigate('/practice')}>Continue practice →</button></div>
        </div>

        <StatGrid problems={problems} mockSessions={mockSessions} />

        <div className="section-heading"><div><span className="eyebrow">ANALYTICS</span><h2>See where your effort compounds.</h2></div><span className="muted-chip">Live from your practice history</span></div>
        <div className="grid2 analytics-grid">
          <div className="card premium-card chart-card"><div className="card-heading"><div><span className="section-kicker">TOPICS</span><h3>Coverage by topic</h3></div><span className="mini-arrow">↗</span></div><TopicsChart problems={problems} /></div>
          <div className="card premium-card chart-card"><div className="card-heading"><div><span className="section-kicker">DIFFICULTY</span><h3>Where you're solving</h3></div></div><DifficultyChart problems={problems} /></div>
        </div>
        <div className="card premium-card heat-card"><div className="card-heading"><div><span className="section-kicker">CONSISTENCY</span><h3>Practice activity</h3></div><span className="muted-chip">18 week view</span></div><Heatmap problems={problems} mockSessions={mockSessions} /></div>
        <div className="grid2 bottom-grid"><div className="card premium-card chart-card"><div className="card-heading"><div><span className="section-kicker">TREND</span><h3>Problems solved per week</h3></div></div><TrendChart problems={problems} /></div><WeakAndDue problems={problems} /></div>
      </>}
    </section>
  );
}
