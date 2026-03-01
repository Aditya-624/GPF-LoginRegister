package com.adithya.loginregister.repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.adithya.loginregister.entity.GPFUsrDetails;

@Repository
public interface GPFUsrDetailsRepository extends JpaRepository<GPFUsrDetails, Long> {

    /**
     * Find all applications by personnel number
     * @param persno personnel number
     * @return list of GPFUsrDetails
     */
    List<GPFUsrDetails> findByPersno(BigDecimal persno);

    /**
     * Find applications by GPF type
     * @param gpfType GPF type (F or E)
     * @return list of GPFUsrDetails
     */
    List<GPFUsrDetails> findByGpfType(String gpfType);

    /**
     * Find applications by purpose code
     * @param purpose purpose code
     * @return list of GPFUsrDetails
     */
    List<GPFUsrDetails> findByPurpose(BigDecimal purpose);

    /**
     * Find applications by date range
     * @param startDate start date
     * @param endDate end date
     * @return list of GPFUsrDetails
     */
    @Query("SELECT g FROM GPFUsrDetails g WHERE g.applDate BETWEEN :startDate AND :endDate ORDER BY g.applDate DESC")
    List<GPFUsrDetails> findByApplDateBetween(@Param("startDate") LocalDate startDate, 
                                               @Param("endDate") LocalDate endDate);

    /**
     * Find applications by personnel number and GPF type
     * @param persno personnel number
     * @param gpfType GPF type
     * @return list of GPFUsrDetails
     */
    @Query("SELECT g FROM GPFUsrDetails g WHERE g.persno = :persno AND g.gpfType = :gpfType ORDER BY g.applDate DESC")
    List<GPFUsrDetails> findByPersnoAndGpfType(@Param("persno") BigDecimal persno, 
                                                @Param("gpfType") String gpfType);

    /**
     * Find applications with enclosers
     * @param enclosers Y or N
     * @return list of GPFUsrDetails
     */
    List<GPFUsrDetails> findByEnclosers(String enclosers);

    /**
     * Get all applications ordered by date (newest first)
     * @return list of all GPFUsrDetails
     */
    @Query("SELECT g FROM GPFUsrDetails g ORDER BY g.applDate DESC")
    List<GPFUsrDetails> findAllOrderByApplDateDesc();

    /**
     * Find applications by amount range
     * @param minAmount minimum amount
     * @param maxAmount maximum amount
     * @return list of GPFUsrDetails
     */
    @Query("SELECT g FROM GPFUsrDetails g WHERE g.applAmt BETWEEN :minAmount AND :maxAmount ORDER BY g.applAmt DESC")
    List<GPFUsrDetails> findByApplAmtBetween(@Param("minAmount") BigDecimal minAmount, 
                                              @Param("maxAmount") BigDecimal maxAmount);
}
