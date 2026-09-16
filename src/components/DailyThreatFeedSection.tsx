import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Flame, 
  Clock, 
  ExternalLink, 
  Sparkles, 
  Terminal, 
  CheckCircle2, 
  Bell, 
  AlertTriangle, 
  Activity,
  Layers,
  BookOpen,
  ChevronRight,
  Radio
} from 'lucide-react';

interface ThreatAlert {
  id: string;
  title: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  cve?: string;
  category: string;
  timestamp: string;
  summary: string;
  mitigation: string;
  mitreTactic: string;
}

interface UpcomingCourse {
  id: string;
  title: string;
  level: 'Beginner' | 'Intermediate' | 'Expert';
  targetDate: string;
  summary: string;
  curriculumHighlights: string[];
  prerequisites: string;
}

const DAILY_THREATS: ThreatAlert[] = [
  {
    id: 'threat-1',
    title: 'Critical RCE in Enterprise SSL-VPN Gateways Exploited in the Wild',
    severity: 'CRITICAL',
    cve: 'CVE-2026-1934 (CVSS 9.8)',
    category: 'Edge Infrastructure / Zero-Day',
    timestamp: 'Today, 2 hours ago',
    summary: 'Threat actors are actively leveraging unauthenticated path traversal and buffer overflow in legacy firmware to gain root access and drop WebShell backdoors.',
    mitigation: 'Immediately apply vendor hotfix KB-9812, restrict management interfaces to dedicated internal jumpboxes, and monitor outbound connection telemetry.',
    mitreTactic: 'Initial Access (TA0001) • Exploit Public-Facing Application'
  },
  {
    id: 'threat-2',
    title: 'Surge in AI-Generated Voice Clone & Deepfake Financial BEC Attacks',
    severity: 'HIGH',
    category: 'Social Engineering / AI Threats',
    timestamp: 'Today, 5 hours ago',
    summary: 'Sophisticated cybercrime syndicates are using 3-second generative audio models to impersonate Pakistani corporate executives, instructing bank transfers to offshore mules.',
    mitigation: 'Mandate out-of-band cryptographic voice code verification for wire transfers exceeding 50,000 PKR / $500 USD, train financial personnel on voice synthesis anomalies.',
    mitreTactic: 'Reconnaissance • Phishing for Information'
  },
  {
    id: 'threat-3',
    title: 'LockBit 3.0 Ransomware Variant Targeting Healthcare & Cloud Storage',
    severity: 'CRITICAL',
    category: 'Ransomware & Extortion',
    timestamp: 'Today, 8 hours ago',
    summary: 'New payloads detected utilizing AES-256 with elliptic curve keys, systematically deleting volume shadow copies and exfiltrating unencrypted patient records.',
    mitigation: 'Enforce immutable WORM cloud backups, deploy endpoint EDR with strict behavioral blocking on vssadmin/powershell execution, and segregate patient VLANs.',
    mitreTactic: 'Impact (TA0040) • Data Encrypted for Impact'
  },
  {
    id: 'threat-4',
    title: 'Kubernetes API Server Misconfigurations Leaking Cloud Secrets',
    severity: 'MEDIUM',
    category: 'Cloud Security / DevOps',
    timestamp: 'Yesterday, 18:30 PKT',
    summary: 'Automated scanners identified over 1,400 publicly exposed K8s clusters in South Asia with anonymous authentication enabled on port 6443.',
    mitigation: 'Disable anonymous-auth in kube-apiserver, enforce RBAC with least privilege, and run kube-bench audit checks routinely.',
    mitreTactic: 'Discovery (TA0007) • Cloud Infrastructure Discovery'
  }
];

