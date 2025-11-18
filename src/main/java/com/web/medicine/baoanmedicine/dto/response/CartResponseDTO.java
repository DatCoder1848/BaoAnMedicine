package com.web.medicine.baoanmedicine.dto.response;

import java.util.List;
import java.math.BigDecimal;

public class CartResponseDTO {
    private Long cartId;
    private Long userId;
    private BigDecimal subTotal; // Tính toán tổng tiền
    private List<CartItemDTO> items;

    // Getters, Setters, Constructors (Dùng Lombok)
}