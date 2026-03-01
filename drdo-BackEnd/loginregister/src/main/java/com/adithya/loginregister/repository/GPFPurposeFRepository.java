package com.adithya.loginregister.repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.adithya.loginregister.entity.GPFPurposeF;

@Repository
public interface GPFPurposeFRepository extends JpaRepository<GPFPurposeF, BigDecimal> {

    /**
     * Find GPF Purpose by code
     * @param code the purpose code
     * @return Optional GPFPurposeF
     */
    Optional<GPFPurposeF> findByCode(BigDecimal code);

    /**
     * Find GPF Purposes by purpose name (case-insensitive partial match)
     * @param purpose the purpose name to search
     * @return list of matching GPFPurposeF records
     */
    @Query("SELECT g FROM GPFPurposeF g WHERE LOWER(g.purpose) LIKE LOWER(CONCAT('%', :purpose, '%'))")
    List<GPFPurposeF> findByPurposeContainingIgnoreCase(@Param("purpose") String purpose);

    /**
     * Find GPF Purposes by rule
     * @param rule the rule name
     * @return list of matching GPFPurposeF records
     */
    @Query("SELECT g FROM GPFPurposeF g WHERE LOWER(g.rule) LIKE LOWER(CONCAT('%', :rule, '%'))")
    List<GPFPurposeF> findByRuleContainingIgnoreCase(@Param("rule") String rule);

    /**
     * Find GPF Purposes by percentage range
     * @param minPercentage minimum percentage
     * @param maxPercentage maximum percentage
     * @return list of matching GPFPurposeF records
     */
    @Query("SELECT g FROM GPFPurposeF g WHERE g.percentage BETWEEN :minPercentage AND :maxPercentage")
    List<GPFPurposeF> findByPercentageRange(@Param("minPercentage") BigDecimal minPercentage, 
                                            @Param("maxPercentage") BigDecimal maxPercentage);

    /**
     * Get all purposes ordered by code
     * @return list of all GPFPurposeF records ordered by code
     */
    @Query("SELECT g FROM GPFPurposeF g ORDER BY g.code")
    List<GPFPurposeF> findAllOrderByCode();
}
