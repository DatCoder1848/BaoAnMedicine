package com.web.medicine.baoanmedicine.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// DTO cho POST /api/cart/add
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AddItemToCartDTO {
    private Long productId;
    private Integer quantity;
}
