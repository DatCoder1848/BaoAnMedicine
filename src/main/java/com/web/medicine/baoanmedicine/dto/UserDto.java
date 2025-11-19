package com.web.medicine.baoanmedicine.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.Set;

@Data
public class UserDto {
    private Long userId;
    private String username;
    private String email;
    private String fullName;
    private String address;
    private String phoneNumber;
    private LocalDateTime createdAt;
    private Set<String> roles;
}