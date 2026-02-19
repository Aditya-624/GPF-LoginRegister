package com.adithya.loginregister.repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.adithya.loginregister.entity.GPFYears;

@Repository
public interface GPFYearsRepository extends JpaRepository<GPFYears, Long> {

    /**
     * Find all records for a specific pass number, sorted by year descending
     * @param passNumber the pass number
     * @return list of GPF Years records sorted by year (newest first)
     */
    List<GPFYears> findByPassNumberOrderByGpfYearsDesc(String passNumber);

    /**
     * Check if a record exists for specific pass number and year
     * @param passNumber the pass number
     * @param gpfYears the year
     * @return true if record exists, false otherwise
     */
    @Query("SELECT CASE WHEN COUNT(g) > 0 THEN true ELSE false END FROM GPFYears g WHERE g.passNumber = :passNumber AND g.gpfYears = :gpfYears")
    boolean existsByPassNumberAndGpfYears(@Param("passNumber") String passNumber, @Param("gpfYears") BigDecimal gpfYears);

    /**
     * Find specific record by pass number and year
     * @param passNumber the pass number
     * @param gpfYears the year
     * @return Optional containing the record if found
     */
    @Query("SELECT g FROM GPFYears g WHERE g.passNumber = :passNumber AND g.gpfYears = :gpfYears")
    Optional<GPFYears> findByPassNumberAndGpfYears(@Param("passNumber") String passNumber, @Param("gpfYears") BigDecimal gpfYears);

    /**
     * Search GPF Years records by Pass Number
     * @param searchTerm the search term to match against pass number
     * @return list of matching GPF Years records sorted by pass number and year descending
     */
    @Query("SELECT g FROM GPFYears g WHERE " +
           "LOWER(g.passNumber) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
           "ORDER BY g.passNumber, g.gpfYears DESC")
    List<GPFYears> searchByPassNumber(@Param("searchTerm") String searchTerm);

    /**
     * Find GPF Years record by exact Pass Number (deprecated - use findByPassNumberOrderByGpfYearsDesc instead)
     * @param passNumber the pass number
     * @return first GPFYears record if found (for backward compatibility)
     * @deprecated Use findByPassNumberOrderByGpfYearsDesc to get all records for an account
     */
    @Deprecated
    default GPFYears findByPassNumber(String passNumber) {
        List<GPFYears> records = findByPassNumberOrderByGpfYearsDesc(passNumber);
        return records.isEmpty() ? null : records.get(0);
    }
}
