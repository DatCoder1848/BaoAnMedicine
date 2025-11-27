package com.web.medicine.baoanmedicine.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long productId;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, precision = 13, scale = 2)
    private BigDecimal price;

    // --- SỬA ĐỔI QUAN TRỌNG: Bỏ stockQuantity tĩnh ---
    // Thay vào đó là danh sách các lô hàng trong kho
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
    private List<Inventory> inventories = new ArrayList<>();

    // Thuộc tính ảo: Tự động tính tổng tồn kho từ các lô hàng còn hạn
    @Transient
    public Integer getTotalStock() {
        if (inventories == null) return 0;
        return inventories.stream()
                .mapToInt(Inventory::getCurrentQuantity)
                .sum();
    }

    private String imageUrl;
    private String manufacturer;

    @Column(columnDefinition = "TEXT")
    private String usageInstructions;

    private boolean prescriptionRequired;

    private LocalDateTime createdAt = LocalDateTime.now();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    // Trong class Product
    @Column(name = "therapeutic_class")
    private String therapeuticClass; // Ví dụ: "Giảm đau, Hạ sốt, Chống viêm"
}