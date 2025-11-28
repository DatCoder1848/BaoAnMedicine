// src/services/marketingService.ts
import api from './api';
import { Advertisement, AdSlot } from '../types/marketing';

export const MarketingService = {
    // 1. Lấy danh sách quảng cáo theo vị trí
    getAds: async (slot: AdSlot): Promise<Advertisement[]> => {
        try {
            const response = await api.get<Advertisement[]>('/marketing/ads', {
                params: { slot }
            });
            return response.data || [];
        } catch (error) {
            console.error(`Lỗi tải quảng cáo cho slot ${slot}`, error);
            return [];
        }
    },

    // 2. Kiểm tra mã giảm giá
    validateCoupon: async (code: string, orderAmount: number): Promise<number> => {
        // API trả về số tiền được giảm (BigDecimal -> number)
        const response = await api.get<number>('/marketing/coupon/validate', {
            params: { code, orderAmount }
        });
        return response.data;
    }
};