import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Search, 
  BookOpen, 
  FlaskConical, 
  Wrench, 
  FileText, 
  Briefcase, 
  FolderDown, 
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { COURSES } from '../data/courses';
import { LABS } from '../data/labs';
import { SECURITY_TOOLS } from '../data/tools';
import { ARTICLES } from '../data/articles';
import { PROJECTS } from '../data/projects';
import { DOMAINS } from '../data/domains';
import { RESOURCES } from '../data/resources';
import { Course, Lab, Article, Project, ResourceItem } from '../types';

interface GlobalSearchModalProps {
  onClose: () => void;
  onSelectCourse: (c: Course) => void;
  onSelectLab: (l: Lab) => void;
  onSelectArticle: (a: Article) => void;
  onSelectProject: (p: Project) => void;
  onSelectResource: (r: ResourceItem) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  onClose,
  onSelectCourse,
  onSelectLab,
  onSelectArticle,
  onSelectProject,
  onSelectResource
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const cleanQuery = query.trim().toLowerCase();

  const matchedCourses = cleanQuery ? COURSES.filter(c => 
    c.title.toLowerCase().includes(cleanQuery) || 
    c.description.toLowerCase().includes(cleanQuery) ||
    c.skills.some(s => s.toLowerCase().includes(cleanQuery))
  ) : [];

  const matchedLabs = cleanQuery ? LABS.filter(l => 
    l.title.toLowerCase().includes(cleanQuery) || 
    l.objective.toLowerCase().includes(cleanQuery) ||
    l.skills.some(s => s.toLowerCase().includes(cleanQuery))
  ) : [];

  const matchedTools = cleanQuery ? SECURITY_TOOLS.filter(t => 
    t.name.toLowerCase().includes(cleanQuery) || 
    t.purpose.toLowerCase().includes(cleanQuery)
  ) : [];

  const matchedArticles = cleanQuery ? ARTICLES.filter(a => 
    a.title.toLowerCase().includes(cleanQuery) || 
    a.summary.toLowerCase().includes(cleanQuery) ||
    a.tags.some(t => t.toLowerCase().includes(cleanQuery))
  ) : [];

  const matchedProjects = cleanQuery ? PROJECTS.filter(p => 
    p.title.toLowerCase().includes(cleanQuery) || 
    p.techStack.some(t => t.toLowerCase().includes(cleanQuery))
  ) : [];

  const matchedResources = cleanQuery ? RESOURCES.filter(r => 
    r.title.toLowerCase().includes(cleanQuery) || 
    r.description.toLowerCase().includes(cleanQuery)
  ) : [];

