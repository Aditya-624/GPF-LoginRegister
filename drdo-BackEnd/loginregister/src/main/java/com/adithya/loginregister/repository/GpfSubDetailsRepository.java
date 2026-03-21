package com.adithya.loginregister.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.adithya.loginregister.entity.GpfSubDetails;

@Repository
public interface GpfSubDetailsRepository extends JpaRepository<GpfSubDetails, Long> {
    List<GpfSubDetails> findByPersNumber(String persNumber);
}
