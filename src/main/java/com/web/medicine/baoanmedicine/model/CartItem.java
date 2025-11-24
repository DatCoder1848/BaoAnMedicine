package com.web.medicine.baoanmedicine.model;

// package com.yourproject.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long cartItemId;
    private Integer quantity;
    private BigDecimal priceAtAddition; // Giá sản phẩm tại thời điểm thêm vào giỏ (để đảm bảo tính toán chính xác)

    // Quan hệ: Nhiều CartItem thuộc về Một Cart
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cart_id")
    private Cart cart;

    // Quan hệ: Nhiều CartItem liên quan đến Một Product
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;
}
