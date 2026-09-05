import React, { useMemo, useState, useCallback } from "react";
import {
  Home,
  ListChecks,
  Swords,
  ClipboardList,
  Send,
  Bookmark,
  Flame,
  Timer,
  BarChart3,
  Trophy as TrophyIcon,
  MessageSquare,
  Settings as SettingsIcon,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Calendar,
  Target,
  TrendingUp,
  CheckCircle2,
  HelpCircle,
  Clock,
  Trash2,
  AlertTriangle,
  X,
  Palette,
  Bell,
  Database,
  ShieldAlert,
  SlidersHorizontal,
} from "lucide-react";
import { clearAllProgress } from "../lib/storage.js";
import { getISTDate, getISTDateString } from "../lib/timezone.js";

// ---------------------------------------------------------------------------
// TAXELEA — Streak dashboard
// Dark-mode activity dashboard: sidebar nav, stat cards, a GitHub-style
// activity calendar, streak insights, and a settings / danger-zone panel
// with a "Clear All Stats" confirmation modal.
// ---------------------------------------------------------------------------

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const LEVEL_COLORS = ["var(--activity-0)", "var(--activity-1)", "var(--activity-2)", "var(--activity-3)", "var(--activity-4)"];
const LEVEL_LABELS = ["No Activity", "1–2 Tests", "3–5 Tests", "6–10 Tests", "10+ Tests"];

function buildCalendar(data, endDate) {
  const activityMap = new Map();
  if (data && data.length > 0) {
    data.forEach(r => {
      const key = getISTDateString(r.id);
      activityMap.set(key, (activityMap.get(key) || 0) + 1);
    });
  }

  const visibleEnd = new Date(endDate);
  visibleEnd.setHours(0, 0, 0, 0);
  const visibleStart = new Date(visibleEnd);
  visibleStart.setDate(visibleStart.getDate() - 364);
  const mondayOffset = visibleStart.getDay() === 0 ? 6 : visibleStart.getDay() - 1;
  visibleStart.setDate(visibleStart.getDate() - mondayOffset);

  const totalDays = Math.ceil((visibleEnd - visibleStart) / 86400000) + 1;
  const totalWeeks = Math.ceil(totalDays / 7);
  const weeks = [];

  for (let w = 0; w < totalWeeks; w++) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      const cellDate = new Date(visibleStart);
      cellDate.setDate(cellDate.getDate() + (w * 7) + d);
      const dateKey = cellDate.toDateString();
      const count = activityMap.get(dateKey) || 0;
      let level = 0;
      if (count > 0) {
        if (count >= 10) level = 4;
        else if (count >= 6) level = 3;
        else if (count >= 3) level = 2;
        else if (count >= 1) level = 1;
      }
      week.push({ date: cellDate, dateKey, count, level, isFuture: cellDate > visibleEnd });
    }
    weeks.push(week);
  }

  const monthLabels = [];
  weeks.forEach((week, weekIndex) => {
    const firstVisibleDay = week.find(day => day.date.getMonth() !== weeks[weekIndex - 1]?.[0]?.date.getMonth());
    if (firstVisibleDay && (!monthLabels.length || monthLabels[monthLabels.length - 1].month !== firstVisibleDay.date.getMonth() || monthLabels[monthLabels.length - 1].year !== firstVisibleDay.date.getFullYear())) {
      monthLabels.push({ week: weekIndex, month: firstVisibleDay.date.getMonth(), year: firstVisibleDay.date.getFullYear() });
    }
  });

  return {
    weeks,
    monthLabels,
    start: visibleStart,
    end: visibleEnd,
    label: `${visibleStart.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} – ${visibleEnd.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`,
  };
}

const NAV_ITEMS = [
  { label: "Dashboard", icon: Home },
  { label: "Problems", icon: ListChecks },
  { label: "Contests", icon: Swords },
  { label: "Test Series", icon: ClipboardList },
  { label: "Submissions", icon: Send },
  { label: "Bookmarks", icon: Bookmark },
  { label: "Streak", icon: Flame, active: true },
  { label: "Pomodoro", icon: Timer },
  { label: "Reports", icon: BarChart3 },
  { label: "Leaderboard", icon: TrophyIcon },
  { label: "Discuss", icon: MessageSquare },
];

