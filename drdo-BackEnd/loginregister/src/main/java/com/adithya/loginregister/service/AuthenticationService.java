package com.adithya.loginregister.service;

import java.time.LocalDate;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.adithya.loginregister.entity.User;
import com.adithya.loginregister.payload.JwtResponse;
import com.adithya.loginregister.payload.LoginRequest;
import com.adithya.loginregister.payload.RegisterRequest;
import com.adithya.loginregister.repository.UserRepository;
import com.adithya.loginregister.util.JwtUtil;

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

        User user = new User();
        user.setUserId(req.getUserId());
        user.setUsername(req.getUsername());
        user.setEmail(req.getEmail());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        if (req.getDob() != null && !req.getDob().isBlank()) {
            user.setDob(LocalDate.parse(req.getDob()));
        }
        user.setSecurityQuestion1(req.getSecurityQuestion1());
        user.setSecurityAnswer1(req.getSecurityAnswer1());
        user.setSecurityQuestion2(req.getSecurityQuestion2());
        user.setSecurityAnswer2(req.getSecurityAnswer2());
        
        // Set password expiry
        user.setPasswordExpiryDays(req.getPasswordExpiryDays());
        user.setLastPasswordChangeDate(LocalDate.now());

        return userRepository.save(user);
    }

    public JwtResponse login(LoginRequest req) {
        Optional<User> maybe = userRepository.findByUserId(req.getUserId());
        if (maybe.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid username");
        }
        User user = maybe.get();
        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid password");
        }

        // Check if password is expired
        boolean passwordExpired = false;
        if (user.getPasswordExpiryDays() != null && user.getLastPasswordChangeDate() != null) {
            LocalDate expiryDate = user.getLastPasswordChangeDate().plusDays(user.getPasswordExpiryDays());
            if (LocalDate.now().isAfter(expiryDate)) {
                passwordExpired = true;
            }
        }

        String token = jwtUtil.generateToken(user.getUserId() != null ? user.getUserId() : user.getUsername());
        return new JwtResponse(token, user.getUserId(), user.getUsername(), passwordExpired);
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
        // Update last password change date
        user.setLastPasswordChangeDate(LocalDate.now());
        userRepository.save(user);
    }

    public com.adithya.loginregister.payload.SecurityQuestionsResponse getSecurityQuestions(String userId) {
        Optional<User> maybe = userRepository.findByUserId(userId);
        if (maybe.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }
        User user = maybe.get();
        return new com.adithya.loginregister.payload.SecurityQuestionsResponse(
            user.getUserId(),
            user.getSecurityQuestion1(),
            user.getSecurityQuestion2()
        );
    }

    public com.adithya.loginregister.payload.PasswordRecoveryResponse verifySecurityAnswers(
            com.adithya.loginregister.payload.VerifySecurityAnswersRequest req) {
        Optional<User> maybe = userRepository.findByUserId(req.getUserId());
        if (maybe.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }
        
        User user = maybe.get();
        
        // Compare answers (case-insensitive)
        boolean answer1Matches = user.getSecurityAnswer1() != null && 
                                 user.getSecurityAnswer1().equalsIgnoreCase(req.getAnswer1().trim());
        boolean answer2Matches = user.getSecurityAnswer2() != null && 
                                 user.getSecurityAnswer2().equalsIgnoreCase(req.getAnswer2().trim());
        
        if (!answer1Matches || !answer2Matches) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Security answers are incorrect");
        }
        
        // Generate temporary password
        String tempPassword = generateTemporaryPassword();
        
        // Update user's password with temporary password
        user.setPassword(passwordEncoder.encode(tempPassword));
        user.setLastPasswordChangeDate(LocalDate.now());
        userRepository.save(user);
        
        return new com.adithya.loginregister.payload.PasswordRecoveryResponse(
            "Password reset successful. Please use the temporary password to login and change it immediately.",
            tempPassword
        );
    }

    private String generateTemporaryPassword() {
        // Generate a random 10-character password with uppercase, lowercase, numbers, and special chars
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";
        StringBuilder password = new StringBuilder();
        java.util.Random random = new java.util.Random();
        
        // Ensure at least one of each type
        password.append((char) ('A' + random.nextInt(26))); // Uppercase
        password.append((char) ('a' + random.nextInt(26))); // Lowercase
        password.append((char) ('0' + random.nextInt(10))); // Number
        password.append("!@#$%".charAt(random.nextInt(5))); // Special char
        
        // Fill remaining characters
        for (int i = 4; i < 10; i++) {
            password.append(chars.charAt(random.nextInt(chars.length())));
        }
        
        // Shuffle the password
        char[] passwordArray = password.toString().toCharArray();
        for (int i = passwordArray.length - 1; i > 0; i--) {
            int j = random.nextInt(i + 1);
            char temp = passwordArray[i];
            passwordArray[i] = passwordArray[j];
            passwordArray[j] = temp;
        }
        
        return new String(passwordArray);
    }
}
