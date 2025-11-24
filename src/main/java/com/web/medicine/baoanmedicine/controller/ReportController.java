package com.web.medicine.baoanmedicine.controller;

import com.web.medicine.baoanmedicine.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/reports")
public class ReportController {

    @Autowired
    private ReportService reportService;

    // API: GET /api/admin/reports/sales?start=...&end=...
    @GetMapping("/sales")
    public ResponseEntity<BigDecimal> getSalesRevenue(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {

        BigDecimal revenue = reportService.calculateTotalRevenue(start, end);
        return ResponseEntity.ok(revenue);
    }

    // API: GET /api/admin/reports/top-selling?limit=10
    @GetMapping("/top-selling")
    public ResponseEntity<Map<String, Long>> getTopSellingProducts(
            @RequestParam(defaultValue = "10") int limit) {

        Map<String, Long> topProducts = reportService.getTopSellingProducts(limit);
        return ResponseEntity.ok(topProducts);
    }
}