export function Card({ children, className = "" }) {
  return (
    <div className={`rounded-xl border border-[var(--border)] bg-[var(--card-bg)] shadow-[var(--shadow)] ${className}`}>
      {children}
    </div>
  );
}
