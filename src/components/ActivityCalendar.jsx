import { useMemo } from "react";
import { ChevronDown, Info } from "lucide-react";
import { Card } from "./ui/Card.jsx";

export function ActivityCalendar() {
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  const weeks = 48;
  const cell = useMemo(() => {
    const seeded = [];
    let s = 42;
    const rand = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
    for (let w = 0; w < weeks; w++) {
      const col = [];
      for (let d = 0; d < 7; d++) {
        const isWeekday = d < 5;
        const base = rand();
        const val = isWeekday ? base * 0.75 + 0.2 : base * 0.4;
        col.push(val);
      }
      seeded.push(col);
    }
    return seeded;
  }, []);
  const colorFor = (v) => {
    if (v < 0.15) return "#1a1a1c";
    if (v < 0.35) return "#4c1414";
    if (v < 0.55) return "#7a1c1c";
    if (v < 0.75) return "#b32323";
    return "#ef4444";
  };
  return (
    <Card className="p-4 sm:p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1.5 text-[var(--text-primary)] font-semibold text-sm">
          Activity Calendar <Info size={13} className="text-[var(--text-faint)]" />
        </div>
        <button className="flex items-center gap-1 text-xs text-[var(--text-muted)] border border-[var(--border-strong)] rounded-lg px-2.5 py-1.5 shrink-0">
          This Year <ChevronDown size={12} />
        </button>
      </div>
      <div className="overflow-x-auto">
        <div style={{ minWidth: `${28 + weeks * 13}px` }}>
          <div className="flex text-[10px] text-[var(--text-faint)] mb-1.5" style={{ paddingLeft: 28 }}>
            {months.map((m) => (
              <div key={m} style={{ width: `${13 * (weeks / 12)}px` }}>{m}</div>
            ))}
          </div>
          <div className="flex gap-[3px]">
            <div className="flex flex-col gap-[3px] text-[10px] text-[var(--text-faint)] justify-between shrink-0" style={{ width: 24 }}>
              {days.map((d) => <div key={d} className="h-[11px] leading-[11px]">{d}</div>)}
            </div>
            <div className="flex gap-[3px]">
              {cell.map((col, i) => (
                <div key={i} className="flex flex-col gap-[3px]" style={{ width: 11 }}>
                  {col.map((v, j) => (
                    <div key={j} className="h-[11px] rounded-[2px]" style={{ backgroundColor: colorFor(v) }} />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-end gap-1.5 mt-3 text-[10px] text-[var(--text-faint)]">
        Less
        {[0.05,0.25,0.45,0.65,0.9].map((v,i) => (
          <div key={i} className="w-[11px] h-[11px] rounded-[2px]" style={{ backgroundColor: colorFor(v) }} />
        ))}
        More
      </div>
    </Card>
  );
}
