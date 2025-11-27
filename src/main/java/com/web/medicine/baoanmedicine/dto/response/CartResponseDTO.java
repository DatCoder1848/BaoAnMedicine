package com.web.medicine.baoanmedicine.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CartResponseDTO {
    private Long cartId;
    private Long userId;
    private Integer totalItems; // Tổng số lượng sản phẩm (VD: 5 hộp thuốc)
    private BigDecimal subTotal; // Tính toán tổng tiền
    private List<CartItemDTO> items;
}