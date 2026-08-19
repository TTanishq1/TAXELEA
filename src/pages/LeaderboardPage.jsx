import { Trophy, Medal, Award, TrendingUp, Target, Flame } from "lucide-react";
import { Card } from "../components/ui/Card.jsx";
import { useState, useEffect } from "react";
import { getAllUsersWithStats } from "../lib/storage.js";

export function LeaderboardPage({ currentUser }) {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('overall');

  // Load real user data
  useEffect(() => {
    const loadLeaderboardData = async () => {
      try {
        const data = await getAllUsersWithStats();
        // Add rank based on total score
        const rankedData = data.map((user, index) => ({
          ...user,
          rank: index + 1
        }));
        setLeaderboardData(rankedData);
      } catch (error) {
        console.error('Error loading leaderboard data:', error);
        setLeaderboardData([]);
      } finally {
        setLoading(false);
      }
    };

    loadLeaderboardData();
  }, []);

  // Refresh leaderboard data
  const refreshLeaderboard = async () => {
    setLoading(true);
    const data = await getAllUsersWithStats();
    const rankedData = data.map((user, index) => ({
      ...user,
      rank: index + 1
    }));
    setLeaderboardData(rankedData);
    setLoading(false);
  };

  const periods = [
    { value: 'all', label: 'All Time' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' }
  ];

  const categories = [
    { value: 'overall', label: 'Overall' },
    { value: 'accuracy', label: 'Accuracy' },
    { value: 'streak', label: 'Streak' },
    { value: 'tests', label: 'Tests Taken' }
  ];

  const getRankIcon = (rank) => {
    if (rank === 1) return <Trophy className="text-yellow-400" size={20} />;
    if (rank === 2) return <Medal className="text-gray-300" size={20} />;
    if (rank === 3) return <Award className="text-amber-600" size={20} />;
    return <span className="text-[var(--text-muted)] font-semibold">{rank}</span>;
  };

  const getRankBadgeColor = (rank) => {
    if (rank === 1) return 'bg-yellow-400/10 border-yellow-400/30';
    if (rank === 2) return 'bg-gray-300/10 border-gray-300/30';
    if (rank === 3) return 'bg-amber-600/10 border-amber-600/30';
    return 'bg-[var(--hover-bg)] border-[var(--border)]';
  };

  const sortedData = [...leaderboardData].sort((a, b) => {
    switch (selectedCategory) {
      case 'accuracy':
        return b.accuracy - a.accuracy;
      case 'streak':
        return b.streak - a.streak;
      case 'tests':
        return b.testsTaken - a.testsTaken;
      default:
        return b.totalScore - a.totalScore;
    }
  });

  if (loading) {
    return (
      <div className="p-4 sm:p-6 flex items-center justify-center">
        <div className="text-[var(--text-muted)]">Loading leaderboard...</div>
      </div>
    );
  }

  if (leaderboardData.length === 0) {
    return (
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
        <div>
          <h1 className="text-xl font-bold text-[var(--text-primary)]">Leaderboard</h1>
          <p className="text-[var(--text-faint)] text-sm mt-1">See how you rank among other TAXELEA users</p>
        </div>
        <Card className="p-8 text-center">
          <div className="text-[var(--text-muted)]">
            No users yet. Be the first to complete tests and appear on the leaderboard!
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[var(--text-primary)]">Leaderboard</h1>
          <p className="text-[var(--text-faint)] text-sm mt-1">See how you rank among other TAXELEA users</p>
        </div>
        <button
          onClick={refreshLeaderboard}
          className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          Refresh
        </button>
      </div>

      {/* Period and Category Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-[var(--text-secondary)] text-xs mb-2">Time Period</label>
            <div className="flex gap-2">
              {periods.map((period) => (
                <button
                  key={period.value}
                  onClick={() => setSelectedPeriod(period.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    selectedPeriod === period.value
                      ? 'bg-[var(--danger-text)] text-white'
                      : 'bg-[var(--hover-bg)] text-[var(--text-secondary)] hover:bg-[var(--hover-bg)]/80'
                  }`}
                >
                  {period.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1">
            <label className="block text-[var(--text-secondary)] text-xs mb-2">Category</label>
            <div className="flex gap-2">
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    selectedCategory === category.value
                      ? 'bg-[var(--danger-text)] text-white'
                      : 'bg-[var(--hover-bg)] text-[var(--text-secondary)] hover:bg-[var(--hover-bg)]/80'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-3 gap-4">
        {/* 2nd Place */}
        <Card className={`p-4 ${getRankBadgeColor(2)} border-2`}>
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-gray-300/20 flex items-center justify-center text-gray-300 text-xl font-bold mb-2">
              {sortedData[1]?.avatar || 'P'}
            </div>
            {getRankIcon(2)}
            <div className="text-sm font-semibold text-[var(--text-primary)] mt-2">
              {sortedData[1]?.name || sortedData[1]?.username || 'User'}
            </div>
            <div className="text-xs text-[var(--text-muted)] mt-1">
              {selectedCategory === 'accuracy' ? `${sortedData[1]?.accuracy || 0}% accuracy` :
               selectedCategory === 'streak' ? `${sortedData[1]?.streak || 0} day streak` :
               selectedCategory === 'tests' ? `${sortedData[1]?.testsTaken || 0} tests` :
               `${sortedData[1]?.totalScore || 0} pts`}
            </div>
          </div>
        </Card>

        {/* 1st Place */}
        <Card className={`p-4 ${getRankBadgeColor(1)} border-2 border-yellow-400/50`}>
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-yellow-400/20 flex items-center justify-center text-yellow-400 text-2xl font-bold mb-2">
              {sortedData[0]?.avatar || 'A'}
            </div>
            {getRankIcon(1)}
            <div className="text-sm font-semibold text-[var(--text-primary)] mt-2">
              {sortedData[0]?.name || sortedData[0]?.username || 'User'}
            </div>
            <div className="text-xs text-[var(--text-muted)] mt-1">
              {selectedCategory === 'accuracy' ? `${sortedData[0]?.accuracy || 0}% accuracy` :
               selectedCategory === 'streak' ? `${sortedData[0]?.streak || 0} day streak` :
               selectedCategory === 'tests' ? `${sortedData[0]?.testsTaken || 0} tests` :
               `${sortedData[0]?.totalScore || 0} pts`}
            </div>
          </div>
        </Card>

        {/* 3rd Place */}
        <Card className={`p-4 ${getRankBadgeColor(3)} border-2`}>
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-amber-600/20 flex items-center justify-center text-amber-600 text-xl font-bold mb-2">
              {sortedData[2]?.avatar || 'R'}
            </div>
            {getRankIcon(3)}
            <div className="text-sm font-semibold text-[var(--text-primary)] mt-2">
              {sortedData[2]?.name || sortedData[2]?.username || 'User'}
            </div>
            <div className="text-xs text-[var(--text-muted)] mt-1">
              {selectedCategory === 'accuracy' ? `${sortedData[2]?.accuracy || 0}% accuracy` :
               selectedCategory === 'streak' ? `${sortedData[2]?.streak || 0} day streak` :
               selectedCategory === 'tests' ? `${sortedData[2]?.testsTaken || 0} tests` :
               `${sortedData[2]?.totalScore || 0} pts`}
            </div>
          </div>
        </Card>
      </div>

      {/* Full Leaderboard */}
      <Card className="divide-y divide-[var(--border)]">
        {sortedData.map((user, index) => (
          <div
            key={user.id}
            className={`flex items-center gap-4 px-4 py-3 hover:bg-[var(--hover-bg)] transition-colors ${
              currentUser?.name === user.name ? 'bg-[var(--danger-bg)]/20' : ''
            }`}
          >
            <div className="w-8 flex items-center justify-center">
              {getRankIcon(user.rank)}
            </div>
            
            <div className="w-10 h-10 rounded-full bg-[var(--elevated-bg)] flex items-center justify-center text-[var(--text-primary)] font-semibold">
              {user.avatar}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-[var(--text-primary)]">
                {user.name || user.username}
                {(currentUser?.username === user.username || currentUser?.id === user.id) && (
                  <span className="ml-2 text-xs text-[var(--danger-text)]">(You)</span>
                )}
              </div>
              <div className="text-xs text-[var(--text-muted)]">
                {user.testsTaken} tests • {user.streak} day streak
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-sm font-semibold text-[var(--text-primary)]">
                {selectedCategory === 'accuracy' ? `${user.accuracy}%` :
                 selectedCategory === 'streak' ? `${user.streak}` :
                 selectedCategory === 'tests' ? `${user.testsTaken}` :
                 user.totalScore}
              </div>
              <div className="text-xs text-[var(--text-muted)]">
                {selectedCategory === 'accuracy' ? 'accuracy' :
                 selectedCategory === 'streak' ? 'streak' :
                 selectedCategory === 'tests' ? 'tests' : 'points'}
              </div>
            </div>
          </div>
        ))}
      </Card>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={16} className="text-[var(--ok-text)]" />
            <div className="text-xs text-[var(--text-muted)]">Total Users</div>
          </div>
          <div className="text-lg font-bold text-[var(--text-primary)]">{leaderboardData.length}</div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target size={16} className="text-[var(--danger-text)]" />
            <div className="text-xs text-[var(--text-muted)]">Avg. Score</div>
          </div>
          <div className="text-lg font-bold text-[var(--text-primary)]">
            {Math.round(leaderboardData.reduce((acc, user) => acc + user.totalScore, 0) / leaderboardData.length)}
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Flame size={16} className="text-orange-500" />
            <div className="text-xs text-[var(--text-muted)]">Avg. Streak</div>
          </div>
          <div className="text-lg font-bold text-[var(--text-primary)]">
            {Math.round(leaderboardData.reduce((acc, user) => acc + user.streak, 0) / leaderboardData.length)} days
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Award size={16} className="text-purple-500" />
            <div className="text-xs text-[var(--text-muted)]">Avg. Accuracy</div>
          </div>
          <div className="text-lg font-bold text-[var(--text-primary)]">
            {Math.round(leaderboardData.reduce((acc, user) => acc + user.accuracy, 0) / leaderboardData.length)}%
          </div>
        </Card>
      </div>
    </div>
  );
}