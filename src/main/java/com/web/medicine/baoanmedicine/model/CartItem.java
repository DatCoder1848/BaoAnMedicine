package com.web.medicine.baoanmedicine.model;

// package com.yourproject.model;

import java.math.BigDecimal;

public class CartItem {
    private Long cartItemId;
    private Integer quantity;
    private BigDecimal priceAtAddition; // Giá sản phẩm tại thời điểm thêm vào giỏ (để đảm bảo tính toán chính xác)

    // Quan hệ: Nhiều CartItem thuộc về Một Cart
    // @ManyToOne(fetch = FetchType.LAZY)
    // @JoinColumn(name = "cart_id")
    private Cart cart;

    // Quan hệ: Nhiều CartItem liên quan đến Một Product
    // @ManyToOne(fetch = FetchType.LAZY)
    // @JoinColumn(name = "product_id")
    private Product product;
}
