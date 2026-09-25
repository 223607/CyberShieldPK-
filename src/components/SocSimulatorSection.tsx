import React, { useState, useEffect } from 'react';
import { getSocAgents, getSocAlerts, subscribeSocAlerts } from '../services/socApi';
import { 
  Radio, 
  ShieldAlert, 
  Terminal, 
  Activity, 
  Server, 
  Cpu, 
  ExternalLink, 
  Play, 
  CheckCircle2, 
  AlertTriangle, 
  Maximize2,
  RefreshCw,
  HardDrive,
  Laptop,
  ShieldCheck,
  Zap,
  Flame
} from 'lucide-react';

interface SocSimulatorSectionProps {
  onOpenSocModal: () => void;
}

interface SimulatedLog {
  id: string;
  time: string;
  level: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'INFO';
  agent: string;
  rule: string;
  description: string;
}

export const SocSimulatorSection: React.FC<SocSimulatorSectionProps> = ({ onOpenSocModal }) => {
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'CRITICAL' | 'HIGH'>('ALL');
  const [liveEventCount, setLiveEventCount] = useState(14820);
  const [isSimulating, setIsSimulating] = useState(false);
  const [realAgents, setRealAgents] = useState<any[]>([]);
  const [realAlertCount, setRealAlertCount] = useState(0);
  const [socConnected, setSocConnected] = useState(false);

  const [logs, setLogs] = useState<SimulatedLog[]>([
    {
      id: 'log-1',
      time: 'Just now',
      level: 'CRITICAL',
      agent: 'DC-PROD-01 (10.0.1.5)',
      rule: 'Rule 100084 (Level 14)',
      description: 'MITRE T1003.001 - LSASS Memory Dump attempted via powershell.exe'
    },
    {
      id: 'log-2',
      time: '12s ago',
      level: 'HIGH',
      agent: 'WEB-GATEWAY (192.168.10.45)',
      rule: 'Rule 100210 (Level 12)',
      description: 'Wazuh Active Response: Remote IP 185.220.101.4 blocked on iptables'
    },
    {
      id: 'log-3',
      time: '45s ago',
      level: 'MEDIUM',
      agent: 'ENDPOINT-WIN11 (10.0.3.18)',
      rule: 'Rule 5501 (Level 7)',
      description: 'Integrity Check (FIM): Modified System32\\drivers\\etc\\hosts file'
    },
    {
      id: 'log-4',
      time: '2m ago',
      level: 'INFO',
      agent: 'WAZUH-MANAGER (10.0.1.2)',
      rule: 'Rule 100001 (Level 3)',
      description: 'Agent Keep-Alive Heartbeat ACK received from 14 online defensive nodes'
    }
  ]);

  useEffect(() => {
    let mounted=true;
    Promise.all([getSocAgents(),getSocAlerts()]).then(([agents,alerts])=>{
      if(!mounted)return;
      setRealAgents(agents); setRealAlertCount(alerts.length); setLiveEventCount(alerts.length); setSocConnected(true);
    }).catch(()=>setSocConnected(false));
    const stop=subscribeSocAlerts(()=>{if(mounted){setRealAlertCount(v=>v+1);setLiveEventCount(v=>v+1);}},setSocConnected);
    return ()=>{mounted=false;stop();};
  }, []);

  // Simulation is disabled by default; real Wazuh SSE is the live source.
  useEffect(() => {
    if (!isSimulating) return;
    const interval = setInterval(() => {
      setLiveEventCount(prev => prev + Math.floor(Math.random() * 4) + 1);
    }, 2500);
    return () => clearInterval(interval);
  }, [isSimulating]);

  const filteredLogs = activeFilter === 'ALL' 
    ? logs 
    : logs.filter(l => l.level === activeFilter);

  return (
    <section id="soc-simulator" className="py-20 border-b border-slate-800/80 bg-[#060c18] relative overflow-hidden w-full max-w-full">
      {/* Background cyber ambient gradients */}
      <div className="absolute top-1/3 -right-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10 w-full">
        {/* Header with Title & Full Workspace Trigger */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs uppercase tracking-widest mb-2">
              <Radio className="w-4 h-4 animate-pulse" />
              <span>Live Defensive Operations & Wazuh SIEM</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Enterprise SOC & Wazuh SIEM
            </h2>
            <p className="mt-2 text-slate-400 text-sm sm:text-base max-w-2xl">
              Experience an authentic Tier-1 and Tier-2 Security Operations Center. Monitor active host heartbeats, inspect Sysmon alerts, analyze MITRE ATT&CK vectors, and execute real-time incident responses.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onOpenSocModal}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-mono text-xs font-bold hover:from-emerald-400 hover:to-cyan-400 transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
            >
              <Maximize2 className="w-4 h-4" />
              <span>Launch Full SOC Workspace (11 Modules)</span>
            </button>
          </div>
        </div>

        {/* Real-time KPI Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-[#091322] border border-slate-800 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-mono text-slate-400 uppercase">Monitored Agents</div>
              <div className="text-lg font-bold text-white flex items-center gap-1.5">
                <span>{realAgents.length ? realAgents.filter(a => a.status === 'active').length + ' Active' : '— Active'}</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#091322] border border-slate-800 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-mono text-slate-400 uppercase">Events Analyzed</div>
              <div className="text-lg font-bold text-cyan-300 font-mono">
                {liveEventCount.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#091322] border border-slate-800 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-red-500/15 border border-red-500/30 text-red-400 flex items-center justify-center">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-mono text-slate-400 uppercase">Mitigated Attacks</div>
              <div className="text-lg font-bold text-white font-mono">{realAlertCount || '—'} Live</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#091322] border border-slate-800 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-purple-500/15 border border-purple-500/30 text-purple-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-mono text-slate-400 uppercase">Decoders & Rules</div>
              <div className="text-lg font-bold text-white font-mono">{socConnected ? 'Wazuh Connected' : 'Wazuh Offline'}</div>
            </div>
          </div>
        </div>

        {/* Interactive Live Stream Console */}
        <div className="rounded-2xl bg-[#070f1e] border border-slate-800 overflow-hidden shadow-2xl">
          {/* Console Top Toolbar */}
          <div className="p-4 bg-[#091426] border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
              </div>
              <span className="text-xs font-mono text-slate-300 font-bold flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                <span>WAZUH SIEM TELEMETRY STREAM</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">Filter Severity:</span>
              {(['ALL', 'CRITICAL', 'HIGH'] as const).map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                  className={`px-2.5 py-1 text-[10px] font-mono rounded cursor-pointer transition-colors ${
                    activeFilter === filter
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {filter}
                </button>
              ))}
              <button
                type="button"
                onClick={onOpenSocModal}
                className="ml-2 px-3 py-1 text-xs font-mono text-emerald-400 hover:text-emerald-300 bg-emerald-950/40 border border-emerald-500/30 rounded flex items-center gap-1 cursor-pointer"
              >
                <span>Full View</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Table / Event Feed */}
          <div className="overflow-x-auto max-w-full">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 bg-[#060c18]">
                  <th className="px-4 py-3">TIMESTAMP</th>
                  <th className="px-4 py-3">SEVERITY</th>
                  <th className="px-4 py-3">AGENT NODE</th>
                  <th className="px-4 py-3">RULE & MITRE</th>
                  <th className="px-4 py-3">DESCRIPTION</th>
                  <th className="px-4 py-3 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3 text-slate-400 whitespace-nowrap">{log.time}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.level === 'CRITICAL' 
                          ? 'bg-red-950/80 text-red-400 border border-red-500/40'
                          : log.level === 'HIGH'
                          ? 'bg-amber-950/80 text-amber-400 border border-amber-500/40'
                          : log.level === 'MEDIUM'
                          ? 'bg-blue-950/80 text-blue-400 border border-blue-500/40'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {log.level}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-white font-medium whitespace-nowrap">{log.agent}</td>
                    <td className="px-4 py-3 text-cyan-300 whitespace-nowrap">{log.rule}</td>
                    <td className="px-4 py-3 text-slate-300 max-w-xs truncate">{log.description}</td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={onOpenSocModal}
                        className="px-2 py-1 text-[10px] text-cyan-400 hover:text-cyan-300 hover:underline cursor-pointer"
                      >
                        Investigate →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Interactive Action Footer */}
          <div className="p-4 bg-[#081222] border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Telemetry streaming via Wazuh Event Bus port 1514 (AES-256 encrypted)</span>
            </div>
            <button
              type="button"
              onClick={onOpenSocModal}
              className="px-4 py-2 rounded-lg bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/40 font-mono font-bold flex items-center gap-2 transition-all cursor-pointer"
            >
              <span>Open 11-Module SOC Operations Console</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
