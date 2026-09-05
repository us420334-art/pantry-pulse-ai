import axios from 'axios';

// Detect environment or fallback directly to Render backend URL
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://pantry-pulse-ai.onrender.com';

const API = axios.create({
    baseURL: `${BASE_URL.replace(/\/$/, '')}/api`,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor to automatically attach JWT token from localStorage
API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default API;