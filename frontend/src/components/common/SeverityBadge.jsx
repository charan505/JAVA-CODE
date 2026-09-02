import React from 'react';
import { AlertCircle, AlertTriangle, Info, Flame } from 'lucide-react';

const SeverityBadge = ({ severity, showIcon = true, size = 'sm' }) => {
  const sev = (severity || 'MEDIUM').toUpperCase();

  const configs = {
    CRITICAL: {
      label: 'CRITICAL',
      icon: Flame,
      style: 'bg-red-500/20 text-red-300 border-red-500/60 shadow-lg shadow-red-950/50 animate-pulse',
      iconColor: 'text-red-400',
    },
    HIGH: {
      label: 'HIGH',
      icon: AlertTriangle,
      style: 'bg-orange-500/15 text-orange-300 border-orange-500/40',
      iconColor: 'text-orange-400',
    },
    MEDIUM: {
      label: 'MEDIUM',
      icon: AlertCircle,
      style: 'bg-amber-500/15 text-amber-300 border-amber-500/40',
      iconColor: 'text-amber-400',
    },
    LOW: {
      label: 'LOW',
      icon: Info,
      style: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40',
      iconColor: 'text-emerald-400',
    },
  };

  const config = configs[sev] || configs.MEDIUM;
  const IconComponent = config.icon;

  const sizeClasses = size === 'lg' 
    ? 'px-3.5 py-1.5 text-xs font-bold' 
    : size === 'md'
    ? 'px-2.5 py-1 text-xs font-semibold'
    : 'px-2 py-0.5 text-[11px] font-semibold';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border ${config.style} ${sizeClasses} uppercase tracking-wider`}>
      {showIcon && <IconComponent className={size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />}
      <span>{config.label}</span>
    </span>
  );
};

export default SeverityBadge;
