import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';
import { safeLocalStorage } from '../utils/helpers';

// Create an Axios instance with default settings
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Function to handle admin login
export const login = async (email, password) => {
    try {
        const response = await api.post('/auth/login', { email, password });
        const { token, admin } = response.data;

        // Store the token in localStorage
        localStorage.setItem('token', token);
        // Store user/admin data in safeLocalStorage
        safeLocalStorage.set('user', admin);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Login failed');
    }
};

// Function to get the stored token
export const getToken = () => {
    return localStorage.getItem('token');
};

// Function to get the stored user
export const getUser = () => {
    return safeLocalStorage.get('user');
};

// Function to logout the admin
export const logout = () => {
    localStorage.removeItem('token');
    safeLocalStorage.remove('user');
};