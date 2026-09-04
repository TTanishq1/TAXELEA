import {
  Home, ClipboardList, Layers, Dumbbell, BarChart3, Bookmark, Flame, Settings, Trophy,
  X, ArrowRight, Lock, Landmark,
} from "lucide-react";
import { Logo } from "../Logo.jsx";

const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", icon: Home, requiresAuth: false },
  { key: "sectional", label: "Sectional Mocks", icon: ClipboardList, requiresAuth: true },
  { key: "full", label: "Full Test Series", icon: Layers, requiresAuth: true },
  { key: "otherexams", label: "Other Exams", icon: Landmark, requiresAuth: true },
  { key: "practice", label: "Practice", icon: Dumbbell, requiresAuth: true },
  { key: "performance", label: "Performance", icon: BarChart3, requiresAuth: true },
  { key: "bookmarks", label: "Bookmarks", icon: Bookmark, requiresAuth: true },
  { key: "streak", label: "Streak", icon: Flame, requiresAuth: true },
  { key: "leaderboard", label: "Leaderboard", icon: Trophy, requiresAuth: true },
  { key: "settings", label: "Settings", icon: Settings, requiresAuth: true },
];

export function Sidebar({ page, setPage, onClose, currentUser }) {
  return (
    <div className="w-[232px] shrink-0 bg-[var(--sidebar-bg)] border-r border-[var(--border)] flex flex-col h-full overflow-y-auto">
      <div className="px-5 pt-6 pb-6 border-b border-[var(--border)] flex items-center justify-between">
        <Logo />
        {onClose && (
          <button onClick={onClose} className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--hover-bg)] text-[var(--text-muted)] shrink-0">
            <X size={18} />
          </button>
        )}
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const active = page === item.key;
          const isLocked = item.requiresAuth && !currentUser;
          return (
            <button
              key={item.key}
              onClick={() => { 
                if (!isLocked) {
                  setPage(item.key); 
                  if (onClose) onClose(); 
                }
              }}
              disabled={isLocked}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors relative ${
                active
                  ? "bg-[var(--accent-soft-bg)] text-[var(--text-primary)]"
                  : isLocked
                  ? "text-[var(--text-faint)] cursor-not-allowed"
                  : "text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--hover-bg)]"
              }`}
            >
              {active && <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-[var(--danger-text)] rounded-r" />}
              <item.icon size={17} strokeWidth={1.8} className={active ? "text-[var(--danger-text)]" : isLocked ? "text-[var(--text-faint)]" : ""} />
              {item.label}
              {isLocked && <Lock size={12} className="ml-auto text-[var(--text-faint)]" />}
            </button>
          );
        })}
      </nav>
      {currentUser && (
        <div className="m-3 p-4 rounded-xl border border-[var(--accent-soft-border)] bg-[var(--accent-soft-bg)]">
          <div className="flex items-center gap-1.5 text-[var(--text-primary)] font-semibold text-sm mb-1.5">
            Keep the Streak Alive! <Flame size={14} className="text-[var(--danger-text)]" />
          </div>
          <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-3">
            Your consistency today builds your success tomorrow.
          </p>
          <button onClick={() => { setPage("streak"); if (onClose) onClose(); }} className="w-full flex items-center justify-center gap-1.5 text-xs font-medium text-[var(--danger-text)] border border-[var(--accent-soft-border)] rounded-lg py-2 hover:bg-[var(--danger-bg)] transition-colors">
            View Streak <ArrowRight size={13} />
          </button>
        </div>
      )}
    </div>
  );
}
