// src/types/product.ts
export interface Product {
    productId: number;
    name: string;
    description: string;
    therapeuticClass: string; // Nhóm điều trị

    price: number;            // Giá bán thực tế
    originalPrice?: number;   // Giá gốc (để hiển thị gạch ngang)

    stockQuantity: number;
    unit?: string;            // Đơn vị (Hộp, Vỉ...)

    imageUrl: string;         // Ảnh đại diện
    images?: string[];        // Danh sách ảnh gallery (Backend trả về List<String>)

    manufacturer: string;
    usageInstructions: string;

    // Các trường chi tiết mới bổ sung từ Backend
    ingredients?: string;        // Thành phần
    sideEffects?: string;        // Tác dụng phụ
    storageInstructions?: string;// Hướng dẫn bảo quản

    prescriptionRequired: boolean;
    categoryId: number;
    categoryName: string;
}