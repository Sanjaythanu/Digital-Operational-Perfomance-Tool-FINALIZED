import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'https://digital-operational-perfomance-tool-080g.onrender.com/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

console.log('API Base URL:', api.defaults.baseURL);

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
