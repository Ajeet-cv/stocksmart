package com.hcl.stocksmart.repository;

import com.hcl.stocksmart.entity.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface InventoryRepository
        extends JpaRepository<Inventory, Long> {

    Optional<Inventory> findByProductIdAndLocationId(
            Long productId,
            Long locationId
    );

    List<Inventory> findByProductId(Long productId);

    List<Inventory> findByLocationId(Long locationId);

    @Query("""
        SELECT i
        FROM Inventory i
        WHERE i.quantity <= i.reorderLevel
    """)
    List<Inventory> findLowStock();
}