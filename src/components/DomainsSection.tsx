import React, { useState } from 'react';
import { 
  Terminal, 
  Globe, 
  Network, 
  ShieldAlert, 
  FileSearch, 
  Bug, 
  Cloud, 
  KeyRound, 
  Radar, 
  ChevronRight, 
  Sparkles,
  Layers,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { DOMAINS } from '../data/domains';
import { DomainInfo } from '../types';

interface DomainsSectionProps {
  onSelectDomain: (domainId: string) => void;
  onExploreLabsForDomain: (category: string) => void;
}

export const DomainsSection: React.FC<DomainsSectionProps> = ({
  onSelectDomain,
  onExploreLabsForDomain
}) => {
  const [activeFilter, setActiveFilter] = useState<'All' | 'Beginner' | 'Intermediate' | 'Advanced'>('All');

  const filteredDomains = activeFilter === 'All' 
    ? DOMAINS 
    : DOMAINS.filter(d => d.difficulty === activeFilter || d.difficulty === 'All Levels');

  const getDomainIcon = (iconName: string) => {
    switch (iconName) {
      case 'Terminal': return <Terminal className="w-6 h-6" />;
      case 'Globe': return <Globe className="w-6 h-6" />;
      case 'Network': return <Network className="w-6 h-6" />;
      case 'ShieldAlert': return <ShieldAlert className="w-6 h-6" />;
      case 'FileSearch': return <FileSearch className="w-6 h-6" />;
      case 'Bug': return <Bug className="w-6 h-6" />;
      case 'Cloud': return <Cloud className="w-6 h-6" />;
      case 'KeyRound': return <KeyRound className="w-6 h-6" />;
      case 'Radar': return <Radar className="w-6 h-6" />;
      default: return <Terminal className="w-6 h-6" />;
    }
  };

  return (
    <section id="domains" className="py-20 border-b border-slate-800/80 bg-[#060c16]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-widest mb-2">
              <Layers className="w-4 h-4" />
              <span>Specialized Disciplines</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Cybersecurity Domains
            </h2>
            <p className="mt-2 text-slate-400 text-sm sm:text-base max-w-xl">
              Each cybersecurity discipline requires dedicated methodologies, specialized toolchains, and distinct defense models.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 mt-4 md:mt-0 overflow-x-auto pb-1">
            {(['All', 'Beginner', 'Intermediate', 'Advanced'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-all ${
                  activeFilter === filter
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Domains Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDomains.map((domain) => (
            <div
              key={domain.id}
              className="rounded-2xl bg-[#0a1222] border border-slate-800/90 hover:border-cyan-500/40 p-6 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] group"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                    style={{ 
                      backgroundColor: `${domain.accentColor}15`, 
                      color: domain.accentColor,
                      border: `1px solid ${domain.accentColor}40`
                    }}
                  >
                    {getDomainIcon(domain.icon)}
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-900 text-slate-300 border border-slate-700/60">
                    {domain.difficulty}
                  </span>
                </div>

                {/* Title & Description */}
                <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors mb-2">
                  {domain.title}
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-4">
                  {domain.shortDescription}
                </p>

                {/* Skills tags */}
                <div className="space-y-2 mb-6">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                    Core Competencies:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {domain.skillsCovered.slice(0, 3).map((skill, idx) => (
                      <span 
                        key={idx}
                        className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-900/90 text-slate-300 border border-slate-800"
                      >
                        {skill}
                      </span>
                    ))}
                    {domain.skillsCovered.length > 3 && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 text-cyan-400/80">
                        +{domain.skillsCovered.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <button
                  onClick={() => onSelectDomain(domain.id)}
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-cyan-400 group-hover:text-cyan-300 hover:underline cursor-pointer"
                >
                  <span>Explore Domain</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => onExploreLabsForDomain(domain.title)}
                  className="text-[11px] font-mono text-slate-400 hover:text-slate-200"
                >
                  Labs →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
