import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  MapPin, 
  Phone, 
  Lock, 
  ShieldCheck, 
  Save, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { COMMON_LOCATIONS } from '../utils/constants';

const ProfilePage = () => {
  const { user, updateUserProfile, isAdmin } = useAuth();

  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    location: user?.location || COMMON_LOCATIONS[0],
    customLocation: '',
    phone: user?.phone || '',
    newPassword: '',
    confirmPassword: '',
  });

  const [isCustomLoc, setIsCustomLoc] = useState(!COMMON_LOCATIONS.includes(user?.location || ''));
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setErrorMsg('New passwords do not match');
      return;
    }

    if (formData.newPassword && formData.newPassword.length < 6) {
      setErrorMsg('New password must be at least 6 characters');
      return;
    }

    const resolvedLocation = isCustomLoc
      ? (formData.customLocation || formData.location).trim()
      : formData.location;

    try {
      setLoading(true);
      await updateUserProfile({
        fullName: formData.fullName,
        location: resolvedLocation,
        phone: formData.phone,
        newPassword: formData.newPassword || null,
      });

      setSuccessMsg('Profile details successfully updated!');
      setFormData(prev => ({ ...prev, newPassword: '', confirmPassword: '' }));
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-400">
          <User className="w-4 h-4" />
          <span>User Account & Security</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
          Profile & Preferences
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Manage your contact credentials and geographic broadcast preferences
        </p>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-500/20 border border-emerald-500/50 rounded-xl text-emerald-300 text-xs font-semibold flex items-center gap-2 shadow-lg">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-red-500/15 border border-red-500/40 rounded-xl text-red-300 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Profile Card Summary (Left Col) */}
        <div className="md:col-span-1 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6 flex flex-col justify-between">
          <div className="space-y-4 text-center">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-red-600 to-rose-500 flex items-center justify-center text-3xl font-black text-white shadow-xl shadow-red-950/60">
              {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
            </div>

            <div>
              <h3 className="text-lg font-bold text-white">{user?.fullName}</h3>
              <p className="text-xs text-slate-400 font-mono">{user?.email}</p>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-red-400 border border-slate-700 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{isAdmin ? 'System Administrator' : 'Community Citizen'}</span>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-800 text-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span>Account Status:</span>
              <span className="font-bold text-emerald-400 uppercase">{user?.accountStatus || 'ACTIVE'}</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Alerts Acknowledged:</span>
              <span className="font-mono font-bold text-white">{user?.alertsAcknowledgedCount || 0}</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Registered Area:</span>
              <span className="font-medium text-slate-200 text-right truncate max-w-[120px]">{user?.location}</span>
            </div>
          </div>
        </div>

        {/* Edit Form (Right 2 cols) */}
        <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <h3 className="text-base font-bold text-white pb-3 border-b border-slate-800">
            Edit Information & Security
          </h3>

          <form onSubmit={handleSave} className="space-y-4 text-xs">
            
            {/* Full Name */}
            <div>
              <label className="block font-bold text-slate-300 mb-1.5">Full Name *</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  required
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:border-red-500 focus:outline-none text-xs"
                />
              </div>
            </div>

            {/* Email Address (Read-only) */}
            <div>
              <label className="block font-bold text-slate-300 mb-1.5">Email Address (Fixed)</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-950/50 border border-slate-800 rounded-xl text-slate-500 cursor-not-allowed font-mono text-xs"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block font-bold text-slate-300 mb-1.5">Monitored District / Location *</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <select
                  value={isCustomLoc ? 'CUSTOM' : formData.location}
                  onChange={(e) => {
                    if (e.target.value === 'CUSTOM') {
                      setIsCustomLoc(true);
                    } else {
                      setIsCustomLoc(false);
                      setFormData({ ...formData, location: e.target.value });
                    }
                  }}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:border-red-500 focus:outline-none text-xs"
                >
                  {COMMON_LOCATIONS.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                  <option value="CUSTOM">+ Specify Other Region</option>
                </select>
              </div>

              {isCustomLoc && (
                <input
                  type="text"
                  required
                  placeholder="Enter district name..."
                  value={formData.customLocation || formData.location}
                  onChange={(e) => setFormData({ ...formData, customLocation: e.target.value, location: e.target.value })}
                  className="mt-2 w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 text-xs focus:border-red-500 focus:outline-none"
                />
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block font-bold text-slate-300 mb-1.5">Emergency Mobile / Phone</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:border-red-500 focus:outline-none font-mono text-xs"
                />
              </div>
            </div>

            {/* Password Section */}
            <div className="pt-3 border-t border-slate-800 space-y-3">
              <p className="font-bold text-slate-200">Change Password (Leave blank to keep current)</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">New Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      placeholder="Min 6 characters"
                      className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:border-red-500 focus:outline-none text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Confirm New Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Repeat new password"
                      className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:border-red-500 focus:outline-none text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-4 flex items-center justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl shadow-lg shadow-red-950/60 flex items-center gap-2 transition-transform hover:-translate-y-0.5 disabled:opacity-50 text-xs"
              >
                {loading ? (
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
