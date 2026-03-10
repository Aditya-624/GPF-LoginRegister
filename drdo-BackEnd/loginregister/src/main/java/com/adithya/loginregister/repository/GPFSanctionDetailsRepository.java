package com.adithya.loginregister.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.adithya.loginregister.entity.GPFSanctionDetails;

@Repository
public interface GPFSanctionDetailsRepository extends JpaRepository<GPFSanctionDetails, Long> {
    List<GPFSanctionDetails> findByPersNo(String persNo);
    Optional<GPFSanctionDetails> findByPersNoAndId(String persNo, Long id);
    List<GPFSanctionDetails> findByGpfLoanType(String gpfLoanType);
}
