package com.web.medicine.baoanmedicine.model;

import java.util.Set;

//--- Lớp Role ---
public class Role {
    private Integer roleId;
    private String name; // Ví dụ: "ROLE_ADMIN", "ROLE_CUSTOMER"

    // Quan hệ: Nhiều Role thuộc về nhiều User
    // @ManyToMany(mappedBy = "roles")
    private Set<User> users;
}
