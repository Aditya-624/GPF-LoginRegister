package com.adithya.loginregister.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.adithya.loginregister.entity.GPFYears;

@Repository
public interface GPFYearsRepository extends JpaRepository<GPFYears, String> {

    /**
     * Search GPF Years records by Pass Number
     * @param searchTerm the search term to match against pass number
     * @return list of matching GPF Years records
     */
    @Query("SELECT g FROM GPFYears g WHERE " +
           "LOWER(g.passNumber) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<GPFYears> searchByPassNumber(@Param("searchTerm") String searchTerm);

    /**
     * Find GPF Years record by exact Pass Number
     * @param passNumber the pass number
     * @return GPFYears record if found
     */
    GPFYears findByPassNumber(String passNumber);
}
