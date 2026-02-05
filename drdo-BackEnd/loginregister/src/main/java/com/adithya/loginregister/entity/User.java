package com.adithya.loginregister.entity;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "user_seq")
    @SequenceGenerator(name = "user_seq", sequenceName = "user_sequence", allocationSize = 1)
    private Long id;

    @Column(name = "user_id", nullable = true, unique = true, length = 50)
    @Size(max = 50)
    private String userId;

    @Column(name = "username", nullable = false, unique = true, length = 50)
    @NotBlank
    @Size(max = 50)
    private String username;

    @Column(name = "email", nullable = false, unique = true, length = 100)
    @NotBlank
    @Email
    @Size(max = 100)
    private String email;

    @Column(name = "password", nullable = false, length = 255)
    @NotBlank
    @Size(min = 8, max = 255)
    private String password;

    @Column(name = "dob")
    private LocalDate dob;

    @Column(name = "security_question_1", length = 255)
    @Size(max = 255)
    private String securityQuestion1;

    @Column(name = "security_answer_1", length = 255)
    @Size(max = 255)
    private String securityAnswer1;

    @Column(name = "security_question_2", length = 255)
    @Size(max = 255)
    private String securityQuestion2;

    @Column(name = "security_answer_2", length = 255)
    @Size(max = 255)
    private String securityAnswer2;

    @Column(name = "password_expiry_days")
    private Integer passwordExpiryDays;

    @Column(name = "last_password_change_date")
    private LocalDate lastPasswordChangeDate;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public LocalDate getDob() { return dob; }
    public void setDob(LocalDate dob) { this.dob = dob; }

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

    public LocalDate getLastPasswordChangeDate() { return lastPasswordChangeDate; }
    public void setLastPasswordChangeDate(LocalDate lastPasswordChangeDate) { this.lastPasswordChangeDate = lastPasswordChangeDate; }
}

