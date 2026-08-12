import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Icon = ({ children }) => <span className="nav-icon" aria-hidden="true">{children}</span>;

export default function Sidebar({ problemCount = 0, onShowShortcuts, onShowExport, open = false, onClose }) {
  const { logout, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const firstName = user?.name?.split(' ')[0] || 'Developer';
  const initials = (user?.name || 'D').split(' ').map((x) => x[0]).slice(0, 2).join('').toUpperCase();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const close = () => onClose?.();

  return (
    <>
      {open && <button className="sidebar-backdrop" aria-label="Close menu" onClick={close} />}
      <aside className={`sidebar${open ? ' open' : ''}`}>
        <div className="brand">
          <div className="brand-mark"><span></span><span></span><span></span></div>
          <div className="brand-copy">
            <strong>AlgoFlow</strong>
            <small>DSA COMMAND CENTER</small>
          </div>
          <button className="mobile-close" onClick={close} aria-label="Close navigation">×</button>
        </div>

        <div className="sidebar-profile">
          <div className="avatar">{initials}</div>
          <div className="profile-copy"><strong>{firstName}</strong><span>Interview track</span></div>
          <span className="online-dot" />
        </div>

        <div className="nav-label">WORKSPACE</div>
        <nav className="nav">
          <NavLink to="/" end onClick={close} className={({ isActive }) => isActive ? 'active' : ''}>
            <Icon>⌂</Icon><span>Overview</span>
          </NavLink>
          <NavLink to="/problems" onClick={close} className={({ isActive }) => isActive ? 'active' : ''}>
            <Icon>◫</Icon><span>Problems</span><span className="nav-badge">{problemCount}</span>
          </NavLink>
          <NavLink to="/patterns" onClick={close} className={({ isActive }) => isActive ? 'active' : ''}>
            <Icon>◇</Icon><span>Patterns</span>
          </NavLink>
          <NavLink to="/mock" onClick={close} className={({ isActive }) => isActive ? 'active' : ''}>
            <Icon>◷</Icon><span>Mock interview</span>
          </NavLink>
        </nav>

        <div className="sidebar-progress">
          <div className="progress-top"><span>INTERVIEW READINESS</span><b>68%</b></div>
          <div className="progress-track"><span style={{ width: '68%' }} /></div>
          <small>Keep solving to unlock the next level.</small>
        </div>

        <div className="nav-label">TOOLS</div>
        <div className="sidebar-tools">
          <button onClick={onShowExport}><Icon>⇩</Icon><span>Export data</span></button>
          <button onClick={toggleTheme}><Icon>{theme === 'dark' ? '☼' : '☾'}</Icon><span>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span></button>
          <button onClick={onShowShortcuts}><Icon>⌘</Icon><span>Keyboard shortcuts</span><kbd>?</kbd></button>
        </div>

        <button className="logout-btn" onClick={handleLogout}><Icon>↪</Icon><span>Sign out</span></button>
      </aside>
    </>
  );
}
