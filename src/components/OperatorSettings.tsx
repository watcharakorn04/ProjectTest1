import React, { useState } from "react";
import { UserState, AppState } from "../types";
import { playSound } from "../utils/audio";
import { Settings, User, Shield, AlertTriangle, ShieldCheck, Database, RefreshCw, Check } from "lucide-react";

interface OperatorSettingsProps {
  currentUserState: UserState;
  onUpdateUser: (updated: UserState) => void;
  onResetProgress: () => void;
  onSeedDefaults: () => void;
  mode?: "profile" | "settings";
}

export const OperatorSettings: React.FC<OperatorSettingsProps> = ({
  currentUserState,
  onUpdateUser,
  onResetProgress,
  onSeedDefaults,
  mode,
}) => {
  const [usernameInput, setUsernameInput] = useState(currentUserState.username);
  const [roleInput, setRoleInput] = useState<"Student" | "Tutor" | "Admin">(currentUserState.mockRole);
  const [fullNameInput, setFullNameInput] = useState(currentUserState.fullName || "");
  const [bioInput, setBioInput] = useState(currentUserState.bio || "");
  const [targetCertInput, setTargetCertInput] = useState(currentUserState.targetCert || "CCNA");
  const [experienceLevelInput, setExperienceLevelInput] = useState(currentUserState.experienceLevel || "Beginner");
  const [terminalThemeInput, setTerminalThemeInput] = useState(currentUserState.terminalTheme || "Cyan");
  
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showSeedConfirm, setShowSeedConfirm] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput.trim()) return;

    playSound("success");
    onUpdateUser({
      ...currentUserState,
      username: usernameInput.trim(),
      mockRole: roleInput,
      fullName: fullNameInput.trim(),
      bio: bioInput.trim(),
      targetCert: targetCertInput,
      experienceLevel: experienceLevelInput,
      terminalTheme: terminalThemeInput,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const executeReset = () => {
    onResetProgress();
    setShowResetConfirm(false);
    setUsernameInput("NetCadet_99");
    setRoleInput("Student");
    setFullNameInput("");
    setBioInput("");
    setTargetCertInput("CCNA");
    setExperienceLevelInput("Beginner");
    setTerminalThemeInput("Cyan");
  };

  const executeSeed = () => {
    onSeedDefaults();
    setShowSeedConfirm(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-900 pb-5">
        <div>
          <div className="text-[10px] font-bold text-[#00E5FF] uppercase tracking-wider font-mono flex items-center gap-1.5 mb-1">
            {mode === "profile" ? <User className="h-3.5 w-3.5" /> : <Settings className="h-3.5 w-3.5" />}
            {mode === "profile" ? "OPERATOR PROFILE IDENTITY" : "SYSTEM SETTINGS & MAINTENANCE"}
          </div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tight font-sans">
            {mode === "profile" ? "My Profile" : "System Settings"}
          </h2>
          <p className="text-xs text-slate-400 font-semibold mt-1">
            {mode === "profile" 
              ? "Configure your network callsign operator node parameters and assign your simulation command role."
              : "Perform system maintenance, restore database default problems, and clear saved statistics."}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Profile edit card */}
        {(!mode || mode === "profile") && (
          <div className="lg:col-span-7 bg-[#0D111A] border border-slate-850 rounded-2xl p-6 space-y-6">
            
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-900">
              <User className="h-5 w-5 text-[#00E5FF]" />
              <h3 className="text-sm font-black text-white uppercase tracking-tight font-mono">
                Callsign Operator Identity
              </h3>
            </div>

            <form onSubmit={handleProfileSave} className="space-y-4">
              
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                  Operator Callsign Name (Username)
                </label>
                <input
                  type="text"
                  value={usernameInput}
                  onChange={(e) => { setUsernameInput(e.target.value); if (Math.random() > 0.4) playSound("typing"); }}
                  maxLength={20}
                  className="w-full bg-[#050508] border border-slate-800 focus:border-[#00E5FF] text-white rounded-xl py-3 px-4 text-xs font-mono outline-none focus:ring-1 focus:ring-[#00E5FF]/10 font-bold"
                  placeholder="Enter Callsign..."
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                  Assigned Command Privilege Level
                </label>
                {currentUserState.mockRole === "Admin" ? (
                  <div className="grid grid-cols-3 gap-3">
                    {(["Student", "Tutor", "Admin"] as const).map((role) => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => { playSound("click"); setRoleInput(role); }}
                        className={`py-3.5 px-4 rounded-xl border text-xs font-mono font-bold tracking-wider uppercase transition-all text-center cursor-pointer ${
                          roleInput === role
                            ? "bg-[#1A237E]/40 text-[#00E5FF] border-[#00E5FF]/30 shadow-[0_0_12px_rgba(0,229,255,0.1)]"
                            : "bg-[#050508] text-slate-400 border-slate-800 hover:text-slate-200"
                        }`}
                      >
                        {role === "Student" && "CADET"}
                        {role === "Tutor" && "INSTRUCTOR"}
                        {role === "Admin" && "SYSADMIN"}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-[#050508] border border-slate-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-[#00E5FF] shrink-0" />
                      <span className="text-xs font-mono font-bold text-white uppercase">
                        {currentUserState.mockRole === "Student" && "CADET"}
                        {currentUserState.mockRole === "Tutor" && "INSTRUCTOR"}
                      </span>
                    </div>
                    <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">
                      Contact SysAdmin to elevate command privileges
                    </span>
                  </div>
                )}
              </div>

              {/* Grid for Extra Profile Data */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                    Full Operator Name
                  </label>
                  <input
                    type="text"
                    value={fullNameInput}
                    onChange={(e) => { setFullNameInput(e.target.value); if (Math.random() > 0.4) playSound("typing"); }}
                    className="w-full bg-[#050508] border border-slate-800 focus:border-[#00E5FF] text-white rounded-xl py-3 px-4 text-xs font-mono outline-none focus:ring-1 focus:ring-[#00E5FF]/10 font-bold"
                    placeholder="Enter Full Name..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                    Target Certification
                  </label>
                  <select
                    value={targetCertInput}
                    onChange={(e) => { setTargetCertInput(e.target.value); playSound("click"); }}
                    className="w-full bg-[#050508] border border-slate-800 focus:border-[#00E5FF] text-white rounded-xl py-3 px-4 text-xs font-mono outline-none focus:ring-1 focus:ring-[#00E5FF]/10 font-bold cursor-pointer"
                  >
                    <option value="CCNA">Cisco Certified Network Associate (CCNA)</option>
                    <option value="CCNP">Cisco Certified Network Professional (CCNP)</option>
                    <option value="CCIE">Cisco Certified Internetwork Expert (CCIE)</option>
                    <option value="DevNet">Cisco DevNet Associate</option>
                    <option value="None">None / Sandbox Enthusiast</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                    Operator Experience Level
                  </label>
                  <select
                    value={experienceLevelInput}
                    onChange={(e) => { setExperienceLevelInput(e.target.value); playSound("click"); }}
                    className="w-full bg-[#050508] border border-slate-800 focus:border-[#00E5FF] text-white rounded-xl py-3 px-4 text-xs font-mono outline-none focus:ring-1 focus:ring-[#00E5FF]/10 font-bold cursor-pointer"
                  >
                    <option value="Beginner">Beginner / Novice (L1 Support)</option>
                    <option value="Intermediate">Intermediate / Professional (NOC Engineer)</option>
                    <option value="Expert">Expert / Architect (Senior Network Lead)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                    Primary Terminal Color Theme
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { name: "Cyan", color: "bg-[#00E5FF]" },
                      { name: "Emerald", color: "bg-[#10B981]" },
                      { name: "Amber", color: "bg-[#F59E0B]" },
                      { name: "Ruby", color: "bg-[#EF4444]" },
                    ].map((theme) => (
                      <button
                        key={theme.name}
                        type="button"
                        onClick={() => { playSound("click"); setTerminalThemeInput(theme.name); }}
                        className={`py-2 px-3 rounded-lg border text-[10px] font-mono font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          terminalThemeInput === theme.name
                            ? "bg-[#1A237E]/40 text-white border-slate-700 shadow-[0_0_8px_rgba(255,255,255,0.05)]"
                            : "bg-[#050508] text-slate-500 border-slate-850 hover:text-slate-300"
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${theme.color} inline-block`} />
                        <span className="hidden sm:inline">{theme.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                  Mission Bio & Operational Status
                </label>
                <textarea
                  value={bioInput}
                  onChange={(e) => { setBioInput(e.target.value); if (Math.random() > 0.4) playSound("typing"); }}
                  rows={3}
                  className="w-full bg-[#050508] border border-slate-800 focus:border-[#00E5FF] text-white rounded-xl py-3 px-4 text-xs font-mono outline-none focus:ring-1 focus:ring-[#00E5FF]/10 font-medium resize-none"
                  placeholder="Describe your simulation objectives or active network duty details..."
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-[#1A237E] hover:bg-[#1A237E]/80 text-[#00E5FF] border border-[#00E5FF]/30 font-mono font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {saveSuccess ? (
                    <>
                      <Check className="h-4 w-4 text-emerald-400" />
                      IDENTITY DEPLOYED SUCCESSFULLY
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="h-4 w-4" />
                      DEPLOY MODIFIED PARAMS
                    </>
                  )}
                </button>
              </div>

            </form>

          </div>
        )}

        {mode === "profile" && (
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#0D111A] border border-slate-850 rounded-2xl p-6 space-y-6 relative overflow-hidden">
              {/* Terminal scanline glow effect based on selected terminal theme */}
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#00E5FF]/40 to-transparent animate-pulse" />
              
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-900">
                <Shield className="h-5 w-5 text-[#00E5FF]" />
                <h3 className="text-sm font-black text-white uppercase tracking-tight font-mono">
                  Live Node Telemetry
                </h3>
              </div>

              {/* Live Preview Profile Card */}
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  {/* Glowing custom color avatar */}
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center font-bold shrink-0 relative border-2 ${
                    terminalThemeInput === "Emerald"
                      ? "bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                      : terminalThemeInput === "Amber"
                      ? "bg-amber-500/10 border-amber-500 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                      : terminalThemeInput === "Ruby"
                      ? "bg-rose-500/10 border-rose-500 text-rose-400 shadow-[0_0_15px_rgba(239,68,68,0.2)]"
                      : "bg-blue-500/10 border-[#00E5FF] text-[#00E5FF] shadow-[0_0_15px_rgba(0,229,255,0.2)]"
                  }`}>
                    <User className="h-7 w-7" />
                    <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#0D111A] animate-pulse" />
                  </div>

                  <div className="space-y-1">
                    <div className="text-lg font-black text-white tracking-tight flex items-center gap-2">
                      {usernameInput || "NetCadet_99"}
                    </div>
                    
                    <div className="flex flex-wrap gap-1.5">
                      <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-blue-500/15 text-blue-400 border border-blue-500/20 font-mono">
                        LV 1
                      </span>
                      <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 font-mono uppercase">
                        {roleInput === "Student" ? "CADET" : roleInput === "Tutor" ? "INSTRUCTOR" : "SYSADMIN"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Metadata Details */}
                <div className="bg-[#050508]/60 rounded-xl p-4 border border-slate-900 space-y-3 font-mono text-[11px]">
                  <div className="flex justify-between border-b border-slate-900/60 pb-2">
                    <span className="text-slate-500 uppercase font-bold">Full Name</span>
                    <span className="text-slate-300 font-bold">{fullNameInput || "Not Specified"}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-900/60 pb-2">
                    <span className="text-slate-500 uppercase font-bold">Privilege Level</span>
                    <span className="text-[#00E5FF] font-bold">
                      {roleInput === "Student" && "Level 1 (CADET)"}
                      {roleInput === "Tutor" && "Level 10 (INSTRUCTOR)"}
                      {roleInput === "Admin" && "Level 15 (SYSADMIN)"}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-slate-900/60 pb-2">
                    <span className="text-slate-500 uppercase font-bold">Certification Target</span>
                    <span className="text-amber-400 font-bold">{targetCertInput}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-900/60 pb-2">
                    <span className="text-slate-500 uppercase font-bold">Experience Rating</span>
                    <span className="text-indigo-400 font-bold">{experienceLevelInput}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 uppercase font-bold">Terminal UI Sync</span>
                    <span className="text-slate-300 font-bold flex items-center gap-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        terminalThemeInput === "Emerald" ? "bg-emerald-400" :
                        terminalThemeInput === "Amber" ? "bg-amber-400" :
                        terminalThemeInput === "Ruby" ? "bg-rose-500" : "bg-[#00E5FF]"
                      }`} />
                      {terminalThemeInput} Theme
                    </span>
                  </div>
                </div>

                {/* Bio text */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block font-mono">
                    Operational Objectives
                  </span>
                  <div className="bg-[#050508]/40 border border-slate-900 rounded-xl p-3.5 text-xs text-slate-400 leading-relaxed italic">
                    {bioInput || "No mission goals declared. Edit your profile to update your operational objectives."}
                  </div>
                </div>

                {/* Stats summary */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="bg-[#050508]/40 border border-slate-900 rounded-xl p-3 text-center">
                    <div className="text-[10px] font-bold text-slate-500 uppercase font-mono mb-1">Rank Position</div>
                    <div className="text-lg font-black text-white font-mono">#{currentUserState.globalRank}</div>
                  </div>
                  <div className="bg-[#050508]/40 border border-slate-900 rounded-xl p-3 text-center">
                    <div className="text-[10px] font-bold text-slate-500 uppercase font-mono mb-1">XP Points</div>
                    <div className="text-lg font-black text-blue-400 font-mono">{currentUserState.totalPoints}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Database & Reset controls card */}
        {(!mode || mode === "settings") && (
          <div className={`${mode === "settings" ? "lg:col-span-12" : "lg:col-span-5"} bg-[#0D111A] border border-slate-850 rounded-2xl p-6 space-y-6`}>
            
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-900">
              <Database className="h-5 w-5 text-amber-500" />
              <h3 className="text-sm font-black text-white uppercase tracking-tight font-mono">
                Database Maintenance
              </h3>
            </div>

            <div className="space-y-4">
              
              {/* Seed Defaults Box */}
              <div className="p-4 bg-slate-950/40 border border-slate-900 rounded-xl space-y-3">
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-300 font-mono uppercase">Recover Initial Problem Set</h4>
                  <p className="text-[10px] text-slate-500 leading-relaxed font-semibold">
                    Restore pre-installed topology configurations (Basic Router, OSPF Border, Trunking, SSH Hardening) to defaults.
                  </p>
                </div>

                {showSeedConfirm ? (
                  <div className="space-y-2 animate-in fade-in zoom-in-95 duration-150">
                    <div className="flex items-center gap-1.5 text-amber-500 text-[10px] font-mono font-bold">
                      <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                      CONFIRM DEFAULT RE-SEEDING?
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={executeSeed}
                        className="flex-1 py-1.5 rounded-lg bg-amber-950/55 text-amber-400 hover:bg-amber-950 border border-amber-900/40 text-[10px] font-mono font-bold transition-all"
                      >
                        CONFIRM RE-SEED
                      </button>
                      <button
                        onClick={() => { playSound("click"); setShowSeedConfirm(false); }}
                        className="flex-1 py-1.5 rounded-lg bg-slate-900 text-slate-400 border border-slate-800 text-[10px] font-mono font-semibold"
                      >
                        CANCEL
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => { playSound("click"); setShowSeedConfirm(true); }}
                    className="w-full py-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-amber-400 text-[10px] font-mono font-bold tracking-wider uppercase rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <RefreshCw className="h-3 w-3" />
                    RESEED PROBLEMS LIST
                  </button>
                )}
              </div>

              {/* Clear Storage Box */}
              <div className="p-4 bg-rose-950/10 border border-rose-950/30 rounded-xl space-y-3">
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-rose-400 font-mono uppercase">Full Progress Cache Purge</h4>
                  <p className="text-[10px] text-slate-500 leading-relaxed font-semibold">
                    Completely erase point history achievements, completed problem lists, and rankings storage to clean-start.
                  </p>
                </div>

                {showResetConfirm ? (
                  <div className="space-y-2 animate-in fade-in zoom-in-95 duration-150">
                    <div className="flex items-center gap-1.5 text-rose-500 text-[10px] font-mono font-bold">
                      <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                      WARNING: ACTION CANNOT BE UNDONE!
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={executeReset}
                        className="flex-1 py-1.5 rounded-lg bg-rose-950 text-rose-300 hover:bg-rose-900 border border-rose-900/60 text-[10px] font-mono font-bold transition-all"
                      >
                        CONFIRM HARD PURGE
                      </button>
                      <button
                        onClick={() => { playSound("click"); setShowResetConfirm(false); }}
                        className="flex-1 py-1.5 rounded-lg bg-slate-900 text-slate-400 border border-slate-800 text-[10px] font-mono font-semibold"
                      >
                        CANCEL
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => { playSound("click"); setShowResetConfirm(true); }}
                    className="w-full py-2 bg-rose-950/20 hover:bg-rose-950/40 border border-rose-900/40 hover:border-rose-900/60 text-rose-400 text-[10px] font-mono font-bold tracking-wider uppercase rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <AlertTriangle className="h-3 w-3 text-rose-400" />
                    RESET SCORE & STATS
                  </button>
                )}
              </div>

            </div>

          </div>
        )}

      </div>

    </div>
  );
};