  const totalMatches = matchedCourses.length + matchedLabs.length + matchedTools.length + matchedArticles.length + matchedProjects.length + matchedResources.length;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-start justify-center pt-16 sm:pt-24 px-4 animate-in fade-in duration-150">
      <div className="bg-[#091120] border border-cyan-500/30 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Bar Input */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-cyan-400 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search all courses, labs, tools, articles, cheat sheets, projects..."
            className="w-full bg-transparent border-0 text-sm font-mono text-white focus:outline-none placeholder:text-slate-500"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-500 hover:text-white text-xs font-mono px-2"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          {!query.trim() ? (
            <div className="text-center py-8 text-slate-500 text-xs font-mono space-y-2">
              <p>Type keywords such as "wazuh", "sql injection", "nmap", "blue team", or "forensics".</p>
              <div className="flex justify-center gap-2 pt-2 flex-wrap">
                {['Wazuh', 'SQLi', 'Nmap', 'Memory Forensics', 'OWASP Top 10'].map((suggest) => (
                  <button
                    key={suggest}
                    onClick={() => setQuery(suggest)}
                    className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-slate-400 hover:text-cyan-300 text-[11px]"
                  >
                    {suggest}
                  </button>
                ))}
              </div>
            </div>
          ) : totalMatches === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs font-mono">
              No cybersecurity assets found matching "{query}". Try a different keyword or acronym.
            </div>
          ) : (
            <div className="space-y-4">
              {/* Courses matches */}
              {matchedCourses.length > 0 && (
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-2">
                    <BookOpen className="w-3 h-3 text-cyan-400" />
                    Courses ({matchedCourses.length})
                  </span>
                  <div className="space-y-1.5">
                    {matchedCourses.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => {
                          onClose();
                          onSelectCourse(c);
                        }}
                        className="p-2.5 rounded-xl bg-slate-900/60 hover:bg-cyan-950/40 border border-slate-800 hover:border-cyan-500/30 cursor-pointer flex items-center justify-between"
                      >
                        <div>
                          <span className="text-xs font-bold text-white block">{c.title}</span>
                          <span className="text-[10px] font-mono text-cyan-400">{c.category} • {c.difficulty}</span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Labs matches */}
              {matchedLabs.length > 0 && (
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-2">
                    <FlaskConical className="w-3 h-3 text-emerald-400" />
                    Labs ({matchedLabs.length})
                  </span>
                  <div className="space-y-1.5">
                    {matchedLabs.map((l) => (
                      <div
                        key={l.id}
                        onClick={() => {
                          onClose();
                          onSelectLab(l);
                        }}
                        className="p-2.5 rounded-xl bg-slate-900/60 hover:bg-emerald-950/40 border border-slate-800 hover:border-emerald-500/30 cursor-pointer flex items-center justify-between"
                      >
                        <div>
                          <span className="text-xs font-bold text-white block">{l.title}</span>
                          <span className="text-[10px] font-mono text-emerald-400">{l.category} • {l.difficulty}</span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Articles matches */}
              {matchedArticles.length > 0 && (
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-2">
                    <FileText className="w-3 h-3 text-amber-400" />
                    Articles ({matchedArticles.length})
                  </span>
                  <div className="space-y-1.5">
                    {matchedArticles.map((a) => (
                      <div
                        key={a.id}
                        onClick={() => {
                          onClose();
                          onSelectArticle(a);
                        }}
                        className="p-2.5 rounded-xl bg-slate-900/60 hover:bg-amber-950/30 border border-slate-800 hover:border-amber-500/30 cursor-pointer flex items-center justify-between"
                      >
                        <div>
                          <span className="text-xs font-bold text-white block">{a.title}</span>
                          <span className="text-[10px] font-mono text-slate-400">{a.category} • {a.readingTime}</span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects matches */}
              {matchedProjects.length > 0 && (
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-2">
                    <Briefcase className="w-3 h-3 text-blue-400" />
                    Projects ({matchedProjects.length})
                  </span>
                  <div className="space-y-1.5">
                    {matchedProjects.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => {
                          onClose();
                          onSelectProject(p);
                        }}
                        className="p-2.5 rounded-xl bg-slate-900/60 hover:bg-blue-950/30 border border-slate-800 hover:border-blue-500/30 cursor-pointer flex items-center justify-between"
                      >
                        <div>
                          <span className="text-xs font-bold text-white block">{p.title}</span>
                          <span className="text-[10px] font-mono text-blue-300">{p.category}</span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Resources matches */}
              {matchedResources.length > 0 && (
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-2">
                    <FolderDown className="w-3 h-3 text-teal-400" />
                    Resources ({matchedResources.length})
                  </span>
                  <div className="space-y-1.5">
                    {matchedResources.map((r) => (
                      <div
                        key={r.id}
                        onClick={() => {
                          onClose();
                          onSelectResource(r);
                        }}
                        className="p-2.5 rounded-xl bg-slate-900/60 hover:bg-teal-950/30 border border-slate-800 hover:border-teal-500/30 cursor-pointer flex items-center justify-between"
                      >
                        <div>
                          <span className="text-xs font-bold text-white block">{r.title}</span>
                          <span className="text-[10px] font-mono text-teal-300">{r.category}</span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
