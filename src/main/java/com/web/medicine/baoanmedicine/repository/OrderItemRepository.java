package com.web.medicine.baoanmedicine.repository;

import com.web.medicine.baoanmedicine.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    // Không cần method phức tạp ở đây, JpaRepository đã đủ
}