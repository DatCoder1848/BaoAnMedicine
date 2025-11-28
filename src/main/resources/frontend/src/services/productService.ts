// src/services/productService.ts
import api from '../services/api';
import { Product } from '../types/product';


export const ProductService = {
    // Lấy toàn bộ sản phẩm (có hỗ trợ phân trang từ backend)
    getAllProducts: async (page = 0, size = 20): Promise<Product[]> => {
        try {
            // Gọi API: GET /api/products?page=0&size=20
            const response = await api.get(`/products`, {
                params: { page, size }
            });
            // Lưu ý: Nếu Backend trả về Page<ProductDto>, dữ liệu thực nằm trong 'content'
            return response.data.content || response.data;
        } catch (error) {
            console.error("Lỗi gọi API products:", error);
            return [];
        }
    },

    // Lấy chi tiết 1 sản phẩm
    getProductById: async (id: number): Promise<Product | null> => {
        try {
            const response = await api.get(`/products/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Lỗi lấy product id ${id}:`, error);
            return null;
        }
    },

    // Tìm kiếm sản phẩm
    searchProducts: async (keyword: string): Promise<Product[]> => {
        try {
            const response = await api.get(`/products`, {
                params: { search: keyword }
            });
            return response.data.content || response.data;
        } catch (error) {
            return [];
        }
    }
};