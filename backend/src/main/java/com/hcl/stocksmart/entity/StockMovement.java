package com.hcl.stocksmart.entity;

import com.hcl.stocksmart.enums.StockMovementType;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "stock_movements")
public class StockMovement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "location_id", nullable = false)
    private Location location;

    @Enumerated(EnumType.STRING)
    private StockMovementType type;

    private Integer quantity;

    private String referenceId;

    private LocalDateTime createdAt;

    @PrePersist
    public void created() {
        createdAt = LocalDateTime.now();
    }

    public StockMovement() {
    }

    // Generate getters and setters

    public Long getId() {
        return id;
    }

    public Product getProduct() {
        return product;
    }

    public Location getLocation() {
        return location;
    }

    public StockMovementType getType() {
        return type;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public String getReferenceId() {
        return referenceId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public void setLocation(Location location) {
        this.location = location;
    }

    public void setType(StockMovementType type) {
        this.type = type;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public void setReferenceId(String referenceId) {
        this.referenceId = referenceId;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}