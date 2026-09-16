import React, { useState } from 'react';
import { 
  FlaskConical, 
  Terminal as TerminalIcon, 
  CheckCircle2, 
  Clock, 
  Play, 
  Lock, 
  AlertCircle, 
  Cpu, 
  Layers, 
  ArrowRight,
  ExternalLink,
  Globe
} from 'lucide-react';
import { LABS } from '../data/labs';
import { Lab } from '../types';

interface LabsSectionProps {
  onSelectLab: (lab: Lab) => void;
  filterCategory?: string;
}

export const LabsSection: React.FC<LabsSectionProps> = ({
  onSelectLab,
  filterCategory
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(filterCategory || 'All');

  const categories = ['All', 'Web Security', 'SOC', 'Network Security', 'Digital Forensics', 'Cloud Security'];

  const filteredLabs = LABS.filter(l => {
    if (selectedCategory === 'All') return true;
    return l.category === selectedCategory;
  });

  return (
    <section id="labs" className="py-20 bg-[#060c16] border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-widest mb-2">
              <FlaskConical className="w-4 h-4" />
              <span>Interactive Cyber Ranges</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Hands-on Cybersecurity Labs
            </h2>
            <p className="mt-2 text-slate-400 text-sm sm:text-base max-w-xl">
              Practical simulated attack and defense scenarios. Work with real logs, analyze vulnerabilities, verify exploits, and correlate SIEM alerts.
            </p>
          </div>

          {/* Category tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 mt-4 md:mt-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Labs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLabs.map((lab) => {
            const isAvailable = lab.status === 'AVAILABLE';

            return (
              <div
                key={lab.id}
                className="rounded-2xl bg-[#0a1222] border border-slate-800 hover:border-cyan-500/40 p-6 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-xl group"
              >
                <div>
                  {/* Status & Difficulty badges */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                      {lab.category}
                    </span>

                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                      lab.status === 'AVAILABLE'
                        ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/40'
                        : lab.status === 'COMING SOON'
                        ? 'bg-blue-950/80 text-blue-400 border-blue-500/40'
                        : 'bg-amber-950/80 text-amber-400 border-amber-500/40'
                    }`}>
                      {lab.status}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors mb-2">
                    {lab.title}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 mb-4">
                    {lab.objective}
                  </p>

                  {/* Lab Meta */}
                  <div className="space-y-2 py-3 px-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs font-mono text-slate-400">
                    <div className="flex items-center justify-between">
                      <span>Time:</span>
                      <span className="text-slate-200">{lab.estimatedTime}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Difficulty:</span>
                      <span className="text-cyan-300">{lab.difficulty}</span>
                    </div>
                    <div className="flex items-center justify-between truncate">
                      <span>Environment:</span>
                      <span className="text-slate-300 truncate max-w-[150px]">{lab.environment}</span>
                    </div>
                  </div>

                  {/* Skills tags */}
                  <div className="mt-4 flex flex-wrap gap-1">
                    {lab.skills.map((sk, idx) => (
                      <span key={idx} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                        {sk}
                      </span>
                    ))}
                  </div>

                  {/* Connected External Practice Platforms (TryHackMe, PortSwigger, HTB) */}
                  {lab.externalConnections && lab.externalConnections.length > 0 && (
                    <div className="mt-3.5 pt-3 border-t border-slate-800/60">
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1.5">
                        <span className="flex items-center gap-1 text-cyan-400 font-semibold">
                          <Globe className="w-3 h-3" />
                          <span>Connected Ranges:</span>
                        </span>
                        <span className="text-slate-400">{lab.externalConnections.length} Labs Available</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {lab.externalConnections.map((ext, idx) => (
                          <a
                            key={idx}
                            href={ext.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border border-slate-700/80 transition-colors"
                            title={`Practice on ${ext.platform}: ${ext.title}`}
                          >
                            <span>{ext.platform}</span>
                            <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="pt-5 border-t border-slate-800/80 mt-4 flex items-center justify-between gap-3">
                  <button
                    onClick={() => onSelectLab(lab)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-mono text-xs font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 hover:to-sky-300 transition-all cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-slate-950" />
                    <span>{isAvailable ? 'Start Lab' : 'View Details'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
