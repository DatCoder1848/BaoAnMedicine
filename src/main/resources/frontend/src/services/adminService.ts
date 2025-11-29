// src/services/adminService.ts
import api from './api';
import { Product } from '../types/product';
import { Order } from '../types/order';
import { User } from '../types/user';
import { DashboardStats, ImportStockRequest } from '../types/admin';

export const AdminService = {
    // 1. DASHBOARD
    getStats: async (): Promise<DashboardStats> => {
        // GET /api/admin/dashboard/stats
        const response = await api.get<DashboardStats>('/admin/dashboard/stats');
        return response.data;
    },

    // 2. SẢN PHẨM (CRUD + Import)
    getProducts: async (page = 0, size = 10, search = ''): Promise<any> => {
        const response = await api.get('/products', {
            params: { page, size, search }
        });
        return response.data; // Page<ProductDto>
    },

    createProduct: async (product: Partial<Product>): Promise<Product> => {
        const response = await api.post<Product>('/admin/products', product);
        return response.data;
    },

    updateProduct: async (id: number, product: Partial<Product>): Promise<Product> => {
        const response = await api.put<Product>(`/admin/products/${id}`, product);
        return response.data;
    },

    deleteProduct: async (id: number): Promise<void> => {
        await api.delete(`/admin/products/${id}`);
    },

    // API Upload ảnh (Phương án A)
    uploadImage: async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post('/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data; // Trả về chuỗi URL ảnh
    },

    // Import Excel (Sản phẩm)
    importProductsExcel: async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post('/admin/products/import', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },

    // 3. ĐƠN HÀNG
    getOrders: async (page = 0, size = 10, status?: string): Promise<any> => {
        const params: any = { page, size };
        if (status && status !== 'ALL') params.status = status;
        const response = await api.get('/admin/orders', { params });
        return response.data;
    },

    // [MỚI] API Lấy chi tiết đơn hàng cho Admin
    // 3. Lấy chi tiết 1 đơn hàng
    getOrderById: async (orderId: number): Promise<Order | null> => {
        try {
            // GET /api/orders/{id} (Bạn cần đảm bảo Backend có API này, hoặc dùng API Admin nếu cần)
            // Nếu Backend chưa có API get detail riêng cho user, ta tạm thời dùng logic filter từ list
            const response = await api.get<Order>(`/orders/${orderId}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching order detail:", error);
            return null;
        }
    },

    updateOrderStatus: async (orderId: number, status: string): Promise<Order> => {
        const response = await api.put<Order>(`/admin/orders/${orderId}/status`, null, {
            params: { status }
        });
        return response.data;
    },

    // 4. USERS
    getUsers: async (): Promise<User[]> => {
        const response = await api.get<User[]>('/admin/users');
        return response.data;
    }
};