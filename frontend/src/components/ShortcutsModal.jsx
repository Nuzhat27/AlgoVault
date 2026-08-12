import Modal from './Modal';

export default function ShortcutsModal({ onClose }) {
  const rows = [
    ['Save current note', '⌘/Ctrl + Enter'],
    ['Focus search', '/'],
    ['New problem', 'n'],
    ['Close modal / panel', 'Esc'],
    ['Show this cheat sheet', '?'],
  ];
  return (
    <Modal onClose={onClose} narrow>
      <div className="modal-head">
        <h2>Keyboard shortcuts</h2>
        <button className="btn btn-ghost btn-sm" onClick={onClose}>✕</button>
      </div>
      <div className="modal-body">
        {rows.map(([label, key]) => (
          <div className="shortcut-row" key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid var(--border-soft)', fontSize: 13 }}>
            <span>{label}</span>
            <span className="kbd" style={{ fontFamily: "'JetBrains Mono',monospace", background: 'var(--surface-3)', border: '1px solid var(--border)', padding: '1px 7px', borderRadius: 5, fontSize: 11.5 }}>{key}</span>
          </div>
        ))}
      </div>
    </Modal>
  );
}
