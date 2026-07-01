import api from './api';

export const tripService = {
  create: async (data) => {
    const res = await api.post('/trips', data);
    return res.data;
  },

  getAll: async () => {
    const res = await api.get('/trips');
    return res.data;
  },

  getById: async (tripId) => {
    const res = await api.get(`/trips/${tripId}`);
    return res.data;
  },

  getByInviteCode: async (code) => {
    const res = await api.get(`/trips/invite/${code}`);
    return res.data;
  },

  join: async (inviteCode) => {
    const res = await api.post('/trips/join', { inviteCode });
    return res.data;
  },

  update: async (tripId, data) => {
    const res = await api.patch(`/trips/${tripId}`, data);
    return res.data;
  },

  delete: async (tripId) => {
    const res = await api.delete(`/trips/${tripId}`);
    return res.data;
  },

  getRecommendation: async (tripId) => {
    const res = await api.post(`/trips/${tripId}/recommend`);
    return res.data;
  },

  getMembership: async (tripId) => {
    const res = await api.get(`/members/trips/${tripId}/membership`);
    return res.data;
  },

  updateMembership: async (tripId, data) => {
    const res = await api.patch(`/members/trips/${tripId}/membership`, data);
    return res.data;
  },

  markReady: async (tripId) => {
    const res = await api.post(`/members/trips/${tripId}/ready`);
    return res.data;
  },

  leaveTrip: async (tripId) => {
    const res = await api.delete(`/members/trips/${tripId}/leave`);
    return res.data;
  },

  getMessages: async (tripId) => {
    const res = await api.get(`/messages/trips/${tripId}/messages`);
    return res.data;
  },

  sendMessage: async (tripId, content) => {
    const res = await api.post(`/messages/trips/${tripId}/messages`, { content });
    return res.data;
  },

  getNotifications: async () => {
    const res = await api.get('/notifications');
    return res.data;
  },

  markNotificationRead: async (id) => {
    const res = await api.patch(`/notifications/${id}/read`);
    return res.data;
  },

  markAllNotificationsRead: async () => {
    const res = await api.patch('/notifications/read-all');
    return res.data;
  },

  updateProfile: async (data) => {
    const res = await api.patch('/users/profile', data);
    return res.data;
  },
};
