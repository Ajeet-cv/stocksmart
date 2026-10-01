package com.hcl.stocksmart.service;

import com.hcl.stocksmart.entity.Inventory;
import com.hcl.stocksmart.entity.Location;
import com.hcl.stocksmart.entity.Product;
import com.hcl.stocksmart.entity.StockMovement;
import com.hcl.stocksmart.enums.StockMovementType;
import com.hcl.stocksmart.exception.ResourceNotFoundException;
import com.hcl.stocksmart.repository.InventoryRepository;
import com.hcl.stocksmart.repository.LocationRepository;
import com.hcl.stocksmart.repository.ProductRepository;
import com.hcl.stocksmart.repository.StockMovementRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class InventoryService {

    private final InventoryRepository inventoryRepository;
    private final ProductRepository productRepository;
    private final LocationRepository locationRepository;
    private final StockMovementRepository movementRepository;

    public InventoryService(
            InventoryRepository inventoryRepository,
            ProductRepository productRepository,
            LocationRepository locationRepository,
            StockMovementRepository movementRepository) {

        this.inventoryRepository = inventoryRepository;
        this.productRepository = productRepository;
        this.locationRepository = locationRepository;
        this.movementRepository = movementRepository;
    }

    @Transactional
    public Inventory addStock(
            Long productId,
            Long locationId,
            int quantity) {

        if (quantity <= 0) {
            throw new IllegalArgumentException(
                    "Quantity must be greater than zero"
            );
        }

        Product product = getProduct(productId);
        Location location = getLocation(locationId);

        Inventory inventory =
                inventoryRepository
                        .findByProductIdAndLocationId(
                                productId,
                                locationId
                        )
                        .orElseGet(() -> {

                            Inventory newInventory =
                                    new Inventory();

                            newInventory.setProduct(product);
                            newInventory.setLocation(location);
                            newInventory.setQuantity(0);
                            newInventory.setReorderLevel(
                                    product.getReorderLevel()
                            );

                            return newInventory;
                        });

        inventory.setQuantity(
                inventory.getQuantity() + quantity
        );

        Inventory saved =
                inventoryRepository.save(inventory);

        createMovement(
                product,
                location,
                StockMovementType.PURCHASE,
                quantity
        );

        return saved;
    }

    @Transactional
    public Inventory removeStock(
            Long productId,
            Long locationId,
            int quantity) {

        if (quantity <= 0) {
            throw new IllegalArgumentException(
                    "Quantity must be greater than zero"
            );
        }

        Inventory inventory =
                inventoryRepository
                        .findByProductIdAndLocationId(
                                productId,
                                locationId
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Inventory not found"
                                ));

        if (inventory.getQuantity() < quantity) {
            throw new IllegalArgumentException(
                    "Insufficient stock"
            );
        }

        inventory.setQuantity(
                inventory.getQuantity() - quantity
        );

        Inventory saved =
                inventoryRepository.save(inventory);

        createMovement(
                inventory.getProduct(),
                inventory.getLocation(),
                StockMovementType.SALE,
                quantity
        );

        return saved;
    }

    @Transactional
    public void transferStock(
            Long productId,
            Long fromLocationId,
            Long toLocationId,
            int quantity) {

        if (fromLocationId.equals(toLocationId)) {
            throw new IllegalArgumentException(
                    "Source and destination locations must be different"
            );
        }

        if (quantity <= 0) {
            throw new IllegalArgumentException(
                    "Quantity must be greater than zero"
            );
        }

        removeStock(
                productId,
                fromLocationId,
                quantity
        );

        addStock(
                productId,
                toLocationId,
                quantity
        );
    }

    public List<Inventory> getAll() {
        return inventoryRepository.findAll();
    }
    public List<Inventory> getLowStock() {
        return inventoryRepository.findLowStock();
    }
    public List<Inventory> getByProduct(Long productId) {
        return inventoryRepository.findByProductId(productId);
    }

    public List<Inventory> getByLocation(Long locationId) {
        return inventoryRepository.findByLocationId(locationId);
    }

    private Product getProduct(Long id) {

        return productRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Product not found"
                        ));
    }

    private Location getLocation(Long id) {

        return locationRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Location not found"
                        ));
    }

    private void createMovement(
            Product product,
            Location location,
            StockMovementType type,
            int quantity) {

        StockMovement movement = new StockMovement();

        movement.setProduct(product);
        movement.setLocation(location);
        movement.setType(type);
        movement.setQuantity(quantity);

        movementRepository.save(movement);
    }
}
