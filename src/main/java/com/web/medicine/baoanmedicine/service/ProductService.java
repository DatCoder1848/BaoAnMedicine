package com.web.medicine.baoanmedicine.service;

import com.web.medicine.baoanmedicine.dto.ProductDto;
import com.web.medicine.baoanmedicine.model.Product;
import com.web.medicine.baoanmedicine.repository.ProductRepository;
import com.web.medicine.baoanmedicine.utils.mapper.ProductMapper; // Import Interface
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    // --- SỬA LỖI: Tiêm Mapper vào đây ---
    @Autowired
    private ProductMapper productMapper;

    // 1. Lấy chi tiết SP - Trả về DTO
    @Transactional(readOnly = true)
    public Optional<ProductDto> findById(Long id) {
        return productRepository.findById(id)
                .map(product -> {
                    // Kích hoạt Lazy load tồn kho trước khi map
                    if (product.getInventories() != null) {
                        product.getInventories().size();
                    }
                    // SỬA: Gọi qua instance 'productMapper', không gọi static
                    return productMapper.toDto(product);
                });
    }

    // 2. Lưu hoặc Cập nhật sản phẩm
    public Product save(Product product) {
        return productRepository.save(product);
    }

    // 3. Xóa sản phẩm
    public void delete(Long id) {
        productRepository.deleteById(id);
    }

    // 4. Lấy tất cả (Cho Admin) - SỬA LẠI TRẢ VỀ DTO LUÔN ĐỂ TRÁNH LỖI PROXY
    @Transactional(readOnly = true)
    public Page<ProductDto> findAll(Pageable pageable) {
        return productRepository.findAll(pageable)
                .map(productMapper::toDto); // SỬA: Dùng instance
    }

    // 5. Tìm kiếm
    @Transactional(readOnly = true)
    public Page<ProductDto> searchProducts(String keyword, Pageable pageable) {
        Page<Product> products;
        if (keyword == null || keyword.isEmpty()) {
            products = productRepository.findAll(pageable);
        } else {
            products = productRepository.searchByNameOrFunction(keyword, pageable);
        }
        // SỬA: Dùng instance 'productMapper'
        return products.map(productMapper::toDto);
    }

    // 6. Lọc theo Danh mục
    @Transactional(readOnly = true)
    public Page<ProductDto> findByCategory(Integer categoryId, Pageable pageable) {
        Page<Product> products = productRepository.findByCategory_CategoryId(categoryId, pageable);
        // SỬA: Dùng instance 'productMapper'
        return products.map(productMapper::toDto);
    }

    // Hàm phụ trợ tìm Product Entity (dùng cho các Service khác như Cart/Inventory gọi nội bộ)
    public Product findByProductId(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
    }
}