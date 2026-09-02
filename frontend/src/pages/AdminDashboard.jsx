import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  PlusCircle, 
  ListFilter, 
  BarChart3, 
  Clock, 
  MapPin, 
  Eye, 
  Trash2, 
  TrendingUp, 
  Radio,
  RefreshCw
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend 
} from 'recharts';
import { analyticsApi, alertApi } from '../services/api';
import SeverityBadge from '../components/common/SeverityBadge';
import DisasterTypeBadge from '../components/common/DisasterTypeBadge';
import ConfirmModal from '../components/common/ConfirmModal';

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

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteAlertId, setDeleteAlertId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    try {
      setRefreshing(true);
      const res = await analyticsApi.getAdminStats();
      if (res.data?.success) {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error("Error loading admin dashboard stats:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleDeleteConfirm = async () => {
    if (!deleteAlertId) return;
    try {
      setIsDeleting(true);
      await alertApi.deleteAlert(deleteAlertId);
      setDeleteAlertId(null);
      await fetchStats();
    } catch (err) {
      alert("Failed to delete alert: " + (err.response?.data?.message || err.message));
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-16 text-center">
        <div className="w-10 h-10 border-3 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm font-semibold text-slate-400">Loading Command Center Analytics...</p>
      </div>
    );
  }

  // Format data for Recharts
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

  return (
    <div className="space-y-8">
      {/* Top Welcome & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-red-400">
              Command & Control Center
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
            Disaster Operations Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchStats}
            disabled={refreshing}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            title="Refresh Metrics"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-red-400' : ''}`} />
          </button>

          <Link
            to="/admin/alerts/create"
            className="px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl shadow-lg shadow-red-950/60 flex items-center gap-2 transition-transform hover:-translate-y-0.5 text-xs sm:text-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Broadcast New Alert</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Registered Citizens */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Registered Users</p>
            <p className="text-3xl font-black text-white mt-1">{stats?.totalUsers || 0}</p>
            <p className="text-[11px] text-emerald-400 font-medium mt-1">
              {stats?.activeUsers || 0} active citizens
            </p>
          </div>
          <div className="p-3.5 bg-blue-500/10 border border-blue-500/30 rounded-xl text-blue-400">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Active Alerts */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Alerts</p>
            <p className="text-3xl font-black text-amber-400 mt-1">{stats?.activeAlerts || 0}</p>
            <p className="text-[11px] text-slate-400 mt-1">
              Out of {stats?.totalAlerts || 0} total logged
            </p>
          </div>
          <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        {/* Critical Alerts */}
        <div className="p-5 bg-gradient-to-br from-red-950/60 to-slate-900 border border-red-500/40 rounded-2xl shadow flex items-center justify-between glow-critical">
          <div>
            <p className="text-xs font-bold text-red-300 uppercase tracking-wider">Critical Severity</p>
            <p className="text-3xl font-black text-red-400 mt-1">{stats?.criticalAlerts || 0}</p>
            <p className="text-[11px] text-red-300/80 mt-1">Immediate life hazard</p>
          </div>
          <div className="p-3.5 bg-red-600 text-white rounded-xl shadow-lg shadow-red-950/60 animate-pulse">
            <ShieldAlert className="w-6 h-6" />
          </div>
        </div>

        {/* Resolved Alerts */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Resolved Advisories</p>
            <p className="text-3xl font-black text-emerald-400 mt-1">{stats?.resolvedAlerts || 0}</p>
            <p className="text-[11px] text-emerald-400/80 mt-1">
              {stats?.totalAcknowledgedReads || 0} total acknowledgments
            </p>
          </div>
          <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Disaster Type Distribution */}
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Alerts by Disaster Type</h3>
              <p className="text-xs text-slate-400">Breakdown of active and historical emergencies</p>
            </div>
            <BarChart3 className="w-5 h-5 text-slate-400" />
          </div>

          <div className="h-64 w-full">
            {disasterTypeData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                No disaster alert data available yet.
              </div>
            ) : (
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
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                  />
                  <Legend
                    formatter={(value) => <span className="text-xs text-slate-300 font-medium">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Chart 2: Severity Distribution */}
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Alerts by Severity Level</h3>
              <p className="text-xs text-slate-400">Distribution across hazard danger ratings</p>
            </div>
            <TrendingUp className="w-5 h-5 text-slate-400" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={severityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
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

      {/* Recent Alerts Management Table */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Recent Disaster Alerts</h3>
            <p className="text-xs text-slate-400">Latest 5 emergency alerts broadcasted across districts</p>
          </div>
          <Link
            to="/admin/alerts"
            className="text-xs font-bold text-red-400 hover:underline flex items-center gap-1"
          >
            <span>Manage All Alerts</span>
            <span>&rarr;</span>
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Disaster Type</th>
                <th className="py-3 px-4">Alert Title</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {stats?.recentAlerts?.map((alert) => (
                <tr key={alert.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4">
                    <DisasterTypeBadge type={alert.disasterType} />
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-100 max-w-[200px] truncate">
                    {alert.title}
                  </td>
                  <td className="py-3 px-4 text-slate-300">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-red-400" />
                      {alert.location}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <SeverityBadge severity={alert.severity} />
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                    {new Date(alert.alertDateTime).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      alert.status === 'ACTIVE'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : alert.status === 'RESOLVED'
                        ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}>
                      {alert.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/alerts/${alert.id}`}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => setDeleteAlertId(alert.id)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
                        title="Delete Alert"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteAlertId}
        title="Delete Disaster Alert"
        message="Are you sure you want to permanently delete this disaster alert? This will remove all broadcast notices and read receipts."
        confirmText="Delete Alert"
        confirmVariant="danger"
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteAlertId(null)}
      />
    </div>
  );
};

export default AdminDashboard;
