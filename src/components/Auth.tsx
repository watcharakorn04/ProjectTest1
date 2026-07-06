import React, { useState } from "react";
import { UserState } from "../types";
import { playSound } from "../utils/audio";
import { Shield, User, Terminal, Cpu } from "lucide-react";

interface AuthProps {
  onLoginSuccess: (user: UserState) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState("NetCadet_99");
  const [password, setPassword] = useState("••••••••");
  const [role, setRole] = useState<"Student" | "Tutor" | "Admin">("Student");
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    playSound("complete");
    
    // Set initial points/ranks based on selection
    let points = 4250;
    let rank = 14;
    if (role === "Tutor") {
      points = 9500;
      rank = 3;
    } else if (role === "Admin") {
      points = 15000;
      rank = 1;
    }

    onLoginSuccess({
      username: username,
      mockRole: role,
      totalPoints: points,
      globalRank: rank,
    });
  };

  const handleRoleChange = (selectedRole: "Student" | "Tutor" | "Admin") => {
    playSound("click");
    setRole(selectedRole);
  };

  return (
    <div className="min-h-screen bg-[#050508] text-[#E0E0E0] flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Absolute futuristic grid & mesh background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f29370a_1px,transparent_1px),linear-gradient(to_bottom,#1f29370a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00E5FF] opacity-5 rounded-full filter blur-[120px] pointer-events-none animate-pulse-subtle" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#1A237E] opacity-10 rounded-full filter blur-[120px] pointer-events-none animate-pulse-subtle" />

      {/* Main Card Container */}
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          {/* Logo */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#00E5FF]/20 bg-[#0D111A]/80 backdrop-blur-md mb-3">
            <Cpu className="h-4.5 w-4.5 text-[#00E5FF] animate-spin-slow" />
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#00E5FF] font-mono font-bold">
              CLI SYNTAX COMPILER v4.0
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-2 font-mono">
            NET<span className="text-[#00E5FF] drop-shadow-[0_0_8px_rgba(0,229,255,0.4)]">FORGE</span>
          </h1>
          <p className="text-xs text-[#808A9D] max-w-xs mx-auto font-medium">
            Master command-line network syntax, build configurations, and climb the leaderboard.
          </p>
        </div>

        {/* Auth form panel */}
        <div className="bg-[#0D111A] border border-slate-800 rounded-2xl p-6 md:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
          <div className="flex border-b border-slate-800 mb-6">
            <button
              onClick={() => { playSound("click"); setIsSignUp(false); }}
              className={`flex-1 pb-3 text-sm font-bold tracking-wider uppercase border-b-2 transition-colors ${
                !isSignUp ? "text-[#00E5FF] border-[#00E5FF]" : "text-[#808A9D] border-transparent hover:text-white"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { playSound("click"); setIsSignUp(true); }}
              className={`flex-1 pb-3 text-sm font-bold tracking-wider uppercase border-b-2 transition-colors ${
                isSignUp ? "text-[#00E5FF] border-[#00E5FF]" : "text-[#808A9D] border-transparent hover:text-white"
              }`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username Input */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-[#808A9D] uppercase tracking-wider block">
                Command Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-slate-500" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (Math.random() > 0.4) playSound("typing");
                  }}
                  className="w-full bg-[#020204] border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-sm text-[#E0E0E0] placeholder-slate-600 focus:outline-none focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF]/20 font-mono"
                  placeholder="NetCadet_99"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-[#808A9D] uppercase tracking-wider block">
                Crypto Access Key
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Shield className="h-4 w-4 text-slate-500" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (Math.random() > 0.4) playSound("typing");
                  }}
                  className="w-full bg-[#020204] border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-sm text-[#E0E0E0] placeholder-slate-600 focus:outline-none focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF]/20 font-mono"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Role Demo Selection */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[#808A9D] uppercase tracking-wider block">
                Simulation Role (Demo Access)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(["Student", "Tutor", "Admin"] as const).map((r) => {
                  const isSelected = role === r;
                  return (
                    <button
                      key={r}
                      type="button"
                      onClick={() => handleRoleChange(r)}
                      className={`py-2 rounded-lg text-xs font-bold uppercase transition-all ${
                        isSelected
                          ? "bg-[#1A237E]/40 text-[#00E5FF] border border-[#00E5FF]/50 shadow-[0_0_8px_rgba(0,229,255,0.1)]"
                          : "bg-[#020204] text-slate-500 border border-slate-800 hover:border-slate-700 hover:text-slate-350"
                      }`}
                    >
                      {r}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action Button */}
            <button
              type="submit"
              className="w-full bg-[#1A237E] hover:bg-[#1A237E]/80 text-[#00E5FF] border border-[#00E5FF]/40 font-mono font-bold py-3 px-4 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(26,35,126,0.3)] hover:shadow-[0_0_20px_rgba(0,229,255,0.2)] active:scale-95 cursor-pointer mt-2"
            >
              <Terminal className="h-4 w-4" />
              {isSignUp ? "INITIALIZE AGENT" : "ACCESS NETFORGE TERMINAL"}
            </button>
          </form>
        </div>

        {/* Minimal Terminal Footer */}
        <div className="text-center mt-6">
          <p className="text-[10px] font-mono text-slate-600">
            SECURE AUTHENTICATION SYSTEM // LOCALHOST:3000
          </p>
        </div>
      </div>
    </div>
  );
};
