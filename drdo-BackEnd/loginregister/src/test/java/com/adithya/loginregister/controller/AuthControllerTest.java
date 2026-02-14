package com.adithya.loginregister.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import com.adithya.loginregister.entity.User;
import com.adithya.loginregister.repository.UserRepository;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class AuthControllerTest {

    @LocalServerPort
    private int port;

    private RestTemplate restTemplate = new RestTemplate();

    @Autowired
    private UserRepository userRepository;

    @BeforeEach
    void cleanup() {
        userRepository.deleteAll();
    }

    @Test
    void registerReturnsCreated() throws Exception {
        String url = "http://localhost:" + port + "/api/auth/register";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        String body = "{\"userId\":\"u1\",\"username\":\"User One\",\"email\":\"u1@example.com\",\"password\":\"Password@123\"}";

        ResponseEntity<String> resp = restTemplate.postForEntity(url, new HttpEntity<>(body, headers), String.class);
        org.assertj.core.api.Assertions.assertThat(resp.getStatusCode().value()).isEqualTo(201);
        org.assertj.core.api.Assertions.assertThat(resp.getBody()).contains("User registered");
    }

    @Test
    void registerWithOriginReturnsCreated() throws Exception {
        String url = "http://localhost:" + port + "/api/auth/register";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Origin", "http://localhost:5173");
        String body = "{\"userId\":\"u2\",\"username\":\"User Two\",\"email\":\"u2@example.com\",\"password\":\"Password@123\"}";

        ResponseEntity<String> resp = restTemplate.postForEntity(url, new HttpEntity<>(body, headers), String.class);
        org.assertj.core.api.Assertions.assertThat(resp.getStatusCode().value()).isEqualTo(201);
        org.assertj.core.api.Assertions.assertThat(resp.getBody()).contains("User registered");
    }

    @Test
    void loginReturnsToken() throws Exception {
        // Create user in DB
        User u = new User();
        u.setUserId("u1");
        u.setUsername("User One");
        u.setEmail("u1@example.com");
        u.setPassword("Password@123");
        userRepository.save(u);

        String url = "http://localhost:" + port + "/api/auth/login";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        String body = "{\"userId\":\"u1\",\"password\":\"Password@123\"}";

        ResponseEntity<String> resp = restTemplate.postForEntity(url, new HttpEntity<>(body, headers), String.class);
        org.assertj.core.api.Assertions.assertThat(resp.getStatusCode().value()).isEqualTo(200);
        org.assertj.core.api.Assertions.assertThat(resp.getBody()).contains("\"userId\":\"u1\"");
        org.assertj.core.api.Assertions.assertThat(resp.getBody()).contains("\"token\"");
    }
}
