import React, { useState } from 'react';
import { 
  X, 
  Briefcase, 
  ShieldCheck, 
  CheckCircle2, 
  Upload, 
  AlertCircle, 
  Sparkles, 
  Send, 
  FileText, 
  Building2, 
  Award, 
  GraduationCap,
  Calendar,
  Clock,
  Laptop
} from 'lucide-react';

interface InternshipModalProps {
  onClose: () => void;
  selectedTrack?: string;
  onSuccessNotification?: (msg: string) => void;
}

export const INTERNSHIP_TRACKS = [
  {
    id: 'track-soc',
    title: 'SOC & Incident Response Analyst (Blue Team)',
    duration: '10 Weeks (Remote)',
    stipend: 'Merit Fellowship + Official Credential',
    focus: 'Wazuh SIEM, Sysmon, Event Triage, Snort IDS, MITRE ATT&CK Mapping',
    badge: 'Defensive Operations'
  },
  {
    id: 'track-redteam',
    title: 'Penetration Testing & Web Security (Red Team)',
    duration: '10 Weeks (Remote)',
    stipend: 'Merit Fellowship + Official Credential',
    focus: 'Burp Suite Pro, OWASP Top 10, API Security, Privilege Escalation, Metasploit',
    badge: 'Offensive Security'
  },
  {
    id: 'track-malware',
    title: 'Malware Analysis & Reverse Engineering',
    duration: '12 Weeks (Remote)',
    stipend: 'Merit Fellowship + Official Credential',
    focus: 'Ghidra, x64dbg, Static/Dynamic Disassembly, PE File Headers, Sandbox Triage',
    badge: 'Binary Analysis'
  },
  {
    id: 'track-cloud',
    title: 'Cloud Security & DevSecOps Architecture',
    duration: '8 Weeks (Remote)',
    stipend: 'Merit Fellowship + Official Credential',
    focus: 'AWS IAM Hardening, Docker Security, Kubernetes RBAC, CI/CD Pipeline Scanning',
    badge: 'Infrastructure'
  },
  {
    id: 'track-threat-intel',
    title: 'Cyber Threat Intelligence & OSINT Specialist',
    duration: '8 Weeks (Remote)',
    stipend: 'Merit Fellowship + Official Credential',
    focus: 'Adversary Profiling, Dark Web Scraping, Maltego, YARA Signaturing, CVE Analysis',
    badge: 'Intelligence'
  }
];

