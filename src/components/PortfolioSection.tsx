import React, { useState } from 'react';
import { 
  User, 
  ShieldCheck, 
  Award, 
  Terminal, 
  Mail, 
  Linkedin, 
  Github, 
  ExternalLink, 
  Send, 
  CheckCircle2, 
  Code2, 
  Cpu, 
  Check 
} from 'lucide-react';

interface PortfolioSectionProps {
  onContactSubmit?: (data: { name: string; email: string; message: string }) => void;
}

export const PortfolioSection: React.FC<PortfolioSectionProps> = ({
  onContactSubmit
}) => {
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [sentMessage, setSentMessage] = useState(false);

  const handleSubmitContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactEmail.trim() || !contactMessage.trim()) return;

    try {
      const messages = JSON.parse(localStorage.getItem('cybershield_direct_messages') || '[]');
      messages.push({
        name: contactName,
        email: contactEmail,
        message: contactMessage,
        date: new Date().toISOString()
      });
      localStorage.setItem('cybershield_direct_messages', JSON.stringify(messages));
    } catch (err) {
      console.error(err);
    }

    if (onContactSubmit) {
      onContactSubmit({ name: contactName, email: contactEmail, message: contactMessage });
    }

    setSentMessage(true);
    setContactName('');
    setContactEmail('');
    setContactMessage('');
    setTimeout(() => setSentMessage(false), 5000);
  };

  const skillsList = [
    'Offensive Web App Pentesting',
    'Wazuh SIEM Cluster Architecture',
    'Linux Kernel & Server Hardening',
    'Vulnerability Research & Exploitation',
    'Incident Response & Memory Forensics',
    'Python & Bash Security Automation',
    'Network Packet Analysis (Wireshark)',
    'OWASP Top 10 & ASVS 4.0 Compliance',
    'Docker Container Security & Isolation',
    'WordPress Hardening & Malware Eradication'
  ];

  return (
    <section id="portfolio" className="py-20 bg-[#060c16] border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-widest mb-2">
            <User className="w-4 h-4" />
            <span>Leadership & Engineering</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Founder & Cybersecurity Specialist
          </h2>
          <p className="mt-2 text-slate-400 text-sm sm:text-base">
            Professional background, core specializations, technical philosophy, and the defensive mission behind CyberShieldPK.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Biography & Specialization */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 sm:p-8 rounded-2xl bg-[#0a1222] border border-slate-800 shadow-xl space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 border-b border-slate-800/80 pb-5">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 text-2xl font-mono font-bold shadow-lg">
                  MZ
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    Muhammad Zaib Zafar
                  </h3>
                  <p className="text-sm font-mono text-cyan-400">
                    Lead Cybersecurity Specialist & Founder, CyberShieldPK
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Security Researcher • SIEM Engineer • Threat Defense Instructor
                  </p>
                </div>
              </div>

              {/* Technical Bio */}
              <div className="text-slate-300 text-xs sm:text-sm leading-relaxed space-y-3">
                <p>
                  Muhammad Zaib Zafar is a dedicated cybersecurity practitioner and defensive security engineer focused on bridging the gap between theoretical security education and real-world adversarial defense.
                </p>
                <p>
                  With extensive background in web application vulnerability assessments, custom vulnerability exploitation tooling, and enterprise SIEM operations utilizing Wazuh and Elastic, Zaib has architected threat detection systems and hardening roadmaps for production infrastructures.
                </p>
                <p>
                  He established <strong>CyberShieldPK</strong> to democratize high-grade, practical cybersecurity training across Pakistan and international security communities, empowering analysts, developers, and system administrators to master the technical craft of defense.
                </p>
              </div>

              {/* Core Mission Statement */}
              <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30">
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block mb-1">
                  The CyberShieldPK Mission:
                </span>
                <p className="text-xs text-cyan-100 italic leading-relaxed">
                  "To elevate cybersecurity literacy, foster ethical technical excellence, and build resilient defense capabilities that protect critical digital infrastructure from emerging cyber threats."
                </p>
              </div>

              {/* Skills Grid */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider block">
                  Core Technical Competencies:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {skillsList.map((skill, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-slate-950/80 border border-slate-800/80 text-xs font-mono text-slate-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                      <span className="truncate">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Direct Contact Form & Social Links */}
          <div className="lg:col-span-5 space-y-6">
            {/* Contact Form Card */}
            <div className="p-6 rounded-2xl bg-[#0a1222] border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center gap-2 text-white font-bold text-lg">
                <Mail className="w-5 h-5 text-cyan-400" />
                <span>Direct Contact & Consultation</span>
              </div>
              <p className="text-xs text-slate-400">
                Reach out directly to discuss security consulting, technical workshops, advisory, or collaborative cyber research.
              </p>

              {sentMessage ? (
                <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs space-y-2 text-center">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                  <p className="font-semibold">Message Dispatched Successfully</p>
                  <p className="text-[11px] text-slate-300">
                    Thank you. Zaib will review your message and reply to your provided email shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmitContact} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="e.g. Tariq Ahmed"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">
                      Your Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="tariq@organization.com"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">
                      Inquiry / Message
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      placeholder="Inquire about VAPT, corporate training, or platform collaboration..."
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-xl font-mono text-xs font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 hover:to-sky-300 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Message to Zaib</span>
                  </button>
                </form>
              )}

              {/* Social Channels */}
              <div className="pt-4 border-t border-slate-800/80 space-y-2">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                  Connect Directly with Founder:
                </span>
                <div className="flex flex-col gap-2">
                  <a
                    href="mailto:zaibzafar936@gmail.com"
                    className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-cyan-500/30 text-xs font-mono text-cyan-300 hover:text-cyan-200 hover:border-cyan-400 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-cyan-400" />
                      <span>zaibzafar936@gmail.com (Direct Email)</span>
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                  </a>

                  <a
                    href="https://www.linkedin.com/in/muhammadzaibzafar"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 text-xs font-mono text-slate-300 hover:text-cyan-300 hover:border-cyan-500/30 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Linkedin className="w-4 h-4 text-cyan-400" />
                      <span>LinkedIn / Muhammad Zaib Zafar</span>
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                  </a>

                  <a
                    href="https://github.com/zaibzafar936"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 text-xs font-mono text-slate-300 hover:text-cyan-300 hover:border-cyan-500/30 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Github className="w-4 h-4 text-cyan-400" />
                      <span>GitHub / @zaibzafar936 (Personal Repository)</span>
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
