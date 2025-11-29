// src/services/api.ts
import axios from 'axios';

// Cấu hình URL Backend (Cổng 2017 như bạn yêu cầu)
const API_URL = 'http://localhost:2017/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor: Tự động gắn Token vào mọi Request nếu có
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        console.log("Token sending:", token); // <--- DEBUG: Xem nó có null không?
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;