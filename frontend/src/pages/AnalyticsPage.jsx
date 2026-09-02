import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  PieChart as PieIcon, 
  Calendar, 
  FileSpreadsheet,
  Clock,
  Eye
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { analyticsApi, alertApi } from '../services/api';
import SeverityBadge from '../components/common/SeverityBadge';
import DisasterTypeBadge from '../components/common/DisasterTypeBadge';

const COLORS = {
  FLOOD: '#3b82f6',
  CYCLONE: '#06b6d4',
  EARTHQUAKE: '#f59e0b',
  FIRE: '#ef4444',
  LANDSLIDE: '#f97316',
  TSUNAMI: '#14b8a6',
  OTHER: '#a855f7',
  CRITICAL: '#ef4444',
  HIGH: '#f97316',
  MEDIUM: '#f59e0b',
  LOW: '#10b981',
};

const AnalyticsPage = () => {
  const [stats, setStats] = useState(null);
  const [allAlerts, setAllAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const [statsRes, historyRes] = await Promise.all([
          analyticsApi.getAdminStats(),
          alertApi.getAlertHistory(),
        ]);

        if (statsRes.data?.success) {
          setStats(statsRes.data.data);
        }
        if (historyRes.data?.success) {
          setAllAlerts(historyRes.data.data || []);
        }
      } catch (err) {
        console.error("Error loading analytics:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const handleExportCSV = () => {
    if (allAlerts.length === 0) return;
    const headers = ["ID", "Disaster Type", "Title", "Location", "Severity", "Status", "Date Time", "Read Count"];
    const rows = allAlerts.map(a => [
      a.id,
      `"${a.disasterType}"`,
      `"${a.title.replace(/"/g, '""')}"`,
      `"${a.location.replace(/"/g, '""')}"`,
      `"${a.severity}"`,
      `"${a.status}"`,
      `"${a.alertDateTime}"`,
      a.readCount || 0
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `disaster_alerts_analytics_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="p-16 text-center">
        <div className="w-8 h-8 border-3 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-slate-400 font-semibold">Aggregating historical metrics and analytics...</p>
      </div>
    );
  }

  const disasterTypeData = stats?.alertsByDisasterType
    ? Object.entries(stats.alertsByDisasterType)
        .map(([name, value]) => ({ name, value }))
        .filter(item => item.value > 0)
    : [];

  const severityData = stats?.alertsBySeverity
    ? Object.entries(stats.alertsBySeverity).map(([name, count]) => ({
        name,
        count,
        fill: COLORS[name] || '#94a3b8'
      }))
    : [];

  const statusData = stats?.alertsByStatus
    ? Object.entries(stats.alertsByStatus).map(([name, count]) => ({
        name,
        count,
        fill: name === 'ACTIVE' ? '#10b981' : name === 'RESOLVED' ? '#3b82f6' : '#64748b'
      }))
    : [];

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-400">
            <BarChart3 className="w-4 h-4" />
            <span>Disaster Intelligence & Analytics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
            Alert History & Incident Analytics
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Statistical breakdown of disaster hazards, threat severity patterns, and citizen reach
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl border border-slate-700 flex items-center gap-2 transition-colors text-xs self-start sm:self-auto"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
          <span>Export Analytics CSV</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Alerts Logged</p>
          <p className="text-3xl font-black text-white mt-1">{stats?.totalAlerts || 0}</p>
          <p className="text-[11px] text-slate-400 mt-1">Full operational archive</p>
        </div>

        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Broadcasts</p>
          <p className="text-3xl font-black text-amber-400 mt-1">{stats?.activeAlerts || 0}</p>
          <p className="text-[11px] text-amber-400/80 mt-1">Currently live on citizen feeds</p>
        </div>

        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Resolved Incidents</p>
          <p className="text-3xl font-black text-emerald-400 mt-1">{stats?.resolvedAlerts || 0}</p>
          <p className="text-[11px] text-emerald-400/80 mt-1">Successfully de-escalated</p>
        </div>

        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Citizen Reach</p>
          <p className="text-3xl font-black text-blue-400 mt-1">{stats?.totalAcknowledgedReads || 0}</p>
          <p className="text-[11px] text-blue-400/80 mt-1">Total read acknowledgments</p>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Disaster Type Pie */}
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl space-y-4">
          <div>
            <h3 className="text-base font-bold text-white">Disaster Category Distribution</h3>
            <p className="text-xs text-slate-400">Proportion of alerts across environmental hazard types</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={disasterTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {disasterTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#64748b'} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
                <Legend formatter={(value) => <span className="text-xs text-slate-300 font-medium">{value}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Severity Bar Chart */}
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl space-y-4">
          <div>
            <h3 className="text-base font-bold text-white">Threat Severity Breakdown</h3>
            <p className="text-xs text-slate-400">Alert frequency categorized by risk level</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={severityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {severityData.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Historical Alerts Archive Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Full Alert History Archive</h3>
            <p className="text-xs text-slate-400">Complete historical timeline of all emergency notices</p>
          </div>
          <span className="text-xs font-bold text-slate-400">{allAlerts.length} Total Records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Headline</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Severity</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Date & Time</th>
                <th className="py-3.5 px-4">Citizen Reads</th>
                <th className="py-3.5 px-4 text-right">View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {allAlerts.map((alert) => (
                <tr key={alert.id} className="hover:bg-slate-800/40">
                  <td className="py-3.5 px-4"><DisasterTypeBadge type={alert.disasterType} /></td>
                  <td className="py-3.5 px-4 font-bold text-white max-w-xs truncate">{alert.title}</td>
                  <td className="py-3.5 px-4 text-slate-300">{alert.location}</td>
                  <td className="py-3.5 px-4"><SeverityBadge severity={alert.severity} /></td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      alert.status === 'ACTIVE'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : alert.status === 'RESOLVED'
                        ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}>
                      {alert.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-400">
                    {new Date(alert.alertDateTime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-300">
                    {alert.readCount || 0}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      to={`/alerts/${alert.id}`}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white inline-flex items-center"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
