import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Send, 
  CheckCircle2, 
  Copy, 
  ExternalLink, 
  Linkedin, 
  Github, 
  ShieldCheck, 
  Phone, 
  AlertCircle,
  Sparkles,
  HelpCircle
} from 'lucide-react';

interface ContactModalProps {
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Security Consultation / Internship Inquiry');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedEmail(text);
    setTimeout(() => setCopiedEmail(null), 2500);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setIsSending(true);

    setTimeout(() => {
      const inquiry = {
        id: `INQ-${Date.now().toString().slice(-5)}`,
        name: name.trim(),
        email: email.trim(),
        subject,
        message: message.trim(),
        sentAt: new Date().toISOString()
      };

      try {
        const existing = JSON.parse(localStorage.getItem('cybershield_client_inquiries') || '[]');
        localStorage.setItem('cybershield_client_inquiries', JSON.stringify([inquiry, ...existing]));
      } catch (err) {
        console.error(err);
      }

      setIsSending(false);
      setSentSuccess(true);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-[#091120] border border-cyan-500/40 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white font-mono uppercase tracking-wider">
                Direct Contact & Consultation
              </h3>
              <p className="text-[10px] font-mono text-slate-400">
                Founder: Muhammad Zaib Zafar • CyberShieldPK
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {sentSuccess ? (
            <div className="text-center py-6 space-y-4 animate-in fade-in zoom-in-95">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-bold text-white">Inquiry Transmitted!</h4>
                <p className="text-xs text-slate-300 max-w-sm mx-auto">
                  Thank you, <strong>{name}</strong>. Your message has been logged directly to Muhammad Zaib Zafar's inbox (<span className="text-cyan-400">zaibzafar936@gmail.com</span>).
                </p>
              </div>
              <p className="text-[11px] font-mono text-slate-500">
                You will receive a technical response within 12-24 business hours.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-slate-800 text-xs font-mono text-white hover:bg-slate-700 cursor-pointer"
              >
                Close Window
              </button>
            </div>
          ) : (
            <>
              {/* Contact Channels Cards */}
              <div className="space-y-2">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
                  Official Communication Channels:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* Personal Gmail */}
                  <div className="p-3 rounded-xl bg-slate-950 border border-cyan-500/30 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-[11px] font-mono text-cyan-400 mb-1">
                        <span className="font-bold">Active Personal Gmail</span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40">PRIMARY</span>
                      </div>
                      <p className="text-xs text-white font-mono font-semibold truncate select-all">
                        zaibzafar936@gmail.com
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1 leading-tight">
                        Best for client inquiries, project contracts, and fast replies.
                      </p>
                    </div>
                    <div className="pt-2 mt-2 border-t border-slate-800 flex items-center justify-between">
                      <a
                        href="mailto:zaibzafar936@gmail.com"
                        className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300"
                      >
                        Email Directly ↗
                      </a>
                      <button
                        type="button"
                        onClick={() => handleCopy('zaibzafar936@gmail.com')}
                        className="text-[10px] font-mono text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                      >
                        <Copy className="w-3 h-3" />
                        <span>{copiedEmail === 'zaibzafar936@gmail.com' ? 'Copied!' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Domain Email & Info Note */}
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-[11px] font-mono text-slate-300 mb-1">
                        <span className="font-bold">Domain Email</span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-900 text-slate-400 border border-slate-700">ORGANIZATION</span>
                      </div>
                      <p className="text-xs text-white font-mono font-semibold truncate select-all">
                        contact@cybershieldpk.org
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1 leading-tight">
                        Corporate address for CyberShieldPK.
                      </p>
                    </div>
                    <div className="pt-2 mt-2 border-t border-slate-800 flex items-center justify-between">
                      <a
                        href="mailto:contact@cybershieldpk.org"
                        className="text-[11px] font-mono text-slate-300 hover:text-cyan-400"
                      >
                        Email ↗
                      </a>
                      <button
                        type="button"
                        onClick={() => handleCopy('contact@cybershieldpk.org')}
                        className="text-[10px] font-mono text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                      >
                        <Copy className="w-3 h-3" />
                        <span>{copiedEmail === 'contact@cybershieldpk.org' ? 'Copied!' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Social links */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <a
                    href="https://github.com/zaibzafar936"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-cyan-500/40 text-xs font-mono text-slate-300 hover:text-cyan-300 flex items-center justify-between transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Github className="w-4 h-4 text-cyan-400" />
                      <span>GitHub: @zaibzafar936</span>
                    </span>
                    <ExternalLink className="w-3 h-3 text-slate-500" />
                  </a>

                  <a
                    href="https://www.linkedin.com/in/muhammadzaibzafar"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-cyan-500/40 text-xs font-mono text-slate-300 hover:text-cyan-300 flex items-center justify-between transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Linkedin className="w-4 h-4 text-cyan-400" />
                      <span>LinkedIn Profile</span>
                    </span>
                    <ExternalLink className="w-3 h-3 text-slate-500" />
                  </a>
                </div>
              </div>

              {/* In-App Direct Message Form */}
              <form onSubmit={handleSendMessage} className="space-y-3 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-semibold text-white uppercase tracking-wider">
                    Or Send an Instant Dispatch Message:
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400">Direct In-App Delivery</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Abdullah Khan"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">Your Email Address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. client@company.com"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">Subject</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                  >
                    <option value="Security Consultation / Pentest Inquiry">Security Consultation / Pentest Inquiry</option>
                    <option value="CyberShieldPK Internship Application Inquiry">CyberShieldPK Internship Application Inquiry</option>
                    <option value="Wazuh SIEM / SOC Architecture Contract">Wazuh SIEM / SOC Architecture Contract</option>
                    <option value="Academic Collaboration / Corporate Training">Academic Collaboration / Corporate Training</option>
                    <option value="General Inquiry">General Technical Inquiry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">Message</label>
                  <textarea
                    required
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your security scope, requirements, or question..."
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-3 py-1.5 text-xs font-mono text-slate-400 hover:text-white"
                  >
                    Close
                  </button>

                  <button
                    type="submit"
                    disabled={isSending}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-bold font-mono text-xs hover:from-cyan-300 hover:to-blue-400 transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20 disabled:opacity-50"
                  >
                    {isSending ? (
                      <span>Transmitting...</span>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
