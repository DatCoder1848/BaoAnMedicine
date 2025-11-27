package com.web.medicine.baoanmedicine.controller;

import com.web.medicine.baoanmedicine.model.Advertisement;
import com.web.medicine.baoanmedicine.enums.AdSlot;
import com.web.medicine.baoanmedicine.model.Coupon;
import com.web.medicine.baoanmedicine.repository.AdvertisementRepository;
import com.web.medicine.baoanmedicine.repository.CouponRepository;
import com.web.medicine.baoanmedicine.service.MarketingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api")
public class MarketingController {

    @Autowired private MarketingService marketingService;
    @Autowired private CouponRepository couponRepository; // Dùng nhanh cho CRUD Admin
    @Autowired private AdvertisementRepository adRepository;

    // --- PHẦN CHO USER ---

    // 1. Kiểm tra mã giảm giá (User nhập ở trang Checkout để xem được giảm bao nhiêu)
    @GetMapping("/marketing/coupon/validate")
    public ResponseEntity<BigDecimal> validateCoupon(
            @RequestParam String code,
            @RequestParam BigDecimal orderAmount) {
        try {
            BigDecimal discount = marketingService.calculateDiscount(code, orderAmount);
            return ResponseEntity.ok(discount);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null); // Hoặc trả về lỗi message
        }
    }

    // 2. Lấy quảng cáo theo vị trí (Banner trang chủ, Sidebar...)
    @GetMapping("/marketing/ads")
    public ResponseEntity<List<Advertisement>> getAds(@RequestParam AdSlot slot) {
        return ResponseEntity.ok(marketingService.getAdsBySlot(slot));
    }

    // --- PHẦN CHO ADMIN ---

    // 3. Tạo mã giảm giá mới
    @PostMapping("/admin/marketing/coupon")
    public ResponseEntity<Coupon> createCoupon(@RequestBody Coupon coupon) {
        return ResponseEntity.ok(couponRepository.save(coupon));
    }

    // 4. Tạo quảng cáo mới
    @PostMapping("/admin/marketing/ads")
    public ResponseEntity<Advertisement> createAd(@RequestBody Advertisement ad) {
        return ResponseEntity.ok(adRepository.save(ad));
    }
}