export const InternshipModal: React.FC<InternshipModalProps> = ({
  onClose,
  selectedTrack,
  onSuccessNotification
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [university, setUniversity] = useState('');
  const [track, setTrack] = useState(selectedTrack || INTERNSHIP_TRACKS[0].title);
  const [experienceLevel, setExperienceLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [resumeFileName, setResumeFileName] = useState('');
  const [statement, setStatement] = useState('');
  
  // Submission states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedAppId, setSubmittedAppId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setResumeFileName(file.name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Strict validation
    if (!fullName.trim() || fullName.length < 3) {
      setErrorMsg('Please enter your full legal name (minimum 3 characters).');
      return;
    }

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErrorMsg('Please enter a valid personal email address where you will receive your internship confirmation.');
      return;
    }

    const cleanPhone = phone.replace(/[\s-]/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      setErrorMsg('Please enter a valid contact phone or WhatsApp number (e.g. 03001234567 or +923001234567).');
      return;
    }

    if (!university.trim()) {
      setErrorMsg('Please enter your current university, institution, or workplace.');
      return;
    }

    if (!statement.trim() || statement.length < 20) {
      setErrorMsg('Please provide a brief statement of purpose (minimum 20 characters) describing your interest.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const appId = `CS-INT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      
      const newApplication = {
        appId,
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        university: university.trim(),
        track,
        experienceLevel,
        linkedinUrl: linkedinUrl.trim(),
        githubUrl: githubUrl.trim(),
        resumeFileName: resumeFileName || 'Attached_Online_Profile.pdf',
        statement: statement.trim(),
        appliedAt: new Date().toISOString(),
        status: 'PENDING_REVIEW'
      };

      try {
        const existing = JSON.parse(localStorage.getItem('cybershield_internship_applications') || '[]');
        localStorage.setItem('cybershield_internship_applications', JSON.stringify([newApplication, ...existing]));
      } catch (err) {
        console.error(err);
      }

      setIsSubmitting(false);
      setSubmittedAppId(appId);

      if (onSuccessNotification) {
        onSuccessNotification(`Internship application submitted successfully! Reference ID: ${appId}`);
      }
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-[#091120] border border-cyan-500/40 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white font-mono uppercase tracking-wider">
                CyberShield<span className="text-cyan-400">PK</span> Internship Program 2026
              </h3>
              <p className="text-[10px] font-mono text-slate-400">
                Cohort 2026 • Hands-on Virtual Security Engineering & Mentorship
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

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {submittedAppId ? (
            /* Success View */
            <div className="text-center py-6 space-y-5 animate-in fade-in zoom-in-95">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-2">
                <h4 className="text-xl font-bold text-white">Application Received!</h4>
                <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
                  Thank you, <strong className="text-cyan-300">{fullName}</strong>. Your application for the <strong className="text-white">{track}</strong> track has been logged into the CyberShieldPK evaluation queue.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 max-w-md mx-auto text-left font-mono text-xs space-y-2">
                <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                  <span className="text-slate-400">Reference ID:</span>
                  <span className="text-cyan-400 font-bold">{submittedAppId}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                  <span className="text-slate-400">Candidate Email:</span>
                  <span className="text-white">{email}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                  <span className="text-slate-400">Track:</span>
                  <span className="text-emerald-400 truncate max-w-[200px]">{track}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Evaluation Phase:</span>
                  <span className="text-amber-400">Review within 48 Hours</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 max-w-md mx-auto">
                An official email receipt with technical test credentials will be sent to <strong>{email}</strong>. If you have any urgent queries, contact founder Muhammad Zaib Zafar at <span className="text-cyan-300">zaibzafar936@gmail.com</span>.
              </p>

              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs font-mono hover:from-cyan-400 hover:to-blue-500 transition-all cursor-pointer shadow-lg shadow-cyan-500/20"
              >
                Return to CyberShieldPK Platform
              </button>
            </div>
          ) : (
            /* Application Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Program Overview Banner */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-blue-950/30 border border-cyan-500/30 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <p className="text-white font-semibold">
                    Mentored by Muhammad Zaib Zafar & CyberShieldPK Security Team
                  </p>
                  <p className="text-slate-300 leading-relaxed text-[11px]">
                    Work on real adversarial attack/defense scenarios, Wazuh SIEM detection engineering, CVE vulnerability research, and earn a verified industry recommendation letter.
                  </p>
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Personal Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Muhammad Zaib Zafar"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Personal Email Address <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@gmail.com"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Phone / WhatsApp <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0300-1234567"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    University / Institute / Org <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={university}
                    onChange={(e) => setUniversity(e.target.value)}
                    placeholder="e.g. FAST NUCES, NUST, or Self-Taught"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Track Selection */}
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Select Internship Domain Track <span className="text-red-400">*</span>
                </label>
                <select
                  value={track}
                  onChange={(e) => setTrack(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                >
                  {INTERNSHIP_TRACKS.map((t) => (
                    <option key={t.id} value={t.title}>
                      {t.title} ({t.duration})
                    </option>
                  ))}
                </select>
              </div>

              {/* Experience & Links */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Experience Level
                  </label>
                  <select
                    value={experienceLevel}
                    onChange={(e) => setExperienceLevel(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                  >
                    <option value="Beginner">Beginner (Foundational)</option>
                    <option value="Intermediate">Intermediate (Hands-on Labs)</option>
                    <option value="Advanced">Advanced (CTFs / Tools)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    LinkedIn Profile URL
                  </label>
                  <input
                    type="url"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    placeholder="https://linkedin.com/in/username"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    GitHub / Portfolio URL
                  </label>
                  <input
                    type="url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/username"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
              </div>

              {/* Resume Upload or link */}
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Resume / CV (PDF, DOCX, or Portfolio Link)
                </label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 rounded-lg text-xs font-mono text-cyan-300 cursor-pointer transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Choose File</span>
                    <input
                      type="file"
                      accept=".pdf,.docx,.doc"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  <span className="text-xs text-slate-400 font-mono truncate">
                    {resumeFileName ? (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 inline" /> {resumeFileName}
                      </span>
                    ) : (
                      'No file chosen (optional if GitHub/LinkedIn provided)'
                    )}
                  </span>
                </div>
              </div>

              {/* Statement of Interest */}
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Why do you want to join CyberShieldPK? <span className="text-red-400">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={statement}
                  onChange={(e) => setStatement(e.target.value)}
                  placeholder="Share your cybersecurity journey, tools you have used (e.g. Wireshark, Nmap, Burp Suite, Wazuh), and what you hope to achieve during this fellowship..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-mono text-slate-400 hover:text-white"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-bold font-mono text-xs hover:from-cyan-300 hover:to-blue-400 transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/25 disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      <span>Submitting Dossier...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Official Application</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
