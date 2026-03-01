package com.adithya.loginregister.entity;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "GPF_PURPOSE_E")
public class GPFPurposeE {

    @Id
    @Column(name = "CODE", nullable = false)
    @NotNull
    private BigDecimal code;

    @Column(name = "PURPOSE", length = 20)
    @Size(max = 20)
    private String purpose;

    @Column(name = "PERCENTAGE")
    private BigDecimal percentage;

    @Column(name = "RULE", length = 20)
    @Size(max = 20)
    private String rule;

    // Constructors
    public GPFPurposeE() {
    }

    public GPFPurposeE(BigDecimal code, String purpose, BigDecimal percentage, String rule) {
        this.code = code;
        this.purpose = purpose;
        this.percentage = percentage;
        this.rule = rule;
    }

    // Getters and Setters
    public BigDecimal getCode() {
        return code;
    }

    public void setCode(BigDecimal code) {
        this.code = code;
    }

    public String getPurpose() {
        return purpose;
    }

    public void setPurpose(String purpose) {
        this.purpose = purpose;
    }

    public BigDecimal getPercentage() {
        return percentage;
    }

    public void setPercentage(BigDecimal percentage) {
        this.percentage = percentage;
    }

    public String getRule() {
        return rule;
    }

    public void setRule(String rule) {
        this.rule = rule;
    }

    @Override
    public String toString() {
        return "GPFPurposeE{" +
                "code=" + code +
                ", purpose='" + purpose + '\'' +
                ", percentage=" + percentage +
                ", rule='" + rule + '\'' +
                '}';
    }
}
