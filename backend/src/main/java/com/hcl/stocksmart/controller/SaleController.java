package com.hcl.stocksmart.controller;

import com.hcl.stocksmart.entity.Sale;
import com.hcl.stocksmart.service.SaleService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sales")
public class SaleController {

    private final SaleService saleService;

    public SaleController(SaleService saleService) {
        this.saleService = saleService;
    }

    @PostMapping
    public Sale createSale(
            @RequestParam String customerName,
            @RequestParam Long productId,
            @RequestParam Long locationId,
            @RequestParam int quantity) {

        return saleService.createSale(
                customerName,
                productId,
                locationId,
                quantity
        );
    }

    @GetMapping
    public List<Sale> getAll() {
        return saleService.getAll();
    }

    @GetMapping("/{id}")
    public Sale getById(@PathVariable Long id) {
        return saleService.getById(id);
    }
}
