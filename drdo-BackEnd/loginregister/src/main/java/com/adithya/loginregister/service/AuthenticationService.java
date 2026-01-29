package com.adithya.loginregister.service;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import com.adithya.loginregister.repository.UserRepository;
import com.adithya.loginregister.entity.User;
import com.adithya.loginregister.util.JwtUtil;
import com.adithya.loginregister.payload.RegisterRequest;
import com.adithya.loginregister.payload.LoginRequest;
import com.adithya.loginregister.payload.JwtResponse;

import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.util.Optional;

@Service
public class AuthenticationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Autowired
    public AuthenticationService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public User register(RegisterRequest req) {
        if (req.getUserId() != null && userRepository.existsByUserId(req.getUserId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "userId already exists");
        }
        if (userRepository.existsByUsername(req.getUsername())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "username already exists");
        }
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "email already exists");
        }

        User user = new User();
        user.setUserId(req.getUserId());
        user.setUsername(req.getUsername());
        user.setEmail(req.getEmail());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        if (req.getDob() != null && !req.getDob().isBlank()) {
            user.setDob(LocalDate.parse(req.getDob()));
        }

        return userRepository.save(user);
    }

    public JwtResponse login(LoginRequest req) {
        Optional<User> maybe = userRepository.findByUserId(req.getUserId());
        if (maybe.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "invalid credentials");
        }
        User user = maybe.get();
        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "invalid credentials");
        }

        String token = jwtUtil.generateToken(user.getUserId() != null ? user.getUserId() : user.getUsername());
        return new JwtResponse(token, user.getUserId(), user.getUsername());
    }

    public void changePassword(com.adithya.loginregister.payload.ChangePasswordRequest req) {
        Optional<User> maybe = userRepository.findByUserId(req.getUserId());
        if (maybe.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "user does not exist");
        }
        User user = maybe.get();
        if (!passwordEncoder.matches(req.getOldPassword(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "old password does not match");
        }
        user.setPassword(passwordEncoder.encode(req.getNewPassword()));
        userRepository.save(user);
    }
}
