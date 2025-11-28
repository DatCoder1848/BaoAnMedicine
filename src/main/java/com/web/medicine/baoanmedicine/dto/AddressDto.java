package com.web.medicine.baoanmedicine.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AddressDto {
    private Long id;
    private String recipientName;
    private String phoneNumber;
    private String specificAddress;
    private String city;
    private Boolean isDefault;
    private String label;
}