import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Play, 
  Plus, 
  Clock, 
  Trash2, 
  Calendar, 
  CheckCircle,
  FileCheck,
  Sparkles
} from 'lucide-react';
import { reportTemplates, scheduledReports, ScheduledReport } from '../../data/socDashboardData';

export const SocReportsPage: React.FC = () => {
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [generatedIds, setGeneratedIds] = useState<Set<string>>(new Set());
  const [dateRange, setDateRange] = useState('7d');
  const [scheduledList, setScheduledList] = useState<ScheduledReport[]>(scheduledReports);

  const handleGenerateReport = (id: string, name: string) => {
    setGeneratingId(id);
    setTimeout(() => {
      setGeneratingId(null);
      setGeneratedIds(prev => new Set(prev).add(id));
      
      // Trigger a synthetic file download
      const reportBlob = new Blob([
        `CYBERSHIELD PK SOC OPERATIONS REPORT\nTitle: ${name}\nGenerated: ${new Date().toISOString()}\nStatus: Verified\nCompliance Standard: ISO 27001 / NIST CSF`
      ], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(reportBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${name.toLowerCase().replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.txt`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    }, 1500);
  };

  const handleDeleteScheduled = (id: string) => {
    setScheduledList(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* 1. Report Templates Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-sm sm:text-base font-bold font-mono text-white uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-4 h-4 text-cyan-400" />
            Security Intelligence Report Templates
          </h2>
          <p className="text-xs font-mono text-slate-400">
            Generate executive compliance and forensic post-mortem briefs on-demand
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400">Report Window:</span>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last quarter (90d)</option>
          </select>
        </div>
      </div>

      {/* 2. Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reportTemplates.map((tpl) => {
          const isGenerating = generatingId === tpl.id;
          const isDone = generatedIds.has(tpl.id);

          return (
            <div key={tpl.id} className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-bold font-sans text-white">{tpl.name}</h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                      {tpl.frequency}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-sans mt-1 leading-relaxed">
                    {tpl.description}
                  </p>
                  <span className="text-[11px] font-mono text-slate-500 mt-2 block">
                    Estimated scope: ~{tpl.estimatedPages} pages • PDF / CSV / JSON
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <button
                  type="button"
                  disabled={isGenerating}
                  onClick={() => handleGenerateReport(tpl.id, tpl.name)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                    isGenerating
                      ? 'bg-cyan-950 text-cyan-400 border border-cyan-500/50 animate-pulse'
                      : isDone
                      ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-900'
                      : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950'
                  }`}
                >
                  {isGenerating ? (
                    <>
                      <span className="w-3 h-3 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                      <span>Compiling...</span>
                    </>
                  ) : isDone ? (
                    <>
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Regenerate Brief</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5" />
                      <span>Generate Report</span>
                    </>
                  )}
                </button>

                <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
                  <button 
                    type="button"
                    onClick={() => handleGenerateReport(tpl.id, `${tpl.name}_PDF`)}
                    className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-[11px] flex items-center gap-1 text-slate-300"
                  >
                    <Download className="w-3 h-3" /> PDF
                  </button>
                  <button 
                    type="button"
                    onClick={() => handleGenerateReport(tpl.id, `${tpl.name}_CSV`)}
                    className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-[11px] flex items-center gap-1 text-slate-300"
                  >
                    <Download className="w-3 h-3" /> CSV
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Scheduled Automated Reports */}
      <div className="rounded-xl bg-slate-950/90 border border-slate-800 overflow-hidden">
        <div className="p-4 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-xs sm:text-sm font-bold font-mono text-white uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              Scheduled Automated Email & Webhook Broadcasts
            </h3>
            <p className="text-[11px] font-mono text-slate-400">
              Recurring dispatches sent to CISO, SOC team, and audit leads
            </p>
          </div>

          <span className="text-xs font-mono px-2 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">
            Cron Active
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs whitespace-nowrap">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 text-[11px]">
                <th className="px-4 py-2.5">Schedule Name</th>
                <th className="px-4 py-2.5">Cadence / Schedule</th>
                <th className="px-4 py-2.5">Next Run Timestamp</th>
                <th className="px-4 py-2.5">Recipients</th>
                <th className="px-4 py-2.5">State</th>
                <th className="px-4 py-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {scheduledList.map((item) => (
                <tr key={item.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="px-4 py-2.5 font-bold text-white flex items-center gap-2">
                    <FileCheck className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{item.name}</span>
                  </td>
                  <td className="px-4 py-2.5 text-slate-400">{item.frequency}</td>
                  <td className="px-4 py-2.5 text-cyan-300">{item.nextRun}</td>
                  <td className="px-4 py-2.5 text-slate-400 max-w-[240px] truncate">{item.recipients}</td>
                  <td className="px-4 py-2.5">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] uppercase ${
                      item.status === 'active' ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' : 'bg-slate-900 text-slate-500 border border-slate-800'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <button
                      type="button"
                      onClick={() => handleDeleteScheduled(item.id)}
                      className="p-1 rounded text-red-400 hover:text-red-300 hover:bg-red-950/40 transition-colors cursor-pointer"
                      title="Delete schedule"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Quick Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">47</p>
            <p className="text-xs text-slate-400">Reports Generated (This Month)</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-emerald-400">{scheduledList.length}</p>
            <p className="text-xs text-slate-400">Automated Cron Pipelines</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-orange-950/60 border border-orange-500/30 flex items-center justify-center text-orange-400">
            <Download className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">312</p>
            <p className="text-xs text-slate-400">Total Forensic Downloads</p>
          </div>
        </div>
      </div>
    </div>
  );
};
