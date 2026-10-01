package com.hcl.stocksmart.controller;

import com.hcl.stocksmart.entity.Inventory;
import com.hcl.stocksmart.service.InventoryService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory")
public class InventoryController {

    private final InventoryService inventoryService;

    public InventoryController(
            InventoryService inventoryService) {

        this.inventoryService = inventoryService;
    }

    @GetMapping
    public List<Inventory> getAll() {
        return inventoryService.getAll();
    }

    @GetMapping("/low-stock")
    public List<Inventory> getLowStock() {
        return inventoryService.getLowStock();
    }

    @GetMapping("/product/{productId}")
    public List<Inventory> getByProduct(
            @PathVariable Long productId) {

        return inventoryService.getByProduct(productId);
    }

    @GetMapping("/location/{locationId}")
    public List<Inventory> getByLocation(
            @PathVariable Long locationId) {

        return inventoryService.getByLocation(locationId);
    }

    @PostMapping("/add")
    public Inventory addStock(
            @RequestParam Long productId,
            @RequestParam Long locationId,
            @RequestParam int quantity) {

        return inventoryService.addStock(
                productId,
                locationId,
                quantity
        );
    }

    @PostMapping("/remove")
    public Inventory removeStock(
            @RequestParam Long productId,
            @RequestParam Long locationId,
            @RequestParam int quantity) {

        return inventoryService.removeStock(
                productId,
                locationId,
                quantity
        );
    }

    @PostMapping("/transfer")
    public String transfer(
            @RequestParam Long productId,
            @RequestParam Long fromLocationId,
            @RequestParam Long toLocationId,
            @RequestParam int quantity) {

        inventoryService.transferStock(
                productId,
                fromLocationId,
                toLocationId,
                quantity
        );

        return "Stock transferred successfully";
    }
}
