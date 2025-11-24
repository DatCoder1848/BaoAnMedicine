package com.web.medicine.baoanmedicine.utils;

import java.math.BigDecimal;

public interface PaymentProcessor {
    boolean processPayment(BigDecimal amount, String paymentDetails);
    String getPaymentMethodName();
}