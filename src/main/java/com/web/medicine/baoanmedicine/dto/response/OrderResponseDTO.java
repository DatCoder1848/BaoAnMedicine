package com.web.medicine.baoanmedicine.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponseDTO {
    private Long orderId;

    private Long userId;
    // Thông tin trạng thái
    private String orderStatus;    // NEW, SHIPPED...
    private String paymentStatus;  // PENDING, PAID...
    private String paymentMethod;  // COD, VNPAY...
    private LocalDateTime orderDate; // Ngày đặt hàng

    // Thông tin tài chính (QUAN TRỌNG CHO MARKETING)
    private BigDecimal originalAmount; // Tổng tiền hàng
    private BigDecimal discountAmount; // Tiền được giảm (Coupon)
    private BigDecimal shippingFee;    // Phí ship
    private BigDecimal totalAmount;    // = finalAmount (Số tiền khách phải trả)

    // Thông tin giao hàng
    private String shippingAddress;
    private String shippingPhone;

    // Mã giảm giá đã dùng (nếu có)
    private String couponCodeApplied;

    // Danh sách sản phẩm
    private List<OrderItemDTO> items;
}