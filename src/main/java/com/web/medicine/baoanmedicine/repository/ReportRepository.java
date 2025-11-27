package com.web.medicine.baoanmedicine.repository;

import com.web.medicine.baoanmedicine.model.Order;
import org.springframework.data.domain.Pageable; // Lưu ý import đúng cái này
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public interface ReportRepository extends JpaRepository<Order, Long> {

    // 1. Query Tính Tổng Doanh thu
    // SỬA: Đổi o.status thành o.orderStatus
    @Query("SELECT SUM(o.finalAmount) FROM Order o WHERE o.orderStatus = 'DELIVERED' " +
            "AND o.orderDate BETWEEN :startDate AND :endDate")
    BigDecimal getTotalRevenueByPeriod(@Param("startDate") LocalDateTime startDate,
                                       @Param("endDate") LocalDateTime endDate);

    // 2. Query Báo cáo Top Sản phẩm
    // SỬA: Đổi o.status thành o.orderStatus
    @Query("SELECT oi.product.name, SUM(oi.quantity) AS totalQuantity " +
            "FROM OrderItem oi JOIN oi.order o " +
            "WHERE o.orderStatus = 'DELIVERED' " +
            "GROUP BY oi.product.name " +
            "ORDER BY totalQuantity DESC")
    List<Object[]> findTopSellingProducts(Pageable pageable);
}