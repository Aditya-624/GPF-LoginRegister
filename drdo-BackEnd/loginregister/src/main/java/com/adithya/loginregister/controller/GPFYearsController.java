package com.adithya.loginregister.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.adithya.loginregister.entity.GPF;
import com.adithya.loginregister.entity.GPFYears;
import com.adithya.loginregister.repository.GPFRepository;
import com.adithya.loginregister.repository.GPFYearsRepository;

@RestController
@RequestMapping("/api/gpf-years")
@CrossOrigin(origins = {"http://localhost:*"}, allowedHeaders = "*", allowCredentials = "true")
public class GPFYearsController {

    private final GPFYearsRepository gpfYearsRepository;
    private final GPFRepository gpfRepository;

    @Autowired
    public GPFYearsController(GPFYearsRepository gpfYearsRepository, GPFRepository gpfRepository) {
        this.gpfYearsRepository = gpfYearsRepository;
        this.gpfRepository = gpfRepository;
    }

    /**
     * Get GPF Years records by person number
     * GET /api/gpf-years/person/{persNumber}
     */
    @GetMapping("/person/{persNumber}")
    public ResponseEntity<?> getByPersonNumber(@PathVariable String persNumber) {
        try {
            List<GPFYears> records = gpfYearsRepository.findByPassNumberOrderByGpfYearsDesc(persNumber);
            return ResponseEntity.ok(records);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Error fetching GPF Years: " + e.getMessage()));
        }
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
            
            // Return empty array instead of 404 — frontend handles empty gracefully
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
     * Save or Update GPF Year closing balance
     * POST /api/gpf-years/save
     */
    @PostMapping("/save")
    public ResponseEntity<?> saveGPFYear(@RequestBody GPFYears gpfYear) {
        try {
            // Validate required fields
            if (gpfYear.getPassNumber() == null || gpfYear.getPassNumber().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(new ErrorResponse("Pass Number is required"));
            }

            if (gpfYear.getGpfYears() == null) {
                return ResponseEntity.badRequest()
                    .body(new ErrorResponse("GPF Year is required"));
            }

            if (gpfYear.getClosingBalance() == null) {
                return ResponseEntity.badRequest()
                    .body(new ErrorResponse("Closing Balance is required"));
            }

            // Validate year is not in the future
            int currentYear = java.time.Year.now().getValue();
            int inputYear = gpfYear.getGpfYears().intValue();
            if (inputYear > currentYear) {
                return ResponseEntity.badRequest()
                    .body(new ErrorResponse("Year cannot be in the future. Current year is " + currentYear));
            }

            // Validate closing balance is positive
            if (gpfYear.getClosingBalance().compareTo(java.math.BigDecimal.ZERO) <= 0) {
                return ResponseEntity.badRequest()
                    .body(new ErrorResponse("Closing Balance must be a positive value"));
            }

            // Check for duplicate year entry
            if (gpfYearsRepository.existsByPassNumberAndGpfYears(
                    gpfYear.getPassNumber(), gpfYear.getGpfYears())) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new ErrorResponse(
                        "A record for year " + gpfYear.getGpfYears() + 
                        " already exists for account " + gpfYear.getPassNumber()));
            }

            // Save new record
            GPFYears savedRecord = gpfYearsRepository.save(gpfYear);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedRecord);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Error saving GPF Year: " + e.getMessage()));
        }
    }

    /**
     * Get employees by work status with closing balance for a specific year
     * GET /api/gpf-years/by-work-status?workStatus={OFFICER|INDUSTRIAL|NON_INDUSTRIAL}&year={year}
     */
    @GetMapping("/by-work-status")
    public ResponseEntity<?> getEmployeesByWorkStatus(
            @RequestParam String workStatus,
            @RequestParam int year) {
        try {
            // Validate work status
            if (!workStatus.equals("OFFICER") && !workStatus.equals("INDUSTRIAL") && !workStatus.equals("NON_INDUSTRIAL")) {
                return ResponseEntity.badRequest()
                    .body(new ErrorResponse("Invalid work status. Must be OFFICER, INDUSTRIAL, or NON_INDUSTRIAL"));
            }

            // Get all GPF employees
            List<GPF> allEmployees = gpfRepository.findAll();
            
            // Filter by designation (work status)
            List<Map<String, Object>> results = new ArrayList<>();
            int sno = 1;
            
            for (GPF employee : allEmployees) {
                String designation = employee.getDesignation();
                if (designation == null) continue;
                
                // Match work status with designation
                // Designations: 'Senior Officer', 'Officer Grade II', 'Industrial Worker Grade A/B',
                //               'Contractual Staff', 'Temporary Staff' etc.
                boolean matches = false;
                String desigUpper = designation.toUpperCase();
                if (workStatus.equals("OFFICER") && desigUpper.contains("OFFICER")) {
                    matches = true;
                } else if (workStatus.equals("INDUSTRIAL") &&
                           desigUpper.contains("INDUSTRIAL") && !desigUpper.contains("NON")) {
                    matches = true;
                } else if (workStatus.equals("NON_INDUSTRIAL") &&
                           (desigUpper.contains("NON") || desigUpper.contains("STAFF") ||
                            desigUpper.contains("CONTRACTUAL") || desigUpper.contains("TEMPORARY"))) {
                    matches = true;
                }
                
                if (matches) {
                    // Get closing balance for this employee and year
                    // PASS_NUMBER may be stored as 'OFF001-Y1', 'OFF001-Y2' etc.
                    // so we use the LIKE search to find all records for this persNumber
                    String passNumber = employee.getPersNumber();
                    if (passNumber != null) {
                        List<GPFYears> yearRecords = gpfYearsRepository.searchByPassNumber(passNumber);
                        
                        // Find the record for the specific year
                        java.math.BigDecimal closingBalance = java.math.BigDecimal.ZERO;
                        for (GPFYears yearRecord : yearRecords) {
                            if (yearRecord.getGpfYears() != null &&
                                yearRecord.getGpfYears().intValue() == year) {
                                closingBalance = yearRecord.getClosingBalance();
                                break;
                            }
                        }
                        // If no exact year match, use the latest available
                        if (closingBalance.compareTo(java.math.BigDecimal.ZERO) == 0 && !yearRecords.isEmpty()) {
                            closingBalance = yearRecords.get(0).getClosingBalance();
                        }
                        
                        Map<String, Object> employeeData = new HashMap<>();
                        employeeData.put("sno", sno++);
                        employeeData.put("persNumber", employee.getPersNumber());
                        employeeData.put("name", employee.getEmployeeName());
                        employeeData.put("designation", employee.getDesignation());
                        employeeData.put("gpfAccountNumber", employee.getGpfAccountNumber());
                        employeeData.put("closingBalance", closingBalance);
                        employeeData.put("year", year);
                        
                        results.add(employeeData);
                    }
                }
            }
            
            if (results.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse("No employees found for work status: " + workStatus + " in year " + year));
            }
            
            return ResponseEntity.ok(results);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Error fetching employees: " + e.getMessage()));
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
