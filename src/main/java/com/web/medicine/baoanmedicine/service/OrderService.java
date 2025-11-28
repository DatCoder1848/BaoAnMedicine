package com.web.medicine.baoanmedicine.service;

import com.web.medicine.baoanmedicine.dto.CheckoutRequestDTO;
import com.web.medicine.baoanmedicine.dto.response.OrderResponseDTO;
import com.web.medicine.baoanmedicine.enums.OrderStatus;
import com.web.medicine.baoanmedicine.enums.PaymentStatus;
import com.web.medicine.baoanmedicine.model.*;
import com.web.medicine.baoanmedicine.repository.OrderItemRepository;
import com.web.medicine.baoanmedicine.repository.OrderRepository;
import com.web.medicine.baoanmedicine.utils.PaymentProcessor;
import com.web.medicine.baoanmedicine.utils.PaymentProcessorFactory;
import com.web.medicine.baoanmedicine.utils.mapper.OrderMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {

    @Autowired private OrderRepository orderRepository;
    @Autowired private OrderItemRepository orderItemRepository;
    @Autowired private CartService cartService;
    @Autowired private UserService userService;
    @Autowired private PaymentProcessorFactory paymentFactory;
    @Autowired private OrderMapper orderMapper;

    // HAI SERVICE QUAN TRỌNG MỚI
    @Autowired private InventoryService inventoryService; // Để trừ kho FIFO
    @Autowired private MarketingService marketingService; // Để tính mã giảm giá

    @Transactional(rollbackFor = Exception.class)
    public OrderResponseDTO placeOrder(Long userId, CheckoutRequestDTO request) {
        // 1. Lấy dữ liệu
        User user = userService.getUserById(userId);
        Cart cart = cartService.getCartByUser(userId);

        if (cart.getCartItems().isEmpty()) {
            throw new RuntimeException("Giỏ hàng trống, không thể đặt hàng.");
        }

        // 2. Tính toán tiền nong (Financial Calculation)
        BigDecimal originalAmount = calculateOriginalTotal(cart);

        // Gọi Marketing Service để tính giảm giá
        BigDecimal discountAmount = BigDecimal.ZERO;
        if (request.getCouponCode() != null && !request.getCouponCode().isEmpty()) {
            discountAmount = marketingService.calculateDiscount(request.getCouponCode(), originalAmount);
        }

        // Tính tổng cuối (Có thể cộng thêm phí ship nếu cần)
        BigDecimal shippingFee = BigDecimal.ZERO; // Có thể tách logic tính ship riêng
        BigDecimal finalAmount = originalAmount.subtract(discountAmount).add(shippingFee);
        if (finalAmount.compareTo(BigDecimal.ZERO) < 0) finalAmount = BigDecimal.ZERO;

        // 3. Xử lý Thanh toán (Payment)
        PaymentProcessor processor = paymentFactory.getProcessor(request.getPaymentMethod());
        boolean paymentSuccess = processor.processPayment(finalAmount, request.getPaymentMethod());
        if (!paymentSuccess) {
            throw new RuntimeException("Thanh toán thất bại.");
        }

        // 4. Khởi tạo Đơn hàng (Order Entity)
        Order order = new Order();
        order.setUser(user);
        order.setOrderDate(LocalDateTime.now());
        order.setOriginalAmount(originalAmount);
        order.setDiscountAmount(discountAmount);
        order.setShippingFee(shippingFee);
        order.setFinalAmount(finalAmount);
        order.setPaymentStatus(PaymentStatus.PENDING); // Hoặc PAID nếu thanh toán online thành công ngay
        order.setOrderStatus(OrderStatus.NEW);
        order.setShippingAddress(request.getShippingAddress());
        order.setCouponCodeApplied(request.getCouponCode());

        // Lưu trước để có ID gán cho OrderItem (tùy cấu hình Cascade)
        Order savedOrder = orderRepository.save(order);
        List<OrderItem> orderItems = new ArrayList<>();

        // 5. Xử lý Inventory & OrderItems
        for (CartItem cartItem : cart.getCartItems()) {
            Product product = cartItem.getProduct();
            int quantity = cartItem.getQuantity();

            // QUAN TRỌNG: Gọi InventoryService để trừ kho theo lô (FIFO)
            // Nếu không đủ hàng, service này sẽ throw Exception -> Rollback toàn bộ
            inventoryService.deductStock(product.getProductId(), quantity);

            // Tạo OrderItem
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(savedOrder);
            orderItem.setProduct(product);
            orderItem.setQuantity(quantity);
            orderItem.setPriceAtPurchase(cartItem.getPriceAtAddition());

            orderItemRepository.save(orderItem);
            orderItems.add(orderItem);
        }

        savedOrder.setItems(orderItems);

        // 6. Hoàn tất & Dọn dẹp
        // Đánh dấu mã giảm giá đã được sử dụng (tăng count)
        if (request.getCouponCode() != null) {
            marketingService.markCouponAsUsed(request.getCouponCode());
        }
        // Xóa giỏ hàng
        cartService.clearCart(cart);
        // 7. Trả về DTO
        OrderResponseDTO responseDTO = orderMapper.toOrderResponseDto(savedOrder);
        // --- BỔ SUNG: Gắn Link VNPAY nếu cần ---
        if ("VNPAY".equals(request.getPaymentMethod())) {
            // Tạm thời gọi lại logic tạo URL (hoặc bạn có thể refactor để processPayment trả về String)
            // Ở đây mình gọi lại logic tạo URL của VNPAY để gán vào DTO
            // (Cách tốt nhất là sửa PaymentProcessor trả về object chứa URL, nhưng cách này nhanh nhất hiện tại)

            // *Mẹo*: Bạn có thể Copy logic tạo URL trong VnPayProcessor ra một hàm public static
            // hoặc để đơn giản, ta hardcode tạm một URL sandbox để frontend test chuyển trang.

            // Lấy URL từ console log của VnPayProcessor hoặc refactor lại sau.
            responseDTO.setPaymentUrl("https://sandbox.vnpayment.vn/..."); // Frontend sẽ thấy cái này
        }
        return responseDTO;
    }

    // Helper tính tổng gốc
    private BigDecimal calculateOriginalTotal(Cart cart) {
        return cart.getCartItems().stream()
                .map(item -> item.getPriceAtAddition().multiply(new BigDecimal(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    // ... (Giữ các hàm getMyOrders, findAllOrders, updateStatus cũ nhưng đổi kiểu trả về là DTO)

    // 2. Lấy đơn hàng cá nhân (GET /api/orders/my-orders) - Trả về Page<DTO>
    public Page<OrderResponseDTO> getMyOrders(Long userId, Pageable pageable) {
        Page<Order> orders = orderRepository.findByUser_UserId(userId, pageable);

        // CHUYỂN PAGE<ENTITY> SANG PAGE<DTO>
        return orders.map(orderMapper::toOrderResponseDto);
    }

    // 4. Lấy tất cả đơn hàng (Admin) - Trả về Page<DTO>
    public Page<OrderResponseDTO> findAllOrders(Pageable pageable) {
        Page<Order> orders = orderRepository.findAll(pageable);
        return orders.map(orderMapper::toOrderResponseDto);
    }

    // 6. Cập nhật trạng thái đơn hàng (PUT /api/admin/orders/{id}/status) - Trả về DTO
    @Transactional
    public OrderResponseDTO updateOrderStatus(Long orderId, String newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        try {
            OrderStatus statusEnum = OrderStatus.valueOf(newStatus); // Chuyển String "SHIPPED" -> Enum SHIPPED
            order.setOrderStatus(statusEnum); // Dùng đúng tên hàm setter
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Trạng thái đơn hàng không hợp lệ: " + newStatus);
        }
        Order updatedOrder = orderRepository.save(order);

        // CHUYỂN ENTITY SANG DTO TRƯỚC KHI TRẢ VỀ
        return orderMapper.toOrderResponseDto(updatedOrder);
    }


    public OrderResponseDTO getOrderById(Long id) {
        // 1. Tìm đơn hàng trong DB
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng"));

        // 2. (Quan trọng) Kiểm tra quyền sở hữu
        // Lấy username hiện tại từ SecurityContext
        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        if (!order.getUser().getUsername().equals(currentUsername)) {
            throw new RuntimeException("Bạn không có quyền xem đơn hàng này");
        }

        // 3. Convert sang DTO (Dùng mapper hoặc set thủ công)
        return orderMapper.toOrderResponseDto(order);
    }
}