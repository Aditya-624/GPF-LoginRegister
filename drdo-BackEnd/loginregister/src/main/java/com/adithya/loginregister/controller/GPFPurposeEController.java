package com.adithya.loginregister.controller;

import java.math.BigDecimal;
import java.util.List;

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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.adithya.loginregister.entity.GPFPurposeE;
import com.adithya.loginregister.repository.GPFPurposeERepository;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/gpf-purpose-e")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"}, allowCredentials = "true")
public class GPFPurposeEController {

    private final GPFPurposeERepository gpfPurposeERepository;

    @Autowired
    public GPFPurposeEController(GPFPurposeERepository gpfPurposeERepository) {
        this.gpfPurposeERepository = gpfPurposeERepository;
    }

    /**
     * Get all GPF Purposes (E category)
     * GET /api/gpf-purpose-e/all
     */
    @GetMapping("/all")
    public ResponseEntity<?> getAllPurposes() {
        try {
            List<GPFPurposeE> purposes = gpfPurposeERepository.findAllOrderByCode();
            
            if (purposes.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse("No GPF purposes (E category) found"));
            }
            
            return ResponseEntity.ok(purposes);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Error fetching GPF purposes: " + e.getMessage()));
        }
    }

    /**
     * Get GPF Purpose by code
     * GET /api/gpf-purpose-e/{code}
     */
    @GetMapping("/{code}")
    public ResponseEntity<?> getPurposeByCode(@PathVariable BigDecimal code) {
        try {
            return gpfPurposeERepository.findByCode(code)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse("GPF Purpose (E) with code " + code + " not found")));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Error fetching GPF purpose: " + e.getMessage()));
        }
    }

    /**
     * Search GPF Purposes by purpose name
     * GET /api/gpf-purpose-e/search?query={searchTerm}
     */
    @GetMapping("/search")
    public ResponseEntity<?> searchPurposes(@RequestParam(required = false) String query) {
        try {
            if (query == null || query.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(new ErrorResponse("Search query cannot be empty"));
            }

            List<GPFPurposeE> results = gpfPurposeERepository.findByPurposeContainingIgnoreCase(query.trim());
            
            if (results.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse("No GPF purposes (E) found matching: " + query));
            }

            return ResponseEntity.ok(results);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Error searching GPF purposes: " + e.getMessage()));
        }
    }

    /**
     * Create new GPF Purpose
     * POST /api/gpf-purpose-e/create
     */
    @PostMapping("/create")
    public ResponseEntity<?> createPurpose(@Valid @RequestBody GPFPurposeE gpfPurpose) {
        try {
            // Check if code already exists
            if (gpfPurposeERepository.findByCode(gpfPurpose.getCode()).isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new ErrorResponse("GPF Purpose (E) with code " + gpfPurpose.getCode() + " already exists"));
            }

            // Validate required fields
            if (gpfPurpose.getCode() == null) {
                return ResponseEntity.badRequest()
                    .body(new ErrorResponse("Code is required"));
            }

            GPFPurposeE savedPurpose = gpfPurposeERepository.save(gpfPurpose);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedPurpose);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Error creating GPF purpose: " + e.getMessage()));
        }
    }

    /**
     * Update existing GPF Purpose
     * PUT /api/gpf-purpose-e/update/{code}
     */
    @PutMapping("/update/{code}")
    public ResponseEntity<?> updatePurpose(@PathVariable BigDecimal code, 
                                          @Valid @RequestBody GPFPurposeE gpfPurpose) {
        try {
            return gpfPurposeERepository.findByCode(code)
                .<ResponseEntity<?>>map(existingPurpose -> {
                    existingPurpose.setPurpose(gpfPurpose.getPurpose());
                    existingPurpose.setPercentage(gpfPurpose.getPercentage());
                    existingPurpose.setRule(gpfPurpose.getRule());
                    GPFPurposeE updated = gpfPurposeERepository.save(existingPurpose);
                    return ResponseEntity.ok(updated);
                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse("GPF Purpose (E) with code " + code + " not found")));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Error updating GPF purpose: " + e.getMessage()));
        }
    }

    /**
     * Delete GPF Purpose
     * DELETE /api/gpf-purpose-e/delete/{code}
     */
    @DeleteMapping("/delete/{code}")
    public ResponseEntity<?> deletePurpose(@PathVariable BigDecimal code) {
        try {
            return gpfPurposeERepository.findByCode(code)
                .<ResponseEntity<?>>map(purpose -> {
                    gpfPurposeERepository.delete(purpose);
                    return ResponseEntity.ok()
                        .body(java.util.Map.of("message", "GPF Purpose (E) deleted successfully"));
                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse("GPF Purpose (E) with code " + code + " not found")));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Error deleting GPF purpose: " + e.getMessage()));
        }
    }

    /**
     * Error response class for consistent error handling
     */
    private static class ErrorResponse {
        private String message;
        private long timestamp;

        public ErrorResponse(String message) {
            this.message = message;
            this.timestamp = System.currentTimeMillis();
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }

        public long getTimestamp() {
            return timestamp;
        }

        public void setTimestamp(long timestamp) {
            this.timestamp = timestamp;
        }
    }
}
