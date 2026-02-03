package com.adithya.loginregister.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

import com.adithya.loginregister.service.AuthenticationService;
import com.adithya.loginregister.payload.RegisterRequest;
import com.adithya.loginregister.payload.LoginRequest;
import com.adithya.loginregister.payload.JwtResponse;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:*", "http://127.0.0.1:*"})
public class AuthController {

    private final AuthenticationService authService;

    @Autowired
    public AuthController(AuthenticationService authService) {
        this.authService = authService;
    }

    @GetMapping("/test")
    public ResponseEntity<?> test() {
        return ResponseEntity.ok(java.util.Map.of("message", "Backend is working!", "timestamp", java.time.LocalDateTime.now()));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest req) {
        authService.register(req);
        return ResponseEntity.status(HttpStatus.CREATED).body(java.util.Map.of("message", "User registered"));
    }

    @PostMapping("/login")
    public ResponseEntity<JwtResponse> login(@Valid @RequestBody LoginRequest req) {
        JwtResponse resp = authService.login(req);
        return ResponseEntity.ok(resp);
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@Valid @RequestBody com.adithya.loginregister.payload.ChangePasswordRequest req) {
        authService.changePassword(req);
        return ResponseEntity.ok(java.util.Map.of("message", "Password changed"));
    }
}
