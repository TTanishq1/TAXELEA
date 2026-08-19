export function Card({ children, className = "" }) {
  return (
    <div className={`rounded-xl border border-[var(--border)] shadow-sm ${className}`}>
      {children}
    </div>
  );
}
