package com.web.medicine.baoanmedicine.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CartItemDTO {
    private Long cartItemId;
    private Integer quantity;
    private BigDecimal priceAtAddition; // Giá lưu tại thời điểm thêm vào giỏ
    private ProductMiniDTO product; // Sử dụng DTO lồng nhau
}