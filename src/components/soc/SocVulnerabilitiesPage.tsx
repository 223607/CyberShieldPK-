import React, { useState } from 'react';
import { 
  Bug, 
  Search, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  XCircle,
  ExternalLink
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Cell 
} from 'recharts';
import { 
  vulnerabilities, 
  vulnBySeverity, 
  assetRisk, 
  Vulnerability,
  getCvssColor,
  getSeverityBadgeStyle 
} from '../../data/socDashboardData';
import { getSocVulnerabilities } from '../../services/socApi';

export const SocVulnerabilitiesPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [liveVulnerabilities, setLiveVulnerabilities] = useState<any[] | null>(null);
  useEffect(() => { getSocVulnerabilities().then(v => { if (v.length) setLiveVulnerabilities(v); }).catch(() => {}); }, []);
  const displayedVulnerabilities = liveVulnerabilities || vulnerabilities;
  const [severityFilter, setSeverityFilter] = useState('all');
  const [patchFilter, setPatchFilter] = useState('all');

  const filteredVulns = displayedVulnerabilities.filter(v => {
    const matchSearch = search === '' || 
      v.cveId.toLowerCase().includes(search.toLowerCase()) || 
      v.description.toLowerCase().includes(search.toLowerCase()) || 
      v.vendor.toLowerCase().includes(search.toLowerCase()) ||
      v.product.toLowerCase().includes(search.toLowerCase());
    const matchSeverity = severityFilter === 'all' || v.severity === severityFilter;
    const matchPatch = patchFilter === 'all' || v.patchStatus === patchFilter;
    return matchSearch && matchSeverity && matchPatch;
  });

  const completedCount = displayedVulnerabilities.filter(v => v.patchStatus === 'completed' || v.status === 'Resolved').length;
  const patchCoverage = displayedVulnerabilities.length ? Math.round((completedCount / displayedVulnerabilities.length) * 100) : 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* 1. Summary Metric Counters */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
          <p className="text-[11px] font-mono text-slate-400 uppercase">Identified CVEs</p>
          <p className="text-2xl sm:text-3xl font-bold font-mono text-white mt-1">{displayedVulnerabilities.length}</p>
          <span className="text-[10px] font-mono text-slate-500">Known CVE catalog</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/80 border border-red-500/30">
          <p className="text-[11px] font-mono text-slate-400 uppercase">Critical (CVSS 9.0+)</p>
          <p className="text-2xl sm:text-3xl font-bold font-mono text-red-400 mt-1">
            {displayedVulnerabilities.filter(v => v.severity === 'critical' || v.severity === 'Critical').length}
          </p>
          <span className="text-[10px] font-mono text-slate-500">Urgent patch window</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/80 border border-emerald-500/30">
          <p className="text-[11px] font-mono text-slate-400 uppercase">Patch Coverage SLA</p>
          <p className="text-2xl sm:text-3xl font-bold font-mono text-emerald-400 mt-1">{patchCoverage}%</p>
          <span className="text-[10px] font-mono text-slate-500">Target goal: 95%</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/80 border border-amber-500/30">
          <p className="text-[11px] font-mono text-slate-400 uppercase">Pending Deployment</p>
          <p className="text-2xl sm:text-3xl font-bold font-mono text-amber-400 mt-1">
            {displayedVulnerabilities.filter(v => v.patchStatus === 'pending' || v.status === 'Unresolved').length}
          </p>
          <span className="text-[10px] font-mono text-slate-500">Scheduled maintenance</span>
        </div>
      </div>

      {/* 2. Charts: Vulnerability by Severity & Asset Risk Scores */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Severity Bar Chart */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs sm:text-sm font-bold font-mono text-white uppercase tracking-wider flex items-center gap-2">
              <Bug className="w-4 h-4 text-cyan-400" />
              CVE Distribution by Severity Tier
            </h3>
            <span className="text-[10px] font-mono text-slate-400">CVSS v3.1</span>
          </div>

          <div className="w-full h-44 min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={vulnBySeverity} margin={{ top: 8, right: 10, bottom: 0, left: -22 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#091120', border: '1px solid #1e3a5f', borderRadius: 8, fontSize: 11, fontFamily: 'monospace' }} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {vulnBySeverity.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Asset Risk Scores */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs sm:text-sm font-bold font-mono text-white uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Endpoint Infrastructure Risk Ranking
            </h3>
            <span className="text-[10px] font-mono text-slate-400">Composite Score</span>
          </div>

          <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
            {assetRisk.map((a) => (
              <div key={a.asset} className="flex items-center gap-2 font-mono text-xs">
                <span className="w-24 text-slate-300 font-bold truncate">{a.asset}</span>
                <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all ${
                      a.risk >= 80 ? 'bg-red-500' : a.risk >= 65 ? 'bg-orange-500' : 'bg-amber-400'
                    }`}
                    style={{ width: `${a.risk}%` }}
                  />
                </div>
                <span className={`w-8 text-right font-bold ${
                  a.risk >= 80 ? 'text-red-400' : a.risk >= 65 ? 'text-orange-400' : 'text-amber-400'
                }`}>
                  {a.risk}
                </span>
                <span className="text-[10px] text-slate-500 w-16 text-right">{a.vulns} CVEs</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Patch Status Overview Bar */}
      <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between font-mono text-xs">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Patch Lifecycle Distribution & Coverage
          </h3>
          <span className="text-emerald-400 font-bold">{patchCoverage}% Compliant</span>
        </div>

        {/* Segmented Bar */}
        <div className="flex h-3 rounded-full overflow-hidden bg-slate-900 border border-slate-800">
          <div className="bg-emerald-400 h-full transition-all" style={{ width: `${(vulnerabilities.filter(v => v.patchStatus === 'completed').length / vulnerabilities.length) * 100}%` }} title="Completed" />
          <div className="bg-cyan-400 h-full transition-all" style={{ width: `${(vulnerabilities.filter(v => v.patchStatus === 'in_progress').length / vulnerabilities.length) * 100}%` }} title="In Progress" />
          <div className="bg-amber-400 h-full transition-all" style={{ width: `${(vulnerabilities.filter(v => v.patchStatus === 'pending').length / vulnerabilities.length) * 100}%` }} title="Pending" />
          <div className="bg-red-500 h-full transition-all" style={{ width: `${(vulnerabilities.filter(v => v.patchStatus === 'failed').length / vulnerabilities.length) * 100}%` }} title="Failed" />
        </div>

        <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono text-slate-400 pt-1">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            Completed: {vulnerabilities.filter(v => v.patchStatus === 'completed').length}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            In Progress: {vulnerabilities.filter(v => v.patchStatus === 'in_progress').length}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            Pending: {vulnerabilities.filter(v => v.patchStatus === 'pending').length}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
            Failed: {vulnerabilities.filter(v => v.patchStatus === 'failed').length}
          </span>
        </div>
      </div>

      {/* 4. Full CVE List Table */}
      <div className="rounded-xl bg-slate-950/90 border border-slate-800 overflow-hidden">
        <div className="p-4 bg-slate-900/80 border-b border-slate-800 flex flex-wrap items-center gap-3">
          <h3 className="text-xs sm:text-sm font-bold font-mono text-white uppercase tracking-wider flex items-center gap-2">
            <Bug className="w-4 h-4 text-cyan-400" />
            Vulnerability Inventory (CVE)
          </h3>

          <div className="relative ml-auto">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search CVE ID or vendor..."
              className="pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-44"
            />
          </div>

          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <select
            value={patchFilter}
            onChange={(e) => setPatchFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Patch States</option>
            <option value="completed">Completed</option>
            <option value="in_progress">In Progress</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs whitespace-nowrap">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 text-[11px]">
                <th className="px-4 py-2.5">CVE Identifier</th>
                <th className="px-4 py-2.5">Vulnerability Description</th>
                <th className="px-4 py-2.5">CVSS</th>
                <th className="px-4 py-2.5">Severity</th>
                <th className="px-4 py-2.5">Vendor / Product</th>
                <th className="px-4 py-2.5">Affected Assets</th>
                <th className="px-4 py-2.5 text-right">Patch Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredVulns.map((vuln) => {
                const cvssBadge = getCvssColor(vuln.cvssScore);
                const sevBadge = getSeverityBadgeStyle(vuln.severity);
                return (
                  <tr key={vuln.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="px-4 py-2.5 font-bold text-cyan-400">{vuln.cveId}</td>
                    <td className="px-4 py-2.5 text-white max-w-[280px] truncate font-sans">
                      {vuln.description}
                    </td>
                    <td className="px-4 py-2.5">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${cvssBadge}`}>
                        {vuln.cvssScore.toFixed(1)}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${sevBadge.bg} ${sevBadge.text} border ${sevBadge.border}`}>
                        {vuln.severity}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-slate-400">
                      {vuln.vendor} / <span className="text-white">{vuln.product}</span>
                    </td>
                    <td className="px-4 py-2.5 text-cyan-300">
                      {vuln.affectedAssets.length} endpoints
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                        vuln.patchStatus === 'completed' ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' :
                        vuln.patchStatus === 'in_progress' ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40' :
                        vuln.patchStatus === 'pending' ? 'bg-amber-950 text-amber-300 border border-amber-500/40' :
                        'bg-red-950 text-red-300 border border-red-500/40'
                      }`}>
                        {vuln.patchStatus.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
