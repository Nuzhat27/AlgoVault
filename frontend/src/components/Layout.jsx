import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import ShortcutsModal from './ShortcutsModal';
import ExportModal from './ExportModal';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

const titles = { '/': 'Overview', '/problems': 'Problems', '/patterns': 'Pattern Library', '/mock': 'Mock Interview' };

export default function Layout() {
  const { problems } = useData();
  const { user } = useAuth();
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const title = titles[location.pathname] || 'AlgoFlow';

  useEffect(() => {
    function onKeydown(e) {
      const tag = (e.target.tagName || '').toLowerCase();
      const typing = tag === 'input' || tag === 'textarea' || e.target.isContentEditable;
      if (e.key === 'Escape') { setShowShortcuts(false); setShowExport(false); setMenuOpen(false); return; }
      if (typing) return;
      if (e.key === '/') { e.preventDefault(); navigate('/problems?focusSearch=1'); }
      else if (e.key.toLowerCase() === 'n') navigate('/problems?new=1');
      else if (e.key === '?') setShowShortcuts(true);
    }
    document.addEventListener('keydown', onKeydown);
    return () => document.removeEventListener('keydown', onKeydown);
  }, [navigate]);

  return (
    <div className="app-shell">
      <Sidebar problemCount={problems.length} onShowShortcuts={() => setShowShortcuts(true)} onShowExport={() => setShowExport(true)} open={menuOpen} onClose={() => setMenuOpen(false)} />
      <main className="main">
        <header className="mobile-topbar">
          <button className="menu-btn" onClick={() => setMenuOpen(true)} aria-label="Open menu">☰</button>
          <div><span>{title}</span><small>ALGOFLOW</small></div>
          <div className="mobile-avatar">{(user?.name || 'D').split(' ').map(x => x[0]).slice(0,2).join('').toUpperCase()}</div>
        </header>
        <Outlet />
      </main>
      {showShortcuts && <ShortcutsModal onClose={() => setShowShortcuts(false)} />}
      {showExport && <ExportModal onClose={() => setShowExport(false)} />}
    </div>
  );
}
