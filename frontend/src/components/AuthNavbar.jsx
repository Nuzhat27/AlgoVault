import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './auth-navbar.css';

function Brand() {
  return <Link to="/" className="af-brand"><span className="af-brand-mark"><span /><span /><span /></span><span className="af-brand-copy"><strong>AlgoVault</strong><small>DSA COMMAND CENTER</small></span></Link>;
}

export default function AuthNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const logoutNow = () => { logout(); navigate('/login', { replace: true }); };

  return (
    <header className="af-navbar">
      <div className="af-navbar-inner">
        <Brand />
        {!user ? (
          <nav className="af-nav af-public-nav">
            <span className="af-nav-context">Your interview workspace</span>
            <Link to="/login" className="af-signin">Sign in</Link>
            <Link to="/register" className="af-create">Create account</Link>
          </nav>
        ) : (
          <nav className="af-nav af-auth-nav">
            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink to="/practice">Practice</NavLink>
            <NavLink to="/progress">Progress</NavLink>
            <NavLink to="/profile">Profile</NavLink>
            <button type="button" className="af-logout" onClick={logoutNow}>Logout <span>→</span></button>
          </nav>
        )}
      </div>
    </header>
  );
}
