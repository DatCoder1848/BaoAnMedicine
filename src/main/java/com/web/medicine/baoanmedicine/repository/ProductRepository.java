package com.web.medicine.baoanmedicine.repository;

import com.web.medicine.baoanmedicine.model.Product;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.domain.*;

public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {
    Page<Product> findByNameContainingIgnoreCase(String q, Pageable pageable);
}
