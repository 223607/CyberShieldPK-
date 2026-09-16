import React, { useState } from 'react';
import { 
  Wrench, 
  Search, 
  ExternalLink, 
  Terminal, 
  Copy, 
  Check, 
  BookOpen, 
  ChevronRight,
  Filter
} from 'lucide-react';
import { SECURITY_TOOLS } from '../data/tools';
import { SecurityTool } from '../types';

export const ToolsSection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = ['All', 'Web Application Security', 'Reconnaissance & Port Scanning', 'SOC & Blue Team', 'Network Security & Traffic Analysis', 'Exploitation & Post-Exploitation'];

  const filteredTools = SECURITY_TOOLS.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || t.category.includes(selectedCategory);
    return matchesSearch && matchesCat;
  });

  const handleCopySyntax = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section id="tools" className="py-20 bg-[#070e1c] border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-widest mb-2">
              <Wrench className="w-4 h-4" />
              <span>Offensive & Defensive Toolchain</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Essential Security Tools Directory
            </h2>
            <p className="mt-2 text-slate-400 text-sm sm:text-base max-w-2xl">
              Curated reference directory of industry-standard cybersecurity utilities for penetration testing, SIEM operations, traffic analysis, and vulnerability management.
            </p>
          </div>

          {/* Search Input */}
          <div className="mt-4 md:mt-0 w-full md:w-72">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tools, commands..."
                className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 focus:border-cyan-500 rounded-xl text-xs font-mono text-white placeholder:text-slate-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-mono rounded-lg whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/60'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool) => (
            <div
              key={tool.id}
              className="rounded-2xl bg-[#0a1222] border border-slate-800 hover:border-cyan-500/40 p-6 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-xl group"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 uppercase">
                      {tool.category}
                    </span>
                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors mt-2">
                      {tool.name}
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                    {tool.difficulty}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mb-4 line-clamp-3">
                  {tool.purpose}
                </p>

                {/* Command Snippet & Copy */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                    <span>Quick Syntax:</span>
                    <button
                      onClick={() => handleCopySyntax(tool.id, tool.quickCheatSyntax)}
                      className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                      title="Copy command"
                    >
                      {copiedId === tool.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/90 font-mono text-xs text-cyan-300 overflow-x-auto">
                    <code>{tool.quickCheatSyntax}</code>
                  </div>
                </div>

                {/* Key Flags list */}
                <div className="space-y-1 mb-4">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Key Flags / Features:</span>
                  <div className="space-y-1">
                    {tool.keyFlagExplanations.slice(0, 2).map((kf, idx) => (
                      <div key={idx} className="text-[11px] font-mono text-slate-300 flex items-start gap-1.5">
                        <span className="text-cyan-400 font-bold">{kf.flag}:</span>
                        <span className="text-slate-400 line-clamp-1">{kf.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-400">
                  Platform: {tool.platform}
                </span>

                <a
                  href={tool.officialWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-mono text-cyan-400 hover:text-cyan-300 hover:underline"
                >
                  <span>Official Docs</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
