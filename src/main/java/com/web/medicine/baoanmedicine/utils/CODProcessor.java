package com.web.medicine.baoanmedicine.utils;

import org.springframework.stereotype.Component;
import java.math.BigDecimal;

@Component
public class CODProcessor implements PaymentProcessor {
    @Override
    public boolean processPayment(BigDecimal amount, String paymentDetails) {
        // Logic cho COD: Luôn trả về true vì thanh toán tại thời điểm nhận hàng
        System.out.println("Processing COD: Order accepted. No immediate payment.");
        return true;
    }

    @Override
    public String getPaymentMethodName() {
        return "COD";
    }
}