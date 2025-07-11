import axios from 'axios';

// Dashboard
export const getDashboardStats = () => axios.get('/api/dashboard/stats');

// Plans
export const getPlans = () => axios.get('/api/plans');
export const createPlan = (planData) => axios.post('/api/plans', planData);
export const updatePlan = (id, planData) => axios.put(`/api/plans/${id}`, planData); 
export const deletePlan = (id) => axios.delete(`/api/plans/${id}`);

// Members
export const getMembers = () => axios.get('/api/members');
export const addMember = (memberData) => axios.post('/api/members', memberData);
export const updateMember = (id, memberData) => axios.put(`/api/members/${id}`, memberData);
export const renewMember = (id, planId) => axios.put(`/api/members/${id}/renew`, { planId });

// Check-ins
export const getTodaysCheckins = () => axios.get('/api/checkins/today');
export const createCheckin = (memberId) => axios.post('/api/checkins', { memberId });

// Transactions
export const getTransactions = () => axios.get('/api/transactions');