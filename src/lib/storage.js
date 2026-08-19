export async function loadTheme() {
  try {
    const r = localStorage.getItem("taxelea:theme");
    return r ? r : "dark";
  } catch (_e) { return "dark"; }
}
export async function saveTheme(t) {
  try { localStorage.setItem("taxelea:theme", t); } catch (_e) {}
}

export async function loadResults() {
  try {
    const r = localStorage.getItem("taxelea:results");
    return r ? JSON.parse(r) : [];
  } catch (_e) {
    return [];
  }
}
export async function saveResults(results) {
  try { localStorage.setItem("taxelea:results", JSON.stringify(results)); } catch (_e) {}
}

export async function loadResultsForUser(userId) {
  try {
    const allResults = await loadResults();
    return allResults.filter(r => r.userId === userId);
  } catch (_e) {
    return [];
  }
}
export async function loadBookmarks() {
  try {
    const r = localStorage.getItem("taxelea:bookmarks");
    return r ? JSON.parse(r) : [];
  } catch (_e) { return []; }
}
export async function saveBookmarks(bm) {
  try { localStorage.setItem("taxelea:bookmarks", JSON.stringify(bm)); } catch (_e) {}
}

// In-progress test tracking
export async function loadInProgressTest() {
  try {
    const r = localStorage.getItem("taxelea:in-progress");
    return r ? JSON.parse(r) : null;
  } catch (_e) {
    return null;
  }
}
export async function clearAllProgress() {
  try {
    // Clear all user-generated data as per requirements
    localStorage.removeItem("taxelea:results"); // Test History
    localStorage.removeItem("taxelea:bookmarks"); // Bookmarks
    localStorage.removeItem("taxelea:in-progress"); // In-progress tests
    localStorage.removeItem("taxelea:test-timing"); // Test timing configuration
    // Clear any additional data that might be added in the future
    // Streak & Activity is derived from results, so clearing results clears streak data
    // Performance is derived from results, so clearing results clears performance data
    // Pomodoro progress would be in a separate key if implemented
    return true;
  } catch (_e) {
    return false;
  }
}

export async function saveInProgressTest(testData) {
  try { localStorage.setItem("taxelea:in-progress", JSON.stringify(testData)); } catch (_e) {}
}
export async function clearInProgressTest() {
  try { localStorage.setItem("taxelea:in-progress", JSON.stringify(null)); } catch (_e) {}
}

// Test timing configuration
export async function loadTestTimingConfig() {
  try {
    const r = localStorage.getItem("taxelea:test-timing");
    return r ? JSON.parse(r) : {};
  } catch (_e) {
    return {};
  }
}
export async function saveTestTimingConfig(config) {
  try { localStorage.setItem("taxelea:test-timing", JSON.stringify(config)); } catch (_e) {}
}

// User management
export async function loadCurrentUser() {
  try {
    const r = localStorage.getItem("taxelea:current-user");
    if (!r) return null;
    try {
      return JSON.parse(r);
    } catch (parseError) {
      console.error('Error parsing current user data:', parseError);
      return null;
    }
  } catch (_e) {
    return null;
  }
}
export async function saveCurrentUser(user) {
  try { localStorage.setItem("taxelea:current-user", JSON.stringify(user)); } catch (_e) {}
}
export async function loadUsers() {
  try {
    const r = localStorage.getItem("taxelea:users");
    return r ? JSON.parse(r) : [];
  } catch (_e) {
    return [];
  }
}
export async function saveUsers(users) {
  try { localStorage.setItem("taxelea:users", JSON.stringify(users)); } catch (_e) {}
}

// Get user by username
export async function getUserByUsername(username) {
  try {
    const users = await loadUsers();
    return users.find(u => u.username.toLowerCase() === username.toLowerCase()) || null;
  } catch (_e) {
    return null;
  }
}

// Calculate user performance stats for leaderboard
export async function calculateUserStats(userId) {
  try {
    const userResults = await loadResultsForUser(userId);
    
    if (userResults.length === 0) {
      return {
        totalScore: 0,
        testsTaken: 0,
        accuracy: 0,
        streak: 0
      };
    }

    const totalScore = userResults.reduce((acc, r) => acc + (r.score || 0), 0);
    const testsTaken = userResults.length;
    
    // Calculate accuracy using correct and total from results
    const totalCorrect = userResults.reduce((acc, r) => acc + (r.correct || 0), 0);
    const totalQuestions = userResults.reduce((acc, r) => acc + (r.total || 0), 0);
    const accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

    // Calculate streak (consecutive days with activity)
    const dates = userResults
      .map(r => {
        const date = r.date || r.completedAt || r.id;
        return new Date(date).toDateString();
      })
      .filter((date, index, self) => self.indexOf(date) === index)
      .sort((a, b) => new Date(b) - new Date(a));
    
    let streak = 0;
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    
    if (dates.length > 0 && (dates[0] === today || dates[0] === yesterday)) {
      streak = 1;
      for (let i = 1; i < dates.length; i++) {
        const current = new Date(dates[i - 1]);
        const previous = new Date(dates[i]);
        const diffDays = Math.floor((current - previous) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          streak++;
        } else {
          break;
        }
      }
    }

    return {
      totalScore,
      testsTaken,
      accuracy,
      streak
    };
  } catch (_e) {
    return {
      totalScore: 0,
      testsTaken: 0,
      accuracy: 0,
      streak: 0
    };
  }
}

