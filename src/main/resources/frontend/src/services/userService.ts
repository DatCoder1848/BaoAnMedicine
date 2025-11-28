// src/services/userService.ts
import api from './api';
import { User, Address } from '../types/user';

export interface UserUpdateData {
    fullName?: string;
    phoneNumber?: string;
    address?: string;
    email?: string; // Thường email ít cho sửa, nhưng cứ để tùy logic backend
    avatar?: string; // Nếu backend có lưu link ảnh
    gender?: string;
    birthday?: string;
}

export const UserService = {
    // 1. Lấy thông tin Profile
    getProfile: async (): Promise<User> => {
        const response = await api.get<User>('/users/me');
        return response.data;
    },

    // 2. Cập nhật Profile
    updateProfile: async (data: UserUpdateData): Promise<User> => {
        const response = await api.put<User>('/users/me', data);
        return response.data;
    },

    // 3. Lấy danh sách địa chỉ (API thật)
    getAddresses: async (): Promise<Address[]> => {
        try {
            // GET /api/users/addresses
            const response = await api.get<Address[]>('/users/addresses');
            return response.data || [];
        } catch (error) {
            console.error("Lỗi lấy danh sách địa chỉ", error);
            return [];
        }
    },

    // 4. Thêm địa chỉ mới (API thật)
    addAddress: async (address: Omit<Address, 'id' | 'isDefault'>): Promise<Address> => {
        // POST /api/users/addresses
        const response = await api.post<Address>('/users/addresses', address);
        return response.data;
    },

    // 5. Xóa địa chỉ (API thật)
    deleteAddress: async (id: number): Promise<void> => {
        // DELETE /api/users/addresses/{id}
        await api.delete(`/users/addresses/${id}`);
    },

    // 6. Đặt làm mặc định (API thật)
    setDefaultAddress: async (id: number): Promise<void> => {
        // PUT /api/users/addresses/{id}/default
        await api.put(`/users/addresses/${id}/default`);
    },

    // Thêm vào userService.ts
    updateAddress: async (id: number, address: any): Promise<any> => {
        const response = await api.put(`/users/addresses/${id}`, address); // Giả sử backend dùng PUT
        return response.data;
    }
};