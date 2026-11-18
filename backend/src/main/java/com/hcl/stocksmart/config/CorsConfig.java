package com.hcl.stocksmart.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Configuration
public class CorsConfig {

    @Value("${cors.allowed-origins:http://localhost:4200,http://localhost:5173}")
    private String allowedOrigins;

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        List<String> originPatterns = new ArrayList<>();

        // Standard local development origins
        originPatterns.add("http://localhost:*");
        originPatterns.add("https://localhost:*");
        originPatterns.add("http://127.0.0.1:*");
        originPatterns.add("https://127.0.0.1:*");

        // Cloud deployments (Render and subdomains)
        originPatterns.add("https://*.onrender.com");

        if (allowedOrigins != null && !allowedOrigins.isBlank()) {
            Arrays.stream(allowedOrigins.split(","))
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .map(s -> s.endsWith("/") ? s.substring(0, s.length() - 1) : s)
                    .forEach(s -> {
                        if (!originPatterns.contains(s)) {
                            originPatterns.add(s);
                        }
                    });
        }

        configuration.setAllowedOriginPatterns(originPatterns);

        configuration.setAllowedMethods(
                List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH", "HEAD")
        );

        configuration.setAllowedHeaders(
                List.of("*")
        );

        configuration.setExposedHeaders(
                List.of("Authorization", "Content-Type", "Accept", "Origin", "X-Requested-With")
        );

        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}
