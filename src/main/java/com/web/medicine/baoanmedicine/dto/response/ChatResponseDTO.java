package com.web.medicine.baoanmedicine.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class ChatResponseDTO {
    private String userMessage;
    private String botResponse;
    private String navigateUrl; // <-- THÊM MỚI: Link để chuyển trang
    private LocalDateTime timestamp;
}