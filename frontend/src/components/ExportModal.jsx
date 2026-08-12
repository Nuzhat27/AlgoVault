import Modal from './Modal';
import { useData } from '../context/DataContext';

function download(filename, content, mime) {
  const blob = new Blob([content], { type: mime });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export default function ExportModal({ onClose }) {
  const { problems, patterns } = useData();

  const exportJSON = () => {
    download('dsa-tracker-export.json', JSON.stringify({ problems, patterns }, null, 2), 'application/json');
  };

  const exportMarkdown = () => {
    let md = `# DSA Practice Export\n\nGenerated ${new Date().toLocaleString()}\n\n`;
    const patternById = (id) => patterns.find((p) => p._id === id);
    problems.forEach((p) => {
      md += `## ${p.title || 'Untitled'}\n\n`;
      md += `- Difficulty: ${p.difficulty}${p.personalDifficulty ? ` (felt like ${p.personalDifficulty})` : ''}\n`;
      md += `- Status: ${p.status}\n`;
      if (p.sourceLink) md += `- Link: ${p.sourceLink}\n`;
      if (p.topics?.length) md += `- Topics: ${p.topics.join(', ')}\n`;
      if (p.patterns?.length) md += `- Patterns: ${p.patterns.map((id) => patternById(id)?.name).filter(Boolean).join(', ')}\n`;
      md += `- Time complexity: ${p.timeComplexity || '—'} · Space complexity: ${p.spaceComplexity || '—'}\n\n`;
      if (p.description) md += `### Description\n${p.description}\n\n`;
      if (p.approach) md += `### Approach\n${p.approach}\n\n`;
      (p.codeVersions || []).forEach((v) => {
        md += `### Code — ${v.label} (${v.language})\n\`\`\`${v.language}\n${v.code}\n\`\`\`\n\n`;
      });
      (p.evaluations || []).forEach((e) => {
        md += `### Evaluation — ${new Date(e.createdAt).toLocaleString()} (${e.report?.rating}, ${e.report?.overallScore}/10)\n`;
        md += `**Transcript:** ${e.transcript}\n\n`;
        if (e.report?.shortcomings) md += `**Shortcomings:** ${e.report.shortcomings.join('; ')}\n\n`;
        if (e.report?.suggestions) md += `**Suggestions:** ${e.report.suggestions.join('; ')}\n\n`;
      });
      md += `\n---\n\n`;
    });
    download('dsa-tracker-export.md', md, 'text/markdown');
  };

  return (
    <Modal onClose={onClose} narrow>
      <div className="modal-head">
        <h2>Export data</h2>
        <button className="btn btn-ghost btn-sm" onClick={onClose}>✕</button>
      </div>
      <div className="modal-body">
        <p style={{ color: 'var(--text-dim)', fontSize: 13, marginTop: 0 }}>
          Only text is exported — notes, code, transcripts, and evaluation reports. No audio is ever stored.
        </p>
        <button className="btn btn-block" style={{ marginBottom: 8, justifyContent: 'space-between' }} onClick={exportJSON}>
          Export All — JSON <span>⇩</span>
        </button>
        <button className="btn btn-block" style={{ justifyContent: 'space-between' }} onClick={exportMarkdown}>
          Export All — Markdown <span>⇩</span>
        </button>
      </div>
    </Modal>
  );
}
