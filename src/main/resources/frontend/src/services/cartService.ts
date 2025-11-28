// src/services/cartService.ts
import api from './api';
import { Cart } from '../types/cart';

export const CartService = {
    // 1. Lấy giỏ hàng hiện tại của User
    getCart: async (): Promise<Cart | null> => {
        try {
            const response = await api.get<Cart>('/cart');
            return response.data;
        } catch (error) {
            // Nếu lỗi 404 (chưa có giỏ) hoặc lỗi mạng -> trả về null để xử lý
            return null;
        }
    },

    // 2. Thêm sản phẩm vào giỏ
    addToCart: async (productId: number, quantity: number): Promise<Cart> => {
        // API: POST /api/cart/add
        const response = await api.post<Cart>('/cart/add', {
            productId,
            quantity
        });
        return response.data; // Trả về giỏ hàng mới nhất đã cập nhật
    },

    // 3. Cập nhật số lượng (Tăng/Giảm ở trang Cart)
    updateQuantity: async (productId: number, quantity: number): Promise<Cart> => {
        // API: PUT /api/cart/update?productId=...&quantity=...
        const response = await api.put<Cart>(`/cart/update`, null, {
            params: { productId, quantity }
        });
        return response.data;
    },

    // 4. Xóa một sản phẩm khỏi giỏ
    removeFromCart: async (cartItemId: number): Promise<void> => {
        // API: DELETE /api/cart/remove/{id}
        await api.delete(`/cart/remove/${cartItemId}`);
    }
};