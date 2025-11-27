package com.web.medicine.baoanmedicine.service.impl;

import com.web.medicine.baoanmedicine.dto.CategoryDto;
import com.web.medicine.baoanmedicine.model.Category;
import com.web.medicine.baoanmedicine.repository.CategoryRepository;
import com.web.medicine.baoanmedicine.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryServiceImpl implements CategoryService {

    @Autowired private CategoryRepository categoryRepository;

    @Override
    public List<CategoryDto> findAll() {
        return categoryRepository.findAll().stream()
                .map(c -> new CategoryDto(c.getCategoryId(), c.getName(), c.getDescription()))
                .collect(Collectors.toList());
    }

    @Override
    public CategoryDto findById(Integer id) {
        Category c = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        return new CategoryDto(c.getCategoryId(), c.getName(), c.getDescription());
    }

    // --- LOGIC ADMIN ---

    @Override
    public CategoryDto createCategory(CategoryDto dto) {
        Category category = new Category();
        category.setName(dto.getName());
        category.setDescription(dto.getDescription());
        Category saved = categoryRepository.save(category);
        return new CategoryDto(saved.getCategoryId(), saved.getName(), saved.getDescription());
    }

    @Override
    public CategoryDto updateCategory(Integer id, CategoryDto dto) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        category.setName(dto.getName());
        category.setDescription(dto.getDescription());
        Category saved = categoryRepository.save(category);
        return new CategoryDto(saved.getCategoryId(), saved.getName(), saved.getDescription());
    }

    @Override
    public void deleteCategory(Integer id) {
        categoryRepository.deleteById(id);
    }
}