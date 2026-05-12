import React from 'react';
import { FileText, Download, Clock, CheckCircle2, AlertTriangle, BarChart3 } from 'lucide-react';

// Mock data structured for future API integration
const MOCK_REPORTS = [
  {
    id: 'RPT-2026-001',
    title: 'Weekly Zone-Wise Collection Summary',
    date: '2026-05-10',
    category: 'Collection',
    status: 'completed',
  },
  {
    id: 'RPT-2026-002',
    title: 'MP Nagar Commercial Overflow Incident',
    date: '2026-05-09',
    category: 'Incident',
    status: 'flagged',
  },
  {
    id: 'RPT-2026-003',
    title: 'Monthly Fleet Fuel & Route Efficiency Audit',
    date: '2026-05-05',
    category: 'Analytics',
    status: 'completed',
  },
  {
    id: 'RPT-2026-004',
    title: 'Residential Colony E-3 Bin Upgrade Proposal',
    date: '2026-05-02',
    category: 'Planning',
    status: 'pending',
  },
];

const statusConfig = {
  completed: { icon: CheckCircle2, color: 'text-eco-emerald', bg: 'bg-eco-emerald/10', label: 'Completed' },
  flagged: { icon: AlertTriangle, color: 'text-rose-400', bg: 'bg-rose-500/10', label: 'Flagged' },
  pending: { icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10', label: 'Pending' },
};

const ReportsPanel = ({ isAdmin }) => {
  // Future: Replace MOCK_REPORTS with useEffect + fetch('/api/reports')
  const reports = MOCK_REPORTS;

  return (
    <div className="glass-panel rounded-2xl p-5 border border-emerald-500/10 text-left" id="reports-panel">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-eco-teal/10 border border-eco-teal/20 rounded-xl text-eco-teal">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Bhopal Municipal Waste Reports</h3>
            <p className="text-[10px] text-emerald-400/40 mt-0.5">Nagar Nigam operational documents & analytics</p>
          </div>
        </div>
        <span className="text-[10px] text-emerald-500/30 font-mono">{reports.length} records</span>
      </div>

      <div className="space-y-2">
        {reports.map((report) => {
          const sc = statusConfig[report.status] || statusConfig.pending;
          const StatusIcon = sc.icon;

          return (
            <div
              key={report.id}
              className="p-3 rounded-xl bg-eco-deep/30 border border-emerald-500/8 flex items-center justify-between gap-3 hover:border-emerald-500/20 transition-all group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-1.5 bg-eco-forest/50 rounded-lg text-emerald-400/50 shrink-0">
                  <FileText className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-white truncate">{report.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-emerald-500/30 font-mono">{report.id}</span>
                    <span className="text-[10px] text-emerald-500/20">•</span>
                    <span className="text-[10px] text-emerald-500/30">{report.date}</span>
                    <span className="text-[10px] text-emerald-500/20">•</span>
                    <span className="text-[10px] text-emerald-500/30">{report.category}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                <span className={`flex items-center gap-1 px-2 py-0.5 rounded-md ${sc.bg} text-[10px] font-bold ${sc.color}`}>
                  <StatusIcon className="w-3 h-3" />
                  {sc.label}
                </span>
                {isAdmin && (
                  <button className="p-1.5 rounded-lg text-emerald-500/30 hover:text-eco-emerald hover:bg-eco-forest/40 transition-all cursor-pointer opacity-0 group-hover:opacity-100" aria-label="Download report">
                    <Download className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ReportsPanel;
