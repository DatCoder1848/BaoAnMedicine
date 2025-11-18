package com.web.medicine.baoanmedicine.service;

import com.web.medicine.baoanmedicine.dto.CheckoutRequestDTO;
import com.web.medicine.baoanmedicine.dto.response.OrderResponseDTO; // DTO mới
import com.web.medicine.baoanmedicine.model.*;
import com.web.medicine.baoanmedicine.repository.OrderItemRepository;
import com.web.medicine.baoanmedicine.repository.OrderRepository;
import com.web.medicine.baoanmedicine.utils.PaymentProcessor;
import com.web.medicine.baoanmedicine.utils.PaymentProcessorFactory;
import com.web.medicine.baoanmedicine.utils.mapper.OrderMapper; // Mapper mới
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired private OrderRepository orderRepository;
    @Autowired private OrderItemRepository orderItemRepository;
    @Autowired private CartService cartService;
    @Autowired private ProductService productService;
    @Autowired private PaymentProcessorFactory paymentFactory;
    @Autowired private UserService userService;

    // TIÊM MAPPER VÀO SERVICE
    @Autowired private OrderMapper orderMapper;

    // --- CÁC HÀM QUẢN LÝ NGHIỆP VỤ ---

    // Hàm hỗ trợ: Xóa giỏ hàng (Giữ nguyên logic Entity)
    @Transactional
    public void clearCart(Cart cart) {
        cartService.clearCart(cart); // Gọi lại hàm clearCart đã hoàn thiện trong CartService
    }

    // 1. Xử lý Đặt hàng (POST /api/orders/checkout) - Trả về DTO
    @Transactional(rollbackOn = {RuntimeException.class})
    public OrderResponseDTO placeOrder(Long userId, CheckoutRequestDTO request) {

        // --- 1. Chuẩn bị dữ liệu & Kiểm tra ---
        User user = userService.findById(userId)
                .orElseThrow(() -> new RuntimeException("Lỗi: Người dùng không tồn tại."));

        // Lấy Entity Cart. Lưu ý: Cần dùng hàm trả về Entity (private/internal) từ CartService
        Cart cart = cartService.getCartByUser(userId); // Giả định hàm này trả về Entity Cart

        if (cart.getCartItems().isEmpty()) {
            throw new RuntimeException("Lỗi: Giỏ hàng trống.");
        }

        BigDecimal totalAmount = calculateTotal(cart);

        // --- 2. Xử lý Thanh toán (Factory Pattern) ---
        PaymentProcessor processor = paymentFactory.getProcessor(request.getPaymentMethod());
        boolean paymentSuccess = processor.processPayment(totalAmount, request.getPaymentMethod());

        if (!paymentSuccess) {
            throw new RuntimeException("Lỗi thanh toán: Giao dịch không thành công.");
        }

        // --- 3. Kiểm tra, Trừ Tồn kho & Tạo OrderItems ---
        Order newOrder = createNewOrderEntity(user, totalAmount, request, processor.getPaymentMethodName());

        for (CartItem cartItem : cart.getCartItems()) {
            Product product = cartItem.getProduct();

            if (cartItem.getQuantity() > product.getStockQuantity()) {
                throw new RuntimeException("Lỗi Tồn kho: Sản phẩm " + product.getName() + " không đủ số lượng.");
            }

            product.setStockQuantity(product.getStockQuantity() - cartItem.getQuantity());
            productService.save(product);

            OrderItem orderItem = createOrderItemEntity(newOrder, product, cartItem);
            orderItemRepository.save(orderItem);
            newOrder.getOrderItems().add(orderItem);
        }

        Order savedOrder = orderRepository.save(newOrder);

        // --- 4. Hoàn tất & Dọn dẹp ---
        clearCart(cart);

        // CHUYỂN ENTITY SANG DTO TRƯỚC KHI TRẢ VỀ
        return orderMapper.toOrderResponseDto(savedOrder);
    }

    // 2. Lấy đơn hàng cá nhân (GET /api/orders/my-orders) - Trả về Page<DTO>
    public Page<OrderResponseDTO> getMyOrders(Long userId, Pageable pageable) {
        Page<Order> orders = orderRepository.findByUser_UserId(userId, pageable);

        // CHUYỂN PAGE<ENTITY> SANG PAGE<DTO>
        return orders.map(orderMapper::toOrderResponseDto);
    }

    // 3. Lấy chi tiết đơn hàng theo ID (Dùng cho cả Khách hàng và Admin) - Trả về DTO
    public Optional<OrderResponseDTO> findOrderDtoById(Long orderId) {
        return orderRepository.findById(orderId)
                .map(orderMapper::toOrderResponseDto); // Chỉ chuyển sang DTO nếu tìm thấy
    }

    // 4. Lấy tất cả đơn hàng (Admin) - Trả về Page<DTO>
    public Page<OrderResponseDTO> findAllOrders(Pageable pageable) {
        Page<Order> orders = orderRepository.findAll(pageable);
        return orders.map(orderMapper::toOrderResponseDto);
    }

    // 5. Lấy đơn hàng theo trạng thái (Admin) - Trả về Page<DTO>
    public Page<OrderResponseDTO> findOrdersByStatus(String status, Pageable pageable) {
        Page<Order> orders = orderRepository.findByStatus(status, pageable);
        return orders.map(orderMapper::toOrderResponseDto);
    }

    // 6. Cập nhật trạng thái đơn hàng (PUT /api/admin/orders/{id}/status) - Trả về DTO
    @Transactional
    public OrderResponseDTO updateOrderStatus(Long orderId, String newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        order.setStatus(newStatus);
        Order updatedOrder = orderRepository.save(order);

        // CHUYỂN ENTITY SANG DTO TRƯỚC KHI TRẢ VỀ
        return orderMapper.toOrderResponseDto(updatedOrder);
    }

    // --- CÁC HÀM HỖ TRỢ NỘI BỘ (Giữ nguyên) ---

    // Hàm hỗ trợ: Tính tổng tiền
    private BigDecimal calculateTotal(Cart cart) {
        return cart.getCartItems().stream()
                .map(item -> item.getPriceAtAddition().multiply(new BigDecimal(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    // Hàm hỗ trợ: Tạo Order Entity
    private Order createNewOrderEntity(User user, BigDecimal totalAmount, CheckoutRequestDTO request, String paymentMethod) {
        Order newOrder = new Order();
        newOrder.setUser(user);
        newOrder.setOrderDate(LocalDateTime.now());
        newOrder.setShippingAddress(request.getShippingAddress());
        newOrder.setShippingPhone(request.getShippingPhone());
        newOrder.setPaymentMethod(paymentMethod);
        newOrder.setStatus("PENDING");
        newOrder.setTotalAmount(totalAmount);
        newOrder.setOrderItems(new java.util.ArrayList<>());
        return newOrder;
    }

    // Hàm hỗ trợ: Tạo OrderItem Entity
    private OrderItem createOrderItemEntity(Order order, Product product, CartItem cartItem) {
        OrderItem orderItem = new OrderItem();
        orderItem.setOrder(order);
        orderItem.setProduct(product);
        orderItem.setQuantity(cartItem.getQuantity());
        orderItem.setPriceAtPurchase(cartItem.getPriceAtAddition());
        return orderItem;
    }
}