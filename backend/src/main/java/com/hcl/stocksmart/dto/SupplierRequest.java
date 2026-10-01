package com.hcl.stocksmart.dto;

import jakarta.validation.constraints.NotBlank;

public class SupplierRequest {

    @NotBlank(message = "Supplier name is required")
    private String name;

    private String email;

    private String phone;

    private String address;

    public SupplierRequest() {
    }

    // Generate getters and setters

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getPhone() {
        return phone;
    }

    public String getAddress() {
        return address;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public void setAddress(String address) {
        this.address = address;
    }
}