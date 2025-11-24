package com.web.medicine.baoanmedicine.controller;

import com.web.medicine.baoanmedicine.config.UserDetailsImpl;
import com.web.medicine.baoanmedicine.dto.CheckoutRequestDTO;
import com.web.medicine.baoanmedicine.dto.response.OrderResponseDTO;
import com.web.medicine.baoanmedicine.model.Order;
import com.web.medicine.baoanmedicine.service.OrderService;
import com.web.medicine.baoanmedicine.utils.mapper.OrderMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
public class OrderController {


    private final OrderService orderService;
    private final OrderMapper orderMapper;

    OrderController(OrderService orderService, OrderMapper orderMapper) {
        this.orderService = orderService;
        this.orderMapper = orderMapper;
    }


    // Dành cho POST /api/orders/checkout [AUTH]
    @PostMapping("/api/orders/checkout")
    public ResponseEntity<OrderResponseDTO> checkout(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestBody CheckoutRequestDTO request) {
        Long userId = userDetails.getUserId();
        OrderResponseDTO newOrder = orderService.placeOrder(userId, request); //fixed biến Order->OrderResposeDTO

        // SỬ DỤNG MAPPER TRƯỚC KHI TRẢ VỀ
        return ResponseEntity.ok(newOrder);
    }

    // Dành cho GET /api/orders/my-orders [AUTH]
    @GetMapping("/api/orders/my-orders")
    public ResponseEntity<Page<OrderResponseDTO>> getMyOrders(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            Pageable pageable) {
        Long userId = userDetails.getUserId();
        Page<OrderResponseDTO> orders = orderService.getMyOrders(userId, pageable);
        return ResponseEntity.ok(orders);
    }

    // --- API ADMIN ---

    // Dành cho GET /api/admin/orders [ADMIN]
    @GetMapping("/api/admin/orders")
    public ResponseEntity<Page<OrderResponseDTO>> getAllOrders(
            @RequestParam(required = false) String status,
            Pageable pageable) {
        // Logic phân quyền ADMIN sẽ do Vân (Spring Security) xử lý
        if (status != null && !status.isEmpty()) {
            return ResponseEntity.ok(orderService.findOrdersByStatus(status, pageable));
        }
        return ResponseEntity.ok(orderService.findAllOrders(pageable)); // Giả sử OrderService có findAll
    }

    // Dành cho PUT /api/admin/orders/{id}/status [ADMIN]
    @PutMapping("/api/admin/orders/{id}/status")
    public ResponseEntity<OrderResponseDTO> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> statusUpdate) {
        String newStatus = statusUpdate.get("status");
        OrderResponseDTO updatedOrder = orderService.updateOrderStatus(id, newStatus);
        return ResponseEntity.ok(updatedOrder);
    }

    // Thêm vào OrderController.java

    // Lấy chi tiết đơn hàng của Khách hàng (M6)
    @GetMapping("/api/orders/my-orders/{id}")
    public ResponseEntity<OrderResponseDTO> getMyOrderDetail(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable Long id) {
        Long userId = userDetails.getUserId();

        // Logic: OrderService.findById(id) và kiểm tra Order.user.userId == userDetails.userId
        return orderService.findOrderDtoById(id, userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    // Lấy chi tiết đơn hàng cho Admin (M7)
    @GetMapping("/api/admin/orders/{id}")
    public ResponseEntity<OrderResponseDTO> getAdminOrderDetail(@PathVariable Long id) {
        // Logic: Chỉ cần OrderService.findById(id)
        return orderService.findOrderDtoById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}