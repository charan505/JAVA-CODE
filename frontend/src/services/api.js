import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('disaster_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token and redirect to login if session expired on protected routes
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        localStorage.removeItem('disaster_auth_token');
        localStorage.removeItem('disaster_auth_user');
      }
    }
    return Promise.reject(error);
  }
);

// Auth Services
export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
  updateProfile: (profileData) => api.put('/auth/profile', profileData),
};

// Alert Services
export const alertApi = {
  getActiveAlerts: () => api.get('/alerts/active'),
  getAlerts: (params) => api.get('/alerts', { params }),
  getAlertHistory: () => api.get('/alerts/history'),
  getAlertById: (id) => api.get(`/alerts/${id}`),
  createAlert: (alertData) => api.post('/alerts', alertData),
  updateAlert: (id, alertData) => api.put(`/alerts/${id}`, alertData),
  updateStatus: (id, status) => api.patch(`/alerts/${id}/status?status=${status}`),
  deleteAlert: (id) => api.delete(`/alerts/${id}`),
  markAsRead: (id) => api.post(`/alerts/${id}/read`),
  getMyReadStatus: () => api.get('/alerts/my-read-status'),
  getReaders: (id) => api.get(`/alerts/${id}/readers`),
};

// Community User Management (Admin)
export const communityApi = {
  getUsers: (params) => api.get('/admin/users', { params }),
  getLocations: () => api.get('/admin/users/locations'),
  getUserById: (id) => api.get(`/admin/users/${id}`),
  toggleUserStatus: (id, status) => api.patch(`/admin/users/${id}/status${status ? `?status=${status}` : ''}`),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
};

// Safety Guidelines
export const safetyApi = {
  getAll: () => api.get('/safety-guidelines'),
  getByType: (type) => api.get(`/safety-guidelines/${type}`),
  saveGuideline: (guideline) => api.post('/safety-guidelines', guideline),
};

// Analytics
export const analyticsApi = {
  getAdminStats: () => api.get('/analytics/dashboard'),
  getUserStats: () => api.get('/analytics/user-dashboard'),
};

export default api;
