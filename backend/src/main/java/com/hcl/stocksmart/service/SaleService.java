package com.hcl.stocksmart.service;

import com.hcl.stocksmart.entity.Product;
import com.hcl.stocksmart.entity.Sale;
import com.hcl.stocksmart.entity.SaleItem;
import com.hcl.stocksmart.exception.ResourceNotFoundException;
import com.hcl.stocksmart.repository.ProductRepository;
import com.hcl.stocksmart.repository.SaleItemRepository;
import com.hcl.stocksmart.repository.SaleRepository;
import com.hcl.stocksmart.service.InventoryService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class SaleService {

    private final SaleRepository saleRepository;
    private final SaleItemRepository saleItemRepository;
    private final ProductRepository productRepository;
    private final InventoryService inventoryService;

    public SaleService(
            SaleRepository saleRepository,
            SaleItemRepository saleItemRepository,
            ProductRepository productRepository,
            InventoryService inventoryService) {

        this.saleRepository = saleRepository;
        this.saleItemRepository = saleItemRepository;
        this.productRepository = productRepository;
        this.inventoryService = inventoryService;
    }

    @Transactional
    public Sale createSale(
            String customerName,
            Long productId,
            Long locationId,
            int quantity) {

        Product product =
                productRepository.findById(productId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Product not found"
                                ));

        BigDecimal subtotal =
                product.getPrice()
                        .multiply(
                                BigDecimal.valueOf(quantity)
                        );

        Sale sale = new Sale();

        sale.setCustomerName(customerName);
        sale.setTotalAmount(subtotal);
        sale.setSaleStatus("COMPLETED");
        sale.setCreatedAt(LocalDateTime.now());

        Sale savedSale =
                saleRepository.save(sale);

        SaleItem item = new SaleItem();

        item.setSale(savedSale);
        item.setProduct(product);
        item.setQuantity(quantity);
        item.setPrice(product.getPrice());
        item.setSubtotal(subtotal);

        saleItemRepository.save(item);

        inventoryService.removeStock(
                productId,
                locationId,
                quantity
        );

        return savedSale;
    }

    public List<Sale> getAll() {
        return saleRepository.findAll();
    }

    public Sale getById(Long id) {

        return saleRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Sale not found"
                        ));
    }
}
