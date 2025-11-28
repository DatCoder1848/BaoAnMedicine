package com.web.medicine.baoanmedicine.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "addresses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Address {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "recipient_name", nullable = false)
    private String recipientName; // Tên người nhận

    @Column(name = "phone_number", nullable = false)
    private String phoneNumber;   // SĐT người nhận

    @Column(name = "specific_address", nullable = false)
    private String specificAddress; // Số nhà, tên đường

    @Column(name = "city", nullable = false)
    private String city;            // Tỉnh/Thành phố

    @Column(name = "is_default")
    private Boolean isDefault = false;

    @Column(name = "address_label")
    private String label; // Nhà riêng, Văn phòng...

    // Quan hệ Many-to-One với User
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
}