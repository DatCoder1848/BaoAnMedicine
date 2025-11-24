package com.web.medicine.baoanmedicine.service;

import com.web.medicine.baoanmedicine.repository.ReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ReportService {

    @Autowired
    private ReportRepository reportRepository;

    // 1. Lấy Tổng doanh thu
    public BigDecimal calculateTotalRevenue(LocalDateTime startDate, LocalDateTime endDate) {
        return reportRepository.getTotalRevenueByPeriod(startDate, endDate);
    }

    // 2. Lấy Top 10 sản phẩm bán chạy nhất
    public Map<String, Long> getTopSellingProducts(int limit) {
        // Sử dụng PageRequest để giới hạn số lượng (limit)
        List<Object[]> results = reportRepository.findTopSellingProducts(PageRequest.of(0, limit));

        return results.stream().collect(Collectors.toMap(
                array -> (String) array[0],          // Tên sản phẩm
                array -> (Long) array[1]             // Tổng số lượng bán
        ));
    }

    // 3. Lấy Báo cáo Tình trạng Đơn hàng (Cần query riêng trong ReportRepository)
    // Ví dụ: SELECT o.status, COUNT(o) FROM Order o GROUP BY o.status
}