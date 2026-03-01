package com.adithya.loginregister.payload;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class RegisterRequest {

    private String userId;

    @NotBlank
    private String username;

    @NotBlank
    @Size(max = 50)
    private String workStatus;

    @NotBlank
    @Size(min = 8, max = 255)
    private String password;

    // ISO-8601 date format: yyyy-MM-dd
    private String dob;

    private String securityQuestion1;
    private String securityAnswer1;
    private String securityQuestion2;
    private String securityAnswer2;

    private Integer passwordExpiryDays;

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getWorkStatus() { return workStatus; }
    public void setWorkStatus(String workStatus) { this.workStatus = workStatus; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getDob() { return dob; }
    public void setDob(String dob) { this.dob = dob; }

    public String getSecurityQuestion1() { return securityQuestion1; }
    public void setSecurityQuestion1(String securityQuestion1) { this.securityQuestion1 = securityQuestion1; }

    public String getSecurityAnswer1() { return securityAnswer1; }
    public void setSecurityAnswer1(String securityAnswer1) { this.securityAnswer1 = securityAnswer1; }

    public String getSecurityQuestion2() { return securityQuestion2; }
    public void setSecurityQuestion2(String securityQuestion2) { this.securityQuestion2 = securityQuestion2; }

    public String getSecurityAnswer2() { return securityAnswer2; }
    public void setSecurityAnswer2(String securityAnswer2) { this.securityAnswer2 = securityAnswer2; }

    public Integer getPasswordExpiryDays() { return passwordExpiryDays; }
    public void setPasswordExpiryDays(Integer passwordExpiryDays) { this.passwordExpiryDays = passwordExpiryDays; }
}
