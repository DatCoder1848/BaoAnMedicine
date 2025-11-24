package com.web.medicine.baoanmedicine.dto.response;

import java.math.BigDecimal;

// DTO cơ bản chứa thông tin cần thiết về sản phẩm
public class ProductMiniDTO {
    private Long productId;
    private String name;
    private String imageUrl;
    private BigDecimal price; // Giá hiện tại (để hiển thị)
    // Getters, Setters, Constructors (Dùng Lombok)
}