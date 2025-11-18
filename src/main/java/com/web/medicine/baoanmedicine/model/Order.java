package com.web.medicine.baoanmedicine.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class Order {
    private Long orderId;
    private LocalDateTime orderDate;
    private     BigDecimal totalAmount;
    private String status; // (PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED)
    private String shippingAddress;
    private String shippingPhone;
    private String paymentMethod; // (COD, VNPAY, ...)

    // Quan hệ: Nhiều Order thuộc về Một User
    // @ManyToOne(fetch = FetchType.LAZY)
    // @JoinColumn(name = "user_id")
    private User user;

    // Quan hệ: Một Order có nhiều OrderItem
    // @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> orderItems;
}

