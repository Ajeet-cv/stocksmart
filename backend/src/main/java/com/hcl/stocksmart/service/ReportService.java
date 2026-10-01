package com.hcl.stocksmart.service;

import com.hcl.stocksmart.repository.*;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class ReportService {

    private final ProductRepository productRepository;
    private final SupplierRepository supplierRepository;
    private final LocationRepository locationRepository;
    private final SaleRepository saleRepository;
    private final PurchaseRepository purchaseRepository;
    private final InventoryRepository inventoryRepository;

    public ReportService(
            ProductRepository productRepository,
            SupplierRepository supplierRepository,
            LocationRepository locationRepository,
            SaleRepository saleRepository,
            PurchaseRepository purchaseRepository,
            InventoryRepository inventoryRepository) {

        this.productRepository = productRepository;
        this.supplierRepository = supplierRepository;
        this.locationRepository = locationRepository;
        this.saleRepository = saleRepository;
        this.purchaseRepository = purchaseRepository;
        this.inventoryRepository = inventoryRepository;
    }

    public Map<String, Object> dashboard() {

        Map<String, Object> result =
                new HashMap<>();

        result.put(
                "totalProducts",
                productRepository.count()
        );

        result.put(
                "totalSuppliers",
                supplierRepository.count()
        );

        result.put(
                "totalLocations",
                locationRepository.count()
        );

        result.put(
                "totalInventoryRecords",
                inventoryRepository.count()
        );

        result.put(
                "totalSales",
                saleRepository.count()
        );

        result.put(
                "totalPurchases",
                purchaseRepository.count()
        );

        return result;
    }
}
