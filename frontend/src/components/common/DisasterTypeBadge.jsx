import React from 'react';
import { Waves, Wind, Activity, Flame, Mountain, ShieldAlert, AlertTriangle, HelpCircle } from 'lucide-react';

const iconMap = {
  FLOOD: Waves,
  CYCLONE: Wind,
  EARTHQUAKE: Activity,
  FIRE: Flame,
  LANDSLIDE: Mountain,
  TSUNAMI: ShieldAlert,
  OTHER: AlertTriangle,
};

const colorMap = {
  FLOOD: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
  CYCLONE: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
  EARTHQUAKE: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
  FIRE: 'text-red-400 bg-red-500/10 border-red-500/30',
  LANDSLIDE: 'text-orange-400 bg-orange-500/10 border-orange-500/30',
  TSUNAMI: 'text-teal-400 bg-teal-500/10 border-teal-500/30',
  OTHER: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
};

const DisasterTypeBadge = ({ type, showIcon = true, className = '' }) => {
  const normalized = (type || 'OTHER').toUpperCase();
  const IconComponent = iconMap[normalized] || HelpCircle;
  const colorStyle = colorMap[normalized] || colorMap.OTHER;

  const formatLabel = (val) => {
    if (!val) return 'Unknown';
    return val.charAt(0).toUpperCase() + val.slice(1).toLowerCase();
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium border ${colorStyle} ${className}`}>
      {showIcon && <IconComponent className="w-3.5 h-3.5 flex-shrink-0" />}
      <span>{formatLabel(type)}</span>
    </span>
  );
};

export default DisasterTypeBadge;
