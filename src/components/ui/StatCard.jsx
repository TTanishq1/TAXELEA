import { Card } from "./Card.jsx";
import { DonutProgress } from "./DonutProgress.jsx";

export function StatCard({ icon: Icon, label, value, sub, subColor, iconColor, ring }) {
  return (
    <Card className="p-4 relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[var(--text-muted)] text-xs mb-3">{label}</div>
          {ring ? (
            <div className="flex items-center gap-3">
              <div className="relative">
                <DonutProgress value={ring} color={iconColor} />
                <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-[var(--text-primary)]">{ring}%</div>
              </div>
            </div>
          ) : (
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-[var(--text-primary)]">{value}</span>
              {sub && <span className="text-xs text-[var(--text-faint)]">{sub}</span>}
            </div>
          )}
        </div>
        {!ring && <Icon size={20} style={{ color: iconColor }} strokeWidth={2} />}
      </div>
      {subColor && <div className="text-xs mt-1 font-medium" style={{ color: subColor }}>{subColor.text}</div>}
    </Card>
  );
}
