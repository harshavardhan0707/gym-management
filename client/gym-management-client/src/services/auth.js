import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

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
        const { token } = response.data;

        // Store the token in localStorage
        localStorage.setItem('token', token);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Login failed');
    }
};

// Function to get the stored token
export const getToken = () => {
    return localStorage.getItem('token');
};

// Function to logout the admin
export const logout = () => {
    localStorage.removeItem('token');
};