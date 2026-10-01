package com.hcl.stocksmart.service;

import com.hcl.stocksmart.dto.LocationRequest;
import com.hcl.stocksmart.entity.Location;
import com.hcl.stocksmart.exception.ResourceNotFoundException;
import com.hcl.stocksmart.repository.LocationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LocationService {

    private final LocationRepository locationRepository;

    public LocationService(LocationRepository locationRepository) {
        this.locationRepository = locationRepository;
    }

    public Location create(LocationRequest request) {

        Location location = new Location();

        location.setName(request.getName());
        location.setAddress(request.getAddress());
        location.setType(request.getType());

        return locationRepository.save(location);
    }

    public List<Location> getAll() {
        return locationRepository.findAll();
    }

    public Location getById(Long id) {

        return locationRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Location not found"
                        ));
    }

    public Location update(
            Long id,
            LocationRequest request) {

        Location location = getById(id);

        location.setName(request.getName());
        location.setAddress(request.getAddress());
        location.setType(request.getType());

        return locationRepository.save(location);
    }

    public void delete(Long id) {
        locationRepository.delete(getById(id));
    }
}
