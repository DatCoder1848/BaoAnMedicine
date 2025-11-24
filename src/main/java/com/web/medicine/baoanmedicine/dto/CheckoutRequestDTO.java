package com.web.medicine.baoanmedicine.dto;

// package com.yourproject.dto;

import java.util.List;
import java.math.BigDecimal;

import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
// DTO cho POST /api/orders/checkout
public class CheckoutRequestDTO {
    private String shippingAddress;
    private String shippingPhone;
    private String paymentMethod;
    // Không cần list items vì bạn sẽ đọc từ Cart Entity của User

    // Bổ sung các phương thức getter cần thiết để fix lỗi
    public String getShippingAddress() {
        return shippingAddress;
    }
    public String getShippingPhone() {
        return shippingPhone;
    }
    public String getPaymentMethod() {
        return paymentMethod;
    }
}



