import React, { useState, useEffect } from 'react';
import { 
  X, 
  Radio, 
  ShieldAlert, 
  Server, 
  Flame, 
  Network, 
  Bug, 
  FileBarChart2, 
  Settings, 
  Zap, 
  Activity, 
  Maximize2, 
  Minimize2, 
  RefreshCw, 
  Menu, 
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Terminal,
  Bell,
  Laptop
} from 'lucide-react';
import { SocDashboardOverview } from './soc/SocDashboardOverview';
import { SocThreatIntel } from './soc/SocThreatIntel';
import { SocAlertsPage } from './soc/SocAlertsPage';
import { SocIncidentsPage } from './soc/SocIncidentsPage';
import { SocNetworkPage } from './soc/SocNetworkPage';
import { SocVulnerabilitiesPage } from './soc/SocVulnerabilitiesPage';
import { SocReportsPage } from './soc/SocReportsPage';
import { SocSettingsPage } from './soc/SocSettingsPage';
import { SocWazuhConnector } from './soc/SocWazuhConnector';
import { SocEndpointInspector } from './soc/SocEndpointInspector';
import { SocRealtimeAgentMonitor } from './soc/SocRealtimeAgentMonitor';
import { Alert, AlertStatus } from '../data/socDashboardData';
import { getSocAlerts, getSocAgents, subscribeSocAlerts } from '../services/socApi';
import type { LiveSocAlert } from '../services/socApi';

interface SocSimulatorModalProps {
  onClose: () => void;
}

export type SocTab = 
  | 'overview' 
  | 'realtime-agent'
  | 'wazuh-connector'
  | 'endpoint-inspector'
  | 'threat-intel' 
  | 'alerts' 
  | 'incidents' 
  | 'network' 
  | 'vulnerabilities' 
  | 'reports' 
  | 'settings';

