// src/types/marketing.ts

export enum AdSlot {
    HOMEPAGE_BANNER = 'HOMEPAGE_BANNER',
    PRODUCT_SIDEBAR = 'PRODUCT_SIDEBAR',
    CART_PAGE = 'CART_PAGE'
}

export interface Advertisement {
    id: number;
    name: string;
    adSlot: AdSlot;
    type: string; // 'IMAGE' | 'VIDEO'
    contentUrl: string; // URL ảnh
    targetUrl: string;  // Link khi click vào
    priority: number;
}

// Interface trả về khi validate coupon
export interface CouponValidationResult {
    discountAmount: number;
}