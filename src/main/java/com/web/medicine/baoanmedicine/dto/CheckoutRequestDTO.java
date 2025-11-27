package com.web.medicine.baoanmedicine.dto;

// package com.yourproject.dto;

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
// DTO cho POST /api/orders/checkout
public class CheckoutRequestDTO {
    private String shippingAddress;
    private String shippingPhone;
    private String paymentMethod;
    private String couponCode;    // Mã giảm giá
    // Không cần list items vì bạn sẽ đọc từ Cart Entity của User
}



