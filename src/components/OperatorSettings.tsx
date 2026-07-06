import React, { useState } from "react";
import { UserState, AppState } from "../types";
import { playSound } from "../utils/audio";
import { Settings, User, Shield, AlertTriangle, ShieldCheck, Database, RefreshCw, Check } from "lucide-react";

interface OperatorSettingsProps {
  currentUserState: UserState;
  onUpdateUser: (updated: UserState) => void;
  onResetProgress: () => void;
  onSeedDefaults: () => void;
}

export const OperatorSettings: React.FC<OperatorSettingsProps> = ({
  currentUserState,
  onUpdateUser,
  onResetProgress,
  onSeedDefaults,
}) => {
  const [usernameInput, setUsernameInput] = useState(currentUserState.username);
  const [roleInput, setRoleInput] = useState<"Student" | "Tutor" | "Admin">(currentUserState.mockRole);
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
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const executeReset = () => {
    onResetProgress();
    setShowResetConfirm(false);
    setUsernameInput("NetCadet_99");
    setRoleInput("Student");
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
            <Settings className="h-3.5 w-3.5" />
            OPERATOR CORE SETTINGS
          </div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tight font-sans">
            System Settings & Profile
          </h2>
          <p className="text-xs text-slate-400 font-semibold mt-1">
            Configure system settings, tweak your network callsign operator node parameters, and maintain the CLI state database.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Profile edit card */}
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

        {/* Database & Reset controls card */}
        <div className="lg:col-span-5 bg-[#0D111A] border border-slate-850 rounded-2xl p-6 space-y-6">
          
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

      </div>

    </div>
  );
};
