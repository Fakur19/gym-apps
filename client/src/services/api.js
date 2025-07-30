import axios from 'axios';

// Set the base URL dynamically based on the environment
const API_URL = '/api';

axios.defaults.baseURL = API_URL;

// Dashboard
export const getDashboardStats = () => axios.get('/dashboard/stats');

// Plans
export const getPlans = () => axios.get('/plans');
export const createPlan = (planData) => axios.post('/plans', planData);
export const updatePlan = (id, planData) => axios.put(`/plans/${id}`, planData); 
export const deletePlan = (id) => axios.delete(`/plans/${id}`);

// Members
export const getMembers = () => axios.get('/members');
export const addMember = (memberData) => axios.post('/members', memberData);
export const updateMember = (id, memberData) => axios.put(`/members/${id}`, memberData);
export const renewMember = (id, planId) => axios.put(`/members/${id}/renew`, { planId });

// Check-ins
export const getTodaysCheckins = () => axios.get('/checkins/today');
export const createCheckin = (memberId) => axios.post('/checkins', { memberId });

// Transactions
export const getTransactions = () => axios.get('/transactions');
