package com.web.medicine.baoanmedicine.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "roles")
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer roleId;

    // Lưu tên Role dưới dạng String
    @Enumerated(EnumType.STRING)
    @Column(length = 60, nullable = false, unique = true)
    private RoleName name;
}
