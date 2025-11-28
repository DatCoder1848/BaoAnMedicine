// src/services/orderService.ts
import api from './api';
import { CheckoutRequest, Order } from '../types/order';

export const OrderService = {
    // 1. Đặt hàng
    checkout: async (data: CheckoutRequest): Promise<Order> => {
        // POST /api/orders/checkout
        const response = await api.post<Order>('/orders/checkout', data);
        return response.data;
    },

    // 2. Lấy danh sách đơn hàng của tôi
    getMyOrders: async (page = 0, size = 10): Promise<any> => {
        // GET /api/orders/my-orders?page=0&size=10
        const response = await api.get('/orders/my-orders', {
            params: { page, size }
        });
        // Backend trả về Page<OrderResponseDTO>
        return response.data.content || response.data;
    },

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
    }
};