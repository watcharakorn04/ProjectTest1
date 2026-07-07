import React, { useState, useEffect } from "react";
import { Problem, Step, BlankLine, UserState } from "../types";
import { playSound } from "../utils/audio";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Terminal,
  Layers,
  CheckCircle,
  AlertCircle,
  Plus,
  Trash2,
  HelpCircle,
  Play
} from "lucide-react";

interface CreatorStudioProps {
  onPublish: (problem: Problem) => void;
  onCancel: () => void;
  problemToEdit?: Problem;
  currentUser?: UserState;
}

export const TopologyPreview: React.FC<{ name: string }> = ({ name }) => {
  return (
    <div className="bg-[#020204] border border-slate-850 rounded-xl p-4 flex items-center justify-center relative overflow-hidden min-h-[180px]">
      <svg viewBox="0 0 400 220" className="w-full max-w-xs h-full">
        {name === "Ring Topology" ? (
          <>
            {/* Ring Topology Connection Links */}
            <line
              x1="120" y1="60" x2="280" y2="60"
              stroke="#1A237E"
              strokeWidth="3.5"
              strokeDasharray="5,5"
              className="transition-all duration-500"
            />
            <line
              x1="280" y1="60" x2="200" y2="160"
              stroke="#1A237E"
              strokeWidth="3.5"
              strokeDasharray="5,5"
              className="transition-all duration-500"
            />
            <line
              x1="200" y1="160" x2="120" y2="60"
              stroke="#1A237E"
              strokeWidth="3.5"
              strokeDasharray="5,5"
              className="transition-all duration-500"
            />

            {/* Router A (Top Left) */}
            <g>
              <circle
                cx="120" cy="60" r="22"
                fill="#0D111A"
                stroke="#00E5FF"
                strokeWidth="2"
              />
              <text x="120" y="63" fill="#E0E0E0" fontSize="9" fontWeight="black" textAnchor="middle" className="font-mono">R-A</text>
              <circle cx="120" cy="42" r="3.5" fill="#10b981" />
            </g>

            {/* Router B (Top Right) */}
            <g>
              <circle
                cx="280" cy="60" r="22"
                fill="#0D111A"
                stroke="#1f2937"
                strokeWidth="2"
              />
              <text x="280" y="63" fill="#E0E0E0" fontSize="9" fontWeight="black" textAnchor="middle" className="font-mono">R-B</text>
              <circle cx="280" cy="42" r="3.5" fill="#64748b" />
            </g>

            {/* Router C (Bottom Center) */}
            <g>
              <circle
                cx="200" cy="160" r="22"
                fill="#0D111A"
                stroke="#1f2937"
                strokeWidth="2"
              />
              <text x="200" y="163" fill="#E0E0E0" fontSize="9" fontWeight="black" textAnchor="middle" className="font-mono">R-C</text>
              <circle cx="200" cy="142" r="3.5" fill="#64748b" />
            </g>

            <text x="120" y="95" fill="#808A9D" fontSize="7" fontWeight="bold" textAnchor="middle" className="font-mono">10.0.1.1</text>
            <text x="280" y="95" fill="#808A9D" fontSize="7" fontWeight="bold" textAnchor="middle" className="font-mono">10.0.2.1</text>
            <text x="200" y="195" fill="#808A9D" fontSize="7" fontWeight="bold" textAnchor="middle" className="font-mono">10.0.3.1</text>
          </>
        ) : name === "Access-Core Spine" ? (
          <>
            {/* Spine-Leaf Connections */}
            <line x1="90" y1="135" x2="140" y2="55" stroke="#1A237E" strokeWidth="2.5" strokeDasharray="4,4" />
            <line x1="90" y1="135" x2="260" y2="55" stroke="#1A237E" strokeWidth="2.5" strokeDasharray="4,4" />
            <line x1="200" y1="135" x2="140" y2="55" stroke="#1A237E" strokeWidth="2.5" strokeDasharray="4,4" />
            <line x1="200" y1="135" x2="260" y2="55" stroke="#1A237E" strokeWidth="2.5" strokeDasharray="4,4" />
            <line x1="310" y1="135" x2="140" y2="55" stroke="#1A237E" strokeWidth="2.5" strokeDasharray="4,4" />
            <line x1="310" y1="135" x2="260" y2="55" stroke="#1A237E" strokeWidth="2.5" strokeDasharray="4,4" />

            {/* Spine 1 */}
            <g>
              <circle cx="140" cy="55" r="18" fill="#0D111A" stroke="#00E5FF" strokeWidth="2" />
              <text x="140" y="58" fill="#E0E0E0" fontSize="8" fontWeight="black" textAnchor="middle" className="font-mono">S-R1</text>
              <circle cx="140" cy="40" r="3.5" fill="#10b981" />
            </g>

            {/* Spine 2 */}
            <g>
              <circle cx="260" cy="55" r="18" fill="#0D111A" stroke="#1f2937" strokeWidth="2" />
              <text x="260" y="58" fill="#E0E0E0" fontSize="8" fontWeight="black" textAnchor="middle" className="font-mono">S-R2</text>
              <circle cx="260" cy="40" r="3.5" fill="#64748b" />
            </g>

            {/* Leaf 1 */}
            <g>
              <rect x="70" y="125" width="40" height="20" rx="3" fill="#0D111A" stroke="#1f2937" strokeWidth="1.5" />
              <text x="90" y="137" fill="#E0E0E0" fontSize="7" fontWeight="black" textAnchor="middle" className="font-mono">L-SW1</text>
            </g>

            {/* Leaf 2 */}
            <g>
              <rect x="180" y="125" width="40" height="20" rx="3" fill="#0D111A" stroke="#1f2937" strokeWidth="1.5" />
              <text x="200" y="137" fill="#E0E0E0" fontSize="7" fontWeight="black" textAnchor="middle" className="font-mono">L-SW2</text>
            </g>

            {/* Leaf 3 */}
            <g>
              <rect x="290" y="125" width="40" height="20" rx="3" fill="#0D111A" stroke="#1f2937" strokeWidth="1.5" />
              <text x="310" y="137" fill="#E0E0E0" fontSize="7" fontWeight="black" textAnchor="middle" className="font-mono">L-SW3</text>
            </g>

            <text x="90" y="162" fill="#808A9D" fontSize="6.5" fontWeight="bold" textAnchor="middle" className="font-mono">Leaf-1</text>
            <text x="200" y="162" fill="#808A9D" fontSize="6.5" fontWeight="bold" textAnchor="middle" className="font-mono">Leaf-2</text>
            <text x="310" y="162" fill="#808A9D" fontSize="6.5" fontWeight="bold" textAnchor="middle" className="font-mono">Leaf-3</text>
          </>
        ) : (
          <>
            {/* Standard Hub Topology Connections */}
            <line x1="100" y1="80" x2="200" y2="150" stroke="#1A237E" strokeWidth="3.5" strokeDasharray="5,5" />
            <line x1="200" y1="150" x2="300" y2="80" stroke="#1A237E" strokeWidth="3.5" strokeDasharray="5,5" />

            {/* Switch A Node (Center) */}
            <g>
              <rect x="175" y="130" width="50" height="30" rx="4" fill="#0D111A" stroke="#1f2937" strokeWidth="2" />
              <line x1="180" y1="140" x2="220" y2="140" stroke="#808A9D" strokeWidth="1.5" />
              <line x1="180" y1="150" x2="220" y2="150" stroke="#808A9D" strokeWidth="1.5" />
              <text x="200" y="148" fill="#E0E0E0" fontSize="8" fontWeight="black" textAnchor="middle" className="font-mono">SW-A</text>
            </g>

            {/* Router A Node (Left) */}
            <g>
              <circle cx="100" cy="80" r="24" fill="#0D111A" stroke="#00E5FF" strokeWidth="2" />
              <text x="100" y="83" fill="#E0E0E0" fontSize="9" fontWeight="black" textAnchor="middle" className="font-mono">R-A</text>
              <circle cx="100" cy="62" r="4.5" fill="#10b981" />
            </g>

            {/* Router B Node (Right) */}
            <g>
              <circle cx="300" cy="80" r="24" fill="#0D111A" stroke="#1f2937" strokeWidth="2" />
              <text x="300" y="83" fill="#E0E0E0" fontSize="9" fontWeight="black" textAnchor="middle" className="font-mono">R-B</text>
              <circle cx="300" cy="62" r="4.5" fill="#64748b" />
            </g>

            <text x="100" y="125" fill="#808A9D" fontSize="7" fontWeight="bold" textAnchor="middle" className="font-mono">Gi0/0 [192.168.1.1]</text>
            <text x="300" y="125" fill="#808A9D" fontSize="7" fontWeight="bold" textAnchor="middle" className="font-mono">Gi0/1 [Trunk Mode]</text>
          </>
        )}
      </svg>
    </div>
  );
};

