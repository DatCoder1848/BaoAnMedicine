package com.web.medicine.baoanmedicine.service.impl;

import com.web.medicine.baoanmedicine.repository.CategoryRepository;
import com.web.medicine.baoanmedicine.service.CategoryService;
import com.web.medicine.baoanmedicine.dto.CategoryDto;
import com.web.medicine.baoanmedicine.model.Category;
import org.springframework.stereotype.Service;
import java.util.*;
import java.util.stream.*;

@Service
public class CategoryServiceImpl implements CategoryService {
    private final CategoryRepository categoryRepository;
    public CategoryServiceImpl(CategoryRepository categoryRepository){
        this.categoryRepository = categoryRepository;
    }

    @Override
    public List<CategoryDto> findAll(){
        return categoryRepository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    @Override
    public CategoryDto findById(Integer id){
        Category c = categoryRepository.findById(id).orElseThrow(() -> new RuntimeException("Category not found"));
        return toDto(c);
    }

    private CategoryDto toDto(Category c){
        CategoryDto d = new CategoryDto();
        d.setCategoryId(c.getCategoryId());
        d.setName(c.getName());
        d.setDescription(c.getDescription());
        return d;
    }
}
