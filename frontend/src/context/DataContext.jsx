import { createContext, useContext, useCallback, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import * as apiFn from '../api/endpoints';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const { user } = useAuth();
  const [problems, setProblems] = useState([]);
  const [patterns, setPatterns] = useState([]);
  const [mockSessions, setMockSessions] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState('');

  const refreshAll = useCallback(async () => {
    setLoaded(false);
    setError('');
    const results = await Promise.allSettled([
      apiFn.fetchProblems(),
      apiFn.fetchPatterns(),
      apiFn.fetchMockSessions(),
    ]);

    const [p, pt, m] = results;
    if (p.status === 'fulfilled') setProblems(p.value || []);
    if (pt.status === 'fulfilled') setPatterns(pt.value || []);
    if (m.status === 'fulfilled') setMockSessions(m.value || []);

    const failures = results.filter(r => r.status === 'rejected');
    if (failures.length === 3) setError('Your workspace data could not be loaded. Check that the backend is running.');
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (user) refreshAll();
    else {
      setProblems([]);
      setPatterns([]);
      setMockSessions([]);
      setError('');
      setLoaded(false);
    }
  }, [user, refreshAll]);

  const upsertProblem = useCallback((problem) => {
    setProblems(prev => prev.some(p => p._id === problem._id) ? prev.map(p => p._id === problem._id ? problem : p) : [problem, ...prev]);
  }, []);
  const removeProblem = useCallback((id) => setProblems(prev => prev.filter(p => p._id !== id)), []);
  const upsertPattern = useCallback((pattern) => setPatterns(prev => prev.some(p => p._id === pattern._id) ? prev.map(p => p._id === pattern._id ? pattern : p) : [...prev, pattern]), []);
  const removePattern = useCallback((id) => {
    setPatterns(prev => prev.filter(p => p._id !== id));
    setProblems(prev => prev.map(p => ({ ...p, patterns: (p.patterns || []).filter(x => x !== id) })));
  }, []);
  const addMockSession = useCallback(session => setMockSessions(prev => [session, ...prev]), []);

  return <DataContext.Provider value={{ problems, patterns, mockSessions, loaded, error, refreshAll, upsertProblem, removeProblem, upsertPattern, removePattern, addMockSession }}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
