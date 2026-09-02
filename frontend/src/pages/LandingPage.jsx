import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldAlert, 
  Radio, 
  Bell, 
  ArrowRight, 
  AlertTriangle, 
  Users, 
  MapPin, 
  Clock, 
  ChevronRight, 
  BookOpen, 
  PhoneCall, 
  Flame, 
  Waves, 
  Wind, 
  Activity, 
  CheckCircle2 
} from 'lucide-react';
import { alertApi } from '../services/api';
import SeverityBadge from '../components/common/SeverityBadge';
import DisasterTypeBadge from '../components/common/DisasterTypeBadge';
import { EMERGENCY_CONTACTS, DISASTER_TYPES } from '../utils/constants';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const { user, isAdmin } = useAuth();
  const [activeAlerts, setActiveAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await alertApi.getActiveAlerts();
        if (res.data?.success) {
          setActiveAlerts(res.data.data || []);
        }
      } catch (err) {
        console.error("Error loading active alerts:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAlerts();
  }, []);

  const criticalCount = activeAlerts.filter(a => a.severity === 'CRITICAL').length;

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-red-950 border border-slate-800 p-8 sm:p-12 shadow-2xl">
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-6">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span>Official Community Emergency Network</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Rapid Disaster Early Warning & Life-Saving Alerts
          </h1>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Connecting emergency command centers with local citizens in real time. Get instant verified disaster broadcasts, authoritative evacuation routes, and survival guidelines tailored to your district.
          </p>

          {/* Call to action buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            {user ? (
              <Link
                to={isAdmin ? "/admin/dashboard" : "/user/dashboard"}
                className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl shadow-lg shadow-red-950/60 flex items-center gap-2 transition-transform hover:-translate-y-0.5"
              >
                <span>Go to My Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl shadow-lg shadow-red-950/60 flex items-center gap-2 transition-transform hover:-translate-y-0.5"
                >
                  <span>Join Community Alert Network</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/login"
                  className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl border border-slate-700 transition-colors"
                >
                  Administrator / Citizen Login
                </Link>
              </>
            )}

            <Link
              to="/safety-guidelines"
              className="px-5 py-3 text-slate-300 hover:text-white font-semibold flex items-center gap-2 hover:underline"
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>Read Safety Protocols</span>
            </Link>
          </div>
        </div>

        {/* Hero Quick Stats Strip */}
        <div className="mt-10 pt-8 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center sm:text-left">
          <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-800/60">
            <p className="text-2xl font-black text-white">{activeAlerts.length}</p>
            <p className="text-xs text-slate-400 font-medium">Active Disaster Alerts</p>
          </div>
          <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-800/60">
            <p className="text-2xl font-black text-red-400">{criticalCount}</p>
            <p className="text-xs text-slate-400 font-medium">Critical Emergencies</p>
          </div>
          <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-800/60">
            <p className="text-2xl font-black text-emerald-400">&lt; 2s</p>
            <p className="text-xs text-slate-400 font-medium">Broadcast Latency</p>
          </div>
          <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-800/60">
            <p className="text-2xl font-black text-blue-400">100%</p>
            <p className="text-xs text-slate-400 font-medium">Verified Civil Dispatch</p>
          </div>
        </div>
      </div>

      {/* Live Emergency Broadcast Feed */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-red-500/10 rounded-lg border border-red-500/20 text-red-400">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white tracking-tight">Active Disaster Broadcasts</h2>
              <p className="text-xs text-slate-400">Live emergency advisories and critical situation reports</p>
            </div>
          </div>

          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
            {activeAlerts.length} Active Notice{activeAlerts.length !== 1 ? 's' : ''}
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl">
            <div className="w-8 h-8 border-3 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-slate-400">Connecting to disaster monitoring network...</p>
          </div>
        ) : activeAlerts.length === 0 ? (
          <div className="p-12 text-center bg-slate-900/60 border border-slate-800 rounded-2xl">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-200">No Active Emergency Alerts</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              All monitored regions are currently in normal status. Stay prepared and review the safety guidelines.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-5 rounded-2xl border transition-all glass-panel-hover flex flex-col justify-between ${
                  alert.severity === 'CRITICAL'
                    ? 'bg-gradient-to-b from-red-950/40 to-slate-900/90 border-red-500/50 glow-critical'
                    : alert.severity === 'HIGH'
                    ? 'bg-slate-900/90 border-orange-500/40'
                    : 'bg-slate-900/90 border-slate-800'
                }`}
              >
                <div>
                  {/* Top badges */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <DisasterTypeBadge type={alert.disasterType} />
                      <SeverityBadge severity={alert.severity} />
                    </div>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(alert.alertDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {/* Title & Location */}
                  <h3 className="text-base font-bold text-white leading-snug group-hover:text-red-400 transition-colors">
                    {alert.title}
                  </h3>

                  <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                    <span>{alert.location}</span>
                  </div>

                  <p className="mt-2 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {alert.description}
                  </p>
                </div>

                {/* Bottom Action */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    {alert.readCount || 0} Citizens Acknowledged
                  </span>
                  <Link
                    to={`/alerts/${alert.id}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-red-400 hover:text-red-300 transition-colors"
                  >
                    <span>Read Safety Steps</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Disaster Categories & Guidelines Preview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-white tracking-tight">Emergency Response Guides</h2>
            <p className="text-xs text-slate-400">Essential survival actions and checklists for major disaster types</p>
          </div>
          <Link
            to="/safety-guidelines"
            className="text-xs font-bold text-red-400 hover:underline flex items-center gap-1"
          >
            <span>View Full Manual</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {DISASTER_TYPES.slice(0, 6).map((item) => (
            <Link
              key={item.value}
              to={`/safety-guidelines?type=${item.value}`}
              className="p-4 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl flex flex-col items-center text-center group transition-all hover:-translate-y-1 shadow"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2.5 ${item.bg} ${item.border} border`}>
                <DisasterTypeBadge type={item.value} showIcon={true} className="border-none bg-transparent" />
              </div>
              <span className="text-xs font-bold text-slate-200 group-hover:text-white">
                {item.label}
              </span>
              <span className="text-[10px] text-slate-400 mt-1">Checklist & Do's</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Emergency Helplines Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-red-600 text-white rounded-xl shadow-lg shadow-red-950/50">
            <PhoneCall className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">24/7 Emergency Helpline Directory</h3>
            <p className="text-xs text-slate-400">Direct speed dials for civil protection, disaster response & rescue squads</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {EMERGENCY_CONTACTS.map((contact, idx) => (
            <div key={idx} className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl flex items-start gap-3">
              <div className={`p-2 rounded-lg text-white ${contact.color} shadow-sm`}>
                <PhoneCall className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">{contact.name}</p>
                <p className="text-base font-black text-white font-mono tracking-wider mt-0.5">{contact.number}</p>
                <p className="text-[11px] text-slate-400 mt-1">{contact.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
