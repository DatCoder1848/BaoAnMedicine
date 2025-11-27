package com.web.medicine.baoanmedicine.repository;

import com.web.medicine.baoanmedicine.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface OrderRepository extends JpaRepository<Order, Long> {
    // Lấy lịch sử đơn hàng của một người dùng (cho API /my-orders)
    Page<Order> findByUser_UserId(Long userId, Pageable pageable);

    // Tìm kiếm đơn hàng theo trạng thái (cho API /admin/orders)
    Page<Order> findByOrderStatus(String status, Pageable pageable);
}