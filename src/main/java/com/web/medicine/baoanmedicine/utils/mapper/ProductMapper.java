package com.web.medicine.baoanmedicine.utils.mapper;

import com.web.medicine.baoanmedicine.dto.ProductDto;
import com.web.medicine.baoanmedicine.model.Product;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ProductMapper {

    // 1. Map từ Entity sang DTO (Dùng khi hiển thị ra API)

    // Lấy ID và Tên từ đối tượng Category lồng bên trong
    @Mapping(source = "category.categoryId", target = "categoryId")
    @Mapping(source = "category.name", target = "categoryName")

    // Quan trọng: Map từ hàm ảo getTotalStock() của Entity sang biến stockQuantity của DTO
    @Mapping(source = "totalStock", target = "stockQuantity")

    ProductDto toDto(Product product);

    // 2. Map từ DTO sang Entity (Dùng khi Admin tạo/sửa sản phẩm)
    // Bỏ qua các trường này vì ta sẽ set thủ công trong Service
    @Mapping(target = "category", ignore = true)
    @Mapping(target = "inventories", ignore = true)
    @Mapping(target = "createdAt", ignore = true) // Thường tự tạo lúc new
    Product toEntity(ProductDto dto);
}