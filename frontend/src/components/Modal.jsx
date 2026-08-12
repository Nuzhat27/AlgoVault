export default function Modal({ onClose, narrow, children }) {
  return (
    <div
      className="overlay show"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={`modal${narrow ? ' narrow' : ''}`}>{children}</div>
    </div>
  );
}
