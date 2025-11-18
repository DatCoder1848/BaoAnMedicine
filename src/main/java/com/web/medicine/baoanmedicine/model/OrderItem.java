package com.web.medicine.baoanmedicine.model;

import java.math.BigDecimal;

//--- Lớp OrderItem ---
public class OrderItem {
    private Long orderItemId;
    private Integer quantity;
    private BigDecimal priceAtPurchase; // Giá tại thời điểm mua

    // Quan hệ: Nhiều OrderItem thuộc về Một Order
    // @ManyToOne(fetch = FetchType.LAZY)
    // @JoinColumn(name = "order_id")
    private Order order;

    // Quan hệ: Nhiều OrderItem liên quan đến Một Product
    // @ManyToOne(fetch = FetchType.LAZY)
    // @JoinColumn(name = "product_id")
    private Product product;
}

