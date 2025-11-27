package com.web.medicine.baoanmedicine.model;

import com.web.medicine.baoanmedicine.enums.AdSlot;
import com.web.medicine.baoanmedicine.enums.AdType;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "advertisements")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Advertisement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name; // Tên chiến dịch

    @Enumerated(EnumType.STRING)
    @Column(name = "ad_slot", nullable = false)
    private AdSlot adSlot; // Vị trí hiển thị

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AdType type; // Loại media

    @Column(name = "content_url", nullable = false)
    private String contentUrl; // Link ảnh/video

    @Column(name = "target_url", nullable = false)
    private String targetUrl; // Link khi click vào

    private LocalDateTime startDate;
    private LocalDateTime endDate;

    private boolean isActive = true;

    private Integer priority = 0; // Số càng lớn càng ưu tiên hiển thị

    // Target quảng cáo (Optional)
    private Long targetCategoryId;
    private Long targetProductId;
}