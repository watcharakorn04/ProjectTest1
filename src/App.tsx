import React, { useState, useEffect } from "react";
import { Auth } from "./components/Auth";
import { Dashboard } from "./components/Dashboard";
import { Challenges } from "./components/Challenges";
import { Arena } from "./components/Arena";
import { CreatorStudio } from "./components/CreatorStudio";
import { Leaderboard } from "./components/Leaderboard";
import { CheatSheet } from "./components/CheatSheet";
import { OperatorSettings } from "./components/OperatorSettings";
import { UserManagement } from "./components/UserManagement";
import { initialAppState } from "./mockData";
import { AppState, Problem, UserState } from "./types";
import { playSound } from "./utils/audio";
import {
  Terminal,
  Cpu,
  Trophy,
  LayoutDashboard,
  PlusCircle,
  LogOut,
  Sparkles,
  HelpCircle,
  Menu,
  X,
  Zap,
  Info,
  BookOpen,
  Settings,
  User,
  Users
} from "lucide-react";

export default function App() {
  // Authentication & Session
  const [currentUser, setCurrentUser] = useState<UserState | null>(() => {
    const saved = localStorage.getItem("netforge_currentUser");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return null;
  });

  // Main Application State
  const [appState, setAppState] = useState<AppState>(() => {
    const saved = localStorage.getItem("netforge_state");
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as AppState;
        if (parsed && Array.isArray(parsed.problems)) {
          const mergedProblems = [...parsed.problems];
          initialAppState.problems.forEach((defaultProb) => {
            const existingIdx = mergedProblems.findIndex((p) => p.id === defaultProb.id);
            if (existingIdx !== -1) {
              // Sync the latest metadata, instructions, and correct answers
              mergedProblems[existingIdx] = {
                ...mergedProblems[existingIdx],
                ...defaultProb
              };
            } else {
              mergedProblems.push(defaultProb);
            }
          });
          parsed.problems = mergedProblems;
        }
        if (!parsed.users || parsed.users.length === 0) {
          parsed.users = initialAppState.users;
        }
        return parsed;
      } catch {}
    }
    return initialAppState;
  });

  // Track completed problem IDs by the user
  const [completedProblems, setCompletedProblems] = useState<string[]>(() => {
    const saved = localStorage.getItem("netforge_completed_problems");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return ["prob_001"]; // Start with 1 completed problem to showcase "solved" tag
  });

  // Currently loaded active challenge
  const [activeProblem, setActiveProblem] = useState<Problem | null>(null);

  // Currently being edited challenge
  const [editingProblem, setEditingProblem] = useState<Problem | null>(null);

  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState<"dashboard" | "arena" | "creator" | "leaderboard" | "cheatsheet" | "settings" | "myprofile" | "manage_users">("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Save states to local storage on changes
  useEffect(() => {
    localStorage.setItem("netforge_state", JSON.stringify(appState));
  }, [appState]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("netforge_currentUser", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("netforge_currentUser");
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem("netforge_completed_problems", JSON.stringify(completedProblems));
  }, [completedProblems]);

  const handleLogin = (user: UserState) => {
    setCurrentUser(user);
    setActiveTab("dashboard");
  };

  const handleLogout = () => {
    playSound("complete");
    setCurrentUser(null);
    setActiveProblem(null);
    setMobileMenuOpen(false);
  };

  // Callback when user successfully solves a challenge
  const handleSolveProblem = (pointsEarned: number) => {
    if (!activeProblem) return;

    const isAlreadyCompleted = completedProblems.includes(activeProblem.id);
    const newPoints = isAlreadyCompleted ? 0 : pointsEarned;

    // Add to completed list
    if (!isAlreadyCompleted) {
      setCompletedProblems((prev) => [...prev, activeProblem.id]);
    }

    // Update user state points & compute new leaderboard ranking
    if (currentUser && newPoints > 0) {
      const updatedPoints = currentUser.totalPoints + newPoints;
      
      const updatedUser: UserState = {
        ...currentUser,
        totalPoints: updatedPoints,
      };

      setCurrentUser(updatedUser);

      // Dynamically update the global leaderboard state
      setAppState((prev) => {
        const updatedLeaderboard = prev.leaderboard.map((entry) => {
          if (entry.username === currentUser.username) {
            const accNum = parseFloat(entry.accuracy.replace("%", ""));
            const newAcc = Math.min(99.5, accNum + 0.5);
            return {
              ...entry,
              points: updatedPoints,
              accuracy: `${newAcc.toFixed(1)}%`,
            };
          }
          return entry;
        });

        // Re-sort leaderboard by points
        const sorted = [...updatedLeaderboard].sort((a, b) => b.points - a.points);
        const reRanked = sorted.map((entry, idx) => ({
          ...entry,
          rank: idx + 1,
        }));

        // Find my new rank
        const myRank = reRanked.find((entry) => entry.username === currentUser.username)?.rank || currentUser.globalRank;
        
        // Update user's rank locally
        setCurrentUser({
          ...updatedUser,
          globalRank: myRank,
        });

        return {
          ...prev,
          leaderboard: reRanked,
        };
      });
    }
  };

  const handlePublishProblem = (publishedProblem: Problem) => {
    setAppState((prev) => {
      const exists = prev.problems.some((p) => p.id === publishedProblem.id);
      let updatedProblems;
      if (exists) {
        updatedProblems = prev.problems.map((p) =>
          p.id === publishedProblem.id ? publishedProblem : p
        );
      } else {
        updatedProblems = [publishedProblem, ...prev.problems];
      }
      return {
        ...prev,
        problems: updatedProblems,
      };
    });
    setEditingProblem(null);
    setActiveTab("dashboard");
  };

  // Next problem loader
  const handleNextProblem = () => {
    if (!activeProblem) return;
    const currentIndex = appState.problems.findIndex((p) => p.id === activeProblem.id);
    if (currentIndex !== -1 && currentIndex < appState.problems.length - 1) {
      const nextProblem = appState.problems[currentIndex + 1];
      setActiveProblem(nextProblem);
      playSound("click");
    } else {
      // Loop back to the first challenge in the index
      const firstProblem = appState.problems[0];
      setActiveProblem(firstProblem);
      playSound("click");
    }
  };

  const handleUpdateUser = (updated: UserState) => {
    setCurrentUser(updated);
    setAppState((prev) => {
      const updatedLeaderboard = prev.leaderboard.map((entry) => {
        if (entry.username === currentUser?.username) {
          return {
            ...entry,
            username: updated.username,
          };
        }
        return entry;
      });
      return {
        ...prev,
        leaderboard: updatedLeaderboard,
      };
    });
  };

  const handleUpdateUsers = (updatedList: UserState[]) => {
    setAppState((prev) => ({
      ...prev,
      users: updatedList
    }));
  };

  const handleResetProgress = () => {
    playSound("complete");
    const freshUser: UserState = {
      username: "NetCadet_99",
      mockRole: "Student",
      totalPoints: 0,
      globalRank: 14,
    };
    setCurrentUser(freshUser);
    setCompletedProblems([]);
    localStorage.removeItem("netforge_completed_problems");
    
    setAppState((prev) => {
      const updatedLeaderboard = prev.leaderboard.map((entry) => {
        if (entry.username === currentUser?.username || entry.username === "NetCadet_99") {
          return {
            ...entry,
            username: "NetCadet_99",
            points: 0,
            accuracy: "0.0%",
          };
        }
        return entry;
      });
      return {
        ...prev,
        leaderboard: updatedLeaderboard,
      };
    });
  };

  const handleSeedDefaults = () => {
    playSound("complete");
    setAppState((prev) => ({
      ...prev,
      problems: initialAppState.problems,
    }));
  };

  // If user is not logged in, render Auth Gate
  if (!currentUser) {
    return <Auth onLoginSuccess={handleLogin} />;
  }

  const theme = currentUser?.terminalTheme || "Cyan";
  let avatarBg = "bg-blue-500/10";
  let avatarBorder = "border-[#00E5FF]/25";
  let avatarText = "text-[#00E5FF]";
  let avatarDot = "bg-[#00E5FF]";

  if (theme === "Emerald") {
    avatarBg = "bg-emerald-500/10";
    avatarBorder = "border-emerald-500/25";
    avatarText = "text-emerald-400";
    avatarDot = "bg-emerald-500";
  } else if (theme === "Amber") {
    avatarBg = "bg-amber-500/10";
    avatarBorder = "border-amber-500/25";
    avatarText = "text-amber-400";
    avatarDot = "bg-amber-500";
  } else if (theme === "Ruby") {
    avatarBg = "bg-rose-500/10";
    avatarBorder = "border-rose-500/25";
    avatarText = "text-rose-400";
    avatarDot = "bg-rose-500";
  }

  return (
    <div className="min-h-screen bg-[#050508] text-[#E0E0E0] flex flex-col md:flex-row font-sans selection:bg-[#00E5FF]/20 selection:text-[#00E5FF]">
      
      {/* DESKTOP SIDEBAR NAVIGATION */}
      <aside className="hidden md:flex flex-col w-64 bg-[#0A1120] border-r border-slate-800/80 h-screen sticky top-0 z-40 p-5 shrink-0 justify-between">
        
        <div className="space-y-6">
          {/* Brand Logo */}
          <div className="flex items-start gap-3 pb-2">
            <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 shrink-0">
              <Cpu className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-black text-white tracking-wider">NETFORGE</span>
                <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-md bg-blue-600/20 text-[#00E5FF] tracking-wider uppercase">ARENA</span>
              </div>
              <span className="text-[10px] text-slate-500 block mt-0.5 font-medium leading-tight">
                Network configuration training
              </span>
            </div>
          </div>

          {/* User Profile Card (Glow and design matching screenshot) */}
          <div className="p-4 rounded-2xl bg-[#0B1528]/80 border border-slate-800/60 space-y-3">
            <div className="flex items-center gap-3">
              {/* Dynamic Theme Avatar Icon */}
              <div className={`w-10 h-10 rounded-full ${avatarBg} border ${avatarBorder} flex items-center justify-center ${avatarText} font-bold shrink-0 relative`}>
                <div className={`w-2.5 h-2.5 rounded-full ${avatarDot} absolute -bottom-0.5 -right-0.5 border-2 border-[#0A1120]`} />
                <User className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-extrabold text-white truncate leading-none mb-1.5">
                  {currentUser.username}
                </div>
                <div className="flex flex-wrap items-center gap-1">
                  <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-blue-600/20 text-blue-400 font-mono">
                    LV 1
                  </span>
                  <span className="text-[8px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono uppercase tracking-wider">
                    {currentUser.mockRole === "Student" ? "CADET" : currentUser.mockRole === "Tutor" ? "INSTRUCTOR" : "SYSADMIN"}
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold font-mono">
                    Rank #{currentUser.globalRank}
                  </span>
                </div>
              </div>
            </div>

            {/* XP progress bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                <span>XP Progress</span>
                <span className="font-mono">{currentUser.totalPoints}/1000</span>
              </div>
              <div className="h-1.5 w-full bg-[#050A14] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (currentUser.totalPoints / 1000) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex flex-col gap-1">
            {[
              { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
              { id: "arena", label: "Challenges", icon: BookOpen, badge: activeProblem ? "Active" : undefined },
              ...(currentUser.mockRole === "Admin" ? [{ id: "manage_users", label: "Manage Users", icon: Users }] : []),
              { id: "creator", label: "Create", icon: PlusCircle },
              { id: "leaderboard", label: "Leaderboard", icon: Trophy },
              { id: "cheatsheet", label: "CLI Cheat Sheet", icon: HelpCircle },
              { id: "myprofile", label: "My Profile", icon: User },
              { id: "settings", label: "Settings", icon: Settings },
            ].map((menu) => {
              const Icon = menu.icon;
              const isActive = activeTab === menu.id;
              return (
                <button
                  key={menu.id}
                  onClick={() => { playSound("click"); setActiveTab(menu.id as any); }}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer group ${
                    isActive
                      ? "bg-blue-600/10 text-blue-400 border border-blue-500/25 font-extrabold"
                      : "text-slate-400 hover:text-slate-200 border border-transparent hover:bg-slate-900/30"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-4.5 w-4.5 ${isActive ? "text-blue-400" : "text-slate-400 group-hover:text-slate-300"}`} />
                    <span>{menu.label}</span>
                  </div>
                  {menu.badge && (
                    <span className="text-[8px] bg-[#00E5FF]/20 text-[#00E5FF] px-1.5 py-0.5 rounded-md font-mono animate-pulse">
                      {menu.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sign Out Button at Bottom */}
        <button
          onClick={handleLogout}
          className="w-full px-3.5 py-3 rounded-xl text-xs font-bold tracking-wider uppercase transition-all flex items-center gap-3 text-slate-400 hover:text-rose-400 hover:bg-rose-950/20 border border-transparent hover:border-rose-900/10 cursor-pointer group"
        >
          <LogOut className="h-4.5 w-4.5 text-slate-400 group-hover:text-rose-400" />
          <span>Sign Out</span>
        </button>

      </aside>

      {/* MOBILE HEADER BAR */}
      <div className="md:hidden flex flex-col w-full z-40 sticky top-0 bg-[#0A1120]/95 backdrop-blur-md border-b border-slate-800/80">
        <header className="px-4 py-3.5 flex justify-between items-center">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <Cpu className="h-4.5 w-4.5" />
            </div>
            <div>
              <h1 className="text-sm font-black tracking-wider text-white leading-none uppercase">
                NETFORGE <span className="text-[8px] px-1 py-0.5 rounded bg-blue-600/20 text-[#00E5FF] uppercase font-bold">Arena</span>
              </h1>
            </div>
          </div>

          {/* User quick stats & profile */}
          <div className="flex items-center gap-3">
            <div className="text-right font-mono">
              <div className="text-xs font-black text-[#E0E0E0] truncate max-w-[80px]">{currentUser.username}</div>
              <div className="text-[9px] font-bold text-blue-400 uppercase tracking-wider">
                LV 1 // {currentUser.totalPoints} XP
              </div>
            </div>
            
            {/* Mobile menu toggle */}
            <button
              onClick={() => { playSound("click"); setMobileMenuOpen(!mobileMenuOpen); }}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white cursor-pointer"
            >
              {mobileMenuOpen ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
            </button>
          </div>

        </header>

        {/* Mobile drawer panel */}
        {mobileMenuOpen && (
          <div className="bg-[#0A1120] border-t border-slate-800/60 p-4 space-y-3 animate-in slide-in-from-top-4 duration-200">
            
            <div className="flex justify-between items-center pb-2 border-b border-slate-900 text-xs">
              <span className="text-slate-500 font-semibold">User:</span>
              <span className="text-blue-400 font-extrabold">{currentUser.username} ({currentUser.totalPoints} XP)</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {[
                { id: "dashboard", label: "Dashboard" },
                { id: "arena", label: "Challenges" },
                ...(currentUser.mockRole === "Admin" ? [{ id: "manage_users", label: "Manage Users" }] : []),
                { id: "creator", label: "Create" },
                { id: "leaderboard", label: "Leaderboard" },
                { id: "cheatsheet", label: "CLI Cheat Sheet" },
                { id: "myprofile", label: "My Profile" },
                { id: "settings", label: "Settings" },
              ].map((menu) => (
                <button
                  key={menu.id}
                  onClick={() => { playSound("click"); setActiveTab(menu.id as any); setMobileMenuOpen(false); }}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold text-left transition-all border ${
                    activeTab === menu.id
                      ? "bg-blue-600/15 text-blue-400 border-blue-500/25"
                      : "text-slate-400 border-transparent bg-slate-950/20"
                  }`}
                >
                  {menu.label}
                </button>
              ))}
            </div>

            <button
              onClick={handleLogout}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold tracking-wider uppercase text-center text-rose-400 bg-rose-950/20 hover:bg-rose-950 transition-all flex items-center justify-center gap-2 border border-rose-900/30"
            >
              <LogOut className="h-4 w-4" /> Disconnect Node
            </button>
          </div>
        )}
      </div>

      {/* Main Container taking remainder width */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Main Content Space */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 relative">
          
          {/* Render pages depending on active tab state */}
          {activeTab === "dashboard" && (
            <Dashboard
              appState={appState}
              onSelectProblem={(prob) => { setActiveProblem(prob); setActiveTab("arena"); }}
              onNavigate={setActiveTab}
              completedProblems={completedProblems}
            />
          )}

          {activeTab === "arena" && (
            activeProblem ? (
              <Arena
                problem={activeProblem}
                onQuit={() => { playSound("click"); setActiveProblem(null); setActiveTab("arena"); }}
                onSolve={handleSolveProblem}
                onNextProblem={handleNextProblem}
                hasNextProblem={appState.problems.findIndex((p) => p.id === activeProblem.id) < appState.problems.length - 1}
              />
            ) : (
              <Challenges
                appState={appState}
                onSelectProblem={setActiveProblem}
                onNavigate={setActiveTab}
                completedProblems={completedProblems}
                currentUser={currentUser}
                onEditProblem={(prob) => {
                  setEditingProblem(prob);
                  setActiveTab("creator");
                }}
              />
            )
          )}

          {activeTab === "creator" && (
            <CreatorStudio
              onPublish={handlePublishProblem}
              onCancel={() => {
                playSound("click");
                setEditingProblem(null);
                setActiveTab("dashboard");
              }}
              problemToEdit={editingProblem || undefined}
              currentUser={currentUser || undefined}
            />
          )}

          {activeTab === "cheatsheet" && (
            <CheatSheet />
          )}

          {activeTab === "leaderboard" && (
            <Leaderboard
              leaderboard={appState.leaderboard}
              currentUserState={currentUser}
            />
          )}

          {activeTab === "myprofile" && (
            <OperatorSettings
              currentUserState={currentUser}
              onUpdateUser={handleUpdateUser}
              onResetProgress={handleResetProgress}
              onSeedDefaults={handleSeedDefaults}
              mode="profile"
            />
          )}

          {activeTab === "settings" && (
            <OperatorSettings
              currentUserState={currentUser}
              onUpdateUser={handleUpdateUser}
              onResetProgress={handleResetProgress}
              onSeedDefaults={handleSeedDefaults}
              mode="settings"
            />
          )}

          {activeTab === "manage_users" && (
            <UserManagement
              users={appState.users || []}
              onUpdateUsers={handleUpdateUsers}
              currentUser={currentUser}
            />
          )}

        </main>

        {/* Footer system status line */}
        <footer className="bg-[#050508] border-t border-slate-900/40 px-4 py-3 flex flex-col sm:flex-row justify-between items-center text-[10px] font-mono text-slate-600 gap-2 mt-auto">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>NETFORGE CLOUD ENGINE v4.0.1 // STANDBY SECURE</span>
          </div>
          <div className="flex items-center gap-3">
            <span>PORT 3000</span>
            <span>© 2026 NETFORGE ACADEMY</span>
          </div>
        </footer>

      </div>

    </div>
  );
}
