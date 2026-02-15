package com.adithya.loginregister.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.adithya.loginregister.entity.GPFYears;
import com.adithya.loginregister.repository.GPFYearsRepository;

@RestController
@RequestMapping("/api/gpf-years")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"}, allowCredentials = "true")
public class GPFYearsController {

    private final GPFYearsRepository gpfYearsRepository;

    @Autowired
    public GPFYearsController(GPFYearsRepository gpfYearsRepository) {
        this.gpfYearsRepository = gpfYearsRepository;
    }

    /**
     * Search GPF Years by Pass Number
     * GET /api/gpf-years/search?query={searchTerm}
     */
    @GetMapping("/search")
    public ResponseEntity<?> searchGPFYears(@RequestParam(required = false) String query) {
        try {
            if (query == null || query.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(new ErrorResponse("Search query cannot be empty"));
            }

            List<GPFYears> results = gpfYearsRepository.searchByPassNumber(query.trim());
            
            if (results.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse("No GPF Years records found matching: " + query));
            }

            return ResponseEntity.ok(results);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Error searching GPF Years: " + e.getMessage()));
        }
    }

    /**
     * Get all GPF Years records
     * GET /api/gpf-years/all
     */
    @GetMapping("/all")
    public ResponseEntity<?> getAllGPFYears() {
        try {
            List<GPFYears> records = gpfYearsRepository.findAll();
            
            if (records.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse("No GPF Years records found in the system"));
            }

            return ResponseEntity.ok(records);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Error fetching GPF Years: " + e.getMessage()));
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
