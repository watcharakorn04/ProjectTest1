import React, { useState } from "react";
import { LeaderboardEntry, UserState } from "../types";
import { playSound } from "../utils/audio";
import {
  Trophy,
  Search,
  Filter,
  TrendingUp,
  Award,
  ChevronUp,
  Cpu,
  Bookmark
} from "lucide-react";

interface LeaderboardProps {
  leaderboard: LeaderboardEntry[];
  currentUserState: UserState;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ leaderboard, currentUserState }) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [minAccuracy, setMinAccuracy] = useState<number>(0);

  // Filter entry points
  const filteredLeaderboard = leaderboard.filter((entry) => {
    const matchesSearch = entry.username.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Parse accuracy percentage
    const accNum = parseFloat(entry.accuracy.replace("%", ""));
    const matchesAccuracy = accNum >= minAccuracy;

    return matchesSearch && matchesAccuracy;
  });

  const handleStatFilterClick = (accThreshold: number) => {
    playSound("click");
    setMinAccuracy(accThreshold);
  };

  return (
    <div className="space-y-6">
      
      {/* Leaderboard stats summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Top Performer Stat */}
        <div className="bg-[#0D111A] border border-slate-800 rounded-2xl p-5 flex items-center gap-4 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-24 h-24 bg-amber-400 opacity-5 rounded-full filter blur-xl pointer-events-none" />
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl">
            <Trophy className="h-6 w-6" />
          </div>
          <div>
            <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider font-mono">Top Competitor</div>
            <div className="text-sm font-black text-white uppercase">{leaderboard[0]?.username || "CiscoGuru_2026"}</div>
            <p className="text-[10px] text-amber-400 font-mono font-bold">{leaderboard[0]?.points || 12450} PTS // Acc: {leaderboard[0]?.accuracy || "98.5%"}</p>
          </div>
        </div>

        {/* Current Operator Stat */}
        <div className="bg-[#0D111A] border border-[#00E5FF]/20 rounded-2xl p-5 flex items-center gap-4 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-24 h-24 bg-[#00E5FF] opacity-5 rounded-full filter blur-xl pointer-events-none" />
          <div className="p-3 bg-[#00E5FF]/10 text-[#00E5FF] rounded-xl">
            <Cpu className="h-6 w-6" />
          </div>
          <div>
            <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider font-mono">Your callsign status</div>
            <div className="text-sm font-black text-white uppercase">{currentUserState.username}</div>
            <p className="text-[10px] text-[#00E5FF] font-mono font-bold">Rank #{currentUserState.globalRank} // {currentUserState.totalPoints} PTS</p>
          </div>
        </div>

        {/* Global Competitors Stat */}
        <div className="bg-[#0D111A] border border-slate-800 rounded-2xl p-5 flex items-center gap-4 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-24 h-24 bg-violet-400 opacity-5 rounded-full filter blur-xl pointer-events-none" />
          <div className="p-3 bg-violet-500/10 text-violet-400 rounded-xl">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider font-mono">Total Operators</div>
            <div className="text-sm font-black text-white uppercase">{leaderboard.length + 8} Active Nodes</div>
            <p className="text-[10px] text-violet-400 font-mono font-bold">Awaiting Next Syllabus Push</p>
          </div>
        </div>

      </div>

      {/* Main Table Box */}
      <div className="bg-[#0D111A] border border-slate-800 rounded-2xl p-5 space-y-4">
        
        {/* Search and Filters panel */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="h-4.5 w-4.5 text-[#00E5FF]" />
            <h3 className="text-xs font-black text-white uppercase tracking-wider font-mono">
              Filter Rankings Data
            </h3>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute inset-y-0 left-0 pl-2.5 flex items-center text-slate-650 h-4.5 w-4.5 self-center" />
              <input
                type="text"
                placeholder="Search operators..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-48 bg-[#020204] border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-[#E0E0E0] placeholder-slate-650 focus:outline-none focus:border-[#00E5FF] font-mono"
              />
            </div>

            {/* Accuracy filters quick tabs */}
            <div className="flex gap-1.5 bg-[#050508] p-1 rounded-lg border border-slate-850">
              {([
                { label: "All Acc", threshold: 0 },
                { label: "90%+", threshold: 90 },
                { label: "95%+", threshold: 95 },
              ]).map((opt) => (
                <button
                  key={opt.label}
                  onClick={() => handleStatFilterClick(opt.threshold)}
                  className={`px-2.5 py-1 text-[10px] font-bold font-mono rounded-md transition-all cursor-pointer ${
                    minAccuracy === opt.threshold
                      ? "bg-[#1A237E] text-[#00E5FF]"
                      : "text-slate-550 hover:text-white"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Rankings Table Grid */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-mono text-xs">
            
            {/* Table Header */}
            <thead>
              <tr className="border-b border-slate-850 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-3 sticky left-0 bg-[#0D111A]">RANK</th>
                <th className="py-3.5 px-3">OPERATOR CALLSIGN</th>
                <th className="py-3.5 px-3 text-right">CYBER BALANCE POINTS</th>
                <th className="py-3.5 px-3 text-right">SNA ACCURACY RATIO</th>
                <th className="py-3.5 px-3 text-right">STATUS COMPILER</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-slate-900">
              {filteredLeaderboard.length > 0 ? (
                filteredLeaderboard.map((entry) => {
                  const isMe = entry.username === currentUserState.username;
                  
                  // Rank specific coloring
                  let rankStyle = "text-slate-400 bg-slate-900 border-slate-850";
                  let rowStyle = "hover:bg-slate-900/40";
                  
                  if (entry.rank === 1) {
                    rankStyle = "text-amber-400 bg-amber-950/20 border-amber-900/50 shadow-md";
                    rowStyle = "bg-amber-950/5 hover:bg-amber-950/10";
                  } else if (entry.rank === 2) {
                    rankStyle = "text-slate-300 bg-slate-800 border-slate-700 shadow-sm";
                    rowStyle = "bg-slate-900/10 hover:bg-slate-900/20";
                  } else if (entry.rank === 3) {
                    rankStyle = "text-amber-600 bg-amber-950/10 border-amber-900/30";
                    rowStyle = "bg-amber-950/2 hover:bg-amber-950/5";
                  }

                  if (isMe) {
                    rowStyle = "bg-[#1A237E]/10 border-l-2 border-l-[#00E5FF] hover:bg-[#1A237E]/15";
                  }

                  return (
                    <tr
                      key={entry.username}
                      className={`transition-colors group ${rowStyle}`}
                    >
                      {/* Rank Indicator column */}
                      <td className="py-3 px-3 sticky left-0 bg-[#0D111A] group-hover:bg-[#0D111A]/90 transition-colors">
                        <span className={`inline-flex w-7 h-7 rounded-lg text-xs font-black items-center justify-center border ${rankStyle}`}>
                          {entry.rank}
                        </span>
                      </td>

                      {/* Operator callsing */}
                      <td className="py-3 px-3 font-semibold">
                        <div className="flex items-center gap-2">
                          <span className={isMe ? "text-[#00E5FF] font-black" : "text-[#E0E0E0] font-sans font-extrabold"}>
                            {entry.username}
                          </span>
                          {isMe && (
                            <span className="text-[9px] font-black text-[#00E5FF] uppercase bg-[#1A237E]/40 px-1.5 py-0.5 rounded border border-[#00E5FF]/20">
                              YOU
                            </span>
                          )}
                          {entry.rank <= 3 && (
                            <Award className={`h-3.5 w-3.5 shrink-0 ${
                              entry.rank === 1 ? "text-amber-400" : entry.rank === 2 ? "text-slate-300" : "text-amber-600"
                            }`} />
                          )}
                        </div>
                      </td>

                      {/* Points */}
                      <td className="py-3 px-3 text-right font-bold text-white">
                        {entry.points.toLocaleString()} PTS
                      </td>

                      {/* Accuracy Ratio */}
                      <td className="py-3 px-3 text-right font-bold text-emerald-400">
                        {entry.accuracy}
                      </td>

                      {/* Status compiler indicator */}
                      <td className="py-3 px-3 text-right text-slate-500 text-[10px] uppercase font-bold">
                        {entry.rank <= 3 ? "SYSTEM SECURED" : "ONLINE // VERIFIED"}
                      </td>

                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500">
                    No operators match your filter search.
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>

        {/* Minimal info line footer */}
        <div className="pt-3 border-t border-slate-900 text-[10px] text-slate-600 flex justify-between">
          <span>COMPILED STACK DATA // ALL SYSTEM NODES ACCOUNTED FOR</span>
          <span>UPDATING LIVE REVISION FEED</span>
        </div>

      </div>

    </div>
  );
};
