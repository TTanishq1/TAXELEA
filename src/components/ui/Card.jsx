export function Card({ children, className = "" }) {
  return (
    <div className={`bg-[var(--card-bg)] border border-[var(--border)] rounded-xl ${className}`}>
      {children}
    </div>
  );
}
