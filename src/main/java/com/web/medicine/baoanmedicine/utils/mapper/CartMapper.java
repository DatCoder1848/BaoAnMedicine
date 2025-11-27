package com.web.medicine.baoanmedicine.utils.mapper;

import com.web.medicine.baoanmedicine.dto.response.CartItemDTO;
import com.web.medicine.baoanmedicine.dto.response.CartResponseDTO;
import com.web.medicine.baoanmedicine.dto.response.ProductMiniDTO;
import com.web.medicine.baoanmedicine.model.Cart;
import com.web.medicine.baoanmedicine.model.CartItem;
import com.web.medicine.baoanmedicine.model.Product;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;


@Mapper(componentModel = "spring")
public interface CartMapper {

    CartMapper INSTANCE = Mappers.getMapper(CartMapper.class);

    // --- PRODUCT MINI ---
    @Mapping(source = "price", target = "price")
    ProductMiniDTO toProductMiniDto(Product product);

    // --- CART ITEM ---
    CartItemDTO toCartItemDto(CartItem cartItem);

    // --- CART RESPONSE ---
    @Mapping(source = "user.userId", target = "userId")
    @Mapping(source = "cartItems", target = "items")
    // MapStruct sẽ tự động map các trường cùng tên.
    // Các trường tính toán (totalItems, subTotal) sẽ được xử lý ở @AfterMapping bên dưới
    CartResponseDTO toCartResponseDto(Cart cart);

    // LOGIC TÍNH TOÁN: Chạy sau khi MapStruct map xong các trường cơ bản
    @AfterMapping
    default void calculateTotals(Cart cart, @MappingTarget CartResponseDTO dto) {
        if (cart.getCartItems() == null || cart.getCartItems().isEmpty()) {
            dto.setTotalItems(0);
            dto.setSubTotal(BigDecimal.ZERO);
            return;
        }

        // 1. Tính tổng số lượng sản phẩm (Ví dụ: 2 hộp thuốc A + 1 hộp thuốc B = 3)
        int totalItems = cart.getCartItems().stream()
                .mapToInt(CartItem::getQuantity)
                .sum();
        dto.setTotalItems(totalItems);

        // 2. Tính tổng tiền tạm tính (SubTotal)
        BigDecimal subTotal = cart.getCartItems().stream()
                .map(item -> item.getPriceAtAddition().multiply(new BigDecimal(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        dto.setSubTotal(subTotal);
    }
}