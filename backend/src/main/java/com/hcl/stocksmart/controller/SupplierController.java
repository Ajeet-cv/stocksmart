package com.hcl.stocksmart.controller;

import com.hcl.stocksmart.dto.SupplierRequest;
import com.hcl.stocksmart.entity.Supplier;
import com.hcl.stocksmart.service.SupplierService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/suppliers")
public class SupplierController {

    private final SupplierService supplierService;

    public SupplierController(SupplierService supplierService) {
        this.supplierService = supplierService;
    }

    @PostMapping
    public Supplier create(
            @Valid @RequestBody SupplierRequest request) {

        return supplierService.create(request);
    }

    @GetMapping
    public List<Supplier> getAll() {
        return supplierService.getAll();
    }

    @GetMapping("/{id}")
    public Supplier getById(@PathVariable Long id) {
        return supplierService.getById(id);
    }

    @PutMapping("/{id}")
    public Supplier update(
            @PathVariable Long id,
            @Valid @RequestBody SupplierRequest request) {

        return supplierService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        supplierService.delete(id);
    }
}
