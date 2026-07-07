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

  // Find up to 3 recommended problems (prioritize uncompleted ones)
  const recommendedProblems = [
    ...problems.filter((p) => !completedProblems.includes(p.id)),
    ...problems.filter((p) => completedProblems.includes(p.id))
  ].slice(0, 3);

  const handleProblemClick = (prob: Problem) => {
    playSound("click");
    onSelectProblem(prob);
    onNavigate("arena");
  };

  const handleQuickPlay = () => {
    playSound("complete");
    const target = problems.find((p) => !completedProblems.includes(p.id)) || problems[0];
    if (target) {
      onSelectProblem(target);
      onNavigate("arena");
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner / Hero Widget */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0B1528] via-[#0E1B35] to-[#0A1120] border border-slate-800 p-6 md:p-8 shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
        {/* Glow Effects */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-blue-500 opacity-[0.08] rounded-full filter blur-[100px] pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 w-60 h-60 bg-blue-400 opacity-[0.04] rounded-full filter blur-[80px] pointer-events-none" />
        
        <div className="relative z-10 space-y-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] uppercase font-bold tracking-wider border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Arena Status: Compiling Online
            </div>
            <h2 className="text-2xl md:text-3.5xl font-extrabold tracking-tight text-white font-sans">
              Welcome back, <span className="text-blue-400">{currentUserState.username}</span>!
            </h2>
            <p className="text-slate-400 text-xs md:text-sm font-medium leading-relaxed">
              Ready to test your network configuration skills today? Choose an active sandbox simulation below to practice your Cisco IOS CLI command syntax.
            </p>
          </div>

          {/* Points Counter Quick Widget Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
            <div className="p-4 bg-[#050A14]/70 backdrop-blur-md border border-slate-800/80 rounded-2xl flex flex-col gap-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total XP</span>
              <span className="text-xl font-extrabold text-blue-400 font-mono leading-none">{currentUserState.totalPoints} XP</span>
            </div>
            
            <div className="p-4 bg-[#050A14]/70 backdrop-blur-md border border-slate-800/80 rounded-2xl flex flex-col gap-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Completed Labs</span>
              <span className="text-xl font-extrabold text-emerald-400 font-mono leading-none">{completedProblems.length} / {problems.length}</span>
            </div>

            <div className="p-4 bg-[#050A14]/70 backdrop-blur-md border border-slate-800/80 rounded-2xl flex flex-col gap-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Global Rank</span>
              <span className="text-xl font-extrabold text-amber-400 font-mono leading-none">#{currentUserState.globalRank}</span>
            </div>

            <div className="p-4 bg-[#050A14]/70 backdrop-blur-md border border-slate-800/80 rounded-2xl flex flex-col gap-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">System Status</span>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-extrabold text-white font-mono uppercase tracking-wider">ONLINE</span>
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

          {/* Recommended Challenges */}
          <div className="bg-[#0D111A] border border-slate-800 rounded-2xl p-5 md:p-6 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-900">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4.5 w-4.5 text-blue-400" />
                <h3 className="text-sm font-black text-white uppercase tracking-wider font-mono">
                  Recommended Challenges
                </h3>
              </div>
              <button
                onClick={() => { playSound("click"); onNavigate("arena"); }}
                className="text-[10px] font-bold text-blue-400 hover:text-blue-300 uppercase tracking-wider flex items-center gap-1 cursor-pointer"
              >
                View Catalog <ArrowUpRight className="h-3 w-3" />
              </button>
            </div>

            <div className="space-y-3.5">
              {recommendedProblems.map((prob) => {
                const isCompleted = completedProblems.includes(prob.id);
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
                    className="group bg-[#050A14]/40 border border-slate-850 hover:border-blue-500/40 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:bg-[#050A14]/70 cursor-pointer"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`text-[9px] font-bold uppercase tracking-wider border rounded px-1.5 py-0.5 ${diffBadgeColor}`}>
                          {prob.difficulty}
                        </span>
                        <span className="text-[9px] font-bold uppercase tracking-wider bg-slate-900 border border-slate-800 text-slate-400 px-1.5 py-0.5 rounded">
                          {prob.topic}
                        </span>
                        {isCompleted && (
                          <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/40 px-1.5 py-0.5 rounded-full flex items-center gap-1">
                            <CheckCircle className="h-2.5 w-2.5 fill-emerald-400 text-emerald-950" /> SOLVED
                          </span>
                        )}
                      </div>

                      <h4 className="text-sm font-extrabold text-white group-hover:text-blue-400 transition-colors leading-snug">
                        {prob.title}
                      </h4>
                    </div>

                    <div className="text-blue-400 font-bold text-xs flex items-center gap-1 group-hover:underline shrink-0 sm:pl-3 border-t sm:border-t-0 sm:border-l border-slate-850 pt-2.5 sm:pt-0">
                      Launch <Terminal className="h-3 w-3" />
                    </div>
                  </div>
                );
              })}
            </div>
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
