package com.web.medicine.baoanmedicine.service;

import com.web.medicine.baoanmedicine.model.Product;
import java.util.Optional;

// ProductService là contract mà Minh phụ trách
public interface ProductService {

    // Hàm cần thiết cho CartService và OrderService để kiểm tra tồn kho và lấy giá
    Optional<Product> findById(Long id);

    // Hàm cần thiết cho OrderService để TRỪ TỒN KHO sau khi đặt hàng
    Product save(Product product);

    // (Minh sẽ tự bổ sung các hàm CRUD khác)
}