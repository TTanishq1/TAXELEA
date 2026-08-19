export function Logo({ compact }) {
  return (
    <div className="flex items-center gap-3">
      <img 
        src="/assets/logo.png" 
        alt="TAXELEA logo" 
        width="40" 
        height="40" 
        className="shrink-0"
      />
      {!compact && (
        <div className="leading-tight">
          <div className="text-[var(--text-primary)] font-semibold tracking-[0.15em] text-[15px]" style={{ fontFamily: "Georgia, serif" }}>TAXELEA</div>
          <div className="text-[10px] text-[var(--text-faint)] tracking-wide">Smart Test Preparation</div>
        </div>
      )}
    </div>
  );
}
