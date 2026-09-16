import React, { useState } from 'react';
import { 
  X, 
  Terminal as TerminalIcon, 
  CheckCircle2, 
  Clock, 
  Play, 
  Lightbulb, 
  AlertTriangle, 
  Send, 
  Sparkles, 
  Layers, 
  HelpCircle,
  ExternalLink,
  Globe,
  Compass,
  ShieldCheck
} from 'lucide-react';
import { Lab } from '../types';

interface LabDetailModalProps {
  lab: Lab | null;
  onClose: () => void;
  isCompleted: boolean;
  onCompleteLab: (labId: string) => void;
}

export const LabDetailModal: React.FC<LabDetailModalProps> = ({
  lab,
  onClose,
  isCompleted,
  onCompleteLab
}) => {
  if (!lab) return null;

  const [activeTaskIndex, setActiveTaskIndex] = useState(0);
  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>([]);
  const [showHintFor, setShowHintFor] = useState<string | null>(null);
  const [cliInput, setCliInput] = useState('');
  const [terminalHistory, setTerminalHistory] = useState<string[]>([
    `[+] Initializing CyberShield Sandbox Environment: ${lab.environment}`,
    `[+] Target scenario loaded: ${lab.title}`,
    `Type 'help' or execute scenario command to proceed.`
  ]);

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cliInput.trim()) return;

    const cmd = cliInput.trim();
    const newHistory = [...terminalHistory, `${lab.terminalPrompt || 'analyst@lab:~$'} ${cmd}`];

    if (cmd.toLowerCase() === 'help') {
      newHistory.push("Available simulation commands: run, scan, exploit, verify, dump, clear");
    } else if (cmd.toLowerCase() === 'clear') {
      setTerminalHistory([`[+] Terminal cleared.`]);
      setCliInput('');
      return;
    } else if (cmd.toLowerCase().includes('exploit') || cmd.toLowerCase().includes('verify') || cmd.toLowerCase().includes('run')) {
      newHistory.push(lab.sampleLogOrOutput || "[+] Command executed successfully. Flag recorded.");
      if (lab.tasks[activeTaskIndex]) {
        const taskId = lab.tasks[activeTaskIndex].id;
        if (!completedTaskIds.includes(taskId)) {
          setCompletedTaskIds([...completedTaskIds, taskId]);
        }
      }
    } else {
      newHistory.push(`[SIM] Executed: ${cmd}`);
      newHistory.push(`[+] Response received from virtualized endpoint.`);
    }

    setTerminalHistory(newHistory);
    setCliInput('');
  };

  const handleToggleTask = (taskId: string) => {
    if (completedTaskIds.includes(taskId)) {
      setCompletedTaskIds(completedTaskIds.filter(id => id !== taskId));
    } else {
      setCompletedTaskIds([...completedTaskIds, taskId]);
    }
  };

  const allTasksDone = lab.tasks.every(t => completedTaskIds.includes(t.id));

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-[#0a1222] border border-cyan-500/30 w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
              {lab.category}
            </span>
            <h3 className="text-base sm:text-lg font-bold text-white truncate max-w-lg">
              {lab.title}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-hidden">
          {/* Left: Lab Briefing & Task Checklist */}
          <div className="lg:col-span-6 p-6 overflow-y-auto space-y-6 border-b lg:border-b-0 lg:border-r border-slate-800">
            <div>
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block mb-1">
                Scenario Briefing
              </span>
              <p className="text-sm text-slate-200 leading-relaxed">
                {lab.scenario}
              </p>
            </div>

            {/* Objective & Meta */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs font-mono">
              <div className="text-slate-400">
                <strong className="text-white">Objective:</strong> {lab.objective}
              </div>
              <div className="flex items-center gap-4 text-slate-400 pt-1 border-t border-slate-800/80">
                <span>Time: <span className="text-slate-200">{lab.estimatedTime}</span></span>
                <span>Level: <span className="text-cyan-400">{lab.difficulty}</span></span>
                <span>Status: <span className="text-emerald-400">{lab.status}</span></span>
              </div>
            </div>

            {/* Task Checklist */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-semibold text-white uppercase tracking-wider">
                  Lab Step Milestones
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  {completedTaskIds.length}/{lab.tasks.length} Completed
                </span>
              </div>

              <div className="space-y-2">
                {lab.tasks.map((task, idx) => {
                  const done = completedTaskIds.includes(task.id);
                  return (
                    <div 
                      key={task.id}
                      className={`p-3 rounded-xl border transition-all ${
                        done 
                          ? 'bg-emerald-950/20 border-emerald-500/40' 
                          : 'bg-slate-900/60 border-slate-800'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => handleToggleTask(task.id)}
                          className="mt-0.5 text-slate-400 hover:text-emerald-400 transition-colors flex-shrink-0"
                        >
                          {done ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border border-slate-600" />
                          )}
                        </button>
                        <div className="flex-1 text-xs">
                          <p className={`font-medium ${done ? 'text-slate-300 line-through' : 'text-slate-100'}`}>
                            {idx + 1}. {task.instruction}
                          </p>

                          {task.hint && (
                            <div className="mt-2">
                              {showHintFor === task.id ? (
                                <div className="text-[11px] font-mono text-amber-300 bg-amber-950/40 p-2 rounded border border-amber-500/30">
                                  Hint: {task.hint}
                                </div>
                              ) : (
                                <button
                                  onClick={() => setShowHintFor(task.id)}
                                  className="text-[10px] font-mono text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1"
                                >
                                  <Lightbulb className="w-3 h-3" />
                                  <span>Reveal Hint</span>
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Connected External Cyber Ranges (TryHackMe, PortSwigger, HTB) */}
            {lab.externalConnections && lab.externalConnections.length > 0 && (
              <div className="p-4 rounded-xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-cyan-500/20 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-mono font-semibold text-white">
                      Connected Live Cyber Ranges
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                    Real Practice
                  </span>
                </div>
                
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Practice here in the CyberShield sandbox or launch the corresponding room on external training platforms:
                </p>

                <div className="space-y-2">
                  {lab.externalConnections.map((ext, idx) => (
                    <a
                      key={idx}
                      href={ext.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-cyan-500/40 hover:bg-slate-900/90 transition-all group"
                    >
                      <div className="flex items-center gap-2.5 truncate mr-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-cyan-300 border border-cyan-500/30 flex-shrink-0">
                          {ext.platform}
                        </span>
                        <span className="text-xs text-slate-200 group-hover:text-white truncate font-medium">
                          {ext.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] font-mono text-cyan-400 group-hover:translate-x-0.5 transition-transform flex-shrink-0">
                        <span>Launch</span>
                        <ExternalLink className="w-3 h-3" />
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Complete Lab Action */}
            <div className="pt-2">
              <button
                onClick={() => onCompleteLab(lab.id)}
                className={`w-full py-2.5 px-4 rounded-xl font-mono text-xs font-semibold transition-all ${
                  isCompleted
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                    : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950'
                }`}
              >
                {isCompleted ? '✓ Lab Completed in Profile' : 'Mark Lab as Completed'}
              </button>
            </div>
          </div>

          {/* Right: Simulated Interactive Terminal Console */}
          <div className="lg:col-span-6 bg-slate-950 flex flex-col overflow-hidden">
            {/* Terminal Title */}
            <div className="px-4 py-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-xs font-mono text-slate-300">
              <span className="flex items-center gap-2">
                <TerminalIcon className="w-4 h-4 text-cyan-400" />
                <span>{lab.terminalPrompt || 'analyst@cybershield-box:~$'}</span>
              </span>
              <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                SANDBOX ACTIVE
              </span>
            </div>

            {/* Screen */}
            <div className="flex-1 p-4 font-mono text-xs text-slate-200 overflow-y-auto space-y-2 min-h-[300px]">
              {terminalHistory.map((line, idx) => (
                <div key={idx} className="leading-relaxed whitespace-pre-wrap">
                  {line}
                </div>
              ))}
            </div>

            {/* Terminal CLI Input */}
            <form onSubmit={handleCommandSubmit} className="p-3 bg-slate-900/60 border-t border-slate-800 flex items-center gap-2">
              <span className="text-cyan-400 font-mono text-xs">$</span>
              <input
                type="text"
                value={cliInput}
                onChange={(e) => setCliInput(e.target.value)}
                placeholder="Type command (e.g. 'run', 'exploit', 'verify', 'clear')..."
                className="flex-1 bg-transparent border-0 text-xs font-mono text-white focus:outline-none placeholder:text-slate-600"
              />
              <button
                type="submit"
                className="px-3 py-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded text-xs font-mono font-semibold"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