// Get all users with their stats for leaderboard
export async function getAllUsersWithStats() {
  try {
    const users = await loadUsers();
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const stats = await calculateUserStats(user.id);
        return {
          ...user,
          ...stats,
          avatar: user.name.charAt(0).toUpperCase()
        };
      })
    );
    
    return usersWithStats.sort((a, b) => b.totalScore - a.totalScore);
  } catch (_e) {
    return [];
  }
}

// Authentication - Single User System
import { hashPassword, verifyPassword } from './crypto.js';
export async function loadPasswordHash() {
  try {
    const r = localStorage.getItem("taxelea:password-hash");
    return r ? r : null;
  } catch (_e) {
    return null;
  }
}
export async function savePasswordHash(hash) {
  try { localStorage.setItem("taxelea:password-hash", hash); } catch (_e) {}
}
export async function isOwnerSetup() {
  try {
    const hash = await loadPasswordHash();
    return hash !== null;
  } catch (error) {
    console.error('Error checking owner setup:', error);
    return false;
  }
}
export async function loadSession() {
  try {
    const r = localStorage.getItem("taxelea:session");
    if (!r) return null;
    try {
      return JSON.parse(r);
    } catch (parseError) {
      console.error('Error parsing session data:', parseError);
      return null;
    }
  } catch (_e) {
    return null;
  }
}
export async function saveSession(session) {
  try { localStorage.setItem("taxelea:session", JSON.stringify(session)); } catch (_e) {}
}
export async function clearSession() {
  try { localStorage.setItem("taxelea:session", JSON.stringify(null)); } catch (_e) {}
}

export async function setupOwner(username, password, name) {
  const isSetup = await isOwnerSetup();
  if (isSetup) {
    return { success: false, error: 'Owner already setup' };
  }
  
  // Check if username already exists
  const existingUser = await getUserByUsername(username);
  if (existingUser) {
    return { success: false, error: 'Username already taken' };
  }
  
  const hash = await hashPassword(password);
  await savePasswordHash(hash);
  
  // Create owner user
  const owner = {
    id: 'owner',
    username: username,
    name: name || username,
    email: `${username}@taxelea.local`,
    createdAt: new Date().toISOString()
  };
  
  // Save to users array
  const users = await loadUsers();
  users.push(owner);
  await saveUsers(users);
  
  // Create session
  const session = {
    userId: owner.id,
    username: owner.username,
    createdAt: new Date().toISOString()
  };
  await saveSession(session);
  await saveCurrentUser(owner);
  
  return { success: true, user: owner };
}

export async function login(username, password) {
  const hash = await loadPasswordHash();
  if (!hash) {
    return { success: false, error: 'Owner not setup. Please set up your account first.' };
  }
  
  // Find user by username
  const user = await getUserByUsername(username);
  if (!user) {
    return { success: false, error: 'User not found' };
  }
  
  const isValid = await verifyPassword(password, hash);
  
  if (!isValid) {
    return { success: false, error: 'Invalid password' };
  }
  
  // Create session
  const session = {
    userId: user.id,
    username: user.username,
    createdAt: new Date().toISOString()
  };
  await saveSession(session);
  await saveCurrentUser(user);
  
  return { success: true, user: user };
}

export async function changePassword(oldPassword, newPassword) {
  const hash = await loadPasswordHash();
  if (!hash) {
    return { success: false, error: 'Owner not setup' };
  }
  
  const isValid = await verifyPassword(oldPassword, hash);
  
  if (!isValid) {
    return { success: false, error: 'Current password is incorrect' };
  }
  
  const newHash = await hashPassword(newPassword);
  await savePasswordHash(newHash);
  
  return { success: true };
}

export async function logout() {
  await clearSession();
  await saveCurrentUser(null);
  return { success: true };
}

// Register new user (after owner setup)
export async function registerUser(username, password, name) {
  const isSetup = await isOwnerSetup();
  if (!isSetup) {
    return { success: false, error: 'Please set up owner account first' };
  }
  
  // Check if username already exists
  const existingUser = await getUserByUsername(username);
  if (existingUser) {
    return { success: false, error: 'Username already taken' };
  }
  
  // Create new user
  const newUser = {
    id: `user_${Date.now()}`,
    username: username,
    name: name || username,
    email: `${username}@taxelea.local`,
    createdAt: new Date().toISOString()
  };
  
  // Save to users array
  const users = await loadUsers();
  users.push(newUser);
  await saveUsers(users);
  
  return { success: true, user: newUser };
}
