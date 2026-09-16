import React, { useState } from 'react';
import { 
  X, 
  Send, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle,
  Building,
  Mail,
  User,
  Globe,
  Clock
} from 'lucide-react';
import { SecurityService } from '../types';

interface ServiceQuoteModalProps {
  service: SecurityService | null;
  onClose: () => void;
}

export const ServiceQuoteModal: React.FC<ServiceQuoteModalProps> = ({
  service,
  onClose
}) => {
  if (!service) return null;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    targetScope: '',
    timeline: 'Immediate (within 1-2 weeks)',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMsg('Please complete all required fields (Name, Work Email, and Scope Description).');
      return;
    }

    // Save lead to local storage for persistence
    try {
      const existingLeads = JSON.parse(localStorage.getItem('cybershield_service_leads') || '[]');
      existingLeads.push({
        ...formData,
        serviceId: service.id,
        serviceTitle: service.title,
        submittedAt: new Date().toISOString()
      });
      localStorage.setItem('cybershield_service_leads', JSON.stringify(existingLeads));
    } catch (err) {
      console.error(err);
    }

    setSubmitted(true);
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-[#091120] border border-cyan-500/30 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white">
              Consultation & Scope Assessment Request
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body or Success confirmation */}
        <div className="p-6 sm:p-8">
          {submitted ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-white">Proposal Request Received</h4>
              <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                Thank you, <strong className="text-cyan-300">{formData.name}</strong>. Our cybersecurity consulting unit has received your inquiry for <strong>{service.title}</strong>. We will review your scope and provide a Non-Disclosure Agreement (NDA) and formal quotation within 24 hours.
              </p>
              <div className="pt-4">
                <button
                  onClick={onClose}
                  className="px-6 py-2 rounded-xl text-xs font-mono font-semibold bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-colors"
                >
                  Return to CyberShieldPK
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block mb-0.5">
                  Selected Service:
                </span>
                <span className="font-bold text-white text-sm">{service.title}</span>
                <p className="text-[11px] text-slate-400 mt-1">{service.suitableFor}</p>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Asim Khan"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Work Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@company.com"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Organization / Company
                  </label>
                  <input
                    type="text"
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    placeholder="Organization Name"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Target Domain / Scope URL
                  </label>
                  <input
                    type="text"
                    value={formData.targetScope}
                    onChange={(e) => setFormData({ ...formData, targetScope: e.target.value })}
                    placeholder="https://app.yourdomain.com"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Preferred Project Timeline
                </label>
                <select
                  value={formData.timeline}
                  onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="Immediate (within 1-2 weeks)">Immediate (within 1-2 weeks)</option>
                  <option value="Next 30 Days">Next 30 Days</option>
                  <option value="Quarterly Security Compliance Audit">Quarterly Security Compliance Audit</option>
                  <option value="Emergency Incident Response (Active Attack)">Emergency Incident Response (Active Attack)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Scope Description & Testing Constraints *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Describe your architecture (e.g., number of endpoints, web technologies, specific regulatory compliance mandates, black-box or white-box requirements)..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-mono text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-mono text-xs font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 hover:to-sky-300 transition-all cursor-pointer"
                >
                  Submit Proposal Request
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
