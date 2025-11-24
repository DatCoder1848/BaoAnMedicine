package com.web.medicine.baoanmedicine.service.impl;

import com.web.medicine.baoanmedicine.repository.ProductRepository;
import com.web.medicine.baoanmedicine.repository.CategoryRepository;
import com.web.medicine.baoanmedicine.service.ProductService;
import com.web.medicine.baoanmedicine.dto.ProductDto;
import com.web.medicine.baoanmedicine.model.Product;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.*;
import org.springframework.transaction.annotation.Transactional;
import java.util.stream.*;

@Service
@Transactional
public class ProductServiceImpl implements ProductService {
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public ProductServiceImpl(ProductRepository productRepository, CategoryRepository categoryRepository){
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    @Override
    public Page<ProductDto> findAll(int page, int size, Integer categoryId, String sortBy, String order){
        Sort.Direction dir = "desc".equalsIgnoreCase(order) ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(dir, sortBy));
        Page<Product> p;
        if(categoryId != null){
            p = productRepository.findAll((root, q, cb) -> cb.equal(root.get("category").get("categoryId"), categoryId), pageable);
        } else {
            p = productRepository.findAll(pageable);
        }
        return p.map(this::toDto);
    }

    @Override
    public Product findByProductId(Long id){
        Product p = productRepository.findById(id).orElseThrow(() -> new RuntimeException("Lỗi: Sản phẩm không tồn tại."));
        return p;
    }

    private ProductDto toDto(Product p){
        ProductDto d = new ProductDto();
        d.setProductId(p.getProductId());
        d.setName(p.getName());
        d.setDescription(p.getDescription());
        d.setPrice(p.getPrice());
        d.setStockQuantity(p.getStockQuantity());
        d.setImageUrl(p.getImageUrl());
        d.setManufacturer(p.getManufacturer());
        d.setUsageInstructions(p.getUsageInstructions());
        d.setPrescriptionRequired(p.isPrescriptionRequired());
        d.setCreatedAt(p.getCreatedAt());
        if(p.getCategory()!=null){
            d.setCategoryId(p.getCategory().getCategoryId());
            d.setCategoryName(p.getCategory().getName());
        }
        return d;
    }
    public Product save(Product product) {
        return productRepository.save(product);
    }
}
