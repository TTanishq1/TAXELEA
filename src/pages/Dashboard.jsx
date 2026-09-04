import React, { useMemo, useState } from "react";
import {
  ClipboardList,
  Layers,
  Target,
  BarChart2,
  CheckCircle2,
  Crosshair,
  Trophy,
  ArrowRight,
  Info,
} from "lucide-react";
import { login, setupOwner, clearAllProgress } from "../lib/storage.js";
import { getISTDate, getISTDateString, getISTToday, getISTYesterday, formatISTDate } from "../lib/timezone.js";

function DonutChart({ value = 0, size = 130, strokeWidth = 16 }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  const filled = value / 100;
  const offset = c * (1 - filled);

  return (
    <svg width={size} height={size} viewBox="0 0 130 130">
      <circle cx="65" cy="65" r={r} fill="none" stroke="#232328" strokeWidth={strokeWidth}/>
      <circle cx="65" cy="65" r={r} fill="none" stroke="#e6b93a" strokeWidth={strokeWidth} strokeDasharray={`${c * filled} ${c}`} strokeDashoffset={offset} transform="rotate(-90 65 65)"/>
      <circle cx="65" cy="65" r={r} fill="none" stroke="#2f6b3a" strokeWidth={strokeWidth} strokeDasharray={`${c * filled * 0.5} ${c}`} strokeDashoffset={offset} transform="rotate(-90 65 65)"/>
      <text x="65" y="60" textAnchor="middle" fill="#9a9aa2" fontSize="11">Overall</text>
      <text x="65" y="80" textAnchor="middle" fill="#fff" fontSize="20" fontWeight="800">{value}%</text>
    </svg>
  );
}

function RingChart({ value = 0, size = 64, strokeWidth = 7, color = "#3b82f6" }) {
  const r = 26;
  const c = 2 * Math.PI * r;
  const filled = value / 100;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 64 64">
        <circle cx="32" cy="32" r={r} fill="none" stroke="#232328" strokeWidth={strokeWidth}/>
        <circle cx="32" cy="32" r={r} fill="none" stroke={color} strokeWidth={strokeWidth} strokeDasharray={`${c * filled} ${c}`} strokeDashoffset={c * (1 - filled)} strokeLinecap="round" transform="rotate(-90 32 32)"/>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-[14px] font-bold">
        {value}%
      </div>
    </div>
  );
}

