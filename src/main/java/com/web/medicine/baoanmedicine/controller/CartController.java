package com.web.medicine.baoanmedicine.controller;

import com.web.medicine.baoanmedicine.config.UserDetailsImpl;
import com.web.medicine.baoanmedicine.dto.AddItemToCartDTO;
import com.web.medicine.baoanmedicine.dto.response.CartResponseDTO;
import com.web.medicine.baoanmedicine.model.Cart;
import com.web.medicine.baoanmedicine.service.CartService;
import com.web.medicine.baoanmedicine.utils.mapper.CartMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired private CartService cartService;
    @Autowired private CartMapper cartMapper; // Tiêm Mapper vào

    // Dành cho GET /api/cart [AUTH]
    @GetMapping
    public ResponseEntity<CartResponseDTO> getCart(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        Long userId = userDetails.getUserId();
        Cart cart = cartService.getCartByUser(userId);

        // SỬ DỤNG MAPPER TRƯỚC KHI TRẢ VỀ
        return ResponseEntity.ok(cartMapper.toCartResponseDto(cart));
    }

    // Dành cho POST /api/cart/add [AUTH]
    @PostMapping("/add")
    public ResponseEntity<CartResponseDTO> addItemToCart(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestBody AddItemToCartDTO request) {
        Long userId = userDetails.getUserId();
        CartResponseDTO updatedCart = cartService.addOrUpdateItem(userId, request);

        return ResponseEntity.ok(updatedCart);
    }

    // Dành cho DELETE /api/cart/remove/{productId} [AUTH]
    @DeleteMapping("/remove/{productId}")
    public ResponseEntity<?> removeItemFromCart(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable Long productId) {
        Long userId = userDetails.getUserId();
        cartService.removeItem(userId, productId);
        return ResponseEntity.noContent().build();
    }
}