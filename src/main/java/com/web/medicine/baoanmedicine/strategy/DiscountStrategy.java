package com.web.medicine.baoanmedicine.strategy;

import com.web.medicine.baoanmedicine.model.Order;
import java.math.BigDecimal;

public interface DiscountStrategy {
    String getType();
    // Trả về số tiền ĐƯỢC GIẢM (chứ không phải tổng tiền mới, để dễ quản lý)
    BigDecimal calculateDiscountAmount(Order order, BigDecimal couponValue);
    boolean isApplicable(Order order, BigDecimal minOrderAmount);
}