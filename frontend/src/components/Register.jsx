import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthNavbar from '../components/AuthNavbar';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await register(name, email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create account.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-shell auth-register-shell">
      <div className="auth-orb orb-one" />
      <div className="auth-orb orb-two" />
      <AuthNavbar />

      <main className="register-page">
        <section className="register-intro">
          <span className="eyebrow">START YOUR TRACK</span>
          <h1>Build your <em>interview edge.</em></h1>
          <p>Create your AlgoFlow workspace and keep every problem, pattern, review and mock interview in one focused system.</p>
          <div className="register-points">
            <div><span>01</span><b>Track progress</b><small>See what you have mastered and what needs attention.</small></div>
            <div><span>02</span><b>Practice with intent</b><small>Turn solved problems into repeatable interview patterns.</small></div>
            <div><span>03</span><b>Stay interview-ready</b><small>Use reviews and mock sessions to close weak spots.</small></div>
          </div>
        </section>

        <section className="auth-card premium-card register-card">
          <div className="auth-card-head"><span>CREATE WORKSPACE</span><b>01</b></div>
          <h2>Create your account</h2>
          <p className="auth-sub">Set up your personal DSA practice workspace.</p>
          {error && <div className="auth-error">{error}</div>}
          <form onSubmit={submit}>
            <div className="field">
              <label>Name</label>
              <input className="premium-input" value={name} onChange={(e) => setName(e.target.value)} required autoFocus placeholder="Your name" />
            </div>
            <div className="field">
              <label>Email address</label>
              <input className="premium-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" />
            </div>
            <div className="field">
              <div className="field-label-row"><label>Password</label><span>6+ characters</span></div>
              <input className="premium-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} required placeholder="Create a password" />
            </div>
            <button className="btn btn-primary btn-block premium-submit" disabled={busy}>{busy ? 'Creating account…' : 'Create account  →'}</button>
          </form>
          <div className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></div>
        </section>
      </main>

      <div className="auth-footer">Built for focused DSA practice <span>•</span> Your progress stays yours</div>
    </div>
  );
}
