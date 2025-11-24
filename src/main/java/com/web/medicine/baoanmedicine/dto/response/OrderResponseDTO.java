package com.web.medicine.baoanmedicine.dto.response;

import java.math.BigDecimal;
import java.util.List;

// DTO đại diện cho kết quả đơn hàng (trả về sau khi checkout)
public class OrderResponseDTO {
    private Long orderId;
    private BigDecimal totalAmount;
    private String status;
    private List<OrderItemDTO> items;
    // ... và các trường cần thiết khác
}
