package com.adithya.loginregister.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.adithya.loginregister.payload.JwtResponse;
import com.adithya.loginregister.payload.LoginRequest;
import com.adithya.loginregister.payload.RegisterRequest;
import com.adithya.loginregister.service.AuthenticationService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:*"})
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
        try {
            authService.register(req);
            return ResponseEntity.status(HttpStatus.CREATED).body(java.util.Map.of("message", "User registered"));
        } catch (org.springframework.dao.DataIntegrityViolationException e) {
            // Handle unique constraint violations
            String errorMessage = e.getMessage();
            String userFriendlyMessage;
            
            if (errorMessage.contains("uniq_users_username") || errorMessage.contains("username")) {
                userFriendlyMessage = "Username already exists. Please choose a different username.";
            } else if (errorMessage.contains("uniq_users_user_id") || errorMessage.contains("user_id")) {
                userFriendlyMessage = "User ID already exists. Please choose a different User ID.";
            } else {
                userFriendlyMessage = "Registration failed. One of the fields (User ID or Username) already exists.";
            }
            
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(java.util.Map.of("error", userFriendlyMessage));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(java.util.Map.of("error", "Registration failed. Please try again."));
        }
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

    @GetMapping("/security-questions/{userId}")
    public ResponseEntity<?> getSecurityQuestions(@PathVariable String userId) {
        try {
            com.adithya.loginregister.payload.SecurityQuestionsResponse response = authService.getSecurityQuestions(userId);
            return ResponseEntity.ok(response);
        } catch (org.springframework.web.server.ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode())
                .body(java.util.Map.of("error", e.getReason()));
        }
    }

    @PostMapping("/verify-security-answers")
    public ResponseEntity<?> verifySecurityAnswers(@Valid @RequestBody com.adithya.loginregister.payload.VerifySecurityAnswersRequest req) {
        try {
            com.adithya.loginregister.payload.PasswordRecoveryResponse response = authService.verifySecurityAnswers(req);
            return ResponseEntity.ok(response);
        } catch (org.springframework.web.server.ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode())
                .body(java.util.Map.of("error", e.getReason()));
        }
    }
}
