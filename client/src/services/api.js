import axios from 'axios';

const api = axios.create({
  baseURL: '/api' // The proxy will handle this
});

// Dashboard
export const getDashboardStats = () => api.get('/dashboard/stats');

// Plans
export const getPlans = () => api.get('/plans');
export const createPlan = (planData) => api.post('/plans', planData);
export const updatePlan = (id, planData) => api.put(`/plans/${id}`, planData); 
export const deletePlan = (id) => api.delete(`/plans/${id}`);

// Members
export const getMembers = () => api.get('/members');
export const addMember = (memberData) => api.post('/members', memberData);
export const updateMember = (id, memberData) => api.put(`/members/${id}`, memberData);
export const renewMember = (id, planId) => api.put(`/members/${id}/renew`, { planId });

// Check-ins
export const getTodaysCheckins = () => api.get('/checkins/today');
export const createCheckin = (memberId) => api.post('/checkins', { memberId });

// Transactions
export const getTransactions = () => api.get('/transactions');

export default api;