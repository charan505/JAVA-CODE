import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PlusCircle, 
  ListFilter, 
  Users, 
  BarChart3, 
  BookOpen, 
  UserCheck, 
  BellRing,
  ShieldAlert,
  Info
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, isAdmin } = useAuth();

  const adminLinks = [
    { to: '/admin/dashboard', label: 'Admin Dashboard', icon: LayoutDashboard, exact: true },
    { to: '/admin/alerts/create', label: 'Create Alert', icon: PlusCircle },
    { to: '/admin/alerts', label: 'Manage Alerts', icon: ListFilter },
    { to: '/admin/users', label: 'Community Users', icon: Users },
    { to: '/admin/analytics', label: 'Alert Analytics', icon: BarChart3 },
    { to: '/safety-guidelines', label: 'Safety Guidelines', icon: BookOpen },
    { to: '/profile', label: 'Admin Profile', icon: UserCheck },
  ];

  const userLinks = [
    { to: '/user/dashboard', label: 'My Dashboard', icon: LayoutDashboard },
    { to: '/safety-guidelines', label: 'Safety Guidelines', icon: BookOpen },
    { to: '/profile', label: 'My Profile', icon: UserCheck },
  ];

  const links = isAdmin ? adminLinks : userLinks;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 bg-slate-900 border-r border-slate-800 transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col justify-between`}
      >
        {/* Navigation items */}
        <div className="p-4 space-y-1 overflow-y-auto">
          <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            {isAdmin ? 'Command Controls' : 'Community Center'}
          </div>

          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.exact}
                onClick={() => {
                  if (window.innerWidth < 1024) onClose();
                }}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-red-600/15 text-red-400 border border-red-500/30 shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`
                }
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{link.label}</span>
              </NavLink>
            );
          })}
        </div>

        {/* Bottom System Status Widget */}
        <div className="p-4 border-t border-slate-800">
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold text-slate-200">Alert Network Online</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400">
              Live updates & rapid sirens enabled
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
