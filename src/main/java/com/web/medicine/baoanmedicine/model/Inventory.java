package com.web.medicine.baoanmedicine.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "inventory")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Inventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Liên kết ngược lại Product
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "batch_number", length = 50, nullable = false)
    private String batchNumber; // Số lô

    @Column(name = "expiration_date", nullable = false)
    private LocalDate expirationDate; // Hạn dùng (Quan trọng cho FIFO)

    @Column(name = "import_date", nullable = false)
    private LocalDate importDate; // Ngày nhập

    @Column(name = "initial_quantity", nullable = false)
    private Integer initialQuantity;

    @Column(name = "current_quantity", nullable = false)
    private Integer currentQuantity; // Số lượng thực tế còn lại trong lô này

    @Column(name = "location", length = 50)
    private String location;
}