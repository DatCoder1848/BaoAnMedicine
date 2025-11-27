package com.web.medicine.baoanmedicine.repository;

import com.web.medicine.baoanmedicine.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProductRepository extends JpaRepository<Product, Long> {

    // Tìm kiếm cơ bản (Tên chứa từ khóa)
    Page<Product> findByNameContainingIgnoreCase(String name, Pageable pageable);

    // Tìm kiếm nâng cao: Tìm trong Tên HOẶC Công dụng (Therapeutic Class)
    @Query("SELECT p FROM Product p WHERE " +
            "LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(p.therapeuticClass) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<Product> searchByNameOrFunction(@Param("keyword") String keyword, Pageable pageable);

    // Lọc theo danh mục
    Page<Product> findByCategory_CategoryId(Integer categoryId, Pageable pageable);
}