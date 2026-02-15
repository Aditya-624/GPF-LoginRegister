package com.adithya.loginregister.entity;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "GPF_YEARS")
public class GPFYears {

    @Id
    @Column(name = "PASS_NUMBER", nullable = false, unique = true, length = 50)
    @Size(max = 50)
    private String passNumber;

    @Column(name = "GPF_YEARS", nullable = false, precision = 10, scale = 2)
    @NotNull
    private BigDecimal gpfYears;

    @Column(name = "CLOSING_BALANCE", nullable = false, precision = 15, scale = 2)
    @NotNull
    private BigDecimal closingBalance;

    // Constructors
    public GPFYears() {
    }

    public GPFYears(String passNumber, BigDecimal gpfYears, BigDecimal closingBalance) {
        this.passNumber = passNumber;
        this.gpfYears = gpfYears;
        this.closingBalance = closingBalance;
    }

    // Getters and Setters
    public String getPassNumber() {
        return passNumber;
    }

    public void setPassNumber(String passNumber) {
        this.passNumber = passNumber;
    }

    public BigDecimal getGpfYears() {
        return gpfYears;
    }

    public void setGpfYears(BigDecimal gpfYears) {
        this.gpfYears = gpfYears;
    }

    public BigDecimal getClosingBalance() {
        return closingBalance;
    }

    public void setClosingBalance(BigDecimal closingBalance) {
        this.closingBalance = closingBalance;
    }

    @Override
    public String toString() {
        return "GPFYears{" +
                "passNumber='" + passNumber + '\'' +
                ", gpfYears=" + gpfYears +
                ", closingBalance=" + closingBalance +
                '}';
    }
}
