package com.web.medicine.baoanmedicine.dto.response;

import java.math.BigDecimal;

public class OrderItemDTO {
    private Long orderItemId;
    private Integer quantity;
    private BigDecimal priceAtPurchase;
    private ProductMiniDTO product; // Sử dụng DTO lồng nhau

    // Getters, Setters, Constructors (Dùng Lombok)
}