package com.web.medicine.baoanmedicine.service;

import com.web.medicine.baoanmedicine.dto.AddItemToCartDTO;
import com.web.medicine.baoanmedicine.dto.response.CartResponseDTO;
import com.web.medicine.baoanmedicine.model.Cart;
import com.web.medicine.baoanmedicine.model.CartItem;
import com.web.medicine.baoanmedicine.model.Product;
import com.web.medicine.baoanmedicine.model.User;
import com.web.medicine.baoanmedicine.repository.CartItemRepository;
import com.web.medicine.baoanmedicine.repository.CartRepository;
import com.web.medicine.baoanmedicine.utils.mapper.CartMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class CartService {

    @Autowired private CartRepository cartRepository;
    @Autowired private CartItemRepository cartItemRepository;
    @Autowired private CartMapper cartMapper;
    @Autowired private ProductService productService;
    @Autowired private UserService userService;

    // THÊM MỚI: Cần InventoryService để check tồn kho thực tế
    @Autowired private InventoryService inventoryService;

    // 1. Lấy Giỏ hàng
    public CartResponseDTO getCartResponse(Long userId) {
        Cart cart = getCartByUser(userId);
        return cartMapper.toCartResponseDto(cart);
    }

    // 2. Thêm/Cập nhật
    @Transactional
    public CartResponseDTO addOrUpdateItem(Long userId, AddItemToCartDTO request) {
        Cart cart = getCartByUser(userId);

        // Sửa: Dùng findById chuẩn của JPA
        Product product = productService.findByProductId(request.getProductId());

        Optional<CartItem> existingItemOpt = cartItemRepository
                .findByCart_CartIdAndProduct_ProductId(cart.getCartId(), product.getProductId());

        int quantityToAdd = request.getQuantity();
        int currentTotal = existingItemOpt.map(CartItem::getQuantity).orElse(0);
        int requestedTotal = currentTotal + quantityToAdd;

        // --- SỬA LOGIC CHECK TỒN KHO ---
        // Không dùng product.getStockQuantity() nữa
        int realStock = inventoryService.getRealStock(product.getProductId());

        if (requestedTotal > realStock) {
            throw new RuntimeException("Lỗi: Sản phẩm " + product.getName() + " chỉ còn " + realStock + " sản phẩm.");
        }
        // -------------------------------

        if (existingItemOpt.isPresent()) {
            CartItem item = existingItemOpt.get();
            item.setQuantity(requestedTotal);
            cartItemRepository.save(item);
        } else {
            CartItem newItem = new CartItem();
            newItem.setCart(cart);
            newItem.setProduct(product);
            newItem.setQuantity(quantityToAdd);
            newItem.setPriceAtAddition(product.getPrice());
            cartItemRepository.save(newItem);
            cart.getCartItems().add(newItem);
        }

        cart.setLastUpdated(LocalDateTime.now());
        Cart updatedCart = cartRepository.save(cart);
        return cartMapper.toCartResponseDto(updatedCart);
    }

    // 3. Cập nhật trực tiếp
    @Transactional
    public CartResponseDTO updateItemQuantity(Long userId, Long productId, int newQuantity) {
        if (newQuantity <= 0) {
            removeItem(userId, productId);
            return getCartResponse(userId);
        }

        Cart cart = getCartByUser(userId);
        CartItem item = cartItemRepository
                .findByCart_CartIdAndProduct_ProductId(cart.getCartId(), productId)
                .orElseThrow(() -> new RuntimeException("Lỗi: Sản phẩm không có trong giỏ hàng."));

        // --- SỬA LOGIC CHECK TỒN KHO ---
        int realStock = inventoryService.getRealStock(productId);
        if (newQuantity > realStock) {
            throw new RuntimeException("Lỗi: Tồn kho hiện tại không đủ số lượng " + newQuantity);
        }
        // -------------------------------

        item.setQuantity(newQuantity);
        cartItemRepository.save(item);

        cart.setLastUpdated(LocalDateTime.now());
        Cart updatedCart = cartRepository.save(cart);
        return cartMapper.toCartResponseDto(updatedCart);
    }

    // 4. Xóa item (Giữ nguyên)
    @Transactional
    public void removeItem(Long userId, Long productId) {
        Cart cart = getCartByUser(userId);
        cart.getCartItems().removeIf(item -> {
            if (item.getProduct().getProductId().equals(productId)) {
                cartItemRepository.delete(item);
                return true;
            }
            return false;
        });
        cart.setLastUpdated(LocalDateTime.now());
        cartRepository.save(cart);
    }

    // 5. Clear Cart (Giữ nguyên)
    @Transactional
    public void clearCart(Cart cart) {
        cartItemRepository.deleteAll(cart.getCartItems());
        cart.getCartItems().clear();
        cart.setLastUpdated(LocalDateTime.now());
        cartRepository.save(cart);
    }

    // Private helpers
    public Cart getCartByUser(Long userId) {
        return cartRepository.findByUser_UserId(userId)
                .orElseGet(() -> createNewCart(userId));
    }

    private Cart createNewCart(Long userId) {
        // Dùng userService thay vì inject trực tiếp repository để đảm bảo logic tập trung
        User user = userService.getUserById(userId);
        Cart newCart = new Cart();
        newCart.setUser(user);
        newCart.setLastUpdated(LocalDateTime.now());
        return cartRepository.save(newCart);
    }
}