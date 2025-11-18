package com.web.medicine.baoanmedicine.repository;

import com.web.medicine.baoanmedicine.model.Order;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public interface ReportRepository extends JpaRepository<Order, Long> {

    // 1. Query Tính Tổng Doanh thu theo khoảng thời gian
    @Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.status = 'DELIVERED' " +
            "AND o.orderDate BETWEEN :startDate AND :endDate")
    BigDecimal getTotalRevenueByPeriod(@Param("startDate") LocalDateTime startDate,
                                       @Param("endDate") LocalDateTime endDate);

    // 2. Query Báo cáo Top Sản phẩm (theo số lượng bán)
    // Trả về một List<Object[]>: [Tên sản phẩm, Tổng số lượng bán]
    @Query("SELECT oi.product.name, SUM(oi.quantity) AS totalQuantity " +
            "FROM OrderItem oi JOIN oi.order o " +
            "WHERE o.status = 'DELIVERED' " +
            "GROUP BY oi.product.name " +
            "ORDER BY totalQuantity DESC")
    List<Object[]> findTopSellingProducts(Pageable pageable);
    // Lưu ý: Cần import org.springframework.data.domain.Pageable
}