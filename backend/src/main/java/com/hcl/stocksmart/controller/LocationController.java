package com.hcl.stocksmart.controller;

import com.hcl.stocksmart.dto.LocationRequest;
import com.hcl.stocksmart.entity.Location;
import com.hcl.stocksmart.service.LocationService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/locations")
public class LocationController {

    private final LocationService locationService;

    public LocationController(LocationService locationService) {
        this.locationService = locationService;
    }

    @PostMapping
    public Location create(
            @Valid @RequestBody LocationRequest request) {

        return locationService.create(request);
    }

    @GetMapping
    public List<Location> getAll() {
        return locationService.getAll();
    }

    @GetMapping("/{id}")
    public Location getById(@PathVariable Long id) {
        return locationService.getById(id);
    }

    @PutMapping("/{id}")
    public Location update(
            @PathVariable Long id,
            @Valid @RequestBody LocationRequest request) {

        return locationService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        locationService.delete(id);
    }
}
