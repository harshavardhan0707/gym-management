import axios from 'axios';

// Use environment variable for API base URL, fallback to localhost
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API calls
export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

// Users API calls
export const getUsers = async (page = 1, limit = 10) => {
  const response = await api.get(`/users?page=${page}&limit=${limit}`);
  return response.data;
};

export const createUser = async (userData) => {
  // Ensure password is present and valid
  const dataToSend = { ...userData };
  if (!dataToSend.password || typeof dataToSend.password !== 'string' || dataToSend.password.length < 6) {
    dataToSend.password = 'changeme123'; // Default password, should be changed by user
  }
  const response = await api.post('/users', dataToSend);
  return response.data;
};

export const updateUser = async (rollNumber, userData) => {
  const response = await api.put(`/users/${rollNumber}`, userData);
  return response.data;
};

export const deleteUser = async (rollNumber) => {
  const response = await api.delete(`/users/${rollNumber}`);
  return response.data;
};

// Plans API calls
export const getPlans = async () => {
  const response = await api.get('/plans');
  // The API returns {plans: [...], pagination: {...}}
  return {
    data: response.data.plans || [],
    pagination: response.data.pagination || {}
  };
};

export const createPlan = async (planData) => {
  const response = await api.post('/plans', planData);
  return response.data;
};

export const updatePlan = async (id, planData) => {
  const response = await api.put(`/plans/${id}`, planData);
  return response.data;
};

export const deletePlan = async (id) => {
  const response = await api.delete(`/plans/${id}`);
  return response.data;
};

// Subscriptions API calls
export const getSubscriptions = async () => {
  const response = await api.get('/subscriptions');
  // The API returns {subscriptions: [...], pagination: {...}}
  return {
    data: response.data.subscriptions || [],
    pagination: response.data.pagination || {}
  };
};

export const createSubscription = async (subscriptionData) => {
  const response = await api.post('/subscriptions', subscriptionData);
  return response.data;
};

export const updateSubscription = async (id, subscriptionData) => {
  const response = await api.put(`/subscriptions/${id}`, subscriptionData);
  return response.data;
};

export const deleteSubscription = async (id) => {
  const response = await api.delete(`/subscriptions/${id}`);
  return response.data;
};

// Test API connectivity
export const testApiConnection = async () => {
  try {
    console.log('Testing API connection...');
    const publicApi = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const response = await publicApi.get('/test');
    console.log('API test response:', response.data);
    return response.data;
  } catch (error) {
    console.error('API test error:', error);
    throw error;
  }
};

export const checkSubscription = async (rollNumber) => {
  try {
    console.log('checkSubscription called with rollNumber:', rollNumber);
    
    // Create a separate axios instance without authentication for public endpoints
    const publicApi = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log('Making request to:', `${API_BASE_URL}/subscriptions/check?roll=${rollNumber}`);
    const response = await publicApi.get(`/subscriptions/check?roll=${rollNumber}`);
    console.log('checkSubscription response:', response.data);
    return response.data;
  } catch (error) {
    console.error('checkSubscription error:', error);
    console.error('Error response:', error.response?.data);
    throw error;
  }
};

export default api;