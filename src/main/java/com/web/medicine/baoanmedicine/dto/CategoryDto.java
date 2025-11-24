package com.web.medicine.baoanmedicine.dto;

import lombok.*;
import java.util.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoryDto {
    private Integer categoryId;
    private String name;
    private String description;
}
