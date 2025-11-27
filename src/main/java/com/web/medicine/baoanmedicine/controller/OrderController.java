package com.web.medicine.baoanmedicine.controller;

import com.web.medicine.baoanmedicine.config.UserDetailsImpl;
import com.web.medicine.baoanmedicine.dto.CheckoutRequestDTO;
import com.web.medicine.baoanmedicine.dto.response.OrderResponseDTO;
import com.web.medicine.baoanmedicine.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
public class OrderController {

    @Autowired private OrderService orderService;

    // API QUAN TRỌNG NHẤT: Checkout
    @PostMapping("/api/orders/checkout")
    public ResponseEntity<OrderResponseDTO> checkout(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestBody CheckoutRequestDTO request) {
        Long userId = userDetails.getUserId();
        // Gọi Service v2.0 đã tích hợp Inventory và Marketing
        OrderResponseDTO newOrder = orderService.placeOrder(userId, request);
        return ResponseEntity.ok(newOrder);
    }

    // Lịch sử mua hàng
    @GetMapping("/api/orders/my-orders")
    public ResponseEntity<Page<OrderResponseDTO>> getMyOrders(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            Pageable pageable) {
        Long userId = userDetails.getUserId();
        return ResponseEntity.ok(orderService.getMyOrders(userId, pageable));
    }

    // --- ADMIN API ---

    @GetMapping("/api/admin/orders")
    public ResponseEntity<Page<OrderResponseDTO>> getAllOrders(Pageable pageable) {
        return ResponseEntity.ok(orderService.findAllOrders(pageable));
    }

    @PutMapping("/api/admin/orders/{id}/status")
    public ResponseEntity<OrderResponseDTO> updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        return ResponseEntity.ok(orderService.updateOrderStatus(id, status));
    }
}