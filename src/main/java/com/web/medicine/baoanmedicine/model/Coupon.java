package com.web.medicine.baoanmedicine.model;

import com.web.medicine.baoanmedicine.enums.ApplicableTo;
import com.web.medicine.baoanmedicine.enums.CouponType;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "coupons") // Sửa tên bảng số nhiều cho chuẩn
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Coupon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "code", length = 50, unique = true, nullable = false)
    private String code;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", length = 10, nullable = false)
    private CouponType type; // PERCENT hoặc AMOUNT

    @Column(name = "value", precision = 10, scale = 2, nullable = false)
    private BigDecimal value; // Ví dụ: 10 (nghĩa là 10% hoặc 10.000đ)

    @Column(name = "usage_limit", nullable = false)
    private Integer usageLimit;

    @Column(name = "used_count", nullable = false)
    private Integer usedCount = 0;

    @Column(name = "start_date", nullable = false)
    private LocalDateTime startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDateTime endDate;

    @Column(name = "min_order_amount", precision = 10, scale = 2)
    private BigDecimal minOrderAmount;

    @Enumerated(EnumType.STRING)
    @Column(name = "applicable_to", length = 20, nullable = false)
    private ApplicableTo applicableTo;

    @Column(name = "applicable_target_id")
    private Long applicableTargetId;

    // Phương thức tiện ích để kiểm tra coupon còn hiệu lực không
    public boolean isValid() {
        LocalDateTime now = LocalDateTime.now();
        return now.isAfter(startDate) && now.isBefore(endDate) && usedCount < usageLimit;
    }
}