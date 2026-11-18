package com.hcl.stocksmart.config;

import com.hcl.stocksmart.security.JwtAuthenticationFilter;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.time.Instant;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(5);
    }

    @Bean
    public AuthenticationEntryPoint authenticationEntryPoint() {
        return (request, response, authException) -> {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.setCharacterEncoding("UTF-8");

            String message = authException != null && authException.getMessage() != null
                    ? authException.getMessage().replace("\"", "\\\"")
                    : "Full authentication is required to access this resource";

            String jsonResponse = "{"
                    + "\"timestamp\":\"" + Instant.now().toString() + "\","
                    + "\"status\":401,"
                    + "\"error\":\"Unauthorized\","
                    + "\"message\":\"" + message + "\","
                    + "\"path\":\"" + request.getRequestURI() + "\""
                    + "}";

            response.getWriter().write(jsonResponse);
        };
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(Customizer.withDefaults())
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(exceptions -> exceptions
                        .authenticationEntryPoint(authenticationEntryPoint())
                )
                .authorizeHttpRequests(auth -> auth
                        // 1. Allow all OPTIONS preflight requests
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // 2. Allow public root and health endpoints
                        .requestMatchers("/", "/health", "/api/health", "/api/test", "/error").permitAll()

                        // 3. Allow public authentication endpoints
                        .requestMatchers("/api/auth/**").permitAll()

                        // 4. Require authentication for all inventory, reports, admin and business APIs
                        .requestMatchers(
                                "/api/inventory/**",
                                "/api/products/**",
                                "/api/categories/**",
                                "/api/locations/**",
                                "/api/purchases/**",
                                "/api/sales/**",
                                "/api/suppliers/**",
                                "/api/reports/**"
                        ).authenticated()

                        // 5. Any other request requires authentication
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
