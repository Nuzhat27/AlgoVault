export const todayStr = (d = new Date()) => new Date(d).toISOString().slice(0, 10);

export const daysBetween = (a, b) => Math.round((new Date(b) - new Date(a)) / 86400000);

export function timeAgo(iso) {
  const d = daysBetween(iso, new Date().toISOString());
  if (d <= 0) return 'today';
  if (d === 1) return 'yesterday';
  return d + 'd ago';
}

export function fmtTime(s) {
  const m = Math.floor(Math.max(s, 0) / 60);
  const sec = Math.max(s, 0) % 60;
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

export function ratingClass(rating) {
  if (!rating) return 'lean';
  const s = rating.toLowerCase();
  if (s.includes('strong')) return 'strong';
  if (s.includes('no')) return 'no';
  if (s.includes('lean')) return 'lean';
  return 'hire';
}

export const STATUSES = ['New', 'Attempted', 'Solved', 'Solved-Optimally', 'Needs Revisit', 'Mastered'];
export const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];
export const LANGUAGES = ['python', 'javascript', 'java', 'c++', 'go'];

export function allTopics(problems) {
  const s = new Set();
  problems.forEach((p) => (p.topics || []).forEach((t) => s.add(t)));
  return [...s].sort();
}

export function shuffle(arr) {
  return arr
    .map((v) => [Math.random(), v])
    .sort((a, b) => a[0] - b[0])
    .map((v) => v[1]);
}

export function pickWeighted(problems, n, biasWeak) {
  const topics = allTopics(problems);
  const weight = (t) => {
    const probs = problems.filter((p) => p.topics.includes(t));
    const solved = probs.filter((p) => ['Solved', 'Solved-Optimally', 'Mastered'].includes(p.status)).length;
    return probs.length ? 1 - solved / probs.length + 0.1 : 0.1;
  };
  const pool = problems.slice();
  if (!biasWeak || !topics.length) return shuffle(pool).slice(0, n);
  const scored = pool
    .map((p) => {
      const w = p.topics.length ? Math.max(...p.topics.map(weight)) : 0.3;
      return { p, w: w + Math.random() * 0.3 };
    })
    .sort((a, b) => b.w - a.w);
  return scored.slice(0, n).map((s) => s.p);
}
