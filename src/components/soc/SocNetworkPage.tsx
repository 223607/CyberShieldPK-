import React, { useState } from 'react';
import { 
  Network, 
  Wifi, 
  Search, 
  XCircle, 
  ShieldAlert, 
  Radio, 
  ArrowDown, 
  ArrowUp,
  Activity
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, Legend 
} from 'recharts';
import { 
  NetworkConnection, 
  initialNetworkConnections, 
  networkTraffic, 
  protocolDistribution,
  formatBytes 
} from '../../data/socDashboardData';

export const SocNetworkPage: React.FC = () => {
  const [connections, setConnections] = useState<NetworkConnection[]>(initialNetworkConnections);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredConnections = connections.filter(c => {
    const matchSearch = search === '' || 
      c.sourceIp.includes(search) || 
      c.destIp.includes(search) || 
      c.protocol.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleTerminateConnection = (id: string) => {
    setConnections(prev => prev.map(c => c.id === id ? { ...c, status: 'closed' } : c));
  };

  const anomalies = connections.filter(c => c.status === 'suspicious');

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* 1. Network Stats Counters */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
          <p className="text-[11px] font-mono text-slate-400 uppercase">Active Sessions</p>
          <p className="text-2xl sm:text-3xl font-bold font-mono text-emerald-400 mt-1">
            {connections.filter(c => c.status === 'established').length}
          </p>
          <span className="text-[10px] font-mono text-slate-500">Established TCP sockets</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/80 border border-red-500/30">
          <p className="text-[11px] font-mono text-slate-400 uppercase">Suspicious Anomalies</p>
          <p className="text-2xl sm:text-3xl font-bold font-mono text-red-400 mt-1">
            {anomalies.length}
          </p>
          <span className="text-[10px] font-mono text-slate-500">Flagged by Zeek / Suricata</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/80 border border-cyan-500/30">
          <p className="text-[11px] font-mono text-slate-400 uppercase">Ingress Throughput</p>
          <p className="text-2xl sm:text-3xl font-bold font-mono text-cyan-400 mt-1 flex items-center gap-1">
            <ArrowDown className="w-5 h-5 text-cyan-400" /> 19.8 <span className="text-sm">GB/s</span>
          </p>
          <span className="text-[10px] font-mono text-slate-500">Peak perimeter load</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/80 border border-amber-500/30">
          <p className="text-[11px] font-mono text-slate-400 uppercase">Egress Throughput</p>
          <p className="text-2xl sm:text-3xl font-bold font-mono text-amber-400 mt-1 flex items-center gap-1">
            <ArrowUp className="w-5 h-5 text-amber-400" /> 13.2 <span className="text-sm">GB/s</span>
          </p>
          <span className="text-[10px] font-mono text-slate-500">Outbound data stream</span>
        </div>
      </div>

      {/* 2. Network Traffic (24h) & Protocol Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Network Traffic Area Chart */}
        <div className="lg:col-span-2 p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h3 className="text-xs sm:text-sm font-bold font-mono text-white uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              Perimeter Bandwidth Traffic Volume (24h)
            </h3>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00d4ff]" /> Inbound (GB)
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ffa502]" /> Outbound (GB)
              </span>
            </div>
          </div>

          <div className="w-full h-52 min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={networkTraffic} margin={{ top: 8, right: 10, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="netIn" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#00d4ff" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="netOut" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ffa502" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ffa502" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="time" tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }} axisLine={false} tickLine={false} unit=" GB" />
                <Tooltip contentStyle={{ background: '#091120', border: '1px solid #1e3a5f', borderRadius: 8, fontSize: 11, fontFamily: 'monospace' }} />
                <Area type="monotone" dataKey="inbound" stroke="#00d4ff" fill="url(#netIn)" strokeWidth={2} dot={false} />
                <Area type="monotone" dataKey="outbound" stroke="#ffa502" fill="url(#netOut)" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Protocol Distribution Pie Chart */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs sm:text-sm font-bold font-mono text-white uppercase tracking-wider">
              Protocol Distribution
            </h3>
            <span className="text-[10px] font-mono text-slate-400">Port Breakdown</span>
          </div>

          <div className="w-full h-44 min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={protocolDistribution} 
                  cx="50%" 
                  cy="50%" 
                  outerRadius={65} 
                  paddingAngle={3} 
                  dataKey="value"
                >
                  {protocolDistribution.map((entry, i) => (
                    <Cell key={i} fill={entry.color} stroke="#091120" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ background: '#091120', border: '1px solid #1e3a5f', borderRadius: 8, fontSize: 11, fontFamily: 'monospace' }} 
                  formatter={(val: any) => [`${val}%`, 'Bandwidth']}
                />
                <Legend 
                  layout="horizontal" 
                  verticalAlign="bottom"
                  wrapperStyle={{ fontSize: 10, fontFamily: 'monospace', paddingTop: 6 }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 3. Real-time Anomaly Detection Alerts */}
      {anomalies.length > 0 && (
        <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs sm:text-sm font-bold font-mono text-red-400 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
              Active Network Anomaly Alerts ({anomalies.length})
            </h3>
            <span className="text-[10px] font-mono text-red-300">Action Required</span>
          </div>

          <div className="space-y-2">
            {anomalies.map((anom) => (
              <div key={anom.id} className="p-3 rounded-lg bg-slate-950/90 border border-red-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-red-400 font-bold">{anom.sourceIp}</span>
                    <span className="text-slate-500">→</span>
                    <span className="text-white font-bold">{anom.destIp}:{anom.port}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-500/40 uppercase">
                      {anom.protocol}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Geo: <strong className="text-white">{anom.country}</strong> • Egress: {formatBytes(anom.bytesOut)} • Duration: {anom.duration}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleTerminateConnection(anom.id)}
                  className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer w-fit"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Terminate & Drop IP</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Active Connections Table */}
      <div className="rounded-xl bg-slate-950/90 border border-slate-800 overflow-hidden">
        <div className="p-4 bg-slate-900/80 border-b border-slate-800 flex flex-wrap items-center gap-3">
          <h3 className="text-xs sm:text-sm font-bold font-mono text-white uppercase tracking-wider flex items-center gap-2">
            <Network className="w-4 h-4 text-cyan-400" />
            Live Monitored Socket Connections
          </h3>

          <div className="relative ml-auto">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter IP or protocol..."
              className="pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-44"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All States</option>
            <option value="established">Established</option>
            <option value="suspicious">Suspicious</option>
            <option value="listening">Listening</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs whitespace-nowrap">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 text-[11px]">
                <th className="px-4 py-2.5">Source IP</th>
                <th className="px-4 py-2.5">Destination IP</th>
                <th className="px-4 py-2.5">Port</th>
                <th className="px-4 py-2.5">Protocol</th>
                <th className="px-4 py-2.5">State</th>
                <th className="px-4 py-2.5">Duration</th>
                <th className="px-4 py-2.5">Bytes In</th>
                <th className="px-4 py-2.5">Bytes Out</th>
                <th className="px-4 py-2.5">Country</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredConnections.map((conn) => (
                <tr 
                  key={conn.id} 
                  className={`hover:bg-slate-900/40 transition-colors ${
                    conn.status === 'suspicious' ? 'bg-red-950/20' : ''
                  }`}
                >
                  <td className="px-4 py-2.5 font-bold text-white">{conn.sourceIp}</td>
                  <td className="px-4 py-2.5 font-bold text-white">{conn.destIp}</td>
                  <td className="px-4 py-2.5 text-cyan-400">{conn.port}</td>
                  <td className="px-4 py-2.5 text-slate-300 uppercase">{conn.protocol}</td>
                  <td className="px-4 py-2.5">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] uppercase font-mono ${
                      conn.status === 'suspicious' ? 'bg-red-950 text-red-300 border border-red-500/40' :
                      conn.status === 'established' ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' :
                      conn.status === 'listening' ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40' :
                      'bg-slate-900 text-slate-500 border border-slate-800'
                    }`}>
                      {conn.status}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-slate-400 text-[11px]">{conn.duration}</td>
                  <td className="px-4 py-2.5 text-slate-400 text-[11px]">{formatBytes(conn.bytesIn)}</td>
                  <td className="px-4 py-2.5 text-slate-300 text-[11px]">{formatBytes(conn.bytesOut)}</td>
                  <td className="px-4 py-2.5 text-white font-bold">{conn.country}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
