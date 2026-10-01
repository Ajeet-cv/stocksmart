package com.hcl.stocksmart.controller;

import com.hcl.stocksmart.entity.Purchase;
import com.hcl.stocksmart.service.PurchaseService;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/purchases")
public class PurchaseController {

    private final PurchaseService purchaseService;

    public PurchaseController(
            PurchaseService purchaseService) {

        this.purchaseService = purchaseService;
    }

    @GetMapping
    public List<Purchase> getAll() {
        return purchaseService.getAll();
    }

    @GetMapping("/{id}")
    public Purchase getById(@PathVariable Long id) {
        return purchaseService.getById(id);
    }

    @PostMapping("/receive")
    public Purchase receive(
            @RequestParam Long supplierId,
            @RequestParam Long locationId,
            @RequestParam Long productId,
            @RequestParam int quantity,
            @RequestParam BigDecimal unitCost) {

        return purchaseService.receive(
                supplierId,
                locationId,
                productId,
                quantity,
                unitCost
        );
    }
}
