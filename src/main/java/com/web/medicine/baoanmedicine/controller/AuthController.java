package com.web.medicine.baoanmedicine.controller;

import com.web.medicine.baoanmedicine.dto.LoginDto;
import com.web.medicine.baoanmedicine.dto.RegisterDto;
import com.web.medicine.baoanmedicine.dto.JwtAuthResponse;
import com.web.medicine.baoanmedicine.model.User;
import com.web.medicine.baoanmedicine.model.Role;
import com.web.medicine.baoanmedicine.model.RoleName;
import com.web.medicine.baoanmedicine.repository.RoleRepository;
import com.web.medicine.baoanmedicine.repository.UserRepository;
import com.web.medicine.baoanmedicine.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    // API: POST /api/auth/register (Giữ nguyên)
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterDto registerDto){

        if(userRepository.existsByUsername(registerDto.getUsername())){
            return new ResponseEntity<>("Username đã tồn tại!", HttpStatus.BAD_REQUEST);
        }
        if(userRepository.existsByEmail(registerDto.getEmail())){
            return new ResponseEntity<>("Email đã tồn tại!", HttpStatus.BAD_REQUEST);
        }

        User user = new User();
        user.setUsername(registerDto.getUsername());
        user.setEmail(registerDto.getEmail());
        user.setFullName(registerDto.getFullName());
        user.setPassword(passwordEncoder.encode(registerDto.getPassword()));

        Optional<Role> customerRole = roleRepository.findByName(RoleName.ROLE_CUSTOMER);
        if (customerRole.isEmpty()) {
            return new ResponseEntity<>("Lỗi hệ thống: Role CUSTOMER không tìm thấy. (Kiểm tra DataInitializer)", HttpStatus.INTERNAL_SERVER_ERROR);
        }
        user.setRoles(Collections.singleton(customerRole.get()));
        userRepository.save(user);

        return new ResponseEntity<>("Đăng ký thành công!", HttpStatus.CREATED);
    }

    // API: POST /api/auth/login
    @PostMapping("/login")
    public ResponseEntity<JwtAuthResponse> login(@RequestBody LoginDto loginDto){

        // 1. Xác thực người dùng
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginDto.getUsernameOrEmail(),
                        loginDto.getPassword()
                )
        );

        // 2. Thiết lập Context và tạo Token
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = tokenProvider.generateToken(authentication);

        // 3. Trả về Token
        return ResponseEntity.ok(new JwtAuthResponse(token, "Bearer"));
    }
}