import React, { useState } from 'react';
import { 
  FileText, 
  Clock, 
  Calendar, 
  ArrowRight, 
  Search, 
  Tag, 
  Sparkles,
  BookOpen
} from 'lucide-react';
import { ARTICLES } from '../data/articles';
import { Article } from '../types';

interface ArticlesSectionProps {
  onSelectArticle: (article: Article) => void;
}

export const ArticlesSection: React.FC<ArticlesSectionProps> = ({
  onSelectArticle
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Dynamically derive all categories from the comprehensive research articles dataset
  const categories = ['All', ...Array.from(new Set(ARTICLES.map(a => a.category)))];

  const filteredArticles = ARTICLES.filter(art => {
    const matchesSearch = art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          art.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          art.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCat = selectedCategory === 'All' || art.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <section id="articles" className="py-20 bg-[#060c16] border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-widest mb-2">
              <FileText className="w-4 h-4" />
              <span>Research & Technical Briefings</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Cybersecurity Articles & Field Analysis
            </h2>
            <p className="mt-2 text-slate-400 text-sm sm:text-base max-w-2xl">
              In-depth research papers, vulnerability deep dives, defensive methodology breakdowns, and hands-on walkthroughs.
            </p>
          </div>

          <div className="mt-4 md:mt-0 w-full md:w-72">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles & topics..."
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

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <div
              key={article.id}
              className="rounded-2xl bg-[#0a1222] border border-slate-800 hover:border-cyan-500/40 p-6 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-xl group"
            >
              <div>
                {/* Meta Header */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 uppercase">
                    {article.category}
                  </span>
                  {article.featured && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/80 text-amber-400 border border-amber-500/30">
                      Featured
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors mb-2 line-clamp-2">
                  {article.title}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed mb-4 line-clamp-3">
                  {article.summary}
                </p>

                {/* Article Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {article.tags.map((tag, idx) => (
                    <span key={idx} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {article.readingTime}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {article.date}
                  </span>
                </div>

                <button
                  onClick={() => onSelectArticle(article)}
                  className="inline-flex items-center gap-1 text-xs font-mono font-semibold text-cyan-400 group-hover:text-cyan-300 hover:underline cursor-pointer"
                >
                  <span>Read</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
