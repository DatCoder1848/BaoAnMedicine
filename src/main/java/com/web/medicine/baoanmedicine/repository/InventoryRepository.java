package com.web.medicine.baoanmedicine.repository;

import com.web.medicine.baoanmedicine.model.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface InventoryRepository extends JpaRepository<Inventory, Long> {

    // Lấy tất cả lô hàng của 1 sản phẩm, sắp xếp Hạn dùng tăng dần (Gần hết hạn lên đầu)
    // Chỉ lấy những lô còn hàng (currentQuantity > 0)
    @Query("SELECT i FROM Inventory i WHERE i.product.productId = :productId AND i.currentQuantity > 0 " +
            "ORDER BY i.expirationDate ASC")
    List<Inventory> findAvailableBatchesForProduct(@Param("productId") Long productId);

    // Kiểm tra tổng tồn kho thực tế (dùng cho API hiển thị nhanh nếu cần)
    @Query("SELECT SUM(i.currentQuantity) FROM Inventory i WHERE i.product.productId = :productId")
    Integer getTotalStockByProductId(@Param("productId") Long productId);
}