package com.web.medicine.baoanmedicine.controller;

import com.web.medicine.baoanmedicine.dto.AddressDto;
import com.web.medicine.baoanmedicine.dto.UserDto;
import com.web.medicine.baoanmedicine.dto.UserUpdateDto;
import com.web.medicine.baoanmedicine.model.User;
import com.web.medicine.baoanmedicine.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    // Hàm ánh xạ Entity sang DTO
    // --- CẬP NHẬT HÀM MAP NÀY ---
    private UserDto mapToUserDto(User user) {
        UserDto dto = new UserDto();
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setFullName(user.getFullName());
        dto.setPhoneNumber(user.getPhoneNumber());
        // Đã xóa: dto.setAddress(...)

        dto.setCreatedAt(user.getCreatedAt());

        // Map Roles
        dto.setRoles(user.getRoles().stream()
                .map(role -> role.getName().name())
                .collect(Collectors.toSet()));

        // Map Addresses (Từ Entity -> DTO)
        if (user.getAddresses() != null) {
            dto.setAddresses(user.getAddresses().stream().map(addr -> new AddressDto(
                    addr.getId(),
                    addr.getRecipientName(),
                    addr.getPhoneNumber(),
                    addr.getSpecificAddress(),
                    addr.getCity(),
                    addr.getIsDefault(),
                    addr.getLabel()
            )).collect(Collectors.toList()));
        }

        return dto;
    }

    // Hàm lấy User hiện tại từ Security Context
    private User getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsernameOrEmail(username, username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
    }

    // API: GET /api/users/me (Lấy thông tin hồ sơ)
    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()") // Yêu cầu Token
    public ResponseEntity<UserDto> getCurrentUserInfo() {
        User user = getCurrentUser();
        return ResponseEntity.ok(mapToUserDto(user));
    }

    // API: PUT /api/users/me (Cập nhật hồ sơ)
    // --- CẬP NHẬT HÀM UPDATE ---
    @PutMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserDto> updateCurrentUser(@RequestBody UserUpdateDto updateDto) {
        User user = getCurrentUser();

        if (updateDto.getFullName() != null) user.setFullName(updateDto.getFullName());
        if (updateDto.getPhoneNumber() != null) user.setPhoneNumber(updateDto.getPhoneNumber());
        // Đã xóa dòng update address cũ

        User updatedUser = userRepository.save(user);
        return ResponseEntity.ok(mapToUserDto(updatedUser));
    }
}