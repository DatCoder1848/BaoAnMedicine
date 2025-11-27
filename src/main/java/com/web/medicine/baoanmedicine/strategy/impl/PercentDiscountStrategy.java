package com.web.medicine.baoanmedicine.strategy.impl;

import com.web.medicine.baoanmedicine.strategy.DiscountStrategy;
import com.web.medicine.baoanmedicine.model.Order;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;
import java.math.RoundingMode;

@Component("PERCENT") // Đặt tên Bean trùng với Enum CouponType
public class PercentDiscountStrategy implements DiscountStrategy {

    @Override
    public String getType() { return "PERCENT"; }

    @Override
    public BigDecimal calculateDiscountAmount(Order order, BigDecimal couponValue) {
        // CouponValue là số phần trăm (ví dụ 10 = 10%)
        return order.getOriginalAmount()
                .multiply(couponValue)
                .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
    }

    @Override
    public boolean isApplicable(Order order, BigDecimal minOrderAmount) {
        if (minOrderAmount == null) return true;
        return order.getOriginalAmount().compareTo(minOrderAmount) >= 0;
    }
}