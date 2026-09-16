import React, { useState } from 'react';
import { 
  X, 
  Radio, 
  ShieldAlert, 
  Server, 
  Cpu, 
  AlertTriangle, 
  CheckCircle2, 
  Terminal, 
  Search, 
  Filter, 
  Eye, 
  Play, 
  RefreshCw,
  ExternalLink,
  Layers,
  Settings,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { SOC_ALERTS, SOC_ENDPOINTS, MITRE_MAPPINGS } from '../data/socData';
import { SocAlert } from '../types';

interface SocSimulatorModalProps {
  onClose: () => void;
}

export const SocSimulatorModal: React.FC<SocSimulatorModalProps> = ({
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'alerts' | 'endpoints' | 'mitre' | 'config'>('alerts');
  const [selectedAlert, setSelectedAlert] = useState<SocAlert | null>(SOC_ALERTS[0]);
  const [alertsList, setAlertsList] = useState<SocAlert[]>(SOC_ALERTS);
  const [simulatedLiveAlertCount, setSimulatedLiveAlertCount] = useState(SOC_ALERTS.length);
  const [isSimulating, setIsSimulating] = useState(true);

  const handleUpdateAlertStatus = (alertId: string, newStatus: SocAlert['status']) => {
    setAlertsList(prev => prev.map(a => a.id === alertId ? { ...a, status: newStatus } : a));
    if (selectedAlert && selectedAlert.id === alertId) {
      setSelectedAlert({ ...selectedAlert, status: newStatus });
    }
  };

  const handleGenerateSimulatedAlert = () => {
    const newId = `ALT-${9043 + alertsList.length}`;
    const syntheticAlert: SocAlert = {
      id: newId,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      severity: 'HIGH',
      ruleName: 'Outbound Reverse TCP Connection to High-Risk ASN Flagged',
      sourceIp: '10.0.4.15',
      destinationIp: '45.33.32.156',
      endpoint: 'DEV-LAPTOP-09',
      mitreTechnique: 'T1571 - Non-Standard Port Communication',
      status: 'NEW',
      logPayload: `{"timestamp":"${new Date().toISOString()}","agent":{"id":"005","name":"DEV-LAPTOP-09","ip":"10.0.4.15"},"rule":{"id":"100192","level":11,"description":"TCP SYN beacon to unknown external IP over port 4444"},"data":{"proto":"tcp","dest_port":4444,"process":"nc.exe"}}`
    };
    setAlertsList([syntheticAlert, ...alertsList]);
    setSelectedAlert(syntheticAlert);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div className="bg-[#070e1a] border border-cyan-500/40 w-full max-w-6xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        {/* Top SOC Bar */}
        <div className="px-5 py-3.5 bg-slate-950/95 border-b border-cyan-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Radio className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-white font-mono tracking-tight">
                  CyberShieldPK Security Operations Center
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 animate-pulse">
                  SIMULATOR MODE
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono">
                Wazuh SIEM Open-Source Telemetry & Event Correlation Sandbox
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleGenerateSimulatedAlert}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 transition-all cursor-pointer"
              title="Simulate incoming adversary intrusion event"
            >
              <Zap className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Trigger Telemetry Event</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Educational Safe-Mode Disclaimer Banner */}
        <div className="bg-cyan-950/50 border-b border-cyan-500/20 px-4 py-2 flex items-center justify-between text-[11px] font-mono text-cyan-200">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400 flex-shrink-0" />
            <span>
              Safe Simulator Environment: Demonstrates real Wazuh alerts, decoders, and MITRE tactics safely without connecting to unverified networks.
            </span>
          </div>
          <span className="hidden md:inline text-slate-400">
            Rule Engine: Wazuh v4.7.2
          </span>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800/80 bg-slate-900/50 px-4 pt-2 gap-2">
          <button
            onClick={() => setActiveTab('alerts')}
            className={`px-4 py-2 text-xs font-mono rounded-t-lg transition-colors flex items-center gap-2 ${
              activeTab === 'alerts'
                ? 'bg-slate-950 text-cyan-400 border-t border-x border-slate-800 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Live Alerts ({alertsList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('endpoints')}
            className={`px-4 py-2 text-xs font-mono rounded-t-lg transition-colors flex items-center gap-2 ${
              activeTab === 'endpoints'
                ? 'bg-slate-950 text-emerald-400 border-t border-x border-slate-800 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>Monitored Agents ({SOC_ENDPOINTS.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('mitre')}
            className={`px-4 py-2 text-xs font-mono rounded-t-lg transition-colors flex items-center gap-2 ${
              activeTab === 'mitre'
                ? 'bg-slate-950 text-purple-400 border-t border-x border-slate-800 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>MITRE ATT&CK Matrix</span>
          </button>

          <button
            onClick={() => setActiveTab('config')}
            className={`px-4 py-2 text-xs font-mono rounded-t-lg transition-colors flex items-center gap-2 ${
              activeTab === 'config'
                ? 'bg-slate-950 text-amber-400 border-t border-x border-slate-800 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Wazuh Node Configuration</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-hidden">
          {/* Alerts Tab */}
          {activeTab === 'alerts' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 h-full overflow-hidden">
              {/* Alert List Left */}
              <div className="lg:col-span-6 border-b lg:border-b-0 lg:border-r border-slate-800 overflow-y-auto divide-y divide-slate-800/60 p-3 space-y-2">
                {alertsList.map((alert) => {
                  const isSelected = selectedAlert?.id === alert.id;
                  const sevColor = 
                    alert.severity === 'CRITICAL' ? 'bg-rose-950/80 text-rose-400 border-rose-500/40' :
                    alert.severity === 'HIGH' ? 'bg-amber-950/80 text-amber-400 border-amber-500/40' :
                    alert.severity === 'MEDIUM' ? 'bg-yellow-950/80 text-yellow-400 border-yellow-500/40' :
                    'bg-cyan-950/80 text-cyan-400 border-cyan-500/40';

                  return (
                    <div
                      key={alert.id}
                      onClick={() => setSelectedAlert(alert)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer ${
                        isSelected 
                          ? 'bg-slate-900 border-cyan-500/50 shadow-md' 
                          : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-900/60'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className={`text-[10px] font-mono px-2 py-0.2 rounded border ${sevColor}`}>
                          {alert.severity}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">
                          {alert.timestamp}
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-white leading-snug line-clamp-1 mt-1">
                        {alert.ruleName}
                      </h4>

                      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mt-2">
                        <span>Agent: <strong className="text-cyan-300">{alert.endpoint}</strong></span>
                        <span className="text-slate-300">{alert.status}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Selected Alert Inspection Right */}
              <div className="lg:col-span-6 p-6 overflow-y-auto space-y-5 bg-slate-950/80">
                {selectedAlert ? (
                  <>
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div>
                        <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">
                          Alert ID: {selectedAlert.id}
                        </span>
                        <h3 className="text-base font-bold text-white mt-0.5">
                          {selectedAlert.ruleName}
                        </h3>
                      </div>

                      {/* Status Selector */}
                      <div className="flex items-center gap-1.5">
                        {(['NEW', 'INVESTIGATING', 'CONTAINED', 'RESOLVED'] as const).map(st => (
                          <button
                            key={st}
                            onClick={() => handleUpdateAlertStatus(selectedAlert.id, st)}
                            className={`px-2 py-1 text-[10px] font-mono rounded transition-colors ${
                              selectedAlert.status === st
                                ? 'bg-cyan-500 text-slate-950 font-bold'
                                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Threat Details Grid */}
                    <div className="grid grid-cols-2 gap-3 text-xs font-mono bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                      <div>
                        <span className="text-slate-500 block">Source IP:</span>
                        <span className="text-slate-200">{selectedAlert.sourceIp}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Target / Destination:</span>
                        <span className="text-slate-200">{selectedAlert.destinationIp}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Monitored Endpoint:</span>
                        <span className="text-cyan-300">{selectedAlert.endpoint}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">MITRE Technique:</span>
                        <span className="text-amber-400">{selectedAlert.mitreTechnique}</span>
                      </div>
                    </div>

                    {/* Raw Wazuh Syslog Payload */}
                    <div className="space-y-2">
                      <span className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider block">
                        Raw SIEM JSON Payload:
                      </span>
                      <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-cyan-300 overflow-x-auto whitespace-pre-wrap select-text leading-relaxed">
                        <code>{selectedAlert.logPayload}</code>
                      </pre>
                    </div>

                    {/* Recommended Analyst Playbook Action */}
                    <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30 space-y-2 text-xs">
                      <span className="font-mono text-cyan-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                        Analyst Containment Playbook
                      </span>
                      <p className="text-slate-300 leading-relaxed">
                        1. Isolate endpoint <code>{selectedAlert.endpoint}</code> at firewall or host level. <br />
                        2. Query Sysmon process ancestry for parent execution command. <br />
                        3. Extract volatile RAM sample if credential dumping activity is confirmed. <br />
                        4. Revoke compromised credentials and rotate Kerberos krbtgt ticket if Active Directory DC is impacted.
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-20 text-slate-500 font-mono text-xs">
                    Select an alert from the queue to view full forensic telemetry.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Monitored Endpoints Tab */}
          {activeTab === 'endpoints' && (
            <div className="p-6 overflow-y-auto space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white font-mono">
                  Active Wazuh Endpoint Agents ({SOC_ENDPOINTS.length})
                </h3>
                <span className="text-xs font-mono text-emerald-400">
                  Cluster Status: Normal (Zero drops)
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {SOC_ENDPOINTS.map((ep) => (
                  <div key={ep.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 font-mono text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{ep.hostname}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                        {ep.wazuhStatus}
                      </span>
                    </div>

                    <div className="space-y-1 text-slate-400 text-[11px]">
                      <div>IP: <span className="text-slate-200">{ep.ip}</span></div>
                      <div>OS: <span className="text-cyan-300">{ep.os}</span></div>
                      <div>Agent ID: <span className="text-slate-200">{ep.agentId}</span></div>
                      <div>Last Ping: <span className="text-slate-400">{ep.lastKeepAlive}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MITRE ATT&CK Tab */}
          {activeTab === 'mitre' && (
            <div className="p-6 overflow-y-auto space-y-4">
              <h3 className="text-sm font-bold text-white font-mono">
                MITRE ATT&CK Detection Matrix Coverage
              </h3>
              <p className="text-xs text-slate-400">
                Wazuh correlation rules currently active in the simulator mapped to MITRE enterprise tactics.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {MITRE_MAPPINGS.map((m, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-cyan-400 font-bold">{m.technique}</span>
                      <span className="text-slate-400">{m.count} Triggered</span>
                    </div>
                    <div className="text-xs font-semibold text-white">{m.name}</div>
                    <div className="flex flex-wrap gap-1">
                      {m.tactics.map((t, tIdx) => (
                        <span key={tIdx} className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-purple-950 text-purple-300 border border-purple-500/30">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Wazuh Configuration UI */}
          {activeTab === 'config' && (
            <div className="p-6 overflow-y-auto space-y-6 max-w-3xl">
              <div>
                <h3 className="text-base font-bold text-white font-mono">
                  Wazuh Cluster Connection Guidance
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  How to securely deploy and connect production or lab Wazuh agents to your central SIEM indexer.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 font-mono text-xs">
                <span className="text-cyan-300 font-bold block">1. Linux Agent Enrollment Command:</span>
                <pre className="p-3 bg-slate-900 rounded-lg text-emerald-400 overflow-x-auto">
                  <code>WAZUH_MANAGER="soc.cybershield.org" apt-get install wazuh-agent</code>
                </pre>

                <span className="text-cyan-300 font-bold block pt-2">2. Windows PowerShell Enrollment:</span>
                <pre className="p-3 bg-slate-900 rounded-lg text-emerald-400 overflow-x-auto">
                  <code>Invoke-WebRequest -Uri https://packages.wazuh.com/4.x/windows/wazuh-agent-4.7.2.msi -OutFile wazuh-agent.msi; msiexec.exe /i wazuh-agent.msi /q WAZUH_MANAGER='soc.cybershield.org'</code>
                </pre>
              </div>

              <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/30 text-xs text-amber-200 leading-relaxed">
                <strong>Defensive Ethics Notice:</strong> Only enroll systems that you own or have explicit, documented legal authorization to monitor. Deploying unauthorized telemetry or monitoring agents onto third-party systems is illegal.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