export const SocSimulatorModal: React.FC<SocSimulatorModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<SocTab>('overview');
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [selectedAlertForInspection, setSelectedAlertForInspection] = useState<Alert | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [recentNotification, setRecentNotification] = useState<string | null>(null);
  const [socConnected, setSocConnected] = useState(false);
  const [agentCount, setAgentCount] = useState({ total: 0, active: 0 });

  // Real Wazuh feed: initial REST snapshot + Server-Sent Events for new alerts.
  useEffect(() => {
    let mounted = true;
    const mapAlert = (a: LiveSocAlert): Alert => ({
      id: a.id, timestamp: a.timestamp, type: a.ruleName,
      severity: a.severity === 'CRITICAL' ? 'critical' : a.severity === 'HIGH' ? 'high' : a.severity === 'MEDIUM' ? 'medium' : 'low',
      status: 'open', source: a.sourceIp || a.endpoint, destination: a.destinationIp || '-', protocol: 'Wazuh', port: 0, country: '-', description: a.ruleName
    });
    (async () => {
      try {
        const [liveAlerts, agents] = await Promise.all([getSocAlerts(), getSocAgents()]);
        if (!mounted) return;
        if (liveAlerts.length) setAlerts(liveAlerts.map(mapAlert));
        setAgentCount({ total: agents.length, active: agents.filter((a:any) => a.status === 'active').length });
        setSocConnected(true);
      } catch { setSocConnected(false); }
    })();
    const stop = subscribeSocAlerts(a => {
      if (!mounted) return;
      const item = mapAlert(a);
      setAlerts(prev => [item, ...prev.filter(x => x.id !== item.id)].slice(0,200));
      setSocConnected(true);
    }, setSocConnected);
    return () => { mounted = false; stop(); };
  }, []);

  // Live real-time clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { hour12: false }) + ' PKT');
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Update status of an individual alert
  const handleUpdateAlertStatus = (alertId: string, newStatus: AlertStatus) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status: newStatus } : a));
    if (selectedAlertForInspection && selectedAlertForInspection.id === alertId) {
      setSelectedAlertForInspection({ ...selectedAlertForInspection, status: newStatus });
    }
  };

  // Bulk update
  const handleBulkUpdateAlerts = (alertIds: string[], newStatus: AlertStatus) => {
    setAlerts(prev => prev.map(a => alertIds.includes(a.id) ? { ...a, status: newStatus } : a));
    setRecentNotification(`Updated ${alertIds.length} alerts to status: ${newStatus}`);
    setTimeout(() => setRecentNotification(null), 3000);
  };

  // Live SOC only: alerts originate from Wazuh, not browser-generated simulations.
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const liveAlerts = await getSocAlerts();
      const mapAlert = (a: LiveSocAlert): Alert => ({
        id: a.id, timestamp: a.timestamp, type: a.ruleName,
        severity: a.severity === 'CRITICAL' ? 'critical' : a.severity === 'HIGH' ? 'high' : a.severity === 'MEDIUM' ? 'medium' : 'low',
        status: 'open', source: a.sourceIp || a.endpoint, destination: a.destinationIp || '-', protocol: 'Wazuh',
        port: 0, country: '-', description: a.ruleName
      });
      setAlerts(liveAlerts.map(mapAlert));
      setRecentNotification('Live Wazuh alerts synchronized.');
    } catch {
      setSocConnected(false);
      setRecentNotification('Wazuh is offline or the SOC backend is unavailable.');
    } finally {
      setIsRefreshing(false);
      setTimeout(() => setRecentNotification(null), 3000);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setRecentNotification('All SIEM feeds synchronized with Wazuh & Suricata agents.');
      setTimeout(() => setRecentNotification(null), 3000);
    }, 800);
  };

  interface NavTabItem {
    id: SocTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
  }

  const navTabs: NavTabItem[] = [
    { id: 'overview', label: 'Dashboard', icon: Activity },
    { id: 'realtime-agent', label: 'Live EDR Agent', icon: Radio },
    { id: 'wazuh-connector', label: 'Wazuh CLI Agent', icon: Terminal },
    { id: 'endpoint-inspector', label: 'Endpoint Activities (IP)', icon: Laptop },
    { id: 'threat-intel', label: 'Threat Intel', icon: ShieldAlert },
    { id: 'alerts', label: 'Alerts & Events', icon: Bell, badge: alerts.filter(a => a.status === 'open').length },
    { id: 'incidents', label: 'Incidents', icon: Flame, badge: alerts.filter(a => a.status === 'open' && a.severity === 'critical').length },
    { id: 'network', label: 'Network Monitor', icon: Network },
    { id: 'vulnerabilities', label: 'Vulnerabilities', icon: Bug, badge: 5 },
    { id: 'reports', label: 'Reports', icon: FileBarChart2 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className={`fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex items-center justify-center ${
      isFullscreen ? 'p-0' : 'p-2 sm:p-4'
    } animate-in fade-in duration-200`}>
      <div className={`bg-[#060c16] border border-cyan-500/40 w-full rounded-2xl shadow-2xl overflow-hidden flex flex-col ${
        isFullscreen ? 'h-full rounded-none' : 'max-w-7xl max-h-[96vh]'
      }`}>
        
        {/* TOPBAR: SOC Operations Header */}
        <header className="px-4 py-3 bg-slate-950 border-b border-cyan-500/30 flex items-center justify-between shrink-0 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {/* Mobile menu trigger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 rounded-lg bg-slate-900 text-slate-300 hover:text-white"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="w-9 h-9 rounded-xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-xs sm:text-sm font-extrabold text-white font-mono tracking-tight truncate">
                  CyberShield<span className="text-cyan-400">PK</span> SOC Operations Center
                </h2>
                <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 animate-pulse">
                  {socConnected ? 'WAZUH CONNECTED' : 'WAZUH OFFLINE'}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono hidden md:block">
                Open-Source Wazuh SIEM & Suricata Threat Hunting Console
              </p>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Live Clock */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-800 text-[11px] font-mono text-cyan-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{currentTime}</span>
            </div>

            {/* Refresh */}
            <button
              type="button"
              onClick={handleRefresh}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800 cursor-pointer"
              title="Refresh feeds"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
            </button>

            {/* Fullscreen Toggle */}
            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800 hidden sm:block cursor-pointer"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-red-950/60 hover:border-red-500/40 border border-transparent transition-colors cursor-pointer"
              title="Close SOC Console"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* NOTIFICATION FLASH BANNER */}
        {recentNotification && (
          <div className="px-4 py-2 bg-gradient-to-r from-cyan-950/90 via-slate-900/95 to-slate-950 border-b border-cyan-500/40 text-xs font-mono text-cyan-200 flex items-center justify-between animate-in slide-in-from-top duration-150">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>{recentNotification}</span>
            </span>
            <button
              type="button"
              onClick={() => setRecentNotification(null)}
              className="text-slate-400 hover:text-white text-xs cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* MAIN BODY: SIDEBAR + CONTENT AREA */}
        <div className="flex flex-1 overflow-hidden relative">
          
          {/* SIDEBAR NAVIGATION */}
          <aside className={`bg-slate-950/95 border-r border-slate-800 flex flex-col transition-all duration-200 shrink-0 z-20 ${
            sidebarCollapsed ? 'w-16' : 'w-56'
          } hidden lg:flex`}>
            <div className="p-3 border-b border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
              {!sidebarCollapsed && <span className="uppercase tracking-wider">Navigation</span>}
              <button
                type="button"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="p-1 rounded text-slate-500 hover:text-white hover:bg-slate-900 cursor-pointer ml-auto"
                title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
              >
                <ChevronRight className={`w-3.5 h-3.5 transition-transform ${sidebarCollapsed ? '' : 'rotate-180'}`} />
              </button>
            </div>

            <nav className="p-2 space-y-1 overflow-y-auto flex-1 font-mono text-xs">
              {navTabs.map((item) => {
                const isActive = activeTab === item.id;
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveTab(item.id as SocTab)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer text-left ${
                      isActive 
                        ? 'bg-cyan-950/80 text-cyan-300 font-bold border border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.15)]' 
                        : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                    }`}
                    title={sidebarCollapsed ? item.label : undefined}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                    {!sidebarCollapsed && (
                      <div className="flex items-center justify-between flex-1 min-w-0">
                        <span className="truncate">{item.label}</span>
                        {item.badge !== undefined && item.badge > 0 && (
                          <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold ${
                            item.id === 'incidents' ? 'bg-red-500 text-white' : 'bg-cyan-950 text-cyan-400 border border-cyan-500/30'
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </nav>

            <div className="p-3 border-t border-slate-800/80 bg-slate-950">
              {!sidebarCollapsed ? (
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-400">
                  <div className="flex items-center justify-between text-white font-bold mb-1">
                    <span>Wazuh Live</span>
                    <span className="text-emerald-400">Online</span>
                  </div>
                  <p className="text-slate-500 truncate">Agent Cluster: {agentCount.active} / {agentCount.total} Active</p>
                </div>
              ) : (
                <div className="w-8 h-8 rounded-lg bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto" title="Wazuh Core Active">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              )}
            </div>
          </aside>

          {/* MOBILE SLIDE-OUT DRAWER */}
          {mobileMenuOpen && (
            <div className="lg:hidden fixed inset-0 z-30 bg-black/70 backdrop-blur-sm flex">
              <div className="w-64 bg-slate-950 border-r border-slate-800 p-4 flex flex-col justify-between space-y-4 font-mono text-xs">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <span className="text-white font-bold uppercase text-xs">SOC Navigation</span>
                    <button 
                      type="button"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-slate-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-1 mt-3">
                    {navTabs.map((item) => {
                      const isActive = activeTab === item.id;
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            setActiveTab(item.id as SocTab);
                            setMobileMenuOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left ${
                            isActive ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-500/40' : 'text-slate-400 hover:text-white hover:bg-slate-900'
                          }`}
                        >
                          <span className="flex items-center gap-2.5">
                            <Icon className="w-4 h-4" />
                            <span>{item.label}</span>
                          </span>
                          {item.badge !== undefined && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 text-cyan-400">
                              {item.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400">
                  <p className="text-white font-bold">CyberShieldPK SOC</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Real-time Defense Simulator</p>
                </div>
              </div>
              <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
            </div>
          )}

          {/* WORKSPACE CONTENT AREA */}
          <main className="flex-1 overflow-y-auto p-3 sm:p-5 lg:p-6 bg-[#060c16]">
            {activeTab === 'overview' && (
              <SocDashboardOverview
                alerts={alerts}
                onSelectAlert={(a) => {
                  setActiveTab('alerts');
                }}
                onNavigateTab={(tab) => setActiveTab(tab as SocTab)}
              />
            )}

            {activeTab === 'realtime-agent' && (
              <SocRealtimeAgentMonitor />
            )}

            {activeTab === 'wazuh-connector' && (
              <SocWazuhConnector />
            )}

            {activeTab === 'endpoint-inspector' && (
              <SocEndpointInspector />
            )}

            {activeTab === 'threat-intel' && (
              <SocThreatIntel />
            )}

            {activeTab === 'alerts' && (
              <SocAlertsPage
                alerts={alerts}
                onUpdateStatus={handleUpdateAlertStatus}
                onBulkUpdate={handleBulkUpdateAlerts}
              />
            )}

            {activeTab === 'incidents' && (
              <SocIncidentsPage />
            )}

            {activeTab === 'network' && (
              <SocNetworkPage />
            )}

            {activeTab === 'vulnerabilities' && (
              <SocVulnerabilitiesPage />
            )}

            {activeTab === 'reports' && (
              <SocReportsPage />
            )}

            {activeTab === 'settings' && (
              <SocSettingsPage />
            )}
          </main>
        </div>

        {/* FOOTER STATUS BAR */}
        <footer className="px-4 py-2 bg-slate-950 border-t border-slate-800 text-[11px] font-mono text-slate-500 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Perimeter Defense: <strong>ENGAGED</strong>
            </span>
            <span className="hidden sm:inline text-slate-700">|</span>
            <span className="hidden sm:inline">Active Telemetry Sensors: <strong>Suricata • Zeek • Sysmon</strong></span>
          </div>

          <div className="flex items-center gap-3 text-slate-400">
            <span>Terminal: <strong className="text-cyan-400">SOC-OPS-CON-01</strong></span>
            <span className="text-slate-700">|</span>
            <span>Founder: <strong className="text-white">Muhammad Zaib Zafar</strong></span>
          </div>
        </footer>

      </div>
    </div>
  );
};
