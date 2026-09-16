import React, { useState } from 'react';
import { 
  X, 
  Briefcase, 
  Github, 
  ExternalLink, 
  CheckCircle2, 
  Copy, 
  Check, 
  Layers, 
  Code2, 
  Terminal,
  Cpu
} from 'lucide-react';
import { Project } from '../types';

interface ProjectDetailModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  onClose
}) => {
  if (!project) return null;

  const [copiedCode, setCopiedCode] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-[#091120] border border-cyan-500/30 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30 uppercase">
              {project.category}
            </span>
            <h3 className="text-base sm:text-lg font-bold text-white truncate max-w-lg">
              {project.title}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1">
          {/* Overview */}
          <div>
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block mb-1">
              Project Specification
            </span>
            <h2 className="text-2xl font-bold text-white mb-2">
              {project.title}
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              {project.tagline}
            </p>
          </div>

          {/* Architecture & Objective */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-xs font-mono font-semibold text-cyan-300 flex items-center gap-1.5">
                <Cpu className="w-4 h-4" />
                <span>Architecture</span>
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {project.architecture}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-xs font-mono font-semibold text-emerald-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Objective</span>
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {project.objective}
              </p>
            </div>
          </div>

          {/* Tech Stack */}
          <div>
            <span className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Technologies & Infrastructure Stack:
            </span>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech, idx) => (
                <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-cyan-300">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Deliverables Checklist */}
          <div className="space-y-2">
            <span className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider block">
              Deliverables & Verification Criteria:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {project.deliverables.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Setup / CLI Commands */}
          {project.codeSnippet && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-cyan-400" />
                  Deployment & Execution Guide:
                </span>
                <button
                  onClick={() => handleCopy(project.codeSnippet || '')}
                  className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Copied' : 'Copy Commands'}</span>
                </button>
              </div>
              <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-cyan-300 overflow-x-auto">
                <code>{project.codeSnippet}</code>
              </pre>
            </div>
          )}

          {/* Footer Action */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">
              Difficulty: <span className="text-white font-bold">{project.difficulty}</span>
            </span>

            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-colors"
              >
                <Github className="w-4 h-4" />
                <span>View GitHub Repository</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
