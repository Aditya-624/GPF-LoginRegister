package com.adithya.loginregister.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDate;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
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
}

