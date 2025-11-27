package com.web.medicine.baoanmedicine.controller;

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
    private UserDto mapToUserDto(User user) {
        UserDto dto = new UserDto();
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setFullName(user.getFullName());
        dto.setAddress(user.getAddress());
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setCreatedAt(user.getCreatedAt());
        // Lấy tên Role
        dto.setRoles(user.getRoles().stream()
                .map(role -> role.getName().name())
                .collect(Collectors.toSet()));
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
    @PutMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserDto> updateCurrentUser(@RequestBody UserUpdateDto updateDto) {
        User user = getCurrentUser();

        // Cập nhật thông tin từ DTO
        if (updateDto.getFullName() != null) user.setFullName(updateDto.getFullName());
        if (updateDto.getAddress() != null) user.setAddress(updateDto.getAddress());
        if (updateDto.getPhoneNumber() != null) user.setPhoneNumber(updateDto.getPhoneNumber());

        User updatedUser = userRepository.save(user);

        return ResponseEntity.ok(mapToUserDto(updatedUser));
    }
}