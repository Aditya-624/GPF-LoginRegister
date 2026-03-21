package com.adithya.loginregister.entity;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;

@Entity
@Table(name = "GPF_SUB_DETAILS")
public class GpfSubDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "gpf_sub_details_gen")
    @SequenceGenerator(name = "gpf_sub_details_gen", sequenceName = "GPF_SUB_DETAILS_SEQ", allocationSize = 1)
    @Column(name = "ID")
    private Long id;

    @Column(name = "PERS_NUMBER", nullable = false, length = 50)
    private String persNumber;

    @Column(name = "ADD_SUB_DATE", nullable = false)
    private LocalDate addSubDate;

    @Column(name = "GPF_SUB", nullable = false, precision = 15, scale = 2)
    private BigDecimal gpfSub;

    @Column(name = "GPF_RET", nullable = false, precision = 15, scale = 2)
    private BigDecimal gpfRet;

    public GpfSubDetails() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPersNumber() { return persNumber; }
    public void setPersNumber(String persNumber) { this.persNumber = persNumber; }

    public LocalDate getAddSubDate() { return addSubDate; }
    public void setAddSubDate(LocalDate addSubDate) { this.addSubDate = addSubDate; }

    public BigDecimal getGpfSub() { return gpfSub; }
    public void setGpfSub(BigDecimal gpfSub) { this.gpfSub = gpfSub; }

    public BigDecimal getGpfRet() { return gpfRet; }
    public void setGpfRet(BigDecimal gpfRet) { this.gpfRet = gpfRet; }
}
