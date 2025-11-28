// src/types/user.ts

export interface Address {
    id: number;
    recipientName: string;
    phoneNumber: string;
    specificAddress: string;
    city: string;
    isDefault: boolean;
    label?: string; // Nhà riêng, Văn phòng...
}

export interface User {
    username: string;
    email: string;
    fullName: string;
    phoneNumber?: string;

    // --- THAY ĐỔI Ở ĐÂY ---
    // Xóa: address?: string;
    // Thêm:
    addresses: Address[];
    // ---------------------

    createdAt?: string;
    roles: string[];
    id?: number;
    memberLevel?: string; // Mấy cái này giữ nguyên nếu có
    avatar?: string;
}