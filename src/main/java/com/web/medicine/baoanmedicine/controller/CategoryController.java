package com.web.medicine.baoanmedicine.controller;

import com.web.medicine.baoanmedicine.dto.CategoryDto;
import com.web.medicine.baoanmedicine.service.CategoryService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {
    private final CategoryService categoryService;
    public CategoryController(CategoryService categoryService){ this.categoryService = categoryService; }

    @GetMapping
    public List<CategoryDto> all(){
        return categoryService.findAll();
    }

    @GetMapping("/{id}")
    public CategoryDto get(@PathVariable Integer id){
        return categoryService.findById(id);
    }
}
