import React, { useState } from "react";
import { playSound } from "../utils/audio";
import { Search, BookOpen, Copy, Check, Terminal, Shield, Network, RefreshCw } from "lucide-react";

interface CommandItem {
  cmd: string;
  desc: string;
  platform: "Cisco IOS" | "Juniper Junos" | "Linux Net";
  category: "Basic" | "Interface" | "Routing" | "Security" | "Diagnostics";
}

const COMMANDS_DATABASE: CommandItem[] = [
  {
    cmd: "enable",
    desc: "Enter privileged EXEC mode (administrator privileges).",
    platform: "Cisco IOS",
    category: "Basic"
  },
  {
    cmd: "configure terminal",
    desc: "Enter global configuration mode to edit settings.",
    platform: "Cisco IOS",
    category: "Basic"
  },
  {
    cmd: "interface gigabitethernet0/0",
    desc: "Select physical ethernet port GigabitEthernet0/0 to configure.",
    platform: "Cisco IOS",
    category: "Interface"
  },
  {
    cmd: "ip address 192.168.1.1 255.255.255.0",
    desc: "Assign a IPv4 address and netmask to the selected interface.",
    platform: "Cisco IOS",
    category: "Interface"
  },
  {
    cmd: "no shutdown",
    desc: "Enable/activate the current physical hardware interface state.",
    platform: "Cisco IOS",
    category: "Interface"
  },
  {
    cmd: "router ospf 10",
    desc: "Initiate OSPF dynamic routing engine process ID 10.",
    platform: "Cisco IOS",
    category: "Routing"
  },
  {
    cmd: "network 10.0.0.0 0.0.0.255 area 0",
    desc: "Enable OSPF routing on matching subnets with Wildcard Mask in Area 0.",
    platform: "Cisco IOS",
    category: "Routing"
  },
  {
    cmd: "crypto key generate rsa modulus 2048",
    desc: "Generate local RSA crypto keypair for secure SSH shell connections.",
    platform: "Cisco IOS",
    category: "Security"
  },
  {
    cmd: "line vty 0 4",
    desc: "Access Virtual Terminal Lines 0 to 4 for remote administration.",
    platform: "Cisco IOS",
    category: "Security"
  },
  {
    cmd: "transport input ssh",
    desc: "Enforce SSH protocol exclusive access on line VTY (block Telnet).",
    platform: "Cisco IOS",
    category: "Security"
  },
  {
    cmd: "show ip interface brief",
    desc: "List operational status and assigned IPs of all local interfaces.",
    platform: "Cisco IOS",
    category: "Diagnostics"
  },
  {
    cmd: "show ip route",
    desc: "Display active routing topology table database entries.",
    platform: "Cisco IOS",
    category: "Diagnostics"
  },
  {
    cmd: "configure",
    desc: "Enter configuration mode on Juniper terminal.",
    platform: "Juniper Junos",
    category: "Basic"
  },
  {
    cmd: "set interfaces ge-0/0/0 unit 0 family inet address 192.168.1.1/24",
    desc: "Assign IPv4 CIDR address to physical port ge-0/0/0 unit 0.",
    platform: "Juniper Junos",
    category: "Interface"
  },
  {
    cmd: "commit",
    desc: "Save and activate drafted candidate configurations in active system.",
    platform: "Juniper Junos",
    category: "Basic"
  },
  {
    cmd: "set protocols ospf area 0.0.0.0 interface ge-0/0/0.0",
    desc: "Inject interface into active OSPF dynamic backbone Area 0.",
    platform: "Juniper Junos",
    category: "Routing"
  },
  {
    cmd: "show interfaces terse",
    desc: "Display brief hardware operational metrics on Junos OS.",
    platform: "Juniper Junos",
    category: "Diagnostics"
  },
  {
    cmd: "ip addr add 192.168.1.1/24 dev eth0",
    desc: "Assign address 192.168.1.1 CIDR to dev eth0 on Linux terminal.",
    platform: "Linux Net",
    category: "Interface"
  },
  {
    cmd: "ip link set eth0 up",
    desc: "Power on and launch hardware state of ethernet interface eth0.",
    platform: "Linux Net",
    category: "Interface"
  },
  {
    cmd: "ip route show",
    desc: "View local operating system routing tables and default gateways.",
    platform: "Linux Net",
    category: "Diagnostics"
  },
  {
    cmd: "ping -c 4 8.8.8.8",
    desc: "Send 4 ICMP ECHO request diagnostic packets to verify global DNS link.",
    platform: "Linux Net",
    category: "Diagnostics"
  }
];

