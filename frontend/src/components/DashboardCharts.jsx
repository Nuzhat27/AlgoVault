import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { allTopics } from '../utils/helpers';

function useThemeColors() {
  const gridColor = getComputedStyle(document.documentElement).getPropertyValue('--border-soft').trim() || '#1d2430';
  const textColor = getComputedStyle(document.documentElement).getPropertyValue('--text-dim').trim() || '#8b93a7';
  return { gridColor, textColor };
}

export function TopicsChart({ problems }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  const { gridColor, textColor } = useThemeColors();

  useEffect(() => {
    const topics = allTopics(problems);
    const counts = topics.map((t) => problems.filter((p) => p.topics.includes(t)).length);
    chartRef.current?.destroy();
    chartRef.current = new Chart(canvasRef.current, {
      type: 'bar',
      data: {
        labels: topics.length ? topics : ['No data'],
        datasets: [{ data: topics.length ? counts : [0], backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || '#8b6cff', borderRadius: 4, maxBarThickness: 26 }],
      },
      options: {
        plugins: { legend: { display: false } },
        scales: {
          x: { ticks: { color: textColor, font: { size: 10.5 } }, grid: { display: false } },
          y: { ticks: { color: textColor, precision: 0 }, grid: { color: gridColor } },
        },
      },
    });
    return () => chartRef.current?.destroy();
  }, [problems]); // eslint-disable-line react-hooks/exhaustive-deps

  return <canvas ref={canvasRef} height="220" />;
}

export function DifficultyChart({ problems }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  const { textColor } = useThemeColors();

  useEffect(() => {
    const diffs = ['Easy', 'Medium', 'Hard'];
    const counts = diffs.map((d) => problems.filter((p) => p.difficulty === d).length);
    chartRef.current?.destroy();
    chartRef.current = new Chart(canvasRef.current, {
      type: 'doughnut',
      data: { labels: diffs, datasets: [{ data: counts, backgroundColor: [getComputedStyle(document.documentElement).getPropertyValue('--easy').trim() || '#48d49b', getComputedStyle(document.documentElement).getPropertyValue('--medium').trim() || '#f2b84b', getComputedStyle(document.documentElement).getPropertyValue('--hard').trim() || '#ff6f7d'], borderWidth: 0 }] },
      options: { plugins: { legend: { position: 'bottom', labels: { color: textColor, font: { size: 11.5 } } } } },
    });
    return () => chartRef.current?.destroy();
  }, [problems]); // eslint-disable-line react-hooks/exhaustive-deps

  return <canvas ref={canvasRef} height="220" />;
}

export function TrendChart({ problems }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  const { gridColor, textColor } = useThemeColors();

  useEffect(() => {
    const weekLabels = [];
    const weekCounts = [];
    for (let i = 11; i >= 0; i--) {
      const wEnd = new Date();
      wEnd.setDate(wEnd.getDate() - i * 7);
      const wStart = new Date(wEnd);
      wStart.setDate(wEnd.getDate() - 6);
      weekLabels.push(`${wStart.getMonth() + 1}/${wStart.getDate()}`);
      let c = 0;
      problems.forEach((p) =>
        (p.practiceSessions || []).forEach((s) => {
          if (s.outcome === 'solved') {
            const d = new Date(s.timestamp);
            if (d >= wStart && d <= wEnd) c++;
          }
        })
      );
      weekCounts.push(c);
    }
    chartRef.current?.destroy();
    chartRef.current = new Chart(canvasRef.current, {
      type: 'line',
      data: {
        labels: weekLabels,
        datasets: [{ data: weekCounts, borderColor: getComputedStyle(document.documentElement).getPropertyValue('--cyan').trim() || '#62d6e9', backgroundColor: 'rgba(98,214,233,.10)', fill: true, tension: 0.3, pointRadius: 2 }],
      },
      options: {
        plugins: { legend: { display: false } },
        scales: {
          x: { ticks: { color: textColor, font: { size: 10 } }, grid: { display: false } },
          y: { ticks: { color: textColor, precision: 0 }, grid: { color: gridColor } },
        },
      },
    });
    return () => chartRef.current?.destroy();
  }, [problems]); // eslint-disable-line react-hooks/exhaustive-deps

  return <canvas ref={canvasRef} height="180" />;
}
