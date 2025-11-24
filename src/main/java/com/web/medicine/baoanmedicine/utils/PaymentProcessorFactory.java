package com.web.medicine.baoanmedicine.utils;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class PaymentProcessorFactory {
    // Tiêm tất cả các implementations của PaymentProcessor vào List
    private final List<PaymentProcessor> processors;

    @Autowired
    public PaymentProcessorFactory(List<PaymentProcessor> processors) {
        this.processors = processors;
    }

    public PaymentProcessor getProcessor(String method) {
        return processors.stream()
                .filter(p -> p.getPaymentMethodName().equalsIgnoreCase(method))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Payment method not supported: " + method));
    }
}