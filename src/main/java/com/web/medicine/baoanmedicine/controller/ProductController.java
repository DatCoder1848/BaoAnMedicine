package com.web.medicine.baoanmedicine.controller;

import com.web.medicine.baoanmedicine.dto.ProductDto;
import com.web.medicine.baoanmedicine.model.Product;
import com.web.medicine.baoanmedicine.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired private ProductService productService;

    // Lấy danh sách hoặc Tìm kiếm (keyword = tên hoặc công dụng)
    @GetMapping
    public ResponseEntity<Page<ProductDto>> getAllOrSearch(
            @RequestParam(required = false) String search,
            Pageable pageable) {
        // Hàm searchProducts trong Service đã xử lý logic tìm theo Tên hoặc Công dụng
        return ResponseEntity.ok(productService.searchProducts(search, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDto> getDetail(@PathVariable Long id) {
        return productService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // API lọc theo danh mục
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<Page<ProductDto>> getByCategory(
            @PathVariable Integer categoryId,
            Pageable pageable) {
        return ResponseEntity.ok(productService.findByCategory(categoryId, pageable));
    }

    @PostMapping("/admin/products")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductDto> createProduct(@RequestBody ProductDto dto) {
        return ResponseEntity.ok(productService.createProduct(dto));
    }
}