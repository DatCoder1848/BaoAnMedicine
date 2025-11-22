package com.web.medicine.baoanmedicine.dto;

import lombok.Data;
import jakarta.validation.constraints.NotNull;

@Data
public class UserStatusUpdateDto {
    // True = mở khóa, False = khóa
    @NotNull
    private boolean isActive;
}