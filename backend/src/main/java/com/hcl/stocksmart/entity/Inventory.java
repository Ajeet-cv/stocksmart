package com.hcl.stocksmart.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "inventory",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"product_id", "location_id"})
        }
)
public class Inventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "location_id", nullable = false)
    private Location location;

    private Integer quantity = 0;

    private Integer reorderLevel = 0;

    private LocalDateTime updatedAt;

    @PrePersist
    @PreUpdate
    public void updateTimestamp() {
        updatedAt = LocalDateTime.now();
    }

    public Inventory() {
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

    public Integer getQuantity() {
        return quantity;
    }

    public Integer getReorderLevel() {
        return reorderLevel;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
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

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public void setReorderLevel(Integer reorderLevel) {
        this.reorderLevel = reorderLevel;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