const UPCOMING_COURSES: UpcomingCourse[] = [
  {
    id: 'course-ai-redteam',
    title: 'AI & Large Language Model (LLM) Red Teaming',
    level: 'Expert',
    targetDate: 'Coming Q4 2026',
    summary: 'Master the next generation of offensive security: jailbreaks, indirect prompt injection, data extraction, and securing agentic workflows.',
    curriculumHighlights: [
      'Prompt Injection & Cross-Plugin Exploits',
      'Model Weight Stealing & Training Data Poisoning',
      'OWASP Top 10 for LLMs Auditing',
      'Automated Fuzzing of Neural Embeddings'
    ],
    prerequisites: 'Python proficiency & Web Pentesting experience'
  },
  {
    id: 'course-cloud-pentest',
    title: 'Cloud Penetration Testing & Defense (AWS, Azure, GCP)',
    level: 'Intermediate',
    targetDate: 'Coming Next Month',
    summary: 'Hands-on offensive tactics across multi-cloud environments, privilege escalation via IAM, and detecting adversary pivot chains.',
    curriculumHighlights: [
      'AWS IAM Privilege Escalation Vectors',
      'Azure AD / Entra ID Federation Attacks',
      'S3 Bucket Leaks & Serverless Code Execution',
      'CloudTrail & GuardDuty Evasion Techniques'
    ],
    prerequisites: 'Basic networking and Linux fundamentals'
  },
  {
    id: 'course-iot-hardware',
    title: 'IoT & Firmware Reverse Engineering Bootcamp',
    level: 'Expert',
    targetDate: 'Coming Q1 2027',
    summary: 'From silicon to software: UART/JTAG debugging, dumping firmware via SPI flash chips, and exploiting embedded Linux vulnerabilities.',
    curriculumHighlights: [
      'Hardware Debugging (UART, I2C, SPI, JTAG)',
      'Binwalk Firmware Extraction & Ghidra Decompilation',
      'MIPS/ARM Shellcoding for Embedded Devices',
      'Automotive CAN Bus Protocol Analysis'
    ],
    prerequisites: 'C programming, Assembly basics & Linux command line'
  },
  {
    id: 'course-soc-fundamentals',
    title: 'Zero-to-Hero Cybersecurity Foundations (100% Urdu/English)',
    level: 'Beginner',
    targetDate: 'Coming Soon',
    summary: 'Designed specifically for complete beginners in Pakistan: networking fundamentals, Linux command line, security mindset, and career roadmaps.',
    curriculumHighlights: [
      'Networking Essentials (TCP/IP, DNS, Subnetting)',
      'Linux Command Line Mastery for Hackers',
      'Understanding Threat Actors & Cybercrime Law',
      'Setting up your First Home Security Lab with VirtualBox'
    ],
    prerequisites: 'No prior coding or security background needed'
  }
];

