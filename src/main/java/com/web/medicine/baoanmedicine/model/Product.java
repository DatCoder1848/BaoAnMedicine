package com.web.medicine.baoanmedicine.model;

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

    // --- GIÁ BÁN & GIÁ GỐC ---
    @Column(nullable = false, precision = 13, scale = 2)
    private BigDecimal price; // Giá bán hiện tại (đã giảm)

    @Column(name = "original_price", precision = 13, scale = 2)
    private BigDecimal originalPrice; // Giá gốc (để gạch ngang)

    // --- THÔNG TIN CHI TIẾT THUỐC (MỚI) ---
    @Column(columnDefinition = "TEXT")
    private String ingredients; // Thành phần

    @Column(columnDefinition = "TEXT")
    private String sideEffects; // Tác dụng phụ

    @Column(columnDefinition = "TEXT")
    private String storageInstructions; // Hướng dẫn bảo quản

    @Column(name = "expiry_string")
    private String expiryString; // Hạn dùng (dạng text: "36 tháng")

    private String unit; // Đơn vị tính (Hộp, Vỉ, Chai...)

    // --- HÌNH ẢNH & DANH MỤC ---
    private String imageUrl; // Ảnh đại diện chính

    // Danh sách ảnh Gallery (JPA sẽ tạo bảng phụ products_images)
    @ElementCollection
    @CollectionTable(name = "product_images", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "image_url")
    private List<String> images = new ArrayList<>();

    // --- CÁC TRƯỜNG CŨ ---
    private String manufacturer;

    @Column(columnDefinition = "TEXT")
    private String usageInstructions;

    private boolean prescriptionRequired;

    @Column(name = "therapeutic_class")
    private String therapeuticClass;

    private LocalDateTime createdAt = LocalDateTime.now();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    // --- KHO HÀNG ---
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
    private List<Inventory> inventories = new ArrayList<>();

    @Transient
    public Integer getTotalStock() {
        if (inventories == null) return 0;
        return inventories.stream().mapToInt(Inventory::getCurrentQuantity).sum();
    }
}