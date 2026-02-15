package com.adithya.loginregister.controller;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.adithya.loginregister.entity.GPF;
import com.adithya.loginregister.repository.GPFRepository;

@RestController
@RequestMapping("/api/gpf")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"}, allowCredentials = "true")
public class GPFController {

    private final GPFRepository gpfRepository;

    @Autowired
    public GPFController(GPFRepository gpfRepository) {
        this.gpfRepository = gpfRepository;
    }

    /**
     * Search GPF records by Account Number or Personnel Number
     * GET /api/gpf/search?query={searchTerm}
     */
    @GetMapping("/search")
    public ResponseEntity<?> searchGPF(@RequestParam(required = false) String query) {
        try {
            if (query == null || query.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(new ErrorResponse("Search query cannot be empty"));
            }

            List<GPF> results = gpfRepository.searchByAccountOrPersNumber(query.trim());
            
            if (results.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse("No GPF account found matching: " + query));
            }

            return ResponseEntity.ok(results);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Error searching GPF: " + e.getMessage()));
        }
    }

    /**
     * Get GPF record by Account Number
     * GET /api/gpf/account/{accountNumber}
     */
    @GetMapping("/account/{accountNumber}")
    public ResponseEntity<?> getByAccountNumber(@PathVariable String accountNumber) {
        try {
            BigDecimal accNum = new BigDecimal(accountNumber);
            Optional<GPF> gpf = gpfRepository.findByGpfAccountNumber(accNum);
            
            if (gpf.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse("GPF account not found: " + accountNumber));
            }

            return ResponseEntity.ok(gpf.get());
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest()
                .body(new ErrorResponse("Invalid account number format"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Error fetching GPF account: " + e.getMessage()));
        }
    }

    /**
     * Get all GPF records
     * GET /api/gpf/all
     */
    @GetMapping("/all")
    public ResponseEntity<?> getAllGPF() {
        try {
            List<GPF> records = gpfRepository.findAll();
            
            if (records.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse("No GPF records found in the system"));
            }

            return ResponseEntity.ok(records);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Error fetching GPF records: " + e.getMessage()));
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
