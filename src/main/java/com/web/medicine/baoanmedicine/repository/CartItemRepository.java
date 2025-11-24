package com.web.medicine.baoanmedicine.repository;

import com.web.medicine.baoanmedicine.model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    // Tìm mục giỏ hàng dựa trên CartId và ProductId
    Optional<CartItem> findByCart_CartIdAndProduct_ProductId(Long cartId, Long productId);
}