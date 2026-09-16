import React, { useState } from 'react';
import { 
  Search, 
  ShieldAlert, 
  Radio, 
  Target, 
  Globe, 
  ExternalLink,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Cell
} from 'recharts';
import { 
  threatFeeds, 
  iocs, 
  threatCategories, 
  mitreAttack, 
  IOC,
  getSeverityBadgeStyle 
} from '../../data/socDashboardData';

const radarData = [
  { subject: 'Malware', value: 85 },
  { subject: 'Phishing', value: 68 },
  { subject: 'APT Ops', value: 72 },
  { subject: 'Ransomware', value: 60 },
  { subject: 'DDoS Flood', value: 45 },
  { subject: 'Exploitation', value: 64 },
];

export const SocThreatIntel: React.FC = () => {
  const [feedFilter, setFeedFilter] = useState('all');
  const [iocSearch, setIocSearch] = useState('');
  const [iocTypeFilter, setIocTypeFilter] = useState('all');
  const [selectedMitreTech, setSelectedMitreTech] = useState<string | null>('T1003 OS Cred Dumping');

  const filteredFeeds = threatFeeds.filter(f => 
    feedFilter === 'all' || f.severity === feedFilter
  );

  const filteredIocs = iocs.filter(i => {
    const matchSearch = iocSearch === '' || 
      i.value.toLowerCase().includes(iocSearch.toLowerCase()) ||
      i.tags.some(t => t.toLowerCase().includes(iocSearch.toLowerCase()));
    const matchType = iocTypeFilter === 'all' || i.type === iocTypeFilter;
    return matchSearch && matchType;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* 1. Threat Category & Radar Visualization */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Threat Category Bar Chart */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs sm:text-sm font-bold font-mono text-white uppercase tracking-wider flex items-center gap-2">
              <Target className="w-4 h-4 text-cyan-400" />
              Active Threat Category Distribution
            </h3>
            <span className="text-[10px] font-mono text-slate-400">Tactical Telemetry</span>
          </div>

          <div className="w-full h-52 min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={threatCategories} margin={{ top: 8, right: 10, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="category" tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    background: '#091120', 
                    border: '1px solid #1e3a5f', 
                    borderRadius: 8, 
                    fontSize: 11,
                    fontFamily: 'monospace' 
                  }} 
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {threatCategories.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Threat Radar Chart */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs sm:text-sm font-bold font-mono text-white uppercase tracking-wider flex items-center gap-2">
              <Radio className="w-4 h-4 text-emerald-400" />
              Adversary Tactics Radar Analysis
            </h3>
            <span className="text-[10px] font-mono text-emerald-400 font-bold">Threat Index: 74/100</span>
          </div>

          <div className="w-full h-52 min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }} />
                <PolarRadiusAxis tick={{ fill: '#64748b', fontSize: 9, fontFamily: 'monospace' }} stroke="rgba(255,255,255,0.1)" />
                <Radar dataKey="value" stroke="#00d4ff" fill="#00d4ff" fillOpacity={0.25} />
                <Tooltip 
                  contentStyle={{ 
                    background: '#091120', 
                    border: '1px solid #1e3a5f', 
                    borderRadius: 8, 
                    fontSize: 11,
                    fontFamily: 'monospace' 
                  }} 
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 2. Threat Intelligence Feeds */}
      <div className="rounded-xl bg-slate-950/90 border border-slate-800 overflow-hidden">
        <div className="px-4 py-3 bg-slate-900/80 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-xs sm:text-sm font-bold font-mono text-white uppercase tracking-wider flex items-center gap-2">
              <Globe className="w-4 h-4 text-cyan-400" />
              Live Curated Threat Intelligence Feeds (OSINT & APT)
            </h3>
            <p className="text-[11px] font-mono text-slate-400">
              Synchronized with CISA, NSA, AlienVault OTX, and CyberShield Defense Network
            </p>
          </div>

          {/* Severity Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400">Filter:</span>
            <select
              value={feedFilter}
              onChange={(e) => setFeedFilter(e.target.value)}
              className="px-2.5 py-1 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
            </select>
          </div>
        </div>

        <div className="divide-y divide-slate-800/60 font-mono text-xs">
          {filteredFeeds.map((feed) => {
            const badge = getSeverityBadgeStyle(feed.severity);
            return (
              <div key={feed.id} className="p-4 hover:bg-slate-900/40 transition-colors space-y-1.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-white font-sans">{feed.name}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${badge.bg} ${badge.text} border ${badge.border}`}>
                      {feed.severity}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-900 text-[10px] text-slate-300 border border-slate-800">
                      {feed.category}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-400 flex items-center gap-2">
                    <span>Confidence:</span>
                    <span className="text-emerald-400 font-bold">{feed.confidence}%</span>
                    <span>• {feed.timestamp}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  {feed.description}
                </p>

                <div className="text-[11px] text-cyan-400 flex items-center gap-2">
                  <span className="text-slate-500">Source:</span>
                  <span>{feed.source}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Indicators of Compromise (IOC) Table */}
      <div className="rounded-xl bg-slate-950/90 border border-slate-800 overflow-hidden">
        <div className="p-4 bg-slate-900/80 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-xs sm:text-sm font-bold font-mono text-white uppercase tracking-wider flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-400" />
              Indicators of Compromise (IOC Repository)
            </h3>
            <p className="text-[11px] font-mono text-slate-400">
              Active adversary hashes, malicious domains, and command & control IP addresses
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={iocSearch}
                onChange={(e) => setIocSearch(e.target.value)}
                placeholder="Search IP, domain, hash..."
                className="pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-44 sm:w-56"
              />
            </div>

            <select
              value={iocTypeFilter}
              onChange={(e) => setIocTypeFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All Types</option>
              <option value="ip">IP</option>
              <option value="domain">Domain</option>
              <option value="hash">Hash</option>
              <option value="url">URL</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs whitespace-nowrap">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 text-[11px]">
                <th className="px-4 py-2.5">Type</th>
                <th className="px-4 py-2.5">Indicator Value</th>
                <th className="px-4 py-2.5">Threat Level</th>
                <th className="px-4 py-2.5">First Seen</th>
                <th className="px-4 py-2.5">Last Seen</th>
                <th className="px-4 py-2.5">Tags</th>
                <th className="px-4 py-2.5 text-right">Hits</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredIocs.map((ioc) => {
                const badge = getSeverityBadgeStyle(ioc.threatLevel);
                return (
                  <tr key={ioc.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="px-4 py-2.5">
                      <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30 uppercase text-[10px] font-bold">
                        {ioc.type}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-white font-bold select-all max-w-[280px] truncate">
                      {ioc.value}
                    </td>
                    <td className="px-4 py-2.5">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${badge.bg} ${badge.text} border ${badge.border}`}>
                        {ioc.threatLevel}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-slate-400 text-[11px]">{ioc.firstSeen}</td>
                    <td className="px-4 py-2.5 text-slate-300 text-[11px]">{ioc.lastSeen}</td>
                    <td className="px-4 py-2.5">
                      <div className="flex gap-1">
                        {ioc.tags.map((t) => (
                          <span key={t} className="px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 text-[10px] border border-slate-800">
                            #{t}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-right text-cyan-400 font-bold tabular-nums">
                      {ioc.hitCount}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. MITRE ATT&CK Enterprise Matrix */}
      <div className="rounded-xl bg-slate-950/90 border border-slate-800 overflow-hidden">
        <div className="p-4 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-xs sm:text-sm font-bold font-mono text-white uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              MITRE ATT&CK® Enterprise Matrix Navigator
            </h3>
            <p className="text-[11px] font-mono text-slate-400">
              Correlated adversary techniques mapped to CyberShield live telemetry
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="w-2.5 h-2.5 rounded bg-cyan-400" />
            <span className="text-cyan-300 font-bold">Detected in Network</span>
          </div>
        </div>

        <div className="p-4 overflow-x-auto">
          <div className="grid gap-2 min-w-[900px]" style={{ gridTemplateColumns: `repeat(${mitreAttack.length}, minmax(110px, 1fr))` }}>
            {mitreAttack.map((col) => (
              <div key={col.id} className="space-y-1.5">
                <div className="text-[11px] font-bold font-mono text-cyan-400 pb-1 border-b border-slate-800 truncate" title={col.tactic}>
                  {col.tactic}
                </div>
                <div className="space-y-1">
                  {col.techniques.map((tech) => {
                    const isDetected = col.detected.includes(tech);
                    return (
                      <button
                        key={tech}
                        type="button"
                        onClick={() => setSelectedMitreTech(tech)}
                        className={`w-full text-left p-1.5 rounded text-[10px] font-mono leading-tight transition-all cursor-pointer truncate block border ${
                          isDetected
                            ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500/60 font-semibold shadow-[0_0_8px_rgba(6,182,212,0.2)]'
                            : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:bg-slate-850 hover:text-slate-200'
                        }`}
                        title={tech}
                      >
                        {tech}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedMitreTech && (
          <div className="p-3 bg-cyan-950/30 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-cyan-300">
            <span className="flex items-center gap-2">
              <Info className="w-4 h-4 text-cyan-400" />
              <span>Selected Technique: <strong className="text-white">{selectedMitreTech}</strong></span>
            </span>
            <span className="text-[11px] text-slate-400">
              Automated SIEM rule active in Wazuh & Suricata rulesets
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
