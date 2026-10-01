package com.hcl.stocksmart.dto;

import jakarta.validation.constraints.NotBlank;

public class LocationRequest {

    @NotBlank(message = "Location name is required")
    private String name;

    private String address;

    private String type;

    public LocationRequest() {
    }

    // Generate getters and setters

    public String getName() {
        return name;
    }

    public String getAddress() {
        return address;
    }

    public String getType() {
        return type;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public void setType(String type) {
        this.type = type;
    }
}
