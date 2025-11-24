package com.web.medicine.baoanmedicine.service;

import com.web.medicine.baoanmedicine.dto.ProductDto;
import com.web.medicine.baoanmedicine.model.Product;
import org.springframework.data.domain.Page;

public interface ProductService {
    Page<ProductDto> findAll(int page, int size, Integer categoryId, String sortBy, String order);
    Product findByProductId(Long id);

    //Them pthuc
    Product save(Product product);
}
