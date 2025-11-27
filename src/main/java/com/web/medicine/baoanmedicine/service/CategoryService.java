package com.web.medicine.baoanmedicine.service;

import com.web.medicine.baoanmedicine.dto.CategoryDto;
import java.util.List;

public interface CategoryService {
    List<CategoryDto> findAll();
    CategoryDto findById(Integer id);

    // --- THÊM CÁC HÀM NÀY ---
    CategoryDto createCategory(CategoryDto categoryDto);
    CategoryDto updateCategory(Integer id, CategoryDto categoryDto);
    void deleteCategory(Integer id);
}