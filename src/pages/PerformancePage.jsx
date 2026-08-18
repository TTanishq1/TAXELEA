import { Card } from "../components/ui/Card.jsx";

export function PerformancePage({ results, stats }) {
  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
      <div>
        <h1 className="text-xl font-bold text-[var(--text-primary)]">Performance</h1>
        <p className="text-[var(--text-faint)] text-sm mt-1">Your accuracy and progress across every attempt.</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="p-4">
          <div className="text-[var(--text-muted)] text-xs mb-2">Overall Accuracy</div>
          <div className="text-2xl font-bold text-[var(--text-primary)]">{stats.accuracy}%</div>
        </Card>
        <Card className="p-4">
          <div className="text-[var(--text-muted)] text-xs mb-2">Questions Solved</div>
          <div className="text-2xl font-bold text-[var(--text-primary)]">{stats.questionsSolved}</div>
        </Card>
        <Card className="p-4">
          <div className="text-[var(--text-muted)] text-xs mb-2">Tests Attempted</div>
          <div className="text-2xl font-bold text-[var(--text-primary)]">{stats.testsAttempted}</div>
        </Card>
        <Card className="p-4">
          <div className="text-[var(--text-muted)] text-xs mb-2">Sessions Logged</div>
          <div className="text-2xl font-bold text-[var(--text-primary)]">{results.length}</div>
        </Card>
      </div>
      <Card className="p-5">
        <div className="text-[var(--text-primary)] font-semibold text-sm mb-3">Subject-wise Accuracy</div>
        <div className="space-y-4">
          {Object.entries(stats.subjectProgress).map(([key, sp]) => {
            const Icon = sp.icon;
            return (
              <div key={key}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <Icon size={14} style={{ color: sp.color }} />
                    <span className="text-sm text-[var(--text-secondary)]">{sp.label}</span>
                  </div>
                  <span className="text-sm font-semibold text-[var(--text-primary)]">{sp.acc}%</span>
                </div>
                <div className="h-1.5 bg-[var(--track-bg)] rounded-full overflow-hidden">
                  <div className="h-full" style={{ width: `${sp.acc}%`, backgroundColor: sp.color }} />
                </div>
              </div>
            );
          })}
        </div>
      </Card>
      <Card className="p-5">
        <div className="text-[var(--text-primary)] font-semibold text-sm mb-3">Session History</div>
        {results.length === 0 ? (
          <p className="text-xs text-[var(--text-faint)]">No sessions yet — complete a practice test to see it here.</p>
        ) : (
          <div className="space-y-1">
            {results.map((r) => (
              <div key={r.id} className="flex items-center justify-between py-2 border-b border-[var(--border)] last:border-0">
                <span className="text-sm text-[var(--text-secondary)]">{r.title}</span>
                <span className="text-sm text-[var(--text-muted)]">{r.score}/{r.total} · <span className="text-red-500 font-medium">{Math.round((r.score/r.total)*100)}%</span></span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
