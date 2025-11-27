package com.web.medicine.baoanmedicine.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductDto {
    private Long productId;
    private String name;
    private String description;

    // THÊM TRƯỜNG NÀY (Để Frontend hiển thị công dụng thuốc)
    private String therapeuticClass;

    private BigDecimal price;

    // Lưu ý: Giá trị này sẽ được Mapper lấy từ product.getTotalStock()
    private Integer stockQuantity;

    private String imageUrl;
    private String manufacturer;
    private String usageInstructions;
    private boolean prescriptionRequired;
    private LocalDateTime createdAt;

    private Integer categoryId;
    private String categoryName;
}