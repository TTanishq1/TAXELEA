import { Search, Bell, ChevronDown, Sun, Moon, Menu, LogOut, Lock } from "lucide-react";
import { useTheme } from "../../theme/ThemeContext.jsx";

export function Header({ onMenuClick, onLogout, currentUser }) {
  const { theme, toggleTheme } = useTheme();
  return (
    <div className="h-[60px] sm:h-[68px] shrink-0 border-b border-[var(--border)] bg-[var(--bg)]/80 flex items-center justify-between px-3 sm:px-6 gap-2 sm:gap-4 backdrop-blur-sm">
      <button onClick={onMenuClick} aria-label="Open navigation" className="lg:hidden w-9 h-9 shrink-0 flex items-center justify-center rounded-lg hover:bg-[var(--hover-bg)] text-[var(--text-secondary)]">
        <Menu size={19} />
      </button>
      <button className="hidden sm:flex items-center gap-2 bg-[var(--card-bg)] border border-[var(--border-strong)] rounded-lg px-3.5 py-2 text-sm text-[var(--text-secondary)] shrink-0">
        SSC CGL <ChevronDown size={14} className="text-[var(--text-faint)]" />
      </button>
      <div className="flex-1 max-w-xl relative min-w-0">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-faint)]" />
        <input
          placeholder="Search for tests, topics, questions..."
          disabled={!currentUser}
          className="w-full bg-[var(--card-bg)] border border-[var(--border-strong)] rounded-lg pl-10 pr-10 py-2 sm:py-2.5 text-sm text-[var(--text-secondary)] placeholder:text-[var(--text-faint)] outline-none focus:border-[var(--accent)] disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium text-[var(--text-faint)] border border-[var(--border)]">Ctrl K</span>
      </div>
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        <button
          onClick={toggleTheme}
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          className="w-10 h-10 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg hover:bg-[var(--hover-bg)] text-[var(--text-secondary)]"
        >
          {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
        </button>
        <button
          aria-label="Notifications"
          title="Notifications"
          className="w-10 h-10 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg hover:bg-[var(--hover-bg)] text-[var(--text-secondary)] disabled:opacity-50"
          disabled={!currentUser}
        >
          <Bell size={17} />
        </button>
        {currentUser ? (
          <div className="flex items-center gap-2.5 md:gap-3 pl-1">
            <div className="w-9 h-9 rounded-full bg-[linear-gradient(135deg,var(--accent-hover),var(--accent))] flex items-center justify-center text-white text-sm font-semibold shrink-0">
              {currentUser?.user_metadata?.name?.charAt(0).toUpperCase() || currentUser?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="leading-tight hidden md:block">
              <div className="text-sm text-[var(--text-primary)] font-medium">{currentUser?.user_metadata?.name || currentUser?.email?.split('@')[0] || 'User'}</div>
              <div className="text-[11px] text-[var(--accent)]">SSC CGL Aspirant</div>
            </div>
            <button
              onClick={onLogout}
              title="Logout"
              aria-label="Logout"
              className="w-10 h-10 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg hover:bg-[var(--danger-bg)] text-[var(--danger-text)] transition-colors"
            >
              <LogOut size={17} />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <Lock size={16} />
            <span className="hidden md:inline">Login required</span>
          </div>
        )}
      </div>
    </div>
  );
}
