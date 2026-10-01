package com.hcl.stocksmart.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "purchases")
public class Purchase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "supplier_id", nullable = false)
    private Supplier supplier;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "location_id")
    private Location location;

    private BigDecimal totalAmount;

    private String status;

    private LocalDateTime purchaseDate;

    public Purchase() {
    }

    // Generate getters and setters

    public Long getId() {
        return id;
    }

    public Supplier getSupplier() {
        return supplier;
    }

    public Location getLocation() {
        return location;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public String getStatus() {
        return status;
    }

    public LocalDateTime getPurchaseDate() {
        return purchaseDate;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setSupplier(Supplier supplier) {
        this.supplier = supplier;
    }

    public void setLocation(Location location) {
        this.location = location;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setPurchaseDate(LocalDateTime purchaseDate) {
        this.purchaseDate = purchaseDate;
    }
}
