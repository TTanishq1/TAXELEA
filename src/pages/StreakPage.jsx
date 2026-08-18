import { Flame, Trophy } from "lucide-react";
import { Card } from "../components/ui/Card.jsx";
import { ActivityCalendar } from "../components/ActivityCalendar.jsx";

export function StreakPage() {
  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
      <div>
        <h1 className="text-xl font-bold text-[var(--text-primary)]">Streak</h1>
        <p className="text-[var(--text-faint)] text-sm mt-1">Consistency compounds. Keep showing up.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
        <Card className="p-6 text-center">
          <Flame size={32} className="mx-auto text-red-500 mb-2" fill="#ef4444" />
          <div className="text-3xl font-bold text-[var(--text-primary)]">14 days</div>
          <div className="text-xs text-[var(--text-faint)] mt-1">Current Streak</div>
        </Card>
        <Card className="p-6 text-center">
          <Trophy size={32} className="mx-auto text-red-500 mb-2" />
          <div className="text-3xl font-bold text-[var(--text-primary)]">27 days</div>
          <div className="text-xs text-[var(--text-faint)] mt-1">Longest Streak</div>
        </Card>
      </div>
      <ActivityCalendar />
    </div>
  );
}
