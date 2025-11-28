// src/services/authService.ts
import api from './api';
import { LoginRequest, RegisterRequest, JwtResponse } from '../types/auth';
import { User } from '../types/user'; // Giả sử bạn đã có type User hoặc dùng any tạm

export const AuthService = {
    // 1. Đăng nhập
    login: async (credentials: LoginRequest): Promise<string> => {
        // Gọi API POST /auth/login
        const response = await api.post<JwtResponse>('/auth/login', credentials);
        const { accessToken } = response.data;

        // Lưu token vào LocalStorage
        if (accessToken) {
            localStorage.setItem('accessToken', accessToken);
        }
        return accessToken;
    },

    // 2. Đăng ký
    register: async (data: RegisterRequest): Promise<string> => {
        // Gọi API POST /auth/register
        const response = await api.post('/auth/register', data);
        return response.data; // Trả về message thành công
    },

    // 3. Lấy thông tin User hiện tại (Profile)
    // Vì API login chỉ trả về Token, ta cần gọi thêm API này để lấy tên, role...
    getCurrentUser: async (): Promise<any> => {
        const response = await api.get('/users/me');
        return response.data;
    },

    // 4. Đăng xuất
    logout: () => {
        localStorage.removeItem('accessToken');
    }
};