export const CheatSheet: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState<"All" | "Cisco IOS" | "Juniper Junos" | "Linux Net">("All");
  const [selectedCategory, setSelectedCategory] = useState<"All" | "Basic" | "Interface" | "Routing" | "Security" | "Diagnostics">("All");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (cmd: string, idx: number) => {
    navigator.clipboard.writeText(cmd);
    setCopiedId(cmd + idx);
    playSound("success");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredCommands = COMMANDS_DATABASE.filter((item) => {
    const matchesSearch = item.cmd.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.desc.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlatform = selectedPlatform === "All" || item.platform === selectedPlatform;
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesPlatform && matchesCategory;
  });

  return (
    <div className="space-y-6">
      
      {/* Title section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-900 pb-5">
        <div>
          <div className="text-[10px] font-bold text-[#00E5FF] uppercase tracking-wider font-mono flex items-center gap-1.5 mb-1">
            <BookOpen className="h-3.5 w-3.5" />
            SYNTAX COGNITIVE REFERENCE DIRECTORY
          </div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tight font-sans">
            CLI Commands Cheat Sheet
          </h2>
          <p className="text-xs text-slate-400 font-semibold mt-1">
            Browse command parameters, interfaces activation syntax, dynamic routing, and security protocols templates.
          </p>
        </div>
      </div>

      {/* Control Filters Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center bg-[#0D111A] border border-slate-850 rounded-2xl p-4">
        
        {/* Search Input */}
        <div className="lg:col-span-4 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search commands or descriptions..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); if (Math.random() > 0.5) playSound("typing"); }}
            className="w-full bg-[#050508] border border-slate-800 focus:border-[#00E5FF]/50 text-white rounded-xl py-2.5 pl-10 pr-4 text-xs font-mono outline-none focus:ring-1 focus:ring-[#00E5FF]/10"
          />
        </div>

        {/* Platform selection */}
        <div className="lg:col-span-4 flex flex-wrap gap-1.5">
          <span className="text-[10px] font-mono text-slate-500 uppercase font-black mr-2 self-center">OS Stack:</span>
          {(["All", "Cisco IOS", "Juniper Junos", "Linux Net"] as const).map((platform) => (
            <button
              key={platform}
              onClick={() => { playSound("click"); setSelectedPlatform(platform); }}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold uppercase transition-all border cursor-pointer ${
                selectedPlatform === platform
                  ? "bg-[#1A237E]/40 text-[#00E5FF] border-[#00E5FF]/30"
                  : "bg-[#050508] text-slate-400 border-slate-800 hover:text-slate-200"
              }`}
            >
              {platform}
            </button>
          ))}
        </div>

        {/* Category selection */}
        <div className="lg:col-span-4 flex flex-wrap gap-1.5">
          <span className="text-[10px] font-mono text-slate-500 uppercase font-black mr-2 self-center">Scope:</span>
          {(["All", "Basic", "Interface", "Routing", "Security", "Diagnostics"] as const).map((category) => (
            <button
              key={category}
              onClick={() => { playSound("click"); setSelectedCategory(category); }}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold uppercase transition-all border cursor-pointer ${
                selectedCategory === category
                  ? "bg-[#1A237E]/40 text-[#00E5FF] border-[#00E5FF]/30"
                  : "bg-[#050508] text-slate-400 border-slate-800 hover:text-slate-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

      </div>

      {/* Grid of commands */}
      {filteredCommands.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCommands.map((item, idx) => {
            let badgeColor = "bg-blue-950/40 text-blue-400 border-blue-900/30";
            if (item.platform === "Juniper Junos") badgeColor = "bg-emerald-950/40 text-emerald-400 border-emerald-900/30";
            if (item.platform === "Linux Net") badgeColor = "bg-amber-950/40 text-amber-400 border-amber-900/30";

            let iconComponent = <Terminal className="h-3.5 w-3.5 text-[#00E5FF]" />;
            if (item.category === "Security") iconComponent = <Shield className="h-3.5 w-3.5 text-rose-400" />;
            if (item.category === "Routing") iconComponent = <Network className="h-3.5 w-3.5 text-indigo-400" />;
            if (item.category === "Diagnostics") iconComponent = <RefreshCw className="h-3.5 w-3.5 text-purple-400" />;

            return (
              <div
                key={idx}
                className="bg-[#0D111A] border border-slate-850 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-800 transition-all hover:shadow-[0_4px_12px_rgba(0,0,0,0.3)] animate-in fade-in slide-in-from-bottom-2 duration-200"
              >
                <div className="space-y-2.5">
                  
                  {/* Meta tags */}
                  <div className="flex justify-between items-center">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-extrabold uppercase border ${badgeColor}`}>
                      {item.platform}
                    </span>
                    <span className="text-[9px] font-mono font-bold text-slate-500 uppercase flex items-center gap-1">
                      {iconComponent}
                      {item.category}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-350 leading-relaxed font-semibold">
                    {item.desc}
                  </p>

                </div>

                {/* Command snippet with copy button */}
                <div className="mt-4 flex items-center justify-between bg-[#050508] border border-slate-850 rounded-xl py-2 px-3 gap-2">
                  <code className="text-xs text-white font-mono break-all font-bold selection:bg-cyan-500/10">
                    {item.cmd}
                  </code>
                  <button
                    onClick={() => handleCopy(item.cmd, idx)}
                    className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-colors shrink-0 cursor-pointer"
                    title="Copy command to clipboard"
                  >
                    {copiedId === item.cmd + idx ? (
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-16 text-center bg-[#0D111A] border border-slate-850 rounded-2xl max-w-md mx-auto space-y-4">
          <div className="w-12 h-12 bg-slate-950 border border-slate-800 rounded-full flex items-center justify-center text-slate-650 mx-auto">
            <Search className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white font-mono uppercase">No command matching query</h3>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto font-semibold mt-1">
              Refine your search parameters or check the selected operating system filters.
            </p>
          </div>
        </div>
      )}

    </div>
  );
};
