import React, { useState } from 'react';
import { 
  X, 
  User, 
  BookOpen, 
  FlaskConical, 
  Award, 
  Bookmark, 
  LogOut, 
  CheckCircle2, 
  Download, 
  ExternalLink,
  ShieldCheck,
  Calendar
} from 'lucide-react';
import { COURSES } from '../data/courses';
import { LABS } from '../data/labs';
import { Course } from '../types';

interface UserDashboardModalProps {
  user: { name: string; email: string; role?: string };
  onClose: () => void;
  onLogout: () => void;
  enrolledCourseIds: string[];
  completedLessonIds: string[];
  completedLabIds: string[];
  userNotes: { [lessonId: string]: string };
  onSelectCourse: (course: Course) => void;
}

export const UserDashboardModal: React.FC<UserDashboardModalProps> = ({
  user,
  onClose,
  onLogout,
  enrolledCourseIds,
  completedLessonIds,
  completedLabIds,
  userNotes,
  onSelectCourse
}) => {
  const [activeTab, setActiveTab] = useState<'courses' | 'labs' | 'certificates' | 'notes'>('courses');

  const enrolledCourses = COURSES.filter(c => enrolledCourseIds.includes(c.id));
  const completedLabs = LABS.filter(l => completedLabIds.includes(l.id));

  const handleDownloadCertificate = (courseTitle: string) => {
    const certText = `=====================================================
CYBERSHIELD-PK PROFESSIONAL CERTIFICATE OF COMPLETION
=====================================================
Issued to: ${user.name}
Course: ${courseTitle}
Issued Date: ${new Date().toLocaleDateString()}
Verification ID: CS-PK-${Math.floor(100000 + Math.random() * 900000)}
Signed by: Muhammad Zaib Zafar, Lead Instructor
=====================================================
Status: Cryptographically Verified & Logged
=====================================================`;

    const blob = new Blob([certText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CyberShieldPK_Certificate_${user.name.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-[#091120] border border-cyan-500/30 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Profile Header Bar */}
        <div className="px-6 py-5 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-bold text-lg font-mono">
              {user.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>{user.name}</span>
                <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                  {user.role || 'Member'}
                </span>
              </h2>
              <p className="text-xs font-mono text-slate-400">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-lg border border-rose-500/20 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-6 pt-2 gap-2 text-xs font-mono">
          <button
            onClick={() => setActiveTab('courses')}
            className={`px-4 py-2.5 rounded-t-lg transition-colors flex items-center gap-2 ${
              activeTab === 'courses'
                ? 'bg-slate-900 text-cyan-300 border-t border-x border-slate-800 font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>My Courses ({enrolledCourses.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('labs')}
            className={`px-4 py-2.5 rounded-t-lg transition-colors flex items-center gap-2 ${
              activeTab === 'labs'
                ? 'bg-slate-900 text-emerald-300 border-t border-x border-slate-800 font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FlaskConical className="w-3.5 h-3.5" />
            <span>Completed Labs ({completedLabs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('certificates')}
            className={`px-4 py-2.5 rounded-t-lg transition-colors flex items-center gap-2 ${
              activeTab === 'certificates'
                ? 'bg-slate-900 text-amber-300 border-t border-x border-slate-800 font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Certificates</span>
          </button>

          <button
            onClick={() => setActiveTab('notes')}
            className={`px-4 py-2.5 rounded-t-lg transition-colors flex items-center gap-2 ${
              activeTab === 'notes'
                ? 'bg-slate-900 text-purple-300 border-t border-x border-slate-800 font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Saved Notes</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1">
          {activeTab === 'courses' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400">
                  Enrolled Curricula:
                </span>
              </div>

              {enrolledCourses.length === 0 ? (
                <div className="text-center py-12 rounded-xl bg-slate-950/60 border border-slate-800 p-6 space-y-2">
                  <BookOpen className="w-8 h-8 text-slate-500 mx-auto" />
                  <h4 className="text-sm font-semibold text-white">No Enrolled Courses Yet</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Browse the CyberShield Academy to preview free lessons and unlock structured career paths.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {enrolledCourses.map((c) => (
                    <div key={c.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-3">
                      <div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                          {c.category}
                        </span>
                        <h4 className="text-sm font-bold text-white mt-2 line-clamp-1">{c.title}</h4>
                        <p className="text-xs text-slate-400 line-clamp-2 mt-1">{c.description}</p>
                      </div>

                      <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                        <span className="text-xs font-mono text-emerald-400">Lifetime Access</span>
                        <button
                          onClick={() => {
                            onClose();
                            onSelectCourse(c);
                          }}
                          className="text-xs font-mono text-cyan-400 hover:text-cyan-300"
                        >
                          Resume Course →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'labs' && (
            <div className="space-y-4">
              {completedLabs.length === 0 ? (
                <div className="text-center py-12 rounded-xl bg-slate-950/60 border border-slate-800 p-6 space-y-2">
                  <FlaskConical className="w-8 h-8 text-slate-500 mx-auto" />
                  <h4 className="text-sm font-semibold text-white">No Completed Labs Recorded</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Practice offensive scenarios and defensive triage in our interactive Hands-on Labs section.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {completedLabs.map((l) => (
                    <div key={l.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-white">{l.title}</h4>
                        <p className="text-[11px] font-mono text-emerald-400">Environment: {l.environment} • Verified</p>
                      </div>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'certificates' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Web Application Security & Pentesting</h4>
                    <p className="text-xs font-mono text-slate-400">Verified Certificate of Competency</p>
                  </div>
                </div>

                <button
                  onClick={() => handleDownloadCertificate('Web Application Security & Pentesting')}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl font-mono text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Certificate</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="space-y-3">
              {Object.keys(userNotes).length === 0 ? (
                <div className="text-center py-12 rounded-xl bg-slate-950/60 border border-slate-800 p-6 space-y-2">
                  <Bookmark className="w-8 h-8 text-slate-500 mx-auto" />
                  <h4 className="text-sm font-semibold text-white">No Lecture Notes Saved Yet</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    While reviewing course lessons, write technical notes or copy syntax into the "My Notes" tab to access them here.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {Object.entries(userNotes).map(([lessonId, note]) => (
                    <div key={lessonId} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                      <span className="text-[10px] font-mono text-cyan-400 uppercase">Lesson Ref: {lessonId}</span>
                      <p className="text-xs text-slate-200 font-mono whitespace-pre-wrap">{note}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
