import React, { useState } from 'react';
import { 
  X, 
  Clock, 
  Calendar, 
  User, 
  Tag, 
  Share2, 
  ArrowLeft, 
  ArrowRight, 
  BookOpen, 
  CheckCircle2,
  Bookmark,
  Copy,
  Terminal,
  Sparkles,
  ListOrdered
} from 'lucide-react';
import { Article } from '../types';
import { ARTICLES } from '../data/articles';

interface ArticleReaderModalProps {
  article: Article | null;
  onClose: () => void;
  onSelectArticle: (article: Article) => void;
}

export const ArticleReaderModal: React.FC<ArticleReaderModalProps> = ({
  article,
  onClose,
  onSelectArticle
}) => {
  const [copiedSnippetId, setCopiedSnippetId] = useState<string | null>(null);

  if (!article) return null;

  // Find next and previous articles
  const currentIndex = ARTICLES.findIndex(a => a.id === article.id);
  const prevArticle = currentIndex > 0 ? ARTICLES[currentIndex - 1] : null;
  const nextArticle = currentIndex < ARTICLES.length - 1 ? ARTICLES[currentIndex + 1] : null;

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedSnippetId(id);
    setTimeout(() => setCopiedSnippetId(null), 2000);
  };

  const authorName = typeof article.author === 'object' ? article.author.name : article.author;
  const authorTitle = typeof article.author === 'object' ? article.author.title : 'CyberShield Researcher';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-[#091120] border border-cyan-500/30 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Header Bar */}
        <div className="px-6 py-4 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30 uppercase">
              {article.category}
            </span>
            <span className="text-xs font-mono text-slate-400 hidden sm:inline flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              {article.readingTime}
            </span>
            {article.difficulty && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                {article.difficulty}
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Article Content Body */}
        <div className="p-6 sm:p-10 overflow-y-auto space-y-8 flex-1">
          
          {/* Main Title & Metadata */}
          <div className="space-y-4 border-b border-slate-800 pb-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
              {article.title}
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed font-sans">
              {article.summary}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400 pt-1">
              <span className="flex items-center gap-1.5 text-cyan-400 font-semibold">
                <User className="w-3.5 h-3.5" />
                {authorName}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {article.date}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {article.readingTime}
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-2">
              {article.tags.map((tag, idx) => (
                <span key={idx} className="text-xs font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Table of Contents (if present) */}
          {article.tableOfContents && article.tableOfContents.length > 0 && (
            <div className="p-4 rounded-xl bg-slate-950/80 border border-cyan-500/20 space-y-2.5">
              <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-semibold flex items-center gap-2">
                <ListOrdered className="w-4 h-4" />
                <span>Executive Table of Contents</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                {article.tableOfContents.map((toc, idx) => (
                  <div key={idx} className="text-slate-300 flex items-center gap-2">
                    <span className="text-cyan-500">›</span>
                    <span className="hover:text-cyan-300 transition-colors">{toc.title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Content Sections */}
          <div className="space-y-8 font-sans">
            {article.contentSections && article.contentSections.length > 0 ? (
              article.contentSections.map((section, sIdx) => (
                <div key={section.id || sIdx} className="space-y-4">
                  <h2 className="text-lg sm:text-xl font-bold text-white border-b border-slate-800/80 pb-2 flex items-center gap-2">
                    <span className="text-cyan-400 font-mono text-sm">§</span>
                    <span>{section.heading}</span>
                  </h2>

                  {section.paragraphs.map((p, pIdx) => (
                    <p key={pIdx} className="text-sm sm:text-base text-slate-200 leading-relaxed font-sans">
                      {p}
                    </p>
                  ))}

                  {/* Code Snippet Box */}
                  {section.codeSnippet && (
                    <div className="rounded-xl bg-slate-950 border border-slate-800 overflow-hidden font-mono text-xs my-4 shadow-md">
                      <div className="px-4 py-2 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                        <span className="flex items-center gap-2 text-cyan-300 font-semibold">
                          <Terminal className="w-3.5 h-3.5" />
                          {section.codeSnippet.title || `${section.codeSnippet.language.toUpperCase()} Command & Syntax`}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyCode(section.id, section.codeSnippet!.code)}
                          className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
                        >
                          <Copy className="w-3 h-3" />
                          <span>{copiedSnippetId === section.id ? 'Copied!' : 'Copy'}</span>
                        </button>
                      </div>
                      <pre className="p-4 overflow-x-auto text-cyan-300 leading-relaxed">
                        <code>{section.codeSnippet.code}</code>
                      </pre>
                    </div>
                  )}

                  {/* Key Takeaway Banner */}
                  {section.keyTakeaway && (
                    <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30 flex items-start gap-3 my-3">
                      <Sparkles className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                      <div className="text-xs text-cyan-200 font-sans leading-relaxed">
                        <strong className="text-cyan-300 font-mono uppercase tracking-wider block mb-0.5">Key Defensive Takeaway:</strong>
                        {section.keyTakeaway}
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : null}
          </div>

          {/* Author Footer */}
          <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-4 mt-8">
            <div className="w-12 h-12 rounded-full bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-bold text-base flex-shrink-0">
              ZZ
            </div>
            <div>
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block">Written & Researched by</span>
              <h4 className="text-sm sm:text-base font-bold text-white">{authorName}</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                {authorTitle} • CyberShield Pakistan Threat Operations Unit
              </p>
            </div>
          </div>

          {/* Next / Previous Navigation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-slate-800">
            {prevArticle ? (
              <button
                onClick={() => onSelectArticle(prevArticle)}
                className="p-4 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-left transition-all group cursor-pointer"
              >
                <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1 mb-1">
                  <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                  Previous Article
                </span>
                <span className="text-xs font-semibold text-white group-hover:text-cyan-300 line-clamp-1">
                  {prevArticle.title}
                </span>
              </button>
            ) : <div />}

            {nextArticle ? (
              <button
                onClick={() => onSelectArticle(nextArticle)}
                className="p-4 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-right transition-all group cursor-pointer"
              >
                <span className="text-[10px] font-mono text-slate-400 flex items-center justify-end gap-1 mb-1">
                  Next Article
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </span>
                <span className="text-xs font-semibold text-white group-hover:text-cyan-300 line-clamp-1">
                  {nextArticle.title}
                </span>
              </button>
            ) : <div />}
          </div>
        </div>
      </div>
    </div>
  );
};
