package com.web.medicine.baoanmedicine.repository;

import com.web.medicine.baoanmedicine.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProductRepository extends JpaRepository<Product, Long> {

    // Nâng cấp: Tìm trong Tên OR Công dụng OR Thành phần
    @Query("SELECT p FROM Product p WHERE " +
            "LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(p.therapeuticClass) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(p.ingredients) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<Product> searchByNameOrFunction(@Param("keyword") String keyword, Pageable pageable);

    Page<Product> findByCategory_CategoryId(Integer categoryId, Pageable pageable);
}