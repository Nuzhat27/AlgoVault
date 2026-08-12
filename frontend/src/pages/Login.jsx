import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setBusy(true);

    try {
      await login(email, password);

      const destination = location.state?.from?.pathname || "/dashboard";
      navigate(destination, { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Could not sign in. Please try again."
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-shell">
      <main className="auth-layout">
        <section className="auth-showcase">
          <span className="eyebrow">DSA COMMAND CENTER</span>
          <h1>Turn practice into<br /><em>interview readiness.</em></h1>
          <p>
            Track problems, master patterns, review weak spots and build
            consistent interview confidence from one focused workspace.
          </p>
          <div className="showcase-pills">
            <span>✦ Smart review</span>
            <span>◈ Pattern mastery</span>
            <span>◷ Focused practice</span>
          </div>
        </section>

        <section className="auth-card premium-card login-card">
          <div className="auth-card-head"><span>WELCOME BACK</span><b>01</b></div>
          <h2>Sign in to your workspace</h2>
          <p className="auth-sub">Continue where your last session ended.</p>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={submit}>
            <div className="field">
              <label htmlFor="login-email">Email address</label>
              <input
                id="login-email"
                className="premium-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
                placeholder="you@example.com"
              />
            </div>

            <div className="field">
              <label htmlFor="login-password">Password</label>
              <input
                id="login-password"
                className="premium-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>

            <button className="btn btn-primary btn-block premium-submit" disabled={busy}>
              {busy ? "Signing in…" : "Enter workspace →"}
            </button>
          </form>

          <div className="auth-switch">
            New to AlgoFlow? <Link to="/register">Create your account</Link>
          </div>
        </section>
      </main>
    </div>
  );
}
