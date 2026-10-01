package com.hcl.stocksmart.controller;

import com.hcl.stocksmart.dto.LoginRequest;
import com.hcl.stocksmart.dto.LoginResponse;
import com.hcl.stocksmart.dto.RegisterRequest;
import com.hcl.stocksmart.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public java.util.Map<String, String> register(
            @Valid @RequestBody RegisterRequest request) {

        authService.register(request);

        return java.util.Map.of("message", "Registration successful");
    }

    @PostMapping("/login")
    public LoginResponse login(
            @Valid @RequestBody LoginRequest request) {

        return authService.login(request);
    }
}
