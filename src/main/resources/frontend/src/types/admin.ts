// src/types/admin.ts
import { Product } from './product';
import { User } from './user';
import { Order } from './order';

// Thống kê Dashboard (Khớp với DashboardStatsDto của bạn)
export interface DashboardStats {
    totalRevenue: number;
    totalOrders: number;
    totalProducts: number;
    totalUsers: number;
}

// Request nhập kho
export interface ImportStockRequest {
    productId: number;
    quantity: number;
    expiryDate?: string;
    batchNumber?: string;
}

// Trạng thái User (nếu cần)
export interface UserStatusUpdate {
    active: boolean;
}