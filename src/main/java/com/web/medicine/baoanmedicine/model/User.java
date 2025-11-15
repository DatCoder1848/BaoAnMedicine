package com.web.medicine.baoanmedicine.model;

import java.time.LocalDateTime;
import java.util.Set;

public class User {

    private Long userId;
    private String username;
    private String passwordHash; // Đã mã hóa
    private String email;
    private String fullName;
    private String address;
    private String phoneNumber;
    private LocalDateTime createdAt;

    // Quan hệ: Một User có thể có nhiều Role
    // @ManyToMany(fetch = FetchType.EAGER)
    // @JoinTable(...)
    private Set<Role> roles;

    // Quan hệ: Một User có thể có nhiều Order
    // @OneToMany(mappedBy = "user")
    private List<Order> orders;
}