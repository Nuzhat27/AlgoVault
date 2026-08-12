import { useState } from 'react';
import { marked } from 'marked';

export default function MarkdownField({ label, value, onChange, rows = 4 }) {
  const [tab, setTab] = useState('write');

  return (
    <div className="field">
      <label>{label} <span style={{ textTransform: 'none', color: 'var(--text-faint)' }}>(markdown)</span></label>
      <div className="tabs">
        <button type="button" className={tab === 'write' ? 'active' : ''} onClick={() => setTab('write')}>Write</button>
        <button type="button" className={tab === 'preview' ? 'active' : ''} onClick={() => setTab('preview')}>Preview</button>
      </div>
      {tab === 'write' ? (
        <textarea
          rows={rows}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ borderTop: 'none', borderRadius: '0 0 7px 7px' }}
        />
      ) : (
        <div
          className="md-preview"
          dangerouslySetInnerHTML={{ __html: marked.parse(value || '*Nothing yet.*') }}
        />
      )}
    </div>
  );
}
