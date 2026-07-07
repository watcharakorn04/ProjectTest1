import React, { useState, useEffect, useRef } from "react";
import { Problem, Step, BlankLine } from "../types";
import { playSound } from "../utils/audio";
import {
  Terminal,
  Activity,
  ArrowLeft,
  Play,
  RotateCcw,
  Clock,
  Sparkles,
  Award,
  TrendingUp,
  Cpu,
  Monitor,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Smartphone,
  Check
} from "lucide-react";

interface ArenaProps {
  problem: Problem;
  onQuit: () => void;
  onSolve: (points: number) => void;
  onNextProblem?: () => void;
  hasNextProblem?: boolean;
}

// Global Cisco/CLI abbreviation mapping helper
const expandWord = (word: string): string => {
  const w = word.toLowerCase().trim();
  if (w === "en") return "enable";
  if (w === "conf" || w === "config" || w === "con") return "configure";
  if (w === "t" || w === "term") return "terminal";
  if (w === "int" || w === "inter" || w === "inte") return "interface";
  if (w === "add" || w === "addr") return "address";
  if (w === "shut") return "shutdown";
  if (w === "sw" || w === "switch") return "switchport";
  if (w === "mod") return "mode";
  if (w === "tr" || w === "tru") return "trunk";
  if (w === "na" || w === "nat") return "native";
  if (w === "vl" || w === "vla") return "vlan";
  if (w === "sh") return "show";
  if (w === "ro") return "route";
  if (w === "osp") return "ospf";
  
  // Interface shortcuts
  // e.g. gi0/0, gig0/0, g0/0, fa0/1, fast0/1, lo0, eth0
  const interfaceMatch = w.match(/^([a-z]+)(\d+[\/\d\.]*)$/);
  if (interfaceMatch) {
    const [matchedFull, name, port] = interfaceMatch;
    if ("gigabitethernet".startsWith(name)) {
      return "gigabitethernet" + port;
    }
    if ("fastethernet".startsWith(name)) {
      return "fastethernet" + port;
    }
    if ("ethernet".startsWith(name)) {
      return "ethernet" + port;
    }
    if ("loopback".startsWith(name)) {
      return "loopback" + port;
    }
  }

  return w;
};

// Check if a typed word matches the expected word, considering abbreviations
const isWordMatch = (actualWord: string, expectedWord: string): boolean => {
  const act = actualWord.toLowerCase();
  const exp = expectedWord.toLowerCase();
  if (act === exp) return true;

  // Check known expanded mappings
  const expandedAct = expandWord(act);
  const expandedExp = expandWord(exp);
  if (expandedAct === expandedExp) return true;

  // General prefix match (must be at least 1 char)
  if (act.length >= 1 && exp.startsWith(act)) {
    return true;
  }

  // Handle interfaces with numbers like "g0/0" matching "gigabitethernet0/0"
  const actIntf = act.match(/^([a-z]+)(\d+[\/\d\.]*)$/);
  const expIntf = exp.match(/^([a-z]+)(\d+[\/\d\.]*)$/);
  if (actIntf && expIntf) {
    const [actFull, actPrefix, actPort] = actIntf;
    const [expFull, expPrefix, expPort] = expIntf;
    if (actPort === expPort) {
      if (expPrefix.startsWith(actPrefix) || expandWord(actPrefix).startsWith(expPrefix)) {
        return true;
      }
    }
  }

  return false;
};

// Main function to check if the full typed line matches the expected configuration line
const checkCommandMatch = (actualInput: string, expectedInput: string): boolean => {
  const actualClean = actualInput.trim().toLowerCase().replace(/\s+/g, " ");
  const expectedClean = expectedInput.trim().toLowerCase().replace(/\s+/g, " ");

  if (actualClean === expectedClean) return true;

  const actualWords = actualClean.split(" ");
  const expectedWords = expectedClean.split(" ");

  // If number of words is different, check if the joined fully expanded commands match
  const actualExpanded = actualWords.map(expandWord).join(" ");
  const expectedExpanded = expectedWords.map(expandWord).join(" ");
  if (actualExpanded === expectedExpanded) return true;

  if (actualWords.length !== expectedWords.length) {
    return false;
  }

  for (let i = 0; i < actualWords.length; i++) {
    if (!isWordMatch(actualWords[i], expectedWords[i])) {
      return false;
    }
  }

  return true;
};

