package com.adithya.loginregister.controller;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.adithya.loginregister.entity.GPF;
import com.adithya.loginregister.entity.GPFUsrDetails;
import com.adithya.loginregister.entity.GPFYears;
import com.adithya.loginregister.entity.GpfSubDetails;
import com.adithya.loginregister.repository.GPFRepository;
import com.adithya.loginregister.repository.GPFUsrDetailsRepository;
import com.adithya.loginregister.repository.GPFYearsRepository;
import com.adithya.loginregister.repository.GpfSubDetailsRepository;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = {"http://localhost:*"}, allowedHeaders = "*", allowCredentials = "true")
public class ReportsController {

    private final GPFRepository gpfRepository;
    private final GPFYearsRepository gpfYearsRepository;
    private final GPFUsrDetailsRepository gpfUsrDetailsRepository;
    private final GpfSubDetailsRepository gpfSubDetailsRepository;

    @Autowired
    public ReportsController(GPFRepository gpfRepository,
                             GPFYearsRepository gpfYearsRepository,
                             GPFUsrDetailsRepository gpfUsrDetailsRepository,
                             GpfSubDetailsRepository gpfSubDetailsRepository) {
        this.gpfRepository = gpfRepository;
        this.gpfYearsRepository = gpfYearsRepository;
        this.gpfUsrDetailsRepository = gpfUsrDetailsRepository;
        this.gpfSubDetailsRepository = gpfSubDetailsRepository;
    }

    /**
     * GET /api/reports/summary
     * Returns all GPF users with their details, latest closing balance, year, and purpose type.
     */
    @GetMapping("/summary")
    public ResponseEntity<?> getReportSummary() {
        try {
            List<GPF> allEmployees = gpfRepository.findAll();

            if (allEmployees.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "No GPF records found"));
            }

            List<Map<String, Object>> results = new ArrayList<>();

            for (GPF emp : allEmployees) {
                String persNumber = emp.getPersNumber();
                if (persNumber == null) continue;

                Map<String, Object> row = new HashMap<>();
                row.put("persNumber", persNumber);
                row.put("name", emp.getEmployeeName());
                row.put("designation", emp.getDesignation());
                row.put("dob", emp.getDob());
                row.put("gpfAccountNumber", emp.getGpfAccountNumber());
                row.put("phoneNumber", emp.getPhoneNumber());

                // Latest closing balance and year from GPF_YEARS
                List<GPFYears> yearRecords = gpfYearsRepository.findByPassNumberOrderByGpfYearsDesc(persNumber);
                if (!yearRecords.isEmpty()) {
                    GPFYears latest = yearRecords.get(0);
                    row.put("closingBalance", latest.getClosingBalance());
                    row.put("gpfYear", latest.getGpfYears());
                } else {
                    row.put("closingBalance", BigDecimal.ZERO);
                    row.put("gpfYear", null);
                }

                // Purpose type from GPF_USR_DETAILS (latest application)
                try {
                    BigDecimal persno = new BigDecimal(persNumber);
                    List<GPFUsrDetails> usrDetails = gpfUsrDetailsRepository.findByPersno(persno);
                    if (!usrDetails.isEmpty()) {
                        GPFUsrDetails latest = usrDetails.get(0);
                        row.put("purpose", latest.getPurpose());
                        row.put("gpfType", latest.getGpfType());
                        row.put("applDate", latest.getApplDate());
                        row.put("applAmt", latest.getApplAmt());
                    } else {
                        row.put("purpose", null);
                        row.put("gpfType", null);
                        row.put("applDate", null);
                        row.put("applAmt", null);
                    }
                } catch (NumberFormatException e) {
                    row.put("purpose", null);
                    row.put("gpfType", null);
                    row.put("applDate", null);
                    row.put("applAmt", null);
                }

                // Subscription info from GPF_SUB_DETAILS (latest)
                List<GpfSubDetails> subDetails = gpfSubDetailsRepository.findByPersNumber(persNumber);
                if (!subDetails.isEmpty()) {
                    GpfSubDetails latestSub = subDetails.get(subDetails.size() - 1);
                    row.put("gpfSub", latestSub.getGpfSub());
                    row.put("gpfRet", latestSub.getGpfRet());
                } else {
                    row.put("gpfSub", null);
                    row.put("gpfRet", null);
                }

                results.add(row);
            }

            return ResponseEntity.ok(results);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error generating report: " + e.getMessage()));
        }
    }
}
