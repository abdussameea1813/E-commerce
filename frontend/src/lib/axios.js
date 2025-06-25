// client/src/api/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
    // Make the baseURL relative so that Vite's proxy will intercept it in development.
    // In production, your web server (e.g., Nginx, Vercel) will handle `/api` routing.
    baseURL: '/api',
    withCredentials: true,
});

export default axiosInstance;