export const CreatorStudio: React.FC<CreatorStudioProps> = ({
  onPublish,
  onCancel,
  problemToEdit,
  currentUser,
}) => {
  // Wizard steps: 1 = Metadata, 2 = Code Editor Syntax, 3 = Publish & Finish
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [format, setFormat] = useState<"typing" | "blanks">("typing");

  // Step 1: Metadata inputs
  const [title, setTitle] = useState<string>("");
  const [topic, setTopic] = useState<string>("IP Routing");
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">("Medium");
  const [topologyTemplate, setTopologyTemplate] = useState<string>("Standard Hub");
  const [instructions, setInstructions] = useState<string>("");

  // Validation Error States
  const [titleError, setTitleError] = useState<string>("");

  // Step 2: Typing Format Steps state
  const [typingSteps, setTypingSteps] = useState<Step[]>([
    { stepIndex: 0, prompt: "Router>", expectedInput: "enable" },
    { stepIndex: 1, prompt: "Router#", expectedInput: "configure terminal" },
  ]);

  // Step 2: Blanks Format Lines state
  const [blankLines, setBlankLines] = useState<BlankLine[]>([
    { lineIndex: 0, textBefore: "ip domain-name", blankValue: "forge.net", textAfter: "" },
    { lineIndex: 1, textBefore: "crypto", blankValue: "key", textAfter: "generate rsa modulus 1024" },
  ]);

  useEffect(() => {
    if (problemToEdit) {
      setTitle(problemToEdit.title);
      setTopic(problemToEdit.topic);
      setDifficulty(problemToEdit.difficulty);
      setInstructions(problemToEdit.instructions);
      setFormat(problemToEdit.format);
      setTopologyTemplate(problemToEdit.topology || "Standard Hub");
      if (problemToEdit.format === "typing" && problemToEdit.steps) {
        setTypingSteps(problemToEdit.steps);
      } else if (problemToEdit.format === "blanks" && problemToEdit.blankLines) {
        setBlankLines(problemToEdit.blankLines);
      }
    }
  }, [problemToEdit]);

  // Loading/Publishing Status
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const [isSuccessOverlay, setIsSuccessOverlay] = useState<boolean>(false);

  // Quick topics list
  const topicsList = ["IP Routing", "Device Security", "VLANs & Trunking", "OSPF/EIGRP Routing", "Access Control Lists"];

  // Topology template styles
  const topologyTemplates = [
    { name: "Standard Hub", desc: "1 Switch, 2 Routers (Simple Star)" },
    { name: "Ring Topology", desc: "3 Routers connected in a ring layout" },
    { name: "Access-Core Spine", desc: "Spine-and-leaf hierarchical layout" },
  ];

  // Client-side Validation & Navigation to Step 2
  const handleNextStep = () => {
    playSound("click");
    if (currentStep === 1) {
      if (!title.trim()) {
        setTitleError("Problem Title is required before moving forward.");
        playSound("error");
        return;
      }
      setTitleError("");
      
      // Default instructions if empty
      if (!instructions.trim()) {
        setInstructions(
          format === "typing"
            ? "Enter global configuration mode, establish command protocols, and deploy running syntax parameters."
            : "Fill in the missing command syntax blocks to establish proper running configurations."
        );
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(3);
    }
  };

  const handlePrevStep = () => {
    playSound("click");
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Typing steps configuration helpers
  const handleAddTypingStep = () => {
    playSound("click");
    const lastPrompt = typingSteps[typingSteps.length - 1]?.prompt || "Router>";
    setTypingSteps([
      ...typingSteps,
      {
        stepIndex: typingSteps.length,
        prompt: lastPrompt,
        expectedInput: "",
      },
    ]);
  };

  const handleRemoveTypingStep = (idx: number) => {
    playSound("click");
    if (typingSteps.length <= 1) return;
    const filtered = typingSteps.filter((_, i) => i !== idx);
    // Reindex remaining steps
    const reindexed = filtered.map((st, i) => ({ ...st, stepIndex: i }));
    setTypingSteps(reindexed);
  };

  const handleTypingStepChange = (idx: number, field: keyof Step, value: any) => {
    if (Math.random() > 0.5) playSound("typing");
    const updated = [...typingSteps];
    updated[idx] = { ...updated[idx], [field]: value };
    setTypingSteps(updated);
  };

  // Blanks config helpers
  const handleAddBlankLine = () => {
    playSound("click");
    setBlankLines([
      ...blankLines,
      {
        lineIndex: blankLines.length,
        textBefore: "",
        blankValue: "",
        textAfter: "",
      },
    ]);
  };

  const handleRemoveBlankLine = (idx: number) => {
    playSound("click");
    if (blankLines.length <= 1) return;
    const filtered = blankLines.filter((_, i) => i !== idx);
    const reindexed = filtered.map((line, i) => ({ ...line, lineIndex: i }));
    setBlankLines(reindexed);
  };

  const handleBlankLineChange = (idx: number, field: keyof BlankLine, value: any) => {
    if (Math.random() > 0.5) playSound("typing");
    const updated = [...blankLines];
    updated[idx] = { ...updated[idx], [field]: value };
    setBlankLines(updated);
  };

  // Highlight word tool to convert custom text line to blank structure
  const [quickLineText, setQuickLineText] = useState<string>("ip domain-name forge.net");
  const [quickBlankWord, setQuickBlankWord] = useState<string>("forge.net");

  const handleConvertTextToBlankLine = () => {
    playSound("success");
    if (!quickLineText.trim() || !quickBlankWord.trim()) return;

    const lowerLine = quickLineText.toLowerCase();
    const lowerBlank = quickBlankWord.toLowerCase();

    if (!lowerLine.includes(lowerBlank)) {
      alert("Highlight word must exist in the original command line!");
      return;
    }

    const index = lowerLine.indexOf(lowerBlank);
    const textBefore = quickLineText.substring(0, index).trim();
    const textAfter = quickLineText.substring(index + quickBlankWord.length).trim();

    // Append as a new blank line item
    setBlankLines([
      ...blankLines,
      {
        lineIndex: blankLines.length,
        textBefore,
        blankValue: quickBlankWord,
        textAfter,
      },
    ]);

    // reset fields
    setQuickLineText("");
    setQuickBlankWord("");
  };

  // Publishing simulation
  const handlePublishChallenge = () => {
    playSound("complete");
    setIsPublishing(true);

    // Simulate locking interface, swapping cursor to loading wheel for 1.5s
    setTimeout(() => {
      setIsPublishing(false);
      setIsSuccessOverlay(true);
      playSound("complete");

      // Compile final problem object
      const finalProblem: Problem = {
        id: problemToEdit ? problemToEdit.id : `prob_${Date.now()}`,
        title,
        topic,
        difficulty,
        author: problemToEdit ? problemToEdit.author : (currentUser?.username || "NetCadet_99"),
        format,
        instructions,
        topology: topologyTemplate,
        ...(format === "typing" ? { steps: typingSteps } : { blankLines }),
      };

      // Redirect to main after 2 seconds
      setTimeout(() => {
        onPublish(finalProblem);
      }, 1800);

    }, 1500);
  };

  return (
    <div className={`space-y-6 ${isPublishing ? "cursor-wait" : ""}`}>
      
      {/* Upper header */}
      <div className="flex justify-between items-center bg-[#0D111A] border border-slate-800 rounded-2xl p-5">
        <div>
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest font-mono">
            {problemToEdit ? "CHALLENGE MAINTENANCE" : "PROBLEM WRITER SUITE"}
          </span>
          <h2 className="text-base font-black text-white uppercase tracking-tight">
            {problemToEdit ? `Edit Challenge: ${problemToEdit.title}` : "Creator Studio Workspace"}
          </h2>
        </div>
        <button
          onClick={() => { playSound("click"); onCancel(); }}
          className="px-3.5 py-1.5 rounded-xl bg-[#050508] hover:bg-slate-900 border border-slate-800 text-slate-400 hover:text-white text-xs font-mono font-bold transition-all cursor-pointer"
          disabled={isPublishing}
        >
          {problemToEdit ? "CANCEL EDIT" : "DISCARD DRAFT"}
        </button>
      </div>

      {/* Progress Stepper indicator */}
      <div className="bg-[#0D111A] border border-slate-800 rounded-2xl p-4 flex justify-between items-center font-mono text-xs">
        {[
          { step: 1, label: "METADATA & PARAMETERS" },
          { step: 2, label: "SYNTAX COMMAND EDITOR" },
          { step: 3, label: "PUBLISH & DISTRIBUTE" },
        ].map((item) => {
          const isActive = currentStep === item.step;
          const isDone = currentStep > item.step;

          return (
            <div
              key={item.step}
              className={`flex-1 flex items-center justify-center gap-2 ${
                item.step !== 1 ? "border-l border-slate-850 pl-4" : ""
              }`}
            >
              <span
                className={`w-6 h-6 rounded-lg text-[10px] font-black flex items-center justify-center border transition-all ${
                  isActive
                    ? "bg-[#1A237E]/40 border-[#00E5FF] text-[#00E5FF] shadow-[0_0_8px_rgba(0,229,255,0.2)]"
                    : isDone
                    ? "bg-emerald-950/30 border-emerald-900 text-emerald-400"
                    : "bg-[#050508] border-slate-850 text-slate-600"
                }`}
              >
                {isDone ? "✓" : item.step}
              </span>
              <span className={`hidden sm:inline text-[10px] font-bold ${isActive ? "text-[#E0E0E0]" : "text-slate-600"}`}>
                {item.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* STEP 1: Metadata definitions form */}
      {currentStep === 1 && (
        <div className="bg-[#0D111A] border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6">
          <div className="border-b border-slate-900 pb-3 flex items-center gap-2">
            <Layers className="h-4.5 w-4.5 text-[#00E5FF]" />
            <h3 className="text-sm font-black text-white uppercase tracking-wider font-mono">
              Step 1: Challenge Scope Parameters
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Left side Metadata */}
            <div className="space-y-4">
              
              {/* Problem Title Input */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[#808A9D] uppercase tracking-wider block">
                  Problem Challenge Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    setTitleError("");
                  }}
                  className={`w-full bg-[#020204] border ${
                    titleError ? "border-rose-500" : "border-slate-800 focus:border-[#00E5FF]"
                  } rounded-xl px-4 py-2.5 text-sm text-[#E0E0E0] placeholder-slate-700 focus:outline-none focus:ring-1 focus:ring-[#00E5FF]/10 font-sans font-semibold`}
                  placeholder="e.g. VLAN Routing Setup"
                />
                {titleError && (
                  <p className="text-[10px] text-rose-500 font-bold flex items-center gap-1 mt-1 font-sans">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" /> {titleError}
                  </p>
                )}
              </div>

              {/* Format selection */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[#808A9D] uppercase tracking-wider block">
                  Challenge Interactive Format
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => { playSound("click"); setFormat("typing"); }}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      format === "typing"
                        ? "bg-[#1A237E]/30 border-[#00E5FF]/40 text-white"
                        : "bg-[#020204] border-slate-800 text-slate-500 hover:border-slate-755 hover:text-slate-350"
                    }`}
                  >
                    <div className="font-mono text-xs font-black uppercase text-[#00E5FF] mb-1">
                      Interactive Terminal
                    </div>
                    <p className="text-[10px] leading-relaxed">
                      Users type out active command-line syntax line-by-line against actual prompts.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => { playSound("click"); setFormat("blanks"); }}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      format === "blanks"
                        ? "bg-[#1A237E]/30 border-[#00E5FF]/40 text-white"
                        : "bg-[#020204] border-slate-800 text-slate-500 hover:border-slate-755 hover:text-slate-350"
                    }`}
                  >
                    <div className="font-mono text-xs font-black uppercase text-[#00E5FF] mb-1">
                      Fill-in-the-Blanks
                    </div>
                    <p className="text-[10px] leading-relaxed">
                      Users complete highlighted script parameters inside a mock configuration file.
                    </p>
                  </button>
                </div>
              </div>

              {/* Instructions field */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[#808A9D] uppercase tracking-wider block">
                  Interactive Target Objective Instructions
                </label>
                <textarea
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  className="w-full bg-[#020204] border border-slate-800 focus:border-[#00E5FF] rounded-xl px-4 py-2.5 text-xs text-[#E0E0E0] placeholder-slate-700 h-24 focus:outline-none focus:ring-1 focus:ring-[#00E5FF]/10 font-sans leading-relaxed"
                  placeholder="Provide brief clear instructions e.g. Access interface GigabitEthernet0/1 and enable no shutdown."
                />
              </div>

            </div>

            {/* Right side Metadata options */}
            <div className="space-y-4">
              
              {/* Topic dropdown */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[#808A9D] uppercase tracking-wider block">
                  Configuration Topic Category
                </label>
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full bg-[#020204] border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-[#E0E0E0] focus:outline-none focus:border-[#00E5FF] font-sans font-semibold"
                >
                  {topicsList.map((tp) => (
                    <option key={tp} value={tp} className="bg-[#0D111A]">
                      {tp}
                    </option>
                  ))}
                </select>
              </div>

              {/* Difficulty Tag selectors */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[#808A9D] uppercase tracking-wider block">
                  Target Difficulty Grade
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["Easy", "Medium", "Hard"] as const).map((diff) => {
                    const isSelected = difficulty === diff;
                    let borderCol = "hover:border-slate-700";
                    if (isSelected) {
                      if (diff === "Easy") borderCol = "border-emerald-500 bg-emerald-950/20 text-emerald-400";
                      else if (diff === "Medium") borderCol = "border-amber-500 bg-amber-950/20 text-amber-400";
                      else if (diff === "Hard") borderCol = "border-rose-500 bg-rose-950/20 text-rose-400";
                    }

                    return (
                      <button
                        key={diff}
                        type="button"
                        onClick={() => { playSound("click"); setDifficulty(diff); }}
                        className={`py-2 px-3 text-xs uppercase font-bold rounded-lg border transition-all ${
                          isSelected
                            ? `${borderCol} shadow-sm`
                            : "bg-[#020204] text-slate-500 border-slate-800 hover:text-slate-350"
                        }`}
                      >
                        {diff}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Topology Template Selector */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[#808A9D] uppercase tracking-wider block">
                  Initial SVG Topology Visual Template
                </label>
                <div className="space-y-2">
                  {topologyTemplates.map((template) => {
                    const isSel = topologyTemplate === template.name;
                    return (
                      <div
                        key={template.name}
                        onClick={() => { playSound("click"); setTopologyTemplate(template.name); }}
                        className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                          isSel
                            ? "bg-[#1A237E]/20 border-[#00E5FF]/40 text-white"
                            : "bg-[#020204] border-slate-800 text-slate-400 hover:border-slate-755"
                        }`}
                      >
                        <div>
                          <div className="text-xs font-bold font-mono">{template.name}</div>
                          <p className="text-[10px] text-slate-500">{template.desc}</p>
                        </div>
                        <input
                          type="radio"
                          checked={isSel}
                          onChange={() => {}}
                          className="accent-[#00E5FF] h-4.5 w-4.5"
                        />
                      </div>
                    );
                  })}
                </div>

                {/* Live visual preview card for selected topology */}
                <div className="pt-2">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Selected Topology Preview
                  </span>
                  <TopologyPreview name={topologyTemplate} />
                </div>
              </div>

            </div>

          </div>

          {/* Nav Controls */}
          <div className="flex justify-end pt-4 border-t border-slate-900">
            <button
              onClick={handleNextStep}
              className="bg-[#1A237E] hover:bg-[#1A237E]/80 text-[#00E5FF] border border-[#00E5FF]/40 font-mono font-bold py-3 px-6 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer"
            >
              DEFINE CONFIG SCRIPTS <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Code configuration grid / lines design */}
      {currentStep === 2 && (
        <div className="bg-[#0D111A] border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6">
          <div className="border-b border-slate-900 pb-3 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Terminal className="h-4.5 w-4.5 text-[#00E5FF]" />
              <h3 className="text-sm font-black text-white uppercase tracking-wider font-mono">
                Step 2: Script Compiler Setup
              </h3>
            </div>
            <span className="text-[10px] font-bold uppercase text-amber-500 font-mono bg-amber-950/20 border border-amber-900/40 px-2.5 py-1 rounded">
              Active Format: {format === "typing" ? "CLI Simulator Terminal" : "Fill-in-the-Blanks"}
            </span>
          </div>

          {/* Typing format steps form */}
          {format === "typing" ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-black text-white uppercase tracking-wider font-mono">
                  Config Prompts and Commands Sequence
                </span>
                <button
                  onClick={handleAddTypingStep}
                  className="bg-slate-900 hover:bg-[#00E5FF]/10 text-slate-350 hover:text-[#00E5FF] border border-slate-850 px-3 py-1.5 rounded-xl text-[10px] font-bold font-mono transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" /> ADD INTERACTIVE STEP
                </button>
              </div>

              <div className="space-y-3">
                {typingSteps.map((step, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-4 bg-[#050508] border border-slate-850 rounded-xl font-mono text-xs"
                  >
                    {/* Index */}
                    <span className="text-[10px] font-black text-[#00E5FF] uppercase tracking-wider shrink-0">
                      Step #{idx + 1}
                    </span>

                    {/* Router Prompt */}
                    <div className="flex-1 space-y-1">
                      <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">
                        Router CLI Prompt
                      </div>
                      <input
                        type="text"
                        value={step.prompt}
                        onChange={(e) => handleTypingStepChange(idx, "prompt", e.target.value)}
                        className="w-full bg-[#020204] border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#00E5FF] font-mono"
                        placeholder="e.g. Router(config)#"
                      />
                    </div>

                    {/* Expected Solution Input */}
                    <div className="flex-[2] space-y-1">
                      <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">
                        Expected Command Syntax Entry
                      </div>
                      <input
                        type="text"
                        value={step.expectedInput}
                        onChange={(e) => handleTypingStepChange(idx, "expectedInput", e.target.value)}
                        className="w-full bg-[#020204] border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-emerald-400 focus:outline-none focus:border-[#00E5FF] font-mono"
                        placeholder="e.g. ip address 10.0.0.1 255.0.0.0"
                      />
                    </div>

                    {/* Actions */}
                    <div className="shrink-0 pt-4 sm:pt-0">
                      <button
                        onClick={() => handleRemoveTypingStep(idx)}
                        disabled={typingSteps.length <= 1}
                        className="p-2 bg-[#020204] border border-slate-800 hover:bg-rose-950/40 hover:border-rose-900 text-slate-500 hover:text-rose-400 rounded-lg transition-all disabled:opacity-30 cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            </div>
          ) : (
            
            /* Blanks layout parameters */
            <div className="space-y-5">
              
              {/* Highlight word to blank converter widget */}
              <div className="bg-[#050508] border border-slate-850 rounded-xl p-4 space-y-3">
                <span className="text-[10px] font-black text-[#00E5FF] uppercase tracking-wider font-mono block">
                  Quick Highlight Converter Tool
                </span>
                <p className="text-[10px] text-slate-500">
                  Write down your config statement line and specify the word you want replaced with an interactive blank entry box.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 items-end">
                  <div className="flex-1 space-y-1">
                    <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">
                      Command Line Example
                    </div>
                    <input
                      type="text"
                      value={quickLineText}
                      onChange={(e) => setQuickLineText(e.target.value)}
                      className="w-full bg-[#020204] border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#00E5FF] font-mono"
                      placeholder="e.g. crypto key generate rsa modulus 2048"
                    />
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">
                      Word to Substitute with Blank
                    </div>
                    <input
                      type="text"
                      value={quickBlankWord}
                      onChange={(e) => setQuickBlankWord(e.target.value)}
                      className="w-full bg-[#020204] border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-amber-400 focus:outline-none focus:border-[#00E5FF] font-mono"
                      placeholder="e.g. rsa"
                    />
                  </div>

                  <button
                    onClick={handleConvertTextToBlankLine}
                    className="bg-[#1A237E] hover:bg-[#1A237E]/80 text-[#00E5FF] border border-[#00E5FF]/20 px-4 py-2.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap"
                  >
                    Convert to Blank
                  </button>
                </div>
              </div>

              {/* Blank lines table form lists */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-black text-white uppercase tracking-wider font-mono">
                    Constructed Blanks Script Lines
                  </span>
                  <button
                    onClick={handleAddBlankLine}
                    className="bg-slate-900 hover:bg-[#00E5FF]/10 text-slate-350 hover:text-[#00E5FF] border border-slate-850 px-3 py-1.5 rounded-xl text-[10px] font-bold font-mono transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" /> ADD MANUAL LINE
                  </button>
                </div>

                <div className="space-y-3">
                  {blankLines.map((line, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 p-4 bg-[#050508] border border-slate-850 rounded-xl font-mono text-xs"
                    >
                      <span className="text-[10px] font-black text-[#00E5FF] uppercase tracking-wider shrink-0">
                        Line #{idx + 1}
                      </span>

                      {/* Text before */}
                      <div className="flex-1 space-y-1">
                        <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">
                          Prefix Text
                        </div>
                        <input
                          type="text"
                          value={line.textBefore}
                          onChange={(e) => handleBlankLineChange(idx, "textBefore", e.target.value)}
                          className="w-full bg-[#020204] border border-slate-800 rounded-lg px-2 py-1 text-xs text-white font-mono"
                          placeholder="ip domain-name"
                        />
                      </div>

                      {/* Blank expected value */}
                      <div className="flex-1 space-y-1">
                        <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">
                          Interactive Blank Answer
                        </div>
                        <input
                          type="text"
                          value={line.blankValue}
                          onChange={(e) => handleBlankLineChange(idx, "blankValue", e.target.value)}
                          className="w-full bg-[#020204] border border-slate-800 rounded-lg px-2 py-1 text-xs text-amber-400 font-mono text-center font-bold"
                          placeholder="Expected word"
                        />
                      </div>

                      {/* Text after */}
                      <div className="flex-1 space-y-1">
                        <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">
                          Suffix Text
                        </div>
                        <input
                          type="text"
                          value={line.textAfter}
                          onChange={(e) => handleBlankLineChange(idx, "textAfter", e.target.value)}
                          className="w-full bg-[#020204] border border-slate-800 rounded-lg px-2 py-1 text-xs text-white font-mono"
                          placeholder="Optional trailing parameters"
                        />
                      </div>

                      {/* Action */}
                      <div className="shrink-0 pt-4 sm:pt-0">
                        <button
                          onClick={() => handleRemoveBlankLine(idx)}
                          disabled={blankLines.length <= 1}
                          className="p-1.5 bg-[#020204] border border-slate-800 hover:bg-rose-950/40 hover:border-rose-900 text-slate-500 hover:text-rose-400 rounded-lg transition-all disabled:opacity-30 cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                    </div>
                  ))}
                </div>

              </div>

            </div>
          )}

          {/* Stepper buttons controls */}
          <div className="flex justify-between items-center pt-4 border-t border-slate-900">
            <button
              onClick={handlePrevStep}
              className="px-4 py-2 bg-[#050508] border border-slate-800 text-slate-400 hover:text-white rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" /> MODIFY DRAFT SCOPE
            </button>
            <button
              onClick={handleNextStep}
              className="bg-[#1A237E] hover:bg-[#1A237E]/80 text-[#00E5FF] border border-[#00E5FF]/40 font-mono font-bold py-3 px-6 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer"
            >
              PREVIEW CHALLENGE <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Preview and publishing submission */}
      {currentStep === 3 && (
        <div className="bg-[#0D111A] border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6">
          <div className="border-b border-slate-900 pb-3 flex items-center gap-2">
            <Sparkles className="h-4.5 w-4.5 text-[#00E5FF]" />
            <h3 className="text-sm font-black text-white uppercase tracking-wider font-mono">
              Step 3: Verification & Distribution
            </h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-[#050508] border border-slate-850 rounded-2xl p-5">
            <div className="lg:col-span-2 space-y-4">
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-mono block">Challenge Scope Draft</span>
                <h4 className="text-lg font-black text-white">{title}</h4>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs text-slate-400 border-t border-b border-slate-900 py-3">
                <div>
                  <span className="text-slate-600 block text-[9px] font-bold uppercase">CATEGORY</span>
                  <span className="text-[#00E5FF] font-bold">{topic}</span>
                </div>
                <div>
                  <span className="text-slate-600 block text-[9px] font-bold uppercase">GRADE DIFFICULTY</span>
                  <span className="text-amber-400 font-bold">{difficulty}</span>
                </div>
                <div>
                  <span className="text-slate-600 block text-[9px] font-bold uppercase">FORMAT</span>
                  <span className="text-white font-bold uppercase">{format}</span>
                </div>
                <div>
                  <span className="text-slate-600 block text-[9px] font-bold uppercase">VISUAL STAGE</span>
                  <span className="text-violet-400 font-bold">{topologyTemplate}</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[9px] text-slate-500 font-mono font-bold uppercase">Draft Instructions</span>
                <p className="text-xs text-slate-350 leading-relaxed">{instructions}</p>
              </div>

              {/* Steps Preview list */}
              <div className="space-y-2">
                <span className="text-[9px] text-slate-500 font-mono font-bold uppercase">
                  Compiled Solution Script Summary ({format === "typing" ? typingSteps.length : blankLines.length} lines)
                </span>
                
                <div className="max-h-40 overflow-y-auto bg-[#020204] border border-slate-900 rounded-lg p-3 font-mono text-[11px] text-slate-400 space-y-1 leading-relaxed">
                  {format === "typing" ? (
                    typingSteps.map((st, i) => (
                      <div key={i} className="flex gap-2">
                        <span className="text-slate-600 font-bold">Line {i+1}:</span>
                        <span className="text-[#00E5FF]">{st.prompt}</span>
                        <span className="text-white">{st.expectedInput}</span>
                      </div>
                    ))
                  ) : (
                    blankLines.map((line, i) => (
                      <div key={i} className="flex gap-2">
                        <span className="text-slate-600 font-bold">Line {i+1}:</span>
                        <span>{line.textBefore}</span>
                        <span className="text-amber-400">[{line.blankValue}]</span>
                        <span>{line.textAfter}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Right column: Topology preview */}
            <div className="lg:col-span-1 flex flex-col justify-between space-y-4 lg:border-l lg:border-slate-900 lg:pl-6 pt-4 lg:pt-0">
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-mono block mb-2">Live Topology Visual Preview</span>
                <TopologyPreview name={topologyTemplate} />
              </div>
              <div className="bg-[#020204] border border-slate-900/60 p-3 rounded-xl space-y-1">
                <span className="text-[9px] font-black text-slate-500 uppercase font-mono tracking-widest block">Topology Spec:</span>
                <p className="text-[10px] text-[#00E5FF] font-mono font-bold">{topologyTemplate}</p>
                <p className="text-[9px] text-slate-650 font-semibold leading-normal">
                  {topologyTemplate === "Ring Topology" 
                    ? "Three routers connected in a circular ring format. Perfect for exploring loop mitigation, loopback routing, or dynamic security policies."
                    : topologyTemplate === "Access-Core Spine"
                    ? "Two high-speed core spine routers dynamically routing traffic to three separate leaf switches. Ideal for core trunking, trunk encapsulation, or OSPF dynamic parameters."
                    : "Standard star topology containing a single central high-speed routing switch. Great for general static ip gateway configuration."}
                </p>
              </div>
            </div>
          </div>

          {/* Stepper controls */}
          <div className="flex justify-between items-center pt-4 border-t border-slate-900">
            <button
              onClick={handlePrevStep}
              className="px-4 py-2 bg-[#050508] border border-slate-800 text-slate-400 hover:text-white rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              disabled={isPublishing}
            >
              <ArrowLeft className="h-4 w-4" /> REVISIT SCRIPTS
            </button>
            <button
              onClick={handlePublishChallenge}
              className="bg-[#1A237E] hover:bg-[#1A237E]/80 text-[#00E5FF] border border-[#00E5FF]/40 font-mono font-bold py-3.5 px-8 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(26,35,126,0.3)] cursor-pointer"
              disabled={isPublishing}
            >
              {isPublishing ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-[#00E5FF]" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  COMPILING & SIGNING...
                </>
              ) : (
                <>
                  PUBLISH PROBLEM <CheckCircle className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* PUBLISH SUCCESS ANIMATION OVERLAY */}
      {isSuccessOverlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
          <div className="bg-[#0D111A] border border-[#00E5FF]/40 rounded-3xl max-w-sm w-full p-8 text-center space-y-4 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 rounded-full mx-auto flex items-center justify-center animate-bounce">
              <CheckCircle className="h-8 w-8" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-xl font-black text-white uppercase tracking-tight font-mono">
                Challenge Published!
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                Your custom command syntax parameters have been successfully integrated into the Arena. Preparing redirect sequence...
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
