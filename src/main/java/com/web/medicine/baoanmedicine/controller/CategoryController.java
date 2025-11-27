package com.web.medicine.baoanmedicine.controller;

import com.web.medicine.baoanmedicine.dto.CategoryDto;
import com.web.medicine.baoanmedicine.service.CategoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api") // Đổi base path thành /api để linh hoạt
public class CategoryController {

    private final CategoryService categoryService;
    public CategoryController(CategoryService categoryService){ this.categoryService = categoryService; }

    // PUBLIC: Xem danh sách
    @GetMapping("/categories")
    public List<CategoryDto> all(){
        return categoryService.findAll();
    }

    @GetMapping("/categories/{id}")
    public CategoryDto get(@PathVariable Integer id){
        return categoryService.findById(id);
    }

    // --- ADMIN API: /api/admin/categories ---

    @PostMapping("/admin/categories")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CategoryDto> create(@RequestBody CategoryDto dto) {
        return ResponseEntity.ok(categoryService.createCategory(dto));
    }

    @PutMapping("/admin/categories/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CategoryDto> update(@PathVariable Integer id, @RequestBody CategoryDto dto) {
        return ResponseEntity.ok(categoryService.updateCategory(id, dto));
    }

    @DeleteMapping("/admin/categories/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> delete(@PathVariable Integer id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }
}