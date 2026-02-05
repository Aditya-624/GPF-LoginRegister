package com.adithya.loginregister.payload;

public class JwtResponse {
    private String token;
    private String userId;
    private String username;
    private boolean passwordExpired;

    public JwtResponse() {}

    public JwtResponse(String token, String userId, String username) {
        this.token = token;
        this.userId = userId;
        this.username = username;
        this.passwordExpired = false;
    }

    public JwtResponse(String token, String userId, String username, boolean passwordExpired) {
        this.token = token;
        this.userId = userId;
        this.username = username;
        this.passwordExpired = passwordExpired;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public boolean isPasswordExpired() { return passwordExpired; }
    public void setPasswordExpired(boolean passwordExpired) { this.passwordExpired = passwordExpired; }
}
