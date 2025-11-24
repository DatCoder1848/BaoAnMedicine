package com.web.medicine.baoanmedicine.dto.response;

import java.math.BigDecimal;

public class CartItemDTO {
    private Long cartItemId;
    private Integer quantity;
    private BigDecimal priceAtAddition; // Giá lưu tại thời điểm thêm vào giỏ
    private ProductMiniDTO product; // Sử dụng DTO lồng nhau

    // Getters, Setters, Constructors (Dùng Lombok)
}