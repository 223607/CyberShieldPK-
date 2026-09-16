import React, { useState } from 'react';
import { 
  BookOpen, 
  Clock, 
  Award, 
  Play, 
  Lock, 
  CheckCircle2, 
  ChevronRight, 
  Layers, 
  Star,
  Users,
  ShieldCheck,
  Tag
} from 'lucide-react';
import { COURSES } from '../data/courses';
import { Course } from '../types';

interface AcademySectionProps {
  onSelectCourse: (course: Course) => void;
  onUpgrade: (courseId?: string) => void;
  isEnrolled: (courseId: string) => boolean;
}

export const AcademySection: React.FC<AcademySectionProps> = ({
  onSelectCourse,
  onUpgrade,
  isEnrolled
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');

  const categories = ['All', 'Web Application Security', 'SOC & Blue Team', 'Network Security', 'Digital Forensics', 'Cloud Security', 'Ethical Hacking'];

  const filteredCourses = COURSES.filter(course => {
    const matchCat = selectedCategory === 'All' || course.category === selectedCategory;
    const matchDiff = selectedDifficulty === 'All' || course.difficulty === selectedDifficulty;
    return matchCat && matchDiff;
  });

  return (
    <section id="academy" className="py-20 bg-[#070e1c] border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-widest mb-2">
              <BookOpen className="w-4 h-4" />
              <span>Cybersecurity Academy</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Structured Learning Curricula
            </h2>
            <p className="mt-2 text-slate-400 text-sm sm:text-base max-w-2xl">
              Professional, modular cybersecurity courses with real lab exercises, instructor lecture notes, and verifiable course completion certificates.
            </p>
          </div>

          <div className="mt-4 md:mt-0 flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400 hidden sm:inline">Level:</span>
            {(['All', 'Beginner', 'Intermediate', 'Advanced'] as const).map(lvl => (
              <button
                key={lvl}
                onClick={() => setSelectedDifficulty(lvl)}
                className={`px-2.5 py-1 text-xs font-mono rounded transition-colors ${
                  selectedDifficulty === lvl
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 text-xs font-mono rounded-lg whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/60 shadow-[0_0_15px_rgba(0,240,255,0.15)]'
                  : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => {
            const enrolled = isEnrolled(course.id);
            return (
              <div
                key={course.id}
                className="rounded-2xl bg-[#0b1324] border border-slate-800 hover:border-cyan-500/50 flex flex-col justify-between overflow-hidden group transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl hover:shadow-cyan-950/30"
              >
                <div>
                  {/* Card Header & Badges */}
                  <div className="p-5 border-b border-slate-800/80 bg-gradient-to-br from-slate-900/90 to-transparent">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 uppercase">
                        {course.category}
                      </span>
                      {course.badge && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-500/40">
                          {course.badge}
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2 mt-2">
                      {course.title}
                    </h3>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-4">
                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                      {course.description}
                    </p>

                    {/* Metadata Specs */}
                    <div className="grid grid-cols-3 gap-2 py-3 px-3 rounded-xl bg-slate-950/60 border border-slate-800/70 text-center font-mono">
                      <div>
                        <div className="text-[10px] text-slate-400">Duration</div>
                        <div className="text-xs font-semibold text-slate-200">{course.duration}</div>
                      </div>
                      <div className="border-x border-slate-800">
                        <div className="text-[10px] text-slate-400">Modules</div>
                        <div className="text-xs font-semibold text-cyan-300">{course.modulesCount} Chapters</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400">Level</div>
                        <div className="text-xs font-semibold text-emerald-400">{course.difficulty}</div>
                      </div>
                    </div>

                    {/* Free preview preview note */}
                    <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-950/30 px-3 py-1.5 rounded-lg border border-emerald-500/20">
                      <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>First 2 Chapters Free Preview</span>
                    </div>

                    {/* Skills Covered */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-mono text-slate-400 uppercase">Key Skills:</span>
                      <div className="flex flex-wrap gap-1">
                        {course.skills.slice(0, 3).map((sk, idx) => (
                          <span key={idx} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Footer & Action */}
                <div className="p-5 pt-0 border-t border-slate-800/60 mt-4 bg-slate-950/40 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-mono text-slate-400">Curriculum Access</div>
                    <div className="text-sm font-bold text-white font-mono">
                      PKR {course.pricePKR.toLocaleString()} <span className="text-xs text-slate-400 font-normal">(${course.priceUSD})</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectCourse(course)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-mono font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 hover:to-sky-300 transition-all cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-slate-950" />
                    <span>View Course</span>
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
