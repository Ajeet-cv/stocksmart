package com.hcl.stocksmart.repository;

import com.hcl.stocksmart.entity.Purchase;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PurchaseRepository
        extends JpaRepository<Purchase, Long> {
}
