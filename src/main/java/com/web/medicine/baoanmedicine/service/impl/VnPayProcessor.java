package com.web.medicine.baoanmedicine.service.impl;

import com.web.medicine.baoanmedicine.config.VnPayConfig;
import com.web.medicine.baoanmedicine.utils.PaymentProcessor;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

@Component("VNPAY") // Tên này phải trùng khớp với chuỗi Frontend gửi lên
public class VnPayProcessor implements PaymentProcessor {

    @Override
    public boolean processPayment(BigDecimal amount, String paymentDetails) {
        // VNPAY Logic ở đây thường là tạo URL để redirect.
        // Nhưng vì Interface hiện tại trả về boolean, ta sẽ:
        // 1. In URL ra console (để bạn copy test nếu cần).
        // 2. Trả về true để Đơn hàng được tạo thành công (trạng thái PENDING).
        // 3. Frontend sẽ tự điều hướng người dùng dựa trên logic riêng (hoặc ta nâng cấp DTO sau).

        try {
            String vnp_Version = "2.1.0";
            String vnp_Command = "pay";
            String vnp_OrderInfo = "Thanh toan don hang BaoAnMedicine";
            String orderType = "other";
            String vnp_TxnRef = VnPayConfig.getRandomNumber(8);
            String vnp_IpAddr = "127.0.0.1"; // Hardcode IP local
            String vnp_TmnCode = VnPayConfig.vnp_TmnCode;

            // Số tiền (VNPAY yêu cầu nhân 100)
            long amountVal = amount.multiply(BigDecimal.valueOf(100)).longValue();

            Map<String, String> vnp_Params = new HashMap<>();
            vnp_Params.put("vnp_Version", vnp_Version);
            vnp_Params.put("vnp_Command", vnp_Command);
            vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
            vnp_Params.put("vnp_Amount", String.valueOf(amountVal));
            vnp_Params.put("vnp_CurrCode", "VND");
            vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
            vnp_Params.put("vnp_OrderInfo", vnp_OrderInfo);
            vnp_Params.put("vnp_OrderType", orderType);
            vnp_Params.put("vnp_Locale", "vn");
            vnp_Params.put("vnp_ReturnUrl", VnPayConfig.vnp_ReturnUrl);
            vnp_Params.put("vnp_IpAddr", vnp_IpAddr);

            Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
            SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
            String vnp_CreateDate = formatter.format(cld.getTime());
            vnp_Params.put("vnp_CreateDate", vnp_CreateDate);

            cld.add(Calendar.MINUTE, 15);
            String vnp_ExpireDate = formatter.format(cld.getTime());
            vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

            // Build URL
            List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
            Collections.sort(fieldNames);
            StringBuilder hashData = new StringBuilder();
            StringBuilder query = new StringBuilder();
            Iterator<String> itr = fieldNames.iterator();
            while (itr.hasNext()) {
                String fieldName = itr.next();
                String fieldValue = vnp_Params.get(fieldName);
                if ((fieldValue != null) && (fieldValue.length() > 0)) {
                    //Build hash data
                    hashData.append(fieldName);
                    hashData.append('=');
                    hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                    //Build query
                    query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString()));
                    query.append('=');
                    query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                    if (itr.hasNext()) {
                        query.append('&');
                        hashData.append('&');
                    }
                }
            }
            String queryUrl = query.toString();
            String vnp_SecureHash = VnPayConfig.hmacSHA512(VnPayConfig.vnp_HashSecret, hashData.toString());
            queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;
            String paymentUrl = VnPayConfig.vnp_PayUrl + "?" + queryUrl;

            // --- QUAN TRỌNG ---
            // Hiện tại chúng ta chỉ in ra Console.
            // Để Frontend chuyển hướng, ta cần trả URL này về trong OrderResponseDTO.
            // Nhưng để fix lỗi 403/500 ngay lập tức, ta cứ để nó chạy thành công đã.
            System.out.println("🔗 VNPAY PAYMENT URL: " + paymentUrl);

            return true;

        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    @Override
    public String getPaymentMethodName() {
        return "VNPAY";
    }
}