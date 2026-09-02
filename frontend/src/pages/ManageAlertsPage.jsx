import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  PlusCircle, 
  Search, 
  Filter, 
  Eye, 
  Edit3, 
  Trash2, 
  MapPin, 
  Clock, 
  Users, 
  AlertTriangle, 
  X, 
  Check, 
  ShieldAlert,
  ChevronDown
} from 'lucide-react';
import { alertApi, communityApi } from '../services/api';
import { DISASTER_TYPES, SEVERITY_LEVELS, ALERT_STATUSES } from '../utils/constants';
import SeverityBadge from '../components/common/SeverityBadge';
import DisasterTypeBadge from '../components/common/DisasterTypeBadge';
import ConfirmModal from '../components/common/ConfirmModal';

const ManageAlertsPage = () => {
  const routerLocation = useLocation();
  const [alerts, setAlerts] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState(routerLocation.state?.message || '');

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');

  // Delete & Edit states
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingAlert, setEditingAlert] = useState(null);
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (typeFilter) params.disasterType = typeFilter;
      if (severityFilter) params.severity = severityFilter;
      if (locationFilter) params.location = locationFilter;
      if (searchTerm) params.search = searchTerm;

      const res = await alertApi.getAlerts(params);
      if (res.data?.success) {
        setAlerts(res.data.data || []);
      }
    } catch (err) {
      console.error("Error loading alerts:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLocations = async () => {
    try {
      const res = await communityApi.getLocations();
      if (res.data?.success) {
        setLocations(res.data.data || []);
      }
    } catch (e) {
      // silent
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAlerts();
    }, 250);
    return () => clearTimeout(timer);
  }, [searchTerm, statusFilter, typeFilter, severityFilter, locationFilter]);

  const handleStatusChange = async (alertId, newStatus) => {
    try {
      await alertApi.updateStatus(alertId, newStatus);
      setToastMessage(`Alert status successfully updated to ${newStatus}`);
      fetchAlerts();
      setTimeout(() => setToastMessage(''), 4000);
    } catch (err) {
      alert("Failed to update status: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      setIsDeleting(true);
      await alertApi.deleteAlert(deleteId);
      setDeleteId(null);
      setToastMessage("Alert permanently deleted");
      fetchAlerts();
      setTimeout(() => setToastMessage(''), 4000);
    } catch (err) {
      alert("Failed to delete alert: " + (err.response?.data?.message || err.message));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingAlert) return;
    try {
      setIsSavingEdit(true);
      await alertApi.updateAlert(editingAlert.id, editingAlert);
      setEditingAlert(null);
      setToastMessage("Alert successfully updated");
      fetchAlerts();
      setTimeout(() => setToastMessage(''), 4000);
    } catch (err) {
      alert("Failed to update alert: " + (err.response?.data?.message || err.message));
    } finally {
      setIsSavingEdit(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="p-4 bg-emerald-500/20 border border-emerald-500/50 rounded-xl text-emerald-300 text-xs font-semibold flex items-center justify-between shadow-lg animate-fadeIn">
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage('')} className="p-1 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Disaster Alert Management
          </h1>
          <p className="text-xs text-slate-400">
            Monitor, update status, and manage all emergency broadcasts
          </p>
        </div>

        <Link
          to="/admin/alerts/create"
          className="px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl shadow-lg shadow-red-950/60 flex items-center gap-2 transition-transform hover:-translate-y-0.5 text-xs sm:text-sm self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Emergency Alert</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search headline or description..."
              className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500"
            />
          </div>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-red-500"
          >
            <option value="">All Statuses (Active & History)</option>
            {ALERT_STATUSES.map((st) => (
              <option key={st.value} value={st.value}>{st.label}</option>
            ))}
          </select>

          {/* Disaster Type filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-red-500"
          >
            <option value="">All Disaster Categories</option>
            {DISASTER_TYPES.map((tp) => (
              <option key={tp.value} value={tp.value}>{tp.label}</option>
            ))}
          </select>

          {/* Severity filter */}
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-red-500"
          >
            <option value="">All Severity Levels</option>
            {SEVERITY_LEVELS.map((sev) => (
              <option key={sev.value} value={sev.value}>{sev.label}</option>
            ))}
          </select>

          {/* Location filter */}
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-red-500"
          >
            <option value="">All Geographic Locations</option>
            {locations.map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>

        {/* Active filter counter */}
        {(searchTerm || statusFilter || typeFilter || severityFilter || locationFilter) && (
          <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
            <span>Filtered results: {alerts.length} matching alerts</span>
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('');
                setTypeFilter('');
                setSeverityFilter('');
                setLocationFilter('');
              }}
              className="text-red-400 hover:underline font-semibold"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>

      {/* Alerts Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        {loading ? (
          <div className="p-16 text-center">
            <div className="w-8 h-8 border-3 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-slate-400 font-semibold">Filtering alerts database...</p>
          </div>
        ) : alerts.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <ShieldAlert className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-slate-300">No Disaster Alerts Match Filter</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Try adjusting your search criteria or create a new emergency notice.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Disaster Type</th>
                  <th className="py-3.5 px-4">Alert Details</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Severity</th>
                  <th className="py-3.5 px-4">Status & Quick Toggle</th>
                  <th className="py-3.5 px-4">Citizen Reads</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {alerts.map((alert) => (
                  <tr key={alert.id} className="hover:bg-slate-800/40 transition-colors">
                    
                    {/* Type */}
                    <td className="py-3.5 px-4 align-top">
                      <DisasterTypeBadge type={alert.disasterType} />
                    </td>

                    {/* Title & Description */}
                    <td className="py-3.5 px-4 align-top max-w-xs">
                      <Link
                        to={`/alerts/${alert.id}`}
                        className="font-bold text-slate-100 hover:text-red-400 transition-colors line-clamp-1 text-sm"
                      >
                        {alert.title}
                      </Link>
                      <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5 leading-relaxed">
                        {alert.description}
                      </p>
                      <span className="text-[10px] text-slate-400 font-mono mt-1 inline-flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(alert.alertDateTime).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </td>

                    {/* Location */}
                    <td className="py-3.5 px-4 align-top">
                      <span className="flex items-center gap-1 text-slate-200 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                        {alert.location}
                      </span>
                    </td>

                    {/* Severity */}
                    <td className="py-3.5 px-4 align-top">
                      <SeverityBadge severity={alert.severity} />
                    </td>

                    {/* Status Dropdown */}
                    <td className="py-3.5 px-4 align-top">
                      <select
                        value={alert.status}
                        onChange={(e) => handleStatusChange(alert.id, e.target.value)}
                        className={`text-xs font-bold uppercase rounded-lg px-2.5 py-1 border transition-all cursor-pointer ${
                          alert.status === 'ACTIVE'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : alert.status === 'RESOLVED'
                            ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        <option value="ACTIVE" className="bg-slate-900 text-emerald-400">ACTIVE</option>
                        <option value="RESOLVED" className="bg-slate-900 text-blue-400">RESOLVED</option>
                        <option value="EXPIRED" className="bg-slate-900 text-slate-400">EXPIRED</option>
                      </select>
                    </td>

                    {/* Reads Count */}
                    <td className="py-3.5 px-4 align-top">
                      <Link
                        to={`/alerts/${alert.id}`}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white transition-colors"
                        title="View Citizens Who Acknowledged"
                      >
                        <Users className="w-3.5 h-3.5 text-blue-400" />
                        <span className="font-mono font-bold">{alert.readCount || 0}</span>
                      </Link>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 align-top text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/alerts/${alert.id}`}
                          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => setEditingAlert({ ...alert })}
                          className="p-2 rounded-lg bg-slate-800 hover:bg-amber-500/20 text-slate-300 hover:text-amber-300 transition-colors"
                          title="Edit Alert"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteId(alert.id)}
                          className="p-2 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
                          title="Delete Alert"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Alert Modal */}
      {editingAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white">Edit Disaster Alert #{editingAlert.id}</h3>
              <button onClick={() => setEditingAlert(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={editingAlert.title}
                  onChange={(e) => setEditingAlert({ ...editingAlert, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 text-xs focus:border-red-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Category</label>
                  <select
                    value={editingAlert.disasterType}
                    onChange={(e) => setEditingAlert({ ...editingAlert, disasterType: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 text-xs focus:border-red-500 focus:outline-none"
                  >
                    {DISASTER_TYPES.map(t => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Severity</label>
                  <select
                    value={editingAlert.severity}
                    onChange={(e) => setEditingAlert({ ...editingAlert, severity: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 text-xs focus:border-red-500 focus:outline-none"
                  >
                    {SEVERITY_LEVELS.map(s => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Location</label>
                  <input
                    type="text"
                    required
                    value={editingAlert.location}
                    onChange={(e) => setEditingAlert({ ...editingAlert, location: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 text-xs focus:border-red-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Status</label>
                  <select
                    value={editingAlert.status}
                    onChange={(e) => setEditingAlert({ ...editingAlert, status: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 text-xs focus:border-red-500 focus:outline-none"
                  >
                    {ALERT_STATUSES.map(st => (
                      <option key={st.value} value={st.value}>{st.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={editingAlert.description}
                  onChange={(e) => setEditingAlert({ ...editingAlert, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 text-xs focus:border-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Safety Instructions</label>
                <textarea
                  rows={4}
                  required
                  value={editingAlert.safetyInstructions}
                  onChange={(e) => setEditingAlert({ ...editingAlert, safetyInstructions: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 text-xs font-mono focus:border-red-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingAlert(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingEdit}
                  className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl flex items-center gap-2"
                >
                  {isSavingEdit && <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      <ConfirmModal
        isOpen={!!deleteId}
        title="Delete Emergency Alert"
        message="Are you sure you want to permanently delete this alert? This action cannot be undone."
        confirmText="Delete Alert"
        confirmVariant="danger"
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};

export default ManageAlertsPage;
