package com.web.medicine.baoanmedicine.model;

// package com.yourproject.model;

import java.time.LocalDateTime;
import java.util.List;

public class Cart {
    private Long cartId;

    // Quan hệ: Một Giỏ hàng thuộc về Một User
    // @OneToOne(fetch = FetchType.LAZY)
    // @JoinColumn(name = "user_id")
    private User user;

    private LocalDateTime lastUpdated; // Thời gian cập nhật gần nhất

    // Quan hệ: Một Giỏ hàng có nhiều mục (CartItem)
    // @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CartItem> cartItems;

    // Thuộc tính tính toán (có thể không cần lưu vào DB):
    // private BigDecimal subTotal;
}
