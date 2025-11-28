package com.web.medicine.baoanmedicine.controller;

import com.web.medicine.baoanmedicine.config.UserDetailsImpl;
import com.web.medicine.baoanmedicine.dto.AddressDto;
import com.web.medicine.baoanmedicine.service.AddressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users/addresses")
public class AddressController {

    @Autowired private AddressService addressService;

    // GET: Lấy danh sách
    @GetMapping
    public ResponseEntity<List<AddressDto>> getMyAddresses(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(addressService.getAddressesByUserId(userDetails.getUserId()));
    }

    // POST: Thêm mới
    @PostMapping
    public ResponseEntity<AddressDto> addAddress(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestBody AddressDto addressDto) {
        return ResponseEntity.ok(addressService.addAddress(userDetails.getUserId(), addressDto));
    }

    // PUT: Set mặc định
    @PutMapping("/{id}/default")
    public ResponseEntity<?> setDefault(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable Long id) {
        addressService.setDefaultAddress(userDetails.getUserId(), id);
        return ResponseEntity.ok("Đã thiết lập địa chỉ mặc định.");
    }

    // DELETE: Xóa
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAddress(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable Long id) {
        addressService.deleteAddress(userDetails.getUserId(), id);
        return ResponseEntity.noContent().build();
    }
}