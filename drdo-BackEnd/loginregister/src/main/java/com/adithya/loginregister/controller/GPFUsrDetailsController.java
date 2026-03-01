package com.adithya.loginregister.controller;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
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

import com.adithya.loginregister.entity.GPF;
import com.adithya.loginregister.entity.GPFUsrDetails;
import com.adithya.loginregister.entity.GPFYears;
import com.adithya.loginregister.repository.GPFRepository;
import com.adithya.loginregister.repository.GPFUsrDetailsRepository;
import com.adithya.loginregister.repository.GPFYearsRepository;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/gpf-usr-details")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"}, allowCredentials = "true")
public class GPFUsrDetailsController {

    private final GPFUsrDetailsRepository gpfUsrDetailsRepository;
    private final GPFRepository gpfRepository;
    private final GPFYearsRepository gpfYearsRepository;

    @Autowired
    public GPFUsrDetailsController(GPFUsrDetailsRepository gpfUsrDetailsRepository,
                                   GPFRepository gpfRepository,
                                   GPFYearsRepository gpfYearsRepository) {
        this.gpfUsrDetailsRepository = gpfUsrDetailsRepository;
        this.gpfRepository = gpfRepository;
        this.gpfYearsRepository = gpfYearsRepository;
    }

    /**
     * Get all GPF user applications
     * GET /api/gpf-usr-details/all
     */
    @GetMapping("/all")
    public ResponseEntity<?> getAllApplications() {
        try {
            List<GPFUsrDetails> applications = gpfUsrDetailsRepository.findAllOrderByApplDateDesc();
            
            if (applications.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse("No GPF applications found"));
            }
            
            return ResponseEntity.ok(applications);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Error fetching applications: " + e.getMessage()));
        }
    }

    /**
     * Get application by ID
     * GET /api/gpf-usr-details/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getApplicationById(@PathVariable Long id) {
        try {
            return gpfUsrDetailsRepository.findById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse("Application with ID " + id + " not found")));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Error fetching application: " + e.getMessage()));
        }
    }

    /**
     * Get applications by personnel number
     * GET /api/gpf-usr-details/by-persno/{persno}
     */
    @GetMapping("/by-persno/{persno}")
    public ResponseEntity<?> getApplicationsByPersno(@PathVariable BigDecimal persno) {
        try {
            List<GPFUsrDetails> applications = gpfUsrDetailsRepository.findByPersno(persno);
            
            if (applications.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse("No applications found for personnel number: " + persno));
            }
            
            return ResponseEntity.ok(applications);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Error fetching applications: " + e.getMessage()));
        }
    }

    /**
     * Get applications by GPF type
     * GET /api/gpf-usr-details/by-type/{gpfType}
     */
    @GetMapping("/by-type/{gpfType}")
    public ResponseEntity<?> getApplicationsByType(@PathVariable String gpfType) {
        try {
            if (!gpfType.equals("F") && !gpfType.equals("E")) {
                return ResponseEntity.badRequest()
                    .body(new ErrorResponse("Invalid GPF type. Must be F or E"));
            }

            List<GPFUsrDetails> applications = gpfUsrDetailsRepository.findByGpfType(gpfType);
            
            if (applications.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse("No applications found for GPF type: " + gpfType));
            }
            
            return ResponseEntity.ok(applications);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Error fetching applications: " + e.getMessage()));
        }
    }

    /**
     * Get applications by date range
     * GET /api/gpf-usr-details/by-date-range?startDate=2024-01-01&endDate=2024-12-31
     */
    @GetMapping("/by-date-range")
    public ResponseEntity<?> getApplicationsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        try {
            List<GPFUsrDetails> applications = gpfUsrDetailsRepository.findByApplDateBetween(startDate, endDate);
            
            if (applications.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse("No applications found between " + startDate + " and " + endDate));
            }
            
            return ResponseEntity.ok(applications);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Error fetching applications: " + e.getMessage()));
        }
    }

    /**
     * Create new GPF application
     * POST /api/gpf-usr-details/create
     */
    @PostMapping("/create")
    public ResponseEntity<?> createApplication(@Valid @RequestBody GPFUsrDetails application) {
        try {
            // Validate required fields
            if (application.getApplAmt() == null) {
                return ResponseEntity.badRequest()
                    .body(new ErrorResponse("Application amount is required"));
            }

            if (application.getApplDate() == null) {
                return ResponseEntity.badRequest()
                    .body(new ErrorResponse("Application date is required"));
            }

            if (application.getPersno() == null) {
                return ResponseEntity.badRequest()
                    .body(new ErrorResponse("Personnel number is required"));
            }

            if (application.getPurpose() == null) {
                return ResponseEntity.badRequest()
                    .body(new ErrorResponse("Purpose is required"));
            }

            // Validate GPF type if provided
            if (application.getGpfType() != null && 
                !application.getGpfType().equals("F") && 
                !application.getGpfType().equals("E")) {
                return ResponseEntity.badRequest()
                    .body(new ErrorResponse("GPF type must be F or E"));
            }

            // Validate enclosers flag if provided
            if (application.getEnclosers() != null && 
                !application.getEnclosers().equals("Y") && 
                !application.getEnclosers().equals("N")) {
                return ResponseEntity.badRequest()
                    .body(new ErrorResponse("Enclosers must be Y or N"));
            }

            GPFUsrDetails savedApplication = gpfUsrDetailsRepository.save(application);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedApplication);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Error creating application: " + e.getMessage()));
        }
    }

    /**
     * Update existing GPF application
     * PUT /api/gpf-usr-details/update/{id}
     */
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateApplication(@PathVariable Long id, 
                                               @Valid @RequestBody GPFUsrDetails application) {
        try {
            return gpfUsrDetailsRepository.findById(id)
                .<ResponseEntity<?>>map(existingApp -> {
                    existingApp.setApplAmt(application.getApplAmt());
                    existingApp.setApplDate(application.getApplDate());
                    existingApp.setEnclosers(application.getEnclosers());
                    existingApp.setGpfType(application.getGpfType());
                    existingApp.setHouseAddr(application.getHouseAddr());
                    existingApp.setPersno(application.getPersno());
                    existingApp.setPurpose(application.getPurpose());
                    
                    GPFUsrDetails updated = gpfUsrDetailsRepository.save(existingApp);
                    return ResponseEntity.ok(updated);
                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse("Application with ID " + id + " not found")));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Error updating application: " + e.getMessage()));
        }
    }

    /**
     * Delete GPF application
     * DELETE /api/gpf-usr-details/delete/{id}
     */
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteApplication(@PathVariable Long id) {
        try {
            return gpfUsrDetailsRepository.findById(id)
                .<ResponseEntity<?>>map(application -> {
                    gpfUsrDetailsRepository.delete(application);
                    return ResponseEntity.ok()
                        .body(java.util.Map.of("message", "Application deleted successfully"));
                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse("Application with ID " + id + " not found")));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Error deleting application: " + e.getMessage()));
        }
    }

    /**
     * Get application with employee details and closing balance
     * GET /api/gpf-usr-details/with-balance/{persno}?year={year}
     */
    @GetMapping("/with-balance/{persno}")
    public ResponseEntity<?> getApplicationWithBalance(
            @PathVariable BigDecimal persno,
            @RequestParam(required = false) Integer year) {
        try {
            // Get employee details
            Optional<GPF> employeeOpt = gpfRepository.findByPersNumber(persno.toString());
            if (!employeeOpt.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse("Employee not found with Personnel Number: " + persno));
            }
            
            GPF employee = employeeOpt.get();

            // Get user applications
            List<GPFUsrDetails> applications = gpfUsrDetailsRepository.findByPersno(persno);

            // Get closing balance for the year
            BigDecimal closingBalance = BigDecimal.ZERO;
            if (year != null) {
                List<GPFYears> yearRecords = gpfYearsRepository.findByPassNumberOrderByGpfYearsDesc(persno.toString());
                for (GPFYears yearRecord : yearRecords) {
                    if (yearRecord.getGpfYears().intValue() == year) {
                        closingBalance = yearRecord.getClosingBalance();
                        break;
                    }
                }
            }

            // Build response
            java.util.Map<String, Object> response = new java.util.HashMap<>();
            response.put("employee", employee);
            response.put("applications", applications);
            response.put("closingBalance", closingBalance);
            response.put("year", year);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Error fetching details: " + e.getMessage()));
        }
    }

    /**
     * Get all applications with employee details and closing balance for a specific year
     * GET /api/gpf-usr-details/all-with-balance?year={year}&workStatus={OFFICER|INDUSTRIAL|NON_INDUSTRIAL}
     */
    @GetMapping("/all-with-balance")
    public ResponseEntity<?> getAllApplicationsWithBalance(
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) String workStatus) {
        try {
            List<GPFUsrDetails> allApplications = gpfUsrDetailsRepository.findAllOrderByApplDateDesc();
            
            if (allApplications.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse("No applications found"));
            }

            java.util.List<java.util.Map<String, Object>> results = new java.util.ArrayList<>();
            
            for (GPFUsrDetails application : allApplications) {
                String persno = application.getPersno().toString();
                
                // Get employee details
                Optional<GPF> employeeOpt = gpfRepository.findByPersNumber(persno);
                
                if (!employeeOpt.isPresent()) continue;
                
                GPF employee = employeeOpt.get();

                // Filter by work status if provided
                if (workStatus != null && !workStatus.isEmpty()) {
                    String designation = employee.getDesignation();
                    if (designation == null) continue;
                    
                    boolean matches = false;
                    if (workStatus.equals("OFFICER") && designation.toUpperCase().contains("OFFICER")) {
                        matches = true;
                    } else if (workStatus.equals("INDUSTRIAL") && designation.toUpperCase().contains("INDUSTRIAL")) {
                        matches = true;
                    } else if (workStatus.equals("NON_INDUSTRIAL") && 
                              (designation.toUpperCase().contains("NON") || 
                               designation.toUpperCase().contains("NON-INDUSTRIAL"))) {
                        matches = true;
                    }
                    
                    if (!matches) continue;
                }
                
                // Get closing balance
                BigDecimal closingBalance = BigDecimal.ZERO;
                if (year != null) {
                    List<GPFYears> yearRecords = gpfYearsRepository.findByPassNumberOrderByGpfYearsDesc(persno);
                    for (GPFYears yearRecord : yearRecords) {
                        if (yearRecord.getGpfYears().intValue() == year) {
                            closingBalance = yearRecord.getClosingBalance();
                            break;
                        }
                    }
                }
                
                java.util.Map<String, Object> record = new java.util.HashMap<>();
                record.put("application", application);
                record.put("employee", employee);
                record.put("closingBalance", closingBalance);
                record.put("year", year);
                
                results.add(record);
            }

            if (results.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse("No applications found matching the criteria"));
            }

            return ResponseEntity.ok(results);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Error fetching applications: " + e.getMessage()));
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
