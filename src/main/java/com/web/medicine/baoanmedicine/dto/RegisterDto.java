package com.web.medicine.baoanmedicine.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterDto {
    @NotEmpty
    private String username;

    @NotEmpty
    @Size(min = 6)
    private String password;

    @NotEmpty
    @Email
    private String email;

    @NotEmpty
    private String fullName;
}