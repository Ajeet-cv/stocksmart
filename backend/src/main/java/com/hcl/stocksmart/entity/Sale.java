package com.hcl.stocksmart.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "sales")
public class Sale {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String customerName;

    private BigDecimal totalAmount;



    private String saleStatus;

    private LocalDateTime createdAt;

    @PrePersist
    public void created() {
        createdAt = LocalDateTime.now();
    }

    public Sale() {
    }

    // Generate getters and setters

    public Long getId() {
        return id;
    }

    public String getCustomerName() {
        return customerName;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }



    public String getSaleStatus() {
        return saleStatus;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }



    public void setSaleStatus(String saleStatus) {
        this.saleStatus = saleStatus;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}