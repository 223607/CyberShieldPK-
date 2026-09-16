import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Users, 
  ArrowRight, 
  Send,
  Lock,
  FileCheck2
} from 'lucide-react';
import { SECURITY_SERVICES } from '../data/services';
import { SecurityService } from '../types';

interface ServicesSectionProps {
  onRequestQuote: (service: SecurityService) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  onRequestQuote
}) => {
  return (
    <section id="services" className="py-20 bg-[#060c16] border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-widest mb-2">
            <ShieldCheck className="w-4 h-4" />
            <span>Consulting & Offensive Audits</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Professional Cybersecurity Services
          </h2>
          <p className="mt-2 text-slate-400 text-sm sm:text-base">
            Expert security assessments, WordPress vulnerability eradication, Wazuh SIEM deployment, and tailored enterprise security consulting adhering strictly to international standards.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SECURITY_SERVICES.map((service) => (
            <div
              key={service.id}
              className="rounded-2xl bg-[#0a1222] border border-slate-800 hover:border-cyan-500/40 p-6 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-xl group"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-105 transition-transform">
                  <ShieldCheck className="w-5 h-5" />
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors mb-2">
                  {service.title}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  {service.tagline}
                </p>

                {/* Key Deliverables */}
                <div className="space-y-1.5 mb-4">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Core Deliverables:</span>
                  <div className="space-y-1">
                    {service.deliverables.slice(0, 3).map((item, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Turnaround Badge */}
                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 text-[11px] font-mono text-slate-400 flex items-center justify-between">
                  <span>Turnaround:</span>
                  <span className="text-emerald-400">{service.estimatedTurnaround}</span>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-5 border-t border-slate-800/80 mt-4">
                <button
                  onClick={() => onRequestQuote(service)}
                  className="w-full py-2.5 px-4 rounded-xl font-mono text-xs font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 hover:to-sky-300 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Request Proposal / Quote</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
