package com.hcl.stocksmart.repository;

import com.hcl.stocksmart.entity.SaleItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SaleItemRepository
        extends JpaRepository<SaleItem, Long> {

    List<SaleItem> findBySaleId(Long saleId);

    List<SaleItem> findByProductId(Long productId);
}
