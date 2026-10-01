package com.hcl.stocksmart.service;

import com.hcl.stocksmart.entity.*;
import com.hcl.stocksmart.exception.ResourceNotFoundException;
import com.hcl.stocksmart.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class PurchaseService {

    private final PurchaseRepository purchaseRepository;
    private final PurchaseItemRepository itemRepository;
    private final SupplierRepository supplierRepository;
    private final ProductRepository productRepository;
    private final LocationRepository locationRepository;
    private final InventoryService inventoryService;

    public PurchaseService(
            PurchaseRepository purchaseRepository,
            PurchaseItemRepository itemRepository,
            SupplierRepository supplierRepository,
            ProductRepository productRepository,
            LocationRepository locationRepository,
            InventoryService inventoryService) {

        this.purchaseRepository = purchaseRepository;
        this.itemRepository = itemRepository;
        this.supplierRepository = supplierRepository;
        this.productRepository = productRepository;
        this.locationRepository = locationRepository;
        this.inventoryService = inventoryService;
    }

    public List<Purchase> getAll() {
        return purchaseRepository.findAll();
    }

    public Purchase getById(Long id) {

        return purchaseRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Purchase not found"
                        ));
    }

    @Transactional
    public Purchase receive(
            Long supplierId,
            Long locationId,
            Long productId,
            int quantity,
            BigDecimal unitCost) {

        Supplier supplier =
                supplierRepository.findById(supplierId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Supplier not found"
                                ));

        Product product =
                productRepository.findById(productId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Product not found"
                                ));

        locationRepository.findById(locationId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Location not found"
                        ));

        BigDecimal subtotal =
                unitCost.multiply(
                        BigDecimal.valueOf(quantity)
                );

        Purchase purchase = new Purchase();

        purchase.setSupplier(supplier);
        purchase.setLocation(
                locationRepository.findById(locationId).get()
        );
        purchase.setTotalAmount(subtotal);
        purchase.setStatus("COMPLETED");
        purchase.setPurchaseDate(LocalDateTime.now());

        Purchase savedPurchase =
                purchaseRepository.save(purchase);

        PurchaseItem item = new PurchaseItem();

        item.setPurchase(savedPurchase);
        item.setProduct(product);
        item.setQuantity(quantity);
        item.setUnitCost(unitCost);
        item.setSubtotal(subtotal);

        itemRepository.save(item);

        inventoryService.addStock(
                productId,
                locationId,
                quantity
        );

        return savedPurchase;
    }
}
