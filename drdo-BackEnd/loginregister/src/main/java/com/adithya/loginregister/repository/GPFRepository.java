package com.adithya.loginregister.repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.adithya.loginregister.entity.GPF;

@Repository
public interface GPFRepository extends JpaRepository<GPF, BigDecimal> {

    /**
     * Search GPF records by Account Number, Personnel Number, or Employee Name
     * @param searchTerm the search term to match
     * @return list of matching GPF records
     */
    @Query("SELECT g FROM GPF g WHERE " +
           "CAST(g.gpfAccountNumber AS string) LIKE CONCAT('%', :searchTerm, '%') OR " +
           "LOWER(g.persNumber) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(g.employeeName) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<GPF> searchByAccountOrPersNumber(@Param("searchTerm") String searchTerm);

    /**
     * Find GPF record by exact Account Number
     * @param accountNumber the GPF account number
     * @return Optional GPF record
     */
    Optional<GPF> findByGpfAccountNumber(BigDecimal accountNumber);

    /**
     * Find GPF record by Personnel Number
     * @param persNumber the personnel number
     * @return Optional GPF record
     */
    Optional<GPF> findByPersNumber(String persNumber);
}
