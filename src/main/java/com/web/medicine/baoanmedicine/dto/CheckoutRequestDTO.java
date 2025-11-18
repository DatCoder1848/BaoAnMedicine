package com.web.medicine.baoanmedicine.dto;

// package com.yourproject.dto;

import java.util.List;
import java.math.BigDecimal;

// DTO cho POST /api/orders/checkout
public class CheckoutRequestDTO {
    private String shippingAddress;
    private String shippingPhone;
    private String paymentMethod;
    // Không cần list items vì bạn sẽ đọc từ Cart Entity của User
}



