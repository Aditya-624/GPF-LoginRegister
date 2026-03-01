package com.adithya.loginregister.entity;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "GPF_USR_DETAILS")
public class GPFUsrDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Long id;

    @Column(name = "APPL_AMT", nullable = false)
    @NotNull
    private BigDecimal applAmt;

    @Column(name = "APPL_DATE", nullable = false)
    @NotNull
    private LocalDate applDate;

    @Column(name = "ENCLOSERS", length = 1)
    @Size(max = 1)
    private String enclosers;

    @Column(name = "GPF_TYPE", length = 1)
    @Size(max = 1)
    private String gpfType;

    @Column(name = "HOUSE_ADDR", length = 200)
    @Size(max = 200)
    private String houseAddr;

    @Column(name = "PERSNO", nullable = false)
    @NotNull
    private BigDecimal persno;

    @Column(name = "PURPOSE", nullable = false)
    @NotNull
    private BigDecimal purpose;

    // Constructors
    public GPFUsrDetails() {
    }

    public GPFUsrDetails(BigDecimal applAmt, LocalDate applDate, String enclosers, 
                        String gpfType, String houseAddr, BigDecimal persno, BigDecimal purpose) {
        this.applAmt = applAmt;
        this.applDate = applDate;
        this.enclosers = enclosers;
        this.gpfType = gpfType;
        this.houseAddr = houseAddr;
        this.persno = persno;
        this.purpose = purpose;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public BigDecimal getApplAmt() {
        return applAmt;
    }

    public void setApplAmt(BigDecimal applAmt) {
        this.applAmt = applAmt;
    }

    public LocalDate getApplDate() {
        return applDate;
    }

    public void setApplDate(LocalDate applDate) {
        this.applDate = applDate;
    }

    public String getEnclosers() {
        return enclosers;
    }

    public void setEnclosers(String enclosers) {
        this.enclosers = enclosers;
    }

    public String getGpfType() {
        return gpfType;
    }

    public void setGpfType(String gpfType) {
        this.gpfType = gpfType;
    }

    public String getHouseAddr() {
        return houseAddr;
    }

    public void setHouseAddr(String houseAddr) {
        this.houseAddr = houseAddr;
    }

    public BigDecimal getPersno() {
        return persno;
    }

    public void setPersno(BigDecimal persno) {
        this.persno = persno;
    }

    public BigDecimal getPurpose() {
        return purpose;
    }

    public void setPurpose(BigDecimal purpose) {
        this.purpose = purpose;
    }

    @Override
    public String toString() {
        return "GPFUsrDetails{" +
                "id=" + id +
                ", applAmt=" + applAmt +
                ", applDate=" + applDate +
                ", enclosers='" + enclosers + '\'' +
                ", gpfType='" + gpfType + '\'' +
                ", houseAddr='" + houseAddr + '\'' +
                ", persno=" + persno +
                ", purpose=" + purpose +
                '}';
    }
}
