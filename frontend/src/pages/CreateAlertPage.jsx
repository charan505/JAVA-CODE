import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShieldAlert, 
  Send, 
  MapPin, 
  Clock, 
  FileText, 
  HelpCircle, 
  Sparkles, 
  ArrowLeft,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { alertApi } from '../services/api';
import { DISASTER_TYPES, SEVERITY_LEVELS, ALERT_STATUSES, COMMON_LOCATIONS } from '../utils/constants';
import SeverityBadge from '../components/common/SeverityBadge';
import DisasterTypeBadge from '../components/common/DisasterTypeBadge';
import ConfirmModal from '../components/common/ConfirmModal';

const SAFETY_TEMPLATES = {
  FLOOD: "1. Immediately move to high ground or designated emergency shelters.\n2. Do not drive or walk through moving floodwater.\n3. Turn off main circuit breakers and gas supply valves.\n4. Keep emergency go-bags, clean drinking water, and battery radios ready.",
  CYCLONE: "1. Board up and secure all windows; bring loose outdoor items indoors.\n2. Evacuate low-lying coastal belts immediately to inland storm shelters.\n3. Remain inside sturdy interior rooms without glass during eye passage.\n4. Keep charged mobile phones, power banks, and battery lights ready.",
  EARTHQUAKE: "1. Drop, Cover, and Hold On under sturdy furniture during active tremors.\n2. Stay away from glass windows, heavy bookcases, and exterior brick walls.\n3. Extinguish open flames and inspect gas/water supply lines.\n4. Do not use elevators under any circumstances.",
  FIRE: "1. Clear combustible foliage and patio items from home perimeter.\n2. Keep vehicle pointed forward in driveway with windows closed.\n3. Wear N95 masks or wet cloth coverings to prevent smoke inhalation.\n4. Follow designated evacuation routes immediately.",
  LANDSLIDE: "1. Stay alert to unusual sounds like cracking trees or bursts of muddy water.\n2. Evacuate perpendicular to the flow path towards higher ground.\n3. Avoid river valleys and low-lying drainage channels.\n4. Report ground cracks or leaning utility poles to emergency services.",
  TSUNAMI: "1. Evacuate immediately inland or to higher ground (at least 30m above sea level).\n2. If trapped in concrete multi-story buildings, move to 3rd floor or roof.\n3. Never go to beaches to watch incoming surge waves.\n4. Remain on high ground until official all-clear is sounded.",
  OTHER: "1. Follow emergency broadcast bulletins from civil defense authorities.\n2. Shelter-in-place until situation clearance is issued.\n3. Check on elderly neighbors and vulnerable family members.\n4. Keep emergency survival supplies accessible.",
};

const CreateAlertPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    disasterType: 'FLOOD',
    title: '',
    description: '',
    location: COMMON_LOCATIONS[0],
    customLocation: '',
    severity: 'HIGH',
    alertDateTime: new Date().toISOString().slice(0, 16),
    safetyInstructions: SAFETY_TEMPLATES.FLOOD,
    status: 'ACTIVE',
  });

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTypeChange = (type) => {
    setFormData({
      ...formData,
      disasterType: type,
      safetyInstructions: SAFETY_TEMPLATES[type] || formData.safetyInstructions,
    });
  };

  const handleApplyTemplate = () => {
    if (SAFETY_TEMPLATES[formData.disasterType]) {
      setFormData({
        ...formData,
        safetyInstructions: SAFETY_TEMPLATES[formData.disasterType],
      });
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setError('');

    const resolvedLocation = formData.location === 'CUSTOM'
      ? formData.customLocation.trim()
      : formData.location;

    if (!resolvedLocation) {
      setError('Please provide the affected location or district');
      return;
    }

    setIsConfirmOpen(true);
  };

  const handleConfirmBroadcast = async () => {
    try {
      setLoading(true);
      const resolvedLocation = formData.location === 'CUSTOM'
        ? formData.customLocation.trim()
        : formData.location;

      const payload = {
        ...formData,
        location: resolvedLocation,
        alertDateTime: formData.alertDateTime ? new Date(formData.alertDateTime).toISOString() : new Date().toISOString(),
      };

      const res = await alertApi.createAlert(payload);
      if (res.data?.success) {
        setIsConfirmOpen(false);
        navigate('/admin/alerts', { state: { message: 'Disaster alert successfully broadcasted to community!' } });
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to broadcast alert');
      setIsConfirmOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const resolvedLocationDisplay = formData.location === 'CUSTOM'
    ? (formData.customLocation || 'Custom Location')
    : formData.location;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex items-center gap-3">
        <Link
          to="/admin/alerts"
          className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white rounded-xl transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Create & Broadcast Disaster Alert</h1>
          <p className="text-xs text-slate-400">Publish immediate emergency instructions and advisories to registered citizens</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/15 border border-red-500/40 rounded-xl text-red-300 text-xs flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Grid: Form on Left, Live Broadcast Preview on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Form (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
          <form onSubmit={handleFormSubmit} className="space-y-6">
            
            {/* 1. Disaster Type Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">
                1. Select Disaster Category *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {DISASTER_TYPES.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => handleTypeChange(type.value)}
                    className={`p-3 rounded-xl border text-left transition-all flex flex-col items-center justify-center text-center gap-1.5 ${
                      formData.disasterType === type.value
                        ? 'bg-red-500/20 border-red-500 text-white shadow-md'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <DisasterTypeBadge type={type.value} showIcon={true} className="border-none bg-transparent" />
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Severity Level Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">
                2. Threat Severity Level *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {SEVERITY_LEVELS.map((sev) => (
                  <button
                    key={sev.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, severity: sev.value })}
                    className={`p-3 rounded-xl border text-center font-bold text-xs transition-all ${
                      formData.severity === sev.value
                        ? `${sev.badge} border-current shadow-lg`
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {sev.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Alert Title */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                3. Alert Headline / Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Mandatory Evacuation Order: Flash Flood in Sector 4"
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
              />
            </div>

            {/* 4. Location & Date/Time (2 cols) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Affected Geographic Location *
                </label>
                <select
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-red-500"
                >
                  {COMMON_LOCATIONS.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                  <option value="CUSTOM">+ Specify Other Region</option>
                </select>

                {formData.location === 'CUSTOM' && (
                  <input
                    type="text"
                    required
                    value={formData.customLocation}
                    onChange={(e) => setFormData({ ...formData, customLocation: e.target.value })}
                    placeholder="Enter district name..."
                    className="mt-2 w-full px-4 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-red-500"
                  />
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Alert Date & Time *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={formData.alertDateTime}
                  onChange={(e) => setFormData({ ...formData, alertDateTime: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-100 font-mono focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            {/* 5. Detailed Description */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                5. Situation Description & Impact *
              </label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Provide accurate description of the hazard, meteorological tracking, water levels, wind speed, or expected impact timeline..."
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500 resize-y"
              />
            </div>

            {/* 6. Safety Instructions */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-300">
                  6. Safety Instructions & Evacuation Guidance *
                </label>
                <button
                  type="button"
                  onClick={handleApplyTemplate}
                  className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Insert Standard Template</span>
                </button>
              </div>
              <textarea
                required
                rows={5}
                value={formData.safetyInstructions}
                onChange={(e) => setFormData({ ...formData, safetyInstructions: e.target.value })}
                placeholder="List numbered action steps, evacuation shelters, road closures, and survival rules..."
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500 font-mono text-xs leading-relaxed resize-y"
              />
            </div>

            {/* 7. Status */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Broadcast Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-red-500"
              >
                {ALERT_STATUSES.map((st) => (
                  <option key={st.value} value={st.value}>{st.label}</option>
                ))}
              </select>
            </div>

            {/* Submit */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
              <Link
                to="/admin/alerts"
                className="px-5 py-2.5 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="px-6 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl shadow-lg shadow-red-950/60 flex items-center gap-2 transition-transform hover:-translate-y-0.5 text-sm"
              >
                <Send className="w-4 h-4" />
                <span>Review & Publish Alert</span>
              </button>
            </div>
          </form>
        </div>

        {/* Live Card Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-300">Live Citizen Card Preview</h3>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-slate-800 text-slate-400 rounded">
              Real-time Output
            </span>
          </div>

          <div className={`p-6 rounded-2xl border transition-all ${
            formData.severity === 'CRITICAL'
              ? 'bg-gradient-to-b from-red-950/50 to-slate-900 border-red-500/60 glow-critical'
              : formData.severity === 'HIGH'
              ? 'bg-slate-900 border-orange-500/50 glow-high'
              : 'bg-slate-900 border-slate-800'
          } shadow-2xl space-y-4`}>
            
            {/* Header info */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <DisasterTypeBadge type={formData.disasterType} />
                <SeverityBadge severity={formData.severity} />
              </div>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                {formData.status}
              </span>
            </div>

            {/* Title */}
            <h4 className="text-base font-bold text-white leading-snug">
              {formData.title || 'Alert Headline will appear here...'}
            </h4>

            {/* Location & Time */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-red-400" />
                {resolvedLocationDisplay}
              </span>
              <span className="flex items-center gap-1 font-mono text-slate-400">
                <Clock className="w-3.5 h-3.5" />
                {new Date(formData.alertDateTime).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            {/* Description */}
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-3 rounded-xl border border-slate-800">
              {formData.description || 'Detailed hazard description and advisory impact statement will display in this container for community citizens.'}
            </p>

            {/* Safety Guidance Box */}
            <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2">
              <p className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4" />
                <span>Life-Safety Actions:</span>
              </p>
              <pre className="text-[11px] font-sans text-slate-300 whitespace-pre-wrap leading-relaxed">
                {formData.safetyInstructions || '1. Follow official civil instructions...'}
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Confirm Emergency Broadcast"
        message={`You are about to broadcast a ${formData.severity} severity alert for "${formData.title}" in ${resolvedLocationDisplay}. It will immediately become visible to all registered community citizens.`}
        confirmText="Confirm & Broadcast"
        confirmVariant="danger"
        isLoading={loading}
        onConfirm={handleConfirmBroadcast}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </div>
  );
};

export default CreateAlertPage;
