package com.adithya.loginregister.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.adithya.loginregister.entity.GPFSanctionDetails;
import com.adithya.loginregister.repository.GPFSanctionDetailsRepository;

@RestController
@RequestMapping("/api/gpf-sanction-details")
@CrossOrigin(origins = {"http://localhost:*"}, allowedHeaders = "*", allowCredentials = "true")
public class GPFSanctionDetailsController {

    @Autowired
    private GPFSanctionDetailsRepository gpfSanctionDetailsRepository;

    @GetMapping
    public ResponseEntity<List<GPFSanctionDetails>> getAllSanctionDetails() {
        List<GPFSanctionDetails> details = gpfSanctionDetailsRepository.findAll();
        return ResponseEntity.ok(details);
    }

    @GetMapping("/{id}")
    public ResponseEntity<GPFSanctionDetails> getSanctionDetailsById(@PathVariable Long id) {
        Optional<GPFSanctionDetails> details = gpfSanctionDetailsRepository.findById(id);
        return details.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/pers-no/{persNo}")
    public ResponseEntity<List<GPFSanctionDetails>> getSanctionDetailsByPersNo(@PathVariable String persNo) {
        List<GPFSanctionDetails> details = gpfSanctionDetailsRepository.findByPersNo(persNo);
        return ResponseEntity.ok(details);
    }

    @GetMapping("/loan-type/{loanType}")
    public ResponseEntity<List<GPFSanctionDetails>> getSanctionDetailsByLoanType(@PathVariable String loanType) {
        List<GPFSanctionDetails> details = gpfSanctionDetailsRepository.findByGpfLoanType(loanType);
        return ResponseEntity.ok(details);
    }

    @PostMapping
    public ResponseEntity<?> createSanctionDetails(@RequestBody GPFSanctionDetails sanctionDetails) {
        try {
            GPFSanctionDetails saved = gpfSanctionDetailsRepository.save(sanctionDetails);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(java.util.Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<GPFSanctionDetails> updateSanctionDetails(
            @PathVariable Long id,
            @RequestBody GPFSanctionDetails sanctionDetails) {
        Optional<GPFSanctionDetails> existing = gpfSanctionDetailsRepository.findById(id);
        if (existing.isPresent()) {
            sanctionDetails.setId(id);
            GPFSanctionDetails updated = gpfSanctionDetailsRepository.save(sanctionDetails);
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSanctionDetails(@PathVariable Long id) {
        if (gpfSanctionDetailsRepository.existsById(id)) {
            gpfSanctionDetailsRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
