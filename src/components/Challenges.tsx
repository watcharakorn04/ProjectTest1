import React, { useState } from "react";
import { AppState, Problem, UserState } from "../types";
import { playSound } from "../utils/audio";
import {
  Terminal,
  Filter,
  Search,
  CheckCircle,
  BookOpen,
  ArrowUpRight,
  User,
  Pencil
} from "lucide-react";

interface ChallengesProps {
  appState: AppState;
  onSelectProblem: (problem: Problem) => void;
  onNavigate: (tab: "dashboard" | "arena" | "creator" | "leaderboard" | "cheatsheet" | "settings" | "myprofile" | "manage_users") => void;
  completedProblems: string[];
  currentUser?: UserState | null;
  onEditProblem?: (problem: Problem) => void;
}

export const Challenges: React.FC<ChallengesProps> = ({
  appState,
  onSelectProblem,
  onNavigate,
  completedProblems,
  currentUser,
  onEditProblem,
}) => {
  const { problems } = appState;
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

  return (
    <div className="space-y-6">
      {/* Challenges Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0B1528] via-[#0E1B35] to-[#0A1120] border border-slate-800 p-6 md:p-8 shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
        <div className="absolute right-0 top-0 w-80 h-80 bg-blue-500 opacity-[0.05] rounded-full filter blur-[100px] pointer-events-none" />
        
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 text-[10px] uppercase font-bold tracking-wider border border-blue-500/20">
            <BookOpen className="h-3 w-3" />
            Simulation Catalog
          </div>
          <h2 className="text-2xl md:text-3.5xl font-extrabold tracking-tight text-white font-sans">
            Network Challenges
          </h2>
          <p className="text-slate-400 text-xs md:text-sm font-medium leading-relaxed max-w-2xl">
            Browse the complete repository of Cisco IOS CLI challenges. Filter by topology type or difficulty rating, and click Launch to enter the simulation sandbox.
          </p>
        </div>
      </div>

      {/* Main Browse Container */}
      <div className="bg-[#0D111A] border border-slate-800 rounded-2xl p-5 md:p-6 space-y-6">
        
        {/* Filtering Controls */}
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 pb-5 border-b border-slate-900">
          <div className="flex items-center gap-2">
            <Filter className="h-4.5 w-4.5 text-blue-400" />
            <h3 className="text-sm font-black text-white uppercase tracking-wider font-mono">
              Filter Parameters ({filteredProblems.length} matches)
            </h3>
          </div>
          
          {/* Search Bar */}
          <div className="relative w-full md:w-72">
            <Search className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 h-4.5 w-4.5 self-center" />
            <input
              type="text"
              placeholder="Search challenges or instructions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#050508] border border-slate-800 focus:border-blue-500 rounded-xl pl-9 pr-4 py-2.5 text-xs text-[#E0E0E0] placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500/10"
            />
          </div>
        </div>

        {/* Filter Pill Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#050A14]/30 p-4 rounded-xl border border-slate-900">
          {/* Topic Filters */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Filter by Topic:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {topics.map((topic) => (
                <button
                  key={topic}
                  onClick={() => { playSound("click"); setSelectedTopic(topic); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    selectedTopic === topic
                      ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                      : "bg-[#050508] text-slate-400 border border-slate-850 hover:border-slate-700 hover:text-slate-200"
                  }`}
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty Filters */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Filter by Difficulty:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {["All", "Easy", "Medium", "Hard"].map((diff) => (
                <button
                  key={diff}
                  onClick={() => { playSound("click"); setSelectedDifficulty(diff); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    selectedDifficulty === diff
                      ? "bg-slate-800 text-white border border-slate-700"
                      : "bg-[#050508] text-slate-400 border border-slate-850 hover:border-slate-700 hover:text-slate-200"
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Challenge List Feed */}
        <div className="space-y-4">
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

              const canEdit = currentUser && (
                currentUser.mockRole === "Admin" || 
                currentUser.username === prob.author
              );

              return (
                <div
                  key={prob.id}
                  onClick={() => handleProblemClick(prob)}
                  className="group bg-[#050A14]/30 border border-slate-850 hover:border-blue-500/40 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:bg-[#050A14]/65 hover:shadow-[0_4px_20px_rgba(59,130,246,0.03)] cursor-pointer"
                >
                  <div className="space-y-2.5 flex-1">
                    {/* Badges row */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-[10px] font-bold uppercase tracking-wider border rounded px-2 py-0.5 ${diffBadgeColor}`}>
                        {prob.difficulty}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-900 border border-slate-800 text-slate-400 px-2 py-0.5 rounded">
                        {prob.topic}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-900 border border-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
                        Format: {prob.format}
                      </span>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-indigo-950/40 border border-indigo-900/30 text-indigo-300 px-2 py-0.5 rounded flex items-center gap-1">
                        <User className="h-3 w-3" /> Creator: {prob.author}
                      </span>
                      {isCompleted && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle className="h-3 w-3 fill-emerald-400 text-emerald-950" /> SOLVED
                        </span>
                      )}
                    </div>

                    {/* Problem details */}
                    <div>
                      <h4 className="text-base font-extrabold text-white group-hover:text-blue-400 transition-colors leading-snug">
                        {prob.title}
                      </h4>
                      <p className="text-xs text-slate-400 font-medium leading-relaxed mt-1">
                        {prob.instructions}
                      </p>
                    </div>
                  </div>

                  {/* Right metadata actions */}
                  <div className="flex items-center justify-between md:flex-col md:items-end gap-2 shrink-0 md:pl-5 border-t md:border-t-0 md:border-l border-slate-850 pt-4 md:pt-0">
                    <div className="text-[11px] text-slate-500 font-medium">
                      By <span className="text-slate-400 font-bold">{prob.author}</span>
                    </div>
                    
                    <div className="text-blue-400 font-bold text-xs flex items-center gap-1 group-hover:underline">
                      Launch Challenge
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </div>

                    {canEdit && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          playSound("click");
                          if (onEditProblem) onEditProblem(prob);
                        }}
                        className="px-2.5 py-1 rounded bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-400 font-mono text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer mt-1"
                      >
                        <Pencil className="h-3 w-3" /> Edit Code
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-16 bg-[#050A14]/20 border border-slate-850 rounded-2xl text-slate-500 space-y-3">
              <Terminal className="h-12 w-12 mx-auto text-slate-800" />
              <div className="space-y-1">
                <p className="font-extrabold text-white text-sm">No challenges match your search.</p>
                <p className="text-xs text-slate-500">Try adjusting your filters or search keywords.</p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