const SETTINGS_ITEMS = [
  { label: "General", icon: SlidersHorizontal },
  { label: "Appearance", icon: Palette },
  { label: "Notifications", icon: Bell },
  { label: "Data & Storage", icon: Database },
  { label: "Danger Zone", icon: ShieldAlert, active: true },
];

function StatCard({ icon: Icon, iconColor, iconBg, value, label, sublabel, borderColor, bgTint }) {
  return (
    <div
      className="rounded-xl border p-5 flex flex-col gap-3"
      style={{ borderColor, background: bgTint }}
    >
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center"
        style={{ background: iconBg }}
      >
        <Icon size={18} style={{ color: iconColor }} />
      </div>
      <div>
        <div className="text-3xl font-bold text-[var(--text-primary)] leading-none">{value}</div>
        <div className="text-sm text-[var(--text-secondary)] mt-2">{label}</div>
        <div className="text-xs text-[var(--text-faint)] mt-0.5">{sublabel}</div>
      </div>
    </div>
  );
}

function InsightItem({ icon: Icon, color, value, label, sub }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}20` }}>
        <Icon size={16} style={{ color }} />
      </div>
      <div className="text-xl font-bold text-[var(--text-primary)]">{value}</div>
      <div className="text-xs text-[var(--text-secondary)]">{label}</div>
      <div className="text-[10px] text-[var(--text-faint)]">{sub}</div>
    </div>
  );
}

export default function StreakPage({ currentUser, results }) {
  const [showModal, setShowModal] = useState(false);
  const [clearing, setClearing] = useState(false);
  
  // Filter results for current user
  const userResults = currentUser ? results.filter(r => r.userId === currentUser.id) : results;
  
  const [viewEnd, setViewEnd] = useState(() => getISTDate());
  const calendar = useMemo(() => buildCalendar(userResults, viewEnd), [userResults, viewEnd]);
  const [tooltip, setTooltip] = useState(null);

  // Calculate streak statistics
  const streakData = useMemo(() => {
    if (!currentUser || userResults.length === 0) {
      return { current: 0, longest: 0, totalActiveDays: 0, testsCompleted: 0, consistency: 0 };
    }

    const dates = userResults.map(r => getISTDateString(r.id));
    const uniqueDates = [...new Set(dates)].sort((a, b) => new Date(b) - new Date(a));
    
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    
    const today = getISTDate();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (uniqueDates.includes(today.toDateString()) || uniqueDates.includes(yesterday.toDateString())) {
      for (let i = 0; i < uniqueDates.length; i++) {
        const currentDate = new Date(uniqueDates[i]);
        const prevDate = i > 0 ? new Date(uniqueDates[i - 1]) : null;
        
        if (prevDate) {
          const diffDays = Math.floor((prevDate - currentDate) / (1000 * 60 * 60 * 24));
          if (diffDays === 1) {
            tempStreak++;
          } else {
            tempStreak = 1;
          }
        } else {
          tempStreak = 1;
        }
        
        if (tempStreak > longestStreak) longestStreak = tempStreak;
      }
      
      currentStreak = tempStreak;
    }
    
    const totalActiveDays = uniqueDates.length;
    const testsCompleted = userResults.length;
    
    // Calculate consistency (active days in last 30 days / 30)
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentActiveDays = uniqueDates.filter(date => new Date(date) >= thirtyDaysAgo).length;
    const consistency = Math.round((recentActiveDays / 30) * 100);
    
    // Calculate this month's stats
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const thisMonthResults = userResults.filter(r => {
      const resultDate = new Date(getISTDateString(r.id));
      return resultDate.getMonth() === currentMonth && resultDate.getFullYear() === currentYear;
    });
    const thisMonthUniqueDates = [...new Set(thisMonthResults.map(r => getISTDateString(r.id)))];
    
    return { 
      current: currentStreak, 
      longest: longestStreak, 
      totalActiveDays, 
      testsCompleted, 
      consistency,
      thisMonthActiveDays: thisMonthUniqueDates.length,
      thisMonthTests: thisMonthResults.length
    };
  }, [currentUser, userResults]);

  const handleEnter = useCallback((e, cell) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({
      x: rect.left + rect.width / 2,
      y: rect.top,
      text: `${cell.count} ${cell.count === 1 ? 'test' : 'tests'} · ${cell.date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}`,
    });
  }, []);

  const shiftCalendar = useCallback((weeks) => {
    setViewEnd(previous => {
      const next = new Date(previous);
      next.setDate(next.getDate() + (weeks * 7));
      return next;
    });
    setTooltip(null);
  }, []);

  const resetCalendar = useCallback(() => {
    setViewEnd(getISTDate());
    setTooltip(null);
  }, []);

  const handleClearAll = async () => {
    setClearing(true);
    try {
      await clearAllProgress();
      window.location.reload();
    } catch (error) {
      console.error('Failed to clear data:', error);
      setClearing(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[var(--bg)] text-[var(--text-primary)] p-4 sm:p-8">
      <main className="relative">
        {/* header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">Streak</h1>
            <p className="text-sm text-[var(--text-faint)] mt-1">Consistency builds mastery. Keep showing up.</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[var(--text-faint)] mt-1">
            <Clock size={13} />
            All dates &amp; times are shown in IST (GMT +5:30)
          </div>
        </div>

        {/* stat cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <StatCard
            icon={Flame}
            iconColor="#f87171"
            iconBg="rgba(248,113,113,0.15)"
            value={streakData.current}
            label="Current Streak"
            sublabel={streakData.current > 0 ? "Keep it up! 🔥" : "Start today!"}
            borderColor="rgba(248,113,113,0.35)"
            bgTint="linear-gradient(180deg, rgba(127,29,29,0.25), rgba(127,29,29,0.05))"
          />
          <StatCard
            icon={TrophyIcon}
            iconColor="#c084fc"
            iconBg="rgba(192,132,252,0.15)"
            value={streakData.longest}
            label="Longest Streak"
            sublabel="Your best so far"
            borderColor="rgba(192,132,252,0.35)"
            bgTint="linear-gradient(180deg, rgba(88,28,135,0.25), rgba(88,28,135,0.05))"
          />
          <StatCard
            icon={Calendar}
            iconColor="#60a5fa"
            iconBg="rgba(96,165,250,0.15)"
            value={streakData.totalActiveDays}
            label="Total Active Days"
            sublabel="All time"
            borderColor="rgba(96,165,250,0.35)"
            bgTint="linear-gradient(180deg, rgba(30,58,138,0.25), rgba(30,58,138,0.05))"
          />
          <StatCard
            icon={Target}
            iconColor="#4ade80"
            iconBg="rgba(74,222,128,0.15)"
            value={streakData.testsCompleted}
            label="Tests Completed"
            sublabel="Across all time"
            borderColor="rgba(74,222,128,0.35)"
            bgTint="linear-gradient(180deg, rgba(20,83,45,0.25), rgba(20,83,45,0.05))"
          />
        </div>

        {/* activity calendar */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-5 mb-6 shadow-[var(--shadow)]">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <div className="flex items-center gap-1.5 text-[var(--text-primary)] font-semibold text-sm">
              Activity Calendar
              <HelpCircle size={13} className="text-gray-500" />
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => shiftCalendar(-4)} aria-label="Previous 4 weeks" className="w-7 h-7 rounded-md border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:bg-[var(--hover-bg)]">
                <ChevronLeft size={14} />
              </button>
              <button className="flex items-center gap-1 px-3 py-1.5 rounded-md border border-[var(--border)] text-xs text-[var(--text-secondary)] hover:bg-[var(--hover-bg)]">
                {calendar.label}
                <ChevronDown size={12} />
              </button>
              <button onClick={() => shiftCalendar(4)} aria-label="Next 4 weeks" className="w-7 h-7 rounded-md border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:bg-[var(--hover-bg)]">
                <ChevronRight size={14} />
              </button>
              <button onClick={resetCalendar} className="px-3 py-1.5 rounded-md border border-[var(--border)] text-xs text-[var(--text-secondary)] hover:bg-[var(--hover-bg)]">
                Today
              </button>
            </div>
          </div>

          {/* month labels */}
          <div className="relative h-5 text-[11px] text-[var(--text-faint)] mb-1 pl-9">
            {calendar.monthLabels.map((label) => (
              <div key={`${label.year}-${label.month}`} className="absolute" style={{ left: `${(label.week / calendar.weeks.length) * 100}%` }}>
                {new Date(label.year, label.month, 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              </div>
            ))}
          </div>

          {/* grid */}
          <div className="flex">
            <div className="flex flex-col justify-between text-[11px] text-[var(--text-faint)] pr-2 py-0.5" style={{ height: 7 * 15 }}>
              {WEEKDAYS.map((d) => (
                <div key={d} style={{ height: 15, lineHeight: "15px" }}>
                  {d}
                </div>
              ))}
            </div>
            <div className="flex gap-[3px] flex-1 overflow-x-auto">
              {calendar.weeks.map((week, wIdx) => (
                <div key={wIdx} className="flex flex-col gap-[3px]">
                  {week.map((cell, dIdx) => (
                    <div
                      key={cell.dateKey}
                      onMouseEnter={(e) => handleEnter(e, cell)}
                      onMouseLeave={() => setTooltip(null)}
                      title={`${cell.count} ${cell.count === 1 ? 'test' : 'tests'} on ${cell.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`}
                      className={`rounded-[3px] cursor-pointer transition-transform hover:scale-125 ${cell.isFuture ? 'opacity-0 pointer-events-none' : ''}`}
                      style={{
                        width: 12,
                        height: 12,
                        background: LEVEL_COLORS[cell.level],
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* legend */}
          <div className="flex items-center justify-between mt-4 flex-wrap gap-3">
            <div className="flex items-center gap-4 flex-wrap">
              {LEVEL_LABELS.map((label, i) => (
                <div key={label} className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
                  <div
                    className="rounded-[3px]"
                    style={{ width: 12, height: 12, background: LEVEL_COLORS[i] }}
                  />
                  {label}
                </div>
              ))}
            </div>
            <div className="text-xs text-[var(--text-faint)]">365 days total · {userResults.length} tests</div>
          </div>
          <div className="text-xs text-[var(--text-faint)] mt-3">Hover on a day to see details.</div>
        </div>

        {/* streak insights + settings/danger zone (left col) & about (right col) */}
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 flex flex-col gap-6">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-5 shadow-[var(--shadow)]">
              <div className="text-[var(--text-primary)] font-semibold text-sm mb-5">Streak Insights</div>
              <div className="grid grid-cols-5 gap-4 text-center">
                <InsightItem icon={Flame} color="#f87171" value={streakData.current} label="Current Streak" sub="Keep it up!" />
                <InsightItem icon={TrophyIcon} color="#c084fc" value={streakData.longest} label="Longest Streak" sub="Your best so far" />
                <InsightItem icon={Calendar} color="#60a5fa" value={streakData.thisMonthActiveDays} label="Active Days" sub="This Month" />
                <InsightItem icon={Target} color="#4ade80" value={streakData.thisMonthTests} label="Tests Completed" sub="This Month" />
                <InsightItem icon={TrendingUp} color="#fb923c" value={`${streakData.consistency}%`} label="Consistency" sub={streakData.consistency >= 70 ? "Great job!" : "Keep going!"} />
              </div>
              <div className="mt-5 flex items-center gap-2 rounded-lg border border-[var(--ok-border)] bg-[var(--ok-bg)] px-4 py-3 text-sm text-[var(--ok-text)]">
                <CheckCircle2 size={16} className="text-[var(--ok-text)] shrink-0" />
                Great job! You are more consistent than {streakData.consistency}% of TAXELEA users.
              </div>
            </div>

            <div className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-5 shadow-[var(--shadow)]">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-[var(--text-primary)] font-semibold text-sm mb-4">Settings</div>
                  <div className="flex flex-col gap-1">
                    {SETTINGS_ITEMS.map(({ label, icon: Icon, active }) => (
                      <button
                        key={label}
                        className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm text-left ${
                          active ? "text-[var(--danger-text)] bg-[var(--danger-bg)]" : "text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] hover:text-[var(--text-primary)]"
                        }`}
                      >
                        <Icon size={15} />
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-[var(--danger-text)] font-semibold text-sm mb-1">Danger Zone</div>
                  <p className="text-xs text-[var(--text-faint)] mb-4">
                    Permanently delete all your data and reset your TAXELEA account.
                  </p>
                  <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--danger-border)] bg-[var(--danger-bg)] text-[var(--danger-text)] text-sm font-medium hover:bg-[var(--accent-soft-bg)]"
                  >
                    <Trash2 size={14} />
                    Clear All Stats
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-5 shadow-[var(--shadow)]">
              <div className="text-[var(--text-primary)] font-semibold text-sm mb-3">About Streak</div>
              <ul className="text-xs text-[var(--text-secondary)] leading-relaxed list-disc pl-4 space-y-2">
                <li>
                  A day is marked as Active if you completed any test OR attempted any test OR
                  practiced any question.
                </li>
                <li>Streak is calculated based on consecutive active days.</li>
              </ul>
            </div>
            <div className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-5 shadow-[var(--shadow)]">
              <div className="text-[var(--text-primary)] font-semibold text-sm mb-3">Need Motivation?</div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Every day you show up, you are becoming a better problem solver. Consistency
                today, mastery tomorrow. 🚀
              </p>
            </div>
          </div>
        </div>

        {/* tooltip */}
        {tooltip && (
          <div
            className="fixed z-40 -translate-x-1/2 -translate-y-full px-2.5 py-1.5 rounded-md bg-[var(--elevated-bg)] border border-[var(--border)] text-[11px] text-[var(--text-primary)] shadow-lg pointer-events-none"
            style={{ left: tooltip.x, top: tooltip.y - 8 }}
          >
            {tooltip.text}
          </div>
        )}

        {/* Clear All Stats modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--scrim)] backdrop-blur-sm">
            <div className="w-[min(420px,calc(100vw-2rem))] rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] p-6 relative shadow-2xl">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-[var(--text-faint)] hover:text-[var(--text-primary)]"
              >
                <X size={16} />
              </button>

              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-3">
                  <AlertTriangle size={22} className="text-red-500" />
                </div>
                <div className="text-[var(--text-primary)] font-semibold text-base mb-2">Clear All Stats?</div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-1">
                  This will permanently delete all your data and reset your TAXELEA account.
                </p>
                <p className="text-xs text-[var(--text-faint)] mb-4">This action cannot be undone.</p>
              </div>

              <div className="text-xs text-[var(--text-secondary)] mb-2">This will reset:</div>
              <div className="grid grid-cols-2 gap-y-1.5 text-xs text-[var(--text-secondary)] mb-6">
                <div className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-[var(--text-faint)]" /> Streak &amp; Activity
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-[var(--text-faint)]" /> Bookmarks
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-[var(--text-faint)]" /> Test History
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-[var(--text-faint)]" /> Pomodoro Progress
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-[var(--text-faint)]" /> Performance
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-[var(--text-faint)]" /> All Reports &amp; Analytics
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  disabled={clearing}
                  className="flex-1 py-2.5 rounded-lg border border-[var(--border-strong)] text-[var(--text-primary)] text-sm font-medium hover:bg-[var(--hover-bg)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={handleClearAll}
                  disabled={clearing}
                  className="flex-1 py-2.5 rounded-lg bg-[var(--accent)] text-white text-sm font-medium hover:bg-[var(--accent-hover)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {clearing ? 'Clearing...' : 'Yes, Clear Everything'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}