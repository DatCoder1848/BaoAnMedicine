package com.web.medicine.baoanmedicine.controller;

import com.web.medicine.baoanmedicine.dto.UserDto;
import com.web.medicine.baoanmedicine.dto.UserStatusUpdateDto;
import com.web.medicine.baoanmedicine.model.User;
import com.web.medicine.baoanmedicine.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
// Đảm bảo tất cả phương thức trong class này yêu cầu quyền ADMIN
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserRepository userRepository;

    // Hàm ánh xạ Entity sang DTO
    private UserDto mapToUserDto(User user) {
        UserDto dto = new UserDto();
        dto.setUserId(user.getUserId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setFullName(user.getFullName());
        dto.setAddress(user.getAddress());
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setCreatedAt(user.getCreatedAt());
        dto.setRoles(user.getRoles().stream()
                .map(role -> role.getName().name())
                .collect(Collectors.toSet()));
        return dto;
    }

    // API: GET /api/admin/users
    // Lấy danh sách toàn bộ người dùng
    @GetMapping("/users")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        List<User> users = userRepository.findAll();
        List<UserDto> userDtos = users.stream()
                .map(this::mapToUserDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(userDtos);
    }

    // API: PUT /api/admin/users/{id}/status
    // Khóa hoặc Mở khóa người dùng
    @PutMapping("/users/{id}/status")
    public ResponseEntity<String> updateUserStatus(@PathVariable Long id,
                                                   @RequestBody UserStatusUpdateDto statusDto) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found with id: " + id));

        // 1. Cập nhật trạng thái vào Entity
        // Lưu ý: Với Lombok và field 'boolean isActive', setter thường là 'setActive'
        user.setActive(statusDto.isActive());

        // 2. Lưu thay đổi xuống Database
        userRepository.save(user);

        String status = statusDto.isActive() ? "Mở khóa" : "Khóa";

        return ResponseEntity.ok("Người dùng " + user.getUsername() + " đã được " + status + " thành công.");
    }
}