import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Clock,
  Terminal,
  Server,
  Radio,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, LineChart, Line 
} from 'recharts';
import { 
  Alert, 
  Severity, 
  AlertStatus, 
  threatActivity, 
  threatCategories,
  getSeverityBadgeStyle 
} from '../../data/socDashboardData';

interface SocAlertsPageProps {
  alerts: Alert[];
  onUpdateStatus: (alertId: string, newStatus: AlertStatus) => void;
  onBulkUpdate: (alertIds: string[], newStatus: AlertStatus) => void;
}

export const SocAlertsPage: React.FC<SocAlertsPageProps> = ({
  alerts,
  onUpdateStatus,
  onBulkUpdate
}) => {
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 8;

  // Filter alerts
  const filteredAlerts = alerts.filter(a => {
    const matchSearch = search === '' || 
      a.source.toLowerCase().includes(search.toLowerCase()) || 
      a.type.toLowerCase().includes(search.toLowerCase()) || 
      a.id.toLowerCase().includes(search.toLowerCase()) ||
      a.destination.toLowerCase().includes(search.toLowerCase());
    const matchSeverity = severityFilter === 'all' || a.severity === severityFilter;
    const matchStatus = statusFilter === 'all' || a.status === statusFilter;
    return matchSearch && matchSeverity && matchStatus;
  });

  const totalPages = Math.ceil(filteredAlerts.length / PAGE_SIZE) || 1;
  const paginatedAlerts = filteredAlerts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === paginatedAlerts.length && paginatedAlerts.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedAlerts.map(a => a.id)));
    }
  };

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(filteredAlerts, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `cybershield_soc_alerts_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      
      {/* 1. Charts Overview (Alert Volume 24h & Alerts by Type) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Alert Volume */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs sm:text-sm font-bold font-mono text-white uppercase tracking-wider">
              Alert Volume Correlation (24h)
            </h3>
            <span className="text-[10px] font-mono text-cyan-400">SIEM Pipeline</span>
          </div>
          <div className="w-full h-40 min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={threatActivity} margin={{ top: 6, right: 10, bottom: 0, left: -22 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="time" tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#091120', border: '1px solid #1e3a5f', borderRadius: 8, fontSize: 11, fontFamily: 'monospace' }} />
                <Line type="monotone" dataKey="alerts" stroke="#00d4ff" strokeWidth={2.5} dot={{ r: 2, fill: '#00d4ff' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Alerts by Type */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs sm:text-sm font-bold font-mono text-white uppercase tracking-wider">
              Alert Volume by Attack Pattern
            </h3>
            <span className="text-[10px] font-mono text-slate-400">Rule Match Freq</span>
          </div>
          <div className="w-full h-40 min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={threatCategories} layout="vertical" margin={{ top: 0, right: 10, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" horizontal={false} />
                <XAxis type="number" tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="category" tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }} axisLine={false} tickLine={false} width={82} />
                <Tooltip contentStyle={{ background: '#091120', border: '1px solid #1e3a5f', borderRadius: 8, fontSize: 11, fontFamily: 'monospace' }} />
                <Bar dataKey="count" fill="#00d4ff" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 2. Main Filterable Alerts Table */}
      <div className="rounded-xl bg-slate-950/90 border border-slate-800 overflow-hidden">
        {/* Filters Toolbar */}
        <div className="p-4 bg-slate-900/80 border-b border-slate-800 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              placeholder="Search alert ID, IP, attack type..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <select
            value={severityFilter}
            onChange={(e) => { setSeverityFilter(e.target.value); setCurrentPage(1); }}
            className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Statuses</option>
            <option value="open">Open</option>
            <option value="acknowledged">Acknowledged</option>
            <option value="escalated">Escalated</option>
            <option value="closed">Closed</option>
          </select>

          {/* Bulk actions */}
          {selectedIds.size > 0 && (
            <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-lg border border-slate-800 font-mono text-xs">
              <span className="text-slate-400 px-2 text-[11px]">{selectedIds.size} selected:</span>
              <button
                type="button"
                onClick={() => {
                  onBulkUpdate(Array.from(selectedIds), 'acknowledged');
                  setSelectedIds(new Set());
                }}
                className="px-2 py-1 rounded bg-amber-950/60 hover:bg-amber-900/60 text-amber-300 border border-amber-500/30 text-[10px] cursor-pointer"
              >
                Ack
              </button>
              <button
                type="button"
                onClick={() => {
                  onBulkUpdate(Array.from(selectedIds), 'escalated');
                  setSelectedIds(new Set());
                }}
                className="px-2 py-1 rounded bg-orange-950/60 hover:bg-orange-900/60 text-orange-300 border border-orange-500/30 text-[10px] cursor-pointer"
              >
                Escalate
              </button>
              <button
                type="button"
                onClick={() => {
                  onBulkUpdate(Array.from(selectedIds), 'closed');
                  setSelectedIds(new Set());
                }}
                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] cursor-pointer"
              >
                Close
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={handleExportJson}
            className="px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-850 text-xs font-mono text-slate-300 border border-slate-800 flex items-center gap-1.5 cursor-pointer ml-auto"
            title="Export alerts as JSON"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>

        {/* Table Body */}
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs whitespace-nowrap">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 text-[11px]">
                <th className="px-4 py-2.5 w-8">
                  <input
                    type="checkbox"
                    checked={selectedIds.size === paginatedAlerts.length && paginatedAlerts.length > 0}
                    onChange={toggleSelectAll}
                    className="accent-cyan-500 rounded cursor-pointer"
                  />
                </th>
                <th className="px-4 py-2.5">Alert ID</th>
                <th className="px-4 py-2.5">Timestamp</th>
                <th className="px-4 py-2.5">Source IP</th>
                <th className="px-4 py-2.5">Destination Host</th>
                <th className="px-4 py-2.5">Attack Classification</th>
                <th className="px-4 py-2.5">Severity</th>
                <th className="px-4 py-2.5">Status</th>
                <th className="px-4 py-2.5 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {paginatedAlerts.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-10 text-slate-500 font-mono text-xs">
                    No security alerts matched the current search or filters.
                  </td>
                </tr>
              ) : (
                paginatedAlerts.map((alert) => {
                  const badge = getSeverityBadgeStyle(alert.severity);
                  const isChecked = selectedIds.has(alert.id);
                  return (
                    <tr key={alert.id} className={`hover:bg-slate-900/40 transition-colors ${isChecked ? 'bg-cyan-950/20' : ''}`}>
                      <td className="px-4 py-2.5">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSelect(alert.id)}
                          className="accent-cyan-500 rounded cursor-pointer"
                        />
                      </td>
                      <td className="px-4 py-2.5 font-bold text-cyan-400">{alert.id}</td>
                      <td className="px-4 py-2.5 text-slate-400 text-[11px]">{alert.timestamp}</td>
                      <td className="px-4 py-2.5 text-white font-mono">{alert.source}</td>
                      <td className="px-4 py-2.5 text-slate-400 max-w-[150px] truncate">{alert.destination}</td>
                      <td className="px-4 py-2.5 text-white max-w-[220px] truncate font-sans font-medium">{alert.type}</td>
                      <td className="px-4 py-2.5">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${badge.bg} ${badge.text} border ${badge.border}`}>
                          {alert.severity}
                        </span>
                      </td>
                      <td className="px-4 py-2.5">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                          alert.status === 'open' ? 'bg-red-950/60 text-red-300 border border-red-500/40' :
                          alert.status === 'escalated' ? 'bg-orange-950/60 text-orange-300 border border-orange-500/40' :
                          alert.status === 'acknowledged' ? 'bg-amber-950/60 text-amber-300 border border-amber-500/40' :
                          'bg-slate-900 text-slate-400 border border-slate-800'
                        }`}>
                          {alert.status}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedAlert(alert)}
                          className="px-2.5 py-1 rounded-lg text-[11px] text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 hover:bg-cyan-900/60 transition-colors flex items-center gap-1 ml-auto cursor-pointer"
                        >
                          <Eye className="w-3 h-3" />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="px-4 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
          <span>{filteredAlerts.length} total events indexed</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage(p => p - 1)}
              className="p-1 rounded bg-slate-900 border border-slate-800 disabled:opacity-40 hover:bg-slate-800 cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span>{currentPage} / {totalPages}</span>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
              className="p-1 rounded bg-slate-900 border border-slate-800 disabled:opacity-40 hover:bg-slate-800 cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Alert Detail Modal Dialog */}
      {selectedAlert && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 animate-in fade-in duration-150">
          <div className="bg-[#0a1120] border border-cyan-500/40 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold font-mono text-white uppercase">
                  Alert Triage Detail — {selectedAlert.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedAlert(null)}
                className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 overflow-y-auto font-mono text-xs flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded text-xs font-bold uppercase ${getSeverityBadgeStyle(selectedAlert.severity).bg} ${getSeverityBadgeStyle(selectedAlert.severity).text} border`}>
                  {selectedAlert.severity}
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800 uppercase">
                  Status: {selectedAlert.status}
                </span>
                <span className="text-slate-400 ml-auto">
                  {selectedAlert.timestamp}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-sans text-xs text-slate-200 leading-relaxed">
                <strong className="text-cyan-400 block font-mono text-xs uppercase mb-1">{selectedAlert.type}</strong>
                {selectedAlert.description}
              </div>

              {/* Forensic Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase block">Source IP</span>
                  <span className="text-white font-bold">{selectedAlert.source}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase block">Target Host</span>
                  <span className="text-white font-bold truncate block">{selectedAlert.destination}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase block">Transport Protocol</span>
                  <span className="text-cyan-400 font-bold">{selectedAlert.protocol} :{selectedAlert.port || 'Any'}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase block">Origin Geolocation</span>
                  <span className="text-white font-bold">{selectedAlert.country}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase block">Ingest SIEM Channel</span>
                  <span className="text-emerald-400 font-bold">Wazuh Syscheck</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase block">Automated Action</span>
                  <span className="text-slate-300">Packet Captured</span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center gap-2">
                <span className="text-slate-400 text-xs mr-2">Update Incident State:</span>
                <button
                  type="button"
                  onClick={() => {
                    onUpdateStatus(selectedAlert.id, 'acknowledged');
                    setSelectedAlert({ ...selectedAlert, status: 'acknowledged' });
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-mono bg-amber-950/70 hover:bg-amber-900/70 text-amber-300 border border-amber-500/40 flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Acknowledge</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onUpdateStatus(selectedAlert.id, 'escalated');
                    setSelectedAlert({ ...selectedAlert, status: 'escalated' });
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-mono bg-orange-950/70 hover:bg-orange-900/70 text-orange-300 border border-orange-500/40 flex items-center gap-1.5 cursor-pointer"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Escalate to Tier 2</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onUpdateStatus(selectedAlert.id, 'closed');
                    setSelectedAlert({ ...selectedAlert, status: 'closed' });
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-mono bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 flex items-center gap-1.5 cursor-pointer"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Close Alert</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
