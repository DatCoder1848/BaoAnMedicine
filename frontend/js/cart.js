function getCart() {
  try {
    const cart = localStorage.getItem("cart");
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    console.error("Lỗi khi đọc giỏ hàng:", error);
    return [];
  }
}

// Lưu giỏ hàng vào localStorage
function saveCart(cart) {
  try {
    localStorage.setItem("cart", JSON.stringify(cart));
  } catch (error) {
    console.error("Lỗi khi lưu giỏ hàng:", error);
  }
}

// Hiển thị giỏ hàng
function displayCart() {
  const cartBody = document.getElementById("cart-body");
  if (!cartBody) {
    console.error("Không tìm thấy cart-body");
    return;
  }

  const cart = getCart();

  if (cart.length === 0) {
    cartBody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align: center; padding: 40px;">
          <div style="font-size: 48px; margin-bottom: 16px;">🛒</div>
          <h3>Giỏ hàng trống</h3>
          <p>Bạn chưa có sản phẩm nào trong giỏ hàng.</p>
          <a href="products.html" class="continue-shopping" style="display: inline-block; margin-top: 16px;">
            ← Tiếp tục mua sắm
          </a>
        </td>
      </tr>
    `;
    updateCartCount();
    updateCartSummary();
    return;
  }

  cartBody.innerHTML = cart
    .map(
      (item, index) => `
        <tr class="cart-item" data-price="${item.price}" data-id="${item.id}">
          <td class="checkbox-cell">
            <input type="checkbox" class="item-checkbox" id="item-${index}" ${
        item.selected !== false ? "checked" : ""
      } />
          </td>
          <td>
            <div class="product-cell">
              <img src="${
                item.image ||
                "https://via.placeholder.com/60x60/4A90E2/FFFFFF?text=Ảnh"
              }" 
                   alt="${item.name}" 
                   width="60" height="60" 
                   loading="lazy"
                   onerror="this.src='https://via.placeholder.com/60x60/4A90E2/FFFFFF?text=Ảnh'" />
              <div class="product-info">
                <div class="product-title">${item.name}</div>
                <div class="product-meta">${item.unit || "Sản phẩm"}</div>
              </div>
            </div>
          </td>
          <td class="unit-price">${formatPrice(item.price)}</td>
          <td>
            <div class="quantity-cell">
              <div class="quantity-control">
                <button class="btn-qty minus" aria-label="Giảm số lượng">−</button>
                <input type="text" class="qty-input" value="${
                  item.quantity
                }" readonly />
                <button class="btn-qty plus" aria-label="Tăng số lượng">+</button>
              </div>
              <button type="button" class="remove-btn" aria-label="Xóa sản phẩm" title="Xóa sản phẩm">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            </div>
          </td>
          <td class="item-total">${formatPrice(item.price * item.quantity)}</td>
        </tr>
      `
    )
    .join("");

  attachCartEvents();
  updateCartCount();
  updateCartSummary();
}

// Định dạng giá
function formatPrice(price) {
  try {
    const numPrice = typeof price === "number" ? price : parseInt(price);
    if (isNaN(numPrice)) return "0 đ";
    return new Intl.NumberFormat("vi-VN").format(numPrice) + " đ";
  } catch (error) {
    console.error("Lỗi định dạng giá:", error);
    return "0 đ";
  }
}

// Gắn sự kiện cho giỏ hàng
function attachCartEvents() {
  // Xử lý số lượng sản phẩm
  document.querySelectorAll(".quantity-control").forEach((control) => {
    const input = control.querySelector(".qty-input");
    const plus = control.querySelector(".plus");
    const minus = control.querySelector(".minus");
    const item = control.closest(".cart-item");

    if (!item) return;

    const productId = parseInt(item.dataset.id);

    const updateCartQuantity = (newQuantity) => {
      const cart = getCart();
      const cartItem = cart.find((item) => item.id === productId);
      if (cartItem) {
        cartItem.quantity = newQuantity;
        saveCart(cart);
        updateCartCount();
      }
    };

    plus?.addEventListener("click", () => {
      const newQuantity = parseInt(input.value) + 1;
      input.value = newQuantity;
      updateCartQuantity(newQuantity);
      updateItemTotal(item);
      updateCartSummary();
    });

    minus?.addEventListener("click", () => {
      const newQuantity = parseInt(input.value) - 1;
      if (newQuantity >= 1) {
        input.value = newQuantity;
        updateCartQuantity(newQuantity);
        updateItemTotal(item);
        updateCartSummary();
      }
    });
  });

  // Xử lý xóa sản phẩm
  document.querySelectorAll(".remove-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const item = this.closest(".cart-item");
      if (!item) return;

      const productId = parseInt(item.dataset.id);
      const cart = getCart();
      const updatedCart = cart.filter((item) => item.id !== productId);
      saveCart(updatedCart);

      item.style.opacity = "0";
      setTimeout(() => {
        displayCart();
      }, 300);
    });
  });

  // Xử lý checkbox
  const selectAllCheckbox = document.getElementById("select-all");
  const itemCheckboxes = document.querySelectorAll(".item-checkbox");

  selectAllCheckbox?.addEventListener("change", function () {
    const isChecked = this.checked;
    itemCheckboxes.forEach((checkbox) => {
      checkbox.checked = isChecked;
    });

    // Cập nhật trạng thái selected trong cart
    const cart = getCart();
    cart.forEach((item, index) => {
      if (itemCheckboxes[index]) {
        item.selected = isChecked;
      }
    });
    saveCart(cart);

    updateCartSummary();
  });

  itemCheckboxes.forEach((checkbox, index) => {
    checkbox.addEventListener("change", function () {
      const cart = getCart();
      if (cart[index]) {
        cart[index].selected = this.checked;
        saveCart(cart);
      }

      const allChecked = Array.from(itemCheckboxes).every((cb) => cb.checked);
      if (selectAllCheckbox) {
        selectAllCheckbox.checked = allChecked;
      }
      updateCartSummary();
    });
  });
}

// Cập nhật tổng tiền cho từng sản phẩm
function updateItemTotal(item) {
  const price = parseInt(item.dataset.price);
  const quantity = parseInt(item.querySelector(".qty-input").value);
  const totalElement = item.querySelector(".item-total");
  if (totalElement) {
    totalElement.textContent = formatPrice(price * quantity);
  }
}

// Cập nhật tổng giỏ hàng
function updateCartSummary() {
  let subtotal = 0;
  let selectedCount = 0;
  const cart = getCart();

  document.querySelectorAll(".cart-item").forEach((item, index) => {
    const checkbox = item.querySelector(".item-checkbox");
    if (checkbox?.checked && index < cart.length) {
      const cartItem = cart[index];
      subtotal += cartItem.price * cartItem.quantity;
      selectedCount++;
    }
  });

  const shipping = 20000;
  const discount = 0;
  const grandTotal = subtotal + shipping - discount;

  const selectedCountElement = document.getElementById("selected-count");
  const subtotalElement = document.getElementById("subtotal");
  const grandTotalElement = document.getElementById("grand-total");

  if (selectedCountElement) {
    selectedCountElement.textContent = `${selectedCount} sản phẩm`;
  }
  if (subtotalElement) {
    subtotalElement.textContent = formatPrice(subtotal);
  }
  if (grandTotalElement) {
    grandTotalElement.textContent = formatPrice(grandTotal);
  }
}

// Cập nhật số lượng sản phẩm trong giỏ hàng
// Định dạng giá
function formatPrice(price) {
  try {
    const numPrice = typeof price === "number" ? price : parseInt(price);
    if (isNaN(numPrice)) return "0đ";

    return (
      new Intl.NumberFormat("vi-VN").format(numPrice).replace(/\s/g, "") + "đ"
    );
  } catch (error) {
    console.error("Lỗi định dạng giá:", error);
    return "0đ";
  }
}

// Hàm lấy sản phẩm đề xuất
function getCartRecommendations() {
  const cartItems = getCart();
  let availableProducts = [];

  if (typeof products !== "undefined" && Array.isArray(products)) {
    availableProducts = products;
  } else {
    availableProducts = getFallbackRecommendations();
  }

  // Lọc bỏ sản phẩm đã có trong giỏ hàng
  const recommendations = availableProducts.filter(
    (product) => !cartItems.some((cartItem) => cartItem.id === product.id)
  );

  return recommendations.slice(0, 6);
}

// Hàm lấy sản phẩm dự phòng
function getFallbackRecommendations() {
  return [
    {
      id: 9,
      name: "Thuốc bôi Tinfozol điều trị nhiễm trùng da, viêm da",
      price: 95000,
      category: "Thuốc",
      image: "assets/img/product9.jpg",
    },
    {
      id: 10,
      name: "Kem chống nắng dạng sữa SPF 50+ PA++++",
      price: 400000,
      category: "Mỹ phẩm",
      image: "assets/img/product10.jpg",
    },
    {
      id: 11,
      name: "Dầu gió xanh nguyên chất (Chai 20ml)",
      price: 35000,
      category: "Thuốc",
      image: "assets/img/product11.jpg",
    },
    {
      id: 12,
      name: "Băng cá nhân không thấm nước bảo vệ vết thương",
      price: 55000,
      category: "Vật tư y tế",
      image: "assets/img/product12.jpg",
    },
  ];
}

// Hàm render sản phẩm đề xuất
function renderRecommendedProducts() {
  const recommendedContainer = document.getElementById("recommended-products");
  if (!recommendedContainer) return;

  const recommendedProducts = getCartRecommendations();

  if (!recommendedProducts || recommendedProducts.length === 0) {
    const recommendedSection = document.querySelector(".recommended-section");
    if (recommendedSection) {
      recommendedSection.style.display = "none";
    }
    return;
  }

  try {
    recommendedContainer.innerHTML = recommendedProducts
      .map(
        (product) => `
        <div class="product-card" data-product-id="${product.id}">
          <img src="${
            product.image ||
            product.image_url ||
            product.img ||
            "https://via.placeholder.com/300x300/4A90E2/FFFFFF?text=Ảnh"
          }" 
               alt="${product.name}" 
               class="product-image"
               onerror="this.src='https://via.placeholder.com/300x300/4A90E2/FFFFFF?text=Ảnh'" />
          <div class="product-details">
            <div class="product-category">${
              product.category || "Danh mục"
            }</div>
            <h3 class="product-name">${product.name || "Sản phẩm"}</h3>
            <div class="product-price">${formatPrice(product.price)}</div>
            <button class="add-to-cart-btn" onclick="addToCartFromRecommendation(${
              product.id
            })">
              Thêm vào giỏ
            </button>
          </div>
        </div>
      `
      )
      .join("");

    setTimeout(initCarousel, 100);
  } catch (error) {
    console.error("Lỗi khi render sản phẩm đề xuất:", error);
  }
}

// Hàm thêm vào giỏ từ sản phẩm đề xuất
window.addToCartFromRecommendation = function (productId) {
  addToCart(productId);
  showAddToCartMessage("Đã thêm sản phẩm vào giỏ hàng!");
  updateCartCount();
  updateCartSummary();
  setTimeout(renderRecommendedProducts, 100);
};

// Hàm thêm vào giỏ hàng
function addToCart(productId) {
  let product;

  if (typeof products !== "undefined") {
    product = products.find((p) => p.id === productId);
  }

  if (!product) {
    const fallbackProducts = getFallbackRecommendations();
    product = fallbackProducts.find((p) => p.id === productId);
  }

  if (!product) {
    console.error("Không tìm thấy sản phẩm với ID:", productId);
    return;
  }

  addToCartWithProduct(product);
}

// Hàm thêm sản phẩm vào giỏ
function addToCartWithProduct(product) {
  const cart = getCart();
  const existingItem = cart.find((item) => item.id === product.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.category,
      image: product.image || product.image_url,
      unit: product.unit || "Sản phẩm",
      quantity: 1,
      selected: true,
    });
  }

  saveCart(cart);
  displayCart();
}

// Hàm hiển thị thông báo
function showAddToCartMessage(message) {
  const existingToast = document.querySelector(".add-to-cart-toast");
  if (existingToast) {
    existingToast.remove();
  }

  const toast = document.createElement("div");
  toast.className = "add-to-cart-toast";
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(100px)";
    setTimeout(() => {
      if (toast.parentNode) {
        document.body.removeChild(toast);
      }
    }, 300);
  }, 2000);
}

// Xử lý thanh trượt sản phẩm đề xuất
function initCarousel() {
  const carouselTrack = document.querySelector(".carousel-track");
  const prevBtn = document.querySelector(".prev-btn");
  const nextBtn = document.querySelector(".next-btn");
  const productCards = document.querySelectorAll(".product-card");

  if (!carouselTrack || productCards.length === 0) return;

  let currentPosition = 0;
  const cardWidth = productCards[0].offsetWidth + 20;
  const visibleCards = Math.floor(
    document.querySelector(".products-carousel").offsetWidth / cardWidth
  );
  const maxPosition = Math.max(
    0,
    (productCards.length - visibleCards) * cardWidth
  );

  function updateCarouselButtons() {
    if (prevBtn) prevBtn.disabled = currentPosition === 0;
    if (nextBtn) nextBtn.disabled = currentPosition >= maxPosition;
  }

  prevBtn?.addEventListener("click", () => {
    if (currentPosition > 0) {
      currentPosition = Math.max(0, currentPosition - cardWidth);
      carouselTrack.style.transform = `translateX(-${currentPosition}px)`;
      updateCarouselButtons();
    }
  });

  nextBtn?.addEventListener("click", () => {
    if (currentPosition < maxPosition) {
      currentPosition = Math.min(maxPosition, currentPosition + cardWidth);
      carouselTrack.style.transform = `translateX(-${currentPosition}px)`;
      updateCarouselButtons();
    }
  });

  updateCarouselButtons();
}

// Xử lý nút thanh toán
function initCheckoutButton() {
  const checkoutBtn = document.querySelector(".checkout-btn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", function () {
      const selectedItems = document.querySelectorAll(".item-checkbox:checked");
      const cart = getCart();

      if (selectedItems.length === 0 || cart.length === 0) {
        alert("Vui lòng chọn ít nhất một sản phẩm để thanh toán!");
        return;
      }

      let totalAmount = 0;
      const selectedProducts = [];

      document.querySelectorAll(".cart-item").forEach((item, index) => {
        const checkbox = item.querySelector(".item-checkbox");
        if (checkbox?.checked && index < cart.length) {
          const cartItem = cart[index];
          totalAmount += cartItem.price * cartItem.quantity;
          selectedProducts.push(cartItem);
        }
      });

      const shippingFee = 20000;
      totalAmount += shippingFee;

      localStorage.setItem("checkoutTotal", totalAmount.toString());
      localStorage.setItem(
        "selectedProducts",
        JSON.stringify(selectedProducts)
      );

      window.location.href = "checkout.html";
    });
  }
}

if (!document.querySelector("style[data-cart-toast]")) {
  const style = document.createElement("style");
  style.setAttribute("data-cart-toast", "true");
  style.textContent = `
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    
    .add-to-cart-toast {
      position: fixed;
      top: 100px;
      right: 20px;
      background: var(--primary);
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      z-index: 1000;
      animation: slideIn 0.3s ease;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      font-weight: 500;
      transition: opacity 0.3s, transform 0.3s;
    }
  `;
  document.head.appendChild(style);
}

// Khởi tạo khi trang được tải
document.addEventListener("DOMContentLoaded", function () {
  displayCart();
  renderRecommendedProducts();
  initCheckoutButton();

  window.addEventListener("resize", initCarousel);
});
