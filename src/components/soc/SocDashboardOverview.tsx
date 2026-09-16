import React from 'react';
import { 
  ShieldAlert, 
  Flame, 
  Bug, 
  ShieldCheck, 
  Activity, 
  Wifi, 
  ArrowUpRight, 
  ArrowDownRight,
  Eye,
  Server,
  Zap,
  Globe,
  Terminal,
  Laptop
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend, BarChart, Bar
} from 'recharts';
import { 
  kpiData, 
  threatActivity, 
  severityDistribution, 
  threatCategories, 
  systemHealth, 
  attackOrigins, 
  Alert,
  formatNumber,
  getSeverityBadgeStyle
} from '../../data/socDashboardData';

interface SocDashboardOverviewProps {
  alerts: Alert[];
  onSelectAlert: (alert: Alert) => void;
  onNavigateTab: (tab: string) => void;
}

export const SocDashboardOverview: React.FC<SocDashboardOverviewProps> = ({
  alerts,
  onSelectAlert,
  onNavigateTab
}) => {
  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      
      {/* Quick Launch: Wazuh Agent Connector & Endpoint Activity IP Lookup */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        {/* Card 1: Wazuh Live Agent */}
        <div 
          onClick={() => onNavigateTab('wazuh-connector')}
          className="p-4 rounded-xl bg-gradient-to-r from-slate-950 via-[#061426] to-slate-950 border border-cyan-500/40 hover:border-cyan-400/80 transition-all cursor-pointer group shadow-lg flex items-center justify-between gap-3"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/50 flex items-center justify-center text-cyan-400 shrink-0 group-hover:scale-105 transition-transform">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs sm:text-sm font-bold font-mono text-white group-hover:text-cyan-300 transition-colors">
                  Wazuh Live Agent Stream
                </h3>
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                  2 COMMANDS
                </span>
              </div>
              <p className="text-[11px] font-mono text-slate-400 mt-0.5 line-clamp-1">
                Run 2 commands in Windows Terminal to stream live PC telemetry & Sysmon.
              </p>
            </div>
          </div>
          <button 
            type="button"
            className="px-3 py-1.5 rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold shrink-0 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-all"
          >
            Launch →
          </button>
        </div>

        {/* Card 2: Endpoint IP Inspector */}
        <div 
          onClick={() => onNavigateTab('endpoint-inspector')}
          className="p-4 rounded-xl bg-gradient-to-r from-slate-950 via-[#181106] to-slate-950 border border-amber-500/40 hover:border-amber-400/80 transition-all cursor-pointer group shadow-lg flex items-center justify-between gap-3"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-950/80 border border-amber-500/50 flex items-center justify-center text-amber-400 shrink-0 group-hover:scale-105 transition-transform">
              <Laptop className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs sm:text-sm font-bold font-mono text-white group-hover:text-amber-300 transition-colors">
                  Endpoint Inspector (By IP)
                </h3>
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-400 text-slate-950 font-bold">
                  FREE + PRO
                </span>
              </div>
              <p className="text-[11px] font-mono text-slate-400 mt-0.5 line-clamp-1">
                Enter any PC IP address to inspect basic activity or unlock deep memory forensics.
              </p>
            </div>
          </div>
          <button 
            type="button"
            className="px-3 py-1.5 rounded-lg bg-amber-950/60 border border-amber-500/40 text-amber-300 font-mono text-xs font-bold shrink-0 group-hover:bg-amber-400 group-hover:text-slate-950 transition-all"
          >
            Inspect IP →
          </button>
        </div>
      </div>

      {/* 1. Top KPI Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Threats */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-red-500/30 hover:border-red-500/60 transition-all shadow-[0_0_15px_rgba(239,68,68,0.05)] group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Total Threats</span>
            <div className="w-8 h-8 rounded-lg bg-red-950/60 border border-red-500/40 flex items-center justify-center text-red-400 group-hover:scale-105 transition-transform">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-white tracking-tight">
              {kpiData[0].value.toLocaleString()}
            </span>
            <span className="text-xs font-mono text-red-400 flex items-center">
              <ArrowUpRight className="w-3 h-3" /> +{kpiData[0].change}%
            </span>
          </div>
          <p className="text-[10px] font-mono text-slate-500 mt-1">vs previous 24-hour cycle</p>
        </div>

        {/* Active Incidents */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-orange-500/30 hover:border-orange-500/60 transition-all shadow-[0_0_15px_rgba(249,115,22,0.05)] group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Active Incidents</span>
            <div className="w-8 h-8 rounded-lg bg-orange-950/60 border border-orange-500/40 flex items-center justify-center text-orange-400 group-hover:scale-105 transition-transform">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-white tracking-tight">
              {kpiData[1].value}
            </span>
            <span className="text-xs font-mono text-emerald-400 flex items-center">
              <ArrowDownRight className="w-3 h-3" /> -2 closed
            </span>
          </div>
          <p className="text-[10px] font-mono text-slate-500 mt-1">2 critical requiring containment</p>
        </div>

        {/* Vulnerabilities */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-amber-500/30 hover:border-amber-500/60 transition-all shadow-[0_0_15px_rgba(245,158,11,0.05)] group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Vulnerabilities</span>
            <div className="w-8 h-8 rounded-lg bg-amber-950/60 border border-amber-500/40 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
              <Bug className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-white tracking-tight">
              {kpiData[2].value}
            </span>
            <span className="text-xs font-mono text-amber-400 flex items-center">
              <ArrowUpRight className="w-3 h-3" /> +5 new
            </span>
          </div>
          <p className="text-[10px] font-mono text-slate-500 mt-1">8 patched in last sprint</p>
        </div>

        {/* Blocked Attacks */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-cyan-500/30 hover:border-cyan-500/60 transition-all shadow-[0_0_15px_rgba(6,182,212,0.05)] group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Blocked Attacks</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-white tracking-tight">
              {kpiData[3].value.toLocaleString()}
            </span>
            <span className="text-xs font-mono text-cyan-400 flex items-center">
              <ArrowUpRight className="w-3 h-3" /> +18.7%
            </span>
          </div>
          <p className="text-[10px] font-mono text-slate-500 mt-1">99.8% auto-drop rate</p>
        </div>
      </div>

      {/* 2. Charts Row 1: 24h Threat Activity + Severity Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Threat Activity Area Chart */}
        <div className="lg:col-span-2 p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div>
              <h3 className="text-xs sm:text-sm font-bold font-mono text-white uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                Live Threat Activity (Last 24 Hours)
              </h3>
              <p className="text-[11px] font-mono text-slate-400">
                Correlated security events across network perimeters and Wazuh agents
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff4757]" /> Threats
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00d4ff]" /> Blocked
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ffa502]" /> Alerts
              </span>
            </div>
          </div>

          <div className="w-full h-56 min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={threatActivity} margin={{ top: 8, right: 10, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="socThreats" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff4757" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#ff4757" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="socBlocked" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#00d4ff" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="time" tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ 
                    background: '#091120', 
                    border: '1px solid #1e3a5f', 
                    borderRadius: 8, 
                    fontSize: 12,
                    fontFamily: 'monospace',
                    color: '#e2e8f0' 
                  }}
                />
                <Area type="monotone" dataKey="threats" stroke="#ff4757" fill="url(#socThreats)" strokeWidth={2} dot={false} />
                <Area type="monotone" dataKey="blocked" stroke="#00d4ff" fill="url(#socBlocked)" strokeWidth={2} dot={false} />
                <Area type="monotone" dataKey="alerts" stroke="#ffa502" fill="none" strokeWidth={1.5} strokeDasharray="4 2" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Severity Distribution Pie Chart */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="text-xs sm:text-sm font-bold font-mono text-white uppercase tracking-wider">
              Severity Distribution
            </h3>
            <p className="text-[11px] font-mono text-slate-400">
              Active posture classified by risk level
            </p>
          </div>

          <div className="w-full h-44 min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={severityDistribution} 
                  cx="50%" 
                  cy="50%" 
                  innerRadius={45} 
                  outerRadius={70}
                  paddingAngle={4} 
                  dataKey="value"
                >
                  {severityDistribution.map((entry, i) => (
                    <Cell key={i} fill={entry.color} stroke="#091120" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    background: '#091120', 
                    border: '1px solid #1e3a5f', 
                    borderRadius: 8, 
                    fontSize: 11,
                    fontFamily: 'monospace' 
                  }} 
                />
                <Legend 
                  layout="horizontal" 
                  verticalAlign="bottom"
                  wrapperStyle={{ fontSize: 11, fontFamily: 'monospace', paddingTop: 6 }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>Critical & High share:</span>
            <span className="text-red-400 font-bold">25.3%</span>
          </div>
        </div>
      </div>

      {/* 3. Charts Row 2: Threat Categories, System Health, Attack Origins */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Threat Categories Horizontal Bar Chart */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold font-mono text-white uppercase tracking-wider">
              Threat Vectors by Type
            </h3>
            <span className="text-[10px] font-mono text-cyan-400">Last 24h</span>
          </div>
          <div className="w-full h-48 min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={threatCategories} layout="vertical" margin={{ top: 0, right: 10, bottom: 0, left: -22 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                <XAxis type="number" tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="category" tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }} axisLine={false} tickLine={false} width={82} />
                <Tooltip 
                  contentStyle={{ 
                    background: '#091120', 
                    border: '1px solid #1e3a5f', 
                    borderRadius: 8, 
                    fontSize: 11,
                    fontFamily: 'monospace' 
                  }} 
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {threatCategories.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* System Health */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold font-mono text-white uppercase tracking-wider flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-cyan-400" />
              Core Infrastructure Health
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30">
              Operational
            </span>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {systemHealth.map((sys) => (
              <div key={sys.name} className="flex items-center justify-between gap-2 p-1.5 rounded-lg bg-slate-900/50 text-xs font-mono">
                <div className="flex items-center gap-2 min-w-0">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${
                    sys.status === 'online' ? 'bg-emerald-400' : 'bg-amber-400'
                  }`} />
                  <span className="text-slate-300 truncate text-[11px]">{sys.name}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <div className="w-14 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all ${
                        sys.load > 75 ? 'bg-amber-400' : 'bg-cyan-400'
                      }`}
                      style={{ width: `${sys.load}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 w-7 text-right">{sys.load}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Attack Origins */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold font-mono text-white uppercase tracking-wider flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-red-400" />
              Top Ingress Adversary Origins
            </h3>
            <span className="text-[10px] font-mono text-slate-400">GeoIP</span>
          </div>

          <div className="space-y-2">
            {attackOrigins.slice(0, 5).map((origin) => {
              const max = attackOrigins[0].attacks;
              const ratio = Math.round((origin.attacks / max) * 100);
              return (
                <div key={origin.code} className="flex items-center gap-2 text-xs font-mono">
                  <span className="w-6 px-1 py-0.5 rounded bg-slate-900 text-[10px] text-cyan-400 text-center border border-slate-800 font-bold">
                    {origin.code}
                  </span>
                  <span className="text-slate-300 text-xs flex-1 truncate">{origin.country}</span>
                  <div className="w-20 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-red-500/80 rounded-full transition-all" 
                      style={{ width: `${ratio}%` }} 
                    />
                  </div>
                  <span className="text-slate-400 text-[11px] w-10 text-right">
                    {formatNumber(origin.attacks)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. Recent Alerts Table */}
      <div className="rounded-xl bg-slate-950/90 border border-slate-800 overflow-hidden">
        <div className="px-4 py-3 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs sm:text-sm font-bold font-mono text-white uppercase tracking-wider">
              Recent Correlated Security Events
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
              Live Feed
            </span>
          </div>

          <button
            onClick={() => onNavigateTab('alerts')}
            className="text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>View All ({alerts.length}) Alerts →</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs whitespace-nowrap">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 text-[11px]">
                <th className="px-4 py-2.5">Alert ID</th>
                <th className="px-4 py-2.5">Timestamp</th>
                <th className="px-4 py-2.5">Source IP</th>
                <th className="px-4 py-2.5">Target</th>
                <th className="px-4 py-2.5">Signature / Vector</th>
                <th className="px-4 py-2.5">Severity</th>
                <th className="px-4 py-2.5">Status</th>
                <th className="px-4 py-2.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {alerts.slice(0, 6).map((alert) => {
                const badge = getSeverityBadgeStyle(alert.severity);
                return (
                  <tr key={alert.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="px-4 py-2.5 font-bold text-cyan-400">{alert.id}</td>
                    <td className="px-4 py-2.5 text-slate-400 text-[11px]">
                      {alert.timestamp.split(' ')[1] || alert.timestamp}
                    </td>
                    <td className="px-4 py-2.5 text-white font-mono">{alert.source}</td>
                    <td className="px-4 py-2.5 text-slate-400 text-xs truncate max-w-[140px]">
                      {alert.destination}
                    </td>
                    <td className="px-4 py-2.5 text-white max-w-[220px] truncate">
                      {alert.type}
                    </td>
                    <td className="px-4 py-2.5">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${badge.bg} ${badge.text} border ${badge.border}`}>
                        {alert.severity}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800 uppercase">
                        {alert.status}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <button
                        onClick={() => onSelectAlert(alert)}
                        className="px-2.5 py-1 rounded-lg text-[11px] text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 hover:bg-cyan-900/60 transition-colors flex items-center gap-1 ml-auto cursor-pointer"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-2.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-500">
          <span className="flex items-center gap-1.5">
            <Wifi className="w-3 h-3 text-emerald-400" />
            Wazuh Open-Source Telemetry Socket Connected (Port 1514)
          </span>
          <span>Showing 6 of {alerts.length} incidents</span>
        </div>
      </div>
    </div>
  );
};
