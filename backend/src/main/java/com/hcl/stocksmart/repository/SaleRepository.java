package com.hcl.stocksmart.repository;

import com.hcl.stocksmart.entity.Sale;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface SaleRepository
        extends JpaRepository<Sale, Long> {

    List<Sale> findByCreatedAtBetween(
            LocalDateTime start,
            LocalDateTime end
    );
}
