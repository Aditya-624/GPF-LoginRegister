package com.adithya.loginregister.entity;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "GPF")
public class GPF {

    @Id
    @Column(name = "GPF_ACCOUNTNUMBER", nullable = false)
    @NotNull
    private BigDecimal gpfAccountNumber;

    @Column(name = "PERS_NUMBER", length = 20)
    @Size(max = 20)
    private String persNumber;

    @Column(name = "EMPLOYEE_NAME", length = 50)
    @Size(max = 50)
    private String employeeName;

    @Column(name = "DESIGNATION", length = 400)
    @Size(max = 400)
    private String designation;

    @Column(name = "DOB")
    private LocalDate dob;

    @Column(name = "DATE_OF_RETIREMENT")
    private LocalDate dateOfRetirement;

    @Column(name = "BASIC_PAY")
    private BigDecimal basicPay;

    @Column(name = "PHONE_NUMBER", length = 20)
    @Size(max = 20)
    private String phoneNumber;

    // Constructors
    public GPF() {
    }

    public GPF(BigDecimal gpfAccountNumber, String persNumber, String employeeName, 
               String designation, LocalDate dob, LocalDate dateOfRetirement, 
               BigDecimal basicPay, String phoneNumber) {
        this.gpfAccountNumber = gpfAccountNumber;
        this.persNumber = persNumber;
        this.employeeName = employeeName;
        this.designation = designation;
        this.dob = dob;
        this.dateOfRetirement = dateOfRetirement;
        this.basicPay = basicPay;
        this.phoneNumber = phoneNumber;
    }

    // Getters and Setters
    public BigDecimal getGpfAccountNumber() {
        return gpfAccountNumber;
    }

    public void setGpfAccountNumber(BigDecimal gpfAccountNumber) {
        this.gpfAccountNumber = gpfAccountNumber;
    }

    public String getPersNumber() {
        return persNumber;
    }

    public void setPersNumber(String persNumber) {
        this.persNumber = persNumber;
    }

    public String getEmployeeName() {
        return employeeName;
    }

    public void setEmployeeName(String employeeName) {
        this.employeeName = employeeName;
    }

    public String getDesignation() {
        return designation;
    }

    public void setDesignation(String designation) {
        this.designation = designation;
    }

    public LocalDate getDob() {
        return dob;
    }

    public void setDob(LocalDate dob) {
        this.dob = dob;
    }

    public LocalDate getDateOfRetirement() {
        return dateOfRetirement;
    }

    public void setDateOfRetirement(LocalDate dateOfRetirement) {
        this.dateOfRetirement = dateOfRetirement;
    }

    public BigDecimal getBasicPay() {
        return basicPay;
    }

    public void setBasicPay(BigDecimal basicPay) {
        this.basicPay = basicPay;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    @Override
    public String toString() {
        return "GPF{" +
                "gpfAccountNumber=" + gpfAccountNumber +
                ", persNumber='" + persNumber + '\'' +
                ", employeeName='" + employeeName + '\'' +
                ", designation='" + designation + '\'' +
                ", dob=" + dob +
                ", dateOfRetirement=" + dateOfRetirement +
                ", basicPay=" + basicPay +
                ", phoneNumber='" + phoneNumber + '\'' +
                '}';
    }
}
