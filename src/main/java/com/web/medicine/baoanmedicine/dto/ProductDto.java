package com.web.medicine.baoanmedicine.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductDto {
    private Long productId;
    private String name;
    private String description;

    private BigDecimal price;         // Giá bán
    private BigDecimal originalPrice; // Giá gốc (MỚI)

    private String unit;              // Đơn vị tính (MỚI)
    private String expiryString;      // Hạn sử dụng text (MỚI)
    private String ingredients;       // Thành phần (MỚI)
    private String sideEffects;       // Tác dụng phụ (MỚI)
    private String storageInstructions; // Bảo quản (MỚI)

    private String imageUrl;          // Ảnh chính
    private List<String> images;      // Danh sách ảnh gallery (MỚI)

    private String manufacturer;
    private String usageInstructions;
    private boolean prescriptionRequired;
    private String therapeuticClass;

    private Integer stockQuantity; // Tồn kho (tính toán)

    private LocalDateTime createdAt;
    private Integer categoryId;
    private String categoryName;
}