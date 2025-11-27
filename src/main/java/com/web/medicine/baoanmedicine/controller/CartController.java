package com.web.medicine.baoanmedicine.controller;

import com.web.medicine.baoanmedicine.config.UserDetailsImpl;
import com.web.medicine.baoanmedicine.dto.AddItemToCartDTO;
import com.web.medicine.baoanmedicine.dto.response.CartResponseDTO;
import com.web.medicine.baoanmedicine.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired private CartService cartService;
    // LOẠI BỎ CartMapper ở đây vì Service đã trả về DTO rồi.

    // 1. Xem giỏ hàng
    @GetMapping
    public ResponseEntity<CartResponseDTO> getCart(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        Long userId = userDetails.getUserId();
        // Gọi hàm getCartResponse (trả về DTO) thay vì getCartByUser (trả về Entity)
        return ResponseEntity.ok(cartService.getCartResponse(userId));
    }

    // 2. Thêm vào giỏ
    @PostMapping("/add")
    public ResponseEntity<CartResponseDTO> addItemToCart(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestBody AddItemToCartDTO request) {
        Long userId = userDetails.getUserId();
        return ResponseEntity.ok(cartService.addOrUpdateItem(userId, request));
    }

    // 3. Cập nhật số lượng (API này BẠN ĐANG THIẾU trong file gửi)
    @PutMapping("/update")
    public ResponseEntity<CartResponseDTO> updateItemQuantity(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestParam Long productId,
            @RequestParam int quantity) {
        Long userId = userDetails.getUserId();
        return ResponseEntity.ok(cartService.updateItemQuantity(userId, productId, quantity));
    }

    // 4. Xóa
    @DeleteMapping("/remove/{productId}")
    public ResponseEntity<?> removeItemFromCart(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable Long productId) {
        Long userId = userDetails.getUserId();
        cartService.removeItem(userId, productId);
        return ResponseEntity.noContent().build();
    }
}