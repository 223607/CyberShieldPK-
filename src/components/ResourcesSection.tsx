import React, { useState } from 'react';
import { 
  FolderDown, 
  Search, 
  FileText, 
  Copy, 
  Check, 
  BookOpen, 
  Layers, 
  ExternalLink,
  ChevronRight,
  Eye
} from 'lucide-react';
import { RESOURCES } from '../data/resources';
import { ResourceItem } from '../types';

interface ResourcesSectionProps {
  onSelectResource: (resource: ResourceItem) => void;
}

export const ResourcesSection: React.FC<ResourcesSectionProps> = ({
  onSelectResource
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = ['All', 'Cheat Sheets', 'Security Checklists', 'Learning Roadmaps', 'Cybersecurity Books', 'Practice Platforms'];

  const filteredResources = RESOURCES.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || r.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleCopySnippet = (id: string, text?: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section id="resources" className="py-20 bg-[#070e1c] border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-widest mb-2">
              <FolderDown className="w-4 h-4" />
              <span>Reference Materials & Blueprints</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Cybersecurity Resources & Cheat Sheets
            </h2>
            <p className="mt-2 text-slate-400 text-sm sm:text-base max-w-2xl">
              Curated checklists, CLI syntax cheat sheets, penetration testing methodologies, and defensive incident response roadmaps.
            </p>
          </div>

          <div className="mt-4 md:mt-0 w-full md:w-72">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search cheat sheets & checklists..."
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

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((res) => (
            <div
              key={res.id}
              className="rounded-2xl bg-[#0a1222] border border-slate-800 hover:border-cyan-500/40 p-6 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-xl group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 uppercase">
                    {res.category}
                  </span>
                  {res.badge && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-500/30">
                      {res.badge}
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors mb-2">
                  {res.title}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  {res.description}
                </p>

                {/* Preview Box */}
                {res.internalDataPreview && (
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 font-mono text-[11px] text-slate-400 overflow-x-auto max-h-28 mb-4 whitespace-pre-wrap select-text">
                    {res.internalDataPreview}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <button
                  onClick={() => onSelectResource(res)}
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-cyan-400 group-hover:text-cyan-300 hover:underline cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Full Resource</span>
                </button>

                {res.internalDataPreview && (
                  <button
                    onClick={() => handleCopySnippet(res.id, res.internalDataPreview)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    title="Copy resource text"
                  >
                    {copiedId === res.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
