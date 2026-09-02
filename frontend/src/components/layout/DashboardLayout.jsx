import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import EmergencyBanner from '../common/EmergencyBanner';
import { alertApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const DashboardLayout = () => {
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [criticalAlerts, setCriticalAlerts] = useState([]);

  useEffect(() => {
    const fetchCritical = async () => {
      try {
        const res = await alertApi.getActiveAlerts();
        if (res.data?.success && res.data.data) {
          const critical = res.data.data.filter(a => a.severity === 'CRITICAL');
          setCriticalAlerts(critical);
        }
      } catch (err) {
        // silent
      }
    };

    fetchCritical();
    const interval = setInterval(fetchCritical, 25000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Top Navbar */}
      <Navbar
        onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        isMobileMenuOpen={isMobileMenuOpen}
      />

      {/* Emergency Audio Banner for Critical Alerts */}
      <EmergencyBanner criticalAlerts={criticalAlerts} />

      <div className="flex-1 flex">
        {/* Role-based Sidebar (if user is authenticated) */}
        {user && (
          <Sidebar
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Main Content Area */}
        <main className={`flex-1 transition-all duration-200 ${user ? 'lg:pl-64' : ''}`}>
          <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>

      <div className={user ? 'lg:pl-64' : ''}>
        <Footer />
      </div>
    </div>
  );
};

export default DashboardLayout;
