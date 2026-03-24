package com.adithya.loginregister.controller;

import java.math.BigDecimal;
import java.math.RoundingMode;
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
import com.adithya.loginregister.repository.UserRepository;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = {"http://localhost:*"}, allowedHeaders = "*", allowCredentials = "true")
public class ReportsController {

    private final GPFRepository gpfRepository;
    private final GPFYearsRepository gpfYearsRepository;
    private final GPFUsrDetailsRepository gpfUsrDetailsRepository;
    private final GpfSubDetailsRepository gpfSubDetailsRepository;
    private final UserRepository userRepository;

    @Autowired
    public ReportsController(GPFRepository gpfRepository,
                             GPFYearsRepository gpfYearsRepository,
                             GPFUsrDetailsRepository gpfUsrDetailsRepository,
                             GpfSubDetailsRepository gpfSubDetailsRepository,
                             UserRepository userRepository) {
        this.gpfRepository = gpfRepository;
        this.gpfYearsRepository = gpfYearsRepository;
        this.gpfUsrDetailsRepository = gpfUsrDetailsRepository;
        this.gpfSubDetailsRepository = gpfSubDetailsRepository;
        this.userRepository = userRepository;
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
                row.put("dateOfRetirement", emp.getDateOfRetirement());
                row.put("serviceDate", emp.getServiceDate());

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
                // PERSNO in GPF_USR_DETAILS is the numeric users.id, not the string persNumber
                BigDecimal numericId = resolveNumericId(persNumber);
                if (numericId != null) {
                    List<GPFUsrDetails> usrDetails = gpfUsrDetailsRepository.findByPersno(numericId);
                    if (!usrDetails.isEmpty()) {
                        GPFUsrDetails latest = usrDetails.get(0);
                        row.put("purpose", latest.getPurpose());
                        row.put("gpfType", latest.getGpfType());
                        row.put("applDate", latest.getApplDate());
                        row.put("applAmt", latest.getApplAmt());
                        row.put("address", latest.getHouseAddr());
                    } else {
                        row.put("purpose", null);
                        row.put("gpfType", null);
                        row.put("applDate", null);
                        row.put("applAmt", null);
                        row.put("address", null);
                    }
                } else {
                    row.put("purpose", null);
                    row.put("gpfType", null);
                    row.put("applDate", null);
                    row.put("applAmt", null);
                    row.put("address", null);
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

    /**
     * GET /api/reports/calculation-sheet/{persNumber}
     * Returns full calculation sheet data: employee info, all year-wise closing balances,
     * all subscription records, and application details.
     */
    @GetMapping("/calculation-sheet/{persNumber}")
    public ResponseEntity<?> getCalculationSheet(@PathVariable String persNumber) {
        try {
            // Employee info
            List<GPF> employees = gpfRepository.findAll();
            GPF emp = employees.stream()
                    .filter(e -> persNumber.equals(e.getPersNumber()))
                    .findFirst().orElse(null);

            if (emp == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "Employee not found: " + persNumber));
            }

            Map<String, Object> result = new HashMap<>();
            result.put("persNumber", emp.getPersNumber());
            result.put("name", emp.getEmployeeName());
            result.put("designation", emp.getDesignation());
            result.put("dob", emp.getDob());
            result.put("gpfAccountNumber", emp.getGpfAccountNumber());
            result.put("basicPay", emp.getBasicPay());
            result.put("dateOfRetirement", emp.getDateOfRetirement());

            // All year records (sorted desc)
            List<GPFYears> yearRecords = gpfYearsRepository.findByPassNumberOrderByGpfYearsDesc(persNumber);
            List<Map<String, Object>> years = new ArrayList<>();
            for (GPFYears yr : yearRecords) {
                Map<String, Object> y = new HashMap<>();
                y.put("year", yr.getGpfYears());
                y.put("closingBalance", yr.getClosingBalance());
                years.add(y);
            }
            result.put("yearRecords", years);

            // Opening balance = oldest year's closing balance (or 0)
            BigDecimal openingBalance = BigDecimal.ZERO;
            if (!yearRecords.isEmpty()) {
                openingBalance = yearRecords.get(yearRecords.size() - 1).getClosingBalance();
            }
            result.put("openingBalance", openingBalance);

            // Latest closing balance
            BigDecimal latestClosing = yearRecords.isEmpty() ? BigDecimal.ZERO : yearRecords.get(0).getClosingBalance();
            result.put("closingBalance", latestClosing);
            result.put("gpfYear", yearRecords.isEmpty() ? null : yearRecords.get(0).getGpfYears());

            // All subscription records
            List<GpfSubDetails> subList = gpfSubDetailsRepository.findByPersNumber(persNumber);
            List<Map<String, Object>> subs = new ArrayList<>();
            BigDecimal totalSub = BigDecimal.ZERO;
            BigDecimal totalRet = BigDecimal.ZERO;
            for (GpfSubDetails s : subList) {
                Map<String, Object> sub = new HashMap<>();
                sub.put("date", s.getAddSubDate());
                sub.put("gpfSub", s.getGpfSub());
                sub.put("gpfRet", s.getGpfRet());
                subs.add(sub);
                totalSub = totalSub.add(s.getGpfSub() != null ? s.getGpfSub() : BigDecimal.ZERO);
                totalRet = totalRet.add(s.getGpfRet() != null ? s.getGpfRet() : BigDecimal.ZERO);
            }
            result.put("subscriptions", subs);
            result.put("totalSubscription", totalSub);
            result.put("totalRefund", totalRet);

            // Application details
            BigDecimal numericId = resolveNumericId(persNumber);
            if (numericId != null) {
                List<GPFUsrDetails> usrDetails = gpfUsrDetailsRepository.findByPersno(numericId);
                if (!usrDetails.isEmpty()) {
                    GPFUsrDetails ud = usrDetails.get(0);
                    result.put("purpose", ud.getPurpose());
                    result.put("gpfType", ud.getGpfType());
                    result.put("applDate", ud.getApplDate());
                    result.put("applAmt", ud.getApplAmt());
                } else {
                    result.put("purpose", null);
                    result.put("gpfType", null);
                    result.put("applDate", null);
                    result.put("applAmt", null);
                }
            } else {
                result.put("purpose", null);
                result.put("gpfType", null);
                result.put("applDate", null);
                result.put("applAmt", null);
            }

            // Computed totals
            BigDecimal applAmt = result.get("applAmt") != null ? (BigDecimal) result.get("applAmt") : BigDecimal.ZERO;
            BigDecimal totalAvailable = latestClosing.add(totalSub).add(totalRet);
            BigDecimal balanceAfter = totalAvailable.subtract(applAmt);
            result.put("totalAvailable", totalAvailable);
            result.put("balanceAfterWithdrawal", balanceAfter);

            // GPF interest rate (standard 7.1%)
            BigDecimal interestRate = new BigDecimal("7.1");
            BigDecimal interest = latestClosing.multiply(interestRate)
                    .divide(new BigDecimal("100"), 2, RoundingMode.HALF_UP);
            result.put("interestRate", interestRate);
            result.put("interestAmount", interest);

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error generating calculation sheet: " + e.getMessage()));
        }
    }

    /**
     * Resolves the numeric users.id from a persNumber string like 'OFF001'.
     * GPF_USR_DETAILS.PERSNO stores the numeric users.id, not the string persNumber.
     */
    private BigDecimal resolveNumericId(String persNumber) {
        return userRepository.findByUserId(persNumber)
                .map(u -> new BigDecimal(u.getId()))
                .orElse(null);
    }
}
