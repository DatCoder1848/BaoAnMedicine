package com.web.medicine.baoanmedicine.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
// DTO cơ bản chứa thông tin cần thiết về sản phẩm
public class ProductMiniDTO {
    private Long productId;
    private String name;
    private String imageUrl;
    private BigDecimal price; // Giá hiện tại (để hiển thị)
}