export const Arena: React.FC<ArenaProps> = ({ problem, onQuit, onSolve, onNextProblem, hasNextProblem }) => {
  // Mobile UI toggle state ("topology" | "terminal")
  const [activeMobileTab, setActiveMobileTab] = useState<"topology" | "terminal">("topology");

  // Timer & Multiplier States
  const [timeLeft, setTimeLeft] = useState<number>(120); // 2 minutes
  const [multiplier, setMultiplier] = useState<number>(3); // Max x3
  const [score, setScore] = useState<number>(0);

  // Challenge Execution State
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [cliInput, setCliInput] = useState<string>("");
  const [terminalHistory, setTerminalHistory] = useState<Array<{ text: string; type: "input" | "system" | "success" | "error" }>>([
    { text: `NETFORGE COMMAND SYNTAX AGENT CONSOLE // PROB ID: ${problem.id}`, type: "system" },
    { text: `BOOT SEQUENCE COMPILING INTEL: ${problem.instructions}`, type: "system" },
    { text: `------------------------------------------------------`, type: "system" },
  ]);

  // Shake trigger on error
  const [shakeInput, setShakeInput] = useState<boolean>(false);

  // Blanks Mode state
  const [blanksInputs, setBlanksInputs] = useState<Record<number, string>>({});
  const [blanksFeedback, setBlanksFeedback] = useState<Record<number, "correct" | "incorrect" | "neutral">>({});

  // Challenge completion statistics
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [didTimeOut, setDidTimeOut] = useState<boolean>(false);
  const [showSolution, setShowSolution] = useState<boolean>(false);
  const [errorsCount, setErrorsCount] = useState<number>(0);
  const [accuracy, setAccuracy] = useState<number>(100);

  // Active router highlight state in SVG Topology
  const [selectedNode, setSelectedNode] = useState<string>("RouterA");

  // Dynamically resolve topology
  const currentTopology = problem.topology || 
    (problem.topic === "VLANs & Trunking" ? "Access-Core Spine" :
     problem.topic === "Device Security" ? "Ring Topology" :
     "Standard Hub");

  const handleSelectNode = (nodeName: string) => {
    playSound("click");
    setSelectedNode(nodeName);
    setTerminalHistory((prev) => [
      ...prev,
      { text: `>>> CONSOLE SESSION RE-ROUTED TO DEVICE: ${nodeName} <<<`, type: "system" }
    ]);
  };

  // Quit Confirmation Modal
  const [showQuitModal, setShowQuitModal] = useState<boolean>(false);

  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Reset active state when problem changes
  useEffect(() => {
    setTimeLeft(120);
    setMultiplier(3);
    setScore(0);
    setCurrentStepIndex(0);
    setCliInput("");
    setErrorsCount(0);
    setBlanksInputs({});
    setBlanksFeedback({});
    setIsCompleted(false);
    setDidTimeOut(false);
    setShowSolution(false);

    // Resolve initial node
    const activeTopology = problem.topology || 
      (problem.topic === "VLANs & Trunking" ? "Access-Core Spine" :
       problem.topic === "Device Security" ? "Ring Topology" :
       "Standard Hub");
    if (activeTopology === "Access-Core Spine") {
      setSelectedNode("Spine1");
    } else if (activeTopology === "Ring Topology") {
      setSelectedNode("RouterA");
    } else {
      setSelectedNode("RouterA");
    }

    setTerminalHistory([
      { text: `NETFORGE COMMAND SYNTAX AGENT CONSOLE // PROB ID: ${problem.id}`, type: "system" },
      { text: `BOOT SEQUENCE COMPILING INTEL: ${problem.instructions}`, type: "system" },
      { text: `TOPOLOGY TEMPLATE DETECTED: ${activeTopology.toUpperCase()}`, type: "system" },
      { text: `------------------------------------------------------`, type: "system" },
    ]);
  }, [problem.id]);

  // Start real-time timers
  useEffect(() => {
    const timer = setInterval(() => {
      if (isCompleted) return;
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTriggerCompletion(true); // timed out
          return 0;
        }
        // Lower multiplier gradually
        if (prev === 90) setMultiplier(2);
        if (prev === 45) setMultiplier(1);
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isCompleted, problem.id]);

  // Scroll to bottom of terminal history
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [terminalHistory]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Helper to handle client-side input matching
  const handleCliSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!problem.steps || isCompleted) return;

    const currentStep = problem.steps[currentStepIndex];
    const isMatch = checkCommandMatch(cliInput, currentStep.expectedInput);

    if (isMatch) {
      playSound("success");
      const stepPoints = 150 * multiplier;
      setScore((prev) => prev + stepPoints);

      setTerminalHistory((prev) => [
        ...prev,
        { text: `${currentStep.prompt} ${cliInput}`, type: "input" },
        { text: `>>> SUCCESS: Syntax verified! [+${stepPoints} PTS]`, type: "success" },
      ]);

      const nextStepIndex = currentStepIndex + 1;
      if (nextStepIndex >= problem.steps.length) {
        handleTriggerCompletion(false);
      } else {
        setCurrentStepIndex(nextStepIndex);
        // Prompt transition effect
        setTimeout(() => {
          playSound("typing");
        }, 150);
      }
      setCliInput("");
    } else {
      playSound("error");
      setErrorsCount((prev) => prev + 1);
      setShakeInput(true);
      setTimeout(() => setShakeInput(false), 500);

      setTerminalHistory((prev) => [
        ...prev,
        { text: `${currentStep.prompt} ${cliInput}`, type: "input" },
        { text: `>>> ERROR: Invalid CLI Syntax matching '${currentStep.expectedInput}'`, type: "error" },
      ]);
      setCliInput("");
    }
  };

  // Missing Blanks validation
  const handleBlankValueChange = (lineIndex: number, value: string) => {
    if (Math.random() > 0.5) playSound("typing");
    setBlanksInputs((prev) => ({ ...prev, [lineIndex]: value }));
    // Clear any previous error feedback on edit
    setBlanksFeedback((prev) => ({ ...prev, [lineIndex]: "neutral" }));
  };

  const handleSubmitBlanks = () => {
    if (!problem.blankLines || isCompleted) return;

    let correctCount = 0;
    const newFeedback: Record<number, "correct" | "incorrect" | "neutral"> = {};

    problem.blankLines.forEach((line) => {
      const userValue = (blanksInputs[line.lineIndex] || "").trim().toLowerCase();
      const expectedValue = line.blankValue.trim().toLowerCase();

      if (userValue === expectedValue) {
        correctCount++;
        newFeedback[line.lineIndex] = "correct";
      } else {
        newFeedback[line.lineIndex] = "incorrect";
      }
    });

    setBlanksFeedback(newFeedback);

    if (correctCount === problem.blankLines.length) {
      playSound("success");
      const blanksScore = 500 * multiplier;
      setScore(blanksScore);
      handleTriggerCompletion(false);
    } else {
      playSound("error");
      setErrorsCount((prev) => prev + 1);
      // Shake code editor container
      setShakeInput(true);
      setTimeout(() => setShakeInput(false), 500);
    }
  };

  const handleTriggerCompletion = (timedOut: boolean) => {
    playSound("complete");
    setIsCompleted(true);
    setDidTimeOut(timedOut);
    if (timedOut) {
      setShowSolution(true); // Automatically open answers if timer runs out!
    }

    // Calculate accuracy %
    const totalAttempts = (problem.steps?.length || problem.blankLines?.length || 1) + errorsCount;
    const correctCount = problem.steps?.length || problem.blankLines?.length || 1;
    const computedAccuracy = Math.max(10, Math.round((correctCount / totalAttempts) * 100));
    setAccuracy(computedAccuracy);

    // Apply multiplier logic
    const finalScore = score > 0 ? score : (timedOut ? 0 : 450);
    onSolve(finalScore);
  };

  const handleResetChallenge = () => {
    playSound("complete");
    setTimeLeft(120);
    setMultiplier(3);
    setScore(0);
    setCurrentStepIndex(0);
    setCliInput("");
    setErrorsCount(0);
    setBlanksInputs({});
    setBlanksFeedback({});
    setIsCompleted(false);
    setDidTimeOut(false);
    setShowSolution(false);
    setTerminalHistory([
      { text: `AGENT TERMINAL HARD REBOOT COMPILING // PROB ID: ${problem.id}`, type: "system" },
      { text: `BOOT SEQUENCE COMPILING INTEL: ${problem.instructions}`, type: "system" },
      { text: `------------------------------------------------------`, type: "system" },
    ]);
  };

  return (
    <div className="space-y-4">
      {/* Upper Stats Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0D111A] border border-slate-800 rounded-2xl p-4">
        
        {/* Back and title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => { playSound("click"); setShowQuitModal(true); }}
            className="p-2 rounded-xl bg-[#050508] border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-4.5 w-4.5" />
          </button>
          <div>
            <div className="text-[10px] font-bold text-[#808A9D] uppercase tracking-wider font-mono">
              ACTIVE ARENA CHALLENGE // {problem.topic}
            </div>
            <h2 className="text-sm font-black text-white uppercase tracking-tight">
              {problem.title}
            </h2>
          </div>
        </div>

        {/* Live stats */}
        <div className="flex items-center gap-4">
          
          {/* Time Limit Widget */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#050508] border border-slate-850 font-mono text-xs">
            <Clock className={`h-4 w-4 ${timeLeft < 30 ? "text-rose-500 animate-pulse" : "text-amber-400"}`} />
            <span className={timeLeft < 30 ? "text-rose-400 font-bold" : "text-[#E0E0E0]"}>
              {formatTime(timeLeft)}
            </span>
          </div>

          {/* Multiplier Widget */}
          <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#1A237E]/20 border border-[#00E5FF]/20 text-[#00E5FF] font-mono text-xs font-bold">
            <Sparkles className="h-4 w-4 text-[#00E5FF] animate-pulse" />
            <span>x{multiplier} MULTIPLIER</span>
          </div>

          {/* Real-time score */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs">
            <Award className="h-4 w-4 text-amber-400" />
            <span className="text-white font-extrabold">{score} PTS</span>
          </div>

        </div>

      </div>

      {/* Mobile Tabs for Stacked View (viewport < md/768px) */}
      <div className="flex md:hidden bg-[#0D111A] border border-slate-800 rounded-xl p-1">
        <button
          onClick={() => { playSound("click"); setActiveMobileTab("topology"); }}
          className={`flex-1 py-2 text-xs font-bold tracking-wider uppercase rounded-lg transition-all ${
            activeMobileTab === "topology"
              ? "bg-[#1A237E]/40 text-[#00E5FF] border border-[#00E5FF]/30"
              : "text-slate-400"
          }`}
        >
          Topology Map
        </button>
        <button
          onClick={() => { playSound("click"); setActiveMobileTab("terminal"); }}
          className={`flex-1 py-2 text-xs font-bold tracking-wider uppercase rounded-lg transition-all ${
            activeMobileTab === "terminal"
              ? "bg-[#1A237E]/40 text-[#00E5FF] border border-[#00E5FF]/30"
              : "text-slate-400"
          }`}
        >
          CLI Terminal
        </button>
      </div>

      {/* Main Split Screen container */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch min-h-[500px]">
        
        {/* LEFT PANE: SVG Network Topology & parameters */}
        <div className={`md:col-span-5 flex flex-col gap-4 ${activeMobileTab === "topology" ? "flex" : "hidden md:flex"}`}>
          
          {/* SVG Topology visual card */}
          <div className="bg-[#0D111A] border border-slate-800 rounded-2xl p-4 flex-1 flex flex-col space-y-4">
            
            <div className="flex justify-between items-center border-b border-slate-900 pb-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Activity className="h-3.5 w-3.5 text-[#00E5FF] animate-pulse" />
                Network Topology Layout
              </span>
              <span className="text-[9px] font-bold text-slate-600 font-mono uppercase">
                Interactive Nodes
              </span>
            </div>

            {/* Simulated Interactive SVG Diagram */}
            <div className="bg-[#050508] border border-slate-850 rounded-xl p-4 flex-1 flex items-center justify-center relative overflow-hidden min-h-[220px]">
              
              <svg viewBox="0 0 400 240" className="w-full max-w-sm h-full">
                {currentTopology === "Ring Topology" ? (
                  <>
                    {/* Ring Topology Connection Links */}
                    <line
                      x1="120" y1="70" x2="280" y2="70"
                      stroke={isCompleted ? "#00E5FF" : (selectedNode === "RouterA" || selectedNode === "RouterB" ? "#00E5FF" : "#1A237E")}
                      strokeWidth="3.5"
                      strokeDasharray={isCompleted ? "0" : "5,5"}
                      className="transition-all duration-500"
                    />
                    <line
                      x1="280" y1="70" x2="200" y2="170"
                      stroke={isCompleted ? "#00E5FF" : (selectedNode === "RouterB" || selectedNode === "RouterC" ? "#00E5FF" : "#1A237E")}
                      strokeWidth="3.5"
                      strokeDasharray={isCompleted ? "0" : "5,5"}
                      className="transition-all duration-500"
                    />
                    <line
                      x1="200" y1="170" x2="120" y2="70"
                      stroke={isCompleted ? "#00E5FF" : (selectedNode === "RouterC" || selectedNode === "RouterA" ? "#00E5FF" : "#1A237E")}
                      strokeWidth="3.5"
                      strokeDasharray={isCompleted ? "0" : "5,5"}
                      className="transition-all duration-500"
                    />

                    {/* Router A (Top Left) */}
                    <g onClick={() => handleSelectNode("RouterA")} className="cursor-pointer group">
                      <circle
                        cx="120" cy="70" r="22"
                        fill={selectedNode === "RouterA" ? "#1A237E" : "#0D111A"}
                        stroke={selectedNode === "RouterA" ? "#00E5FF" : "#1f2937"}
                        strokeWidth="2"
                        className="transition-all"
                      />
                      <text x="120" y="73" fill="#E0E0E0" fontSize="9" fontWeight="black" textAnchor="middle" className="font-mono">R-A</text>
                      <circle cx="120" cy="52" r="4.5" fill={isCompleted ? "#10b981" : (currentStepIndex > 0 ? "#f59e0b" : "#ef4444")} className="animate-pulse" />
                    </g>

                    {/* Router B (Top Right) */}
                    <g onClick={() => handleSelectNode("RouterB")} className="cursor-pointer group">
                      <circle
                        cx="280" cy="70" r="22"
                        fill={selectedNode === "RouterB" ? "#1A237E" : "#0D111A"}
                        stroke={selectedNode === "RouterB" ? "#00E5FF" : "#1f2937"}
                        strokeWidth="2"
                        className="transition-all"
                      />
                      <text x="280" y="73" fill="#E0E0E0" fontSize="9" fontWeight="black" textAnchor="middle" className="font-mono">R-B</text>
                      <circle cx="280" cy="52" r="4.5" fill={isCompleted ? "#10b981" : "#64748b"} />
                    </g>

                    {/* Router C (Bottom Center) */}
                    <g onClick={() => handleSelectNode("RouterC")} className="cursor-pointer group">
                      <circle
                        cx="200" cy="170" r="22"
                        fill={selectedNode === "RouterC" ? "#1A237E" : "#0D111A"}
                        stroke={selectedNode === "RouterC" ? "#00E5FF" : "#1f2937"}
                        strokeWidth="2"
                        className="transition-all"
                      />
                      <text x="200" y="173" fill="#E0E0E0" fontSize="9" fontWeight="black" textAnchor="middle" className="font-mono">R-C</text>
                      <circle cx="200" cy="152" r="4.5" fill={isCompleted ? "#10b981" : "#64748b"} />
                    </g>

                    <text x="120" y="105" fill="#808A9D" fontSize="7" fontWeight="bold" textAnchor="middle" className="font-mono">10.0.1.1</text>
                    <text x="280" y="105" fill="#808A9D" fontSize="7" fontWeight="bold" textAnchor="middle" className="font-mono">10.0.2.1</text>
                    <text x="200" y="205" fill="#808A9D" fontSize="7" fontWeight="bold" textAnchor="middle" className="font-mono">10.0.3.1</text>
                  </>
                ) : currentTopology === "Access-Core Spine" ? (
                  <>
                    {/* Spine-Leaf Connections */}
                    <line
                      x1="90" y1="145" x2="140" y2="55"
                      stroke={isCompleted ? "#00E5FF" : (selectedNode === "Leaf1" || selectedNode === "Spine1" ? "#00E5FF" : "#1A237E")}
                      strokeWidth="2.5"
                      strokeDasharray={isCompleted ? "0" : "4,4"}
                    />
                    <line
                      x1="90" y1="145" x2="260" y2="55"
                      stroke={isCompleted ? "#00E5FF" : (selectedNode === "Leaf1" || selectedNode === "Spine2" ? "#00E5FF" : "#1A237E")}
                      strokeWidth="2.5"
                      strokeDasharray={isCompleted ? "0" : "4,4"}
                    />
                    <line
                      x1="200" y1="145" x2="140" y2="55"
                      stroke={isCompleted ? "#00E5FF" : (selectedNode === "Leaf2" || selectedNode === "Spine1" ? "#00E5FF" : "#1A237E")}
                      strokeWidth="2.5"
                      strokeDasharray={isCompleted ? "0" : "4,4"}
                    />
                    <line
                      x1="200" y1="145" x2="260" y2="55"
                      stroke={isCompleted ? "#00E5FF" : (selectedNode === "Leaf2" || selectedNode === "Spine2" ? "#00E5FF" : "#1A237E")}
                      strokeWidth="2.5"
                      strokeDasharray={isCompleted ? "0" : "4,4"}
                    />
                    <line
                      x1="310" y1="145" x2="140" y2="55"
                      stroke={isCompleted ? "#00E5FF" : (selectedNode === "Leaf3" || selectedNode === "Spine1" ? "#00E5FF" : "#1A237E")}
                      strokeWidth="2.5"
                      strokeDasharray={isCompleted ? "0" : "4,4"}
                    />
                    <line
                      x1="310" y1="145" x2="260" y2="55"
                      stroke={isCompleted ? "#00E5FF" : (selectedNode === "Leaf3" || selectedNode === "Spine2" ? "#00E5FF" : "#1A237E")}
                      strokeWidth="2.5"
                      strokeDasharray={isCompleted ? "0" : "4,4"}
                    />

                    {/* Spine 1 */}
                    <g onClick={() => handleSelectNode("Spine1")} className="cursor-pointer group">
                      <circle
                        cx="140" cy="55" r="18"
                        fill={selectedNode === "Spine1" ? "#1A237E" : "#0D111A"}
                        stroke={selectedNode === "Spine1" ? "#00E5FF" : "#1f2937"}
                        strokeWidth="2"
                        className="transition-all"
                      />
                      <text x="140" y="58" fill="#E0E0E0" fontSize="8" fontWeight="black" textAnchor="middle" className="font-mono">S-R1</text>
                      <circle cx="140" cy="40" r="3.5" fill={isCompleted ? "#10b981" : (currentStepIndex > 0 ? "#f59e0b" : "#ef4444")} className="animate-pulse" />
                    </g>

                    {/* Spine 2 */}
                    <g onClick={() => handleSelectNode("Spine2")} className="cursor-pointer group">
                      <circle
                        cx="260" cy="55" r="18"
                        fill={selectedNode === "Spine2" ? "#1A237E" : "#0D111A"}
                        stroke={selectedNode === "Spine2" ? "#00E5FF" : "#1f2937"}
                        strokeWidth="2"
                        className="transition-all"
                      />
                      <text x="260" y="58" fill="#E0E0E0" fontSize="8" fontWeight="black" textAnchor="middle" className="font-mono">S-R2</text>
                      <circle cx="260" cy="40" r="3.5" fill={isCompleted ? "#10b981" : "#64748b"} />
                    </g>

                    {/* Leaf 1 */}
                    <g onClick={() => handleSelectNode("Leaf1")} className="cursor-pointer group">
                      <rect
                        x="70" y="135" width="40" height="20" rx="3"
                        fill={selectedNode === "Leaf1" ? "#1A237E" : "#0D111A"}
                        stroke={selectedNode === "Leaf1" ? "#00E5FF" : "#1f2937"}
                        strokeWidth="1.5"
                        className="transition-all"
                      />
                      <text x="90" y="147" fill="#E0E0E0" fontSize="7" fontWeight="black" textAnchor="middle" className="font-mono">L-SW1</text>
                    </g>

                    {/* Leaf 2 */}
                    <g onClick={() => handleSelectNode("Leaf2")} className="cursor-pointer group">
                      <rect
                        x="180" y="135" width="40" height="20" rx="3"
                        fill={selectedNode === "Leaf2" ? "#1A237E" : "#0D111A"}
                        stroke={selectedNode === "Leaf2" ? "#00E5FF" : "#1f2937"}
                        strokeWidth="1.5"
                        className="transition-all"
                      />
                      <text x="200" y="147" fill="#E0E0E0" fontSize="7" fontWeight="black" textAnchor="middle" className="font-mono">L-SW2</text>
                    </g>

                    {/* Leaf 3 */}
                    <g onClick={() => handleSelectNode("Leaf3")} className="cursor-pointer group">
                      <rect
                        x="290" y="135" width="40" height="20" rx="3"
                        fill={selectedNode === "Leaf3" ? "#1A237E" : "#0D111A"}
                        stroke={selectedNode === "Leaf3" ? "#00E5FF" : "#1f2937"}
                        strokeWidth="1.5"
                        className="transition-all"
                      />
                      <text x="310" y="147" fill="#E0E0E0" fontSize="7" fontWeight="black" textAnchor="middle" className="font-mono">L-SW3</text>
                    </g>

                    <text x="90" y="172" fill="#808A9D" fontSize="6.5" fontWeight="bold" textAnchor="middle" className="font-mono">Leaf-1</text>
                    <text x="200" y="172" fill="#808A9D" fontSize="6.5" fontWeight="bold" textAnchor="middle" className="font-mono">Leaf-2</text>
                    <text x="310" y="172" fill="#808A9D" fontSize="6.5" fontWeight="bold" textAnchor="middle" className="font-mono">Leaf-3</text>
                  </>
                ) : (
                  <>
                    {/* Standard Hub Topology Connections */}
                    <line
                      x1="100" y1="80" x2="200" y2="150"
                      stroke={isCompleted ? "#00E5FF" : (selectedNode === "RouterA" || selectedNode === "SwitchA" ? "#00E5FF" : "#1A237E")}
                      strokeWidth="3.5"
                      strokeDasharray={isCompleted ? "0" : "5,5"}
                      className="transition-all duration-500"
                    />
                    <line
                      x1="200" y1="150" x2="300" y2="80"
                      stroke={isCompleted ? "#00E5FF" : (selectedNode === "RouterB" || selectedNode === "SwitchA" ? "#00E5FF" : "#1A237E")}
                      strokeWidth="3.5"
                      strokeDasharray={isCompleted ? "0" : "5,5"}
                      className="transition-all duration-500"
                    />

                    {/* Switch A Node (Center) */}
                    <g onClick={() => handleSelectNode("SwitchA")} className="cursor-pointer group">
                      <rect
                        x="175" y="130" width="50" height="30" rx="4"
                        fill={selectedNode === "SwitchA" ? "#1A237E" : "#0D111A"}
                        stroke={selectedNode === "SwitchA" ? "#00E5FF" : "#1f2937"}
                        strokeWidth="2"
                        className="transition-all"
                      />
                      <line x1="180" y1="140" x2="220" y2="140" stroke="#808A9D" strokeWidth="1.5" />
                      <line x1="180" y1="150" x2="220" y2="150" stroke="#808A9D" strokeWidth="1.5" />
                      <text x="200" y="148" fill="#E0E0E0" fontSize="8" fontWeight="black" textAnchor="middle" className="font-mono">SW-A</text>
                    </g>

                    {/* Router A Node (Left) */}
                    <g onClick={() => handleSelectNode("RouterA")} className="cursor-pointer group">
                      <circle
                        cx="100" cy="80" r="24"
                        fill={selectedNode === "RouterA" ? "#1A237E" : "#0D111A"}
                        stroke={selectedNode === "RouterA" ? "#00E5FF" : "#1f2937"}
                        strokeWidth="2"
                        className="transition-all"
                      />
                      <text x="100" y="83" fill="#E0E0E0" fontSize="9" fontWeight="black" textAnchor="middle" className="font-mono">R-A</text>
                      <circle
                        cx="100" cy="62" r="4.5"
                        fill={isCompleted ? "#10b981" : (currentStepIndex > 0 ? "#f59e0b" : "#ef4444")}
                        className="animate-pulse"
                      />
                    </g>

                    {/* Router B Node (Right) */}
                    <g onClick={() => handleSelectNode("RouterB")} className="cursor-pointer group">
                      <circle
                        cx="300" cy="80" r="24"
                        fill={selectedNode === "RouterB" ? "#1A237E" : "#0D111A"}
                        stroke={selectedNode === "RouterB" ? "#00E5FF" : "#1f2937"}
                        strokeWidth="2"
                        className="transition-all"
                      />
                      <text x="300" y="83" fill="#E0E0E0" fontSize="9" fontWeight="black" textAnchor="middle" className="font-mono">R-B</text>
                      <circle cx="300" cy="62" r="4.5" fill={isCompleted ? "#10b981" : "#64748b"} />
                    </g>

                    <text x="100" y="125" fill="#808A9D" fontSize="7" fontWeight="bold" textAnchor="middle" className="font-mono">Gi0/0 [192.168.1.1]</text>
                    <text x="300" y="125" fill="#808A9D" fontSize="7" fontWeight="bold" textAnchor="middle" className="font-mono">Gi0/1 [Trunk Mode]</text>
                  </>
                )}
              </svg>

              {/* Absolute overlay diagnostics box */}
              <div className="absolute bottom-2 left-2 right-2 bg-[#0D111A]/90 border border-slate-800 rounded-lg p-2.5 text-[10px] font-mono space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Selected Hardware:</span>
                  <span className="text-[#00E5FF] font-bold">{selectedNode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Hardware Status:</span>
                  <span className={isCompleted ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"}>
                    {isCompleted ? "SYNTAX APPLIED // SECURE" : "AWAITING CLI PARAMETERS"}
                  </span>
                </div>
              </div>

            </div>

            {/* Step Parameters Info */}
            <div className="space-y-2">
              <h3 className="text-xs font-black text-white uppercase tracking-wider font-mono">
                Configuration Parameters
              </h3>
              <div className="bg-[#050508] border border-slate-850 rounded-xl p-4 space-y-3">
                <p className="text-xs text-slate-350 leading-relaxed font-semibold">
                  {problem.instructions}
                </p>

                {/* Step indicator sequence */}
                {problem.steps && (
                  <div className="space-y-1.5 pt-2 border-t border-slate-900">
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                      Configuration Progress ({currentStepIndex + 1}/{problem.steps.length})
                    </div>
                    <div className="flex gap-1.5">
                      {problem.steps.map((_, idx) => (
                        <div
                          key={idx}
                          className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                            idx < currentStepIndex
                              ? "bg-[#00E5FF]"
                              : idx === currentStepIndex
                              ? "bg-amber-500 animate-pulse"
                              : "bg-slate-900"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>

        {/* RIGHT PANE: Simulated Terminal Console or Blanks Editor */}
        <div className={`md:col-span-7 flex flex-col gap-4 ${activeMobileTab === "terminal" ? "flex" : "hidden md:flex"}`}>
          
          {problem.format === "typing" ? (
            
            /* CLI TERMINAL INTERACTION PANEL */
            <div className="flex-1 bg-[#020204] border border-slate-800 rounded-2xl flex flex-col overflow-hidden shadow-2xl relative">
              
              {/* Terminal header */}
              <div className="bg-[#0D111A] border-b border-slate-850 px-4 py-3 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-2">
                  <Monitor className="h-4 w-4 text-[#00E5FF]" />
                  <span className="text-[10px] font-bold text-[#E0E0E0] uppercase tracking-widest font-mono">
                    NetForge Interactive Console (Router-Cisco-IOS)
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
                </div>
              </div>

              {/* Terminal Screen (Scrolling history) */}
              <div className="flex-1 p-4 font-mono text-xs overflow-y-auto space-y-2 h-[340px] scrollbar-thin scrollbar-thumb-slate-800">
                {terminalHistory.map((line, idx) => {
                  let textStyle = "text-slate-400";
                  if (line.type === "input") textStyle = "text-white font-bold";
                  else if (line.type === "system") textStyle = "text-[#808A9D] text-[10px]";
                  else if (line.type === "success") textStyle = "text-emerald-400 font-bold";
                  else if (line.type === "error") textStyle = "text-rose-500 font-extrabold animate-pulse";

                  return (
                    <div key={idx} className={`leading-relaxed whitespace-pre-wrap ${textStyle}`}>
                      {line.text}
                    </div>
                  );
                })}
                <div ref={terminalEndRef} />
              </div>

              {/* Terminal active prompt typing line */}
              <div className="p-3 bg-[#0D111A] border-t border-slate-850 shrink-0 space-y-1.5">
                
                {problem.steps && (
                  <>
                    <form
                      onSubmit={handleCliSubmit}
                      className={`flex items-center gap-2 bg-[#020204] border ${
                        shakeInput ? "border-rose-500 ring-2 ring-rose-500/10" : "border-slate-850 focus-within:border-[#00E5FF]"
                      } rounded-xl px-3 py-2 transition-all ${shakeInput ? "animate-[shake_0.4s_ease-in-out]" : ""}`}
                    >
                      <span className="text-[#00E5FF] font-mono font-bold shrink-0">
                        {problem.steps[currentStepIndex]?.prompt}
                      </span>
                      
                      <input
                        type="text"
                        value={cliInput}
                        onChange={(e) => {
                          setCliInput(e.target.value);
                          if (Math.random() > 0.4) playSound("typing");
                        }}
                        className="flex-1 bg-transparent border-none outline-none focus:ring-0 p-0 text-white font-mono text-xs placeholder-slate-650"
                        placeholder='Type config line... (e.g. "enable")'
                        autoFocus
                        disabled={isCompleted}
                        autoComplete="off"
                        autoCapitalize="off"
                      />

                      <button
                        type="submit"
                        disabled={isCompleted}
                        className="bg-[#1A237E] hover:bg-[#1A237E]/80 text-[#00E5FF] px-3.5 py-1.5 rounded-lg text-[10px] font-mono font-bold tracking-wider uppercase border border-[#00E5FF]/20 transition-all cursor-pointer"
                      >
                        ENTER
                      </button>
                    </form>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-1 gap-1 text-[9px] font-mono text-slate-500">
                      <span className="text-[#00E5FF]/70">Shorthands enabled: (en, conf t, int g0/0, no shut...)</span>
                    </div>
                  </>
                )}

              </div>

            </div>

          ) : (
            
            /* SEQUENCE FILL-IN-THE-BLANKS COMPONENT */
            <div className="flex-1 bg-[#0D111A] border border-slate-800 rounded-2xl p-5 flex flex-col space-y-4 shadow-2xl overflow-y-auto max-h-[500px]">
              
              <div className="border-b border-slate-900 pb-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">
                  Syntax Blank Config Editor
                </span>
                <p className="text-[11px] text-slate-400">
                  Substitute appropriate commands and parameters into the missing sections.
                </p>
              </div>

              {/* Blanks inputs container */}
              <div
                className={`space-y-4 py-3 px-4 bg-[#050508] border border-slate-850 rounded-xl font-mono text-xs leading-loose ${
                  shakeInput ? "animate-[shake_0.4s_ease-in-out] border-rose-500" : ""
                }`}
              >
                {problem.blankLines?.map((line) => {
                  const stateFeedback = blanksFeedback[line.lineIndex];
                  let borderStyle = "border-slate-800 focus:border-[#00E5FF]";
                  if (stateFeedback === "correct") borderStyle = "border-emerald-500 bg-emerald-950/20 text-emerald-400";
                  else if (stateFeedback === "incorrect") borderStyle = "border-rose-500 bg-rose-950/20 text-rose-400";

                  return (
                    <div key={line.lineIndex} className="flex flex-wrap items-center gap-x-2 gap-y-1.5 py-2.5 border-b border-slate-950 last:border-0">
                      
                      <span className="text-slate-400 font-bold shrink-0">{line.textBefore}</span>
                      
                      <input
                        type="text"
                        value={blanksInputs[line.lineIndex] || ""}
                        onChange={(e) => handleBlankValueChange(line.lineIndex, e.target.value)}
                        className={`bg-[#020204] border ${borderStyle} rounded-lg px-3 py-1 font-mono text-xs w-36 text-center focus:outline-none focus:ring-1 focus:ring-[#00E5FF]/10`}
                        placeholder="_____ [blank]"
                        disabled={isCompleted}
                      />

                      {line.textAfter && (
                        <span className="text-slate-400 font-bold shrink-0">{line.textAfter}</span>
                      )}

                      {/* feedback icon */}
                      {stateFeedback === "correct" && (
                        <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                      )}
                      {stateFeedback === "incorrect" && (
                        <XCircle className="h-4 w-4 text-rose-500 shrink-0" />
                      )}

                    </div>
                  );
                })}
              </div>

              {/* Submit Buttons */}
              {!isCompleted && (
                <button
                  onClick={handleSubmitBlanks}
                  className="w-full bg-[#1A237E] hover:bg-[#1A237E]/80 text-[#00E5FF] border border-[#00E5FF]/30 font-mono font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  VERIFY SYNTAX ENTRIES
                </button>
              )}

            </div>

          )}

          {/* Quick utility feedback control */}
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => { playSound("click"); handleResetChallenge(); }}
              className="px-4 py-2 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              REBOOT ROUTER
            </button>
            <button
              onClick={() => { playSound("click"); setShowQuitModal(true); }}
              className="px-4 py-2 bg-slate-900 border border-slate-800 hover:border-rose-950 hover:text-rose-400 text-slate-500 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer"
            >
              QUIT MISSION
            </button>
          </div>

        </div>

      </div>

      {/* QUIT CONFIRMATION MODAL OVERLAY */}
      {showQuitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4">
          <div className="bg-[#0D111A] border border-slate-800 rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="space-y-1.5">
              <h3 className="text-base font-black text-white uppercase tracking-tight font-mono">
                Abort Active Mission?
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                Are you sure you want to exit the Gameplay Arena? Any active score multipliers and intermediate compilation steps will be completely lost.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => { playSound("click"); onQuit(); }}
                className="flex-1 py-2 rounded-xl bg-rose-950/40 text-rose-400 hover:bg-rose-950 hover:text-rose-300 border border-rose-900/40 text-xs font-mono font-bold transition-all uppercase tracking-wider cursor-pointer"
              >
                ABORT CONFIG
              </button>
              <button
                onClick={() => { playSound("click"); setShowQuitModal(false); }}
                className="flex-1 py-2 rounded-xl bg-slate-900 text-[#E0E0E0] border border-slate-800 hover:border-slate-750 text-xs font-mono font-bold transition-all uppercase tracking-wider cursor-pointer"
              >
                RESUME
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CHALLENGE COMPLETION CONGRATULATIONS OVERLAY MODAL */}
      {isCompleted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 overflow-y-auto">
          
          <div className="bg-[#0D111A] border border-[#00E5FF]/40 rounded-3xl max-w-md w-full p-6 md:p-8 space-y-6 text-center shadow-[0_0_50px_rgba(0,229,255,0.15)] relative overflow-hidden my-8 animate-in fade-in zoom-in duration-300">
            
            {/* Hologram aesthetic lines */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#00e5ff05_1px,transparent_1px),linear-gradient(to_bottom,#00e5ff05_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
            
            {didTimeOut ? (
              <div className="space-y-3 relative z-10 animate-in fade-in duration-250">
                {/* Timer Expired Icon */}
                <div className="w-16 h-16 bg-rose-950/40 border border-rose-500/40 text-rose-500 rounded-full mx-auto flex items-center justify-center shadow-lg animate-pulse">
                  <Clock className="h-8 w-8" />
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-rose-400 font-mono">
                    Time Limit Expired
                  </span>
                  <h3 className="text-2xl font-black text-rose-500 uppercase tracking-tight">
                    Session Timeout!
                  </h3>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto font-semibold">
                    The terminal interface session timed out. Review the decrypted solution commands below to build syntax memory.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3 relative z-10 animate-in fade-in duration-250">
                {/* Award Trophy Emblem */}
                <div className="w-16 h-16 bg-[#1A237E]/40 border border-[#00E5FF]/30 text-[#00E5FF] rounded-full mx-auto flex items-center justify-center shadow-lg animate-bounce">
                  <Award className="h-8 w-8" />
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#00E5FF] font-mono">
                    Syntax Configuration Success
                  </span>
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight">
                    Mission Accomplished!
                  </h3>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto font-semibold">
                    You successfully verified and pushed the running configuration script to the virtual hardware router stack.
                  </p>
                </div>
              </div>
            )}

            {/* Completion Statistics Grid */}
            <div className="grid grid-cols-3 gap-3 relative z-10 font-mono">
              <div className="bg-[#050508] border border-slate-850 p-3 rounded-2xl text-center">
                <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-1">Time Left</div>
                <div className="text-sm font-black text-[#E0E0E0]">{formatTime(timeLeft)}</div>
              </div>
              <div className="bg-[#050508] border border-slate-850 p-3 rounded-2xl text-center">
                <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-1">Net Gain</div>
                <div className="text-sm font-black text-[#00E5FF]">+{score > 0 ? score : (didTimeOut ? 0 : 450)} PTS</div>
              </div>
              <div className="bg-[#050508] border border-slate-850 p-3 rounded-2xl text-center">
                <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-1">Accuracy</div>
                <div className="text-sm font-black text-emerald-400">{accuracy}%</div>
              </div>
            </div>

            {/* Answer Solutions reveal panel - can toggle if didTimeOut OR always shown for review */}
            {didTimeOut && (
              <div className="relative z-10 space-y-2">
                <button
                  onClick={() => { playSound("click"); setShowSolution(!showSolution); }}
                  className="w-full bg-slate-900/60 hover:bg-slate-900 text-slate-300 border border-slate-800 font-mono font-bold py-2 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <HelpCircle className="h-4 w-4 text-[#00E5FF]" />
                  {showSolution ? "Hide Decrypted Answers" : "Reveal Decrypted Answers"}
                </button>

                {showSolution && (
                  <div className="bg-[#050508] border border-slate-850 rounded-2xl p-4 text-left font-mono space-y-3 max-h-[160px] overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="text-[10px] font-bold text-[#00E5FF] uppercase tracking-wider">
                      REVEALED CONFIGURATION KEYS:
                    </div>
                    {problem.format === "typing" ? (
                      <div className="space-y-2.5">
                        {problem.steps?.map((step, idx) => (
                          <div key={idx} className="border-b border-slate-900 pb-2 last:border-0 last:pb-0 text-[11px]">
                            <span className="text-slate-500 font-bold block">Prompt: {step.prompt}</span>
                            <code className="text-emerald-400 font-bold mt-0.5 block break-all">{step.expectedInput}</code>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        {problem.blankLines?.map((line, idx) => (
                          <div key={idx} className="border-b border-slate-900 pb-2 last:border-0 last:pb-0 text-[11px]">
                            <span className="text-slate-500 font-bold block">
                              {line.textBefore} [ _____ ] {line.textAfter}
                            </span>
                            <code className="text-emerald-400 font-bold mt-0.5 block">Correct Value: {line.blankValue}</code>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Action buttons list */}
            <div className="relative z-10 pt-2 flex flex-col gap-2.5">
              {!didTimeOut && onNextProblem && (
                <button
                  onClick={() => { onNextProblem(); }}
                  className="w-full bg-[#00E5FF] hover:bg-[#00E5FF]/90 text-[#050508] font-mono font-extrabold py-3.5 rounded-2xl text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(0,229,255,0.3)] cursor-pointer"
                >
                  NEXT CHALLENGE ➔
                </button>
              )}
              
              <button
                onClick={() => { playSound("click"); onQuit(); }}
                className="w-full bg-[#1A237E]/40 hover:bg-[#1A237E]/60 text-[#00E5FF] border border-[#00E5FF]/20 font-mono font-bold py-3.5 rounded-2xl text-xs uppercase tracking-wider transition-all cursor-pointer"
              >
                {didTimeOut ? "RETURN TO ARENA HUB" : "BACK TO HANGAR"}
              </button>

              {didTimeOut && (
                <button
                  onClick={() => { playSound("complete"); handleResetChallenge(); }}
                  className="w-full bg-[#ef4444]/10 hover:bg-[#ef4444]/20 text-rose-400 border border-rose-900/30 font-mono font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer"
                >
                  RETRY SYSTEM CONFIG
                </button>
              )}
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
