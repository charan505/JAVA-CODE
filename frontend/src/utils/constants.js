export const DISASTER_TYPES = [
  { value: 'FLOOD', label: 'Flood', icon: 'Waves', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30' },
  { value: 'CYCLONE', label: 'Cyclone', icon: 'Wind', color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30' },
  { value: 'EARTHQUAKE', label: 'Earthquake', icon: 'Activity', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
  { value: 'FIRE', label: 'Fire / Wildfire', icon: 'Flame', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30' },
  { value: 'LANDSLIDE', label: 'Landslide', icon: 'Mountain', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30' },
  { value: 'TSUNAMI', label: 'Tsunami', icon: 'ShieldAlert', color: 'text-teal-400', bg: 'bg-teal-500/10', border: 'border-teal-500/30' },
  { value: 'OTHER', label: 'Other Emergency', icon: 'AlertTriangle', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30' },
];

export const SEVERITY_LEVELS = [
  { value: 'LOW', label: 'Low', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', badge: 'bg-emerald-950 text-emerald-300 border-emerald-700/50' },
  { value: 'MEDIUM', label: 'Medium', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30', badge: 'bg-amber-950 text-amber-300 border-amber-700/50' },
  { value: 'HIGH', label: 'High', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30', badge: 'bg-orange-950 text-orange-300 border-orange-700/50' },
  { value: 'CRITICAL', label: 'Critical', color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/50', badge: 'bg-red-950 text-red-300 border-red-500 animate-pulse' },
];

export const ALERT_STATUSES = [
  { value: 'ACTIVE', label: 'Active', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
  { value: 'RESOLVED', label: 'Resolved', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30' },
  { value: 'EXPIRED', label: 'Expired', color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/30' },
];

export const COMMON_LOCATIONS = [
  "Coastal Region Alpha",
  "River Basin Zone",
  "Mountain Valley District",
  "Highland Ridge",
  "Metro Central",
  "Eastern Port Authority",
  "Northwest Hill Tracts",
  "Southern Delta Region",
  "Western Industrial Corridor",
];

export const EMERGENCY_CONTACTS = [
  { name: "Emergency Command Dispatch", number: "911 / 112", desc: "Toll-free 24/7 central emergency line", icon: "PhoneCall", color: "bg-red-500" },
  { name: "National Disaster Relief Force", number: "1078", desc: "Search, rescue, flood & cyclone response", icon: "LifeBuoy", color: "bg-orange-500" },
  { name: "Fire & Rescue Services", number: "101", desc: "Structural fires, hazmat & evacuations", icon: "Flame", color: "bg-amber-500" },
  { name: "Emergency Medical & Ambulance", number: "108", desc: "Trauma, medical transit & critical aid", icon: "Ambulance", color: "bg-blue-500" },
  { name: "Red Cross Emergency Center", number: "1800-419-8733", desc: "Temporary shelter, blood banks & relief", icon: "Cross", color: "bg-emerald-500" },
];
