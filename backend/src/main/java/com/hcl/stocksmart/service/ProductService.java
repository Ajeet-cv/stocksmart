package com.hcl.stocksmart.service;

import com.hcl.stocksmart.dto.ProductRequest;
import com.hcl.stocksmart.entity.Category;
import com.hcl.stocksmart.entity.Product;
import com.hcl.stocksmart.exception.DuplicateResourceException;
import com.hcl.stocksmart.exception.ResourceNotFoundException;
import com.hcl.stocksmart.repository.CategoryRepository;
import com.hcl.stocksmart.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public ProductService(
            ProductRepository productRepository,
            CategoryRepository categoryRepository) {

        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    public Product create(ProductRequest request) {

        if (productRepository.existsBySku(request.getSku())) {
            throw new DuplicateResourceException(
                    "SKU already exists"
            );
        }

        if (request.getBarcode() != null &&
                productRepository.existsByBarcode(request.getBarcode())) {

            throw new DuplicateResourceException(
                    "Barcode already exists"
            );
        }

        Category category = categoryRepository.findById(
                request.getCategoryId()
        ).orElseThrow(() ->
                new ResourceNotFoundException(
                        "Category not found"
                ));

        Product product = new Product();

        product.setSku(request.getSku());
        product.setBarcode(request.getBarcode());
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setCategory(category);
        product.setPrice(request.getPrice());
        product.setQuantity(
                request.getQuantity() == null
                        ? 0
                        : request.getQuantity()
        );
        product.setReorderLevel(
                request.getReorderLevel() == null
                        ? 0
                        : request.getReorderLevel()
        );

        return productRepository.save(product);
    }

    public List<Product> getAll() {
        return productRepository.findAll();
    }

    public Product getById(Long id) {

        return productRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Product not found"
                        ));
    }

    public Product update(Long id, ProductRequest request) {

        Product product = getById(id);

        Category category = categoryRepository.findById(
                request.getCategoryId()
        ).orElseThrow(() ->
                new ResourceNotFoundException(
                        "Category not found"
                ));

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setCategory(category);
        product.setPrice(request.getPrice());
        product.setReorderLevel(request.getReorderLevel());

        return productRepository.save(product);
    }

    public void delete(Long id) {

        Product product = getById(id);

        productRepository.delete(product);
    }

    public Product findByBarcode(String barcode) {

        return productRepository.findByBarcode(barcode)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Product with barcode not found"
                        ));
    }
}
