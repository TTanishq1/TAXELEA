import { Moon, Sun, LogOut, User, Calendar, Key } from "lucide-react";
import { Card } from "../components/ui/Card.jsx";
import { useTheme } from "../theme/ThemeContext.jsx";
import { changePassword } from "../lib/storage.js";
import { formatISTDate } from "../lib/timezone.js";
import { useState } from "react";

export function SettingsPage({ currentUser, onLogout }) {
  const { theme, toggleTheme } = useTheme();
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  
  const rows = [
    ["Exam", "SSC CGL"], ["Daily Goal", "5 questions"], ["Difficulty Mix", "Easy · Medium · Hard"],
    ["Notifications", "Enabled"],
  ];
  
  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      onLogout();
    }
  };
  
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordMessage('');
    
    if (newPassword !== confirmPassword) {
      setPasswordMessage('New passwords do not match');
      setPasswordLoading(false);
      return;
    }
    
    if (newPassword.length < 4) {
      setPasswordMessage('Password must be at least 4 characters');
      setPasswordLoading(false);
      return;
    }
    
    const result = await changePassword(currentPassword, newPassword);
    
    if (result.success) {
      setPasswordMessage('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowChangePassword(false);
    } else {
      setPasswordMessage(result.error || 'Failed to change password');
    }
    
    setPasswordLoading(false);
  };
  
  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
      <div>
        <h1 className="text-xl font-bold text-[var(--text-primary)]">Settings</h1>
        <p className="text-[var(--text-faint)] text-sm mt-1">Manage your account and preferences.</p>
      </div>
      
      {/* User Profile */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="text-[var(--text-primary)] font-semibold text-sm">Profile</div>
        </div>
        
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-red-700 flex items-center justify-center text-white text-2xl font-semibold">
            {currentUser?.name?.charAt(0).toUpperCase() || currentUser?.username?.charAt(0).toUpperCase() || 'O'}
          </div>
          <div>
            <div className="text-lg text-white font-semibold">{currentUser?.name || currentUser?.username || 'User'}</div>
            <div className="text-sm text-gray-400">{currentUser?.email || 'user@taxelea.local'}</div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-700">
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-gray-400" />
            <div>
              <div className="text-xs text-gray-400">Member Since</div>
              <div className="text-sm text-white">
                {currentUser?.createdAt ? formatISTDate(currentUser.createdAt, { month: 'short', year: 'numeric' }) : 'N/A'}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <User size={16} className="text-gray-400" />
            <div>
              <div className="text-xs text-gray-400">Account Type</div>
              <div className="text-sm text-white">Premium</div>
            </div>
          </div>
        </div>
      </Card>
      
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
      

      
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="text-[var(--text-primary)] font-semibold text-sm">Security</div>
        </div>
        
        <button
          onClick={() => setShowChangePassword(!showChangePassword)}
          className="w-full flex items-center justify-center gap-2 text-[var(--text-secondary)] border border-[var(--border)] rounded-lg px-4 py-3 hover:bg-[var(--hover-bg)] transition-colors mb-4"
        >
          <Key size={18} />
          Change Password
        </button>
        
        {showChangePassword && (
          <form onSubmit={handleChangePassword} className="space-y-3 pt-4 border-t border-[var(--border)]">
            <div>
              <label className="block text-[var(--text-secondary)] text-sm mb-2">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                required
                className="w-full px-4 py-2 bg-[var(--elevated-bg)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-faint)] focus:outline-none focus:border-[var(--danger-text)]"
              />
            </div>
            <div>
              <label className="block text-[var(--text-secondary)] text-sm mb-2">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                required
                minLength={4}
                className="w-full px-4 py-2 bg-[var(--elevated-bg)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-faint)] focus:outline-none focus:border-[var(--danger-text)]"
              />
            </div>
            <div>
              <label className="block text-[var(--text-secondary)] text-sm mb-2">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
                minLength={4}
                className="w-full px-4 py-2 bg-[var(--elevated-bg)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-faint)] focus:outline-none focus:border-[var(--danger-text)]"
              />
            </div>
            <button
              type="submit"
              disabled={passwordLoading}
              className="w-full flex items-center justify-center gap-2 bg-[var(--danger-text)] hover:bg-[var(--danger-text)]/90 disabled:bg-[var(--danger-text)]/50 disabled:cursor-not-allowed text-white font-medium rounded-lg py-2 transition-colors"
            >
              {passwordLoading ? 'Changing...' : 'Change Password'}
            </button>
            {passwordMessage && (
              <div className={`text-sm ${passwordMessage.includes('success') ? 'text-[var(--ok-text)]' : 'text-[var(--danger-text)]'}`}>
                {passwordMessage}
              </div>
            )}
          </form>
        )}
      </Card>
      
      <Card className="p-5">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 text-[var(--danger-text)] border border-[var(--accent-soft-border)] rounded-lg px-4 py-3 hover:bg-[var(--danger-bg)] transition-colors"
        >
          <LogOut size={18} />
          Logout
        </button>
      </Card>
    </div>
  );
}
