package com.hcl.stocksmart.service;

import com.hcl.stocksmart.dto.SupplierRequest;
import com.hcl.stocksmart.entity.Supplier;
import com.hcl.stocksmart.exception.ResourceNotFoundException;
import com.hcl.stocksmart.repository.SupplierRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SupplierService {

    private final SupplierRepository supplierRepository;

    public SupplierService(SupplierRepository supplierRepository) {
        this.supplierRepository = supplierRepository;
    }

    public Supplier create(SupplierRequest request) {

        Supplier supplier = new Supplier();

        supplier.setName(request.getName());
        supplier.setEmail(request.getEmail());
        supplier.setPhone(request.getPhone());
        supplier.setAddress(request.getAddress());

        return supplierRepository.save(supplier);
    }

    public List<Supplier> getAll() {
        return supplierRepository.findAll();
    }

    public Supplier getById(Long id) {

        return supplierRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Supplier not found"
                        ));
    }

    public Supplier update(
            Long id,
            SupplierRequest request) {

        Supplier supplier = getById(id);

        supplier.setName(request.getName());
        supplier.setEmail(request.getEmail());
        supplier.setPhone(request.getPhone());
        supplier.setAddress(request.getAddress());

        return supplierRepository.save(supplier);
    }

    public void delete(Long id) {
        supplierRepository.delete(getById(id));
    }
}
