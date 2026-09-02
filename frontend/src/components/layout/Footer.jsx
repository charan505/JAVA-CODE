import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, PhoneCall, HeartHandshake, ExternalLink } from 'lucide-react';
import { EMERGENCY_CONTACTS } from '../../utils/constants';

const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 text-slate-400 text-xs py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Section: Contacts Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-8 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2 text-slate-100 font-bold text-sm mb-3">
              <Shield className="w-4 h-4 text-red-500" />
              <span>Smart Disaster System</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              Empowering civil administration and local communities with instant early warnings, verified evacuation steps, and real-time safety coordination.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-200 text-sm mb-3">Quick Navigation</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-red-400 transition-colors">Home & Live Feed</Link></li>
              <li><Link to="/safety-guidelines" className="hover:text-red-400 transition-colors">Disaster Safety Manual</Link></li>
              <li><Link to="/login" className="hover:text-red-400 transition-colors">Portal Login</Link></li>
              <li><Link to="/register" className="hover:text-red-400 transition-colors">Register as Community User</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-200 text-sm mb-3">Emergency Helplines</h4>
            <ul className="space-y-1.5 font-mono">
              <li className="text-red-400 font-bold">National Dispatch: 911 / 112</li>
              <li>Disaster Force (NDRF): 1078</li>
              <li>Fire Services: 101</li>
              <li>Ambulance / Medical: 108</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-200 text-sm mb-3">Community Preparedness</h4>
            <p className="text-slate-400 text-xs leading-relaxed mb-3">
              Always maintain a 72-hour emergency go-bag and verify alerts through this official channel.
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Broadcast Network Active</span>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-400">
          <p>© {new Date().getFullYear()} Smart Disaster Early Warning and Community Alert Management System. All rights reserved.</p>
          <p className="text-[11px] text-slate-400">Built for pair-programming demonstration & disaster preparedness.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
