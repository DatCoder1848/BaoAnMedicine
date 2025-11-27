package com.web.medicine.baoanmedicine.service;

import com.web.medicine.baoanmedicine.model.Inventory;
import com.web.medicine.baoanmedicine.model.Product;
import com.web.medicine.baoanmedicine.repository.InventoryRepository;
import com.web.medicine.baoanmedicine.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class InventoryService {

    @Autowired private InventoryRepository inventoryRepository;
    @Autowired private ProductRepository productRepository;

    // Lấy tổng tồn kho để hiển thị
    public Integer getRealStock(Long productId) {
        Integer stock = inventoryRepository.getTotalStockByProductId(productId);
        return stock == null ? 0 : stock;
    }

    // LOGIC PHỨC TẠP: Trừ kho theo nguyên tắc FIFO (Lô nào hết hạn trước trừ trước)
    @Transactional
    public void deductStock(Long productId, int quantityToDeduct) {
        List<Inventory> batches = inventoryRepository.findAvailableBatchesForProduct(productId);

        // Check tổng tồn kho trước
        int totalAvailable = batches.stream().mapToInt(Inventory::getCurrentQuantity).sum();
        if (totalAvailable < quantityToDeduct) {
            Product p = productRepository.findById(productId).orElse(null);
            String pName = (p != null) ? p.getName() : "Unknown";
            throw new RuntimeException("Sản phẩm '" + pName + "' không đủ hàng trong kho. Còn: " + totalAvailable + ", Yêu cầu: " + quantityToDeduct);
        }

        int remainingToDeduct = quantityToDeduct;

        for (Inventory batch : batches) {
            if (remainingToDeduct <= 0) break;

            int availableInBatch = batch.getCurrentQuantity();

            if (availableInBatch >= remainingToDeduct) {
                // Lô này đủ hàng, trừ và xong
                batch.setCurrentQuantity(availableInBatch - remainingToDeduct);
                remainingToDeduct = 0;
            } else {
                // Lô này không đủ, vét sạch lô này và chuyển sang lô tiếp theo
                batch.setCurrentQuantity(0);
                remainingToDeduct -= availableInBatch;
            }
            inventoryRepository.save(batch);
        }
    }

    // Nhập kho (Tạo lô mới)
    @Transactional
    public Inventory importStock(Inventory inventory) {
        // Cần set ngày nhập nếu chưa có
        if (inventory.getImportDate() == null) {
            inventory.setImportDate(java.time.LocalDate.now());
        }
        return inventoryRepository.save(inventory);
    }
}