import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Volume2, VolumeX, ArrowRight, ShieldAlert } from 'lucide-react';
import { playEmergencySiren, stopEmergencySiren } from '../../utils/audioAlert';

const EmergencyBanner = ({ criticalAlerts = [] }) => {
  const [isPlayingSound, setIsPlayingSound] = useState(false);

  if (!criticalAlerts || criticalAlerts.length === 0) return null;

  const topAlert = criticalAlerts[0];

  const toggleSound = () => {
    if (isPlayingSound) {
      stopEmergencySiren();
      setIsPlayingSound(false);
    } else {
      playEmergencySiren(5000);
      setIsPlayingSound(true);
      setTimeout(() => setIsPlayingSound(false), 5000);
    }
  };

  return (
    <div className="bg-gradient-to-r from-red-950 via-red-900 to-rose-950 border-b border-red-700/60 text-white shadow-xl shadow-red-950/40 relative z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2 bg-red-600 rounded-lg animate-pulse flex-shrink-0">
            <ShieldAlert className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="bg-red-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded tracking-widest uppercase animate-pulse">
                EMERGENCY BROADCAST
              </span>
              <span className="text-red-300 text-xs hidden sm:inline font-medium">
                • {topAlert.location}
              </span>
            </div>
            <p className="text-sm font-bold text-slate-100 truncate mt-0.5">
              {topAlert.title}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-shrink-0">
          <button
            onClick={toggleSound}
            title={isPlayingSound ? "Mute Siren" : "Sound Emergency Siren Audio"}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all border ${
              isPlayingSound 
                ? 'bg-red-500 text-white border-red-400 animate-bounce' 
                : 'bg-red-950/80 hover:bg-red-800 text-red-200 border-red-700/60'
            }`}
          >
            {isPlayingSound ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span className="hidden sm:inline">{isPlayingSound ? "Stop Siren" : "Test Siren Audio"}</span>
          </button>

          <Link
            to={`/alerts/${topAlert.id}`}
            className="px-3.5 py-1.5 bg-white hover:bg-slate-100 text-red-950 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow hover:shadow-md"
          >
            <span>View Safety Actions</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EmergencyBanner;
