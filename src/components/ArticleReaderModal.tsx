import React from 'react';
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
  Bookmark
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
  if (!article) return null;

  // Find next and previous articles
  const currentIndex = ARTICLES.findIndex(a => a.id === article.id);
  const prevArticle = currentIndex > 0 ? ARTICLES[currentIndex - 1] : null;
  const nextArticle = currentIndex < ARTICLES.length - 1 ? ARTICLES[currentIndex + 1] : null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-[#091120] border border-cyan-500/30 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top bar */}
        <div className="px-6 py-4 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30 uppercase">
              {article.category}
            </span>
            <span className="text-xs font-mono text-slate-400 hidden sm:inline">
              Reading Time: {article.readingTime}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Article Content Body */}
        <div className="p-6 sm:p-10 overflow-y-auto space-y-8 flex-1">
          {/* Header */}
          <div className="space-y-4 border-b border-slate-800 pb-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5 text-cyan-400">
                <User className="w-3.5 h-3.5" />
                {article.author}
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

          {/* Body formatted */}
          <div className="prose prose-invert max-w-none text-slate-200 text-sm sm:text-base leading-relaxed space-y-4 font-sans">
            {article.content.split('\n\n').map((paragraph, idx) => {
              if (paragraph.startsWith('### ')) {
                return (
                  <h3 key={idx} className="text-lg font-bold text-cyan-300 pt-4 pb-1 border-b border-slate-800">
                    {paragraph.replace('### ', '')}
                  </h3>
                );
              }
              if (paragraph.startsWith('## ')) {
                return (
                  <h2 key={idx} className="text-xl font-extrabold text-white pt-6 pb-2 border-b border-slate-800">
                    {paragraph.replace('## ', '')}
                  </h2>
                );
              }
              if (paragraph.startsWith('```')) {
                const code = paragraph.replace(/```[a-z]*\n?/g, '').replace(/```/g, '');
                return (
                  <pre key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-cyan-300 overflow-x-auto my-4">
                    <code>{code}</code>
                  </pre>
                );
              }
              if (paragraph.startsWith('- ')) {
                const items = paragraph.split('\n');
                return (
                  <ul key={idx} className="list-disc pl-5 space-y-1 text-slate-300 my-2">
                    {items.map((item, itemIdx) => (
                      <li key={itemIdx}>{item.replace('- ', '')}</li>
                    ))}
                  </ul>
                );
              }
              return (
                <p key={idx} className="leading-relaxed">
                  {paragraph}
                </p>
              );
            })}
          </div>

          {/* Author footer */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-4 mt-8">
            <div className="w-10 h-10 rounded-full bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-bold">
              CS
            </div>
            <div>
              <span className="text-xs font-mono text-slate-400">Written by</span>
              <h4 className="text-sm font-bold text-white">{article.author}</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                CyberShieldPK Research & Offensive Threat Operations Unit
              </p>
            </div>
          </div>

          {/* Next / Previous Navigation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-slate-800">
            {prevArticle ? (
              <button
                onClick={() => onSelectArticle(prevArticle)}
                className="p-4 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-left transition-all group"
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
                className="p-4 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-right transition-all group"
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
