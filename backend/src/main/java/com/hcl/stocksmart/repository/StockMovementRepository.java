package com.hcl.stocksmart.repository;

import com.hcl.stocksmart.entity.StockMovement;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StockMovementRepository
        extends JpaRepository<StockMovement, Long> {

    List<StockMovement> findByProductId(Long productId);

    List<StockMovement> findByLocationId(Long locationId);
}