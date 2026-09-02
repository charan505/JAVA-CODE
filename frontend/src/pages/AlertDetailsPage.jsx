import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  Volume2, 
  VolumeX, 
  ShieldAlert, 
  CheckCircle2, 
  User, 
  Users, 
  Share2, 
  BookmarkCheck,
  AlertTriangle,
  Flame,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { alertApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import SeverityBadge from '../components/common/SeverityBadge';
import DisasterTypeBadge from '../components/common/DisasterTypeBadge';
import { playEmergencySiren, stopEmergencySiren, playAcknowledgeSound } from '../utils/audioAlert';

const AlertDetailsPage = () => {
  const { id } = useParams();
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [alert, setAlert] = useState(null);
  const [readers, setReaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [markingRead, setMarkingRead] = useState(false);
  const [isPlayingSiren, setIsPlayingSiren] = useState(false);
  const [completedSteps, setCompletedSteps] = useState({});

  const fetchAlertDetails = async () => {
    try {
      setLoading(true);
      const res = await alertApi.getAlertById(id);
      if (res.data?.success) {
        setAlert(res.data.data);
      }

      if (isAdmin) {
        const readersRes = await alertApi.getReaders(id);
        if (readersRes.data?.success) {
          setReaders(readersRes.data.data || []);
        }
      }
    } catch (err) {
      console.error("Error loading alert details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlertDetails();
  }, [id, isAdmin]);

  const toggleSiren = () => {
    if (isPlayingSiren) {
      stopEmergencySiren();
      setIsPlayingSiren(false);
    } else {
      playEmergencySiren(6000);
      setIsPlayingSiren(true);
      setTimeout(() => setIsPlayingSiren(false), 6000);
    }
  };

  const handleMarkAsRead = async () => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: `/alerts/${id}` } } });
      return;
    }

    try {
      setMarkingRead(true);
      await alertApi.markAsRead(id);
      playAcknowledgeSound();

      // Trigger confetti celebration
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.85 }
        });
      } catch (e) {
        // silent
      }

      setAlert(prev => ({
        ...prev,
        isReadByCurrentUser: true,
        readCount: (prev.readCount || 0) + 1,
        currentUserReadAt: new Date().toISOString()
      }));

      if (isAdmin) {
        const readersRes = await alertApi.getReaders(id);
        if (readersRes.data?.success) {
          setReaders(readersRes.data.data || []);
        }
      }
    } catch (err) {
      console.error("Failed to mark as read:", err);
    } finally {
      setMarkingRead(false);
    }
  };

  const toggleStep = (idx) => {
    setCompletedSteps(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  if (loading) {
    return (
      <div className="p-16 text-center">
        <div className="w-8 h-8 border-3 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-slate-400 font-semibold">Retrieving alert briefing...</p>
      </div>
    );
  }

  if (!alert) {
    return (
      <div className="p-16 text-center space-y-4">
        <AlertTriangle className="w-12 h-12 text-red-400 mx-auto" />
        <h2 className="text-lg font-bold text-white">Alert Not Found</h2>
        <p className="text-xs text-slate-400">The requested emergency alert does not exist or has been removed.</p>
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-red-400 hover:underline">
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Dashboard</span>
        </Link>
      </div>
    );
  }

  // Parse safety instructions lines
  const instructionLines = alert.safetyInstructions
    ? alert.safetyInstructions.split('\n').filter(line => line.trim().length > 0)
    : [];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Alerts</span>
        </button>

        <div className="flex items-center gap-2">
          {alert.severity === 'CRITICAL' && (
            <button
              onClick={toggleSiren}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
                isPlayingSiren
                  ? 'bg-red-500 text-white border-red-400 animate-bounce'
                  : 'bg-red-950/60 hover:bg-red-900 text-red-300 border-red-700/60'
              }`}
            >
              {isPlayingSiren ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span>{isPlayingSiren ? "Stop Siren" : "Sound Siren"}</span>
            </button>
          )}

          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: alert.title, text: alert.description, url: window.location.href });
              } else {
                navigator.clipboard.writeText(window.location.href);
                window.alert("Alert link copied to clipboard!");
              }
            }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
            title="Share Alert Link"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Alert Card */}
      <div className={`p-6 sm:p-8 rounded-3xl border ${
        alert.severity === 'CRITICAL'
          ? 'bg-gradient-to-b from-red-950/60 via-slate-900 to-slate-900 border-red-500/60 glow-critical'
          : alert.severity === 'HIGH'
          ? 'bg-slate-900 border-orange-500/50 glow-high'
          : 'bg-slate-900 border-slate-800'
      } shadow-2xl space-y-6`}>
        
        {/* Badges & Meta */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
          <div className="flex flex-wrap items-center gap-2">
            <DisasterTypeBadge type={alert.disasterType} className="px-3 py-1 text-xs" />
            <SeverityBadge severity={alert.severity} size="lg" />
          </div>

          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              alert.status === 'ACTIVE'
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/40'
                : alert.status === 'RESOLVED'
                ? 'bg-blue-500/15 text-blue-400 border border-blue-500/40'
                : 'bg-slate-800 text-slate-400 border border-slate-700'
            }`}>
              {alert.status} STATUS
            </span>

            <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {new Date(alert.alertDateTime).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
            </span>
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            {alert.title}
          </h1>

          <div className="flex items-center gap-2 text-sm font-semibold text-slate-300">
            <MapPin className="w-4 h-4 text-red-400" />
            <span>Affected District: <strong className="text-white">{alert.location}</strong></span>
          </div>
        </div>

        {/* Description */}
        <div className="p-5 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Situation Report</h3>
          <p className="text-sm sm:text-base text-slate-200 leading-relaxed whitespace-pre-wrap">
            {alert.description}
          </p>
        </div>

        {/* Safety Instructions Checklist */}
        <div className="p-6 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-white">Recommended Safety Actions Checklist</h3>
            </div>
            <span className="text-xs text-slate-400">
              Interactive preparation checklist
            </span>
          </div>

          <div className="space-y-2.5">
            {instructionLines.map((step, idx) => {
              const isChecked = !!completedSteps[idx];
              return (
                <div
                  key={idx}
                  onClick={() => toggleStep(idx)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                    isChecked
                      ? 'bg-emerald-950/30 border-emerald-500/50 text-slate-200'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className={`mt-0.5 w-5 h-5 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors border ${
                    isChecked
                      ? 'bg-emerald-600 border-emerald-500 text-white'
                      : 'border-slate-600 bg-slate-950'
                  }`}>
                    {isChecked && <Check className="w-3.5 h-3.5" />}
                  </div>
                  <span className={`text-xs sm:text-sm leading-relaxed ${isChecked ? 'line-through text-slate-400' : ''}`}>
                    {step}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Read Acknowledgment Action Box */}
        <div className="p-5 bg-gradient-to-r from-slate-950 to-slate-900 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-xs text-slate-400">Citizen Engagement</p>
            <p className="text-sm font-bold text-white flex items-center gap-1.5 mt-0.5">
              <Users className="w-4 h-4 text-blue-400" />
              <span>{alert.readCount || 0} community citizens have acknowledged this warning</span>
            </p>
          </div>

          {alert.isReadByCurrentUser ? (
            <div className="px-4 py-2.5 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>You acknowledged this alert</span>
              {alert.currentUserReadAt && (
                <span className="text-[10px] text-emerald-400/80 font-mono">
                  ({new Date(alert.currentUserReadAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})
                </span>
              )}
            </div>
          ) : (
            <button
              onClick={handleMarkAsRead}
              disabled={markingRead}
              className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl shadow-lg shadow-red-950/60 flex items-center gap-2 transition-transform hover:-translate-y-0.5 disabled:opacity-50 text-xs sm:text-sm"
            >
              {markingRead ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <BookmarkCheck className="w-4 h-4" />
                  <span>I Have Read & Understood This Alert</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Admin Section: Citizens Acknowledgment Roster */}
      {isAdmin && (
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Community Acknowledgment Roster</h3>
              <p className="text-xs text-slate-400">Verified list of registered citizens who acknowledged this alert</p>
            </div>
            <span className="text-xs font-bold px-3 py-1 bg-slate-800 text-blue-400 rounded-full border border-slate-700">
              {readers.length} Acknowledgment{readers.length !== 1 ? 's' : ''}
            </span>
          </div>

          {readers.length === 0 ? (
            <p className="text-xs text-slate-400 py-4 text-center">No acknowledgments recorded yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Citizen Name</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Registered Location</th>
                    <th className="py-3 px-4">Acknowledged At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {readers.map((r, i) => (
                    <tr key={i} className="hover:bg-slate-800/40">
                      <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        {r.fullName}
                      </td>
                      <td className="py-3 px-4 text-slate-400 font-mono">{r.email}</td>
                      <td className="py-3 px-4 text-slate-300">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-red-400" />
                          {r.location}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-emerald-400 font-mono">
                        {new Date(r.readAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'medium' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AlertDetailsPage;
