package com.adithya.loginregister.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;

@Entity
@Table(name = "gpf_sanction_details")
public class GPFSanctionDetails {
    
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "gpf_sanction_details_seq")
    @SequenceGenerator(name = "gpf_sanction_details_seq", sequenceName = "gpf_sanction_details_seq", allocationSize = 1)
    private Long id;
    
    @Column(name = "pers_no", nullable = false)
    private String persNo;
    
    @Column(name = "gpf_loan_type")
    private String gpfLoanType;
    
    @Column(name = "application_date")
    private LocalDate applicationDate;
    
    @Column(name = "sanction_date")
    private LocalDate sanctionDate;
    
    @Column(name = "sanction_amount")
    private BigDecimal sanctionAmount;
    
    @Column(name = "purpose")
    private String purpose;
    
    @Column(name = "bill_no")
    private String billNo;
    
    @Column(name = "bill_date")
    private LocalDate billDate;
    
    @Column(name = "recovery_from_date")
    private LocalDate recoveryFromDate;
    
    @Column(name = "no_of_installments")
    private Integer noOfInstallments;
    
    @Column(name = "transaction_date")
    private LocalDate transactionDate;
    
    @Column(name = "applied_amount")
    private BigDecimal appliedAmount;
    
    @Column(name = "instl_amount")
    private BigDecimal instlAmount;
    
    @Column(name = "update_loan_tab")
    private String updateLoanTab;
    
    @Column(name = "dv_date")
    private LocalDate dvDate;
    
    @Column(name = "dv_no")
    private String dvNo;
    
    @Column(name = "remarks")
    private String remarks;
    
    @Column(name = "tot_dv_amt")
    private BigDecimal totDvAmt;
    
    @Column(name = "prev_bal")
    private BigDecimal prevBal;
    
    @Column(name = "rec_from")
    private LocalDate recFrom;
    
    @Column(name = "recovery_paybill")
    private String recoveryPaybill;
    
    @Column(name = "house_addr")
    private String houseAddr;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Constructors
    public GPFSanctionDetails() {}

    public GPFSanctionDetails(String persNo) {
        this.persNo = persNo;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPersNo() {
        return persNo;
    }

    public void setPersNo(String persNo) {
        this.persNo = persNo;
    }

    public String getGpfLoanType() {
        return gpfLoanType;
    }

    public void setGpfLoanType(String gpfLoanType) {
        this.gpfLoanType = gpfLoanType;
    }

    public LocalDate getApplicationDate() {
        return applicationDate;
    }

    public void setApplicationDate(LocalDate applicationDate) {
        this.applicationDate = applicationDate;
    }

    public LocalDate getSanctionDate() {
        return sanctionDate;
    }

    public void setSanctionDate(LocalDate sanctionDate) {
        this.sanctionDate = sanctionDate;
    }

    public BigDecimal getSanctionAmount() {
        return sanctionAmount;
    }

    public void setSanctionAmount(BigDecimal sanctionAmount) {
        this.sanctionAmount = sanctionAmount;
    }

    public String getPurpose() {
        return purpose;
    }

    public void setPurpose(String purpose) {
        this.purpose = purpose;
    }

    public String getBillNo() {
        return billNo;
    }

    public void setBillNo(String billNo) {
        this.billNo = billNo;
    }

    public LocalDate getBillDate() {
        return billDate;
    }

    public void setBillDate(LocalDate billDate) {
        this.billDate = billDate;
    }

    public LocalDate getRecoveryFromDate() {
        return recoveryFromDate;
    }

    public void setRecoveryFromDate(LocalDate recoveryFromDate) {
        this.recoveryFromDate = recoveryFromDate;
    }

    public Integer getNoOfInstallments() {
        return noOfInstallments;
    }

    public void setNoOfInstallments(Integer noOfInstallments) {
        this.noOfInstallments = noOfInstallments;
    }

    public LocalDate getTransactionDate() {
        return transactionDate;
    }

    public void setTransactionDate(LocalDate transactionDate) {
        this.transactionDate = transactionDate;
    }

    public BigDecimal getAppliedAmount() {
        return appliedAmount;
    }

    public void setAppliedAmount(BigDecimal appliedAmount) {
        this.appliedAmount = appliedAmount;
    }

    public BigDecimal getInstlAmount() {
        return instlAmount;
    }

    public void setInstlAmount(BigDecimal instlAmount) {
        this.instlAmount = instlAmount;
    }

    public String getUpdateLoanTab() {
        return updateLoanTab;
    }

    public void setUpdateLoanTab(String updateLoanTab) {
        this.updateLoanTab = updateLoanTab;
    }

    public LocalDate getDvDate() {
        return dvDate;
    }

    public void setDvDate(LocalDate dvDate) {
        this.dvDate = dvDate;
    }

    public String getDvNo() {
        return dvNo;
    }

    public void setDvNo(String dvNo) {
        this.dvNo = dvNo;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public BigDecimal getTotDvAmt() {
        return totDvAmt;
    }

    public void setTotDvAmt(BigDecimal totDvAmt) {
        this.totDvAmt = totDvAmt;
    }

    public BigDecimal getPrevBal() {
        return prevBal;
    }

    public void setPrevBal(BigDecimal prevBal) {
        this.prevBal = prevBal;
    }

    public LocalDate getRecFrom() {
        return recFrom;
    }

    public void setRecFrom(LocalDate recFrom) {
        this.recFrom = recFrom;
    }

    public String getRecoveryPaybill() {
        return recoveryPaybill;
    }

    public void setRecoveryPaybill(String recoveryPaybill) {
        this.recoveryPaybill = recoveryPaybill;
    }

    public String getHouseAddr() {
        return houseAddr;
    }

    public void setHouseAddr(String houseAddr) {
        this.houseAddr = houseAddr;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
