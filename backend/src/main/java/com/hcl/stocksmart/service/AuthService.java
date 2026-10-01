package com.hcl.stocksmart.service;

import com.hcl.stocksmart.dto.LoginRequest;
import com.hcl.stocksmart.dto.LoginResponse;
import com.hcl.stocksmart.dto.RegisterRequest;
import com.hcl.stocksmart.entity.User;
import com.hcl.stocksmart.enums.Role;
import com.hcl.stocksmart.exception.DuplicateResourceException;
import com.hcl.stocksmart.repository.UserRepository;
import com.hcl.stocksmart.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public LoginResponse register(RegisterRequest request) {

        if (userRepository.existsByEmail(
                request.getEmail())) {

            throw new DuplicateResourceException(
                    "Email already registered"
            );
        }

        User user = new User();

        user.setName(request.getName());
        user.setEmail(request.getEmail());

        user.setPasswordHash(
                passwordEncoder.encode(
                        request.getPassword()
                )
        );

        user.setRole(Role.STAFF);

        user = userRepository.save(user);

        String token =
                jwtService.generateToken(
                        user.getEmail(),
                        user.getRole().name()
                );

        return new LoginResponse(
                token,
                user.getEmail(),
                user.getRole().name()
        );
    }

    public LoginResponse login(LoginRequest request) {

        User user =
                userRepository.findByEmail(
                        request.getEmail()
                ).orElseThrow(() ->
                        new IllegalArgumentException(
                                "Invalid email or password"
                        ));

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPasswordHash())) {

            throw new IllegalArgumentException(
                    "Invalid email or password"
            );
        }

        String token =
                jwtService.generateToken(
                        user.getEmail(),
                        user.getRole().name()
                );

        return new LoginResponse(
                token,
                user.getEmail(),
                user.getRole().name()
        );
    }
}
