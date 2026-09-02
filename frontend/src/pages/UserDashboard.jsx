import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldAlert, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  BookmarkCheck, 
  BookOpen, 
  PhoneCall, 
  ChevronRight, 
  AlertTriangle, 
  Flame, 
  Filter, 
  Search,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { alertApi, analyticsApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import SeverityBadge from '../components/common/SeverityBadge';
import DisasterTypeBadge from '../components/common/DisasterTypeBadge';
import { playAcknowledgeSound } from '../utils/audioAlert';
import { EMERGENCY_CONTACTS } from '../utils/constants';

const UserDashboard = () => {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [historyAlerts, setHistoryAlerts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [locationOnly, setLocationOnly] = useState(true);
  const [markingId, setMarkingId] = useState(null);
  const [activeTab, setActiveTab] = useState('ACTIVE'); // 'ACTIVE' | 'HISTORY'

  const fetchData = async () => {
    try {
      setLoading(true);
      const [alertsRes, historyRes, statsRes] = await Promise.all([
        alertApi.getActiveAlerts(),
        alertApi.getAlertHistory(),
        analyticsApi.getUserStats(),
      ]);

      if (alertsRes.data?.success) {
        setAlerts(alertsRes.data.data || []);
      }
      if (historyRes.data?.success) {
        setHistoryAlerts(historyRes.data.data || []);
      }
      if (statsRes.data?.success) {
        setStats(statsRes.data.data);
      }
    } catch (err) {
      console.error("Error loading user dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleMarkAsRead = async (alertId) => {
    try {
      setMarkingId(alertId);
      await alertApi.markAsRead(alertId);
      playAcknowledgeSound();

      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.85 }
        });
      } catch (e) {}

      // Update local state
      setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, isReadByCurrentUser: true, readCount: (a.readCount || 0) + 1 } : a));
      setHistoryAlerts(prev => prev.map(a => a.id === alertId ? { ...a, isReadByCurrentUser: true } : a));
      
      // Update stats
      if (stats) {
        setStats(prev => ({
          ...prev,
          acknowledgedAlerts: prev.acknowledgedAlerts + 1,
          unreadCriticalAlerts: Math.max(0, prev.unreadCriticalAlerts - 1),
        }));
      }
    } catch (err) {
      console.error("Failed to mark as read:", err);
    } finally {
      setMarkingId(null);
    }
  };

  // Filter alerts by user's location if toggled
  const filteredActiveAlerts = alerts.filter(alert => {
    if (!locationOnly) return true;
    if (!user?.location) return true;
    return alert.location.toLowerCase().includes(user.location.toLowerCase()) ||
           user.location.toLowerCase().includes(alert.location.toLowerCase());
  });

  const filteredHistoryAlerts = historyAlerts.filter(a => a.status !== 'ACTIVE');

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-blue-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              <span>Community Citizen Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
              Welcome, {user?.fullName || 'Citizen'}
            </h1>
            <p className="text-xs text-slate-300 flex items-center gap-1.5 mt-1 font-medium">
              <MapPin className="w-3.5 h-3.5 text-red-400" />
              <span>Registered Area: <strong className="text-white">{user?.location || 'Central District'}</strong></span>
            </p>
          </div>

          <Link
            to="/safety-guidelines"
            className="px-4 py-2.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 font-bold rounded-xl border border-blue-500/40 flex items-center gap-2 transition-colors text-xs self-start sm:self-auto"
          >
            <BookOpen className="w-4 h-4" />
            <span>Emergency Guidelines</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">In Your Area</p>
          <p className="text-2xl font-black text-white mt-1">{stats?.activeAlertsInLocation || 0}</p>
          <p className="text-[10px] text-slate-400 mt-1">Active hazard advisories</p>
        </div>

        <div className="p-4 bg-gradient-to-br from-red-950/40 to-slate-900 border border-red-500/30 rounded-2xl shadow">
          <p className="text-[11px] font-bold text-red-300 uppercase tracking-wider">Unread Critical</p>
          <p className="text-2xl font-black text-red-400 mt-1">{stats?.unreadCriticalAlerts || 0}</p>
          <p className="text-[10px] text-red-300/70 mt-1">Require immediate review</p>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Acknowledged</p>
          <p className="text-2xl font-black text-emerald-400 mt-1">{stats?.acknowledgedAlerts || 0}</p>
          <p className="text-[10px] text-emerald-400/70 mt-1">Safety actions confirmed</p>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Active</p>
          <p className="text-2xl font-black text-blue-400 mt-1">{stats?.totalActiveAlerts || 0}</p>
          <p className="text-[10px] text-slate-400 mt-1">Across all districts</p>
        </div>
      </div>

      {/* Tabs & Location Filter Switch */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('ACTIVE')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'ACTIVE'
                ? 'bg-red-600 text-white shadow-md shadow-red-950/50'
                : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
            }`}
          >
            Active Emergencies ({alerts.length})
          </button>
          <button
            onClick={() => setActiveTab('HISTORY')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'HISTORY'
                ? 'bg-red-600 text-white shadow-md shadow-red-950/50'
                : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
            }`}
          >
            Previous Alerts Archive ({filteredHistoryAlerts.length})
          </button>
        </div>

        {activeTab === 'ACTIVE' && (
          <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
            <button
              onClick={() => setLocationOnly(true)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                locationOnly ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              My Region ({user?.location || 'Local'})
            </button>
            <button
              onClick={() => setLocationOnly(false)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                !locationOnly ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              All Regions
            </button>
          </div>
        )}
      </div>

      {/* Active Tab Content */}
      {activeTab === 'ACTIVE' && (
        <div className="space-y-4">
          {loading ? (
            <div className="p-16 text-center">
              <div className="w-8 h-8 border-3 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs text-slate-400 font-semibold">Refreshing emergency alerts...</p>
            </div>
          ) : filteredActiveAlerts.length === 0 ? (
            <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-200">No Active Alerts in This View</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                {locationOnly
                  ? `Your area (${user?.location}) currently has no active emergency advisories. You can switch to "All Regions" to see state-wide broadcasts.`
                  : "All monitored districts are currently in normal status."}
              </p>
              {locationOnly && (
                <button
                  onClick={() => setLocationOnly(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 mt-2"
                >
                  View All Regions
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredActiveAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-6 rounded-2xl border transition-all ${
                    alert.severity === 'CRITICAL'
                      ? 'bg-gradient-to-r from-red-950/60 via-slate-900 to-slate-900 border-red-500/60 glow-critical'
                      : alert.severity === 'HIGH'
                      ? 'bg-slate-900 border-orange-500/50 glow-high'
                      : 'bg-slate-900 border-slate-800'
                  } shadow-xl space-y-4`}
                >
                  {/* Card Header */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <DisasterTypeBadge type={alert.disasterType} />
                      <SeverityBadge severity={alert.severity} />
                    </div>

                    <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(alert.alertDateTime).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {/* Title & Location */}
                  <div>
                    <Link
                      to={`/alerts/${alert.id}`}
                      className="text-lg font-bold text-white hover:text-red-400 transition-colors leading-snug"
                    >
                      {alert.title}
                    </Link>

                    <div className="flex items-center gap-1.5 text-xs text-slate-300 font-semibold mt-1">
                      <MapPin className="w-3.5 h-3.5 text-red-400" />
                      <span>{alert.location}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {alert.description}
                  </p>

                  {/* Safety instructions preview */}
                  {alert.safetyInstructions && (
                    <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800/80">
                      <p className="text-[11px] font-bold text-amber-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <ShieldAlert className="w-3.5 h-3.5" />
                        <span>Safety Action Plan</span>
                      </p>
                      <p className="text-xs text-slate-300 whitespace-pre-wrap line-clamp-3">
                        {alert.safetyInstructions}
                      </p>
                    </div>
                  )}

                  {/* Bottom Actions Bar */}
                  <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
                    <Link
                      to={`/alerts/${alert.id}`}
                      className="text-xs font-bold text-red-400 hover:text-red-300 flex items-center gap-1"
                    >
                      <span>Full Briefing & Checklist</span>
                      <ChevronRight className="w-4 h-4" />
                    </Link>

                    {alert.isReadByCurrentUser ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-xl">
                        <Check className="w-4 h-4" />
                        <span>Acknowledged</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => handleMarkAsRead(alert.id)}
                        disabled={markingId === alert.id}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs rounded-xl border border-slate-700 flex items-center gap-1.5 transition-colors disabled:opacity-50"
                      >
                        {markingId === alert.id ? (
                          <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <BookmarkCheck className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Mark as Read</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Previous Alerts Archive Tab */}
      {activeTab === 'HISTORY' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
          {filteredHistoryAlerts.length === 0 ? (
            <p className="p-8 text-center text-xs text-slate-400">No past emergency advisories in the archive.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                  <tr>
                    <th className="py-3.5 px-4">Disaster Type</th>
                    <th className="py-3.5 px-4">Title</th>
                    <th className="py-3.5 px-4">Location</th>
                    <th className="py-3.5 px-4">Severity</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4 text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {filteredHistoryAlerts.map((a) => (
                    <tr key={a.id} className="hover:bg-slate-800/40">
                      <td className="py-3.5 px-4"><DisasterTypeBadge type={a.disasterType} /></td>
                      <td className="py-3.5 px-4 font-bold text-white max-w-xs truncate">{a.title}</td>
                      <td className="py-3.5 px-4 text-slate-300">{a.location}</td>
                      <td className="py-3.5 px-4"><SeverityBadge severity={a.severity} /></td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          a.status === 'RESOLVED' ? 'bg-blue-500/15 text-blue-400' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {a.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-400">
                        {new Date(a.alertDateTime).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          to={`/alerts/${a.id}`}
                          className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[11px] font-semibold"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Emergency Contacts Hotlinks */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
          <PhoneCall className="w-4 h-4 text-red-400" />
          <span>Quick Emergency Hotline Numbers</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {EMERGENCY_CONTACTS.slice(0, 4).map((c, i) => (
            <div key={i} className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl">
              <p className="text-[11px] text-slate-400 font-medium">{c.name}</p>
              <p className="text-base font-black text-white font-mono mt-0.5">{c.number}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
