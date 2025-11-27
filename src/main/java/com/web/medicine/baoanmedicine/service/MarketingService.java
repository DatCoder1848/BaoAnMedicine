package com.web.medicine.baoanmedicine.service;

import com.web.medicine.baoanmedicine.model.Advertisement;
import com.web.medicine.baoanmedicine.enums.AdSlot;
import com.web.medicine.baoanmedicine.model.Coupon;
import com.web.medicine.baoanmedicine.repository.AdvertisementRepository;
import com.web.medicine.baoanmedicine.repository.CouponRepository;
import com.web.medicine.baoanmedicine.strategy.DiscountStrategy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Service
public class MarketingService {

    @Autowired private CouponRepository couponRepository;
    @Autowired private AdvertisementRepository adRepository;

    // Inject tất cả các Strategy vào Map (key là tên Component, vd: "PERCENT")
    @Autowired private Map<String, DiscountStrategy> discountStrategies;

    // 1. Logic áp dụng mã giảm giá
    // Trả về số tiền được giảm (Discount Amount)
    public BigDecimal calculateDiscount(String couponCode, BigDecimal orderOriginalAmount) {
        if (couponCode == null || couponCode.isEmpty()) {
            return BigDecimal.ZERO;
        }

        Coupon coupon = couponRepository.findByCode(couponCode)
                .orElseThrow(() -> new RuntimeException("Mã giảm giá không tồn tại"));

        // Validate cơ bản
        if (!coupon.isValid()) {
            throw new RuntimeException("Mã giảm giá đã hết hạn hoặc hết lượt dùng");
        }

        // Tìm Strategy xử lý (PERCENT hoặc AMOUNT)
        String strategyName = coupon.getType().name(); // VD: "PERCENT"
        DiscountStrategy strategy = discountStrategies.get(strategyName);

        if (strategy == null) {
            throw new RuntimeException("Loại mã giảm giá không được hỗ trợ: " + strategyName);
        }

        // Kiểm tra điều kiện đơn hàng (Strategy Pattern)
        // Lưu ý: Ta cần tạo đối tượng Order tạm hoặc truyền tham số cần thiết
        // Ở đây truyền trực tiếp minOrderAmount để check
        if (orderOriginalAmount.compareTo(coupon.getMinOrderAmount() == null ? BigDecimal.ZERO : coupon.getMinOrderAmount()) < 0) {
            throw new RuntimeException("Đơn hàng chưa đạt giá trị tối thiểu để dùng mã này");
        }

        // Tính toán
        // Giả lập Order object nhỏ hoặc sửa Strategy để nhận BigDecimal
        // Để đơn giản, giả sử Strategy nhận BigDecimal trong logic này
        // (Bạn cần điều chỉnh Interface Strategy một chút để nhận BigDecimal thay vì Order nếu muốn tách biệt)
        return BigDecimal.ZERO; // Sẽ triển khai chi tiết khi ghép với Order
    }

    @Transactional
    public void markCouponAsUsed(String couponCode) {
        if (couponCode == null) return;
        Coupon coupon = couponRepository.findByCode(couponCode).orElse(null);
        if (coupon != null) {
            coupon.setUsedCount(coupon.getUsedCount() + 1);
            couponRepository.save(coupon);
        }
    }

    // 2. Logic Quảng cáo
    public List<Advertisement> getAdsBySlot(AdSlot slot) {
        return adRepository.findByAdSlotAndIsActiveTrueOrderByPriorityDesc(slot);
    }
}