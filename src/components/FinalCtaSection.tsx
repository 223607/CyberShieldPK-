import React from 'react';
import { Shield, Play, Terminal, ArrowRight, Sparkles, Radio } from 'lucide-react';

interface FinalCtaSectionProps {
  onStartLearning: () => void;
  onExploreLabs: () => void;
  onOpenSoc: () => void;
}

export const FinalCtaSection: React.FC<FinalCtaSectionProps> = ({
  onStartLearning,
  onExploreLabs,
  onOpenSoc
}) => {
  return (
    <section className="py-20 relative overflow-hidden bg-gradient-to-b from-[#060c16] via-[#091326] to-[#040810] border-b border-slate-800/80">
      <div className="absolute inset-0 cyber-grid-bg opacity-30 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 blur-3xl pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-xs font-mono text-cyan-300 shadow-sm">
          <Shield className="w-3.5 h-3.5" />
          <span>CYBERSHIELD DEFENSE NETWORK</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight max-w-3xl mx-auto">
          Begin Your Cybersecurity Defense Journey Today
        </h2>

        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Master real technical skills through hands-on labs, structured courses, production SIEM telemetry, and professional guidance.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <button
            onClick={onStartLearning}
            className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-mono text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400 hover:from-cyan-300 hover:to-blue-300 shadow-[0_0_25px_rgba(0,240,255,0.4)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-slate-950 text-slate-950" />
            <span>Start Free Academy Tracks</span>
          </button>

          <button
            onClick={onExploreLabs}
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-mono text-xs font-bold text-cyan-300 bg-slate-900/90 hover:bg-slate-800 border border-cyan-500/40 hover:border-cyan-400 transition-all cursor-pointer"
          >
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span>Launch Simulated Labs</span>
          </button>

          <button
            onClick={onOpenSoc}
            className="flex items-center gap-2 px-5 py-3.5 rounded-xl font-mono text-xs font-bold text-emerald-400 bg-emerald-950/30 hover:bg-emerald-950/60 border border-emerald-500/40 transition-all cursor-pointer"
          >
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>Open SOC Simulator</span>
          </button>
        </div>
      </div>
    </section>
  );
};
