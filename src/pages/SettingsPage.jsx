import { Moon, Sun } from "lucide-react";
import { Card } from "../components/ui/Card.jsx";
import { useTheme } from "../theme/ThemeContext.jsx";

export function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const rows = [
    ["Exam", "SSC CGL"], ["Daily Goal", "5 questions"], ["Difficulty Mix", "Easy · Medium · Hard"],
    ["Notifications", "Enabled"],
  ];
  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
      <div>
        <h1 className="text-xl font-bold text-[var(--text-primary)]">Settings</h1>
        <p className="text-[var(--text-faint)] text-sm mt-1">Manage your preparation preferences.</p>
      </div>
      <Card className="divide-y divide-[var(--border)]">
        <div className="flex items-center justify-between px-5 py-4">
          <span className="text-sm text-[var(--text-secondary)]">Theme</span>
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 text-sm text-[var(--text-primary)] border border-[var(--border-strong)] rounded-lg px-3 py-1.5 hover:bg-[var(--hover-bg)]"
          >
            {theme === "dark" ? <Moon size={14} /> : <Sun size={14} />}
            {theme === "dark" ? "Dark (Taxelea Red)" : "Light (Taxelea Red)"}
          </button>
        </div>
        {rows.map(([k, v]) => (
          <div key={k} className="flex items-center justify-between px-5 py-4">
            <span className="text-sm text-[var(--text-secondary)]">{k}</span>
            <span className="text-sm text-[var(--text-faint)]">{v}</span>
          </div>
        ))}
      </Card>
    </div>
  );
}
