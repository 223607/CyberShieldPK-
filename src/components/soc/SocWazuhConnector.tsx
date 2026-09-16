import React, { useState, useEffect } from 'react';
import { 
  Terminal, 
  Copy, 
  Check, 
  Play, 
  ShieldCheck, 
  Radio, 
  Server, 
  Cpu, 
  RefreshCw, 
  Search, 
  Filter, 
  AlertTriangle, 
  CheckCircle2, 
  FileCode, 
  Laptop,
  Zap,
  ArrowRight
} from 'lucide-react';
import { WazuhLiveLog, initialWazuhLogs } from '../../data/socDashboardData';

export const SocWazuhConnector: React.FC = () => {
  // Config state
  const [pcName, setPcName] = useState('WIN11-OFFICE-01');
  const [targetIp, setTargetIp] = useState('192.168.1.105');
  const [apiKey] = useState('CS-PK-WZ-884920-SECURE');
  const [managerUrl] = useState('soc.cybershield.pk');

  // Copy feedback state
  const [copiedCmd1, setCopiedCmd1] = useState(false);
  const [copiedCmd2, setCopiedCmd2] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);

  // Simulated Terminal State
  const [terminalRunning, setTerminalRunning] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [agentConnected, setAgentConnected] = useState(true);

  // Live Ingested Logs State
  const [logs, setLogs] = useState<WazuhLiveLog[]>(initialWazuhLogs);
  const [searchFilter, setSearchFilter] = useState('');
  const [channelFilter, setChannelFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');
  const [selectedLog, setSelectedLog] = useState<WazuhLiveLog | null>(null);
  const [isLiveStreaming, setIsLiveStreaming] = useState(true);

  // Dynamic Commands based on state
  const command1 = `Invoke-WebRequest -Uri https://packages.wazuh.com/4.x/windows/wazuh-agent-4.8.0-1.msi -OutFile "\${env:TEMP}\\wazuh-agent.msi"; Start-Process msiexec.exe -ArgumentList '/i', "\${env:TEMP}\\wazuh-agent.msi", '/q', 'WAZUH_MANAGER="${managerUrl}"', 'WAZUH_REGISTRATION_SERVER="${managerUrl}"', 'WAZUH_AGENT_NAME="${pcName}"', 'WAZUH_API_KEY="${apiKey}"' -Wait`;

  const command2 = `NET START WazuhSvc; Start-Service -Name "wazuh-agent"; & "C:\\Program Files (x86)\\ossec-agent\\wazuh-control.bat" start; Get-Service -Name "wazuh-agent"`;

  const copyToClipboard = (text: string, setFn: (v: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setFn(true);
    setTimeout(() => setFn(false), 2000);
  };

  // Run Terminal Simulation
  const handleRunTerminalSimulation = () => {
    setTerminalRunning(true);
    setTerminalLogs([]);
    const steps = [
      `PS C:\\Windows\\system32> # Step 1: Querying CyberShield Wazuh Manager API (${managerUrl}:55000)...`,
      `[+] TLS Handshake established with https://${managerUrl}:55000`,
      `[+] Wazuh API Auth: Bearer Token granted for Agent Registration API`,
      `[+] Downloading Windows Agent MSI from secure repository... [100%]`,
      `[+] Executing msiexec.exe /i wazuh-agent.msi /q with Agent Name: '${pcName}' (Assigned IP: ${targetIp})`,
      `[+] Wazuh Manager registered agent successfully. Assigned Wazuh Agent ID: 007`,
      `PS C:\\Windows\\system32> # Step 2: Starting Wazuh Agent Daemon & Windows Service...`,
      `[+] NET START WazuhSvc: The Wazuh service was started successfully.`,
      `[+] Hooked Windows Event Channels: Security (Audit), Microsoft-Windows-Sysmon/Operational, System`,
      `[+] Establishing TLS log forwarding session to ${managerUrl}:1514 (AES-256-GCM)...`,
      `[✓] SUCCESS: Connected to CyberShield SOC! Windows endpoint '${pcName}' is actively streaming telemetry.`
    ];

    steps.forEach((line, idx) => {
      setTimeout(() => {
        setTerminalLogs(prev => [...prev, line]);
        if (idx === steps.length - 1) {
          setTerminalRunning(false);
          setAgentConnected(true);
        }
      }, (idx + 1) * 350);
    });
  };

  // Auto-stream random simulated Windows log every 8 seconds if active
  useEffect(() => {
    if (!isLiveStreaming) return;
    const interval = setInterval(() => {
      const syntheticPool: WazuhLiveLog[] = [
        {
          id: `WZ-LOG-${Math.floor(1000 + Math.random() * 9000)}`,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
          eventId: 1,
          provider: 'Microsoft-Windows-Sysmon',
          level: 'INFORMATION',
          channel: 'Microsoft-Windows-Sysmon/Operational',
          computer: pcName,
          processName: 'svchost.exe',
          commandLine: 'svchost.exe -k LocalServiceNetworkRestricted -p -s Dhcp',
          user: 'NT AUTHORITY\\LOCAL SERVICE',
          ruleId: '60010',
          ruleDescription: 'Standard Windows DHCP Network Lease renewal',
          mitreTactic: 'Normal Telemetry'
        },
        {
          id: `WZ-LOG-${Math.floor(1000 + Math.random() * 9000)}`,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
          eventId: 3,
          provider: 'Microsoft-Windows-Sysmon',
          level: 'WARNING',
          channel: 'Microsoft-Windows-Sysmon/Operational',
          computer: pcName,
          sourceIp: '104.244.42.1',
          processName: 'powershell.exe',
          commandLine: 'powershell.exe -Command "Invoke-RestMethod -Uri https://icanhazip.com"',
          user: 'CORP\\m.zaib',
          ruleId: '92020',
          ruleDescription: 'Outbound HTTP query to external IP resolver utility',
          mitreTactic: 'Discovery (T1016)'
        }
      ];
      const randomLog = syntheticPool[Math.floor(Math.random() * syntheticPool.length)];
      setLogs(prev => [randomLog, ...prev.slice(0, 40)]);
    }, 9000);

    return () => clearInterval(interval);
  }, [isLiveStreaming, pcName]);

  // Inject a manual synthetic attack log
  const handleInjectAdversaryLog = () => {
    const attackLog: WazuhLiveLog = {
      id: `WZ-LOG-${Math.floor(9500 + Math.random() * 499)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      eventId: 10,
      provider: 'Microsoft-Windows-Sysmon',
      level: 'CRITICAL',
      channel: 'Microsoft-Windows-Sysmon/Operational',
      computer: pcName,
      processName: 'mimikatz.exe',
      commandLine: 'mimikatz.exe "privilege::debug" "sekurlsa::logonpasswords" exit',
      user: 'NT AUTHORITY\\SYSTEM',
      ruleId: '92004',
      ruleDescription: 'Mimikatz memory dump targeting LSASS handle (0x1010)',
      mitreTactic: 'Credential Access (T1003.001)'
    };
    setLogs(prev => [attackLog, ...prev]);
    setSelectedLog(attackLog);
  };

  const filteredLogs = logs.filter(l => {
    const matchSearch = searchFilter === '' || 
      l.computer.toLowerCase().includes(searchFilter.toLowerCase()) ||
      l.processName?.toLowerCase().includes(searchFilter.toLowerCase()) ||
      l.commandLine?.toLowerCase().includes(searchFilter.toLowerCase()) ||
      l.ruleDescription.toLowerCase().includes(searchFilter.toLowerCase()) ||
      l.user.toLowerCase().includes(searchFilter.toLowerCase());
    const matchChannel = channelFilter === 'all' || l.channel === channelFilter;
    const matchLevel = levelFilter === 'all' || l.level === levelFilter;
    return matchSearch && matchChannel && matchLevel;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* 1. Header Overview Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-[#071324] border border-cyan-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="w-8 h-8 rounded-xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Terminal className="w-4 h-4" />
            </span>
            <h2 className="text-base sm:text-lg font-bold font-mono text-white tracking-tight">
              Wazuh Agent Deployment & API Ingestion
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              API PORT 55000 ONLINE
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono">
            Execute the two Windows PowerShell commands below to bind any workstation/server directly to CyberShield SOC.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleInjectAdversaryLog}
            className="px-3 py-2 rounded-xl text-xs font-mono font-bold bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/40 flex items-center gap-2 cursor-pointer transition-all"
            title="Inject an adversary detection into live stream"
          >
            <Zap className="w-3.5 h-3.5 text-red-400" />
            <span>Simulate PC Attack Event</span>
          </button>
        </div>
      </div>

      {/* 2. Endpoint Configuration Inputs */}
      <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-3 font-mono text-xs">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Laptop className="w-4 h-4 text-cyan-400" />
          Target Windows PC Parameters
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-slate-400 text-[10px] uppercase mb-1">Target PC Hostname</label>
            <input
              type="text"
              value={pcName}
              onChange={(e) => setPcName(e.target.value.toUpperCase().replace(/[^A-Z0-9_-]/g, ''))}
              placeholder="e.g. WIN11-OFFICE-01"
              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 text-[10px] uppercase mb-1">Assigned IP Address</label>
            <input
              type="text"
              value={targetIp}
              onChange={(e) => setTargetIp(e.target.value)}
              placeholder="e.g. 192.168.1.105"
              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 text-[10px] uppercase mb-1">Wazuh Manager Ingress</label>
            <div className="px-3 py-2 bg-slate-900/60 border border-slate-800 rounded-lg text-cyan-300 font-mono flex items-center justify-between">
              <span>{managerUrl}:1514</span>
              <span className="text-[10px] text-emerald-400">TLS AES-GCM</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. The Two Windows Terminal Commands */}
      <div className="grid grid-cols-1 gap-4">
        
        {/* COMMAND 1 */}
        <div className="p-4 rounded-xl bg-slate-950/90 border border-cyan-500/30 space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-cyan-500 text-slate-950 font-bold text-xs flex items-center justify-center font-mono">
                1
              </span>
              <h4 className="text-xs sm:text-sm font-bold font-mono text-white">
                Command 1: Download & Register Agent via CyberShield Wazuh API
              </h4>
            </div>

            <button
              type="button"
              onClick={() => copyToClipboard(command1, setCopiedCmd1)}
              className="px-3 py-1.5 rounded-lg bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer transition-all"
            >
              {copiedCmd1 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCmd1 ? 'Copied to Clipboard!' : 'Copy Command 1'}</span>
            </button>
          </div>

          <p className="text-[11px] font-mono text-slate-400">
            Run in <strong>Windows Terminal (PowerShell as Administrator)</strong>. Registers endpoint with CyberShield Wazuh API.
          </p>

          <div className="p-3 bg-black/90 border border-slate-800 rounded-lg overflow-x-auto text-xs font-mono text-cyan-300 select-all leading-relaxed whitespace-pre-wrap">
            {command1}
          </div>
        </div>

        {/* COMMAND 2 */}
        <div className="p-4 rounded-xl bg-slate-950/90 border border-emerald-500/30 space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center font-mono">
                2
              </span>
              <h4 className="text-xs sm:text-sm font-bold font-mono text-white">
                Command 2: Start Wazuh Service & Stream Dashboard Telemetry
              </h4>
            </div>

            <button
              type="button"
              onClick={() => copyToClipboard(command2, setCopiedCmd2)}
              className="px-3 py-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer transition-all"
            >
              {copiedCmd2 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCmd2 ? 'Copied to Clipboard!' : 'Copy Command 2'}</span>
            </button>
          </div>

          <p className="text-[11px] font-mono text-slate-400">
            Starts the background Windows daemon (`wazuh-agent`) and hooks Sysmon/Event Viewer channels into this dashboard.
          </p>

          <div className="p-3 bg-black/90 border border-slate-800 rounded-lg overflow-x-auto text-xs font-mono text-emerald-300 select-all leading-relaxed whitespace-pre-wrap">
            {command2}
          </div>
        </div>
      </div>

      {/* 4. Interactive PowerShell Terminal Simulator */}
      <div className="p-4 rounded-xl bg-[#040810] border border-slate-800 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            </div>
            <span className="text-xs font-mono text-slate-400 ml-2">
              Administrator: Windows PowerShell — {pcName}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={terminalRunning}
              onClick={handleRunTerminalSimulation}
              className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-mono text-xs flex items-center gap-1.5 cursor-pointer transition-all disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5" />
              <span>{terminalRunning ? 'Simulating Execution...' : 'Simulate Running Commands in Terminal'}</span>
            </button>
          </div>
        </div>

        {/* Terminal Window Output */}
        <div className="p-3.5 bg-black rounded-lg border border-slate-800/80 font-mono text-xs text-slate-300 h-48 overflow-y-auto space-y-1">
          <p className="text-slate-500">Windows PowerShell</p>
          <p className="text-slate-500">Copyright (C) Microsoft Corporation. All rights reserved.</p>
          <p className="text-cyan-400 pt-1">PS C:\Windows\system32&gt; # Ready. Click 'Simulate Running Commands' above to test.</p>
          
          {terminalLogs.map((logLine, i) => (
            <p 
              key={i} 
              className={`leading-relaxed ${
                logLine.includes('[✓]') ? 'text-emerald-400 font-bold' :
                logLine.includes('[+]') ? 'text-cyan-300' :
                logLine.includes('PS C:') ? 'text-amber-400 font-bold' :
                'text-slate-300'
              }`}
            >
              {logLine}
            </p>
          ))}

          {terminalRunning && (
            <p className="text-cyan-400 animate-pulse">▌</p>
          )}
        </div>
      </div>

      {/* 5. Live Windows Event Logs Ingestion Stream */}
      <div className="rounded-xl bg-slate-950/90 border border-slate-800 overflow-hidden">
        <div className="p-4 bg-slate-900/80 border-b border-slate-800 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            <h3 className="text-xs sm:text-sm font-bold font-mono text-white uppercase tracking-wider">
              Live Ingested Windows Event Logs & Sysmon Stream ({pcName})
            </h3>
          </div>

          <div className="relative ml-auto">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search process, command, user..."
              className="pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-52"
            />
          </div>

          <select
            value={channelFilter}
            onChange={(e) => setChannelFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Channels</option>
            <option value="Microsoft-Windows-Sysmon/Operational">Sysmon</option>
            <option value="Security">Security Auditing</option>
            <option value="System">System</option>
          </select>

          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Levels</option>
            <option value="CRITICAL">Critical</option>
            <option value="WARNING">Warning</option>
            <option value="INFORMATION">Information</option>
          </select>

          <button
            type="button"
            onClick={() => setIsLiveStreaming(!isLiveStreaming)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer ${
              isLiveStreaming ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' : 'bg-slate-900 text-slate-400 border border-slate-800'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isLiveStreaming ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
            <span>{isLiveStreaming ? 'Live Streaming' : 'Stream Paused'}</span>
          </button>
        </div>

        {/* Logs Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs whitespace-nowrap">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 text-[11px]">
                <th className="px-4 py-2.5">Timestamp</th>
                <th className="px-4 py-2.5">Event ID</th>
                <th className="px-4 py-2.5">Level</th>
                <th className="px-4 py-2.5">Provider / Channel</th>
                <th className="px-4 py-2.5">Process / Trigger</th>
                <th className="px-4 py-2.5">User Context</th>
                <th className="px-4 py-2.5">Wazuh Rule Description</th>
                <th className="px-4 py-2.5 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredLogs.map((log) => (
                <tr 
                  key={log.id} 
                  className={`hover:bg-slate-900/50 transition-colors ${
                    log.level === 'CRITICAL' ? 'bg-red-950/20' : ''
                  }`}
                >
                  <td className="px-4 py-2.5 text-slate-400 text-[11px]">{log.timestamp}</td>
                  <td className="px-4 py-2.5 font-bold text-cyan-400">ID {log.eventId}</td>
                  <td className="px-4 py-2.5">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                      log.level === 'CRITICAL' ? 'bg-red-950 text-red-300 border border-red-500/40' :
                      log.level === 'WARNING' ? 'bg-amber-950 text-amber-300 border border-amber-500/40' :
                      'bg-slate-900 text-slate-400 border border-slate-800'
                    }`}>
                      {log.level}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-slate-400 text-[11px] truncate max-w-[160px]">
                    {log.provider}
                  </td>
                  <td className="px-4 py-2.5 font-bold text-white">
                    {log.processName || 'N/A'}
                  </td>
                  <td className="px-4 py-2.5 text-slate-400 text-[11px]">{log.user}</td>
                  <td className="px-4 py-2.5 text-slate-200 max-w-[280px] truncate">
                    {log.ruleDescription}
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedLog(log)}
                      className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-800 text-[11px] cursor-pointer"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. Forensic Log Inspection Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-cyan-500/40 rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl p-5 space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                <h3 className="text-sm font-bold text-white uppercase">
                  Wazuh Ingestion Log Inspector ({selectedLog.id})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-slate-300">
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">Computer / Host</span>
                  <span className="text-white font-bold">{selectedLog.computer}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">Wazuh Rule ID</span>
                  <span className="text-cyan-400 font-bold">{selectedLog.ruleId}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">Event ID & Channel</span>
                  <span className="text-white">{selectedLog.eventId} • {selectedLog.channel}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">MITRE Tactic</span>
                  <span className="text-red-400 font-bold">{selectedLog.mitreTactic || 'N/A'}</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 uppercase block mb-1">Rule Description</span>
                <p className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 text-white font-bold">
                  {selectedLog.ruleDescription}
                </p>
              </div>

              {selectedLog.commandLine && (
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block mb-1">Raw Command-Line Execution</span>
                  <pre className="p-3 bg-black rounded-lg border border-slate-800 text-cyan-300 text-[11px] overflow-x-auto whitespace-pre-wrap select-all">
                    {selectedLog.commandLine}
                  </pre>
                </div>
              )}

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedLog(null)}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold cursor-pointer"
                >
                  Close Inspection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
