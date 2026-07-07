import React, { useState } from "react";
import { UserState } from "../types";
import { playSound } from "../utils/audio";
import {
  Users,
  UserPlus,
  Trash2,
  Edit,
  Shield,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Award,
  BookOpen,
  UserCheck,
  UserX,
  X,
  Plus,
  ArrowUpDown,
  GraduationCap
} from "lucide-react";

interface UserManagementProps {
  users: UserState[];
  onUpdateUsers: (updatedList: UserState[]) => void;
  currentUser: UserState;
}

export const UserManagement: React.FC<UserManagementProps> = ({
  users,
  onUpdateUsers,
  currentUser
}) => {
  // Filters and Searching
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"All" | "Student" | "Tutor" | "Admin">("All");
  const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Suspended">("All");
  const [sortBy, setSortBy] = useState<"username" | "points" | "role">("points");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Form Management (Modal / Drawer)
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [editingUsername, setEditingUsername] = useState<string | null>(null);

  // Form Fields
  const [formUsername, setFormUsername] = useState("");
  const [formFullName, setFormFullName] = useState("");
  const [formRole, setFormRole] = useState<"Student" | "Tutor" | "Admin">("Student");
  const [formPoints, setFormPoints] = useState<number>(0);
  const [formTargetCert, setFormTargetCert] = useState("CCNA");
  const [formExpLevel, setFormExpLevel] = useState("Beginner");
  const [formBio, setFormBio] = useState("");
  const [formTheme, setFormTheme] = useState("Cyan");
  const [formStatus, setFormStatus] = useState<"Active" | "Suspended">("Active");

  // Quick Notification messages
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  // Open Add Form
  const handleOpenAdd = () => {
    playSound("click");
    setFormMode("add");
    setEditingUsername(null);
    setFormUsername("");
    setFormFullName("");
    setFormRole("Student");
    setFormPoints(0);
    setFormTargetCert("CCNA");
    setFormExpLevel("Beginner");
    setFormBio("New cadet ready to compile syntax.");
    setFormTheme("Cyan");
    setFormStatus("Active");
    setIsFormOpen(true);
  };

  // Open Edit Form
  const handleOpenEdit = (user: UserState) => {
    playSound("click");
    setFormMode("edit");
    setEditingUsername(user.username);
    setFormUsername(user.username);
    setFormFullName(user.fullName || "");
    setFormRole(user.mockRole);
    setFormPoints(user.totalPoints);
    setFormTargetCert(user.targetCert || "CCNA");
    setFormExpLevel(user.experienceLevel || "Beginner");
    setFormBio(user.bio || "");
    setFormTheme(user.terminalTheme || "Cyan");
    setFormStatus(user.status || "Active");
    setIsFormOpen(true);
  };

  // Handle Form Submission
  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formUsername.trim()) {
      playSound("error");
      showNotification("error", "Callsign/Username is required!");
      return;
    }

    const cleanUsername = formUsername.trim();

    if (formMode === "add") {
      // Check duplicate
      const exists = users.some(u => u.username.toLowerCase() === cleanUsername.toLowerCase());
      if (exists) {
        playSound("error");
        showNotification("error", `Username "${cleanUsername}" is already taken!`);
        return;
      }

      const newUser: UserState = {
        username: cleanUsername,
        mockRole: formRole,
        totalPoints: Number(formPoints) || 0,
        globalRank: users.length + 1,
        fullName: formFullName.trim() || undefined,
        bio: formBio.trim() || undefined,
        targetCert: formTargetCert,
        experienceLevel: formExpLevel,
        terminalTheme: formTheme,
        status: formStatus
      };

      const newList = [...users, newUser];
      // Re-sort rank based on points
      const sorted = newList.sort((a, b) => b.totalPoints - a.totalPoints);
      const reRanked = sorted.map((u, idx) => ({ ...u, globalRank: idx + 1 }));

      onUpdateUsers(reRanked);
      playSound("success");
      showNotification("success", `Registered operator "${cleanUsername}" successfully.`);
    } else {
      // Edit Mode
      const newList = users.map(u => {
        if (u.username === editingUsername) {
          return {
            ...u,
            username: cleanUsername, // Allow renaming
            mockRole: formRole,
            totalPoints: Number(formPoints) || 0,
            fullName: formFullName.trim() || undefined,
            bio: formBio.trim() || undefined,
            targetCert: formTargetCert,
            experienceLevel: formExpLevel,
            terminalTheme: formTheme,
            status: formStatus
          };
        }
        return u;
      });

      // Re-sort rank
      const sorted = newList.sort((a, b) => b.totalPoints - a.totalPoints);
      const reRanked = sorted.map((u, idx) => ({ ...u, globalRank: idx + 1 }));

      onUpdateUsers(reRanked);
      playSound("success");
      showNotification("success", `Updated operator "${cleanUsername}" node configurations.`);
    }

    setIsFormOpen(false);
  };

  // Toggle user status instantly
  const handleToggleStatus = (username: string) => {
    playSound("click");
    const updated = users.map(u => {
      if (u.username === username) {
        const newStatus = u.status === "Suspended" ? "Active" : "Suspended";
        return { ...u, status: newStatus as any };
      }
      return u;
    });
    onUpdateUsers(updated);
    showNotification("success", `Toggled access status for ${username}.`);
  };

  // Delete User
  const handleDeleteUser = (username: string) => {
    if (username === currentUser.username) {
      playSound("error");
      showNotification("error", "You cannot delete your own active Admin node!");
      return;
    }

    if (window.confirm(`Are you sure you want to terminate operator node "${username}"?`)) {
      playSound("complete");
      const newList = users.filter(u => u.username !== username);
      // Re-sort rank
      const sorted = [...newList].sort((a, b) => b.totalPoints - a.totalPoints);
      const reRanked = sorted.map((u, idx) => ({ ...u, globalRank: idx + 1 }));

      onUpdateUsers(reRanked);
      showNotification("success", `Terminated operator "${username}" node.`);
    }
  };

  // Filter & Search User List
  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.fullName && user.fullName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesRole = roleFilter === "All" || user.mockRole === roleFilter;
    
    const userStatus = user.status || "Active";
    const matchesStatus = statusFilter === "All" || userStatus === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Sort
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    let valA: any = a[sortBy] ?? "";
    let valB: any = b[sortBy] ?? "";

    if (sortBy === "points") {
      valA = a.totalPoints;
      valB = b.totalPoints;
    }

    if (valA < valB) return sortOrder === "asc" ? -1 : 1;
    if (valA > valB) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const toggleSort = (field: "username" | "points" | "role") => {
    playSound("click");
    if (sortBy === field) {
      setSortOrder(prev => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  // Quick statistics calculation
  const totalOperators = users.length;
  const activeOperators = users.filter(u => (u.status || "Active") === "Active").length;
  const suspendedOperators = users.filter(u => u.status === "Suspended").length;
  const totalXP = users.reduce((acc, curr) => acc + curr.totalPoints, 0);

  return (
    <div className="space-y-6">
      
      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-900 pb-5">
        <div>
          <div className="text-[10px] font-bold text-blue-400 uppercase tracking-wider font-mono flex items-center gap-1.5 mb-1">
            <Users className="h-3.5 w-3.5 text-blue-400" />
            ADMINISTRATIVE USER MANAGEMENT COMMAND
          </div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tight font-sans">
            User Accounts Directory
          </h2>
          <p className="text-xs text-slate-400 font-semibold mt-1">
            Manage caller operator credentials, assign security clear permissions, allocate system XP, and monitor node access status.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs uppercase tracking-wider px-4 py-3 rounded-xl border border-blue-500/30 transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-blue-500/10 active:scale-95"
        >
          <UserPlus className="h-4 w-4" />
          Register Operator
        </button>
      </div>

      {/* QUICK STATISTICS CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0B1220] border border-slate-850 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono leading-none">Total Nodes</div>
            <div className="text-lg font-black text-white mt-1 leading-none">{totalOperators}</div>
          </div>
        </div>

        <div className="bg-[#0B1220] border border-slate-850 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <CheckCircle className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono leading-none">Active Link</div>
            <div className="text-lg font-black text-emerald-400 mt-1 leading-none">{activeOperators}</div>
          </div>
        </div>

        <div className="bg-[#0B1220] border border-slate-850 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <XCircle className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono leading-none">Suspended</div>
            <div className="text-lg font-black text-rose-400 mt-1 leading-none">{suspendedOperators}</div>
          </div>
        </div>

        <div className="bg-[#0B1220] border border-slate-850 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Award className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono leading-none">Total XP Pools</div>
            <div className="text-lg font-black text-amber-400 mt-1 leading-none">{totalXP} XP</div>
          </div>
        </div>
      </div>

      {/* NOTIFICATION TOAST */}
      {notification && (
        <div className={`p-4 rounded-xl border flex items-center gap-3 transition-all animate-in fade-in slide-in-from-top-2 duration-200 ${
          notification.type === "success" 
            ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-400" 
            : "bg-rose-950/20 border-rose-500/30 text-rose-400"
        }`}>
          <div className="flex-1 text-xs font-mono font-bold">
            {notification.type === "success" ? "[OK // SYSTEM]: " : "[FAIL // ERRO]: "}
            {notification.message}
          </div>
        </div>
      )}

      {/* SEARCH AND FILTERS PANEL */}
      <div className="bg-[#0D111A] border border-slate-850 rounded-2xl p-4 flex flex-col md:flex-row items-center gap-3 justify-between">
        
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Callsign or Name..."
            className="w-full bg-[#050912] border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#E0E0E0] placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 font-mono font-bold"
          />
        </div>

        {/* Filters Selectors */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          
          {/* Role Filter */}
          <div className="flex items-center bg-[#050912] border border-slate-800 rounded-xl px-2.5 py-1.5 gap-2">
            <Filter className="h-3.5 w-3.5 text-slate-500" />
            <select
              value={roleFilter}
              onChange={(e) => { playSound("click"); setRoleFilter(e.target.value as any); }}
              className="bg-transparent text-xs font-mono font-bold text-slate-300 focus:outline-none cursor-pointer border-none py-1"
            >
              <option value="All">All Roles</option>
              <option value="Student">Student (Cadet)</option>
              <option value="Tutor">Tutor (Instructor)</option>
              <option value="Admin">Admin (Sysadmin)</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center bg-[#050912] border border-slate-800 rounded-xl px-2.5 py-1.5 gap-2">
            <Shield className="h-3.5 w-3.5 text-slate-500" />
            <select
              value={statusFilter}
              onChange={(e) => { playSound("click"); setStatusFilter(e.target.value as any); }}
              className="bg-transparent text-xs font-mono font-bold text-slate-300 focus:outline-none cursor-pointer border-none py-1"
            >
              <option value="All">All Status</option>
              <option value="Active">Active Nodes</option>
              <option value="Suspended">Suspended Nodes</option>
            </select>
          </div>

          {/* Clear Filters Button */}
          {(searchQuery || roleFilter !== "All" || statusFilter !== "All") && (
            <button
              onClick={() => {
                playSound("click");
                setSearchQuery("");
                setRoleFilter("All");
                setStatusFilter("All");
              }}
              className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 hover:text-white px-2 py-1 transition-colors cursor-pointer"
            >
              Clear Filters
            </button>
          )}

        </div>
      </div>

      {/* USERS DIRECTORY TABLE */}
      <div className="bg-[#0D111A] border border-slate-850 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-900 bg-[#0A0E17]/60 text-[10px] font-mono font-bold text-slate-400 tracking-wider uppercase select-none">
                <th className="py-4 px-5">Operator Nodes Info</th>
                <th 
                  className="py-4 px-5 cursor-pointer hover:bg-slate-900/40 transition-colors"
                  onClick={() => toggleSort("role")}
                >
                  <div className="flex items-center gap-1.5">
                    Clearance Role
                    <ArrowUpDown className="h-3 w-3 text-slate-500" />
                  </div>
                </th>
                <th 
                  className="py-4 px-5 cursor-pointer hover:bg-slate-900/40 transition-colors"
                  onClick={() => toggleSort("points")}
                >
                  <div className="flex items-center gap-1.5">
                    Operator XP
                    <ArrowUpDown className="h-3 w-3 text-slate-500" />
                  </div>
                </th>
                <th className="py-4 px-5">Target Certificate</th>
                <th className="py-4 px-5">Status</th>
                <th className="py-4 px-5 text-right">Node Security Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900 font-sans">
              {sortedUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs font-mono font-bold text-slate-500 uppercase tracking-widest">
                    [NO OPERATORS MATCHING SEARCH CRITERIA]
                  </td>
                </tr>
              ) : (
                sortedUsers.map((user) => {
                  const isCurrentUser = user.username === currentUser.username;
                  const isSuspended = user.status === "Suspended";

                  // Dynamic color avatars
                  let avatarRing = "ring-blue-500/30 bg-blue-500/10 text-blue-400";
                  if (user.mockRole === "Admin") {
                    avatarRing = "ring-rose-500/30 bg-rose-500/10 text-rose-400";
                  } else if (user.mockRole === "Tutor") {
                    avatarRing = "ring-amber-500/30 bg-amber-500/10 text-amber-400";
                  }

                  return (
                    <tr 
                      key={user.username} 
                      className={`hover:bg-[#0F1522]/30 transition-colors ${
                        isCurrentUser ? "bg-blue-600/[0.02]" : ""
                      }`}
                    >
                      {/* Identity Column */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className={`w-9.5 h-9.5 rounded-full ring-2 ${avatarRing} flex items-center justify-center font-extrabold text-sm shrink-0`}>
                            {user.username.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-extrabold text-white font-mono">
                                {user.username}
                              </span>
                              {isCurrentUser && (
                                <span className="text-[8px] bg-blue-500/20 text-blue-400 font-mono font-bold px-1.5 py-0.5 rounded border border-blue-500/20">
                                  YOU
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-400 font-medium block truncate">
                              {user.fullName || "No Name Assigned"}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Role Column */}
                      <td className="py-4 px-5">
                        {user.mockRole === "Admin" ? (
                          <span className="text-[9px] font-extrabold px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 uppercase tracking-widest font-mono">
                            Sysadmin
                          </span>
                        ) : user.mockRole === "Tutor" ? (
                          <span className="text-[9px] font-extrabold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase tracking-widest font-mono">
                            Instructor
                          </span>
                        ) : (
                          <span className="text-[9px] font-extrabold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-widest font-mono">
                            Cadet
                          </span>
                        )}
                      </td>

                      {/* Points Column */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-1.5">
                          <Award className="h-3.5 w-3.5 text-amber-400" />
                          <span className="text-xs font-black text-white font-mono">
                            {user.totalPoints}
                          </span>
                          <span className="text-[9px] text-slate-500 font-mono">XP</span>
                        </div>
                      </td>

                      {/* Certificate */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-1.5 text-xs text-slate-300 font-mono font-bold">
                          <GraduationCap className="h-3.5 w-3.5 text-blue-400" />
                          <span>{user.targetCert || "CCNA"}</span>
                          <span className="text-[9px] text-slate-500 font-normal">({user.experienceLevel || "Beginner"})</span>
                        </div>
                      </td>

                      {/* Status Column */}
                      <td className="py-4 px-5">
                        {isSuspended ? (
                          <span className="inline-flex items-center gap-1 text-[9px] font-mono font-extrabold text-rose-400 bg-rose-500/5 px-2 py-0.5 rounded border border-rose-500/10">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                            SUSPENDED
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[9px] font-mono font-extrabold text-emerald-400 bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            ACTIVE LINK
                          </span>
                        )}
                      </td>

                      {/* Controls Column */}
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          
                          {/* Toggle Status Button */}
                          <button
                            onClick={() => handleToggleStatus(user.username)}
                            disabled={isCurrentUser}
                            title={isSuspended ? "Re-activate Node Link" : "Suspend Node Link"}
                            className={`p-2 rounded-lg border text-xs transition-all cursor-pointer ${
                              isCurrentUser
                                ? "opacity-30 cursor-not-allowed border-slate-800 text-slate-600"
                                : isSuspended
                                ? "bg-emerald-950/20 border-emerald-500/20 hover:border-emerald-500 text-emerald-400 hover:bg-emerald-500/10"
                                : "bg-rose-950/20 border-rose-500/20 hover:border-rose-500 text-rose-400 hover:bg-rose-500/10"
                            }`}
                          >
                            {isSuspended ? <UserCheck className="h-3.5 w-3.5" /> : <UserX className="h-3.5 w-3.5" />}
                          </button>

                          {/* Edit Button */}
                          <button
                            onClick={() => handleOpenEdit(user)}
                            title="Edit Node Parameters"
                            className="p-2 rounded-lg bg-blue-950/20 border border-blue-500/20 hover:border-blue-500 text-blue-400 hover:bg-blue-500/10 text-xs transition-all cursor-pointer"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => handleDeleteUser(user.username)}
                            disabled={isCurrentUser}
                            title="Terminate Node"
                            className={`p-2 rounded-lg border text-xs transition-all cursor-pointer ${
                              isCurrentUser
                                ? "opacity-30 cursor-not-allowed border-slate-800 text-slate-600"
                                : "bg-[#1A0B10]/40 border-rose-500/20 hover:border-rose-500 text-rose-400 hover:bg-rose-950/30"
                            }`}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>

                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* FORM MODAL PANEL (SLIDE DRAWER DESIGN) */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-950/80 backdrop-blur-sm transition-all animate-in fade-in duration-200">
          <div 
            className="w-full max-w-lg h-screen bg-[#090D16] border-l border-slate-800 p-6 flex flex-col justify-between shadow-2xl relative animate-in slide-in-from-right duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              {/* Form Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-900 mb-6">
                <div>
                  <span className="text-[9px] font-mono font-bold text-blue-400 uppercase tracking-widest block">
                    {formMode === "add" ? "INITIALIZE NEW CALLSIGN OPERATOR" : "MODIFY TARGET CALLSIGN NODE"}
                  </span>
                  <h3 className="text-base font-black text-white uppercase tracking-tight">
                    {formMode === "add" ? "Register New Operator" : `Configure Operator Node: ${editingUsername}`}
                  </h3>
                </div>
                <button
                  onClick={() => { playSound("click"); setIsFormOpen(false); }}
                  className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              {/* Form Inputs Container */}
              <form onSubmit={handleSaveUser} className="space-y-4">
                
                {/* Username */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[#808A9D] uppercase tracking-wider block font-mono">
                    Callsign / Operator Username *
                  </label>
                  <input
                    type="text"
                    required
                    value={formUsername}
                    disabled={formMode === "edit" && formUsername === currentUser.username}
                    onChange={(e) => setFormUsername(e.target.value.replace(/\s+/g, ""))}
                    placeholder="e.g. NetCadet_XYZ"
                    className="w-full bg-[#03060C] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-[#E0E0E0] placeholder-slate-600 focus:outline-none focus:border-blue-500 font-mono font-bold"
                  />
                </div>

                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[#808A9D] uppercase tracking-wider block font-mono">
                    Full Display Name
                  </label>
                  <input
                    type="text"
                    value={formFullName}
                    onChange={(e) => setFormFullName(e.target.value)}
                    placeholder="e.g. Jonathan Doe"
                    className="w-full bg-[#03060C] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-[#E0E0E0] placeholder-slate-600 focus:outline-none focus:border-blue-500 font-bold"
                  />
                </div>

                {/* Role, Status, XP Row */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Role Selection */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-[#808A9D] uppercase tracking-wider block font-mono">
                      Simulation Role
                    </label>
                    <select
                      value={formRole}
                      disabled={formUsername === currentUser.username}
                      onChange={(e) => setFormRole(e.target.value as any)}
                      className="w-full bg-[#03060C] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-[#E0E0E0] focus:outline-none focus:border-blue-500 font-mono font-bold cursor-pointer"
                    >
                      <option value="Student">Student (Cadet)</option>
                      <option value="Tutor">Tutor (Instructor)</option>
                      <option value="Admin">Admin (Sysadmin)</option>
                    </select>
                  </div>

                  {/* Node Status Selection */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-[#808A9D] uppercase tracking-wider block font-mono">
                      Access Status
                    </label>
                    <select
                      value={formStatus}
                      disabled={formUsername === currentUser.username}
                      onChange={(e) => setFormStatus(e.target.value as any)}
                      className="w-full bg-[#03060C] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-[#E0E0E0] focus:outline-none focus:border-blue-500 font-mono font-bold cursor-pointer"
                    >
                      <option value="Active">Active Link</option>
                      <option value="Suspended">Suspended</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {/* Total Points (XP) */}
                  <div className="space-y-1.5 col-span-1">
                    <label className="text-[10px] font-bold text-[#808A9D] uppercase tracking-wider block font-mono">
                      Operator XP *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      max="100000"
                      value={formPoints}
                      onChange={(e) => setFormPoints(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full bg-[#03060C] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-[#E0E0E0] focus:outline-none focus:border-blue-500 font-mono font-bold"
                    />
                  </div>

                  {/* Experience Level */}
                  <div className="space-y-1.5 col-span-1">
                    <label className="text-[10px] font-bold text-[#808A9D] uppercase tracking-wider block font-mono">
                      Experience
                    </label>
                    <select
                      value={formExpLevel}
                      onChange={(e) => setFormExpLevel(e.target.value)}
                      className="w-full bg-[#03060C] border border-slate-800 rounded-xl px-2 py-2.5 text-xs text-[#E0E0E0] focus:outline-none focus:border-blue-500 font-mono font-bold cursor-pointer"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Expert">Expert</option>
                    </select>
                  </div>

                  {/* Target Cert */}
                  <div className="space-y-1.5 col-span-1">
                    <label className="text-[10px] font-bold text-[#808A9D] uppercase tracking-wider block font-mono">
                      Target Cert
                    </label>
                    <select
                      value={formTargetCert}
                      onChange={(e) => setFormTargetCert(e.target.value)}
                      className="w-full bg-[#03060C] border border-slate-800 rounded-xl px-2 py-2.5 text-xs text-[#E0E0E0] focus:outline-none focus:border-blue-500 font-mono font-bold cursor-pointer"
                    >
                      <option value="CCNA">CCNA</option>
                      <option value="CCNP">CCNP</option>
                      <option value="CCIE">CCIE</option>
                      <option value="None">None</option>
                    </select>
                  </div>
                </div>

                {/* Operator Theme */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[#808A9D] uppercase tracking-wider block font-mono">
                    Terminal Visual Theme
                  </label>
                  <select
                    value={formTheme}
                    onChange={(e) => setFormTheme(e.target.value)}
                    className="w-full bg-[#03060C] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-[#E0E0E0] focus:outline-none focus:border-blue-500 font-mono font-bold cursor-pointer"
                  >
                    <option value="Cyan">Matrix Cyan</option>
                    <option value="Emerald">Forest Emerald</option>
                    <option value="Amber">Retro Amber</option>
                    <option value="Ruby">Toxic Ruby</option>
                  </select>
                </div>

                {/* Operator Bio */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[#808A9D] uppercase tracking-wider block font-mono">
                    Short Bio
                  </label>
                  <textarea
                    rows={2}
                    value={formBio}
                    onChange={(e) => setFormBio(e.target.value)}
                    placeholder="Describe operator specialities..."
                    className="w-full bg-[#03060C] border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-[#E0E0E0] placeholder-slate-600 focus:outline-none focus:border-blue-500 font-semibold resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => { playSound("click"); setIsFormOpen(false); }}
                    className="flex-1 bg-[#050912] hover:bg-[#0A101C] text-slate-400 hover:text-white font-bold text-xs uppercase tracking-wider py-3 rounded-xl border border-slate-800 transition-all cursor-pointer text-center"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-wider py-3 rounded-xl border border-blue-500/30 transition-all cursor-pointer shadow-lg shadow-blue-500/10 text-center active:scale-95"
                  >
                    {formMode === "add" ? "Register Node" : "Save Configurations"}
                  </button>
                </div>

              </form>
            </div>

            <div className="text-[9px] font-mono text-slate-600 border-t border-slate-900 pt-3 text-center">
              NETFORGE USER CREDENTIALS CONTROLLER SECURITY SUBSECTION
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
