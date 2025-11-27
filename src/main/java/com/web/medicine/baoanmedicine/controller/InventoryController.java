package com.web.medicine.baoanmedicine.controller;

import com.web.medicine.baoanmedicine.model.Inventory;
import com.web.medicine.baoanmedicine.model.Product;
import com.web.medicine.baoanmedicine.service.InventoryService;
import com.web.medicine.baoanmedicine.service.ProductService;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/admin/inventory")
public class InventoryController {

    @Autowired private InventoryService inventoryService;
    @Autowired private ProductService productService;

    // API: Nhập kho (Tạo lô hàng mới)
    @PostMapping("/import")
    public ResponseEntity<?> importStock(@RequestBody ImportStockRequest request) {
        Product product = productService.findByProductId(request.getProductId());

        Inventory inventory = new Inventory();
        inventory.setProduct(product);
        inventory.setBatchNumber(request.getBatchNumber());
        inventory.setInitialQuantity(request.getQuantity());
        inventory.setCurrentQuantity(request.getQuantity());
        inventory.setImportDate(LocalDate.now());
        inventory.setExpirationDate(request.getExpirationDate());
        inventory.setLocation(request.getLocation());

        inventoryService.importStock(inventory);

        return ResponseEntity.ok("Nhập kho thành công lô: " + request.getBatchNumber());
    }

    // API: Xem tổng tồn kho của 1 sản phẩm
    @GetMapping("/stock/{productId}")
    public ResponseEntity<Integer> getRealStock(@PathVariable Long productId) {
        return ResponseEntity.ok(inventoryService.getRealStock(productId));
    }

    // DTO nội bộ cho request nhập kho
    @Data
    public static class ImportStockRequest {
        private Long productId;
        private String batchNumber;
        private Integer quantity;
        private LocalDate expirationDate;
        private String location;
    }
}