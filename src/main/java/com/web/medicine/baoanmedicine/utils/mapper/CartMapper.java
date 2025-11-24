package com.web.medicine.baoanmedicine.utils.mapper;

import com.web.medicine.baoanmedicine.dto.response.CartItemDTO;
import com.web.medicine.baoanmedicine.dto.response.CartResponseDTO;
import com.web.medicine.baoanmedicine.dto.response.ProductMiniDTO;
import com.web.medicine.baoanmedicine.model.Cart;
import com.web.medicine.baoanmedicine.model.CartItem;
import com.web.medicine.baoanmedicine.model.Product;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface CartMapper {

    // Instance tĩnh để có thể dùng thủ công nếu cần
    CartMapper INSTANCE = Mappers.getMapper(CartMapper.class);

    // Mapping từ Product Entity sang DTO cơ bản
    @Mapping(source = "price", target = "price")
    ProductMiniDTO toProductMiniDto(Product product);

    // Mapping từ CartItem Entity sang DTO
    CartItemDTO toCartItemDto(CartItem cartItem);

    // Mapping từ Cart Entity sang Response DTO
    @Mapping(source = "user.userId", target = "userId") // Lấy ID từ đối tượng User
    @Mapping(source = "cartItems", target = "items")
    // Chú ý: subTotal phải được tính toán trong Service hoặc Getter trong DTO
    CartResponseDTO toCartResponseDto(Cart cart);
}