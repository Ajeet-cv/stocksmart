package com.hcl.stocksmart.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hcl.stocksmart.dto.LoginRequest;
import com.hcl.stocksmart.dto.RegisterRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@Transactional
class AuthControllerTest {

    @Autowired
    private WebApplicationContext context;

    private final ObjectMapper objectMapper = new ObjectMapper();

    private MockMvc getMockMvc() {
        return MockMvcBuilders.webAppContextSetup(context).build();
    }

    @Test
    void testRegisterSuccess() throws Exception {
        RegisterRequest req = new RegisterRequest();
        req.setName("Test User");
        req.setEmail("test.newuser@example.com");
        req.setPassword("SecurePass123!");

        getMockMvc().perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andExpect(jsonPath("$.email").value("test.newuser@example.com"))
                .andExpect(jsonPath("$.role").value("STAFF"));
    }

    @Test
    void testRegisterDuplicateEmailFails() throws Exception {
        RegisterRequest req = new RegisterRequest();
        req.setName("First User");
        req.setEmail("duplicate@example.com");
        req.setPassword("Password123!");

        // First registration
        getMockMvc().perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk());

        // Duplicate registration attempt
        getMockMvc().perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.message").value("Email already registered"));
    }

    @Test
    void testRegisterValidationFailure() throws Exception {
        RegisterRequest req = new RegisterRequest();
        req.setName(""); // blank name
        req.setEmail("not-an-email"); // invalid email
        req.setPassword(""); // blank password

        getMockMvc().perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").isNotEmpty());
    }

    @Test
    void testLoginSuccess() throws Exception {
        RegisterRequest regReq = new RegisterRequest();
        regReq.setName("Login User");
        regReq.setEmail("login.test@example.com");
        regReq.setPassword("LoginPass123!");

        getMockMvc().perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(regReq)))
                .andExpect(status().isOk());

        LoginRequest loginReq = new LoginRequest();
        loginReq.setEmail("login.test@example.com");
        loginReq.setPassword("LoginPass123!");

        getMockMvc().perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andExpect(jsonPath("$.email").value("login.test@example.com"));
    }
}
