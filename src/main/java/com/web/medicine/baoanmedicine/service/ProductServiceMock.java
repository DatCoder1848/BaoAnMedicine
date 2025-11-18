package com.web.medicine.baoanmedicine.service;

import com.web.medicine.baoanmedicine.model.Product;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.Optional;

// @Primary: Báo cho Spring biết ưu tiên dùng lớp này thay cho ProductService thật
// Mục đích: Cho phép OrderService của Đạt biên dịch và chạy được
@Service
@Primary
public class ProductServiceMock implements ProductService {

    // Tạo một sản phẩm giả (Dummy Product) để Service của bạn có thể gọi
    private final Product dummyProduct = createDummyProduct();

    private Product createDummyProduct() {
        Product p = new Product();
        p.setProductId(1L);
        p.setName("Paracetamol Mock");
        p.setPrice(new BigDecimal("10.00"));
        p.setStockQuantity(100); // Tồn kho đủ để test
        return p;
    }

    @Override
    public Optional<Product> findById(Long id) {
        // Chỉ trả về sản phẩm giả nếu ID là 1, để OrderService có thể chạy
        if (id.equals(1L)) {
            return Optional.of(dummyProduct);
        }
        return Optional.empty();
    }

    @Override
    public Product save(Product product) {
        // Trong môi trường Mock, chỉ cần in ra log để xác nhận tồn kho đã bị trừ
        System.out.println("MOCK: Giả lập đã trừ tồn kho cho Product ID: " + product.getProductId() +
                ". Tồn kho mới: " + product.getStockQuantity());
        return product;
    }
}