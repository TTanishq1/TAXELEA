export function Logo({ compact }) {
  return (
    <div className="flex items-center gap-3">
      <svg width="40" height="40" viewBox="0 0 40 40" className="shrink-0">
        <circle cx="20" cy="20" r="18.5" fill="none" stroke="#3a3a3d" strokeWidth="1.2" />
        <circle cx="20" cy="20" r="15.5" fill="none" stroke="#6b6b6e" strokeWidth="0.6" />
        <text x="20" y="27" textAnchor="middle" fontFamily="Georgia, serif" fontSize="18" fill="#e5e5e5">T</text>
      </svg>
      {!compact && (
        <div className="leading-tight">
          <div className="text-[var(--text-primary)] font-semibold tracking-[0.15em] text-[15px]" style={{ fontFamily: "Georgia, serif" }}>TAXELEA</div>
          <div className="text-[10px] text-[var(--text-faint)] tracking-wide">Smart Test Preparation</div>
        </div>
      )}
    </div>
  );
}
