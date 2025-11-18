package com.web.medicine.baoanmedicine.utils.mapper;

import com.web.medicine.baoanmedicine.dto.response.OrderResponseDTO;
import com.web.medicine.baoanmedicine.dto.response.OrderItemDTO;
import com.web.medicine.baoanmedicine.model.Order;
import com.web.medicine.baoanmedicine.model.OrderItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {CartMapper.class}) // uses = CartMapper để tái sử dụng ProductMiniDTO
public interface OrderMapper {

    // Mapping từ OrderItem Entity sang DTO
    OrderItemDTO toOrderItemDto(OrderItem orderItem);

    // Mapping từ Order Entity sang Response DTO
    @Mapping(source = "user.userId", target = "userId") // Lấy ID User
    @Mapping(source = "orderItems", target = "items")
    OrderResponseDTO toOrderResponseDto(Order order);
}