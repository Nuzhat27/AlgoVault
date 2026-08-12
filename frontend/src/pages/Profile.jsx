import { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

export default function Profile() {
  const { user } = useAuth();
  const { problems, patterns, mockSessions } = useData();
  const solved = useMemo(() => problems.filter(p => ['Solved','Solved-Optimally','Mastered'].includes(p.status)).length, [problems]);
  return <section className="profile-page">
    <div className="profile-header"><span className="eyebrow">PROFILE</span><h1>Your AlgoFlow profile</h1><p>Your account, workspace details and practice snapshot.</p></div>
    <div className="profile-card">
      <div className="profile-row"><span>NAME</span><strong>{user?.name || 'AlgoFlow User'}</strong></div>
      <div className="profile-row"><span>EMAIL ADDRESS</span><strong>{user?.email || 'No email available'}</strong></div>
      <div className="profile-row"><span>ROLE</span><strong>{user?.role || 'Student'}</strong></div>
      <div className="profile-row"><span>REGISTRATION NUMBER</span><strong>{user?.registrationNumber || '—'}</strong></div>
    </div>
    <div className="profile-extra">
      <div className="profile-mini"><span>Problems solved</span><strong>{solved}</strong></div>
      <div className="profile-mini"><span>Patterns</span><strong>{patterns.length}</strong></div>
      <div className="profile-mini"><span>Mock sessions</span><strong>{mockSessions.length}</strong></div>
    </div>
  </section>;
}
