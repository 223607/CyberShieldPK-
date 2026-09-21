import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Terminal as TerminalIcon, 
  Play, 
  Radio, 
  CheckCircle2, 
  AlertTriangle, 
  Cpu, 
  Network, 
  Lock, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';

interface HeroProps {
  onStartLearning: () => void;
  onExploreLabs: () => void;
  onOpenSoc: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onStartLearning,
  onExploreLabs,
  onOpenSoc
}) => {
  const [terminalTab, setTerminalTab] = useState<'scan' | 'soc' | 'rules'>('scan');
  const [activeCommandIndex, setActiveCommandIndex] = useState(0);

  const terminalOutputs = {
    scan: [
      { text: '$ nmap -sS -sV -p 80,443,1514,8080 target.cybershield.org', color: 'text-cyan-400' },
      { text: '[+] Starting Nmap 7.94 ( https://nmap.org ) at 22:14 UTC', color: 'text-slate-400' },
      { text: 'PORT     STATE SERVICE VERSION', color: 'text-slate-300' },
      { text: '80/tcp   open  http    nginx 1.25.4 (TLS Reverse Proxy)', color: 'text-emerald-400' },
      { text: '443/tcp  open  https   Cloudflare SSL Edge', color: 'text-emerald-400' },
      { text: '1514/tcp open  wazuh   Wazuh Manager Encrypted Stream', color: 'text-cyan-300' },
      { text: '8080/tcp closed http-proxy (Filtered by perimeter ACL)', color: 'text-amber-400' },
      { text: '[*] Network audit complete: 0 unpatched remote RCE vectors.', color: 'text-emerald-400' }
    ],
    soc: [
      { text: '$ /var/ossec/bin/wazuh-control status', color: 'text-cyan-400' },
      { text: 'wazuh-modulesd is running...', color: 'text-slate-300' },
      { text: 'wazuh-analysisd is running... [Decoders: 1,420 | Rules: 4,110]', color: 'text-emerald-400' },
      { text: 'wazuh-execd is running... [Active Response: Enabled]', color: 'text-emerald-400' },
      { text: '[LIVE TELEMETRY] Agent 001 (DC-PROD-01): Keep-alive ACK (0ms)', color: 'text-cyan-400' },
      { text: '[LIVE TELEMETRY] Agent 002 (WEB-PROD-01): FIM Baseline Synced', color: 'text-cyan-400' },
      { text: '--> ALL DEFENSIVE CHANNELS SECURED', color: 'text-emerald-400' }
    ],
    rules: [
      { text: '$ cat /var/ossec/etc/rules/local_rules.xml | grep -A 4 "100084"', color: 'text-cyan-400' },
      { text: '<rule id="100084" level="14">', color: 'text-purple-400' },
      { text: '  <if_sid>10</if_sid> <!-- Sysmon Event 10 -->', color: 'text-slate-400' },
      { text: '  <match>TargetImage: lsass.exe</match>', color: 'text-amber-300' },
      { text: '  <description>MITRE T1003.001 - LSASS Memory Access</description>', color: 'text-rose-400' },
      { text: '</rule>', color: 'text-purple-400' }
    ]
  };

  return (
    <section 
      id="hero" 
      className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden cyber-grid-bg border-b border-slate-800/80 w-full max-w-full"
    >
      {/* Subtle Background Glows - Controlled & Non-blocking */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-4xl h-80 bg-gradient-to-tr from-cyan-950/20 via-blue-900/15 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-20 right-10 w-72 h-72 bg-emerald-950/15 blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Subtle Live System Status Bar */}
        <div className="flex flex-wrap items-center justify-start gap-2.5 sm:gap-4 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-700/70 text-[11px] font-mono shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-slate-300 font-medium">SYSTEM STATUS:</span>
            <span className="text-emerald-400 font-semibold tracking-wider">SECURE</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-700/70 text-[11px] font-mono shadow-sm">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-slate-300 font-medium">THREAT MONITORING:</span>
            <span className="text-cyan-400 font-semibold tracking-wider">ACTIVE</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-700/70 text-[11px] font-mono shadow-sm">
            <span className="w-2 h-2 rounded-full bg-blue-400" />
            <span className="text-slate-300 font-medium">LAB ENVIRONMENT:</span>
            <span className="text-blue-400 font-semibold tracking-wider">READY</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Heading & Calls to Action */}
          {/* CRITICAL FIX: overflow-visible, no negative margins, 100% opacity, solid line-height */}
          <div className="lg:col-span-7 space-y-6 overflow-visible z-20">
            {/* The Main Headline - NEVER clipped or faded */}
            <h1 
              id="hero-main-heading"
              className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15] sm:leading-[1.12] lg:leading-[1.1] overflow-visible select-text block"
            >
              Learn Cybersecurity. <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400 bg-clip-text text-transparent">
                Build Skills.
              </span> <br className="hidden sm:inline" />
              Defend the Digital World.
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-normal">
              Master practical cybersecurity through structured learning, hands-on labs, 
              real-world projects, security tools and practical resources.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                id="hero-start-learning-btn"
                onClick={onStartLearning}
                className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-mono text-sm font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400 hover:from-cyan-300 hover:to-blue-300 shadow-[0_0_25px_rgba(0,240,255,0.35)] hover:shadow-[0_0_35px_rgba(0,240,255,0.5)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-slate-950 text-slate-950" />
                <span>Start Learning</span>
              </button>

              <button
                id="hero-explore-labs-btn"
                onClick={onExploreLabs}
                className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-mono text-sm font-semibold text-cyan-300 bg-slate-900/90 hover:bg-slate-800/90 border border-cyan-500/40 hover:border-cyan-400 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <TerminalIcon className="w-4 h-4 text-cyan-400" />
                <span>Explore Labs</span>
              </button>

              <button
                onClick={onOpenSoc}
                className="hidden sm:flex items-center gap-2 px-4 py-3.5 rounded-xl font-mono text-xs text-emerald-400 bg-emerald-950/30 hover:bg-emerald-950/60 border border-emerald-500/30 transition-colors"
              >
                <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span>SOC Telemetry View</span>
              </button>
            </div>

            {/* Platform Highlights / Non-fake Evidence */}
            <div className="pt-4 border-t border-slate-800/80 grid grid-cols-3 gap-4 max-w-lg">
              <div>
                <div className="text-xl sm:text-2xl font-bold text-white font-mono">9</div>
                <div className="text-xs text-slate-400 font-mono">Core Domains</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold text-cyan-400 font-mono">Hands-on</div>
                <div className="text-xs text-slate-400 font-mono">Lab Scenarios</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold text-emerald-400 font-mono">OWASP & SIEM</div>
                <div className="text-xs text-slate-400 font-mono">Curriculum Aligned</div>
              </div>
            </div>
          </div>

          {/* Right Column: Cybersecurity Workstation / Terminal & SOC Visual */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl cyber-glass p-1 border border-cyan-500/30 shadow-2xl shadow-cyan-950/40">
              {/* Terminal Titlebar */}
              <div className="flex items-center justify-between px-4 py-3 bg-slate-950/90 rounded-t-xl border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 text-xs font-mono text-slate-400 flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-cyan-400" />
                    cybershield-analyst@workstation:~
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                    LIVE
                  </span>
                </div>
              </div>

              {/* Terminal Subtabs */}
              <div className="flex border-b border-slate-800/80 bg-slate-900/50 px-2 pt-1 gap-1">
                <button
                  onClick={() => setTerminalTab('scan')}
                  className={`px-3 py-1.5 text-xs font-mono rounded-t-lg transition-colors flex items-center gap-1.5 ${
                    terminalTab === 'scan'
                      ? 'bg-slate-950 text-cyan-400 border-t border-x border-slate-800'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <TerminalIcon className="w-3 h-3" />
                  <span>recon.sh</span>
                </button>
                <button
                  onClick={() => setTerminalTab('soc')}
                  className={`px-3 py-1.5 text-xs font-mono rounded-t-lg transition-colors flex items-center gap-1.5 ${
                    terminalTab === 'soc'
                      ? 'bg-slate-950 text-emerald-400 border-t border-x border-slate-800'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Radio className="w-3 h-3" />
                  <span>wazuh_status</span>
                </button>
                <button
                  onClick={() => setTerminalTab('rules')}
                  className={`px-3 py-1.5 text-xs font-mono rounded-t-lg transition-colors flex items-center gap-1.5 ${
                    terminalTab === 'rules'
                      ? 'bg-slate-950 text-purple-400 border-t border-x border-slate-800'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Lock className="w-3 h-3" />
                  <span>mitre_rule.xml</span>
                </button>
              </div>

              {/* Terminal Screen Content */}
              <div className="p-4 bg-slate-950/95 font-mono text-xs space-y-1.5 min-h-[260px] max-h-[300px] overflow-y-auto rounded-b-xl select-text">
                {terminalOutputs[terminalTab].map((line, idx) => (
                  <div key={idx} className={`${line.color} leading-relaxed break-all`}>
                    {line.text}
                  </div>
                ))}
                <div className="flex items-center gap-1 text-slate-500 pt-2">
                  <span className="text-cyan-400">root@cybershield#</span>
                  <span className="w-2 h-4 bg-cyan-400 animate-pulse inline-block" />
                </div>
              </div>

              {/* Status Footer below terminal */}
              <div className="p-3 bg-slate-900/60 rounded-b-xl border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Network className="w-3.5 h-3.5 text-cyan-400" />
                  Tunnel: TLS 1.3 / AES-256-GCM
                </span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Telemetry verified
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
