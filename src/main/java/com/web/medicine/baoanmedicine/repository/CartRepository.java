package com.web.medicine.baoanmedicine.repository;

import com.web.medicine.baoanmedicine.model.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {
    // Tìm giỏ hàng theo ID người dùng
    Optional<Cart> findByUser_UserId(Long userId);
}
