import React, { useState } from "react";
import { UserState } from "../types";
import { playSound } from "../utils/audio";
import { Shield, User, Terminal, Cpu, ArrowRight, Sparkles, Mail, Lock, Key, Eye, EyeOff, ArrowLeft } from "lucide-react";

interface AuthProps {
  onLoginSuccess: (user: UserState) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLoginSuccess }) => {
  const [showLanding, setShowLanding] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [role, setRole] = useState<"Student" | "Tutor" | "Admin">("Student");
  const [isSignUp, setIsSignUp] = useState(false);
  const [validationError, setValidationError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");

    if (!username.trim()) {
      setValidationError("Username is required.");
      playSound("error");
      return;
    }

    if (isSignUp) {
      if (username.length < 3 || username.length > 20) {
        setValidationError("Username must be between 3 and 20 characters.");
        playSound("error");
        return;
      }
      if (!email.trim() || !email.includes("@")) {
        setValidationError("Please enter a valid email address.");
        playSound("error");
        return;
      }
      if (password.length < 8) {
        setValidationError("Password must be at least 8 characters.");
        playSound("error");
        return;
      }
      if (password !== confirmPassword) {
        setValidationError("Passwords do not match.");
        playSound("error");
        return;
      }
    }

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
      username: username.trim(),
      mockRole: isSignUp ? "Student" : role, // defaults to Student on registration
      totalPoints: points,
      globalRank: rank,
    });
  };

  const handleInstantPlay = () => {
    playSound("complete");
    onLoginSuccess({
      username: "NetMaster",
      mockRole: "Student",
      totalPoints: 4250,
      globalRank: 14,
    });
  };

  const handleRoleChange = (selectedRole: "Student" | "Tutor" | "Admin") => {
    playSound("click");
    setRole(selectedRole);
  };

  if (showLanding) {
    return (
      <div className="min-h-screen bg-[#030712] text-[#E0E0E0] flex flex-col relative overflow-hidden font-sans select-none">
        {/* Background ambient lighting effects */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0e1726_1px,transparent_1px),linear-gradient(to_bottom,#0e1726_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none opacity-40" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-600 opacity-10 rounded-full filter blur-[150px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600 opacity-[0.08] rounded-full filter blur-[120px] pointer-events-none" />

        {/* Global Navigation Header */}
        <header className="relative z-20 w-full max-w-7xl mx-auto px-6 py-5 flex items-center justify-between border-b border-slate-900/60">
          {/* Logo element matches screenshot */}
          <div className="flex items-center gap-2">
            <div className="bg-slate-950/80 border border-slate-800 rounded-lg py-1.5 px-2.5 flex items-center gap-1.5 shadow-md">
              <Terminal className="h-4 w-4 text-blue-400" />
              <span className="text-xs font-black tracking-wider text-white font-mono uppercase">NETFORGE</span>
            </div>
            <span className="text-[10px] font-black tracking-widest bg-blue-600/10 text-blue-400 border border-blue-500/20 px-1.5 py-0.5 rounded uppercase font-mono">
              Arena
            </span>
          </div>

          <div className="flex items-center gap-5">
            <button
              onClick={() => { playSound("click"); setIsSignUp(false); setShowLanding(false); }}
              className="text-xs font-bold text-slate-400 hover:text-white uppercase tracking-wider transition-colors cursor-pointer"
            >
              Sign In
            </button>
            <button
              onClick={() => { playSound("click"); setIsSignUp(true); setShowLanding(false); }}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl border border-blue-500/30 transition-all cursor-pointer shadow-lg shadow-blue-500/10 active:scale-95"
            >
              Get Started
            </button>
          </div>
        </header>

        {/* Hero Section */}
        <main className="flex-1 max-w-5xl mx-auto px-6 flex flex-col items-center justify-center text-center relative z-10 py-16 md:py-24 space-y-8">
          
          {/* Badge Matches Screenshot */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/5 text-blue-400 text-[10px] uppercase font-bold tracking-widest border border-blue-500/10 shadow-sm animate-pulse">
            <Sparkles className="h-3 w-3" />
            Gamified CLI Router Training Arena
          </div>

          {/* Heading with elegant typography pairings */}
          <div className="space-y-4 max-w-4xl">
            <h1 className="text-4xl sm:text-5xl md:text-6.5xl font-black tracking-tight text-white leading-[1.1] font-sans">
              Master Network Configurations
              <span className="block mt-2 bg-gradient-to-r from-blue-400 via-sky-400 to-indigo-400 bg-clip-text text-transparent drop-shadow-[0_4px_16px_rgba(56,189,248,0.15)]">
                Through Interactive CLI Battles
              </span>
            </h1>
          </div>

          {/* Subtitle */}
          <p className="text-slate-400 text-sm md:text-base font-medium max-w-2xl leading-relaxed">
            NETFORGE is a web-based training ground. Complete CLI configurations, solve fill-in-the-blank commands, compete with colleagues, and level up your network engineering chops.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 w-full sm:w-auto">
            <button
              onClick={handleInstantPlay}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-black text-sm uppercase tracking-wider py-4 px-8 rounded-xl border border-blue-500/30 transition-all cursor-pointer shadow-xl shadow-blue-500/15 active:scale-95 flex items-center justify-center gap-2"
            >
              Instant Play (NetMaster)
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => { playSound("click"); setIsSignUp(true); setShowLanding(false); }}
              className="w-full sm:w-auto bg-slate-900/60 hover:bg-slate-900 text-slate-300 hover:text-white font-bold text-sm uppercase tracking-wider py-4 px-8 rounded-xl border border-slate-800 transition-all cursor-pointer hover:border-slate-700 active:scale-95 text-center"
            >
              Create Account
            </button>
          </div>
        </main>

        {/* Footer */}
        <footer className="py-6 border-t border-slate-950 text-center text-[10px] text-slate-600 font-mono tracking-wider">
          NETFORGE CLOUD ENGINE // VERSION 4.0.1 // READY STATE
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] text-[#E0E0E0] flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Back to Home Button */}
      <button
        onClick={() => {
          playSound("click");
          setValidationError("");
          setShowLanding(true);
        }}
        className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20 flex items-center gap-1.5 text-[#808A9D] hover:text-white transition-colors text-xs font-bold uppercase tracking-wider cursor-pointer group"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
        Back to Home
      </button>

      {/* Absolute futuristic grid & mesh background matching mockup */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0e1726_1px,transparent_1px),linear-gradient(to_bottom,#0e1726_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none opacity-40" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-600 opacity-10 rounded-full filter blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-900 opacity-[0.08] rounded-full filter blur-[120px] pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-md relative z-10 flex flex-col items-center">
        
        {/* Header Icon & Title */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-[#090F1E] border border-blue-500/10 flex items-center justify-center mb-4 text-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
            <Terminal className="h-6 w-6" />
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white mb-2 text-center">
            {isSignUp ? "Create Your Account" : "Welcome Back"}
          </h1>
          <p className="text-xs text-slate-400 font-medium text-center">
            {isSignUp ? "Join the NetConfig Arena and rank among the best" : "Access your virtual terminal sandbox and challenges"}
          </p>
        </div>

        {/* Auth form panel */}
        <div className="w-full bg-[#0D111A]/90 border border-slate-800/80 rounded-2xl p-6 md:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.65)] backdrop-blur-sm">
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {validationError && (
              <div className="p-3 bg-rose-950/25 border border-rose-500/20 rounded-xl text-rose-400 text-xs font-mono font-medium leading-normal">
                [ERROR]: {validationError}
              </div>
            )}

            {/* Username Input */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-[#808A9D] uppercase tracking-wider block font-mono">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-slate-500" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value.replace(/\s+/g, ""));
                    if (Math.random() > 0.4) playSound("typing");
                  }}
                  className="w-full bg-[#020204] border border-slate-800/80 rounded-xl pl-10 pr-4 py-3 text-xs text-[#E0E0E0] placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 font-medium font-mono"
                  placeholder={isSignUp ? "3-20 characters" : "Enter your username"}
                />
              </div>
            </div>

            {/* Email Address Input (Sign Up Only) */}
            {isSignUp && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[#808A9D] uppercase tracking-wider block font-mono">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-slate-500" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (Math.random() > 0.4) playSound("typing");
                    }}
                    className="w-full bg-[#020204] border border-slate-800/80 rounded-xl pl-10 pr-4 py-3 text-xs text-[#E0E0E0] placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 font-medium font-mono"
                    placeholder="e.g. net@domain.com"
                  />
                </div>
              </div>
            )}

            {/* Password Input */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-[#808A9D] uppercase tracking-wider block font-mono">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Key className="h-4 w-4 text-slate-500" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (Math.random() > 0.4) playSound("typing");
                  }}
                  className="w-full bg-[#020204] border border-slate-800/80 rounded-xl pl-10 pr-10 py-3 text-xs text-[#E0E0E0] placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 font-medium font-mono"
                  placeholder={isSignUp ? "At least 8 characters" : "Enter your password"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 focus:outline-none cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password Input (Sign Up Only) */}
            {isSignUp && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[#808A9D] uppercase tracking-wider block font-mono">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Key className="h-4 w-4 text-slate-500" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (Math.random() > 0.4) playSound("typing");
                    }}
                    className="w-full bg-[#020204] border border-slate-800/80 rounded-xl pl-10 pr-10 py-3 text-xs text-[#E0E0E0] placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 font-medium font-mono"
                    placeholder="Re-type your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 focus:outline-none cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs uppercase tracking-wider py-3.5 px-4 rounded-xl border border-blue-500/30 transition-all flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(59,130,246,0.15)] active:scale-[0.98] cursor-pointer pt-3 mt-4"
            >
              <Terminal className="h-4 w-4" />
              {isSignUp ? "Register Account" : "Sign In to Terminal"}
            </button>
          </form>

          {/* Secure Quick Bypass Divider */}
          <div className="relative flex py-4 items-center">
            <div className="flex-grow border-t border-slate-800/50"></div>
            <span className="flex-shrink mx-3 text-[9px] font-mono font-bold tracking-widest text-slate-500 uppercase">
              Secure Quick Bypass
            </span>
            <div className="flex-grow border-t border-slate-800/50"></div>
          </div>

          {/* Instant Demo Login Portals */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-[#808A9D] uppercase tracking-wider block font-mono text-center">
              Instant Demo Accessports
            </label>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => {
                  playSound("complete");
                  onLoginSuccess({
                    username: "NetCadet_99",
                    mockRole: "Student",
                    totalPoints: 4250,
                    globalRank: 14,
                    fullName: "Charlie Cadet",
                    bio: "Training hard to master Cisco IOS syntax and secure subnet routes.",
                    targetCert: "CCNA",
                    experienceLevel: "Beginner",
                    terminalTheme: "Cyan"
                  });
                }}
                className="w-full bg-[#050B14] hover:bg-[#081222] border border-emerald-500/20 hover:border-emerald-500/40 rounded-xl py-2.5 px-3.5 text-xs font-mono font-bold text-slate-300 flex items-center justify-between transition-all active:scale-[0.98] cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[11px]">CADET PORTAL</span>
                </div>
                <span className="text-emerald-400 group-hover:translate-x-0.5 transition-transform text-[10px]">NetCadet_99 →</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  playSound("complete");
                  onLoginSuccess({
                    username: "NetInstructor_7",
                    mockRole: "Tutor",
                    totalPoints: 9500,
                    globalRank: 3,
                    fullName: "Prof. Sarah Jenkins",
                    bio: "Senior Instructor. Specializing in advanced routing, OSPF configurations, and campus switching architecture.",
                    targetCert: "CCNP",
                    experienceLevel: "Intermediate",
                    terminalTheme: "Amber"
                  });
                }}
                className="w-full bg-[#050B14] hover:bg-[#081222] border border-amber-500/20 hover:border-amber-500/40 rounded-xl py-2.5 px-3.5 text-xs font-mono font-bold text-slate-300 flex items-center justify-between transition-all active:scale-[0.98] cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  <span className="text-[11px]">INSTRUCTOR PORTAL</span>
                </div>
                <span className="text-amber-400 group-hover:translate-x-0.5 transition-transform text-[10px]">NetInstructor_7 →</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  playSound("complete");
                  onLoginSuccess({
                    username: "NetAdmin_Chief",
                    mockRole: "Admin",
                    totalPoints: 15000,
                    globalRank: 1,
                    fullName: "Chief Alex Mercer",
                    bio: "Root level network administrator. Complete access privileges for Core BGP configurations and sandboxes.",
                    targetCert: "CCIE",
                    experienceLevel: "Expert",
                    terminalTheme: "Ruby"
                  });
                }}
                className="w-full bg-[#050B14] hover:bg-[#081222] border border-rose-500/20 hover:border-rose-500/40 rounded-xl py-2.5 px-3.5 text-xs font-mono font-bold text-slate-300 flex items-center justify-between transition-all active:scale-[0.98] cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                  <span className="text-[11px]">SYSADMIN PORTAL</span>
                </div>
                <span className="text-rose-400 group-hover:translate-x-0.5 transition-transform text-[10px]">NetAdmin_Chief →</span>
              </button>
            </div>
          </div>

          {/* Go back button */}
          <button
            onClick={() => { playSound("click"); setShowLanding(true); }}
            className="w-full text-center text-[10px] font-mono font-bold text-slate-500 hover:text-slate-300 uppercase tracking-widest mt-5 transition-colors cursor-pointer block"
          >
            ← Back to Landing Page
          </button>
        </div>

        {/* Form Switch Text */}
        <p className="text-xs text-slate-400 mt-6 text-center">
          {isSignUp ? (
            <>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  playSound("click");
                  setValidationError("");
                  setIsSignUp(false);
                }}
                className="text-blue-500 hover:text-blue-400 font-semibold cursor-pointer transition-colors inline-block"
              >
                Sign in here
              </button>
            </>
          ) : (
            <>
              Don't have an account yet?{" "}
              <button
                type="button"
                onClick={() => {
                  playSound("click");
                  setValidationError("");
                  setIsSignUp(true);
                }}
                className="text-blue-500 hover:text-blue-400 font-semibold cursor-pointer transition-colors inline-block"
              >
                Register here
              </button>
            </>
          )}
        </p>

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

