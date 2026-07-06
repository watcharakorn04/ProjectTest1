import React, { useState } from "react";
import { AppState, Problem } from "../types";
import { playSound } from "../utils/audio";
import {
  Terminal,
  Cpu,
  Trophy,
  Filter,
  PlusCircle,
  Play,
  Zap,
  BookOpen,
  Search,
  CheckCircle,
  Clock,
  ArrowUpRight
} from "lucide-react";

interface DashboardProps {
  appState: AppState;
  onSelectProblem: (problem: Problem) => void;
  onNavigate: (tab: "dashboard" | "arena" | "creator" | "leaderboard") => void;
  completedProblems: string[];
}

export const Dashboard: React.FC<DashboardProps> = ({
  appState,
  onSelectProblem,
  onNavigate,
  completedProblems,
}) => {
  const { problems, currentUserState, leaderboard } = appState;
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("All");
  const [selectedTopic, setSelectedTopic] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Extract all unique topics
  const topics = ["All", ...Array.from(new Set(problems.map((p) => p.topic)))];

  // Filters challenges based on filters and search
  const filteredProblems = problems.filter((prob) => {
    const matchesDifficulty = selectedDifficulty === "All" || prob.difficulty === selectedDifficulty;
    const matchesTopic = selectedTopic === "All" || prob.topic === selectedTopic;
    const matchesSearch = prob.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          prob.instructions.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDifficulty && matchesTopic && matchesSearch;
  });

  const handleProblemClick = (prob: Problem) => {
    playSound("click");
    onSelectProblem(prob);
    onNavigate("arena");
  };

  const handleQuickPlay = () => {
    playSound("complete");
    // Select first uncompleted, or first Easy
    const target = problems.find((p) => !completedProblems.includes(p.id)) || problems[0];
    if (target) {
      onSelectProblem(target);
      onNavigate("arena");
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner / Hero Widget */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1A237E] to-[#0D111A] border border-slate-800 p-6 md:p-8 shadow-lg">
        {/* Glow Effects */}
        <div className="absolute right-0 top-0 w-64 h-64 bg-[#00E5FF] opacity-10 rounded-full filter blur-[80px] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-lg">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#00E5FF]/10 text-[#00E5FF] text-[10px] uppercase font-mono font-bold tracking-wider">
              <Zap className="h-3 w-3 animate-pulse" />
              Arena Status: Active
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white">
              Welcome back, <span className="text-[#00E5FF]">{currentUserState.username}</span>!
            </h2>
            <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
              Your configurations are compiling properly. Ready to test your muscle memory and solve command-line syntax syntax?
            </p>
          </div>

          {/* Points Counter Quick Widget */}
          <div className="flex items-center gap-4 bg-[#050508]/60 backdrop-blur-md border border-slate-800 rounded-2xl p-4 shrink-0">
            <div className="p-3 bg-gradient-to-br from-amber-500/20 to-orange-600/10 rounded-xl text-amber-400">
              <Trophy className="h-6 w-6" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Network Rank</div>
              <div className="text-xl font-black text-white font-mono flex items-baseline gap-1.5">
                #{currentUserState.globalRank}
                <span className="text-xs text-amber-400 font-bold">({currentUserState.totalPoints} pts)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Problem Feed */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Quick Play & Create problem entry banners */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Quick Play Widget */}
            <button
              onClick={handleQuickPlay}
              className="group text-left p-5 rounded-2xl bg-[#0D111A] border border-slate-800 hover:border-[#00E5FF]/50 transition-all flex justify-between items-center relative overflow-hidden cursor-pointer"
            >
              <div className="space-y-1">
                <div className="text-[#00E5FF] text-[10px] font-extrabold uppercase tracking-widest font-mono flex items-center gap-1">
                  <Play className="h-3 w-3 fill-[#00E5FF]" /> Recommended
                </div>
                <h3 className="text-sm font-black text-white uppercase group-hover:text-[#00E5FF] transition-colors">
                  Quick Play Challenge
                </h3>
                <p className="text-[11px] text-slate-500">
                  Jump right into the next queue sequence to build CLI speed.
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 group-hover:bg-[#00E5FF]/10 group-hover:border-[#00E5FF]/20 text-[#808A9D] group-hover:text-[#00E5FF] transition-all">
                <ArrowUpRight className="h-4.5 w-4.5" />
              </div>
            </button>

            {/* Create Problem Widget */}
            <button
              onClick={() => { playSound("click"); onNavigate("creator"); }}
              className="group text-left p-5 rounded-2xl bg-[#0D111A] border border-slate-800 hover:border-violet-500/50 transition-all flex justify-between items-center relative overflow-hidden cursor-pointer"
            >
              <div className="space-y-1">
                <div className="text-violet-400 text-[10px] font-extrabold uppercase tracking-widest font-mono flex items-center gap-1">
                  <PlusCircle className="h-3.5 w-3.5" /> Creator Studio
                </div>
                <h3 className="text-sm font-black text-white uppercase group-hover:text-violet-400 transition-colors">
                  Design Custom Problem
                </h3>
                <p className="text-[11px] text-slate-500">
                  Draft missing-blanks or command sequences to test classes.
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 group-hover:bg-violet-950/40 group-hover:border-violet-500/30 text-[#808A9D] group-hover:text-violet-400 transition-all">
                <ArrowUpRight className="h-4.5 w-4.5" />
              </div>
            </button>

          </div>

          {/* Filtering Workspace */}
          <div className="bg-[#0D111A] border border-slate-800 rounded-2xl p-5 space-y-4">
            
            {/* Header & Search */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
              <div className="flex items-center gap-2">
                <Filter className="h-4.5 w-4.5 text-[#00E5FF]" />
                <h3 className="text-sm font-black text-white uppercase tracking-wider font-mono">
                  Challenge Arena Feed
                </h3>
              </div>
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute inset-y-0 left-0 pl-2.5 flex items-center text-slate-600 h-4.5 w-4.5 self-center" />
                <input
                  type="text"
                  placeholder="Search challenges..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full sm:w-56 bg-[#020204] border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-[#E0E0E0] placeholder-slate-600 focus:outline-none focus:border-[#00E5FF] font-mono"
                />
              </div>
            </div>

            {/* Filter Pill Controls */}
            <div className="flex flex-col gap-3 pt-2 border-t border-slate-900">
              {/* Topic Filters */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mr-1">
                  Topic:
                </span>
                {topics.map((topic) => (
                  <button
                    key={topic}
                    onClick={() => { playSound("click"); setSelectedTopic(topic); }}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                      selectedTopic === topic
                        ? "bg-[#1A237E] text-[#00E5FF] border border-[#00E5FF]/30"
                        : "bg-[#020204] text-slate-400 border border-slate-800 hover:border-slate-700 hover:text-slate-200"
                    }`}
                  >
                    {topic}
                  </button>
                ))}
              </div>

              {/* Difficulty Filters */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mr-1">
                  Rating:
                </span>
                {["All", "Easy", "Medium", "Hard"].map((diff) => (
                  <button
                    key={diff}
                    onClick={() => { playSound("click"); setSelectedDifficulty(diff); }}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                      selectedDifficulty === diff
                        ? "bg-slate-800 text-white border border-slate-700"
                        : "bg-[#020204] text-slate-400 border border-slate-800 hover:border-slate-700 hover:text-slate-200"
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Feed Card Grid */}
          <div className="space-y-3.5">
            {filteredProblems.length > 0 ? (
              filteredProblems.map((prob) => {
                const isCompleted = completedProblems.includes(prob.id);
                
                // Set badge colors based on difficulty
                let diffBadgeColor = "text-emerald-400 bg-emerald-950/30 border-emerald-900/50";
                if (prob.difficulty === "Medium") {
                  diffBadgeColor = "text-amber-400 bg-amber-950/30 border-amber-900/50";
                } else if (prob.difficulty === "Hard") {
                  diffBadgeColor = "text-rose-400 bg-rose-950/30 border-rose-900/50";
                }

                return (
                  <div
                    key={prob.id}
                    onClick={() => handleProblemClick(prob)}
                    className="group bg-[#0D111A] border border-slate-800 hover:border-[#00E5FF]/40 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:shadow-[0_4px_12px_rgba(0,229,255,0.02)] cursor-pointer"
                  >
                    <div className="space-y-2 flex-1">
                      {/* Badge line */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`text-[10px] font-bold uppercase tracking-wider border rounded px-1.5 py-0.5 ${diffBadgeColor}`}>
                          {prob.difficulty}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-900 border border-slate-800 text-slate-400 px-1.5 py-0.5 rounded">
                          {prob.topic}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-900 border border-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono">
                          Format: {prob.format}
                        </span>
                        {isCompleted && (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <CheckCircle className="h-3 w-3 fill-emerald-400 text-emerald-950" /> SOLVED
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h4 className="text-base font-extrabold text-white group-hover:text-[#00E5FF] transition-colors leading-snug">
                        {prob.title}
                      </h4>

                      {/* Instructions snippet */}
                      <p className="text-xs text-slate-400 font-medium line-clamp-1 leading-relaxed">
                        {prob.instructions}
                      </p>
                    </div>

                    {/* Metadata right-side */}
                    <div className="flex items-center justify-between md:flex-col md:items-end gap-2 shrink-0 md:pl-4 border-t md:border-t-0 md:border-l border-slate-800 pt-3 md:pt-0">
                      <div className="text-[11px] text-slate-500 font-medium">
                        By <span className="text-[#808A9D] font-bold">{prob.author}</span>
                      </div>
                      
                      <div className="text-[#00E5FF] font-mono font-bold text-xs flex items-center gap-1 group-hover:underline">
                        Launch Terminal
                        <Terminal className="h-3.5 w-3.5" />
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 bg-[#0D111A] border border-slate-800 rounded-2xl text-slate-500 space-y-2">
                <Terminal className="h-10 w-10 mx-auto text-slate-750" />
                <p className="font-extrabold text-[#E0E0E0] text-sm">No command syntax matches your query.</p>
                <p className="text-xs">Try adjusting your filters or search keywords.</p>
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Mini Leaderboard & Stats */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Active Player Status Widget */}
          <div className="bg-[#0D111A] border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-black text-white uppercase tracking-wider font-mono border-b border-slate-900 pb-2">
              Operator Diagnostics
            </h3>
            <div className="space-y-3 font-mono text-xs text-slate-400">
              <div className="flex justify-between">
                <span>Callsign:</span>
                <span className="text-white font-bold">{currentUserState.username}</span>
              </div>
              <div className="flex justify-between">
                <span>Assigned Role:</span>
                <span className="text-[#00E5FF] font-bold uppercase">{currentUserState.mockRole}</span>
              </div>
              <div className="flex justify-between">
                <span>Completed Tasks:</span>
                <span className="text-emerald-400 font-bold">
                  {completedProblems.length} / {problems.length}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Crypto Balance:</span>
                <span className="text-amber-400 font-bold">{currentUserState.totalPoints} PTS</span>
              </div>
            </div>
            
            {/* Completion rate bar */}
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <span>Syllabus Accuracy</span>
                <span>
                  {problems.length ? Math.round((completedProblems.length / problems.length) * 100) : 0}%
                </span>
              </div>
              <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-violet-500 to-[#00E5FF] transition-all duration-500"
                  style={{
                    width: `${problems.length ? (completedProblems.length / problems.length) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Top Rankings Mini View */}
          <div className="bg-[#0D111A] border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-black text-white uppercase tracking-wider font-mono">
                Platform Leaderboard
              </h3>
              <button
                onClick={() => { playSound("click"); onNavigate("leaderboard"); }}
                className="text-[10px] font-bold text-[#00E5FF] uppercase tracking-wider hover:underline cursor-pointer"
              >
                View Full
              </button>
            </div>

            <div className="space-y-2">
              {leaderboard.slice(0, 5).map((entry, idx) => {
                const isMe = entry.username === currentUserState.username;
                let rankStyle = "text-slate-500 bg-[#050508]";
                if (entry.rank === 1) rankStyle = "text-amber-400 bg-amber-950/20 border border-amber-900/40";
                else if (entry.rank === 2) rankStyle = "text-slate-300 bg-slate-900";
                else if (entry.rank === 3) rankStyle = "text-amber-600 bg-amber-950/10";

                return (
                  <div
                    key={entry.username}
                    className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                      isMe
                        ? "bg-[#1A237E]/20 border-[#00E5FF]/40"
                        : "bg-[#050508]/40 border-slate-900 hover:border-slate-800"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Rank Indicator */}
                      <span className={`w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center font-mono ${rankStyle}`}>
                        {entry.rank}
                      </span>
                      <span className={`text-xs font-bold leading-none ${isMe ? "text-[#00E5FF]" : "text-[#E0E0E0]"}`}>
                        {entry.username}
                        {isMe && <span className="text-[9px] font-extrabold text-slate-500 ml-1.5 uppercase tracking-wider">(You)</span>}
                      </span>
                    </div>

                    <div className="text-right font-mono shrink-0">
                      <div className="text-xs font-black text-white">{entry.points}</div>
                      <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Acc: {entry.accuracy}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Learning Note */}
          <div className="bg-[#0D111A] border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-violet-400">
              <BookOpen className="h-4 w-4" />
              <h4 className="text-xs font-black uppercase tracking-wider font-mono">CLI Syntax Reference</h4>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
              Cisco IOS commands are case-insensitive by default but must be written in full or common shorthand parameters (e.g. `interface gigabitethernet0/0` or `int g0/0`). Our compiler supports matching both explicit fully formed declarations as noted!
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
