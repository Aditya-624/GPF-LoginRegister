package com.adithya.loginregister.payload;

import jakarta.validation.constraints.*;

public class RegisterRequest {

    private String userId;

    @NotBlank
    private String username;

    @NotBlank
    @Email
    private String email;

    @NotBlank
    @Size(min = 8, max = 255)
    private String password;

    // ISO-8601 date format: yyyy-MM-dd
    private String dob;

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getDob() { return dob; }
    public void setDob(String dob) { this.dob = dob; }
}
