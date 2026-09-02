import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Shield, Bell, User, LogOut, Menu, X, PhoneCall, AlertTriangle, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { alertApi } from '../../services/api';

const Navbar = ({ onMobileMenuToggle, isMobileMenuOpen }) => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeAlertsCount, setActiveAlertsCount] = useState(0);
  const [criticalCount, setCriticalCount] = useState(0);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);

  useEffect(() => {
    const fetchActiveCount = async () => {
      try {
        const res = await alertApi.getActiveAlerts();
        if (res.data?.success && res.data.data) {
          const list = res.data.data;
          setActiveAlertsCount(list.length);
          const crit = list.filter(a => a.severity === 'CRITICAL').length;
          setCriticalCount(crit);
        }
      } catch (err) {
        // silent catch
      }
    };
    fetchActiveCount();
    const interval = setInterval(fetchActiveCount, 30000); // 30s refresh
    return () => clearInterval(interval);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left: Brand & Mobile Hamburger */}
          <div className="flex items-center gap-3">
            {user && (
              <button
                onClick={onMobileMenuToggle}
                className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                aria-label="Toggle Sidebar"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            )}

            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="p-2 bg-gradient-to-tr from-red-600 to-rose-500 rounded-xl shadow-lg shadow-red-950/50 group-hover:scale-105 transition-transform">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
                  SmartDisaster <span className="text-red-500">Alert</span>
                </span>
                <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">
                  Community Early Warning
                </span>
              </div>
            </Link>
          </div>

          {/* Center/Right Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            
            {/* Quick Emergency Helplines Button */}
            <Link
              to="/safety-guidelines"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5 text-red-400" />
              <span>Safety Guides & Hotlines</span>
            </Link>

            {/* Active Alerts Bell / Counter */}
            <Link
              to={isAdmin ? "/admin/alerts" : "/user/dashboard"}
              className="relative p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              title="Active Disaster Alerts"
            >
              <Bell className="w-5 h-5" />
              {activeAlertsCount > 0 && (
                <span className={`absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold text-white rounded-full px-1 ${
                  criticalCount > 0 ? 'bg-red-600 animate-pulse' : 'bg-amber-600'
                }`}>
                  {activeAlertsCount}
                </span>
              )}
            </Link>

            {/* User Account / Auth buttons */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-800 border border-transparent hover:border-slate-700 transition-all text-left"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600 flex items-center justify-center text-sm font-bold text-white shadow">
                    {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="hidden sm:flex flex-col">
                    <span className="text-xs font-bold text-slate-200 truncate max-w-[130px]">
                      {user.fullName}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                      {isAdmin ? 'Admin' : 'Community'}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
                </button>

                {/* Profile Dropdown */}
                {profileDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setProfileDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 py-2 divide-y divide-slate-800 animate-fadeIn">
                      <div className="px-4 py-2.5">
                        <p className="text-xs text-slate-400">Signed in as</p>
                        <p className="text-xs font-bold text-white truncate">{user.email}</p>
                        <span className="mt-1 inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-red-400 border border-slate-700">
                          {user.location || 'HQ'}
                        </span>
                      </div>

                      <div className="py-1">
                        <Link
                          to={isAdmin ? "/admin/dashboard" : "/user/dashboard"}
                          onClick={() => setProfileDropdownOpen(false)}
                          className="block px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
                        >
                          Dashboard
                        </Link>
                        <Link
                          to="/profile"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="block px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
                        >
                          My Profile & Settings
                        </Link>
                      </div>

                      <div className="py-1">
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-xs font-medium text-red-400 hover:bg-red-500/10 flex items-center gap-2"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign out</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-500 rounded-lg shadow-md shadow-red-950/40 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