export const DailyThreatFeedSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'threats' | 'upcoming' | 'pathways'>('threats');
  const [preRegisteredCourses, setPreRegisteredCourses] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('cybershield_prereg');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [notifiedMsg, setNotifiedMsg] = useState<string | null>(null);

  const handlePreRegister = (courseTitle: string, courseId: string) => {
    const updated = [...preRegisteredCourses, courseId];
    setPreRegisteredCourses(updated);
    try {
      localStorage.setItem('cybershield_prereg', JSON.stringify(updated));
    } catch {
      // ignore
    }
    setNotifiedMsg(`You're on the priority notification list for "${courseTitle}"!`);
    setTimeout(() => setNotifiedMsg(null), 4000);
  };

  return (
    <section id="threat-feed" className="py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800/80 relative">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono font-semibold mb-3">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span>LIVE CYBERSHIELD-PK THREAT DESK</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Daily Threat Intelligence & Upcoming Curriculums
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl font-mono">
              Real-world attack intelligence curated by Muhammad Zaib Zafar, alongside future roadmaps for all skill tiers.
            </p>
          </div>

          {/* Navigation Pill Switcher */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl font-mono text-xs">
            <button
              onClick={() => setActiveTab('threats')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'threats'
                  ? 'bg-red-500/20 text-red-300 font-bold border border-red-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Daily Attacks Feed</span>
            </button>

            <button
              onClick={() => setActiveTab('upcoming')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'upcoming'
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Coming Soon Courses</span>
            </button>

            <button
              onClick={() => setActiveTab('pathways')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'pathways'
                  ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Skill Roadmaps</span>
            </button>
          </div>
        </div>

        {/* Notification Toast */}
        {notifiedMsg && (
          <div className="mb-6 p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-mono flex items-center gap-2 animate-in fade-in duration-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{notifiedMsg}</span>
          </div>
        )}

        {/* TAB 1: DAILY THREATS */}
        {activeTab === 'threats' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {DAILY_THREATS.map((threat) => (
              <div
                key={threat.id}
                className="p-5 rounded-2xl bg-[#08101e] border border-slate-800 hover:border-red-500/40 transition-all flex flex-col justify-between shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-red-950/80 text-red-400 border border-red-500/30 font-bold">
                      {threat.severity}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {threat.timestamp}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-2 leading-snug">
                    {threat.title}
                  </h3>

                  {threat.cve && (
                    <div className="text-xs font-mono text-amber-400 mb-2 font-semibold">
                      {threat.cve} • {threat.category}
                    </div>
                  )}

                  <p className="text-xs text-slate-300 leading-relaxed mb-3">
                    {threat.summary}
                  </p>

                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 mb-3">
                    <div className="text-[11px] font-mono font-bold text-emerald-400 mb-1 flex items-center gap-1">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>Actionable Defense Guidance:</span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed font-mono">
                      {threat.mitigation}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span className="truncate max-w-[280px]">MITRE: {threat.mitreTactic}</span>
                  <span className="text-cyan-400 font-semibold">Live Telemetry</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: UPCOMING & COMING SOON COURSES */}
        {activeTab === 'upcoming' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {UPCOMING_COURSES.map((course) => {
              const isPreReg = preRegisteredCourses.includes(course.id);
              return (
                <div
                  key={course.id}
                  className="p-5 rounded-2xl bg-[#08101e] border border-cyan-500/20 hover:border-cyan-500/50 transition-all flex flex-col justify-between shadow-lg"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className={`text-[11px] font-mono px-2 py-0.5 rounded font-bold border ${
                        course.level === 'Beginner'
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-500/30'
                          : course.level === 'Intermediate'
                          ? 'bg-amber-950 text-amber-300 border-amber-500/30'
                          : 'bg-rose-950 text-rose-300 border-rose-500/30'
                      }`}>
                        Level: {course.level}
                      </span>
                      <span className="text-[11px] font-mono text-cyan-400 font-bold">
                        {course.targetDate}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white mb-2 leading-snug">
                      {course.title}
                    </h3>

                    <p className="text-xs text-slate-300 leading-relaxed mb-3">
                      {course.summary}
                    </p>

                    <div className="space-y-1 mb-4">
                      <div className="text-[11px] font-mono text-slate-400 font-semibold mb-1">
                        Syllabus Highlights:
                      </div>
                      {course.curriculumHighlights.map((hl, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-slate-300 font-mono">
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                          <span>{hl}</span>
                        </div>
                      ))}
                    </div>

                    <div className="text-[11px] font-mono text-slate-400 mb-4">
                      <span className="text-slate-500">Prerequisites:</span> {course.prerequisites}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-slate-400">
                      Curriculum by Muhammad Zaib Zafar
                    </span>

                    <button
                      onClick={() => handlePreRegister(course.title, course.id)}
                      disabled={isPreReg}
                      className={`px-3 py-1.5 rounded-xl font-mono text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                        isPreReg
                          ? 'bg-slate-800 text-slate-400 border border-slate-700 cursor-default'
                          : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md'
                      }`}
                    >
                      <Bell className="w-3.5 h-3.5" />
                      <span>{isPreReg ? 'Notification Active ✓' : 'Notify Me Upon Launch'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 3: LEARNING PATHWAYS FOR EVERYONE */}
        {activeTab === 'pathways' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Beginner Pathway */}
            <div className="p-6 rounded-2xl bg-[#08101e] border border-emerald-500/30 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-3">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wide">
                  Step 1: Foundational
                </div>
                <h3 className="text-lg font-bold text-white mt-1 mb-2">
                  For New Cyber Students
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  Zero prior technical experience required. Build a robust understanding of networking, Linux systems, and cybersecurity fundamentals.
                </p>

                <div className="space-y-2 border-t border-slate-800 pt-3">
                  <div className="text-xs font-mono text-slate-200 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>Cybersecurity Foundations 101</span>
                  </div>
                  <div className="text-xs font-mono text-slate-200 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>Linux Command Line for Hackers</span>
                  </div>
                  <div className="text-xs font-mono text-slate-200 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>VirtualBox Cyber Lab Setup</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800">
                <a
                  href="#academy"
                  className="block text-center py-2 px-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold transition-colors"
                >
                  Explore Beginner Courses →
                </a>
              </div>
            </div>

            {/* Intermediate Pathway */}
            <div className="p-6 rounded-2xl bg-[#08101e] border border-amber-500/30 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-3">
                  <Layers className="w-5 h-5" />
                </div>
                <div className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wide">
                  Step 2: Practical Skills
                </div>
                <h3 className="text-lg font-bold text-white mt-1 mb-2">
                  For Intermediate Analysts
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  Hands-on vulnerability assessments, defending corporate networks, monitoring Wazuh SIEM alerts, and executing web penetration tests.
                </p>

                <div className="space-y-2 border-t border-slate-800 pt-3">
                  <div className="text-xs font-mono text-slate-200 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span>Web Application Security & Pentesting</span>
                  </div>
                  <div className="text-xs font-mono text-slate-200 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span>SOC Analyst & Blue Team Operations</span>
                  </div>
                  <div className="text-xs font-mono text-slate-200 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span>Hands-on OWASP Top 10 Labs</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800">
                <a
                  href="#academy"
                  className="block text-center py-2 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-mono text-xs font-bold transition-colors"
                >
                  Explore Intermediate Track →
                </a>
              </div>
            </div>

            {/* Expert Pathway */}
            <div className="p-6 rounded-2xl bg-[#08101e] border border-rose-500/30 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-3">
                  <Terminal className="w-5 h-5" />
                </div>
                <div className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wide">
                  Step 3: Advanced Mastery
                </div>
                <h3 className="text-lg font-bold text-white mt-1 mb-2">
                  For Experts & Red Teamers
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  Advanced exploitation, firmware reverse engineering, AI red teaming, malware dissection, and adversary emulation.
                </p>

                <div className="space-y-2 border-t border-slate-800 pt-3">
                  <div className="text-xs font-mono text-slate-200 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                    <span>Cloud Penetration Testing (AWS/GCP)</span>
                  </div>
                  <div className="text-xs font-mono text-slate-200 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                    <span>AI Model Red Teaming & Jailbreaking</span>
                  </div>
                  <div className="text-xs font-mono text-slate-200 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                    <span>Memory Forensics & Malware Analysis</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800">
                <a
                  href="#labs"
                  className="block text-center py-2 px-3 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 font-mono text-xs font-bold transition-colors"
                >
                  Explore Expert Labs →
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
