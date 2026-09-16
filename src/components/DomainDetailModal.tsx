import React from 'react';
import { 
  X, 
  Layers, 
  CheckCircle2, 
  ArrowRight, 
  Play, 
  Terminal, 
  BookOpen, 
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { DomainInfo, Course, Lab } from '../types';
import { COURSES } from '../data/courses';
import { LABS } from '../data/labs';

interface DomainDetailModalProps {
  domain: DomainInfo | null;
  onClose: () => void;
  onSelectCourse: (course: Course) => void;
  onSelectLab: (lab: Lab) => void;
}

export const DomainDetailModal: React.FC<DomainDetailModalProps> = ({
  domain,
  onClose,
  onSelectCourse,
  onSelectLab
}) => {
  if (!domain) return null;

  // Find related courses and labs
  const relatedCourses = COURSES.filter(c => 
    c.category.toLowerCase().includes(domain.title.toLowerCase()) ||
    domain.title.toLowerCase().includes(c.category.toLowerCase()) ||
    c.skills.some(s => domain.skillsCovered.includes(s))
  );

  const relatedLabs = LABS.filter(l => 
    l.category.toLowerCase().includes(domain.title.toLowerCase()) ||
    domain.title.toLowerCase().includes(l.category.toLowerCase()) ||
    l.skills.some(s => domain.skillsCovered.includes(s))
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-[#091120] border border-cyan-500/30 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span 
              className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm"
              style={{ backgroundColor: `${domain.accentColor}20`, color: domain.accentColor }}
            >
              <ShieldAlert className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                {domain.title}
              </h3>
              <span className="text-[10px] font-mono text-slate-400">
                Difficulty: {domain.difficulty} • Track ID: {domain.id}
              </span>
            </div>
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
          {/* Deep Description */}
          <div>
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block mb-1">
              Domain Overview
            </span>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
              {domain.fullDescription}
            </p>
          </div>

          {/* Skills Grid */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <span className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider block">
              Core Technical Competencies in this Domain:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {domain.skillsCovered.map((skill, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-slate-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                  <span>{skill}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Related Courses in this Track */}
          {relatedCourses.length > 0 && (
            <div className="space-y-3">
              <span className="text-xs font-mono font-semibold text-white uppercase tracking-wider block">
                Recommended Academy Courses ({relatedCourses.length})
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {relatedCourses.map((c) => (
                  <div key={c.id} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between space-y-2">
                    <div>
                      <h4 className="text-xs font-bold text-white line-clamp-1">{c.title}</h4>
                      <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">{c.description}</p>
                    </div>
                    <button
                      onClick={() => {
                        onClose();
                        onSelectCourse(c);
                      }}
                      className="self-start text-[11px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                    >
                      <span>Open Course Curriculum</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Related Hands-on Labs */}
          {relatedLabs.length > 0 && (
            <div className="space-y-3">
              <span className="text-xs font-mono font-semibold text-white uppercase tracking-wider block">
                Related Hands-on Cyber Labs ({relatedLabs.length})
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {relatedLabs.map((l) => (
                  <div key={l.id} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between space-y-2">
                    <div>
                      <h4 className="text-xs font-bold text-white line-clamp-1">{l.title}</h4>
                      <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">{l.objective}</p>
                    </div>
                    <button
                      onClick={() => {
                        onClose();
                        onSelectLab(l);
                      }}
                      className="self-start text-[11px] font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                    >
                      <span>Launch Lab Console</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
