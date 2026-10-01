package com.hcl.stocksmart.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "purchase_items")
public class PurchaseItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "purchase_id", nullable = false)
    private Purchase purchase;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    private Integer quantity;

    private BigDecimal unitCost;

    private BigDecimal subtotal;

    public PurchaseItem() {
    }

    // Generate getters and setters

    public Long getId() {
        return id;
    }

    public Purchase getPurchase() {
        return purchase;
    }

    public Product getProduct() {
        return product;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public BigDecimal getUnitCost() {
        return unitCost;
    }

    public BigDecimal getSubtotal() {
        return subtotal;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setPurchase(Purchase purchase) {
        this.purchase = purchase;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public void setUnitCost(BigDecimal unitCost) {
        this.unitCost = unitCost;
    }

    public void setSubtotal(BigDecimal subtotal) {
        this.subtotal = subtotal;
    }
}