package com.web.medicine.baoanmedicine.repository;

import com.web.medicine.baoanmedicine.model.Role;
import com.web.medicine.baoanmedicine.model.RoleName;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Integer> {
    // Tìm kiếm Role theo tên (dùng cho DataInitializer và Register)
    Optional<Role> findByName(RoleName name);
}