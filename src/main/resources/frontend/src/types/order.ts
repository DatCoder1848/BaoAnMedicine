// src/types/order.ts

import { Product } from './product'; // Nếu cần dùng lại type Product

// Dữ liệu gửi đi khi bấm "Đặt hàng" (CheckoutRequestDTO)
export interface CheckoutRequest {
    shippingAddress: string;
    shippingPhone: string;
    paymentMethod: string; // "COD" | "VNPAY" | "BANK_TRANSFER"
    couponCode?: string;   // Mã giảm giá (nếu có)
}

// Chi tiết từng món trong đơn hàng (OrderItemDTO)
export interface OrderItem {
    orderItemId: number;
    quantity: number;
    priceAtPurchase: number;
    product: {
        productId: number;
        name: string;
        imageUrl: string;
    };
}

// Dữ liệu đơn hàng hoàn chỉnh nhận về (OrderResponseDTO)
export interface Order {
    orderId: number;
    userId: number;

    // Tiền nong
    originalAmount: number; // Tổng tiền hàng gốc
    discountAmount: number; // Tiền được giảm
    shippingFee: number;
    totalAmount: number;    // Khách phải trả

    // Trạng thái
    orderStatus: string;    // NEW, SHIPPED, DELIVERED...
    paymentStatus: string;  // PENDING, PAID...
    paymentMethod: string;

    // Thông tin giao hàng
    orderDate: string;
    shippingAddress: string;
    shippingPhone: string;
    couponCodeApplied?: string;

    items: OrderItem[];

    paymentUrl: string;
}