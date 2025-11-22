package com.web.medicine.baoanmedicine.repository;

import com.web.medicine.baoanmedicine.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    // Tìm kiếm User theo username hoặc email (dùng cho Login)
    Optional<User> findByUsernameOrEmail(String username, String email);

    // Kiểm tra trùng lặp (dùng cho Register)
    Boolean existsByUsername(String username);
    Boolean existsByEmail(String email);
}