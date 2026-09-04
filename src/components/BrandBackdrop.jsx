export function BrandBackdrop() {
  return (
    <div className="brand-backdrop" aria-hidden="true">
      <div className="brand-backdrop-mark">
        <img src="/assets/logo.png" alt="" width="72" height="72" />
        <span>TAXELEA</span>
      </div>
      <div className="brand-backdrop-orbit">
        <video autoPlay loop muted playsInline preload="metadata" src="/assets/hero.mp4" />
        <div className="brand-equalizer">
          <i />
          <i />
          <i />
          <i />
          <i />
          <i />
          <i />
        </div>
      </div>
    </div>
  );
}
