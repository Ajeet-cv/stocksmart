package com.hcl.stocksmart.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

@RestController
public class HealthController {

    @GetMapping(value = {"/", ""})
    public ResponseEntity<Map<String, Object>> root() {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("status", "UP");
        body.put("service", "StockSmart Backend API");
        body.put("version", "1.0.0");
        body.put("message", "StockSmart Retail Inventory Management System Backend is running.");
        body.put("timestamp", Instant.now().toString());
        return ResponseEntity.ok(body);
    }

    @GetMapping(value = {"/api/health", "/health"})
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("status", "UP");
        body.put("service", "stocksmart-backend");
        body.put("timestamp", Instant.now().toString());
        return ResponseEntity.ok(body);
    }
}
