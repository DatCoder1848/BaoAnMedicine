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
public class OrderItemDTO {
    private Long orderItemId;
    private Integer quantity;
    private BigDecimal priceAtPurchase;
    private ProductMiniDTO product; // Sử dụng DTO lồng nhau
}