import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Flame, 
  ChevronRight, 
  ShieldAlert, 
  Clock, 
  User, 
  X, 
  CheckCircle2, 
  Layers,
  ArrowRight
} from 'lucide-react';
import { 
  Incident, 
  IncidentStatus, 
  Severity, 
  initialIncidents, 
  getSeverityBadgeStyle 
} from '../../data/socDashboardData';

export const SocIncidentsPage: React.FC = () => {
  const [incidentsList, setIncidentsList] = useState<Incident[]>(initialIncidents);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [newIncidentModalOpen, setNewIncidentModalOpen] = useState(false);

  // New incident form state
  const [newTitle, setNewTitle] = useState('');
  const [newPriority, setNewPriority] = useState<Severity>('high');
  const [newImpact, setNewImpact] = useState<'high' | 'medium' | 'low'>('high');
  const [newUrgency, setNewUrgency] = useState<'critical' | 'high' | 'medium' | 'low'>('high');
  const [newAssignee, setNewAssignee] = useState('Muhammad Zaib Zafar');
  const [newDescription, setNewDescription] = useState('');
  const [newAssets, setNewAssets] = useState('WEB-PROD-01, DC-PROD-01');

  const filteredIncidents = incidentsList.filter(inc => {
    const matchSearch = search === '' || 
      inc.title.toLowerCase().includes(search.toLowerCase()) || 
      inc.id.toLowerCase().includes(search.toLowerCase()) ||
      inc.assignee.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || inc.status === statusFilter;
    const matchPriority = priorityFilter === 'all' || inc.priority === priorityFilter;
    return matchSearch && matchStatus && matchPriority;
  });

  const byStatus = {
    open: incidentsList.filter(i => i.status === 'open').length,
    in_progress: incidentsList.filter(i => i.status === 'in_progress').length,
    resolved: incidentsList.filter(i => i.status === 'resolved').length,
    closed: incidentsList.filter(i => i.status === 'closed').length,
  };

  const handleCreateIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const created: Incident = {
      id: `INC-2026-${String(90 + incidentsList.length).padStart(3, '0')}`,
      title: newTitle,
      priority: newPriority,
      status: 'open',
      impact: newImpact,
      urgency: newUrgency,
      assignee: newAssignee,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      description: newDescription || 'Manually declared incident during active threat triage.',
      affectedAssets: newAssets.split(',').map(a => a.trim()).filter(Boolean)
    };

    setIncidentsList([created, ...incidentsList]);
    setNewTitle('');
    setNewDescription('');
    setNewIncidentModalOpen(false);
    setSelectedIncident(created);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* 1. Incident Status Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-slate-950/80 border border-red-500/30">
          <p className="text-[11px] font-mono text-slate-400 uppercase">Open Incidents</p>
          <p className="text-2xl sm:text-3xl font-bold font-mono text-red-400 mt-1">{byStatus.open}</p>
          <span className="text-[10px] font-mono text-slate-500">Awaiting containment</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/80 border border-cyan-500/30">
          <p className="text-[11px] font-mono text-slate-400 uppercase">In Progress</p>
          <p className="text-2xl sm:text-3xl font-bold font-mono text-cyan-400 mt-1">{byStatus.in_progress}</p>
          <span className="text-[10px] font-mono text-slate-500">Tier 2 Triage active</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/80 border border-emerald-500/30">
          <p className="text-[11px] font-mono text-slate-400 uppercase">Resolved</p>
          <p className="text-2xl sm:text-3xl font-bold font-mono text-emerald-400 mt-1">{byStatus.resolved}</p>
          <span className="text-[10px] font-mono text-slate-500">Eradication verified</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
          <p className="text-[11px] font-mono text-slate-400 uppercase">Closed</p>
          <p className="text-2xl sm:text-3xl font-bold font-mono text-slate-400 mt-1">{byStatus.closed}</p>
          <span className="text-[10px] font-mono text-slate-500">Post-mortem filed</span>
        </div>
      </div>

      {/* 2. Priority Matrix Heatmap */}
      <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs sm:text-sm font-bold font-mono text-white uppercase tracking-wider flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-400" />
            Incident Priority Matrix (Impact vs Urgency)
          </h3>
          <span className="text-[10px] font-mono text-slate-400">Heatmap Distribution</span>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[500px] grid grid-cols-5 gap-1.5 text-xs font-mono">
            <div />
            {['Low Urgency', 'Med Urgency', 'High Urgency', 'Crit Urgency'].map(u => (
              <div key={u} className="text-center text-slate-400 font-bold py-1 bg-slate-900/60 rounded text-[11px]">
                {u}
              </div>
            ))}

            {['High Impact', 'Med Impact', 'Low Impact'].map(impact => (
              <React.Fragment key={impact}>
                <div className="text-slate-300 font-bold p-2 text-right pr-3 bg-slate-900/40 rounded flex items-center justify-end text-[11px]">
                  {impact}
                </div>
                {['low', 'medium', 'high', 'critical'].map(urgency => {
                  const matchingCount = incidentsList.filter(i => 
                    i.impact === impact.split(' ')[0].toLowerCase() &&
                    i.urgency === urgency &&
                    i.status !== 'closed'
                  ).length;
                  return (
                    <div 
                      key={urgency} 
                      className={`rounded-lg p-2.5 text-center font-bold text-sm transition-colors border ${
                        matchingCount >= 2 ? 'bg-red-950/80 text-red-300 border-red-500/60' :
                        matchingCount === 1 ? 'bg-orange-950/70 text-orange-300 border-orange-500/50' :
                        'bg-slate-900/40 text-slate-600 border-slate-800/60'
                      }`}
                    >
                      {matchingCount > 0 ? `${matchingCount} INC` : '—'}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Incidents List Table */}
      <div className="rounded-xl bg-slate-950/90 border border-slate-800 overflow-hidden">
        <div className="p-4 bg-slate-900/80 border-b border-slate-800 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search incidents, title, assignee..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Statuses</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <button
            type="button"
            onClick={() => setNewIncidentModalOpen(true)}
            className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-400 hover:from-cyan-300 hover:to-blue-300 transition-all flex items-center gap-1.5 cursor-pointer ml-auto"
          >
            <Plus className="w-4 h-4" />
            <span>New Incident</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs whitespace-nowrap">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 text-[11px]">
                <th className="px-4 py-2.5">ID</th>
                <th className="px-4 py-2.5">Incident Title</th>
                <th className="px-4 py-2.5">Priority</th>
                <th className="px-4 py-2.5">Status</th>
                <th className="px-4 py-2.5">Assignee</th>
                <th className="px-4 py-2.5">Created</th>
                <th className="px-4 py-2.5">Last Updated</th>
                <th className="px-4 py-2.5 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredIncidents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-slate-500 font-mono text-xs">
                    No active incidents matched the filter criteria.
                  </td>
                </tr>
              ) : (
                filteredIncidents.map((inc) => {
                  const badge = getSeverityBadgeStyle(inc.priority);
                  return (
                    <tr 
                      key={inc.id} 
                      onClick={() => setSelectedIncident(inc)}
                      className="hover:bg-slate-900/40 transition-colors cursor-pointer"
                    >
                      <td className="px-4 py-2.5 font-bold text-cyan-400">{inc.id}</td>
                      <td className="px-4 py-2.5 text-white max-w-[280px] truncate font-sans font-medium">
                        {inc.title}
                      </td>
                      <td className="px-4 py-2.5">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${badge.bg} ${badge.text} border ${badge.border}`}>
                          {inc.priority}
                        </span>
                      </td>
                      <td className="px-4 py-2.5">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] uppercase font-mono ${
                          inc.status === 'open' ? 'bg-red-950/60 text-red-300 border border-red-500/40' :
                          inc.status === 'in_progress' ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-500/40' :
                          inc.status === 'resolved' ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/40' :
                          'bg-slate-900 text-slate-400 border border-slate-800'
                        }`}>
                          {inc.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-slate-300 font-sans text-xs flex items-center gap-1.5">
                        <User className="w-3 h-3 text-cyan-400" />
                        <span>{inc.assignee}</span>
                      </td>
                      <td className="px-4 py-2.5 text-slate-400 text-[11px]">{inc.createdAt.split(' ')[0]}</td>
                      <td className="px-4 py-2.5 text-slate-400 text-[11px]">{inc.updatedAt.split(' ')[1]}</td>
                      <td className="px-4 py-2.5 text-right">
                        <ChevronRight className="w-4 h-4 text-slate-500 ml-auto" />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Incident Detail Modal Dialog */}
      {selectedIncident && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 animate-in fade-in duration-150">
          <div className="bg-[#0a1120] border border-cyan-500/40 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-400" />
                <h3 className="text-sm font-bold font-mono text-white">
                  {selectedIncident.id} — Incident Investigation
                </h3>
              </div>
              <button
                onClick={() => setSelectedIncident(null)}
                className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 overflow-y-auto font-mono text-xs flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded text-xs font-bold uppercase ${getSeverityBadgeStyle(selectedIncident.priority).bg} ${getSeverityBadgeStyle(selectedIncident.priority).text} border`}>
                  Priority: {selectedIncident.priority}
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-900 text-cyan-300 border border-slate-800 uppercase">
                  Status: {selectedIncident.status.replace('_', ' ')}
                </span>
                <span className="text-slate-400 ml-auto">
                  Lead: <strong className="text-white font-sans">{selectedIncident.assignee}</strong>
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <h4 className="text-sm font-bold font-sans text-white">{selectedIncident.title}</h4>
                <p className="text-xs font-sans text-slate-300 leading-relaxed pt-1">
                  {selectedIncident.description}
                </p>
              </div>

              {/* Affected Assets */}
              <div>
                <span className="text-slate-400 text-[11px] block mb-1.5 uppercase font-bold">Affected Hostnames / VLANs:</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedIncident.affectedAssets.map((asset) => (
                    <span key={asset} className="px-2 py-1 rounded bg-slate-950 text-cyan-300 border border-slate-800 text-[11px]">
                      {asset}
                    </span>
                  ))}
                </div>
              </div>

              {/* Forensic Activity Timeline */}
              <div>
                <span className="text-slate-400 text-[11px] block mb-2 uppercase font-bold">Investigation Audit Trail:</span>
                <div className="space-y-2 border-l border-slate-800 pl-3">
                  <div className="relative">
                    <div className="w-2 h-2 rounded-full bg-cyan-400 absolute -left-[17px] top-1" />
                    <p className="text-white font-sans text-xs">Status updated to {selectedIncident.status.replace('_', ' ')}</p>
                    <span className="text-[10px] text-slate-500">{selectedIncident.updatedAt} — SOC Console</span>
                  </div>
                  <div className="relative">
                    <div className="w-2 h-2 rounded-full bg-orange-400 absolute -left-[17px] top-1" />
                    <p className="text-white font-sans text-xs">Host isolation command queued via Wazuh active-response</p>
                    <span className="text-[10px] text-slate-500">Automatic Policy Trigger</span>
                  </div>
                  <div className="relative">
                    <div className="w-2 h-2 rounded-full bg-red-400 absolute -left-[17px] top-1" />
                    <p className="text-white font-sans text-xs">Incident opened from multi-source correlated telemetry</p>
                    <span className="text-[10px] text-slate-500">{selectedIncident.createdAt} — Detection Engine</span>
                  </div>
                </div>
              </div>

              {/* Status Update Buttons */}
              <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center gap-2">
                <span className="text-slate-400 text-xs mr-2">Transition Status:</span>
                {(['open', 'in_progress', 'resolved', 'closed'] as IncidentStatus[]).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => {
                      const updated = incidentsList.map(i => i.id === selectedIncident.id ? { ...i, status: st } : i);
                      setIncidentsList(updated);
                      setSelectedIncident({ ...selectedIncident, status: st });
                    }}
                    className={`px-2.5 py-1 rounded text-[11px] font-mono capitalize cursor-pointer border ${
                      selectedIncident.status === st 
                        ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400' 
                        : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    {st.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. New Incident Modal Dialog */}
      {newIncidentModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 animate-in fade-in duration-150">
          <div className="bg-[#0a1120] border border-cyan-500/40 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-bold font-mono text-white uppercase">Declare New Security Incident</h3>
              <button
                onClick={() => setNewIncidentModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateIncident} className="p-5 space-y-4 font-mono text-xs">
              <div>
                <label className="block text-slate-400 text-[11px] uppercase mb-1">Incident Headline</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Unauthorized Privileged Escalation on Domain Controller"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-sans text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 text-[11px] uppercase mb-1">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as Severity)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs focus:outline-none focus:border-cyan-500"
                  >
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 text-[11px] uppercase mb-1">Lead Investigator</label>
                  <input
                    type="text"
                    value={newAssignee}
                    onChange={(e) => setNewAssignee(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 text-[11px] uppercase mb-1">Affected Assets (Comma-separated)</label>
                <input
                  type="text"
                  value={newAssets}
                  onChange={(e) => setNewAssets(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-[11px] uppercase mb-1">Technical Summary & Initial Findings</label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Describe evidence, suspicious processes, outbound connections..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-sans text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setNewIncidentModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-mono"
                >
                  Confirm & Dispatch Incident
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
