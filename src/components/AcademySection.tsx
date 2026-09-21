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
  completedLessonIds?: string[];
  onGetCertificate?: (course: Course) => void;
  currentUser?: { name: string; email: string; role?: string } | null;
  onOpenAuth?: () => void;
}

export const AcademySection: React.FC<AcademySectionProps> = ({
  onSelectCourse,
  onUpgrade,
  isEnrolled,
  completedLessonIds = [],
  onGetCertificate,
  currentUser = null,
  onOpenAuth
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [statusTab, setStatusTab] = useState<'all' | 'enrolled' | 'completed'>('all');

  const categories = ['All', 'Web Application Security', 'SOC & Blue Team', 'Network Security', 'Digital Forensics', 'Cloud Security', 'Ethical Hacking'];

  const enrolledCount = COURSES.filter(c => isEnrolled(c.id)).length;
  const completedCount = COURSES.filter(c => {
    const allLessons = c.chapters.flatMap(ch => ch.lessons);
    return allLessons.length > 0 && allLessons.every(l => completedLessonIds.includes(l.id));
  }).length;

  const filteredCourses = COURSES.filter(course => {
    const matchCat = selectedCategory === 'All' || course.category === selectedCategory;
    const matchDiff = selectedDifficulty === 'All' || course.difficulty === selectedDifficulty;
    
    // Only apply library status filtering if user is logged in
    if (!currentUser) {
      return matchCat && matchDiff;
    }
    if (statusTab === 'enrolled') {
      return matchCat && matchDiff && isEnrolled(course.id);
    }
    if (statusTab === 'completed') {
      const allLessons = course.chapters.flatMap(ch => ch.lessons);
      const isComplete = allLessons.length > 0 && allLessons.every(l => completedLessonIds.includes(l.id));
      return matchCat && matchDiff && isComplete;
    }
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

        {/* Quick Pathway Guide for All Skill Levels */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div 
            onClick={() => setSelectedDifficulty('Beginner')}
            className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
              selectedDifficulty === 'Beginner'
                ? 'bg-emerald-950/40 border-emerald-500/60 shadow-md'
                : 'bg-slate-900/40 border-slate-800 hover:border-emerald-500/30'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-xs font-mono font-bold text-emerald-300">Level 1: New / Beginners</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Zero-prior experience required. Learn fundamentals, essential Linux commands, and foundational web security.
            </p>
          </div>

          <div 
            onClick={() => setSelectedDifficulty('Intermediate')}
            className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
              selectedDifficulty === 'Intermediate'
                ? 'bg-cyan-950/40 border-cyan-500/60 shadow-md'
                : 'bg-slate-900/40 border-slate-800 hover:border-cyan-500/30'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span className="text-xs font-mono font-bold text-cyan-300">Level 2: Intermediate</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              For tech students & junior analysts. Master SOC alert triage, SIEM query hunting, and packet capture analysis.
            </p>
          </div>

          <div 
            onClick={() => setSelectedDifficulty('Advanced')}
            className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
              selectedDifficulty === 'Advanced'
                ? 'bg-purple-950/40 border-purple-500/60 shadow-md'
                : 'bg-slate-900/40 border-slate-800 hover:border-purple-500/30'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-purple-400" />
              <span className="text-xs font-mono font-bold text-purple-300">Level 3: Advanced / Experts</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              For seasoned practitioners. Deep memory forensics, red-team exploitation chains, and enterprise cloud hardening.
            </p>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 text-xs font-mono rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/60 shadow-[0_0_15px_rgba(0,240,255,0.15)]'
                  : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* State Banner: For Logged-out / New Users vs Enrolled User Tabs */}
        {!currentUser ? (
          <div className="mb-8 p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-[#0a1528] to-slate-900 border border-cyan-500/30 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex-shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-mono font-bold text-white flex items-center gap-2 flex-wrap">
                  <span className="tracking-wide">FULL PAID CURRICULA & PROFESSIONAL CERTIFICATIONS</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Free Chapter Previews Active
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Every course includes complete hands-on browser labs, downloadable attack playbooks, and accredited certificates. Preview introductory modules for free, or click <strong className="text-amber-300">Pay & Unlock</strong> to register.
                </p>
              </div>
            </div>
            {onOpenAuth && (
              <button
                onClick={onOpenAuth}
                className="px-3.5 py-2 rounded-xl text-xs font-mono font-semibold text-cyan-300 bg-cyan-950/60 border border-cyan-500/40 hover:bg-cyan-900/60 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5"
              >
                <span>Existing Student? Sign In</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ) : (
          <div className="mb-8 flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-400">Library Filter:</span>
              <button
                onClick={() => setStatusTab('all')}
                className={`px-3 py-1 text-xs font-mono rounded-lg transition-all cursor-pointer ${
                  statusTab === 'all'
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                All Courses ({COURSES.length})
              </button>
              <button
                onClick={() => setStatusTab('enrolled')}
                className={`px-3 py-1 text-xs font-mono rounded-lg transition-all cursor-pointer ${
                  statusTab === 'enrolled'
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-md'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                Enrolled ({enrolledCount})
              </button>
              <button
                onClick={() => setStatusTab('completed')}
                className={`px-3 py-1 text-xs font-mono rounded-lg transition-all cursor-pointer ${
                  statusTab === 'completed'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                Completed ({completedCount})
              </button>
            </div>
            <div className="text-xs font-mono text-slate-400">
              Student: <span className="text-cyan-300 font-semibold">{currentUser.name}</span>
            </div>
          </div>
        )}

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => {
            const enrolled = currentUser ? isEnrolled(course.id) : false;
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
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-500/40">
                        {course.badge || 'PRO CERTIFICATION'}
                      </span>
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

                    {/* Free preview note */}
                    <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-950/30 px-3 py-1.5 rounded-lg border border-emerald-500/20">
                      <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>First 2 Chapters Free Preview Available</span>
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
                <div className="p-5 pt-0 border-t border-slate-800/60 mt-4 bg-slate-950/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="text-[10px] font-mono text-slate-400">
                      {currentUser && enrolled ? 'Enrollment Status' : 'Tuition & Lifetime License'}
                    </div>
                    {currentUser && enrolled ? (
                      <div className="text-xs font-bold text-emerald-400 font-mono flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Enrolled & Unlocked
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-sm font-bold text-white font-mono">
                          PKR {course.pricePKR.toLocaleString()}
                        </span>
                        <span className="text-xs text-slate-400 font-normal font-mono">
                          (${course.priceUSD})
                        </span>
                        <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
                          Paid
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                    {/* Certificate: ONLY if user is logged in, enrolled, and finished all lessons */}
                    {currentUser && enrolled && (() => {
                      const allCourseLessons = course.chapters.flatMap(ch => ch.lessons);
                      const isCompleted = allCourseLessons.length > 0 && allCourseLessons.every(l => completedLessonIds.includes(l.id));
                      if (isCompleted && onGetCertificate) {
                        return (
                          <button
                            onClick={() => onGetCertificate(course)}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-300 hover:to-yellow-200 transition-all cursor-pointer shadow-md"
                            title="Course Complete! Claim and view your certificate"
                          >
                            <Award className="w-3.5 h-3.5" />
                            <span>Certificate 🎓</span>
                          </button>
                        );
                      }
                      return null;
                    })()}

                    {/* Pay & Unlock: shown for anyone not enrolled */}
                    {(!currentUser || !enrolled) && (
                      <button
                        onClick={() => onUpgrade(course.id)}
                        className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-mono font-bold text-amber-950 bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-300 hover:to-yellow-200 transition-all cursor-pointer shadow-sm hover:shadow-amber-500/20"
                        title="Enroll in full course via secure payment checkout"
                      >
                        <Lock className="w-3 h-3" />
                        <span>Pay & Unlock</span>
                      </button>
                    )}

                    {/* Play / Preview: Continue Course if enrolled, Free Preview otherwise */}
                    <button
                      onClick={() => onSelectCourse(course)}
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer ${
                        currentUser && enrolled
                          ? 'text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 hover:to-sky-300'
                          : 'text-cyan-300 bg-cyan-950/60 border border-cyan-500/40 hover:bg-cyan-900/60'
                      }`}
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{currentUser && enrolled ? 'Continue Course' : 'Free Preview'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
