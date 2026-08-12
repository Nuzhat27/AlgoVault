export default function TagInput({ items, onAdd, onRemove, placeholder }) {
  return (
    <div className="tag-input">
      {items.map((it) => (
        <span className="tag" key={it.id || it.label}>
          {it.label}
          <button type="button" onClick={() => onRemove(it)}>×</button>
        </span>
      ))}
      <input
        placeholder={placeholder || 'add + Enter'}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && e.target.value.trim()) {
            e.preventDefault();
            onAdd(e.target.value.trim());
            e.target.value = '';
          }
        }}
      />
    </div>
  );
}
