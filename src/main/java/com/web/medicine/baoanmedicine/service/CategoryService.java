package com.web.medicine.baoanmedicine.service;

import com.web.medicine.baoanmedicine.dto.CategoryDto;
import java.util.*;

public interface CategoryService {
    List<CategoryDto> findAll();
    CategoryDto findById(Integer id);
}
