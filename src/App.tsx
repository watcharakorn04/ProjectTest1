import React, { useState, useEffect } from "react";
import { Auth } from "./components/Auth";
import { Dashboard } from "./components/Dashboard";
import { Arena } from "./components/Arena";
import { CreatorStudio } from "./components/CreatorStudio";
import { Leaderboard } from "./components/Leaderboard";
import { CheatSheet } from "./components/CheatSheet";
import { OperatorSettings } from "./components/OperatorSettings";
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
  Settings
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
        return JSON.parse(saved);
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

  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState<"dashboard" | "arena" | "creator" | "leaderboard" | "cheatsheet" | "settings">("dashboard");
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

  const handlePublishProblem = (newProblem: Problem) => {
    // Append newly drafted problem to the list
    setAppState((prev) => ({
      ...prev,
      problems: [newProblem, ...prev.problems],
    }));
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

  return (
    <div className="min-h-screen bg-[#050508] text-[#E0E0E0] flex flex-col md:flex-row font-sans selection:bg-[#00E5FF]/20 selection:text-[#00E5FF]">
      
      {/* DESKTOP SIDEBAR NAVIGATION */}
      <aside className="hidden md:flex flex-col w-64 bg-[#0D111A] border-r border-slate-850 h-screen sticky top-0 z-40 p-5 shrink-0 justify-between">
        
        <div className="space-y-6">
          {/* Brand Logo */}
          <div className="flex items-center gap-3 pb-4 border-b border-slate-900">
            <div className="p-2 rounded-xl bg-[#1A237E]/30 border border-[#00E5FF]/30 text-[#00E5FF]">
              <Cpu className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight text-white leading-none font-mono">
                NET<span className="text-[#00E5FF]">FORGE</span>
              </h1>
              <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest block mt-1">
                GAMIFIED CLI CORE
              </span>
            </div>
          </div>

          {/* Navigation Items (6 Menus) */}
          <nav className="flex flex-col gap-1.5">
            {[
              { id: "dashboard", label: "Arena Hub", icon: LayoutDashboard },
              { id: "arena", label: "Gameplay Arena", icon: Terminal, badge: activeProblem ? "Active" : undefined },
              { id: "creator", label: "Creator Studio", icon: PlusCircle },
              { id: "leaderboard", label: "Leaderboard", icon: Trophy },
              { id: "cheatsheet", label: "CLI Cheat Sheet", icon: BookOpen },
              { id: "settings", label: "Settings", icon: Settings },
            ].map((menu) => {
              const Icon = menu.icon;
              const isActive = activeTab === menu.id;
              return (
                <button
                  key={menu.id}
                  onClick={() => { playSound("click"); setActiveTab(menu.id as any); }}
                  className={`w-full px-4 py-2.5 rounded-xl text-xs font-mono font-bold tracking-wider uppercase transition-all flex items-center justify-between cursor-pointer group ${
                    isActive
                      ? "bg-[#1A237E]/40 text-[#00E5FF] border border-[#00E5FF]/30 shadow-[0_0_8px_rgba(0,229,255,0.15)]"
                      : "text-slate-400 hover:text-slate-200 border border-transparent hover:bg-slate-900/40"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`h-4.5 w-4.5 ${isActive ? "text-[#00E5FF]" : "text-slate-400 group-hover:text-slate-300"}`} />
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

        {/* User profile quickcard bottom */}
        <div className="pt-4 border-t border-slate-900 flex items-center justify-between gap-3 font-mono">
          <div className="min-w-0 flex-1">
            <div className="text-xs font-black text-[#E0E0E0] truncate">{currentUser.username}</div>
            <div className="text-[9px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1 mt-0.5">
              <Zap className="h-3 w-3 fill-amber-400 text-amber-500" />
              {currentUser.totalPoints} PTS
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="p-2.5 rounded-xl bg-[#050508] border border-slate-850 hover:bg-rose-950/40 hover:border-rose-900/40 text-slate-500 hover:text-rose-400 transition-all cursor-pointer shrink-0"
            title="Disconnect Terminal Session"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>

      </aside>

      {/* MOBILE HEADER BAR */}
      <div className="md:hidden flex flex-col w-full z-40 sticky top-0 bg-[#0D111A]/95 backdrop-blur-md border-b border-slate-850">
        <header className="px-4 py-3.5 flex justify-between items-center">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#1A237E]/30 border border-[#00E5FF]/30 text-[#00E5FF]">
              <Cpu className="h-4.5 w-4.5" />
            </div>
            <div>
              <h1 className="text-md font-black tracking-tight text-white leading-none font-mono">
                NET<span className="text-[#00E5FF]">FORGE</span>
              </h1>
              <span className="text-[8px] font-mono font-bold text-slate-500 uppercase tracking-widest block mt-0.5">
                GAMIFIED CLI CORE
              </span>
            </div>
          </div>

          {/* User quick stats & profile */}
          <div className="flex items-center gap-3">
            <div className="text-right font-mono">
              <div className="text-xs font-black text-[#E0E0E0] truncate max-w-[80px]">{currentUser.username}</div>
              <div className="text-[9px] font-bold text-amber-400 uppercase tracking-wider">
                {currentUser.totalPoints} PTS
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
          <div className="bg-[#0D111A] border-t border-slate-850 p-4 space-y-3 animate-in slide-in-from-top-4 duration-200">
            
            <div className="flex justify-between items-center pb-2 border-b border-slate-900 font-mono text-xs">
              <span className="text-slate-500">Node Status:</span>
              <span className="text-[#00E5FF] font-bold">{currentUser.username} ({currentUser.totalPoints} pts)</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {[
                { id: "dashboard", label: "Arena Hub" },
                { id: "arena", label: "Gameplay Arena" },
                { id: "creator", label: "Creator Studio" },
                { id: "leaderboard", label: "Leaderboard" },
                { id: "cheatsheet", label: "CLI Cheat Sheet" },
                { id: "settings", label: "Settings" },
              ].map((menu) => (
                <button
                  key={menu.id}
                  onClick={() => { playSound("click"); setActiveTab(menu.id as any); setMobileMenuOpen(false); }}
                  className={`py-2.5 px-3 rounded-xl text-xs font-mono font-bold tracking-wider uppercase text-left transition-all border ${
                    activeTab === menu.id
                      ? "bg-[#1A237E]/40 text-[#00E5FF] border-[#00E5FF]/20"
                      : "text-slate-400 border-transparent bg-slate-950/20"
                  }`}
                >
                  {menu.label}
                </button>
              ))}
            </div>

            <button
              onClick={handleLogout}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-mono font-bold tracking-wider uppercase text-center text-rose-400 bg-rose-950/20 hover:bg-rose-950 transition-all flex items-center justify-center gap-2 border border-rose-900/30"
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
                onQuit={() => { playSound("click"); setActiveProblem(null); setActiveTab("dashboard"); }}
                onSolve={handleSolveProblem}
                onNextProblem={handleNextProblem}
                hasNextProblem={appState.problems.findIndex((p) => p.id === activeProblem.id) < appState.problems.length - 1}
              />
            ) : (
              <div className="py-20 text-center max-w-sm mx-auto space-y-4">
                <div className="w-16 h-16 bg-[#1A237E]/20 border border-slate-800 rounded-full mx-auto flex items-center justify-center text-slate-500">
                  <Terminal className="h-7 w-7" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-black text-white uppercase tracking-tight font-mono">
                    No Active Session Loaded
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                    Select a gamified configuration problem from the Arena Hub feed to compile and begin your training session.
                  </p>
                </div>
                <button
                  onClick={() => { playSound("click"); setActiveTab("dashboard"); }}
                  className="w-full bg-[#1A237E] hover:bg-[#1A237E]/80 text-[#00E5FF] border border-[#00E5FF]/30 font-mono font-bold py-3.5 rounded-2xl text-xs uppercase tracking-wider transition-all cursor-pointer"
                >
                  BROWSE ARENA CHALLENGES
                </button>
              </div>
            )
          )}

          {activeTab === "creator" && (
            <CreatorStudio
              onPublish={handlePublishProblem}
              onCancel={() => { playSound("click"); setActiveTab("dashboard"); }}
            />
          )}

          {activeTab === "leaderboard" && (
            <Leaderboard
              leaderboard={appState.leaderboard}
              currentUserState={currentUser}
            />
          )}

          {activeTab === "cheatsheet" && (
            <CheatSheet />
          )}

          {activeTab === "settings" && (
            <OperatorSettings
              currentUserState={currentUser}
              onUpdateUser={handleUpdateUser}
              onResetProgress={handleResetProgress}
              onSeedDefaults={handleSeedDefaults}
            />
          )}

        </main>

        {/* Footer system status line */}
        <footer className="bg-[#0D111A] border-t border-slate-850 px-4 py-3 flex flex-col sm:flex-row justify-between items-center text-[10px] font-mono text-slate-600 gap-2 mt-auto">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>NETFORGE CLOUD SHELL v4.0.1 // STATUS COMPILING SECURE</span>
          </div>
          <div className="flex items-center gap-3">
            <span>HOST INGRESS PORT: 3000</span>
            <span>© 2026 NETFORGE ACADEMY</span>
          </div>
        </footer>

      </div>

    </div>
  );
}
