package com.web.medicine.baoanmedicine.service;

import com.web.medicine.baoanmedicine.dto.AddItemToCartDTO;
import com.web.medicine.baoanmedicine.dto.response.CartResponseDTO; // DTO đầu ra mới
import com.web.medicine.baoanmedicine.model.Cart;
import com.web.medicine.baoanmedicine.model.CartItem;
import com.web.medicine.baoanmedicine.model.Product;
import com.web.medicine.baoanmedicine.model.User;
import com.web.medicine.baoanmedicine.repository.CartItemRepository;
import com.web.medicine.baoanmedicine.repository.CartRepository;
import com.web.medicine.baoanmedicine.repository.UserRepository;
import com.web.medicine.baoanmedicine.utils.mapper.CartMapper; // Mapper mới
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class CartService {

    @Autowired private CartRepository cartRepository;
    @Autowired private CartItemRepository cartItemRepository;

    // TIÊM MAPPER VÀO SERVICE
    @Autowired private CartMapper cartMapper;

    // Cần có Mock Interface/Service thật của Minh
    @Autowired private ProductService productService;

    // Cần có Mock Interface/Service thật của Vân
    @Autowired private UserService userService;
    @Autowired
    private UserRepository userRepository;

    // --- CÁC HÀM CÔNG KHAI (PUBLIC METHODS) ---

    // 1. Lấy Giỏ hàng của User hiện tại (GET /api/cart) - Trả về DTO
    public CartResponseDTO getCartResponse(Long userId) {
        // Lấy Entity Cart
        Cart cart = cartRepository.findByUserId(userId)
                .orElseGet(() -> createNewCart(userId));

        // Chuyển Entity sang DTO để trả về Controller
        return cartMapper.toCartResponseDto(cart);
    }

    // 2. Thêm hoặc Cập nhật số lượng (dùng cho POST /api/cart/add) - Trả về DTO
    @Transactional
    public CartResponseDTO addOrUpdateItem(Long userId, AddItemToCartDTO request) {
        Cart cart = getCartByUser(userId);

        Product product = productService.findByProductId(request.getProductId());

        // **LOGIC CHÍNH: Kiểm tra tồn kho và thêm/cập nhật**
        Optional<CartItem> existingItemOpt = cartItemRepository
                .findByCart_CartIdAndProduct_ProductId(cart.getCartId(), product.getProductId());

        int quantityToAdd = request.getQuantity();
        int currentTotal = existingItemOpt.map(CartItem::getQuantity).orElse(0);
        int requestedTotal = currentTotal + quantityToAdd;

        if (requestedTotal > product.getStockQuantity()) {
            throw new RuntimeException("Lỗi: Không đủ tồn kho cho sản phẩm " + product.getName() + ".");
        }

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

        // Chuyển Entity sang DTO để trả về Controller
        return cartMapper.toCartResponseDto(updatedCart);
    }

    // 3. Cập nhật số lượng TRỰC TIẾP (dùng cho PUT /api/cart/update) - Trả về DTO
    @Transactional
    public CartResponseDTO updateItemQuantity(Long userId, Long productId, int newQuantity) {
        if (newQuantity <= 0) {
            removeItem(userId, productId);
            // Sau khi xóa, lấy lại giỏ hàng và chuyển sang DTO
            return getCartResponse(userId);
        }

        Cart cart = getCartByUser(userId);
        CartItem item = cartItemRepository
                .findByCart_CartIdAndProduct_ProductId(cart.getCartId(), productId)
                .orElseThrow(() -> new RuntimeException("Lỗi: Sản phẩm không có trong giỏ hàng."));

        Product product = item.getProduct();

        if (newQuantity > product.getStockQuantity()) {
            throw new RuntimeException("Lỗi: Tồn kho hiện tại không đủ số lượng " + newQuantity);
        }

        item.setQuantity(newQuantity);
        cartItemRepository.save(item);

        cart.setLastUpdated(LocalDateTime.now());
        Cart updatedCart = cartRepository.save(cart);

        // Chuyển Entity sang DTO để trả về Controller
        return cartMapper.toCartResponseDto(updatedCart);
    }

    // 4. Xóa sản phẩm khỏi giỏ (DELETE /api/cart/remove/{productId})
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

        // Lưu ý: Hàm này trả về void (HTTP 204 No Content) nên không cần trả về DTO
    }

    // 5. Xóa toàn bộ giỏ hàng (Cần thiết cho OrderService sau khi Checkout)
    @Transactional
    public void clearCart(Cart cart) {
        cartItemRepository.deleteAll(cart.getCartItems());
        cart.getCartItems().clear();
        cart.setLastUpdated(LocalDateTime.now());
        cartRepository.save(cart);
    }

    // --- CÁC HÀM HỖ TRỢ NỘI BỘ (PRIVATE METHODS) ---

    // Hàm hỗ trợ: Lấy Entity Cart (vẫn cần Entity cho logic nghiệp vụ)
    public Cart getCartByUser(Long userId) {
        // Hàm này vẫn trả về Entity để phục vụ cho logic nghiệp vụ nội bộ
        return cartRepository.findByUserId(userId)
                .orElseGet(() -> createNewCart(userId));
    }

    // Hàm hỗ trợ: tạo Giỏ hàng mới
    private Cart createNewCart(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Lỗi: Người dùng không tồn tại."));
        Cart newCart = new Cart();
        newCart.setUser(user);
        newCart.setLastUpdated(LocalDateTime.now());
        return cartRepository.save(newCart);
    }
}