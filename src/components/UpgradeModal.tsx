import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  Lock, 
  Sparkles, 
  Award, 
  FileCheck2, 
  ArrowRight 
} from 'lucide-react';
import { COURSES } from '../data/courses';

interface UpgradeModalProps {
  courseId?: string | null;
  onClose: () => void;
  onEnrollSuccess: (courseId: string) => void;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({
  courseId,
  onClose,
  onEnrollSuccess
}) => {
  const selectedCourse = courseId ? COURSES.find(c => c.id === courseId) : COURSES[0];
  const [confirmed, setConfirmed] = useState(false);

  const handleEnroll = () => {
    if (selectedCourse) {
      onEnrollSuccess(selectedCourse.id);
      setConfirmed(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-[#091120] border border-cyan-500/30 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
              Curriculum Enrollment & Pro Access
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {confirmed ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-white">Enrollment Active</h4>
              <p className="text-xs text-slate-300">
                All premium chapter lectures, solutions, and lab walkthroughs are now unlocked for your account.
              </p>
            </div>
          ) : (
            <>
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block mb-1">
                  Selected Program:
                </span>
                <h4 className="text-lg font-bold text-white">
                  {selectedCourse?.title}
                </h4>
                <p className="text-xs text-slate-300 mt-1">
                  {selectedCourse?.description}
                </p>
              </div>

              {/* Pricing breakdown */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between font-mono">
                <div>
                  <span className="text-[11px] text-slate-400 block">Tuition / Access Fee:</span>
                  <div className="text-xl font-extrabold text-white">
                    PKR {selectedCourse?.pricePKR.toLocaleString()}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400">USD Equivalent:</span>
                  <div className="text-base font-bold text-cyan-400">${selectedCourse?.priceUSD}</div>
                </div>
              </div>

              {/* What is included */}
              <div className="space-y-2">
                <span className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider block">
                  Included in this Enrollment:
                </span>
                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                    <span>Access to all {selectedCourse?.chapters.length} chapters & video lectures</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                    <span>Downloadable lab setup scripts & vulnerability PoC files</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                    <span>Direct mentorship Q&A access with Muhammad Zaib Zafar</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                    <span>Verifiable Certificate of Cybersecurity Competency</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <button
                  onClick={handleEnroll}
                  className="w-full py-3 px-4 rounded-xl font-mono text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400 hover:from-cyan-300 hover:to-blue-300 transition-all cursor-pointer shadow-[0_0_20px_rgba(0,240,255,0.3)]"
                >
                  Confirm Free Student Enrollment / Unlock
                </button>
                <p className="text-[11px] font-mono text-slate-500 text-center mt-2">
                  Instant activation • No payment card required in learning mode
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