export default function Dashboard({ setPage, startPractice, results, stats, inProgressTest, currentUser, onAuthSuccess, isFirstTimeSetup }) {
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const streakData = useMemo(() => {
    if (!currentUser || results.length === 0) return { current: 0, longest: 0 };
    
    const userResults = results.filter(r => r.userId === currentUser.id);
    const dates = [...new Set(userResults.map(r => getISTDateString(r.id)))].sort((a, b) => new Date(b) - new Date(a));
    
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    
    const today = getISTToday();
    const yesterday = getISTYesterday();
    
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
    
    for (let i = 1; i < dates.length; i++) {
      const prev = new Date(dates[i - 1]);
      const curr = new Date(dates[i]);
      const diffDays = Math.floor((prev - curr) / 86400000);
      if (diffDays === 1) tempStreak++;
      else { longestStreak = Math.max(longestStreak, tempStreak); tempStreak = 1; }
    }
    longestStreak = Math.max(longestStreak, tempStreak);
    
    return { current: currentStreak, longest: longestStreak };
  }, [currentUser, results]);

  const subjectPerformance = useMemo(() => {
    if (!currentUser || results.length === 0) {
      return [
        { label: "Quantitative Aptitude", value: 0, pct: "0%", color: "#3b82f6" },
        { label: "Reasoning Ability", value: 0, pct: "0%", color: "#e6b93a" },
        { label: "English Language", value: 0, pct: "0%", color: "#14b8a6" },
        { label: "General Awareness", value: 0, pct: "0%", color: "#3b82f6" },
        { label: "Computer Awareness", value: 0, pct: "0%", color: "#3b82f6" },
      ];
    }

    const userResults = results.filter(r => r.userId === currentUser.id);
    const subjectStats = {};
    
    userResults.forEach(r => {
      const subject = r.subject || 'General';
      if (!subjectStats[subject]) {
        subjectStats[subject] = { total: 0, correct: 0 };
      }
      subjectStats[subject].total += r.total || 0;
      subjectStats[subject].correct += r.score || 0;
    });

    const colors = {
      'Quantitative Aptitude': '#3b82f6',
      'Reasoning Ability': '#e6b93a',
      'English Language': '#14b8a6',
      'General Awareness': '#3b82f6',
      'Computer Awareness': '#3b82f6',
    };

    return Object.keys(subjectStats).map(subject => {
      const stats = subjectStats[subject];
      const accuracy = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
      return {
        label: subject,
        value: stats.total,
        pct: `${accuracy}%`,
        color: colors[subject] || '#3b82f6'
      };
    }).slice(0, 5);
  }, [currentUser, results]);

  const statCards = useMemo(() => {
    if (!currentUser) {
      return [
        { label: "Tests Attempted", value: 0, icon: ClipboardList, color: "#e0313b", caption: "Based on actual attempts" },
        { label: "Questions Solved", value: 0, icon: CheckCircle2, color: "#22c55e", caption: "From completed tests" },
        { label: "Today's Progress", value: 0, icon: Crosshair, color: "#e6b93a", caption: "Questions answered today" },
      ];
    }

    const userResults = results.filter(r => r.userId === currentUser.id);
    const today = getISTToday();
    const todayResults = userResults.filter(r => getISTDateString(r.id) === today);
    const todayAnswered = todayResults.reduce((sum, r) => sum + (r.total || 0), 0);

    return [
      { label: "Tests Attempted", value: userResults.length, icon: ClipboardList, color: "#e0313b", caption: "Based on actual attempts" },
      { label: "Questions Solved", value: userResults.reduce((sum, r) => sum + (r.total || 0), 0), icon: CheckCircle2, color: "#22c55e", caption: "From completed tests" },
      { label: "Today's Progress", value: todayAnswered, icon: Crosshair, color: "#e6b93a", caption: "Questions answered today" },
    ];
  }, [currentUser, results]);

  const quickActions = [
    { title: "Start Sectional Mock", subtitle: "Practice by topic", icon: Layers, action: () => setPage('sectional') },
    { title: "Start Full Test", subtitle: "Attempt full length test", icon: ClipboardList, action: () => setPage('full') },
    { title: "Today's Practice", subtitle: "Daily recommended tests", icon: ClipboardList, action: () => setPage('practice') },
    { title: "View Performance", subtitle: "Detailed performance analysis", icon: BarChart2, action: () => setPage('performance') },
  ];

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);
    
    try {
      let result;
      if (isFirstTimeSetup) {
        result = await setupOwner(username, password, name);
      } else {
        result = await login(username, password);
      }
      
      if (result.success) {
        onAuthSuccess(result.user);
      } else {
        setAuthError(result.error);
      }
    } catch (_err) {
      setAuthError('An error occurred. Please try again.');
    } finally {
      setAuthLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[var(--card-bg)] border border-[var(--border)] rounded-[14px] p-8 shadow-[var(--shadow)]">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
              {isFirstTimeSetup ? 'Welcome to TAXELEA!' : 'Welcome Back!'}
            </h1>
            <p className="text-[var(--text-secondary)] text-sm">
              {isFirstTimeSetup ? 'Create your account to get started' : 'Enter your credentials to continue'}
            </p>
          </div>

          {authError && (
            <div className="mb-4 p-3 bg-[var(--danger-bg)] border border-[var(--danger-border)] rounded-lg text-[var(--danger-text)] text-sm">
              {authError}
            </div>
          )}

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {isFirstTimeSetup && (
              <div>
                <label className="block text-[#9a9aa2] text-sm mb-2">Username</label>
                <div className="relative">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Choose a username"
                    required
                    minLength={3}
                    className="w-full px-4 py-3 bg-[var(--input-bg)] border border-[var(--border-strong)] rounded-lg text-[var(--text-primary)] placeholder:text-[var(--text-faint)] outline-none focus:border-[var(--accent)]"
                  />
                </div>
                <p className="text-xs text-[#5c5c64] mt-1">Minimum 3 characters</p>
              </div>
            )}
            {!isFirstTimeSetup && (
              <div>
                <label className="block text-[#9a9aa2] text-sm mb-2">Username</label>
                <div className="relative">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    required
                    minLength={3}
                    className="w-full px-4 py-3 bg-[var(--input-bg)] border border-[var(--border-strong)] rounded-lg text-[var(--text-primary)] placeholder:text-[var(--text-faint)] outline-none focus:border-[var(--accent)]"
                  />
                </div>
              </div>
            )}
            {isFirstTimeSetup && (
              <div>
                <label className="block text-[#9a9aa2] text-sm mb-2">Display Name</label>
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your display name"
                    required
                    minLength={2}
                    className="w-full px-4 py-3 bg-[var(--input-bg)] border border-[var(--border-strong)] rounded-lg text-[var(--text-primary)] placeholder:text-[var(--text-faint)] outline-none focus:border-[var(--accent)]"
                  />
                </div>
                <p className="text-xs text-[#5c5c64] mt-1">This name will be shown on the leaderboard</p>
              </div>
            )}
            <div>
              <label className="block text-[#9a9aa2] text-sm mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isFirstTimeSetup ? 'Create a password' : 'Enter your password'}
                  required
                  minLength={4}
                  className="w-full px-4 py-3 bg-[var(--input-bg)] border border-[var(--border-strong)] rounded-lg text-[var(--text-primary)] placeholder:text-[var(--text-faint)] outline-none focus:border-[var(--accent)]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5c5c64] hover:text-[#9a9aa2]"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {isFirstTimeSetup && (
                <p className="text-xs text-[#5c5c64] mt-1">Minimum 4 characters</p>
              )}
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full flex items-center justify-center gap-2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] disabled:bg-[var(--danger-border)] disabled:cursor-not-allowed text-white font-medium rounded-lg py-3 transition-colors"
            >
              {authLoading ? 'Processing...' : (isFirstTimeSetup ? 'Set Up Account' : 'Login')}
              {!authLoading && <ArrowRight size={18} />}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const userResults = currentUser ? results.filter(r => r.userId === currentUser.id) : [];

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text-primary)] p-4 sm:p-6 transition-colors duration-200 motion-reduce:transition-none" style={{ fontFamily: "'Segoe UI', Inter, system-ui, -apple-system, sans-serif" }}>
      <style>{`
        @keyframes float-note {
          0% { opacity: 0; transform: translateY(0) rotate(0deg); }
          15% { opacity: 1; }
          80% { opacity: 1; }
          100% { opacity: 0; transform: translateY(-26px) rotate(18deg); }
        }
      `}</style>
      {/* Hero Section with Animation */}
      <div className="flex gap-4.5 mb-4.5">
        <div className="flex-1 bg-[var(--card-bg)] border border-[var(--border)] shadow-[var(--shadow)] rounded-[14px] p-6 lg:p-[26px_30px] flex items-center justify-between relative overflow-hidden transition-colors duration-200">
          <div>
            <h1 className="text-[26px] font-bold flex items-center gap-2.5">
              Good Evening, {currentUser?.name || 'Owner'}! <span className="inline-block animate-bounce">👋</span>
            </h1>
            <p className="text-[var(--text-secondary)] text-[13.5px] mt-1.5">Stay consistent. Every question counts.</p>
          </div>
          <div className="relative w-24 h-24 lg:w-30 lg:h-30 shrink-0 rounded-full bg-[var(--elevated-bg)] overflow-hidden ring-1 ring-[var(--accent-soft-border)]">
            <video
              src="/assets/hero.mp4"
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              aria-label="TAXELEA mascot"
              className="block w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Subject Performance + Recent Tests */}
      <div className="flex gap-4.5 mb-4.5">
        <div className="flex-1 bg-[var(--card-bg)] border border-[var(--border)] rounded-[14px] p-5 lg:p-[22px_24px] shadow-[var(--shadow)]">
          <div className="flex items-center justify-between mb-4.5">
            <h3 className="text-[15px] font-bold flex items-center gap-1.5">
              Subject Performance <Info size={14} className="text-[#5c5c64]" />
            </h3>
            <button className="bg-[#1a1a20] border border-[#242429] rounded-lg px-2.5 py-1.5 text-[11.5px] text-[#9a9aa2] flex items-center gap-1.5">
              All Time 
            </button>
          </div>
          <div className="flex items-center gap-5.5">
            <DonutChart value={stats.accuracy} />
            <div className="flex-1 flex flex-col gap-2.5">
              {subjectPerformance.length > 0 ? subjectPerformance.map((s) => (
                <div key={s.label} className="flex items-center gap-2 text-[12.5px]">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: s.color }} />
                  <span className="flex-1 text-[#9a9aa2]">{s.label}</span>
                  <span className="w-5 text-right text-[#f2f2f3]">{s.value}</span>
                  <span className="w-8 text-right text-[#5c5c64] text-[11.5px]">{s.pct}</span>
                </div>
              )) : (
                <div className="text-xs text-[#5c5c64] text-center py-4">Complete tests to see subject performance</div>
              )}
            </div>
          </div>
          <div className="text-[11px] text-[#5c5c64] mt-4">Based on completed tests</div>
        </div>

        <div className="flex-1 bg-[var(--card-bg)] border border-[var(--border)] rounded-[14px] p-5 lg:p-[22px_24px] shadow-[var(--shadow)]">
          <div className="flex items-center justify-between mb-4.5">
            <h3 className="text-[15px] font-bold">Recent Tests</h3>
            <button 
              onClick={() => setPage('performance')}
              className="text-[12px] text-[#e0313b] font-semibold flex items-center gap-1"
            >
              View All <ArrowRight size={14} />
            </button>
          </div>
          {userResults.length > 0 ? (
            <div className="space-y-2">
              {userResults.slice(0, 4).map((r, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-[#1a1a20]">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#1c1c22] border border-[#242429] flex items-center justify-center">
                      <ClipboardList size={17} className="text-[#e0313b]" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#f2f2f3] truncate max-w-[150px]">{r.title || 'Test'}</p>
                      <p className="text-xs text-[#5c5c64]">{formatISTDate(r.id, { month: 'short', day: 'numeric' })}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-[#22c55e]">{r.score ? Math.round((r.score / r.total) * 100) : 0}%</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 gap-3 text-[#9a9aa2]">
              <ClipboardList size={44} className="text-[#5c5c64]" />
              <div className="text-[13.5px] font-semibold text-[#f2f2f3]">No tests attempted yet.</div>
              <div className="text-[11.5px] text-[#5c5c64]">Start a test to see your recent activity here.</div>
            </div>
          )}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="flex gap-4.5 mb-4.5">
        {statCards.map((s) => (
          <div key={s.label} className="flex-1 bg-[var(--card-bg)] border border-[var(--border)] rounded-[14px] p-4 lg:p-[18px_20px] shadow-[var(--shadow)]">
            <div className="text-[12px] text-[#9a9aa2] mb-3.5">{s.label}</div>
            <div className="flex items-center gap-2.5 mb-2.5">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${s.color}24` }}>
                <s.icon size={16} style={{ color: s.color }} />
              </div>
              <span className="text-[22px] font-bold">{s.value}</span>
            </div>
            <div className="text-[10.5px]" style={{ color: s.color }}>{s.caption}</div>
          </div>
        ))}
        <div className="flex-1 bg-[var(--card-bg)] border border-[var(--border)] rounded-[14px] p-4 lg:p-[18px_20px] flex flex-col items-center justify-center shadow-[var(--shadow)]">
          <div className="text-[12px] text-[#9a9aa2] self-start mb-2">Accuracy</div>
          <RingChart value={stats.accuracy} />
          <div className="text-[10.5px] text-[#3b82f6] mt-2.5 text-center">Overall accuracy</div>
        </div>
        <div className="flex-1 bg-[var(--card-bg)] border border-[var(--border)] rounded-[14px] p-4 lg:p-[18px_20px] shadow-[var(--shadow)]">
          <div className="text-[12px] text-[#9a9aa2] mb-3.5">Best Streak</div>
          <div className="flex items-center gap-2.5 mb-2.5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(230,185,58,0.14)' }}>
              <Trophy size={16} className="text-[#e6b93a]" />
            </div>
            <span className="text-[22px] font-bold">{streakData.longest} day</span>
          </div>
          <div className="text-[10.5px] text-[#e6b93a]">Personal best</div>
        </div>
      </div>

      {/* Quick Actions + Continue Practice */}
      <div className="flex gap-4.5">
        <div className="flex-[1.3] bg-[#131317] border border-[#242429] rounded-[14px] p-5 lg:p-[22px_24px]">
          <h3 className="text-[15px] font-bold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {quickActions.map((a) => (
              <button
                key={a.title}
                onClick={a.action}
                className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-[#1a1a20] transition-colors text-left"
              >
                <div className="w-9 h-9 rounded-lg bg-[#1c1c22] border border-[#242429] flex items-center justify-center shrink-0">
                  <a.icon size={17} className="text-[#e0313b]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-[#f2f2f3] truncate">{a.title}</p>
                  <p className="text-[11px] text-[#5c5c64] truncate">{a.subtitle}</p>
                </div>
                <ArrowRight size={15} className="text-[#5c5c64] shrink-0" />
              </button>
            ))}
          </div>
        </div>

        <div className="flex-[0.9] bg-[#131317] border border-[#242429] rounded-[14px] p-5 lg:p-[22px_24px]">
          <h3 className="text-[15px] font-bold mb-4">Continue Practice</h3>
          {inProgressTest ? (
            <>
              <div className="text-base font-semibold text-[#f2f2f3] mb-1">{inProgressTest.title}</div>
              <div className="flex items-end justify-between mb-3">
                <span className="text-lg font-bold text-[#f2f2f3]">{inProgressTest.answeredQuestions || 0} / {inProgressTest.totalQuestions || inProgressTest.questionCount}</span>
                <span className="text-xs text-[#9a9aa2]">Questions</span>
              </div>
              <div className="h-2 bg-[#1a1a20] rounded-full overflow-hidden mb-4">
                <div 
                  className="h-full bg-[#e0313b] transition-all" 
                  style={{ width: `${((inProgressTest.answeredQuestions || 0) / (inProgressTest.totalQuestions || inProgressTest.questionCount || 1)) * 100}%` }} 
                />
              </div>
              <button 
                onClick={() => startPractice(inProgressTest.id, inProgressTest)}
                className="w-full flex items-center justify-center gap-2 bg-[#e0313b] hover:bg-[#c92b33] text-white text-sm font-medium rounded-lg py-2.5 transition-colors"
              >
                Continue <ArrowRight size={15} />
              </button>
            </>
          ) : (
            <>
              <div className="text-base font-semibold text-[#f2f2f3] mb-1">No Test In Progress</div>
              <div className="text-xs text-[#9a9aa2] mb-3">Start a new test to track your progress</div>
              <div className="h-2 bg-[#1a1a20] rounded-full overflow-hidden mb-4">
                <div className="h-full bg-[#1a1a20]" style={{ width: "0%" }} />
              </div>
              <button 
                onClick={() => setPage('sectional')}
                className="w-full flex items-center justify-center gap-2 border border-[#242429] hover:bg-[#1a1a20] text-[#9a9aa2] text-sm font-medium rounded-lg py-2.5 transition-colors"
              >
                Start Practice <ArrowRight size={15} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
