// src/types/cart.ts

// Sản phẩm rút gọn nằm trong giỏ hàng (ProductMiniDTO)
export interface CartProduct {
    productId: number;
    name: string;
    imageUrl: string;
    price: number;
}

// Một dòng trong giỏ hàng (CartItemDTO)
export interface CartItem {
    cartItemId: number; // ID của dòng trong giỏ (để xóa/sửa)
    quantity: number;
    priceAtAddition: number;
    product: CartProduct;
}

// Tổng thể giỏ hàng (CartResponseDTO)
export interface Cart {
    cartId: number;
    userId: number;
    totalItems: number;       // Tổng số lượng sản phẩm
    subTotal: number;         // Tổng tiền hàng
    items: CartItem[];        // Danh sách sản phẩm
}