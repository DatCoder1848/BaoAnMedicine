package com.web.medicine.baoanmedicine.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Data
public class UserDto {

    private String username;
    private String email;
    private String fullName;
    // --- THÊM MỚI: Trả về danh sách địa chỉ ---
    private List<AddressDto> addresses;
    private String phoneNumber;
    private LocalDateTime createdAt;
    private Set<String> roles;
}