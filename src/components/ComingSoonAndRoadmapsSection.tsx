import React, { useState } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  Bell, 
  Layers, 
  BookOpen, 
  Terminal, 
  Clock, 
  ArrowRight,
  GraduationCap,
  Cpu,
  ShieldAlert,
  Flame,
  Check
} from 'lucide-react';

interface UpcomingCourse {
  id: string;
  title: string;
  level: 'Beginner' | 'Intermediate' | 'Expert';
  targetDate: string;
  summary: string;
  curriculumHighlights: string[];
  prerequisites: string;
}

const UPCOMING_COURSES: UpcomingCourse[] = [
  {
    id: 'course-ai-redteam',
    title: 'AI & Large Language Model (LLM) Red Teaming',
    level: 'Expert',
    targetDate: 'Coming Q4 2026',
    summary: 'Master the next generation of offensive security: jailbreaks, indirect prompt injection, model extraction, and securing autonomous agentic workflows.',
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
    title: 'Zero-to-Hero Cybersecurity Foundations (Urdu / English)',
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

interface ComingSoonAndRoadmapsSectionProps {
  onNavigateToAcademy?: () => void;
  onNavigateToLabs?: () => void;
}

export const ComingSoonAndRoadmapsSection: React.FC<ComingSoonAndRoadmapsSectionProps> = ({
  onNavigateToAcademy,
  onNavigateToLabs
}) => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'roadmaps'>('upcoming');
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
    <section id="coming-soon-roadmaps" className="py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800/80 bg-[#060d1b] relative overflow-hidden w-full max-w-full">
      {/* Background cyber ambient gradients */}
      <div className="absolute top-1/4 -right-32 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-32 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-8 w-full">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>FUTURE CURRICULUMS & LEARNING PATHWAYS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Coming Soon Courses & Career Roadmaps
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Future specialized curriculums engineered by Muhammad Zaib Zafar, paired with structured skill progression paths for beginners to advanced red teamers.
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl font-mono text-xs self-start md:self-auto">
            <button
              type="button"
              onClick={() => setActiveTab('upcoming')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'upcoming'
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Coming Soon Courses</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('roadmaps')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'roadmaps'
                  ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              <span>Skill Roadmaps</span>
            </button>
          </div>
        </div>

        {/* Notification Toast */}
        {notifiedMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-mono flex items-center gap-2 animate-in fade-in duration-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{notifiedMsg}</span>
          </div>
        )}

        {/* TAB 1: COMING SOON COURSES */}
        {activeTab === 'upcoming' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {UPCOMING_COURSES.map((course) => {
              const isPreReg = preRegisteredCourses.includes(course.id);
              return (
                <div
                  key={course.id}
                  className="p-5 sm:p-6 rounded-2xl bg-[#091325] border border-cyan-500/20 hover:border-cyan-500/50 transition-all flex flex-col justify-between shadow-xl group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold border ${
                        course.level === 'Beginner'
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                          : course.level === 'Intermediate'
                          ? 'bg-amber-950 text-amber-300 border-amber-500/40'
                          : 'bg-rose-950 text-rose-300 border-rose-500/40'
                      }`}>
                        Level: {course.level}
                      </span>
                      <span className="text-xs font-mono text-cyan-400 font-bold flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{course.targetDate}</span>
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {course.title}
                    </h3>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {course.summary}
                    </p>

                    <div className="space-y-1.5 pt-2">
                      <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider font-semibold">
                        Syllabus Highlights:
                      </div>
                      {course.curriculumHighlights.map((hl, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-slate-300 font-mono">
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                          <span>{hl}</span>
                        </div>
                      ))}
                    </div>

                    <div className="text-xs font-mono text-slate-400 pt-1">
                      <span className="text-slate-500">Prerequisites:</span> {course.prerequisites}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800/80 mt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <span className="text-[11px] font-mono text-slate-400">
                      Curriculum by <strong className="text-white">Muhammad Zaib Zafar</strong>
                    </span>

                    <button
                      type="button"
                      onClick={() => handlePreRegister(course.title, course.id)}
                      disabled={isPreReg}
                      className={`px-3.5 py-2 rounded-xl font-mono text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        isPreReg
                          ? 'bg-slate-800 text-slate-400 border border-slate-700 cursor-default'
                          : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md hover:shadow-cyan-500/20'
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

        {/* TAB 2: SKILL ROADMAPS */}
        {activeTab === 'roadmaps' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Beginner Pathway */}
            <div className="p-6 rounded-2xl bg-[#091325] border border-emerald-500/30 flex flex-col justify-between shadow-xl">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-3">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wide">
                  Tier 1: Foundational
                </div>
                <h3 className="text-lg font-bold text-white mt-1 mb-2">
                  For New Cyber Students
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  Zero prior technical experience required. Build a rock-solid understanding of TCP/IP networking, Linux terminal operations, and defensive security basics.
                </p>

                <div className="space-y-2 border-t border-slate-800 pt-3">
                  <div className="text-xs font-mono text-slate-200 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                    <span>Cybersecurity Foundations 101</span>
                  </div>
                  <div className="text-xs font-mono text-slate-200 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                    <span>Linux Command Line for Hackers</span>
                  </div>
                  <div className="text-xs font-mono text-slate-200 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                    <span>VirtualBox & Ubuntu Cyber Lab Setup</span>
                  </div>
                  <div className="text-xs font-mono text-slate-200 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                    <span>Network Packet Capture with Wireshark</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={onNavigateToAcademy}
                  className="w-full text-center py-2.5 px-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>Explore Beginner Courses</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Intermediate Pathway */}
            <div className="p-6 rounded-2xl bg-[#091325] border border-amber-500/30 flex flex-col justify-between shadow-xl">
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-3">
                  <Layers className="w-5 h-5" />
                </div>
                <div className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wide">
                  Tier 2: Practitioner
                </div>
                <h3 className="text-lg font-bold text-white mt-1 mb-2">
                  For Intermediate Analysts
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  Hands-on vulnerability assessments, defending corporate networks, monitoring Wazuh SIEM alerts, and executing web application penetration tests.
                </p>

                <div className="space-y-2 border-t border-slate-800 pt-3">
                  <div className="text-xs font-mono text-slate-200 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                    <span>Web Application Security & Pentesting</span>
                  </div>
                  <div className="text-xs font-mono text-slate-200 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                    <span>SOC Analyst & Blue Team Operations</span>
                  </div>
                  <div className="text-xs font-mono text-slate-200 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                    <span>Hands-on OWASP Top 10 Web Exploitation</span>
                  </div>
                  <div className="text-xs font-mono text-slate-200 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                    <span>SIEM Log Analysis & Sigma Rules</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={onNavigateToAcademy}
                  className="w-full text-center py-2.5 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-mono text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>Explore Intermediate Track</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Expert Pathway */}
            <div className="p-6 rounded-2xl bg-[#091325] border border-rose-500/30 flex flex-col justify-between shadow-xl">
              <div>
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-3">
                  <Terminal className="w-5 h-5" />
                </div>
                <div className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wide">
                  Tier 3: Advanced Mastery
                </div>
                <h3 className="text-lg font-bold text-white mt-1 mb-2">
                  For Experts & Red Teamers
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  Advanced exploitation, firmware reverse engineering, AI red teaming, malware memory analysis, and enterprise adversary emulation.
                </p>

                <div className="space-y-2 border-t border-slate-800 pt-3">
                  <div className="text-xs font-mono text-slate-200 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 flex-shrink-0" />
                    <span>Cloud Penetration Testing (AWS / GCP)</span>
                  </div>
                  <div className="text-xs font-mono text-slate-200 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 flex-shrink-0" />
                    <span>AI Model Red Teaming & Jailbreaking</span>
                  </div>
                  <div className="text-xs font-mono text-slate-200 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 flex-shrink-0" />
                    <span>Memory Forensics & Malware Dissection</span>
                  </div>
                  <div className="text-xs font-mono text-slate-200 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 flex-shrink-0" />
                    <span>Active Directory Domain Persistence</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={onNavigateToLabs}
                  className="w-full text-center py-2.5 px-3 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 font-mono text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>Explore Expert Labs</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
