import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  MapPin, 
  UserCheck, 
  UserX, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Phone, 
  Mail, 
  Clock,
  X
} from 'lucide-react';
import { communityApi } from '../services/api';
import ConfirmModal from '../components/common/ConfirmModal';

const CommunityManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  // Confirmation modals
  const [toggleUser, setToggleUser] = useState(null);
  const [deleteUser, setDeleteUser] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (locationFilter) params.location = locationFilter;

      const res = await communityApi.getUsers(params);
      if (res.data?.success) {
        setUsers(res.data.data || []);
      }
    } catch (err) {
      console.error("Error loading community users:", err);
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
    } catch (e) {}
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers();
    }, 250);
    return () => clearTimeout(timer);
  }, [searchTerm, locationFilter]);

  const handleToggleStatusConfirm = async () => {
    if (!toggleUser) return;
    try {
      setIsProcessing(true);
      const nextStatus = toggleUser.accountStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      await communityApi.toggleUserStatus(toggleUser.id, nextStatus);
      setToastMessage(`User ${toggleUser.fullName} has been set to ${nextStatus}`);
      setToggleUser(null);
      fetchUsers();
      setTimeout(() => setToastMessage(''), 4000);
    } catch (err) {
      alert("Failed to update user status: " + (err.response?.data?.message || err.message));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteUser) return;
    try {
      setIsProcessing(true);
      await communityApi.deleteUser(deleteUser.id);
      setToastMessage(`User ${deleteUser.fullName} was permanently deleted`);
      setDeleteUser(null);
      fetchUsers();
      setTimeout(() => setToastMessage(''), 4000);
    } catch (err) {
      alert("Failed to delete user: " + (err.response?.data?.message || err.message));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="p-4 bg-emerald-500/20 border border-emerald-500/50 rounded-xl text-emerald-300 text-xs font-semibold flex items-center justify-between shadow-lg">
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage('')} className="p-1 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400">
            <Users className="w-4 h-4" />
            <span>Community Directory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
            Registered Community Citizens
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage citizens receiving early warnings, verify locations, and audit account status
          </p>
        </div>

        <div className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold text-slate-300 self-start sm:self-auto">
          Total Citizens: <strong className="text-white font-mono text-sm ml-1">{users.length}</strong>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          {/* Search */}
          <div className="relative sm:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, or phone number..."
              className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500"
            />
          </div>

          {/* Location Filter */}
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-red-500"
          >
            <option value="">All Registered Districts</option>
            {locations.map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>

        {(searchTerm || locationFilter) && (
          <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
            <span>Found {users.length} matching registered citizens</span>
            <button
              onClick={() => {
                setSearchTerm('');
                setLocationFilter('');
              }}
              className="text-red-400 hover:underline font-semibold"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Users Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        {loading ? (
          <div className="p-16 text-center">
            <div className="w-8 h-8 border-3 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-slate-400 font-semibold">Loading community registry...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <Users className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-slate-300">No Community Users Found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              No citizens matched your search criteria.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Citizen Profile</th>
                  <th className="py-3.5 px-4">Registered Location</th>
                  <th className="py-3.5 px-4">Contact Phone</th>
                  <th className="py-3.5 px-4">Alerts Acknowledged</th>
                  <th className="py-3.5 px-4">Joined Date</th>
                  <th className="py-3.5 px-4">Account Status</th>
                  <th className="py-3.5 px-4 text-right">Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                    
                    {/* Name & Email */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600 flex items-center justify-center font-bold text-white text-xs shadow-sm">
                          {u.fullName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-white text-sm">{u.fullName}</p>
                          <p className="text-[11px] text-slate-400 font-mono">{u.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Location */}
                    <td className="py-3.5 px-4">
                      <span className="flex items-center gap-1.5 text-slate-200 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                        {u.location}
                      </span>
                    </td>

                    {/* Phone */}
                    <td className="py-3.5 px-4 font-mono text-slate-300">
                      {u.phone || <span className="text-slate-500 italic">Not provided</span>}
                    </td>

                    {/* Acknowledged Alerts count */}
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 font-mono font-bold text-slate-300">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{u.alertsAcknowledgedCount || 0}</span>
                      </span>
                    </td>

                    {/* Registered Date */}
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">
                      {new Date(u.createdAt).toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>

                    {/* Account Status Badge */}
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        u.accountStatus === 'ACTIVE'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : 'bg-red-500/10 text-red-400 border border-red-500/30'
                      }`}>
                        {u.accountStatus}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setToggleUser(u)}
                          className={`p-2 rounded-xl border transition-colors ${
                            u.accountStatus === 'ACTIVE'
                              ? 'bg-slate-800 hover:bg-red-500/20 text-slate-300 hover:text-red-400 border-slate-700'
                              : 'bg-slate-800 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-400 border-slate-700'
                          }`}
                          title={u.accountStatus === 'ACTIVE' ? "Deactivate Account" : "Activate Account"}
                        >
                          {u.accountStatus === 'ACTIVE' ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                        </button>

                        <button
                          onClick={() => setDeleteUser(u)}
                          className="p-2 rounded-xl bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-slate-700 transition-colors"
                          title="Delete User Record"
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

      {/* Toggle Status Modal */}
      <ConfirmModal
        isOpen={!!toggleUser}
        title={toggleUser?.accountStatus === 'ACTIVE' ? "Deactivate Community Citizen Account" : "Activate Community Citizen Account"}
        message={`Are you sure you want to ${toggleUser?.accountStatus === 'ACTIVE' ? 'deactivate' : 'activate'} the account for ${toggleUser?.fullName} (${toggleUser?.email})?`}
        confirmText={toggleUser?.accountStatus === 'ACTIVE' ? "Deactivate" : "Activate"}
        confirmVariant={toggleUser?.accountStatus === 'ACTIVE' ? "warning" : "primary"}
        isLoading={isProcessing}
        onConfirm={handleToggleStatusConfirm}
        onCancel={() => setToggleUser(null)}
      />

      {/* Delete User Modal */}
      <ConfirmModal
        isOpen={!!deleteUser}
        title="Delete Community User"
        message={`Are you sure you want to permanently remove ${deleteUser?.fullName} from the emergency broadcast network? All their read acknowledgments will be deleted.`}
        confirmText="Delete User"
        confirmVariant="danger"
        isLoading={isProcessing}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteUser(null)}
      />
    </div>
  );
};

export default CommunityManagementPage;
