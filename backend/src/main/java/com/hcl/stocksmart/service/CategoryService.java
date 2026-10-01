package com.hcl.stocksmart.service;

import com.hcl.stocksmart.dto.CategoryRequest;
import com.hcl.stocksmart.entity.Category;
import com.hcl.stocksmart.exception.DuplicateResourceException;
import com.hcl.stocksmart.exception.ResourceNotFoundException;
import com.hcl.stocksmart.repository.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public Category create(CategoryRequest request) {

        if (categoryRepository.existsByName(request.getName())) {
            throw new DuplicateResourceException(
                    "Category already exists"
            );
        }

        Category category = new Category();

        category.setName(request.getName());
        category.setDescription(request.getDescription());

        return categoryRepository.save(category);
    }

    public List<Category> getAll() {
        return categoryRepository.findAll();
    }

    public Category getById(Long id) {

        return categoryRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Category not found"
                        ));
    }

    public Category update(Long id, CategoryRequest request) {

        Category category = getById(id);

        category.setName(request.getName());
        category.setDescription(request.getDescription());

        return categoryRepository.save(category);
    }

    public void delete(Long id) {

        Category category = getById(id);

        categoryRepository.delete(category);
    }
}
