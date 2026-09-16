import React, { useState, useEffect } from 'react';
import { 
  Laptop, 
  Search, 
  ShieldAlert, 
  Lock, 
  Unlock, 
  Sparkles, 
  Cpu, 
  Activity, 
  Network, 
  UserCheck, 
  ShieldCheck, 
  AlertTriangle, 
  Radio, 
  CheckCircle2, 
  Clock, 
  Terminal, 
  Layers, 
  HardDrive, 
  PowerOff, 
  CreditCard, 
  Smartphone, 
  Building2, 
  X,
  FileCode,
  Crosshair,
  Zap,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { 
  EndpointProfile, 
  sampleEndpoints 
} from '../../data/socDashboardData';

export const SocEndpointInspector: React.FC = () => {
  const [targetIp, setTargetIp] = useState('192.168.1.105');
  const [activeTab, setActiveTab] = useState<'free' | 'advanced'>('free');
  
  // Pro license unlock state (persisted in localStorage)
  const [isProUnlocked, setIsProUnlocked] = useState<boolean>(() => {
    return localStorage.getItem('cybershield_soc_pro_unlocked') === 'true';
  });

  // Payment modal state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'easypaisa' | 'jazzcash' | 'raast'>('card');
  const [isPaying, setIsPaying] = useState(false);
  const [paymentSuccessNotice, setPaymentSuccessNotice] = useState<string | null>(null);

  // Active Response actions simulation
  const [isHostIsolated, setIsHostIsolated] = useState(false);
  const [killedPids, setKilledPids] = useState<number[]>([]);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  // Retrieve or synthesize endpoint data
  const currentProfile: EndpointProfile = sampleEndpoints[targetIp] || {
    ip: targetIp,
    hostname: `WIN-${targetIp.replace(/\./g, '-')}`,
    status: 'online',
    os: 'Microsoft Windows 11 Pro (64-bit)',
    osArchitecture: 'x86_64',
    wazuhAgentId: '099',
    uptime: '2 days, 11 hours',
    macAddress: '00:1E:67:89:AB:CD',
    gateway: '192.168.1.1',
    domain: 'CORP.CYBERSHIELD.PK',
    cpuLoad: 38,
    memoryLoad: 52,
    lastHeartbeat: 'Just now',
    riskScore: 35,
    freeActivities: {
      standardProcesses: [
        { pid: 1104, name: 'explorer.exe', cpu: '1.0%', memory: '95 MB', user: 'CORP\\user' },
        { pid: 1420, name: 'svchost.exe', cpu: '0.2%', memory: '38 MB', user: 'NT AUTHORITY\\SYSTEM' },
        { pid: 3200, name: 'chrome.exe', cpu: '3.4%', memory: '340 MB', user: 'CORP\\user' },
        { pid: 5120, name: 'wazuh-agent.exe', cpu: '0.5%', memory: '28 MB', user: 'NT AUTHORITY\\SYSTEM' },
      ],
      openPorts: [
        { port: 135, proto: 'TCP', state: 'LISTENING', service: 'RPC Endpoint Mapper' },
        { port: 445, proto: 'TCP', state: 'LISTENING', service: 'SMB' },
        { port: 3389, proto: 'TCP', state: 'LISTENING', service: 'RDP' },
      ],
      recentBasicLogons: [
        { timestamp: 'Today 08:30:00', user: 'CORP\\user', logonType: 'Interactive', status: 'SUCCESS' },
      ]
    },
    advancedActivities: {
      memoryTriage: {
        lsassDumpAttempted: false,
        unbackedExecutableMemoryPages: 0,
        hollowedProcesses: [],
        injectedDlls: []
      },
      processLineageTree: [
        { parent: 'services.exe (PID 600)', child: 'svchost.exe (PID 1100)', cmd: 'svchost.exe -k LocalService', pid: 1100, integrityLevel: 'System', hash: 'd41d8cd98f00b204e9800998ecf8427e' }
      ],
      networkBeaconing: [],
      activeResponseAvailable: {
        hostIsolationAvailable: true,
        remoteShellAvailable: true,
        processKillAvailable: true,
        firewallDropAvailable: true
      }
    }
  };

  // Payment processing handler
  const handleProcessPayment = () => {
    setIsPaying(true);
    setTimeout(() => {
      setIsPaying(false);
      setIsProUnlocked(true);
      localStorage.setItem('cybershield_soc_pro_unlocked', 'true');
      setShowPaymentModal(false);
      setPaymentSuccessNotice('🎉 SOC Pro License Activated! Lifetime Endpoint Forensics Unlocked.');
      setActiveTab('advanced');
      setTimeout(() => setPaymentSuccessNotice(null), 5000);
    }, 1800);
  };

  // Active response actions
  const handleToggleHostIsolation = () => {
    setIsHostIsolated(!isHostIsolated);
    setActionFeedback(isHostIsolated ? 'Host network connectivity restored.' : '⚠️ HOST QUARANTINED: All network traffic blocked via Windows Firewall API except SOC C2.');
    setTimeout(() => setActionFeedback(null), 4000);
  };

  const handleKillProcess = (pid: number) => {
    setKilledPids(prev => [...prev, pid]);
    setActionFeedback(`Process PID ${pid} terminated via remote Wazuh Active Response.`);
    setTimeout(() => setActionFeedback(null), 4000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* 1. Header & IP Search Control */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-[#071324] border border-cyan-500/30 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                <Laptop className="w-4 h-4" />
              </span>
              <h2 className="text-base sm:text-lg font-bold font-mono text-white tracking-tight">
                Endpoint Activity & Forensic Inspector
              </h2>
              {isProUnlocked ? (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 flex items-center gap-1 font-bold">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  PRO LICENSE ACTIVE
                </span>
              ) : (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-amber-400" />
                  BASIC TIER
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Enter the IP address or hostname of any PC to inspect live telemetry, processes, open sockets, and memory anomalies.
            </p>
          </div>

          {!isProUnlocked && (
            <button
              type="button"
              onClick={() => setShowPaymentModal(true)}
              className="px-4 py-2 rounded-xl text-xs font-mono font-bold text-slate-950 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.3)] flex items-center gap-2 cursor-pointer transition-all shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Unlock Advanced Forensics (PKR 4,999)</span>
            </button>
          )}
        </div>

        {/* IP Input & Quick Preset Selectors */}
        <div className="space-y-2 font-mono text-xs">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={targetIp}
                onChange={(e) => setTargetIp(e.target.value)}
                placeholder="Enter IP (e.g. 192.168.1.105, 10.0.4.15)..."
                className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-cyan-500/40 rounded-xl text-white font-mono focus:outline-none focus:border-cyan-400 text-xs"
              />
            </div>
          </div>

          {/* Presets */}
          <div className="flex items-center gap-2 flex-wrap pt-1">
            <span className="text-[11px] text-slate-400">Quick Endpoints:</span>
            {[
              { ip: '192.168.1.105', label: '192.168.1.105 (Compromised PC)' },
              { ip: '10.0.4.15', label: '10.0.4.15 (Finance Workstation)' },
              { ip: '10.0.1.5', label: '10.0.1.5 (Domain Controller)' },
            ].map((preset) => (
              <button
                key={preset.ip}
                type="button"
                onClick={() => setTargetIp(preset.ip)}
                className={`px-2.5 py-1 rounded-lg text-[11px] border cursor-pointer transition-all ${
                  targetIp === preset.ip
                    ? 'bg-cyan-950 text-cyan-300 border-cyan-500/50 font-bold'
                    : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Payment Success Notification */}
      {paymentSuccessNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 font-mono text-xs flex items-center justify-between animate-in slide-in-from-top">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{paymentSuccessNotice}</span>
          </span>
          <button onClick={() => setPaymentSuccessNotice(null)} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Active Response Action Feedback */}
      {actionFeedback && (
        <div className="p-3.5 rounded-xl bg-cyan-950/80 border border-cyan-500/50 text-cyan-200 font-mono text-xs flex items-center gap-2 animate-in slide-in-from-top">
          <Zap className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span>{actionFeedback}</span>
        </div>
      )}

      {/* 2. Endpoint Identity & Telemetry Overview Card */}
      <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-4 font-mono text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 p-0.5 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-cyan-400 font-bold">
                {currentProfile.hostname.substring(0, 2)}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm sm:text-base font-bold text-white">{currentProfile.hostname}</h3>
                <span className="text-cyan-400 font-bold">({currentProfile.ip})</span>
                <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                  currentProfile.status === 'compromised' ? 'bg-red-950 text-red-300 border border-red-500/40 animate-pulse' :
                  currentProfile.status === 'online' ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' :
                  'bg-slate-900 text-slate-400 border border-slate-800'
                }`}>
                  {isHostIsolated ? 'QUARANTINED' : currentProfile.status}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {currentProfile.os} • Arch: {currentProfile.osArchitecture} • Wazuh Agent ID: #{currentProfile.wazuhAgentId}
              </p>
            </div>
          </div>

          {/* Risk Score Gauge */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase block">Endpoint Threat Risk</span>
              <span className={`text-xl font-bold ${
                currentProfile.riskScore >= 75 ? 'text-red-400' :
                currentProfile.riskScore >= 40 ? 'text-amber-400' : 'text-emerald-400'
              }`}>
                {currentProfile.riskScore} / 100
              </span>
            </div>
            <div className="w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold text-xs" style={{
              borderColor: currentProfile.riskScore >= 75 ? '#ef4444' : currentProfile.riskScore >= 40 ? '#f59e0b' : '#10b981'
            }}>
              {currentProfile.riskScore}%
            </div>
          </div>
        </div>

        {/* System Vitals Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px]">
          <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80">
            <span className="text-slate-500 block uppercase text-[10px]">CPU Utilization</span>
            <span className="text-white font-bold text-sm mt-0.5 block">{currentProfile.cpuLoad}%</span>
            <div className="w-full h-1 bg-slate-800 rounded-full mt-1.5 overflow-hidden">
              <div className="h-full bg-cyan-400" style={{ width: `${currentProfile.cpuLoad}%` }} />
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80">
            <span className="text-slate-500 block uppercase text-[10px]">Memory Load</span>
            <span className="text-white font-bold text-sm mt-0.5 block">{currentProfile.memoryLoad}%</span>
            <div className="w-full h-1 bg-slate-800 rounded-full mt-1.5 overflow-hidden">
              <div className="h-full bg-amber-400" style={{ width: `${currentProfile.memoryLoad}%` }} />
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80">
            <span className="text-slate-500 block uppercase text-[10px]">Uptime Duration</span>
            <span className="text-white font-bold text-xs mt-0.5 block truncate">{currentProfile.uptime}</span>
            <span className="text-[10px] text-slate-500">Heartbeat: {currentProfile.lastHeartbeat}</span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80">
            <span className="text-slate-500 block uppercase text-[10px]">MAC & Gateway</span>
            <span className="text-cyan-300 font-bold text-xs mt-0.5 block truncate">{currentProfile.macAddress}</span>
            <span className="text-[10px] text-slate-500 truncate block">GW: {currentProfile.gateway}</span>
          </div>
        </div>
      </div>

      {/* 3. Tier Navigation Switcher (Free vs Advanced) */}
      <div className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs">
        <button
          type="button"
          onClick={() => setActiveTab('free')}
          className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-all ${
            activeTab === 'free'
              ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-500/40 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Basic Activities (Free Tier)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('advanced')}
          className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-all ${
            activeTab === 'advanced'
              ? 'bg-amber-950/80 text-amber-300 font-bold border border-amber-500/40 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          {isProUnlocked ? <Unlock className="w-4 h-4 text-emerald-400" /> : <Lock className="w-4 h-4 text-amber-400" />}
          <span>Advanced Forensics & Active Response</span>
          {!isProUnlocked && (
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-400 text-slate-950 font-extrabold uppercase">
              PRO
            </span>
          )}
        </button>
      </div>

      {/* 4. FREE TIER CONTENT */}
      {activeTab === 'free' && (
        <div className="space-y-4 font-mono text-xs animate-in fade-in">
          
          {/* Top 5 Standard Processes Table */}
          <div className="rounded-xl bg-slate-950/90 border border-slate-800 overflow-hidden">
            <div className="p-3 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-400" />
                Standard Process Snapshot (Free Tier)
              </h4>
              <span className="text-[10px] text-slate-500">Auto-polled via Wazuh Agent</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left whitespace-nowrap">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 text-[11px]">
                    <th className="px-4 py-2">PID</th>
                    <th className="px-4 py-2">Process Name</th>
                    <th className="px-4 py-2">CPU</th>
                    <th className="px-4 py-2">Memory (RSS)</th>
                    <th className="px-4 py-2">Executing User Context</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {currentProfile.freeActivities.standardProcesses.map((proc) => (
                    <tr key={proc.pid} className="hover:bg-slate-900/40">
                      <td className="px-4 py-2 text-cyan-400 font-bold">{proc.pid}</td>
                      <td className="px-4 py-2 text-white font-bold">{proc.name}</td>
                      <td className="px-4 py-2 text-slate-400">{proc.cpu}</td>
                      <td className="px-4 py-2 text-slate-400">{proc.memory}</td>
                      <td className="px-4 py-2 text-slate-300">{proc.user}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sockets and Logons Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Open Listening Sockets */}
            <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Network className="w-4 h-4 text-emerald-400" />
                Open Listening Network Sockets
              </h4>
              <div className="space-y-2">
                {currentProfile.freeActivities.openPorts.map((port, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-2">
                      <span className="text-cyan-400 font-bold">Port {port.port}</span>
                      <span className="text-slate-500 uppercase">{port.proto}</span>
                    </div>
                    <span className="text-slate-300">{port.service}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                      {port.state}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Basic Logon Audit */}
            <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-cyan-400" />
                Recent User Logon Audit Logs
              </h4>
              <div className="space-y-2">
                {currentProfile.freeActivities.recentBasicLogons.map((logon, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between text-[11px]">
                    <div>
                      <span className="text-white font-bold block">{logon.user}</span>
                      <span className="text-[10px] text-slate-500">{logon.logonType} • {logon.timestamp}</span>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold ${
                      logon.status === 'SUCCESS' ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' :
                      'bg-red-950 text-red-300 border border-red-500/40'
                    }`}>
                      {logon.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. ADVANCED TIER (LOCKED / PAYWALL or UNLOCKED) */}
      {activeTab === 'advanced' && (
        <div className="space-y-5 animate-in fade-in">
          
          {!isProUnlocked ? (
            /* LOCKED PRO PAYWALL BANNER */
            <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-slate-950 via-[#130f08] to-slate-950 border border-amber-500/40 text-center space-y-5 relative overflow-hidden shadow-[0_0_30px_rgba(251,191,36,0.15)]">
              <div className="w-14 h-14 rounded-2xl bg-amber-950/80 border border-amber-500/40 flex items-center justify-center text-amber-400 mx-auto shadow-inner">
                <Lock className="w-7 h-7" />
              </div>

              <div className="max-w-xl mx-auto space-y-2">
                <span className="text-[11px] font-mono font-bold px-3 py-1 rounded-full bg-amber-400 text-slate-950 uppercase tracking-wider">
                  CyberShield SOC Enterprise & Pro Tier
                </span>
                <h3 className="text-lg sm:text-2xl font-bold font-mono text-white">
                  Unlock Deep Memory Forensics & Active Response
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 font-sans leading-relaxed">
                  The requested endpoint has flagged memory anomalies and potential C2 beacons. Deep inspection, parent-child process tree analysis, and remote containment require a CyberShield SOC Pro license.
                </p>
              </div>

              {/* Advanced Features Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto text-left font-mono text-xs">
                {[
                  'Deep Kernel Memory & LSASS Dump Detection (Event 10)',
                  'Process Lineage Tree with SHA-256 Hashes & Injected DLLs',
                  'C2 Network Beaconing Jitter Analysis (Cobalt Strike / Sliver)',
                  'One-Click Remote Host Network Isolation (Quarantine)',
                  'Remote Process Kill via Wazuh Active Response API',
                  'Forensic PCAP Sniffer & Memory Dump Export'
                ].map((feature, i) => (
                  <div key={i} className="p-2.5 rounded-lg bg-slate-900/80 border border-amber-500/20 flex items-center gap-2 text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="text-[11px]">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Price & CTA Button */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
                <div className="text-center sm:text-right font-mono">
                  <span className="text-[10px] text-slate-500 block uppercase">One-time Lifetime Access</span>
                  <span className="text-2xl font-bold text-amber-400">PKR 4,999</span>
                  <span className="text-xs text-slate-400 ml-1.5">($19.99 USD)</span>
                </div>

                <button
                  type="button"
                  onClick={() => setShowPaymentModal(true)}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold font-mono text-xs flex items-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(251,191,36,0.35)] transition-all"
                >
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>Unlock Advanced Activities Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* UNLOCKED PRO CONTENT */
            <div className="space-y-5 font-mono text-xs animate-in fade-in">
              
              {/* ACTIVE RESPONSE TOOLBAR */}
              <div className="p-4 rounded-xl bg-slate-950/90 border border-cyan-500/40 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Crosshair className="w-4 h-4 text-cyan-400 animate-spin" />
                  <span className="text-xs font-bold text-white uppercase">
                    Wazuh Active Response Command Console: {currentProfile.hostname}
                  </span>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={handleToggleHostIsolation}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                      isHostIsolated
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                        : 'bg-red-600 hover:bg-red-500 text-white'
                    }`}
                  >
                    <PowerOff className="w-3.5 h-3.5" />
                    <span>{isHostIsolated ? 'Restore Network Connectivity' : 'Isolate Host from Corporate LAN'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActionFeedback('Volatility 3 Raw Memory Dump dump.raw scheduled via agent.');
                      setTimeout(() => setActionFeedback(null), 3000);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/40 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <HardDrive className="w-3.5 h-3.5" />
                    <span>Export Memory Dump</span>
                  </button>
                </div>
              </div>

              {/* ADVANCED 1: Deep Memory & LSASS Triage */}
              <div className="p-4 rounded-xl bg-slate-950/90 border border-red-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-red-400" />
                    Deep Kernel Memory & LSASS In-Memory Triage (Sysmon Event 10)
                  </h4>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-500/40 uppercase font-bold">
                    Mimikatz Signature Detected
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 space-y-1.5 text-[11px]">
                    <span className="text-slate-400 block text-[10px] uppercase">Hollowed Process Targets</span>
                    {currentProfile.advancedActivities.memoryTriage.hollowedProcesses.length > 0 ? (
                      currentProfile.advancedActivities.memoryTriage.hollowedProcesses.map((p, idx) => (
                        <div key={idx} className="p-2 rounded bg-red-950/30 border border-red-500/30 text-red-300 flex items-center justify-between">
                          <span>{p}</span>
                          <span className="text-[10px] text-red-400">PAGE_EXECUTE_READWRITE</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-emerald-400">Zero process hollowing detected.</p>
                    )}
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 space-y-1.5 text-[11px]">
                    <span className="text-slate-400 block text-[10px] uppercase">Unbacked DLL Injections</span>
                    {currentProfile.advancedActivities.memoryTriage.injectedDlls.map((dll, idx) => (
                      <div key={idx} className="p-2 rounded bg-slate-950 border border-slate-800 space-y-0.5">
                        <div className="flex items-center justify-between text-white font-bold">
                          <span>{dll.dll}</span>
                          <span className="text-amber-400 text-[10px]">{dll.signer}</span>
                        </div>
                        <span className="text-[10px] text-slate-500 block">Target: {dll.targetProcess}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ADVANCED 2: Process Lineage Tree */}
              <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Layers className="w-4 h-4 text-cyan-400" />
                    Process Execution Lineage Tree (Parent-Child Hierarchy)
                  </h4>
                  <span className="text-[10px] text-slate-400">Sysmon Event 1 Analysis</span>
                </div>

                <div className="space-y-2">
                  {currentProfile.advancedActivities.processLineageTree.map((item, idx) => {
                    const isKilled = killedPids.includes(item.pid);
                    return (
                      <div 
                        key={idx} 
                        className={`p-3 rounded-lg border flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs ${
                          isKilled 
                            ? 'bg-slate-950 border-slate-800 opacity-60 line-through' 
                            : 'bg-slate-900/60 border-slate-800 hover:border-cyan-500/40'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-slate-400">{item.parent}</span>
                            <span className="text-cyan-400">↳</span>
                            <span className="text-white font-bold">{item.child}</span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-950 text-cyan-300 border border-slate-800">
                              PID {item.pid}
                            </span>
                            <span className={`text-[10px] px-1.5 py-0.2 rounded uppercase ${
                              item.integrityLevel === 'System' ? 'bg-red-950 text-red-300 border border-red-500/40' : 'bg-amber-950 text-amber-300 border border-amber-500/40'
                            }`}>
                              {item.integrityLevel} Integrity
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 font-mono select-all bg-black/40 px-2 py-1 rounded">
                            {item.cmd}
                          </p>
                          <span className="text-[10px] text-slate-500 block truncate">
                            SHA-256: {item.hash}
                          </span>
                        </div>

                        {!isKilled && (
                          <button
                            type="button"
                            onClick={() => handleKillProcess(item.pid)}
                            className="px-3 py-1.5 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/40 text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0"
                          >
                            <Zap className="w-3.5 h-3.5 text-red-400" />
                            <span>Kill PID {item.pid}</span>
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ADVANCED 3: C2 Beaconing Jitter Analysis */}
              {currentProfile.advancedActivities.networkBeaconing.length > 0 && (
                <div className="p-4 rounded-xl bg-slate-950/90 border border-amber-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                      <Radio className="w-4 h-4 text-amber-400 animate-pulse" />
                      C2 Beaconing Pattern & Network Jitter Analysis
                    </h4>
                    <span className="text-[10px] text-amber-300 font-bold">Heuristic Math Match</span>
                  </div>

                  <div className="space-y-2">
                    {currentProfile.advancedActivities.networkBeaconing.map((beacon, idx) => (
                      <div key={idx} className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-red-400 font-bold">{beacon.destIp}</span>
                            <span className="text-slate-500">({beacon.domain})</span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-1">
                            Interval: Every ~{beacon.beaconIntervalSec}s (±{beacon.jitterPercent}% jitter) • Flag: <strong className="text-white">{beacon.threatIntelFlag}</strong>
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setActionFeedback(`Firewall blacklisted C2 IP ${beacon.destIp}.`);
                            setTimeout(() => setActionFeedback(null), 3000);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs cursor-pointer w-fit"
                        >
                          Drop C2 IP
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

        </div>
      )}

      {/* 6. CYBERSHIELD SOC PRO PAYMENT CHECKOUT MODAL */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-slate-950 border border-amber-500/40 rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl flex flex-col">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold font-mono text-white">
                    Unlock CyberShield SOC Pro Endpoint Forensics
                  </h3>
                  <p className="text-[11px] font-mono text-slate-400">
                    Instant access to Deep Memory, LSASS Triage & Host Isolation
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowPaymentModal(false)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 font-mono text-xs">
              
              {/* Pricing Summary */}
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-white font-bold block text-sm">Enterprise Endpoint Forensics</span>
                  <span className="text-[10px] text-slate-400">Unlimited IP Lookups • Active Response • PCAP Extraction</span>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-amber-400">PKR 4,999</span>
                  <span className="text-[10px] text-slate-500 block">/ Lifetime</span>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-2">
                <label className="block text-slate-400 text-[11px] uppercase">Select Payment Channel</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'card', label: 'Credit Card', icon: CreditCard },
                    { id: 'easypaisa', label: 'Easypaisa', icon: Smartphone },
                    { id: 'jazzcash', label: 'JazzCash', icon: Smartphone },
                    { id: 'raast', label: 'Raast / Bank', icon: Building2 },
                  ].map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setPaymentMethod(id as any)}
                      className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 cursor-pointer transition-all ${
                        paymentMethod === id
                          ? 'bg-amber-950/60 border-amber-500 text-amber-300 font-bold'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-[11px]">{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Fields Based on Selected Method */}
              {paymentMethod === 'card' && (
                <div className="space-y-3 p-3.5 bg-slate-900/60 rounded-xl border border-slate-800">
                  <div>
                    <label className="text-[10px] text-slate-400 uppercase block mb-1">Card Number</label>
                    <input
                      type="text"
                      defaultValue="4242 •••• •••• 4242"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-400 uppercase block mb-1">Expires</label>
                      <input type="text" defaultValue="12/28" className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white" />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 uppercase block mb-1">CVC / CVV</label>
                      <input type="password" defaultValue="883" className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white" />
                    </div>
                  </div>
                </div>
              )}

              {(paymentMethod === 'easypaisa' || paymentMethod === 'jazzcash') && (
                <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-white font-bold capitalize">{paymentMethod} Instant Till</span>
                    <span className="text-emerald-400">0300-1234567</span>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 uppercase block mb-1">Mobile Account Number</label>
                    <input
                      type="text"
                      placeholder="03XX-XXXXXXX"
                      defaultValue="0301-9876543"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                    />
                  </div>
                  <p className="text-[10px] text-slate-500">
                    An authorization MPIN prompt will appear on your {paymentMethod} app to confirm PKR 4,999.
                  </p>
                </div>
              )}

              {paymentMethod === 'raast' && (
                <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800 space-y-1.5 text-[11px]">
                  <p className="text-white font-bold">Meezan Bank & Raast ID</p>
                  <p className="text-slate-400">Account: <span className="text-emerald-400 font-bold">0102-0105849301</span></p>
                  <p className="text-slate-400">Title: <span className="text-white">CyberShield PK Security Ops</span></p>
                  <p className="text-slate-400">Raast ID: <span className="text-cyan-300">03001234567</span></p>
                </div>
              )}

              {/* Actions */}
              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={isPaying}
                  onClick={handleProcessPayment}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-bold text-xs flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(251,191,36,0.3)] transition-all disabled:opacity-50"
                >
                  {isPaying ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Authorizing Payment...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Authorize & Unlock Now</span>
                    </>
                  )}
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
