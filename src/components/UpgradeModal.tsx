import React, { useState } from 'react';
import { X, ShieldCheck, AlertCircle, Lock, BookOpen, ArrowRight } from 'lucide-react';
import { COURSES } from '../data/courses';

interface UpgradeModalProps {
  courseId?: string | null;
  onClose: () => void;
  onEnrollSuccess: (courseId: string) => void;
}

/**
 * Safe checkout placeholder.
 * Do not collect payment credentials or unlock a paid course until a real,
 * server-verified payment provider and entitlement backend are configured.
 */
export const UpgradeModal: React.FC<UpgradeModalProps> = ({ courseId, onClose }) => {
  const [selectedCourseId, setSelectedCourseId] = useState(courseId || COURSES[0]?.id || '');
  const selectedCourse = COURSES.find((course) => course.id === selectedCourseId) || COURSES[0];

  if (!selectedCourse) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-[#091120] border border-cyan-500/40 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        <div className="px-6 py-4 bg-slate-950/95 border-b border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white font-mono uppercase tracking-wider">
                Course Enrollment
              </h3>
              <p className="text-[10px] font-mono text-slate-400">CyberShieldPK Academy</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close enrollment dialog"
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-5">
          <div className="space-y-1.5">
            <label htmlFor="course-selection" className="text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider">
              Select course
            </label>
            <select
              id="course-selection"
              value={selectedCourse.id}
              onChange={(event) => setSelectedCourseId(event.target.value)}
              className="w-full px-3 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500"
            >
              {COURSES.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title} — PKR {course.pricePKR.toLocaleString()}
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-xl bg-slate-950 border border-slate-800 p-4 space-y-3">
            <div className="flex items-start gap-3">
              <BookOpen className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-white">{selectedCourse.title}</h4>
                <p className="text-xs text-slate-400 mt-1">{selectedCourse.category} · {selectedCourse.duration}</p>
              </div>
            </div>
            <div className="border-t border-slate-800 pt-3 flex items-center justify-between">
              <span className="text-xs text-slate-400">Listed course price</span>
              <span className="text-lg font-bold font-mono text-cyan-300">PKR {selectedCourse.pricePKR.toLocaleString()}</span>
            </div>
          </div>

          <div role="status" className="rounded-xl border border-amber-500/40 bg-amber-950/30 p-4 space-y-2">
            <div className="flex items-center gap-2 text-amber-300 font-semibold text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              Payments are not available yet
            </div>
            <p className="text-xs leading-5 text-slate-300">
              The live payment gateway and server-side payment verification have not been configured.
              No payment has been taken and enrollment has not been changed.
            </p>
            <p className="text-xs leading-5 text-amber-200/90">
              For your safety, do not enter card numbers, CVC, CNIC, mobile-wallet PINs, or bank transaction details here.
            </p>
          </div>

          <button
            type="button"
            disabled
            className="w-full py-3 px-4 rounded-xl font-mono text-xs font-bold bg-slate-800 text-slate-500 cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Lock className="w-4 h-4" />
            <span>Checkout unavailable until secure payment setup</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl font-mono text-xs font-semibold text-cyan-300 hover:text-white border border-slate-700 hover:border-cyan-500/50 transition-colors flex items-center justify-center gap-2"
          >
            <span>Return to Academy</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
