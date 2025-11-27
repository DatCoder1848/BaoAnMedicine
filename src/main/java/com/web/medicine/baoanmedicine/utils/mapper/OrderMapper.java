package com.web.medicine.baoanmedicine.utils.mapper;

import com.web.medicine.baoanmedicine.dto.response.OrderResponseDTO;
import com.web.medicine.baoanmedicine.dto.response.OrderItemDTO;
import com.web.medicine.baoanmedicine.model.Order;
import com.web.medicine.baoanmedicine.model.OrderItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {CartMapper.class})
public interface OrderMapper {

    // Map OrderItem
    OrderItemDTO toOrderItemDto(OrderItem orderItem);

    // Map Order Entity -> OrderResponseDTO
    @Mapping(source = "user.userId", target = "userId") // Map User ID
    @Mapping(source = "items", target = "items")   // Map danh sách item

    // --- SỬA ĐỔI QUAN TRỌNG Ở ĐÂY ---
    @Mapping(source = "finalAmount", target = "totalAmount") // Khớp tên biến khác nhau
    @Mapping(source = "id", target = "orderId") // Entity là id, DTO là orderId (nếu khác nhau)

    // Các trường Enum (OrderStatus, PaymentStatus) MapStruct tự động chuyển sang String (.name())
    // Các trường originalAmount, discountAmount, shippingFee tự động map vì trùng tên
    OrderResponseDTO toOrderResponseDto(Order order);
}