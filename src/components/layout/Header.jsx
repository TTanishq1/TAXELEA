import { Search, Bell, ChevronDown, Sun, Moon, Menu } from "lucide-react";
import { useTheme } from "../../theme/ThemeContext.jsx";

export function Header({ onMenuClick }) {
  const { theme, toggleTheme } = useTheme();
  return (
    <div className="h-[60px] sm:h-[68px] shrink-0 border-b border-[var(--border)] flex items-center justify-between px-3 sm:px-6 gap-2 sm:gap-4">
      <button onClick={onMenuClick} className="lg:hidden w-9 h-9 shrink-0 flex items-center justify-center rounded-lg hover:bg-[var(--hover-bg)] text-[var(--text-secondary)]">
        <Menu size={19} />
      </button>
      <button className="hidden sm:flex items-center gap-2 bg-[var(--card-bg)] border border-[var(--border-strong)] rounded-lg px-3.5 py-2 text-sm text-[var(--text-secondary)] shrink-0">
        SSC CGL <ChevronDown size={14} className="text-[var(--text-faint)]" />
      </button>
      <div className="flex-1 max-w-xl relative min-w-0">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-faint)]" />
        <input
          placeholder="Search exams, tests, topics..."
          className="w-full bg-[var(--card-bg)] border border-[var(--border-strong)] rounded-lg pl-10 pr-4 py-2 sm:py-2.5 text-sm text-[var(--text-secondary)] placeholder:text-[var(--text-faint)] outline-none focus:border-red-800"
        />
      </div>
      <div className="flex items-center gap-1.5 sm:gap-4 shrink-0">
        <button
          onClick={toggleTheme}
          title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[var(--hover-bg)] text-[var(--text-secondary)]"
        >
          {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
        </button>
        <button className="relative w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[var(--hover-bg)] text-[var(--text-secondary)]">
          <Bell size={17} />
          <span className="absolute -top-1 -right-1 bg-red-600 text-[10px] w-4 h-4 rounded-full flex items-center justify-center text-white font-medium">3</span>
        </button>
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-red-700 flex items-center justify-center text-white text-sm font-semibold shrink-0">T</div>
          <div className="leading-tight hidden md:block">
            <div className="text-sm text-[var(--text-primary)] font-medium">Tanishq</div>
            <div className="text-[11px] text-red-500">Premium User</div>
          </div>
          <ChevronDown size={14} className="hidden md:block text-[var(--text-faint)]" />
        </div>
      </div>

    </div>
  );
}
