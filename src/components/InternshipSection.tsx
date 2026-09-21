import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  CheckCircle2, 
  Calendar, 
  Award, 
  Sparkles, 
  ArrowRight, 
  Clock, 
  ShieldCheck, 
  Terminal, 
  Users, 
  GraduationCap,
  ExternalLink,
  Laptop,
  AlertCircle,
  Settings2,
  XCircle,
  Bell,
  Check,
  ChevronDown,
  Info
} from 'lucide-react';
import { INTERNSHIP_TRACKS } from './InternshipModal';

interface InternshipSectionProps {
  onApply: (trackTitle?: string) => void;
}

export const InternshipSection: React.FC<InternshipSectionProps> = ({ onApply }) => {
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Defensive' | 'Offensive' | 'Cloud'>('All');
  const [showAdminController, setShowAdminController] = useState(false);
  const [notifyEmail, setNotifyEmail] = useState('');
  const [notifySubmitted, setNotifySubmitted] = useState(false);

  // Status configuration: 'available' or 'closed' (OFF)
  const [isManuallyClosed, setIsManuallyClosed] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('cybershield_internship_closed');
      return saved === 'true';
    } catch {
      return false;
    }
  });

  // End-of-time / Deadline date
  const [deadlineDate, setDeadlineDate] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('cybershield_internship_deadline');
      return saved || '2026-06-30T23:59:59';
    } catch {
      return '2026-06-30T23:59:59';
    }
  });

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isExpired: boolean;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: false });

  // Compute countdown & automatic expiration
  useEffect(() => {
    const calculateTime = () => {
      const target = new Date(deadlineDate).getTime();
      const now = Date.now();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds, isExpired: false });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [deadlineDate]);

  // Overall availability: true if not manually closed and not expired
  const isOpportunityAvailable = !isManuallyClosed && !timeLeft.isExpired;

  // Handlers for setting status
  const handleToggleManualStatus = (closed: boolean) => {
    setIsManuallyClosed(closed);
    try {
      localStorage.setItem('cybershield_internship_closed', closed ? 'true' : 'false');
    } catch {
      // ignore localstorage error
    }
  };

  const handleSetDeadline = (newDateStr: string) => {
    setDeadlineDate(newDateStr);
    try {
      localStorage.setItem('cybershield_internship_deadline', newDateStr);
    } catch {
      // ignore
    }
  };

  const handleQuickExpireNow = () => {
    // Set deadline to yesterday
    const past = new Date(Date.now() - 3600000).toISOString();
    handleSetDeadline(past);
  };

  const handleQuickResetDays = (days: number) => {
    const future = new Date(Date.now() + days * 24 * 3600000).toISOString();
    handleSetDeadline(future);
    setIsManuallyClosed(false);
    try {
      localStorage.setItem('cybershield_internship_closed', 'false');
    } catch {
      // ignore
    }
  };

  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifyEmail || !notifyEmail.includes('@')) return;
    setNotifySubmitted(true);
    setTimeout(() => {
      setNotifyEmail('');
    }, 2000);
  };

  const filteredTracks = selectedFilter === 'All' 
    ? INTERNSHIP_TRACKS 
    : INTERNSHIP_TRACKS.filter(t => {
        if (selectedFilter === 'Defensive') return t.badge.includes('Defensive') || t.badge.includes('Intelligence');
        if (selectedFilter === 'Offensive') return t.badge.includes('Offensive') || t.badge.includes('Binary');
        if (selectedFilter === 'Cloud') return t.badge.includes('Infrastructure');
        return true;
      });

  return (
    <section id="internship" className="py-20 border-b border-slate-800/80 bg-[#050c18] relative overflow-hidden w-full max-w-full">
      {/* Background Accent Glows */}
      <div className="absolute top-1/4 -right-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 -left-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8 w-full">
        {/* Status Indicator & Organizer Setting Banner */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#0a1426] border border-slate-800 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {isOpportunityAvailable ? (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/90 border border-emerald-500/50 text-emerald-300 text-xs font-mono font-bold shadow-[0_0_12px_rgba(52,211,153,0.2)]">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>INTERNSHIP OPPORTUNITY IS AVAILABLE — APPLY NOW</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-950/90 border border-red-500/50 text-red-300 text-xs font-mono font-bold shadow-[0_0_12px_rgba(239,68,68,0.2)]">
                  <XCircle className="w-3.5 h-3.5 text-red-400" />
                  <span>INTERNSHIP OPPORTUNITY IS OFF / CLOSED</span>
                </div>
              )}

              {isOpportunityAvailable && (
                <div className="hidden md:flex items-center gap-2 text-xs font-mono text-cyan-300">
                  <Clock className="w-3.5 h-3.5" />
                  <span>
                    Deadline: <strong>{timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s</strong>
                  </span>
                </div>
              )}
            </div>

            {/* Admin / Setting Toggle Trigger */}
            <button
              type="button"
              onClick={() => setShowAdminController(!showAdminController)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-slate-300 hover:text-cyan-300 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-lg transition-colors cursor-pointer self-start sm:self-auto"
            >
              <Settings2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Configure Opportunity Status & Timer</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showAdminController ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Collapsible Setting & End-Of-Time Controller */}
          {showAdminController && (
            <div className="pt-4 border-t border-slate-800/90 space-y-4 animate-in fade-in duration-200">
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 space-y-2">
                <div className="flex items-center gap-1.5 text-cyan-400 font-bold font-mono">
                  <Info className="w-4 h-4" />
                  <span>How to Set Internship Status (Available vs. Off):</span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  You can toggle the status directly between <strong>AVAILABLE</strong> and <strong>OFF / CLOSED</strong> using the switches below, or set a custom <strong>End-of-Time Deadline</strong>. When the deadline passes, the system automatically marks the internship as OFF.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {/* Manual Status Switch */}
                <div className="p-3 rounded-xl bg-[#070e1a] border border-slate-800 space-y-2">
                  <div className="text-[11px] font-mono text-slate-400 uppercase">Manual Status Override:</div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleManualStatus(false)}
                      className={`flex-1 py-1.5 text-xs font-mono font-bold rounded-lg border transition-all cursor-pointer ${
                        !isManuallyClosed 
                          ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/60 shadow-sm' 
                          : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      ● AVAILABLE
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleManualStatus(true)}
                      className={`flex-1 py-1.5 text-xs font-mono font-bold rounded-lg border transition-all cursor-pointer ${
                        isManuallyClosed 
                          ? 'bg-red-950/80 text-red-300 border-red-500/60 shadow-sm' 
                          : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      ✕ OFF / CLOSED
                    </button>
                  </div>
                </div>

                {/* Deadline Presets */}
                <div className="p-3 rounded-xl bg-[#070e1a] border border-slate-800 space-y-2">
                  <div className="text-[11px] font-mono text-slate-400 uppercase">End-of-Time Presets:</div>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={handleQuickExpireNow}
                      className="px-2.5 py-1 text-[11px] font-mono bg-red-950/60 hover:bg-red-900/80 text-red-300 border border-red-500/40 rounded transition-colors cursor-pointer"
                      title="Simulates deadline passed so opportunity displays as OFF"
                    >
                      Expire Now (Show OFF)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickResetDays(14)}
                      className="px-2.5 py-1 text-[11px] font-mono bg-cyan-950/60 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-500/40 rounded transition-colors cursor-pointer"
                    >
                      +14 Days
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickResetDays(30)}
                      className="px-2.5 py-1 text-[11px] font-mono bg-cyan-950/60 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-500/40 rounded transition-colors cursor-pointer"
                    >
                      +30 Days
                    </button>
                  </div>
                </div>

                {/* Custom Deadline Picker */}
                <div className="p-3 rounded-xl bg-[#070e1a] border border-slate-800 space-y-2">
                  <div className="text-[11px] font-mono text-slate-400 uppercase">Custom Deadline:</div>
                  <input
                    type="datetime-local"
                    value={deadlineDate.slice(0, 16)}
                    onChange={(e) => handleSetDeadline(new Date(e.target.value).toISOString())}
                    className="w-full px-2.5 py-1 bg-slate-900 border border-slate-700 text-white font-mono text-xs rounded focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* When Opportunity is OFF / CLOSED Notice */}
          {!isOpportunityAvailable && (
            <div className="p-4 rounded-xl bg-red-950/30 border border-red-500/40 text-slate-200 space-y-3">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-red-300">
                    Internship Opportunity is Currently OFF / Closed for Submissions
                  </h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    The application submission period for this cohort has reached its end of time or all allocated seats have been filled. You can leave your email below to be prioritized when the next batch opens.
                  </p>
                </div>
              </div>

              {/* Waitlist Subscription */}
              <form onSubmit={handleWaitlistSubmit} className="flex flex-col sm:flex-row gap-2 pt-2">
                <input
                  type="email"
                  placeholder="Enter your email for next batch alert..."
                  value={notifyEmail}
                  onChange={(e) => setNotifyEmail(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-cyan-500"
                  required
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-red-900 hover:bg-red-800 text-red-200 font-mono text-xs font-bold border border-red-500/40 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span>Notify Me When Open</span>
                </button>
              </form>

              {notifySubmitted && (
                <div className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" />
                  <span>You are on the priority notification list for the upcoming batch!</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-widest mb-2">
              <Briefcase className="w-4 h-4" />
              <span>Career Development & Mentorship</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              CyberShield<span className="text-cyan-400">PK</span> Internship Program 2026
            </h2>
            <p className="mt-2 text-slate-400 text-sm sm:text-base max-w-2xl">
              Immerse yourself in 8 to 12 weeks of real-world cybersecurity operations. Solve simulated enterprise breaches, author Sigma detection rules, and earn a verified recommendation letter from founder <strong>Muhammad Zaib Zafar</strong>.
            </p>
          </div>

          {isOpportunityAvailable ? (
            <button
              type="button"
              onClick={() => onApply()}
              className="self-start md:self-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-mono text-xs font-bold hover:from-cyan-300 hover:to-blue-400 transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Apply For Fellowship</span>
            </button>
          ) : (
            <button
              type="button"
              disabled
              className="self-start md:self-auto px-5 py-2.5 rounded-xl bg-slate-800 text-slate-500 font-mono text-xs font-bold flex items-center gap-2 cursor-not-allowed border border-slate-700"
            >
              <XCircle className="w-4 h-4" />
              <span>Applications Closed (OFF)</span>
            </button>
          )}
        </div>

        {/* Value Highlights Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            {
              icon: Laptop,
              title: '100% Remote & Virtual',
              desc: 'Flexible weekly project milestones with live hands-on browser labs and real packet captures.'
            },
            {
              icon: Terminal,
              title: 'Real Adversarial Drills',
              desc: 'Practice on isolated virtual machines with Wazuh, Sysmon, Burp Suite Pro, and Metasploit.'
            },
            {
              icon: Award,
              title: 'Verified Credential & LoR',
              desc: 'Earn a cryptographic certificate of internship completion and an official recommendation letter.'
            },
            {
              icon: Users,
              title: '1-on-1 Founder Mentorship',
              desc: 'Weekly design reviews, resume polishing, and career mentorship with Muhammad Zaib Zafar.'
            }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx} 
                className="p-5 rounded-2xl bg-[#091224]/80 border border-slate-800 hover:border-cyan-500/30 transition-all"
              >
                <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mb-3">
                  <Icon className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-white mb-1">{item.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
            {(['All', 'Defensive', 'Offensive', 'Cloud'] as const).map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setSelectedFilter(filter)}
                className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  selectedFilter === filter
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {filter} Tracks
              </button>
            ))}
          </div>

          <span className="hidden sm:inline-block text-xs font-mono text-slate-400">
            Cohort: <strong className="text-cyan-400">2026 Batch</strong>
          </span>
        </div>

        {/* Tracks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTracks.map((t) => (
            <div
              key={t.id}
              className="p-6 rounded-2xl bg-[#0a1426] border border-slate-800 hover:border-cyan-500/40 transition-all duration-200 flex flex-col justify-between group shadow-xl hover:-translate-y-1"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                    {t.badge}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-cyan-400" />
                    <span>{t.duration}</span>
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {t.title}
                </h3>

                <div className="space-y-2">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                    Core Toolchains & Focus:
                  </span>
                  <p className="text-xs text-slate-300 bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 font-mono">
                    {t.focus}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{t.stipend}</span>
                </div>
              </div>

              <div className="pt-5 border-t border-slate-800/80 mt-6 flex items-center justify-between">
                <div className="text-[11px] font-mono">
                  {isOpportunityAvailable ? (
                    <span className="text-emerald-400">Applications Open</span>
                  ) : (
                    <span className="text-red-400">Applications Closed (OFF)</span>
                  )}
                </div>

                {isOpportunityAvailable ? (
                  <button
                    type="button"
                    onClick={() => onApply(t.title)}
                    className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-cyan-400 hover:text-cyan-300 group-hover:translate-x-0.5 transition-transform cursor-pointer"
                  >
                    <span>Apply Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowAdminController(true)}
                    className="inline-flex items-center gap-1.5 text-[11px] font-mono text-slate-500 hover:text-slate-300 cursor-pointer"
                  >
                    <span>Closed</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
