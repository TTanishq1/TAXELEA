import { useMemo } from "react";
import {
  Flame, Trophy, Target, CheckCircle2, ClipboardList, Calendar, ArrowRight, Info, RefreshCw,
} from "lucide-react";
import { Card } from "../components/ui/Card.jsx";
import { DonutProgress } from "../components/ui/DonutProgress.jsx";
import { ActivityCalendar } from "../components/ActivityCalendar.jsx";
import { SECTIONAL_COUNTS } from "../data/catalog.js";

export function Dashboard({ setPage, startPractice, results, stats }) {
  const todayCount = 5;
  const todayDone = Math.min(stats.todayAnswered, todayCount);

  // Calculate streak from real attempts
  const streakData = useMemo(() => {
    if (results.length === 0) return { current: 0, longest: 0 };
    
    const dates = [...new Set(results.map(r => new Date(r.id).toDateString()))];
    dates.sort((a, b) => new Date(b) - new Date(a));
    
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    
    let currentStreak = 0;
    if (dates[0] === today || dates[0] === yesterday) {
      currentStreak = 1;
      for (let i = 1; i < dates.length; i++) {
        const prev = new Date(dates[i - 1]);
        const curr = new Date(dates[i]);
        const diffDays = Math.floor((prev - curr) / 86400000);
        if (diffDays === 1) currentStreak++;
        else break;
      }
    }
    
    // Calculate longest streak
    let longestStreak = 0;
    let tempStreak = 1;
    for (let i = 1; i < dates.length; i++) {
      const prev = new Date(dates[i - 1]);
      const curr = new Date(dates[i]);
      const diffDays = Math.floor((prev - curr) / 86400000);
      if (diffDays === 1) tempStreak++;
      else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak);
    
    return { current: currentStreak, longest: longestStreak };
  }, [results]);

  const recent = useMemo(() => {
    return results.slice(0, 4).map((r) => ({
      id: r.id, title: r.title, provider: r.provider, score: r.score, total: r.total,
      when: "Just now", color: r.color || "#ef4444",
    }));
  }, [results]);

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">Good Evening, Aspirant! <span>👋</span></h1>
        <p className="text-[var(--text-faint)] text-sm mt-1">Stay consistent. Every question counts.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <Card className="p-4">
          <div className="text-[var(--text-muted)] text-xs mb-3">Current Streak</div>
          <div className="flex items-center gap-2">
            <Flame size={20} className="text-red-500" fill={streakData.current > 0 ? "#ef4444" : "none"} />
            <span className="text-2xl font-bold text-[var(--text-primary)]">{streakData.current}</span>
            <span className="text-xs text-[var(--text-faint)]">days</span>
          </div>
          <div className="text-xs text-red-500 font-medium mt-1">{streakData.current > 0 ? "Keep it up 🔥" : "Start practicing!"}</div>
        </Card>
        <Card className="p-4">
          <div className="text-[var(--text-muted)] text-xs mb-3">Longest Streak</div>
          <div className="flex items-center gap-2">
            <Trophy size={18} className="text-red-500" />
            <span className="text-2xl font-bold text-[var(--text-primary)]">{streakData.longest}</span>
            <span className="text-xs text-[var(--text-faint)]">days</span>
          </div>
          <div className="text-xs text-red-500 font-medium mt-1">{streakData.longest > 0 ? "Best Record! 🏆" : "No streak yet"}</div>
        </Card>
        <Card className="p-4">
          <div className="text-[var(--text-muted)] text-xs mb-3">Daily Goal</div>
          <div className="flex items-center gap-2">
            <Target size={18} className="text-red-500" />
            <span className="text-2xl font-bold text-[var(--text-primary)]">{todayDone} / {todayCount}</span>
          </div>
          <div className="text-xs text-[var(--text-faint)] mt-1 mb-1.5">questions</div>
          <div className="h-1 bg-[var(--track-bg)] rounded-full overflow-hidden">
            <div className="h-full bg-red-600" style={{ width: `${(todayDone/todayCount)*100}%` }} />
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-[var(--text-muted)] text-xs mb-3">Questions Solved</div>
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} className="text-red-500" />
            <span className="text-2xl font-bold text-[var(--text-primary)]">{stats.questionsSolved}</span>
          </div>
          <div className="text-xs text-red-500 font-medium mt-1">+{stats.solvedThisWeek} this week</div>
        </Card>
        <Card className="p-4">
          <div className="text-[var(--text-muted)] text-xs mb-3">Accuracy</div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <DonutProgress value={stats.accuracy} size={56} stroke={6} color="#ef4444" />
              <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-[var(--text-primary)]">{stats.accuracy}%</div>
            </div>
          </div>
          <div className="text-xs text-red-500 font-medium mt-1">{stats.accDelta}</div>
        </Card>
        <Card className="p-4">
          <div className="text-[var(--text-muted)] text-xs mb-3">Tests Attempted</div>
          <div className="flex items-center gap-2">
            <ClipboardList size={18} className="text-red-500" />
            <span className="text-2xl font-bold text-[var(--text-primary)]">{stats.testsAttempted}</span>
          </div>
          <div className="text-xs text-red-500 font-medium mt-1">+{stats.testsThisWeek} this week</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="text-[var(--text-primary)] font-semibold text-sm">Today's Practice</div>
            <button className="flex items-center gap-1 text-xs text-[var(--text-muted)] border border-[var(--border-strong)] rounded-lg px-2.5 py-1.5">
              <Calendar size={12} /> Today
            </button>
          </div>
          <div className="text-xl font-bold text-[var(--text-primary)] mb-3">{todayCount} Questions</div>
          <div className="flex items-center gap-4 text-xs mb-3">
            <span className="text-[var(--text-faint)] font-medium">Daily goal</span>
          </div>
          <div className="h-1.5 bg-[var(--track-bg)] rounded-full overflow-hidden mb-2">
            <div className="h-full bg-green-500" style={{ width: `${(todayDone/todayCount)*100}%` }} />
          </div>
          <div className="text-xs text-[var(--text-faint)] mb-4">{todayDone} / {todayCount} Completed</div>
          <button onClick={() => setPage("practice")} className="w-full flex items-center justify-center gap-2 bg-red-700 hover:bg-red-600 transition-colors text-white text-sm font-medium rounded-lg py-2.5">
            Start Practice <ArrowRight size={15} />
          </button>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="text-[var(--text-primary)] font-semibold text-sm">Continue Practice</div>
            {results.length > 0 ? (
              <span className="text-[10px] font-medium text-[var(--danger-text)] bg-[var(--accent-soft-bg)] border border-[var(--accent-soft-border)] rounded px-2 py-1">In Progress</span>
            ) : (
              <span className="text-[10px] font-medium text-[var(--text-faint)] bg-[var(--elevated-bg)] border border-[var(--border)] rounded px-2 py-1">Not Started</span>
            )}
          </div>
          {results.length > 0 ? (
            <>
              <div className="text-base font-semibold text-[var(--text-primary)]">Recent Test</div>
              <div className="text-xs text-[var(--text-faint)] mb-3">{results[0].title}</div>
              <div className="flex items-end justify-between mb-1">
                <span className="text-lg font-bold text-[var(--text-primary)]">{results[0].score} / {results[0].total} <span className="text-xs font-normal text-[var(--text-faint)]">Questions</span></span>
                <div className="text-right">
                  <div className="text-lg font-bold text-[var(--text-primary)]">{Math.round((results[0].score/results[0].total)*100)}%</div>
                  <div className="text-[10px] text-[var(--text-faint)]">Accuracy</div>
                </div>
              </div>
              <div className="h-1.5 bg-[var(--track-bg)] rounded-full overflow-hidden mb-4 mt-2">
                <div className="h-full bg-red-600" style={{ width: `${(results[0].score/results[0].total)*100}%` }} />
              </div>
              <button onClick={() => startPractice(results[0].id, results[0])} className="w-full flex items-center justify-center gap-2 border border-[var(--border-strong)] hover:bg-[var(--hover-bg)] transition-colors text-[var(--text-primary)] text-sm font-medium rounded-lg py-2.5">
                Continue <ArrowRight size={15} />
              </button>
            </>
          ) : (
            <>
              <div className="text-base font-semibold text-[var(--text-primary)]">No Recent Activity</div>
              <div className="text-xs text-[var(--text-faint)] mb-3">Complete a test to continue</div>
              <div className="h-1.5 bg-[var(--track-bg)] rounded-full overflow-hidden mb-4 mt-2">
                <div className="h-full bg-[var(--track-bg)]" style={{ width: "0%" }} />
              </div>
              <button onClick={() => setPage("practice")} className="w-full flex items-center justify-center gap-2 border border-[var(--border-strong)] hover:bg-[var(--hover-bg)] transition-colors text-[var(--text-primary)] text-sm font-medium rounded-lg py-2.5">
                Start Practice <ArrowRight size={15} />
              </button>
            </>
          )}
        </Card>

        <ActivityCalendar />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="text-[var(--text-primary)] font-semibold text-sm">Weak Topics</div>
            <button onClick={() => setPage("sectional")} className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)]">View All</button>
          </div>
          <div className="space-y-1">
            {results.length > 0 ? (
              Object.entries(stats.subjectProgress)
                .filter(([_, sp]) => sp.solved > 0)
                .sort(([, a], [, b]) => a.acc - b.acc)
                .slice(0, 4)
                .map(([key, sp]) => {
                  const Icon = sp.icon;
                  return (
                    <div key={key} className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{ backgroundColor: sp.color + "22" }}>
                          <Icon size={14} style={{ color: sp.color }} />
                        </div>
                        <span className="text-sm text-[var(--text-secondary)]">{sp.label}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-red-500">{sp.acc}%</span>
                        <button onClick={() => setPage("sectional")} className="flex items-center gap-1 text-xs text-red-500 border border-[var(--accent-soft-border)] rounded-md px-2 py-1 hover:bg-[var(--accent-soft-bg)]">
                          Practice <ArrowRight size={11} />
                        </button>
                      </div>
                    </div>
                  );
                })
            ) : (
              <div className="text-center py-4 text-[var(--text-faint)] text-sm">
                Complete tests to see weak topics
              </div>
            )}
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="text-[var(--text-primary)] font-semibold text-sm">Recent Tests</div>
            <button onClick={() => setPage("performance")} className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)]">View All</button>
          </div>
          <div className="space-y-1">
            {recent.length > 0 ? (
              recent.map((r) => (
                <div key={r.id} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-md flex items-center justify-center shrink-0" style={{ backgroundColor: r.color + "22" }}>
                      <ClipboardList size={14} style={{ color: r.color }} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm text-[var(--text-secondary)] truncate max-w-[150px]">{r.title}</div>
                      <div className="text-[11px] text-[var(--text-faint)] flex items-center gap-1.5">
                        <span className="bg-[var(--track-bg)] rounded px-1.5">{r.provider}</span> {r.when}
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm text-[var(--text-secondary)]">{r.score}/{r.total}</div>
                    <div className="text-xs font-semibold text-red-500">{Math.round((r.score/r.total)*100)}%</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-[var(--text-faint)] text-sm">
                No tests attempted yet
              </div>
            )}
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="text-[var(--text-primary)] font-semibold text-sm">Subject Progress</div>
            <button onClick={() => setPage("performance")} className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)]">View All</button>
          </div>
          <div className="space-y-4">
            {Object.entries(stats.subjectProgress).filter(([_, sp]) => sp.solved > 0).map(([key, sp]) => {
              const Icon = sp.icon;
              return (
                <div key={key}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded flex items-center justify-center" style={{ backgroundColor: sp.color + "22" }}>
                        <Icon size={12} style={{ color: sp.color }} />
                      </div>
                      <span className="text-sm text-[var(--text-secondary)]">{sp.label}</span>
                    </div>
                    <span className="text-sm font-semibold text-[var(--text-primary)]">{sp.acc}%</span>
                  </div>
                  <div className="h-1.5 bg-[var(--track-bg)] rounded-full overflow-hidden">
                    <div className="h-full" style={{ width: `${sp.acc}%`, backgroundColor: sp.color }} />
                  </div>
                  <div className="text-[11px] text-[var(--text-faint)] mt-1">{sp.solved} questions solved</div>
                </div>
              );
            })}
            {Object.values(stats.subjectProgress).every(sp => sp.solved === 0) && (
              <div className="text-center py-4 text-[var(--text-faint)] text-sm">
                Complete tests to see subject progress
              </div>
            )}
          </div>
        </Card>
      </div>

      <div className="flex items-center justify-between text-xs text-[var(--text-faint)] border-t border-[var(--border)] pt-4">
        <div className="flex items-center gap-2"><Info size={13} /> All data is based on your actual attempts and real test progress.</div>
        <div className="flex items-center gap-1.5">Last updated: Just now <RefreshCw size={12} /></div>
      </div>
    </div>
  );
}
